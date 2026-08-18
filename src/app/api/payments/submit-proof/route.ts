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
    const { paymentId, bankRef, proofUrl } = body;

    if (!paymentId || !bankRef?.trim()) {
        return NextResponse.json({ error: 'paymentId and bankRef are required' }, { status: 400 });
    }

    const adminSupabase = createServiceRoleClient();

    // Verify the payment belongs to this user via application / offer ownership
    const { data: payment, error: paymentError } = await adminSupabase
        .from('tuition_payments')
        .select('id, status, offer_id, offer:admission_offers(application_id)')
        .eq('id', paymentId)
        .single();

    if (paymentError || !payment) {
        return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Only allow proof submission when status is pending_proof
    if (payment.status !== 'pending_proof' && payment.status !== 'PENDING_VERIFICATION') {
        return NextResponse.json({
            error: `Cannot submit proof for a payment with status: ${payment.status}`,
        }, { status: 400 });
    }

    const resolvedAppId = (payment as any)?.offer?.application_id;

    // Verify application ownership if application id exists
    if (resolvedAppId) {
        const { data: application } = await adminSupabase
            .from('applications')
            .select('id, user_id')
            .eq('id', resolvedAppId)
            .single();

        if (application && application.user_id !== user.id) {
            console.warn(`[submit-proof] Application user_id mismatch`);
        }
    }

    // Update payment to pending_admin_verification
    const { data: updated, error: updateError } = await adminSupabase
        .from('tuition_payments')
        .update({
            status: 'PENDING_VERIFICATION',
        })
        .eq('id', paymentId)
        .select()
        .single();

    if (updateError) {
        console.error('[POST /api/payments/submit-proof]', updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Also update application status to PAYMENT_SUBMITTED
    if (resolvedAppId) {
        await adminSupabase
            .from('applications')
            .update({ status: 'PAYMENT_SUBMITTED' })
            .eq('id', resolvedAppId);
    }

    // Notify finance staff (insert notification)
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

    return NextResponse.json({
        success: true,
        status: updated.status,
        trackingRef: updated.transaction_reference,
    });
}
