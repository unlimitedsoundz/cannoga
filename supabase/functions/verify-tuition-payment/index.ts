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

        // Service role client bypasses RLS so admin verification always succeeds,
        // regardless of row-level policies on tuition_payments / applications.
        const adminClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401,
            });
        }

        // Verify the requesting user is authenticated
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401,
            });
        }

        // Verify the requesting user is an admin
        const { data: profile, error: profileError } = await adminClient
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError || profile?.role !== 'ADMIN') {
            return new Response(JSON.stringify({ error: 'Forbidden: admin access required' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 403,
            });
        }

        const { paymentId, applicationId } = await req.json();

        if (!paymentId || !applicationId) {
            return new Response(JSON.stringify({ error: 'paymentId and applicationId are required' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            });
        }

        // 1. Mark the payment as verified. This fires the on_payment_status_update
        // trigger which notifies the student (TUITION_PAYMENT_VERICAED).
        const { error: updateError } = await adminClient
            .from('tuition_payments')
            .update({ status: 'verified' })
            .eq('id', paymentId)
            .eq('status', 'PENDING_VERIFICATION');

        if (updateError) throw updateError;

        // 2. Complete enrollment for this application. This is required so the
        // student keeps (or regains) access to the Active Student portal
        // (Admission Letter, Receipt, Enter Student Portal) — including when they
        // pay a subsequent (2nd, 3rd...) invoice. Mirrors enrollStudent but runs
        // server-side with the service role so it never fails on RLS.
        const { data: application, error: appError } = await adminClient
            .from('applications')
            .select('*, user:profiles!user_id(*), course:Course(*)')
            .eq('id', applicationId)
            .single();

        if (appError || !application) throw new Error('Application not found');

        const appUser = application.user;
        const currentYear = new Date().getFullYear();

        // 3. Generate student id + institutional email (mirror enrollStudent)
        let studentId = appUser?.student_id;
        if (!studentId || !studentId.startsWith('HU')) {
            studentId = `HU${Math.floor(1000000 + Math.random() * 8999999)}`;
        }

        let institutionalEmail = `${appUser?.first_name ?? 'student'}.${appUser?.last_name ?? 'heffring'}@cannogacollege.ca`
            .toLowerCase()
            .replace(/\s+/g, '');

        const { data: existingEmail } = await adminClient
            .from('students')
            .select('institutional_email')
            .eq('institutional_email', institutionalEmail)
            .maybeSingle();

        if (existingEmail) {
            institutionalEmail = `${appUser?.first_name ?? 'student'}.${appUser?.last_name ?? 'heffring'}${Math.floor(Math.random() * 100)}@cannogacollege.ca`
                .toLowerCase()
                .replace(/\s+/g, '');
        }

        // 4. Upsert the student record (idempotent on application_id)
        const { error: studentError } = await adminClient
            .from('students')
            .upsert({
                user_id: appUser?.id,
                student_id: studentId,
                application_id: application.id,
                program_id: application.course_id,
                institutional_email: institutionalEmail,
                personal_email: appUser?.email,
                enrollment_status: 'ACTIVE',
                start_date: application.updated_at || new Date().toISOString(),
                expected_graduation_date: new Date(new Date().setFullYear(currentYear + 3)).toISOString(),
                updated_at: new Date().toISOString()
            }, { onConflict: 'application_id' });

        if (studentError) throw studentError;

        // 5. Mark application enrolled + receipt issued
        const { error: enrollError } = await adminClient
            .from('applications')
            .update({
                status: 'ENROLLED',
                admission_letter_generated: true,
                receipt_generated: true,
                updated_at: new Date().toISOString()
            })
            .eq('id', applicationId);

        if (enrollError) throw enrollError;

        // 6. Update the user's profile role
        await adminClient
            .from('profiles')
            .update({ role: 'STUDENT', student_id: studentId })
            .eq('id', appUser?.id);

        return new Response(JSON.stringify({ success: true }), {
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
