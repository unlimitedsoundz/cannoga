import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import type { InitializeWirePaymentRequest } from '@/types/payments';

// ---------------------------------------------------------------
// Reference format: CAN + 9 random digits  e.g. CAN487392015
// ---------------------------------------------------------------
function generateTrackingRef(countryCode: string): string {
    let digits = '';
    for (let i = 0; i < 9; i++) {
        digits += Math.floor(Math.random() * 10).toString();
    }
    return `CAN${digits}`;
}

// POST /api/payments/initialize
// Creates a payment record and returns bank account details + tracking ref
export async function POST(request: NextRequest) {
    const supabase = await createServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: InitializeWirePaymentRequest = await request.json();
    const {
        offerId,
        applicationId,
        countryCode,
        currency,
        cadAmount,
        localAmount,
        exchangeRate,
        paymentMethod,
        invoiceType,
    } = body;

    if (!offerId || !applicationId || !countryCode || !currency) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const adminSupabase = createServiceRoleClient();

    // 1. Verify the application belongs to this user
    const { data: application, error: appError } = await adminSupabase
        .from('applications')
        .select('id, user_id')
        .eq('id', applicationId)
        .eq('user_id', user.id)
        .single();

    if (appError || !application) {
        return NextResponse.json({ error: 'Application not found or access denied' }, { status: 403 });
    }

    // 2. Fetch the admission offer
    let { data: offer, error: offerError } = await adminSupabase
        .from('admission_offers')
        .select('id, tuition_fee, status, student_id')
        .eq('id', offerId)
        .maybeSingle();

    if (!offer) {
        // Fallback: look up by application_id in case offerId was an application id or mismatched
        const { data: fallbackOffer } = await adminSupabase
            .from('admission_offers')
            .select('id, tuition_fee, status, student_id')
            .eq('application_id', applicationId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
        offer = fallbackOffer;
    }

    if (!offer) {
        return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    // 3. Look up student record
    const { data: student } = await adminSupabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

    // 4. Verify the bank account exists for this country/currency
    const { data: bankAccount, error: bankError } = await adminSupabase
        .from('institutional_bank_accounts')
        .select('*')
        .eq('country_code', countryCode)
        .eq('currency', currency)
        .eq('is_active', true)
        .maybeSingle();

    if (bankError || !bankAccount) {
        return NextResponse.json({ error: `No active bank account configured for ${countryCode} / ${currency}` }, { status: 400 });
    }

    // 5. Fetch the live institutional exchange rate (server-side, not client-trusting)
    const { data: rateRecord } = await adminSupabase
        .from('institutional_exchange_rates')
        .select('rate_multiplier')
        .eq('from_currency', 'CAD')
        .eq('to_currency', currency)
        .eq('is_active', true)
        .maybeSingle();

    // Use client-provided rate only as fallback if DB has no entry (should not happen)
    const liveRate = rateRecord ? Number(rateRecord.rate_multiplier) : (exchangeRate ?? 1);

    // 6. Use the authoritative tuition_fee from DB, not the client-sent cadAmount
    const authorizedCadAmount = Number(offer.tuition_fee);
    const authorizedLocalAmount = parseFloat((authorizedCadAmount * liveRate).toFixed(2));

    // 7. Generate tracking reference
    const trackingRef = generateTrackingRef(countryCode);

    // 8. Create tuition_payment record
    const { data: payment, error: paymentError } = await adminSupabase
        .from('tuition_payments')
        .insert({
            offer_id: offer.id,
            application_id: applicationId,
            student_id: student?.id ?? null,
            transaction_reference: trackingRef,
            wire_tracking_ref: trackingRef,
            payment_method: paymentMethod ?? 'direct_bank_wire',
            amount: authorizedCadAmount,
            status: 'pending_proof',
            invoice_type: invoiceType ?? 'TUITION_DEPOSIT',
            country_code: countryCode,
            local_currency: currency,
            local_amount: authorizedLocalAmount,
            exchange_rate_applied: liveRate,
        })
        .select()
        .single();

    if (paymentError) {
        console.error('[POST /api/payments/initialize] insert error:', paymentError);
        return NextResponse.json({ error: paymentError.message }, { status: 500 });
    }

    // 9. Calculate lock expiry (48h from now by default)
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    return NextResponse.json({
        success: true,
        paymentId: payment.id,
        trackingRef,
        bankAccount,
        cadAmount: authorizedCadAmount,
        localAmount: authorizedLocalAmount,
        localCurrency: currency,
        exchangeRate: liveRate,
        expiresAt,
    });
}
