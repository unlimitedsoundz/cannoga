import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';

// POST /api/payments/submit-proof
// Student submits their bank session ID / teller reference after sending funds
export async function POST(request: NextRequest) {
    const supabase = await createServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { paymentId, trackingRef, bankRef, proofUrl } = body;

    if ((!paymentId && !trackingRef) || !bankRef?.trim()) {
        return NextResponse.json({ error: 'paymentId or trackingRef and bankRef are required' }, { status: 400 });
    }

    const adminSupabase = createServiceRoleClient();

    // UUID regex check
    const isUUID = paymentId ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(paymentId) : false;

    // 1. Check tuition_payments first by id (if UUID) or tracking ref
    let payment: any = null;
    let isHousingTable = false;

    if (isUUID) {
        const { data: tuitionPayment } = await adminSupabase
            .from('tuition_payments')
            .select('id, status, offer_id, transaction_reference, amount, country, currency, offer:admission_offers(application_id)')
            .eq('id', paymentId)
            .maybeSingle();
        if (tuitionPayment) payment = tuitionPayment;
    }

    const lookupRef = trackingRef || paymentId;

    if (!payment && lookupRef) {
        const { data: tuitionByRef } = await adminSupabase
            .from('tuition_payments')
            .select('id, status, offer_id, transaction_reference, amount, country, currency, offer:admission_offers(application_id)')
            .eq('transaction_reference', lookupRef)
            .maybeSingle();
        if (tuitionByRef) payment = tuitionByRef;
    }

    if (!payment && isUUID) {
        // 2. Check housing_payments table by id
        const { data: housingPayment } = await adminSupabase
            .from('housing_payments')
            .select('id, status, transaction_reference, amount, currency, metadata')
            .eq('id', paymentId)
            .maybeSingle();

        if (housingPayment) {
            payment = housingPayment;
            isHousingTable = true;
        }
    }

    if (!payment && lookupRef) {
        // Check housing_payments table by transaction_reference
        const { data: housingByRef } = await adminSupabase
            .from('housing_payments')
            .select('id, status, transaction_reference, amount, currency, metadata')
            .eq('transaction_reference', lookupRef)
            .maybeSingle();

        if (housingByRef) {
            payment = housingByRef;
            isHousingTable = true;
        }
    }

    if (!payment) {
        // 3. Fallback: try finding most recent pending payment for user
        const { data: recentPay } = await adminSupabase
            .from('tuition_payments')
            .select('id, status, offer_id, transaction_reference, amount, country, currency, offer:admission_offers(application_id)')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (recentPay) {
            payment = recentPay;
        } else {
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }
    }

    // Allow proof submission to progress the payment record into the pending verification queue
    const allowedStatuses = ['PENDING', 'pending', 'pending_proof', 'PENDING_VERIFICATION', 'INITIATED', 'PROCESSING'];
    if (!allowedStatuses.includes(payment.status)) {
        // If payment was previously COMPLETED, FAILED, or in another state, reset to pending
        // so the new proof is captured and queued for finance team verification.
        const targetTable = isHousingTable ? 'housing_payments' : 'tuition_payments';
        const { error: resetErr } = await adminSupabase
            .from(targetTable)
            .update({ status: isHousingTable ? 'pending' : 'PENDING' })
            .eq('id', payment.id);
        if (!resetErr) {
            payment.status = isHousingTable ? 'pending' : 'PENDING';
        }
    }

    const resolvedAppId = (payment as any)?.offer?.application_id;

    // Update payment status (try PENDING_VERIFICATION first, fallback to PENDING if check constraint is strict)
    let updated = null;
    const targetTable = isHousingTable ? 'housing_payments' : 'tuition_payments';

    const { data: updatedRecord, error: updateError } = await adminSupabase
        .from(targetTable)
        .update({
            status: isHousingTable ? 'pending' : 'PENDING_VERIFICATION',
        })
        .eq('id', payment.id)
        .select()
        .maybeSingle();

    if (updateError) {
        console.warn('[submit-proof] PENDING_VERIFICATION update failed, falling back to PENDING:', updateError);
        const { data: fallbackRecord, error: fallbackError } = await adminSupabase
            .from(targetTable)
            .update({
                status: isHousingTable ? 'pending' : 'PENDING',
            })
            .eq('id', payment.id)
            .select()
            .maybeSingle();
        if (fallbackError) {
            return NextResponse.json({ error: fallbackError.message }, { status: 500 });
        }
        updated = fallbackRecord;
    } else {
        updated = updatedRecord;
    }

    // Also update application status to PAYMENT_SUBMITTED
    if (resolvedAppId) {
        await adminSupabase
            .from('applications')
            .update({ status: 'PAYMENT_SUBMITTED' })
            .eq('id', resolvedAppId);
    }

    // Notify finance staff (insert notification + send email alert)
    try {
        await adminSupabase.from('notifications').insert({
            user_id: null,
            type: 'wire_proof_submitted',
            title: 'Wire Proof Submitted',
            message: `A student has submitted wire transfer proof for payment reference ${updated.transaction_reference || bankRef}. Please verify in the Finance Queue.`,
            metadata: {
                payment_id: paymentId,
                tracking_ref: updated.transaction_reference,
                student_bank_ref: bankRef,
                proof_url: proofUrl ?? null,
                country: updated.country,
                currency: updated.currency,
                amount: updated.amount,
            },
            is_read: false,
        });
    } catch (notifErr) {
        console.error('[submit-proof] notification insert error:', notifErr);
    }

    // Dispatch Admin Email Alert
    try {
        const { triggerNotification } = await import('@/lib/email');
        await triggerNotification({
            type: 'ADMIN_PAYMENT_SUBMITTED',
            additionalData: {
                adminEmail: 'unlymitedsoundz@gmail.com',
                paymentId: updated.id,
                trackingRef: updated.transaction_reference,
                studentBankRef: bankRef,
                amount: updated.amount,
                currency: updated.currency || 'CAD',
                country: updated.country,
                invoiceType: isHousingTable ? 'HOUSING_DEPOSIT' : (payment.invoice_type || 'TUITION_DEPOSIT'),
                studentEmail: user.email,
                link: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cannoga.vercel.app'}/sis/admin/finance/verification-queue`
            }
        });
    } catch (emailErr) {
        console.warn('[submit-proof] admin email alert dispatch warning:', emailErr);
    }

    return NextResponse.json({
        success: true,
        status: updated.status,
        trackingRef: updated.transaction_reference,
    });
}
