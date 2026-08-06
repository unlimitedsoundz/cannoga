import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        );

        const adminClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const authHeader = req.headers.get('Authorization');
        console.log('Auth Header present:', !!authHeader);

        const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

        if (authError || !user) {
            console.error('Auth Error:', authError);
            return new Response(JSON.stringify({
                error: 'Unauthorized',
                details: authError?.message || 'No user found',
                hasHeader: !!authHeader
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401,
            });
        }

        const { offerId, applicationId, amount, details, invoiceType } = await req.json();

        const reference = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        // Determine if ancillary fees should be included (only on the first invoice)
        const { data: offerData } = await adminClient
            .from('admission_offers')
            .select('ancillary_charged')
            .eq('id', offerId)
            .single();
        const ancillaryIncluded = !(offerData?.ancillary_charged ?? false);

        // 2. Insert Payment Record
        const { error: paymentError } = await adminClient
            .from('tuition_payments')
            .insert({
                offer_id: offerId,
                amount: amount,
                status: 'PENDING_VERIFICATION',
                payment_method: details.method,
                transaction_reference: reference,
                invoice_type: invoiceType || 'TUITION_DEPOSIT'
            });

        if (paymentError) throw paymentError;

        // Mark ancillary as charged for this offer so future invoices exclude it
        await adminClient
            .from('admission_offers')
            .update({ ancillary_charged: true, updated_at: new Date().toISOString() })
            .eq('id', offerId);

        // 3. Update Application Status to PAYMENT_SUBMITTED (No Auto-Enroll)
        // This triggers the "Pending Verification" UI in the PaymentView.
        // IMPORTANT: Do NOT downgrade an already-enrolled student (e.g. when they
        // pay a subsequent / 2nd invoice). Downgrading would make them lose access
        // to the Active Student portal (Admission Letter, Receipt, Enter Student Portal).
        const { data: currentApp } = await adminClient
            .from('applications')
            .select('status')
            .eq('id', applicationId)
            .single();

        if (currentApp && currentApp.status !== 'ENROLLED' && currentApp.status !== 'ADMISSION_LETTER_GENERATED') {
            const { error: appError } = await adminClient
                .from('applications')
                .update({ status: 'PAYMENT_SUBMITTED', updated_at: new Date().toISOString() })
                .eq('id', applicationId);

            if (appError) throw appError;
        }

        // 4. Notify Admin
        try {
            const ancillaryFees = [
                { name: 'Student Activity Fee', amount: 100 },
                { name: 'Technology Fee', amount: 100 },
                { name: 'Athletics and Recreation Fee', amount: 100 },
                { name: 'Convocation Fee', amount: 100 },
                { name: 'Student Counselling Fee', amount: 100 },
                { name: 'Program Transcript Fee', amount: 100 },
                { name: 'Student Experience Fee', amount: 100 }
            ];
            const totalAncillaryForNotification = ancillaryFees.reduce((acc, item) => acc + item.amount, 0);
            const baseTuitionForNotification = Math.max(0, amount - totalAncillaryForNotification);

            await adminClient.functions.invoke('send-notification', {
                body: {
                    type: 'PAYMENT_RECEIVED',
                    applicationId: applicationId,
                    additionalData: {
                        amount: baseTuitionForNotification,
                        currency: details.currency,
                        reference: reference,
                        paymentType: invoiceType || 'TUITION',
                        ancillaryFees: ancillaryFees
                    }
                }
            });
            console.log('Admin notification triggered for payment:', reference);
        } catch (notifyError) {
            console.error('Failed to trigger admin notification:', notifyError);
            // We don't fail the whole request if notification fails
        }

        return new Response(JSON.stringify({ success: true, reference }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
