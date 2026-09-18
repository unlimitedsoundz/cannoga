
import { Resend } from 'resend';

interface SendEmailParams {
    to: string;
    subject: string;
    react?: React.ReactElement;
    html?: string;
    attachments?: {
        filename: string;
        content: Buffer | string;
    }[];
}

export async function sendEmail({ to, subject, react, html, attachments }: SendEmailParams) {
    const apiKey = process.env.RESEND_API_KEY;

    // If no API key is provided, log the email content (useful for dev/demo)
    if (!apiKey) {
        console.log('---------------------------------------------------');
        console.log(`[MOCK EMAIL SERVICE]`);
        console.log(`TO: ${to}`);
        console.log(`SUBJECT: ${subject}`);
        console.log(`ATTACHMENTS: ${attachments?.length || 0} files`);
        if (html) console.log(`BODY (HTML):`, html.slice(0, 300) + '...');
        if (react) console.log(`BODY (React Component):`, react);
        console.log('---------------------------------------------------');
        return { success: true, id: 'mock-email-id' };
    }

    try {
        const resend = new Resend(apiKey);
        const emailPayload: any = {
            from: 'Cannoga College <admissions@cannogacollege.ca>',
            to: [to],
            subject: subject,
            attachments: attachments,
        };

        if (html) {
            emailPayload.html = html;
        } else if (react) {
            emailPayload.react = react;
        }

        const { data, error } = await resend.emails.send(emailPayload);

        if (error) {
            console.error('Resend Error:', error);
            return { success: false, error };
        }

        return { success: true, id: data?.id };
    } catch (error) {
        console.error('Email Send Error:', error);
        return { success: false, error };
    }
}

export async function notifyAdmin({ subject, react, html }: { subject: string; react?: React.ReactElement; html?: string }) {
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_NOTICACATION_EMAIL || 'unlymitedsoundz@gmail.com';
    return sendEmail({
        to: adminEmail,
        subject: `[ADMIN ALERT] ${subject}`,
        react: react,
        html: html,
    });
}

