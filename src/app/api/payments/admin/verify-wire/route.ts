import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import ReceiptPDF from '@/components/portal/pdf/ReceiptPDF';
import type { VerifyWireRequest } from '@/types/payments';

// POST /api/payments/admin/verify-wire
// Admin approves or rejects a pending wire payment
export async function POST(request: NextRequest) {
    const supabase = await createServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin/Finance guard
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || !['ADMIN', 'REGISTRAR', 'FINANCE_OFFICER'].includes(profile.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body: VerifyWireRequest = await request.json();
    const { paymentId, action, adminNotes } = body;

    if (!paymentId || !action || !adminNotes?.trim()) {
        return NextResponse.json({ error: 'paymentId, action, and adminNotes are required' }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
        return NextResponse.json({ error: 'action must be approve or reject' }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Fetch the full payment record with application context
    const { data: payment, error: fetchError } = await adminClient
        .from('tuition_payments')
        .select(`
            *,
            application:applications(
                *,
                course:Course(*, school:School(*)),
                user:profiles(*)
            )
        `)
        .eq('id', paymentId)
        .eq('status', 'pending_admin_verification')
        .single();

    if (fetchError || !payment) {
        return NextResponse.json({ error: 'Payment not found or not pending verification' }, { status: 404 });
    }

    const now = new Date().toISOString();

    if (action === 'approve') {
        // 1. Mark payment as COMPLETED
        const { error: updateError } = await supabase
            .from('tuition_payments')
            .update({
                status: 'COMPLETED',
                admin_verified_by: user.id,
                admin_verified_at: now,
                admin_notes: adminNotes,
            })
            .eq('id', paymentId);

        if (updateError) {
            console.error('[verify-wire] payment update error:', updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        // 2. Update application status to ENROLLED
        await supabase
            .from('applications')
            .update({ status: 'ENROLLED' })
            .eq('id', payment.application_id);

        // 3. Generate PDF receipt using the existing ReceiptPDF component
        let receiptUrl: string | null = null;
        try {
            const pdfBuffer = Buffer.from(
                await renderToBuffer(
                    React.createElement(ReceiptPDF, {
                        application: payment.application,
                        payment: { ...payment, status: 'COMPLETED' },
                    }) as any
                )
            );

            const fileName = `receipt-${payment.transaction_reference}.pdf`;
            const storagePath = `student-documents/${payment.application.user_id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('application-documents')
                .upload(storagePath, pdfBuffer, { contentType: 'application/pdf', upsert: true });

            if (!uploadError) {
                const { data: { publicUrl } } = supabase.storage
                    .from('application-documents')
                    .getPublicUrl(storagePath);
                receiptUrl = publicUrl;

                // 4. Upsert document record
                const { data: student } = await supabase
                    .from('students')
                    .select('id')
                    .eq('user_id', payment.application.user_id)
                    .maybeSingle();

                if (student) {
                    await supabase.from('document_records').upsert(
                        {
                            student_id: student.id,
                            document_type: 'tuition_receipt',
                            title: `Tuition Receipt — ${payment.transaction_reference}`,
                            programme: payment.application.course?.title ?? '',
                            status: 'issued',
                            storage_path: publicUrl,
                            is_official: true,
                            is_student_visible: true,
                            issue_date: now,
                            metadata: {
                                payment_id: payment.id,
                                transaction_reference: payment.transaction_reference,
                                wire_tracking_ref: payment.wire_tracking_ref,
                                amount: payment.amount,
                                local_amount: payment.local_amount,
                                local_currency: payment.local_currency,
                                country_code: payment.country_code,
                            },
                        },
                        { onConflict: 'student_id,document_type' }
                    );
                }
            }
        } catch (pdfErr) {
            // Non-fatal — payment is approved even if PDF generation fails
            console.error('[verify-wire] PDF generation error:', pdfErr);
        }

        // 5. Notify the student
        await supabase.from('notifications').insert({
            user_id: payment.application.user_id,
            type: 'wire_payment_approved',
            title: 'Payment Verified ✓',
            message: `Your wire transfer of ${payment.local_currency} ${Number(payment.local_amount).toLocaleString()} (${payment.wire_tracking_ref}) has been verified and your payment is confirmed.`,
            metadata: {
                payment_id: paymentId,
                tracking_ref: payment.wire_tracking_ref,
                receipt_url: receiptUrl,
            },
            is_read: false,
        });

        return NextResponse.json({ success: true, action: 'approved', receiptUrl });

    } else {
        // REJECT
        const { error: updateError } = await supabase
            .from('tuition_payments')
            .update({
                status: 'FAILED',
                admin_verified_by: user.id,
                admin_verified_at: now,
                admin_notes: adminNotes,
            })
            .eq('id', paymentId);

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        // Reset application status back to OFFER_ACCEPTED so student can retry
        await supabase
            .from('applications')
            .update({ status: 'OFFER_ACCEPTED' })
            .eq('id', payment.application_id);

        // Notify student of rejection
        await supabase.from('notifications').insert({
            user_id: payment.application.user_id,
            type: 'wire_payment_rejected',
            title: 'Payment Verification Failed',
            message: `Your wire transfer (${payment.wire_tracking_ref}) could not be verified. Reason: ${adminNotes}. Please contact the Finance Office or resubmit.`,
            metadata: {
                payment_id: paymentId,
                tracking_ref: payment.wire_tracking_ref,
                admin_notes: adminNotes,
            },
            is_read: false,
        });

        return NextResponse.json({ success: true, action: 'rejected' });
    }
}
