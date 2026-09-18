
import { Resend } from 'resend';

interface SendEmailParams {
    to: string;
    from?: string;
    subject: string;
    react?: React.ReactElement;
    html?: string;
    attachments?: {
        filename: string;
        content: Buffer | string;
    }[];
}

export async function sendEmail({ to, from, subject, react, html, attachments }: SendEmailParams) {
    const apiKey = process.env.RESEND_API_KEY;

    // If no API key is provided, log the email content (useful for dev/demo)
    if (!apiKey) {
        console.log('---------------------------------------------------');
        console.log(`[MOCK EMAIL SERVICE]`);
        console.log(`FROM: ${from || 'Cannoga College <admissions@cannogacollege.ca>'}`);
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
            from: from || 'Cannoga College <admissions@cannogacollege.ca>',
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

export interface PresidentWelcomeEmailData {
    studentEmail: string;
    studentFullName: string;
    studentId?: string;
    courseTitle?: string;
    intake?: string;
    portalUrl?: string;
}

export async function sendPresidentWelcomeEmail(data: PresidentWelcomeEmailData) {
    const portalUrl = data.portalUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://cannogacollege.ca';
    const fullName = data.studentFullName || 'Student';

    const welcomeHtml = wrapEmailTemplate(`
        <p>Dear ${fullName},</p>
        
        <p>On behalf of our distinguished faculty, dedicated staff, and the entire institutional community, it is my distinct honor and personal pleasure to officially welcome you to <strong>Cannoga College</strong>.</p>
        
        <p>Your admission and verified enrolment mark the beginning of an exceptional chapter in your academic and professional journey. At Cannoga College, we believe that education must do more than inform—it must transform. Located in Ottawa, Ontario, at the vibrant nexus of public innovation, healthcare excellence, technology, and industry leadership, our institution is dedicated to equipping you with applied knowledge, rigorous intellectual training, and the practical competencies necessary to excel in a rapidly evolving global landscape.</p>

        <div style="margin: 20px 0; padding: 16px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; line-height: 1.6;">
            <p style="margin: 0 0 5px 0;"><strong>Student Name:</strong> ${fullName}</p>
            ${data.studentId ? `<p style="margin: 0 0 5px 0;"><strong>Student ID:</strong> ${data.studentId}</p>` : ''}
            ${data.courseTitle ? `<p style="margin: 0 0 5px 0;"><strong>Programme of Study:</strong> ${data.courseTitle}</p>` : ''}
            ${data.intake ? `<p style="margin: 0 0 5px 0;"><strong>Academic Intake:</strong> ${data.intake}</p>` : ''}
            <p style="margin: 0 0 5px 0;"><strong>Enrolment Status:</strong> <span style="color: #034737; font-weight: bold;">OFFICIALLY ENROLLED & CONFIRMED</span></p>
            <p style="margin: 0;"><strong>Institution:</strong> Cannoga College | Ottawa, Ontario, Canada</p>
        </div>

        <p><strong>What Awaits You at Cannoga College</strong></p>
        <p>As an enrolled student, you are now an integral member of a diverse and dynamic academic body representing scholars and aspiring professionals from over 60 nations. Throughout your studies, you will have the privilege of learning from accomplished professors and industry practitioners who bring real-world experience directly into the classroom and specialized laboratories.</p>

        <p>Beyond academic coursework, you have full access to our comprehensive student support ecosystem, including:</p>
        <ul style="margin: 10px 0 16px 20px; padding: 0; line-height: 1.6; font-size: 14px;">
            <li><strong>Academic Advising & Faculty Mentorship:</strong> Dedicated guidance to ensure you achieve your academic and professional goals.</li>
            <li><strong>Career & Experiential Learning Services:</strong> Direct connections to industry internships, clinical placements, and career development opportunities across Canada.</li>
            <li><strong>International Student Support:</strong> Assistance with orientation, settlement in Ottawa, study permits, housing, and integration into Canadian society.</li>
            <li><strong>Digital Campus & Research Resources:</strong> 24/7 access to state-of-the-art course modules, digital libraries, and collaborative learning tools via our Student Portal.</li>
        </ul>

        <p><strong>Next Steps & Student Portal Access</strong></p>
        <p>Your official student dashboard is active. Please log in regularly to review your course timetable, orientation schedules, required pre-arrival materials, and institutional announcements:</p>

        <p style="margin: 16px 0; line-height: 1.8;">
            &bull; <a href="${portalUrl}/portal/dashboard"><strong>Access Cannoga Student Portal & Dashboard &rarr;</strong></a><br>
            &bull; <a href="${portalUrl}/portal/student/timetable">View Academic Timetable & Course Schedule</a><br>
            &bull; <a href="${portalUrl}/about/welcome-from-the-president">Read the President's Institutional Vision</a>
        </p>

        <p>We understand that choosing to pursue higher education is one of the most consequential commitments you will make. Please be assured that our faculty and staff are fully invested in your success, your wellbeing, and your future.</p>

        <p>I look forward to personally greeting you on campus and celebrating your milestones in the years ahead.</p>

        <div style="margin-top: 24px; padding-top: 14px; border-top: 1px solid #eeeeee;">
            <p style="margin: 0 0 8px 0;">With warmest regards and best wishes for your academic journey,</p>
            <div style="margin: 14px 0 8px 0;">
                <img src="https://lbkrzyqpdqgtqbodkcyi.supabase.co/storage/v1/object/public/application-documents/assets/president-signature.png" alt="Luke Schaffner Signature" style="max-height: 58px; width: auto; display: block;" />
            </div>
            <p style="margin: 6px 0 2px 0; font-size: 15px; font-weight: bold; color: #111111;">Dr. Luke Schaffner, Ph.D., M.Ed.</p>
            <p style="margin: 0 0 2px 0; color: #444444; font-size: 13px;">President & Chief Executive Officer</p>
            <p style="margin: 0 0 2px 0; color: #444444; font-size: 13px;">Cannoga College</p>
            <p style="margin: 0 0 2px 0; font-size: 13px;"><a href="mailto:president@cannogacollege.ca">president@cannogacollege.ca</a> | <a href="https://cannogacollege.ca">https://cannogacollege.ca</a></p>
            <p style="margin: 0; color: #666666; font-size: 12px;">Ottawa, Ontario, Canada</p>
        </div>
    `);

    return sendEmail({
        from: 'Office of the President <president@cannogacollege.ca>',
        to: data.studentEmail,
        subject: 'Welcome to Cannoga College — A Personal Message from the President',
        html: welcomeHtml,
    });
}