export function wrapEmailTemplate(contentHtml: string) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            body { margin: 0; padding: 20px; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111111; }
            p { margin: 0 0 10px 0; line-height: 1.5; font-size: 14px; }
            strong { color: #111111; }
            a { color: #034737; text-decoration: underline; }
        </style>
    </head>
    <body>
        <div style="max-width: 600px; margin: 0 auto;">
            <div style="margin-bottom: 14px;">
                <img src="https://cannogacollege.ca/images/logo-cannoga.png" alt="Cannoga College" style="max-width: 90px; height: auto; display: block;" />
            </div>
            <div style="margin-bottom: 18px;">
                <img src="https://cannogacollege.ca/images/studies-hero.jpg" alt="Cannoga College" style="width: 100%; max-height: 190px; object-fit: cover; display: block;" />
            </div>
            <div style="font-size: 14px; color: #111111; line-height: 1.5;">
                ${contentHtml}
            </div>
            <div style="margin-top: 28px; padding-top: 14px; border-top: 1px solid #eeeeee; font-size: 12px; color: #666666; line-height: 1.45;">
                <p style="margin: 0 0 3px 0;"><strong>Cannoga College</strong></p>
                <p style="margin: 0 0 3px 0;">Ottawa, Ontario, Canada | admissions@cannogacollege.ca</p>
                <p style="margin: 0;">&copy; ${new Date().getFullYear()} Cannoga College. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

export interface TuitionVerificationEmailData {
    studentEmail: string;
    studentName: string;
    studentId?: string;
    courseTitle?: string;
    amount: number;
    currency?: string;
    invoiceType?: string;
    transactionReference?: string;
    receiptUrl?: string | null;
    receiptBuffer?: Buffer | null;
}

export async function sendTuitionPaymentVerifiedEmails(data: TuitionVerificationEmailData) {
    const currency = data.currency || 'CAD';
    const formattedAmount = `$${Number(data.amount).toLocaleString()} ${currency}`;
    const invoiceLabel = (data.invoiceType || 'TUITION').replace(/_/g, ' ');
    const portalUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cannogacollege.ca';

    // 1. Send Email to Student (Classic institutional layout)
    const studentHtml = wrapEmailTemplate(`
        <p>Dear ${data.studentName},</p>
        <p>Great news! We have officially verified and accepted your tuition wire payment of <strong>${formattedAmount}</strong> (${invoiceLabel}).</p>
        <p>Your enrolment status has been updated to <strong>ENROLLED & VERIFIED</strong>.</p>
        
        <div style="margin: 18px 0; padding: 14px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; line-height: 1.6;">
            <p style="margin: 0 0 4px 0;"><strong>Student Name:</strong> ${data.studentName}</p>
            ${data.studentId ? `<p style="margin: 0 0 4px 0;"><strong>Student ID:</strong> ${data.studentId}</p>` : ''}
            ${data.courseTitle ? `<p style="margin: 0 0 4px 0;"><strong>Programme:</strong> ${data.courseTitle}</p>` : ''}
            <p style="margin: 0 0 4px 0;"><strong>Payment Type:</strong> ${invoiceLabel}</p>
            <p style="margin: 0 0 4px 0;"><strong>Amount Paid:</strong> ${formattedAmount}</p>
            <p style="margin: 0 0 4px 0;"><strong>Reference / Tracking:</strong> ${data.transactionReference || 'N/A'}</p>
            <p style="margin: 0;"><strong>Status:</strong> VERIFIED & COMPLETED</p>
        </div>

        <p>Your official tuition payment receipt has been recorded and attached to this email notification for your official records.</p>

        <p style="margin: 16px 0; line-height: 1.8;">
            ${data.receiptUrl ? `&bull; <a href="${data.receiptUrl}" target="_blank">Download Official Tuition Receipt (PDF)</a><br>` : ''}
            &bull; <a href="${portalUrl}/portal/dashboard">Log In to Student Dashboard</a>
        </p>

        <p style="margin-top: 20px;">If you have any questions regarding your enrolment or courses, our admissions and student services teams are available to support you.</p>

        <p style="margin-top: 20px;">
            Warm regards,<br>
            <strong>Office of the Registrar & Finance</strong><br>
            Cannoga College<br>
            registrar@cannogacollege.ca<br>
            https://cannogacollege.ca
        </p>
    `);

    const attachments: any[] = [];
    if (data.receiptBuffer) {
        attachments.push({
            filename: `Tuition_Receipt_${data.studentName.replace(/\s+/g, '_')}.pdf`,
            content: data.receiptBuffer,
        });
    }

    const studentResult = await sendEmail({
        to: data.studentEmail,
        subject: `Tuition Payment Receipt & Verification — Cannoga College`,
        html: studentHtml,
        attachments: attachments.length > 0 ? attachments : undefined,
    });

    // 2. Send Alert to Admin (Classic alert layout)
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_NOTICACATION_EMAIL || 'unlymitedsoundz@gmail.com';
    const adminHtml = wrapEmailTemplate(`
        <p><strong>Payment Confirmation Alert</strong></p>
        <p>A wire payment has been officially verified and confirmed in Admin Finances.</p>
        
        <div style="margin: 18px 0; padding: 14px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; line-height: 1.6;">
            <p style="margin: 0 0 4px 0;"><strong>Student:</strong> ${data.studentName} (${data.studentEmail})</p>
            ${data.studentId ? `<p style="margin: 0 0 4px 0;"><strong>Student ID:</strong> ${data.studentId}</p>` : ''}
            ${data.courseTitle ? `<p style="margin: 0 0 4px 0;"><strong>Programme:</strong> ${data.courseTitle}</p>` : ''}
            <p style="margin: 0 0 4px 0;"><strong>Type:</strong> ${invoiceLabel}</p>
            <p style="margin: 0 0 4px 0;"><strong>Amount:</strong> ${formattedAmount}</p>
            <p style="margin: 0 0 4px 0;"><strong>Reference:</strong> ${data.transactionReference || 'N/A'}</p>
            <p style="margin: 0;"><strong>Timestamp:</strong> ${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })}</p>
        </div>

        <p style="margin: 16px 0; line-height: 1.8;">
            ${data.receiptUrl ? `&bull; <a href="${data.receiptUrl}" target="_blank">View Official Receipt (PDF)</a><br>` : ''}
            &bull; <a href="${portalUrl}/sis/admin/students">Open Student Information System</a>
        </p>

        <p style="margin-top: 20px;">The student payment has been officially verified, tuition receipt generated, and enrolled status updated.</p>
    `);

    let adminResult = null;
    if (adminEmail && adminEmail !== data.studentEmail) {
        adminResult = await sendEmail({
            to: adminEmail,
            subject: `[Cannoga ADMIN] Tuition Payment Verified: ${data.studentName} (${formattedAmount})`,
            html: adminHtml,
        });
    }

    return { studentResult, adminResult };
}

export async function triggerNotification(payload: {
    type?: string;
    table?: string;
    applicationId?: string;
    record?: any;
    old_record?: any;
    additionalData?: any;
}) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        console.warn('[triggerNotification] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
        return { success: false, error: 'Supabase credentials missing' };
    }

    try {
        const res = await fetch(`${supabaseUrl}/functions/v1/send-notification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${serviceRoleKey}`,
            },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        return { success: res.ok, data };
    } catch (err: any) {
        console.error('[triggerNotification] Error dispatching to edge function:', err);
        return { success: false, error: err.message };
    }
}


