import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
    console.error('Missing RESEND_API_KEY');
    process.exit(1);
}

const resend = new Resend(resendApiKey);

async function sendTest() {
    const studentName = 'Chikamma Benson';
    const studentEmail = 'chikamma.benson@cannogacollege.ca';

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            body { margin: 0; padding: 24px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
            .container { max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
            .header { border-bottom: 2px solid #0a151a; padding-bottom: 16px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; }
            .logo { font-size: 20px; font-weight: 800; color: #0a151a; letter-spacing: -0.5px; }
            .badge { background: #0369a1; color: #ffffff; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 999px; text-transform: uppercase; }
            h2 { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0; }
            p { font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 14px; }
            .callout { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 14px 16px; border-radius: 0 8px 8px 0; margin: 20px 0; }
            .callout p { margin: 0; font-size: 13px; color: #166534; font-weight: 600; }
            .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; line-height: 1.5; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">Cannoga College</div>
                <span class="badge">Official Notification</span>
            </div>
            <h2>Microsoft 365 Mail Integration Confirmed</h2>
            <p>Dear ${studentName},</p>
            <p>This is an automated verification message dispatched from the <strong>Cannoga College Office of the Registrar</strong> to confirm that your institutional Microsoft 365 student inbox is operational.</p>
            
            <div class="callout">
                <p>✅ Student Mail Connector Active — Graph API Sync Successful</p>
            </div>

            <p>Your SIS dashboard is connected to your official college mailbox (<code>${studentEmail}</code>). You can read, organize, and monitor all your academic correspondence directly from the <strong>Student Mail</strong> tab in the Student Information System.</p>

            <p style="margin-top: 24px;">
                <a href="https://cannogacollege.ca/sis/mail/" style="display: inline-block; background: #0a151a; color: #ffffff; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none;">Go to Student Mail →</a>
            </p>

            <div class="footer">
                <p>Office of the Registrar &bull; Cannoga College<br>
                Ottawa, Ontario, Canada &bull; <a href="mailto:registrar@cannogacollege.ca" style="color: #64748b;">registrar@cannogacollege.ca</a></p>
            </div>
        </div>
    </body>
    </html>
    `;

    console.log(`Sending test email to ${studentEmail}...`);

    const result = await resend.emails.send({
        from: 'Cannoga College Registrar <registrar@cannogacollege.ca>',
        to: [studentEmail],
        subject: 'Student Mail Test: Microsoft 365 Mailbox Verification',
        html: htmlContent,
    });

    console.log('Result:', JSON.stringify(result, null, 2));
}

sendTest().catch(console.error);
