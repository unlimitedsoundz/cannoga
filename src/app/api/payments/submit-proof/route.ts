import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';

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

    // Verify the payment belongs to this user via application ownership
    const { data: payment, error: paymentError } = await supabase
        .from('tuition_payments')
        .select('id, status, application_id, offer_id')
        .eq('id', paymentId)
        .single();

    if (paymentError || !payment) {
        return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Only allow proof submission when status is pending_proof
    if (payment.status !== 'pending_proof') {
        return NextResponse.json({
            error: `Cannot submit proof for a payment with status: ${payment.status}`,
        }, { status: 400 });
    }

    // Verify application ownership
    const { data: application } = await supabase
        .from('applications')
        .select('id, user_id')
        .eq('id', payment.application_id)
        .eq('user_id', user.id)
        .single();

    if (!application) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Update payment to pending_admin_verification
    const { data: updated, error: updateError } = await supabase
        .from('tuition_payments')
        .update({
            status: 'pending_admin_verification',
            student_proof_ref: bankRef.trim(),
            student_proof_url: proofUrl ?? null,
            proof_submitted_at: new Date().toISOString(),
        })
        .eq('id', paymentId)
        .select()
        .single();

    if (updateError) {
        console.error('[POST /api/payments/submit-proof]', updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Also update application status to PAYMENT_SUBMITTED
    await supabase
        .from('applications')
        .update({ status: 'PAYMENT_SUBMITTED' })
        .eq('id', payment.application_id);

    // Notify finance staff (insert notification)
    await supabase.from('notifications').insert({
        user_id: null, // broadcast — finance staff pick up via role filter
        type: 'wire_proof_submitted',
        title: 'Wire Proof Submitted',
        message: `A student has submitted wire transfer proof for payment ${updated.transaction_reference}. Please verify in the Finance Queue.`,
        metadata: {
            payment_id: paymentId,
            tracking_ref: updated.wire_tracking_ref,
            country_code: updated.country_code,
            local_currency: updated.local_currency,
            local_amount: updated.local_amount,
        },
        is_read: false,
    }).maybeSingle();

    return NextResponse.json({
        success: true,
        status: updated.status,
        trackingRef: updated.wire_tracking_ref,
    });
}
