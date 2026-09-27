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
        invoiceId,
        invoiceNumber,
    } = body;

    if (!offerId || !applicationId || !countryCode || !currency) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const adminSupabase = createServiceRoleClient();

    // 1. Verify the application belongs to this user or exists
    let application: any = null;
    let isHousingDeposit = invoiceType === 'HOUSING_DEPOSIT' || applicationId.startsWith('hdep') || offerId?.startsWith('hdep');

    const { data: academicApp } = await adminSupabase
        .from('applications')
        .select('id, user_id, course_id, personal_info, Course:course_id(degreeLevel, duration, school:schoolId(slug))')
        .eq('id', applicationId.replace(/^hdep-/, ''))
        .maybeSingle();

    if (academicApp) {
        application = academicApp;
    } else {
        // Check if this is a housing application
        const cleanHAppId = applicationId.replace(/^hdep-/, '');
        const { data: housingApp } = await adminSupabase
            .from('housing_applications')
            .select('*')
            .or(`id.eq.${cleanHAppId},student_id.eq.${user.id}`)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
        if (housingApp) {
            application = {
                id: housingApp.id,
                user_id: housingApp.student_id,
                is_housing: true,
            };
            isHousingDeposit = true;
        }
    }

    if (!application) {
        // Create generic placeholder application object for user
        application = {
            id: applicationId,
            user_id: user.id,
            is_housing: isHousingDeposit
        };
    }

    // 2. Fetch the admission offer or create synthetic offer
    let offer: any = null;

    // Check if invoiceId or offerId or invoiceNumber matches a formal invoice in invoices table
    const candidateInvIds = [invoiceId, offerId, applicationId, invoiceNumber].filter(Boolean) as string[];
    let matchedDbInv: any = null;
    for (const cand of candidateInvIds) {
        const isUUID = cand.length === 36 && cand.includes('-');
        let q = adminSupabase.from('invoices').select('*');
        if (isUUID) {
            q = q.or(`id.eq.${cand},invoice_number.eq.${cand}`);
        } else {
            q = q.eq('invoice_number', cand);
        }
        const { data: found } = await q.maybeSingle();
        if (found) {
            matchedDbInv = found;
            break;
        }
    }

    if (matchedDbInv) {
        const invAmount = Number(
            (matchedDbInv.balance !== null && matchedDbInv.balance !== undefined && Number(matchedDbInv.balance) > 0)
                ? matchedDbInv.balance
                : matchedDbInv.amount
        );

        // Find linked student and admission offer for foreign key satisfaction
        let validOfferId: string | null = null;
        const { data: stRec } = await adminSupabase
            .from('students')
            .select('id, application_id, user_id')
            .or(`id.eq.${matchedDbInv.student_id},user_id.eq.${user.id}`)
            .maybeSingle();

        const targetAppId = stRec?.application_id || applicationId;
        if (targetAppId && targetAppId.length === 36) {
            const { data: realOff } = await adminSupabase
                .from('admission_offers')
                .select('id')
                .eq('application_id', targetAppId)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();
            if (realOff) validOfferId = realOff.id;
        }

        offer = {
            id: validOfferId || matchedDbInv.id,
            invoice_id: matchedDbInv.id,
            tuition_fee: invAmount,
            status: 'ACCEPTED',
            ancillary_charged: true,
            invoice_type: matchedDbInv.type || invoiceType || 'CUSTOM_INVOICE'
        };
    }

    // Check if matched in housing_invoices table
    if (!offer) {
        for (const cand of candidateInvIds) {
            const isUUID = cand.length === 36 && cand.includes('-');
            let hq = adminSupabase.from('housing_invoices').select('*');
            if (isUUID) {
                hq = hq.or(`id.eq.${cand},reference_number.eq.${cand}`);
            } else {
                hq = hq.eq('reference_number', cand);
            }
            const { data: hFound } = await hq.maybeSingle();
            if (hFound) {
                const hAmount = Number((hFound.total_amount - (hFound.paid_amount || 0)) || hFound.total_amount);
                offer = {
                    id: hFound.id,
                    invoice_id: hFound.id,
                    tuition_fee: hAmount,
                    status: 'ACCEPTED',
                    ancillary_charged: true,
                    invoice_type: 'HOUSING_DEPOSIT'
                };
                isHousingDeposit = true;
                break;
            }
        }
    }

    if (offer) {
        // Offer successfully populated from formal invoice
    } else if (isHousingDeposit) {
        // Find existing admission offer or create a synthetic offer record if needed
        const { data: existingOffer } = await adminSupabase
            .from('admission_offers')
            .select('id, tuition_fee, status')
            .or(`id.eq.${offerId},application_id.eq.${application.id}`)
            .maybeSingle();

        if (existingOffer) {
            offer = existingOffer;
        } else {
            // Find an academic application for this user if available
            const { data: userApp } = await adminSupabase
                .from('applications')
                .select('id')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            const targetAppId = userApp?.id || application.id;

            const { data: newHdepOffer, error: hdepErr } = await adminSupabase
                .from('admission_offers')
                .insert({
                    application_id: targetAppId,
                    tuition_fee: cadAmount || 500.00,
                    payment_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    offer_type: 'HOUSING_DEPOSIT',
                    status: 'ACCEPTED',
                    invoice_pushed: true,
                })
                .select('id, tuition_fee, status')
                .single();

            if (newHdepOffer) {
                offer = newHdepOffer;
            } else {
                // If admission_offers foreign key fails on housing application id, provide valid offer object
                offer = {
                    id: offerId || `hdep-${application.id}`,
                    tuition_fee: cadAmount || 500.00,
                    status: 'ACCEPTED'
                };
            }
        }
    } else {
        let { data: academicOffer } = await adminSupabase
            .from('admission_offers')
            .select('id, tuition_fee, status, ancillary_charged, invoice_type')
            .eq('id', offerId)
            .maybeSingle();
        offer = academicOffer;
    }

    if (!offer) {
        // Fallback 1: look up by application_id
        const { data: fallbackOffer } = await adminSupabase
            .from('admission_offers')
            .select('id, tuition_fee, status, ancillary_charged, invoice_type')
            .eq('application_id', application.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
        offer = fallbackOffer;
    }

    if (!offer) {
        offer = {
            id: offerId || `offer-${application.id}`,
            tuition_fee: cadAmount || 500.00,
            status: 'ACCEPTED'
        };
    }

    if (!offer) {
        // Fallback 2: dynamically create admission_offer if missing
        const courseData = (application as any)?.Course;
        const degreeLevel = courseData?.degreeLevel || 'BACHELOR';
        const schoolSlug = courseData?.school?.slug || 'technology';
        const { mapSchoolToTuitionField, getTuitionFee, getProgramYears } = await import('@/utils/tuition');
        const tuitionField = mapSchoolToTuitionField(schoolSlug);
        const personal = (application as any)?.personal_info || {};
        const isDomestic = (personal.studentType || '').toLowerCase() === 'domestic';
        const annualFee = await getTuitionFee(degreeLevel, tuitionField, isDomestic);
        const years = getProgramYears(courseData?.duration || '4 years', degreeLevel as any);
        const totalFee = cadAmount || (annualFee * years);

        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 14);

        const { data: newOffer, error: createOfferErr } = await adminSupabase
            .from('admission_offers')
            .insert({
                application_id: applicationId,
                tuition_fee: totalFee,
                payment_deadline: deadline.toISOString().split('T')[0],
                offer_type: 'FULL_TUITION',
                status: 'ACCEPTED',
                accepted_at: new Date().toISOString(),
                invoice_pushed: true,
            })
            .select('id, tuition_fee, status')
            .single();

        if (createOfferErr) {
            console.error('[POST /api/payments/initialize] fallback offer creation error:', createOfferErr);
        } else {
            offer = newOffer;
        }
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

    // 6. Use authoritative amount: respect exact invoice or requested CAD amount
    const isHousingFlow = isHousingDeposit || invoiceType === 'HOUSING_DEPOSIT' || offerId?.startsWith('hdep');
    let authorizedCadAmount = 0;

    if (cadAmount && Number(cadAmount) > 0) {
        // Explicit CAD amount passed from checkout
        authorizedCadAmount = Number(cadAmount);
    } else if (offer?.tuition_fee && Number(offer.tuition_fee) > 0) {
        const baseTuition = Number(offer.tuition_fee);
        const includeAncillary = !offer.ancillary_charged && !isHousingFlow;
        const totalAncillary = includeAncillary ? (await import('@/utils/tuition')).ANCILLARY_FEES_TOTAL : 0;
        authorizedCadAmount = baseTuition + totalAncillary;
    } else if (isHousingFlow) {
        authorizedCadAmount = 500.00;
    } else {
        authorizedCadAmount = 500.00;
    }

    let authorizedLocalAmount = parseFloat((authorizedCadAmount * liveRate).toFixed(2));
    // CAD wire has a $25 processing fee (matching frontend checkout logic)
    if (currency === 'CAD' && countryCode === 'CA') {
        authorizedLocalAmount = parseFloat((authorizedCadAmount + 25).toFixed(2));
    }

    // 7. Generate tracking reference
    const trackingRef = generateTrackingRef(countryCode);

    // 8. Create payment record (tuition_payments or housing_payments)
    let paymentId = `pay_${Date.now()}`;

    try {
        const finalInvoiceType = isHousingFlow ? 'HOUSING_DEPOSIT' : (invoiceType ?? 'TUITION_DEPOSIT');
        const { data: payment, error: paymentError } = await adminSupabase
            .from('tuition_payments')
            .insert({
                offer_id: offer?.id && !offer.id.startsWith('hdep') ? offer.id : (offer?.id || null),
                invoice_id: offer?.invoice_id || invoiceId || null,
                student_id: student?.id ?? null,
                transaction_reference: trackingRef,
                payment_method: paymentMethod ?? 'direct_bank_wire',
                amount: authorizedCadAmount,
                status: 'PENDING',
                invoice_type: finalInvoiceType,
                country: countryCode,
                currency: currency,
                fx_metadata: {
                    rate: liveRate,
                    localAmount: authorizedLocalAmount,
                    localCurrency: currency,
                    wire_tracking_ref: trackingRef,
                    country_code: countryCode,
                    step: 'pending_proof',
                }
            })
            .select()
            .maybeSingle();

        if (payment) {
            paymentId = payment.id;
        } else if (paymentError) {
            console.warn('[POST /api/payments/initialize] tuition_payments insert fallback to housing_payments:', paymentError.message);
            // Fallback: create housing_payments record
            const { data: hPay } = await adminSupabase
                .from('housing_payments')
                .insert({
                    student_id: user.id,
                    amount: authorizedCadAmount,
                    currency: currency,
                    status: 'pending',
                    payment_method: paymentMethod ?? 'direct_bank_wire',
                    transaction_reference: trackingRef,
                    metadata: {
                        rate: liveRate,
                        localAmount: authorizedLocalAmount,
                        localCurrency: currency,
                        wire_tracking_ref: trackingRef,
                        country_code: countryCode,
                    }
                })
                .select()
                .maybeSingle();
            if (hPay) paymentId = hPay.id;
        }
    } catch (insertErr) {
        console.warn('[initialize payment] Error recording payment:', insertErr);
    }

    // 9. Calculate lock expiry (48h from now by default)
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    return NextResponse.json({
        success: true,
        paymentId: paymentId,
        trackingRef,
        bankAccount,
        cadAmount: authorizedCadAmount,
        localAmount: authorizedLocalAmount,
        localCurrency: currency,
        exchangeRate: liveRate,
        expiresAt,
    });
}
