import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';
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

    const adminClient = createServiceRoleClient();

    // 1. Check tuition_payments first, then housing_payments
    let isHousing = false;
    let payment: any = null;

    const { data: tuitionPayment } = await adminClient
        .from('tuition_payments')
        .select(`
            *,
            offer:admission_offers(
                id,
                tuition_fee,
                status,
                application:applications(
                    *,
                    course:Course(*, school:School(*)),
                    user:profiles(*)
                )
            )
        `)
        .eq('id', paymentId)
        .maybeSingle();

    if (tuitionPayment) {
        payment = tuitionPayment;
    } else {
        const { data: housingPayment } = await adminClient
            .from('housing_payments')
            .select(`
                *,
                invoice:housing_invoices(*),
                student:students(
                    id,
                    user:profiles(*),
                    application:applications(
                        *,
                        course:Course(*, school:School(*))
                    )
                )
            `)
            .eq('id', paymentId)
            .maybeSingle();

        if (housingPayment) {
            payment = housingPayment;
            isHousing = true;
        }
    }

    if (!payment) {
        return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    const application = isHousing
        ? (payment.student?.application || null)
        : (payment as any)?.offer?.application;
    const applicationId = application?.id;

    const now = new Date().toISOString();

    if (isHousing) {
        if (action === 'approve') {
            // 1. Mark housing payment as completed
            await adminClient
                .from('housing_payments')
                .update({ status: 'completed', paid_at: now })
                .eq('id', paymentId);

            // 2. Update the linked housing invoice
            if (payment.invoice_id) {
                const { data: inv } = await adminClient
                    .from('housing_invoices')
                    .select('total_amount, paid_amount')
                    .eq('id', payment.invoice_id)
                    .maybeSingle();

                if (inv) {
                    const newPaid = (Number(inv.paid_amount) || 0) + Number(payment.amount || 0);
                    const isPaid = newPaid >= Number(inv.total_amount);
                    await adminClient
                        .from('housing_invoices')
                        .update({
                            paid_amount: newPaid,
                            status: isPaid ? 'PAID' : 'PARTIALLY_PAID',
                        })
                        .eq('id', payment.invoice_id);
                }
            }

            // 3. Mark corresponding housing application as RESERVED / APPROVED
            const studentId = payment.student_id;
            if (studentId) {
                await adminClient
                    .from('housing_applications')
                    .update({ status: 'RESERVED', deposit_paid: true })
                    .or(`student_id.eq.${studentId},id.eq.${payment.invoice_id}`);
            }

            // 4. Notify student via in-app notification and email
            const targetUserId = payment.student?.user?.id || application?.user_id;
            const targetUserEmail = payment.student?.user?.email || application?.user?.email;

            if (targetUserId) {
                try {
                    await adminClient.from('notifications').insert({
                        user_id: targetUserId,
                        type: 'wire_payment_approved',
                        title: 'Housing Deposit Verified ✓',
                        message: `Your housing deposit of ${payment.currency || 'CAD'} ${Number(payment.amount).toLocaleString()} has been verified and confirmed.`,
                        metadata: {
                            payment_id: paymentId,
                            tracking_ref: payment.transaction_reference,
                            invoice_type: 'HOUSING_DEPOSIT'
                        },
                        is_read: false,
                    });
                } catch (notifErr) {
                    console.error('[verify-wire] housing notification error:', notifErr);
                }
            }

            // Dispatch Email notification
            try {
                const { triggerNotification } = await import('@/lib/email');
                await triggerNotification({
                    type: 'PAYMENT_VERIFIED',
                    applicationId: applicationId,
                    additionalData: {
                        userEmail: targetUserEmail,
                        amount: Number(payment.amount || 500),
                        currency: payment.currency || 'CAD',
                        invoiceType: 'HOUSING_DEPOSIT',
                        paymentReference: payment.transaction_reference,
                        title: 'Housing Deposit Verified ✓',
                        description: `Your housing reservation deposit of ${payment.currency || 'CAD'} ${Number(payment.amount).toLocaleString()} has been verified.`,
                        link: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cannogacollege.ca'}/sis/payments`
                    }
                });
            } catch (emailErr) {
                console.warn('[verify-wire] housing verification email dispatch warning:', emailErr);
            }

            return NextResponse.json({ success: true, action: 'approved' });
        } else {
            // Reject housing payment
            await adminClient
                .from('housing_payments')
                .update({ status: 'failed' })
                .eq('id', paymentId);

            const targetUserId = payment.student?.user?.id || application?.user_id;
            if (targetUserId) {
                try {
                    await adminClient.from('notifications').insert({
                        user_id: targetUserId,
                        type: 'wire_payment_rejected',
                        title: 'Housing Payment Verification Failed',
                        message: `Your housing wire payment could not be verified. Reason: ${adminNotes}.`,
                        metadata: { payment_id: paymentId, admin_notes: adminNotes },
                        is_read: false,
                    });
                } catch (notifErr) {
                    console.error('[verify-wire] housing reject error:', notifErr);
                }
            }

            return NextResponse.json({ success: true, action: 'rejected' });
        }
    }

    if (action === 'approve') {
        // 1. Mark payment as COMPLETED
        const { error: updateError } = await adminClient
            .from('tuition_payments')
            .update({
                status: 'COMPLETED',
            })
            .eq('id', paymentId);

        if (updateError) {
            console.error('[verify-wire] payment update error:', updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        // 2. If this is a housing deposit payment, update the linked housing_invoices and housing_applications
        const isHousingType = payment.invoice_type === 'HOUSING_DEPOSIT' || String(payment.offer_id || '').startsWith('hdep');
        if (isHousingType) {
            const targetStudentId = application?.user_id || payment.student_id;
            
            // Settle housing invoice
            if (targetStudentId) {
                await adminClient
                    .from('housing_invoices')
                    .update({
                        status: 'PAID',
                        paid_amount: Number(payment.amount || 500),
                    })
                    .or(`student_id.eq.${targetStudentId},application_id.eq.${applicationId || ''}`);
            }

            // Settle housing application
            if (targetStudentId) {
                await adminClient
                    .from('housing_applications')
                    .update({ status: 'confirmed' })
                    .or(`student_id.eq.${targetStudentId},id.eq.${applicationId || ''}`);
            }
        } else if (applicationId) {
            // Update academic application status to ENROLLED
            await adminClient
                .from('applications')
                .update({ status: 'ENROLLED' })
                .eq('id', applicationId);
        }

        // 3. Generate PDF receipt using the existing ReceiptPDF component
        let receiptUrl: string | null = null;
        if (application) {
            try {
                const pdfBuffer = Buffer.from(
                    await renderToBuffer(
                        React.createElement(ReceiptPDF, {
                            application,
                            payment: { ...payment, status: 'COMPLETED' },
                        }) as any
                    )
                );

                const fileName = `receipt-${payment.transaction_reference || paymentId}.pdf`;
                const storagePath = `student-documents/${application.user_id}/${fileName}`;

                const { error: uploadError } = await adminClient.storage
                    .from('application-documents')
                    .upload(storagePath, pdfBuffer, { contentType: 'application/pdf', upsert: true });

                if (!uploadError) {
                    const { data: { publicUrl } } = adminClient.storage
                        .from('application-documents')
                        .getPublicUrl(storagePath);
                    receiptUrl = publicUrl;

                    // 4. Upsert document record
                    const { data: student } = await adminClient
                        .from('students')
                        .select('id')
                        .eq('user_id', application.user_id)
                        .maybeSingle();

                    if (student) {
                        const isHousingDoc = payment.invoice_type === 'HOUSING_DEPOSIT';
                        const docType = isHousingDoc ? 'housing_receipt' : 'tuition_receipt';
                        const docTitle = isHousingDoc
                            ? `Housing Deposit Receipt — ${payment.transaction_reference || paymentId}`
                            : `Tuition Receipt — ${payment.transaction_reference || paymentId}`;

                        await adminClient.from('document_records').upsert(
                            {
                                student_id: student.id,
                                document_type: docType,
                                title: docTitle,
                                programme: isHousingDoc ? 'Housing & Residence' : (application.course?.title ?? ''),
                                status: 'issued',
                                storage_path: publicUrl,
                                is_official: true,
                                is_student_visible: true,
                                issue_date: now,
                                metadata: {
                                    payment_id: payment.id,
                                    transaction_reference: payment.transaction_reference,
                                    amount: payment.amount,
                                    currency: payment.currency,
                                    invoice_type: payment.invoice_type,
                                },
                            },
                            { onConflict: 'student_id,document_type' }
                        );
                    }
                }
            } catch (pdfErr) {
                console.error('[verify-wire] PDF generation error:', pdfErr);
            }

            // 5. Notify the student (In-app + Email)
            if (application.user_id) {
                try {
                    const isHousingNotification = payment.invoice_type === 'HOUSING_DEPOSIT';
                    const notifTitle = isHousingNotification ? 'Housing Deposit Verified ✓' : 'Payment Verified ✓';
                    const notifMsg = isHousingNotification
                        ? `Your housing reservation deposit of ${payment.currency || 'CAD'} ${Number(payment.amount).toLocaleString()} (${payment.transaction_reference || ''}) has been verified and settled.`
                        : `Your tuition payment of ${payment.currency || 'CAD'} ${Number(payment.amount).toLocaleString()} (${payment.transaction_reference || ''}) has been verified and your payment is confirmed.`;

                    const notifList: any[] = [
                        {
                            title: notifTitle,
                            message: notifMsg,
                            category: isHousingNotification ? 'Housing' : 'Finance',
                            priority: 'high',
                            recipient_type: 'individual',
                            recipient_ids: [application.user_id],
                            related_id: paymentId,
                            related_type: isHousingNotification ? 'housing_payment' : 'tuition_payment',
                            read: false,
                        }
                    ];

                    if (!isHousingNotification) {
                        notifList.push({
                            title: 'Provincial Attestation Letter (PAL) Notice',
                            message: 'Your Provincial Letter of Attestation (PAL) will be issued to you in 6 – 10 business days. Once issued, you can proceed with your Study Permit Application.',
                            category: 'Admissions',
                            priority: 'high',
                            recipient_type: 'individual',
                            recipient_ids: [application.user_id],
                            related_id: applicationId,
                            related_type: 'application',
                            read: false,
                        });
                    }

                    await adminClient.from('notifications').insert(notifList);
                } catch (notifErr) {
                    console.error('[verify-wire] notification error:', notifErr);
                }

                // Dispatch confirmation email
                try {
                    const { triggerNotification } = await import('@/lib/email');
                    await triggerNotification({
                        type: 'PAYMENT_VERIFIED',
                        applicationId: applicationId,
                        additionalData: {
                            userEmail: application.user?.email,
                            amount: Number(payment.amount),
                            currency: payment.currency || 'CAD',
                            invoiceType: payment.invoice_type || 'TUITION_DEPOSIT',
                            paymentReference: payment.transaction_reference,
                            receiptUrl: receiptUrl,
                            title: payment.invoice_type === 'HOUSING_DEPOSIT' ? 'Housing Deposit Verified ✓' : 'Payment Verified ✓',
                            description: `Your payment of ${payment.currency || 'CAD'} ${Number(payment.amount).toLocaleString()} has been verified.`,
                            link: receiptUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://cannogacollege.ca'}/sis/payments`
                        }
                    });
                } catch (emailErr) {
                    console.warn('[verify-wire] email dispatch error:', emailErr);
                }
            }
        }

        return NextResponse.json({ success: true, action: 'approved', receiptUrl });

    } else {
        // REJECT
        const { error: updateError } = await adminClient
            .from('tuition_payments')
            .update({
                status: 'FAILED',
            })
            .eq('id', paymentId);

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        // Reset application status back to OFFER_ACCEPTED so student can retry
        if (applicationId) {
            await adminClient
                .from('applications')
                .update({ status: 'OFFER_ACCEPTED' })
                .eq('id', applicationId);
        }

        // Notify student of rejection
        if (application?.user_id) {
            try {
                await adminClient.from('notifications').insert({
                    user_id: application.user_id,
                    type: 'wire_payment_rejected',
                    title: 'Payment Verification Failed',
                    message: `Your wire transfer (${payment.transaction_reference || ''}) could not be verified. Reason: ${adminNotes}. Please contact the Finance Office or resubmit.`,
                    metadata: {
                        payment_id: paymentId,
                        tracking_ref: payment.transaction_reference,
                        admin_notes: adminNotes,
                    },
                    is_read: false,
                });
            } catch (notifErr) {
                console.error('[verify-wire] reject notification error:', notifErr);
            }
        }

        return NextResponse.json({ success: true, action: 'rejected' });
    }
}
