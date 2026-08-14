
import { Resend } from 'resend';

interface SendEmailParams {
    to: string;
    subject: string;
    react: React.ReactElement;
    attachments?: {
        filename: string;
        content: Buffer | string;
    }[];
}

export async function sendEmail({ to, subject, react, attachments }: SendEmailParams) {
    const apiKey = process.env.RESEND_API_KEY;

    // If no API key is provided, log the email content (useful for dev/demo)
    if (!apiKey) {
        console.log('---------------------------------------------------');
        console.log(`[MOCK EMAIL SERVICE]`);
        console.log(`TO: ${to}`);
        console.log(`SUBJECT: ${subject}`);
        console.log(`ATTACHMENTS: ${attachments?.length || 0} files`);
        console.log(`BODY (React Component):`, react);
        console.log('---------------------------------------------------');
        return { success: true, id: 'mock-email-id' };
    }

    try {
        const resend = new Resend(apiKey);
        const { data, error } = await resend.emails.send({
            from: 'Cannoga College <admissions@cannogacollege.ca>',
            to: [to],
            subject: subject,
            react: react,
            attachments: attachments,
        });

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

export async function notifyAdmin({ subject, react }: { subject: string; react: React.ReactElement }) {
    const adminEmail = process.env.ADMIN_NOTICACATION_EMAIL || 'unlymitedsoundz@gmail.com';
    return sendEmail({
        to: adminEmail,
        subject: `[ADMIN ALERT] ${subject}`,
        react: react,
    });
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

