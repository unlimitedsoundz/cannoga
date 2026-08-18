// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    // Handle CORS
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { record } = await req.json();

        // Extract fields handling both 'profiles' and 'auth.users' webhook shapes
        let email = record.email;
        let first_name = record.first_name || record.raw_user_meta_data?.first_name || 'Student';
        let student_id = record.student_id;

        if (!email) {
            throw new Error("No email found in record");
        }

        // If student_id is missing from webhook payload, query the DB
        if (!student_id) {
            const supabaseUrl = Deno.env.get("SUPABASE_URL");
            const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
            if (supabaseUrl && supabaseKey) {
                const supabase = createClient(supabaseUrl, supabaseKey);
                const { data } = await supabase
                    .from('profiles')
                    .select('student_id, first_name')
                    .eq('email', email)
                    .single();

                if (data) {
                    student_id = data.student_id;
                    if (data.first_name && first_name === 'Student') {
                        first_name = data.first_name;
                    }
                }
            } else {
                console.warn("Supabase credentials not found, cannot fetch student_id");
            }
        }

        console.log(`Sending welcome email to ${email} (${first_name})`);

        // Branded HTML Template (Simplified for Edge Runtime compatibility)
        // In a full implementation, we'd render the React component to HTML
        // But here we'll use a high-quality HTML string that matches the design.
        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Welcome to Cannoga College</title>
  <style>
    :root { color-scheme: light dark; }
    @media (prefers-color-scheme: dark) {
        .logo { filter: invert(1) !important; }
    }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; color: #000000; margin: 0; padding: 0; }
    .container { max-width: 465px; margin: 20px auto; padding: 20px 15px; }
    .logo { display: block; margin: 32px auto; width: 100%; height: auto; max-width: 200px; }
    h1 { font-size: 24px; font-weight: 400; text-align: center; margin: 30px 0; }
    p { font-size: 14px; line-height: 24px; color: #000000; }
    .id-box { background-color: #171717; border-radius: 8px; padding: 24px; margin: 32px 0; text-align: center; }
    .id-label { color: rgba(255, 255, 255, 0.6); font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
    .id-value { color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: -0.05em; margin: 0; }
    .id-note { color: rgba(255, 255, 255, 0.8); font-size: 10px; margin-top: 16px; text-transform: uppercase; }
    .button-container { text-align: center; margin: 32px 0; }
    .button { background-color: #000000; color: #ffffff; padding: 12px 20px; border-radius: 4px; text-decoration: none; font-size: 12px; font-weight: 600; }
    .footer { border-top: 1px solid #eaeaea; margin-top: 26px; padding-top: 26px; color: #666666; font-size: 12px; }
    a { color: #2563eb; text-decoration: none; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <img src="https://cannogacollege.ca/images/admissions/master-hero.png" alt="Cannoga College" style="width: 100%; height: 150px; object-fit: cover; margin-bottom: 20px;" />
    <img src="https://cannogacollege.ca/images/logo-cannoga.png" alt="Cannoga College" class="logo">
    <h1>Welcome to Cannoga College</h1>
    <p>Dear ${first_name || 'Student'},</p>
    <p>Congratulations on creating your student account at Cannoga College! We are excited to have you join our academic community.</p>
    
    <div class="id-box">
      <div class="id-label">Your Unique Student ID</div>
      <div class="id-value">${student_id || 'N/A'}</div>
      <div class="id-note">Use Email and Password to access the student portal.</div>
    </div>

    <p>You can now access your dashboard to complete your application, upload documents, and track your progress.</p>

    <div class="button-container">
      <a href="https://cannogacollege.ca/portal/account/login" class="button">Enter Student Portal</a>
    </div>

    <p>If you have any questions or need assistance, please reach out to our Admissions Office at <a href="mailto:admissions@cannogacollege.ca">admissions@cannogacollege.ca</a> or call us at <strong>+1 (613) 555-0181</strong>.</p>

    <div class="footer">
      <p style="text-align: center; margin: 0;">&copy; ${new Date().getFullYear()} Cannoga College<br>Ottawa, Ontario, Canada | +1 (613) 555-0181 | admissions@cannogacollege.ca</p>
      <div style="text-align: center; margin-top: 20px;">
        <a href="https://www.instagram.com/cannogacollege" style="color: #888; text-decoration: none; margin: 0 10px; font-weight: bold;">Instagram</a>
        <a href="https://www.tiktok.com/@cannogacollege" style="color: #888; text-decoration: none; margin: 0 10px; font-weight: bold;">TikTok</a>
      </div>
      <br>
      This email was sent to confirm your account registration at Cannoga College.
    </div>
  </div>
</body>
</html>
    `;

        const { data, error } = await resend.emails.send({
            from: "Cannoga College <admissions@cannogacollege.ca>",
            to: [email],
            subject: "Welcome to Cannoga College",
            html: html,
        });

        if (error) {
            console.error("Resend Error:", error);
            return new Response(JSON.stringify({ error }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error?.message || String(error) }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});

