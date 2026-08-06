
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Canonical intake start dates
const INTAKE_START_DATES: Record<string, string> = {
    'Fall 2026': '11.09.2026',
    'Winter 2027': '18.1.2027',
    'Fall 2027': '11.09.2027',
};

function getIntakeStartDate(intake?: string | null): string {
    return INTAKE_START_DATES[(intake || '').trim()] || '11.09.2026';
}

function getProgramYearsByLevel(level?: string): number {
    const lvl = (level || '').toUpperCase();
    if (lvl.includes('BACHELOR') || lvl.includes('BSC')) return 3;
    if (lvl.includes('MASTER') || lvl.includes('MSC')) return 2;
    if (lvl.includes('DIPLOMA')) return 2;
    if (lvl.includes('CERTICACATE')) return 1;
    return 1;
}

function addYearsToDate(dateStr: string, years: number): string {
    const parts = dateStr.split('.');
    const dayOrig = parts[0];
    const monthOrig = parts[1];
    const year = Number(parts[2]) + years;
    const fmt = (n: number, orig: string) =>
        orig.length === 2 && orig.startsWith('0') ? String(n).padStart(2, '0') : String(n);
    return `${fmt(Number(dayOrig), dayOrig)}.${fmt(Number(monthOrig), monthOrig)}.${year}`;
}

function getProgramEndDate(intake?: string | null, level?: string): string {
    return addYearsToDate(getIntakeStartDate(intake), getProgramYearsByLevel(level));
}

serve(async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

    try {
        const resendKey = Deno.env.get("RESEND_API_KEY");
        if (!resendKey) {
            console.error("Missing RESEND_API_KEY environment variable");
            return new Response(JSON.stringify({ error: "Email service not configured (Missing API Key)" }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const resend = new Resend(resendKey);
        const { record, old_record, type, table, applicationId, documentUrl, additionalData } = await req.json();

        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        let applicationData = record;

        // If applicationId is provided but no record, fetch it
        if (!applicationData && applicationId) {
                const { data: app } = await supabase
                    .from('applications')
                    .select('*, user:profiles(*), course:Course(title, degreeLevel)')
                    .eq('id', applicationId)
                    .single();


            if (app) {
                console.log(`[send-notification] Successfully fetched application data for ${applicationId}`);
                applicationData = {
                    ...app,
                    email: app.user?.email,
                    first_name: app.user?.first_name || app.personal_info?.firstName,
                    last_name: app.user?.last_name || app.personal_info?.lastName,
                    student_id: app.user?.student_id,
                    course_title: app.course?.title,
                    course_degree_level: app.course?.degreeLevel
                };

            } else {
                console.warn(`[send-notification] Application not found for ID: ${applicationId}`);
            }
        } else if (table === 'tuition_payments' && record) {
            // New: Resolve application from payment record
            const { data: offer } = await supabase
                .from('admission_offers')
                .select('application_id')
                .eq('id', record.offer_id)
                .single();

            if (offer?.application_id) {
                const { data: app } = await supabase
                    .from('applications')
                    .select('*, user:profiles(*), course:Course(title, degreeLevel)')
                    .eq('id', offer.application_id)
                    .single();


                if (app) {
                    applicationData = {
                        ...app,
                        email: app.user?.email,
                        first_name: app.user?.first_name || app.personal_info?.firstName,
                        last_name: app.user?.last_name || app.personal_info?.lastName,
                        student_id: app.user?.student_id,
                        course_title: app.course?.title,
                        course_degree_level: app.course?.degreeLevel
                    };

                }
            }
        }

        if (!applicationData && !record && !type) {
            return new Response(JSON.stringify({ message: "No record or type provided" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Determine notification type
        let notificationType = type;
        const status = applicationData?.status;
        const oldStatus = old_record?.status;

        if (!notificationType && (table === 'applications' || applicationId)) {
            if (status === 'SUBMITTED' && oldStatus !== 'SUBMITTED') {
                notificationType = 'APPLICATION_SUBMITTED';
            } else if (status === 'ADMITTED' && oldStatus !== 'ADMITTED') {
                notificationType = 'OFFER_LETTER_READY';
            } else if (status === 'OFFER_ACCEPTED' && oldStatus !== 'OFFER_ACCEPTED') {
                notificationType = 'OFFER_ACCEPTED';
            } else if ((status === 'ADMISSION_LETTER_GENERATED' && oldStatus !== 'ADMISSION_LETTER_GENERATED') ||
                (status === 'ENROLLED' && oldStatus !== 'ENROLLED') ||
                (record?.enrollment_status === 'Active' && old_record?.enrollment_status !== 'Active')) {
                notificationType = 'ADMISSION_LETTER_READY';
            } else if (status === 'REJECTED' && oldStatus !== 'REJECTED') {
                notificationType = 'APPLICATION_REJECTED';
            } else if (status === 'DOCS_REQUIRED' && oldStatus !== 'DOCS_REQUIRED') {
                notificationType = 'DOCS_REQUIRED';
            }
        }

        // New: Support for tuition_payments table trigger
        if (!notificationType && table === 'tuition_payments' && record) {
            if (record.status === 'verified' && old_record?.status !== 'verified') {
                notificationType = 'TUITION_PAYMENT_VERICAED';
            }
        }

        if (!notificationType) {
            return new Response(JSON.stringify({ message: "No notification action required" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Configuration
        const adminEmail = Deno.env.get("ADMIN_NOTICACATION_EMAIL") || "unlymitedsoundz@gmail.com";
        const sender = "Cannoga College <admissions@cannogacollege.ca>";

        // Fetch User Info if missing
        let userEmail = applicationData?.email;
        let firstName = applicationData?.first_name || 'Student';
        let fullName = `${firstName} ${applicationData?.last_name || ''}`.trim();

        if (!userEmail && applicationData?.user_id) {
            const { data: users } = await supabase
                .from('profiles')
                .select('email, first_name, last_name, student_id')
                .eq('id', applicationData.user_id)
                .single();

            if (users) {
                userEmail = users.email;
                firstName = users.first_name;
                fullName = `${users.first_name} ${users.last_name}`;
                applicationData.student_id = users.student_id;
            }
        }

        // Fetch Course Info if missing (when triggered directly from DB)
        if (!applicationData?.course_title && applicationData?.course_id) {
            const { data: courseData } = await supabase
                .from('Course')
                .select('title, degreeLevel')
                .eq('id', applicationData.course_id)
                .single();
            if (courseData) {
                applicationData.course_title = courseData.title;
                applicationData.course_degree_level = courseData.degreeLevel;
            }
        }

        let studentSubject = "";
        let studentHtml = "";
        let adminSubject = "";
        let adminHtml = "";

        const portalUrl = "https://cannogacollege.ca/portal";

        // Pre-compute tuition values for email templates
        const appNationality = (applicationData?.personal_info?.nationality || applicationData?.user?.country_of_residence || '').toLowerCase();
        const isAppDomestic = appNationality === 'finland' || appNationality === 'finnish' || appNationality === 'eu' || appNationality === 'domestic';
        const appDegreeLevel = (applicationData?.course_degree_level || '').toUpperCase();
        let appAnnualTuition = 2500;
        let appDepositTuition = 1250;
        if (appDegreeLevel.includes('CERTICACATE') || appDegreeLevel.includes('DIPLOMA')) {
            appAnnualTuition = isAppDomestic ? 1500 : 2500;
            appDepositTuition = isAppDomestic ? 750 : 1250;
        } else if (appDegreeLevel.includes('BACHELOR')) {
            appAnnualTuition = isAppDomestic ? 2500 : 4000;
            appDepositTuition = isAppDomestic ? 1250 : 2000;
        } else if (appDegreeLevel.includes('MASTER')) {
            appAnnualTuition = isAppDomestic ? 3500 : 6000;
            appDepositTuition = isAppDomestic ? 1750 : 3000;
        }

        switch (notificationType) {
            case 'APPLICATION_SUBMITTED':
                studentSubject = "Application In Review - Cannoga College";
                studentHtml = `
                    <p>Dear ${fullName},</p>
                    <p>Thank you for submitting your application to Cannoga College.</p>
                    <p>We are pleased to inform you that your application has been successfully received and is currently being reviewed by our admissions team.</p>
                    <p>All submitted documents will be carefully evaluated before a final decision is made. Please be assured that your application is active and under full consideration at this stage.</p>
                    <p>Provided that all required documents have been submitted correctly, you can expect to receive an admission decision within 3-5 days from your application date.</p>
                    <p>If any additional information or documentation is needed during the review process, you will be contacted promptly via this email address.</p>
                    <p>We appreciate your interest in Cannoga College and thank you for your patience. A formal decision will be communicated to you once the review process has been completed.</p>
                    <p>Kind regards,<br>
                    Admissions Office<br>
                    Cannoga College<br>
                    admissions@cannogacollege.ca<br>
                    https://cannogacollege.ca</p>
                `;
                adminSubject = `New Application: ${fullName}`;
                adminHtml = `
                    <h2>New Application Submitted</h2>
                    <p><strong>Student:</strong> ${fullName}</p>
                    <p><strong>Email:</strong> ${userEmail}</p>
                    <p><strong>Program:</strong> ${applicationData?.course_title || 'N/A'}</p>
                    <a href="https://cannogacollege.ca/admin/admissions" style="display:inline-block;background:#000;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">Process in Admin Panel</a>
                `;
                break;

            case 'OFFER_LETTER_READY':
                studentSubject = "Conditional Admission Offer - Cannoga College Next Steps";
                studentHtml = `
                    <img src="https://cannogacollege.ca/images/admissions/master-hero.png" alt="Cannoga College" style="width: 100%; height: 150px; object-fit: cover; margin-bottom: 20px;" />
                    <h1 style="text-align: center; font-size: 24px; margin: 20px 0;">Cannoga College Admission</h1>
                    <h2 style="text-align: center; font-size: 18px; margin-bottom: 15px;">Congratulations on Your Offer!</h2>
                    <p>Dear ${firstName},</p>
                    <p>We are delighted to inform you that you have been offered a conditional place to study at Cannoga College.</p>
                    <div style="margin: 20px 0;">
                        <p style="margin: 0 0 5px 0; font-weight: bold; text-decoration: underline;">Programme Details:</p>
                        <p style="margin: 0 0 5px 0;"><strong>Programme:</strong> ${applicationData?.course_title || 'Your Degree Programme'}</p>
                        <p style="margin: 0 0 5px 0;"><strong>Degree Level:</strong> ${applicationData?.course_degree_level === 'MASTER' ? "Master's Degree" : applicationData?.course_degree_level === 'BACHELOR' ? "Bachelor's Degree" : applicationData?.course_degree_level === 'DIPLOMA' ? "Ontario College Diploma" : applicationData?.course_degree_level === 'CERTICACATE' ? "Canadian Certificate" : "Bachelor's Degree"}</p>
                        <p style="margin: 0 0 5px 0;"><strong>Intake:</strong> ${applicationData?.intake || 'Fall 2026'}</p>
                        <p style="margin: 0 0 5px 0;"><strong>Duration:</strong> ${getIntakeStartDate(applicationData?.intake)} - ${getProgramEndDate(applicationData?.intake, applicationData?.course_degree_level)}</p>
                        <p style="margin: 0 0 5px 0;"><strong>Total Credits:</strong> ${applicationData?.course_degree_level === 'MASTER' ? '60 Credits' : applicationData?.course_degree_level === 'BACHELOR' ? '90 Credits' : applicationData?.course_degree_level === 'DIPLOMA' ? '60 Credits' : '30 Credits'}</p>
                    </div>
                    <div style="margin: 20px 0;">
                        <p style="margin: 0 0 5px 0; font-weight: bold; text-decoration: underline;">Financial Summary (1st Year):</p>
                        <p style="margin: 0 0 5px 0;">Annual Tuition Fee: $${appAnnualTuition.toLocaleString()} CAD</p>
                        <p style="margin: 0 0 5px 0;">Net First Year Fee: $${appAnnualTuition.toLocaleString()} CAD</p>
                        <p style="margin: 0; font-weight: bold;">Tuition Deposit (50% to Secure Place): $${appDepositTuition.toLocaleString()} CAD</p>
                    </div>
                    <div style="margin: 20px 0;">
                        <p><strong>What Does a Conditional Offer Mean?</strong></p>
                        <p>A conditional offer means that you have a place reserved for you, provided you meet certain conditions. In most cases, the primary condition is the payment of your tuition fee deposit or the submission of final verified academic documents.</p>
                    </div>
                    <div style="margin: 20px 0;">
                        <p><strong>Your Next Steps</strong></p>
                        <p>To secure your place, please complete the following steps:</p>
                        <ul>
                            <li>Review Your Letter of Acceptance (LOA): Log in to your student dashboard to carefully read the terms of your conditional offer.</li>
                            <li>Accept Your Offer: Confirm your acceptance of the offer in the portal.</li>
                            <li>Fulfill Your Conditions: Fulfill the conditions outlined in your Letter of Acceptance (LOA) (such as paying your tuition fee deposit). Once the conditions are met, your offer will become unconditional, and your Official Admission Letter will be issued.</li>
                        </ul>
                    </div>
                    <div style="text-align: center;"><a href="https://cannogacollege.ca/portal" style="display: inline-block; background: #034737; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Log In and View Letter of Acceptance</a></div>
                    <p>Important Request: Please act promptly to accept your offer and fulfill the conditions, as places are limited and allocated on a first-come, first-served basis once conditions are met.</p>
                    <p>We are very impressed by your application and look forward to welcoming you to our creative community in Canada.</p>
                    <p>Warm regards,</p>
                    <p>Admissions Office</p>
                    <p>Cannoga College</p>
                    <p>admissions@cannogacollege.ca</p>
                    <p>https://cannogacollege.ca</p>
                `;
                // Admin already likely knows (triggered by status change), but can send alert if needed
                break;

            case 'OFFER_ACCEPTED':
                adminSubject = `Offer Accepted: ${fullName}`;
                adminHtml = `
                    <h2>Offer Acceptance Notification</h2>
                    <p><strong>Student:</strong> ${fullName}</p>
                    <p><strong>ID:</strong> ${applicationData?.student_id || 'N/A'}</p>
                    <p><strong>Program:</strong> ${applicationData?.course_title || 'N/A'}</p>
                    <p>The student has officially accepted their admission offer.</p>
                `;
                break;

            case 'ADMISSION_LETTER_READY':
                // Skip sending email if student was manually enrolled by admin
                if (applicationData?.manually_enrolled) {
                    break;
                }
                studentSubject = "Congratulations on Your Admission to Cannoga College – Next Steps";
                studentHtml = `
                    <img src="https://cannogacollege.ca/images/admissions/master-hero.png" alt="Cannoga College" style="width: 100%; height: 150px; object-fit: cover; margin-bottom: 20px;" />
                    <h1 style="text-align: center; font-size: 24px; margin: 20px 0;">Cannoga College Admission</h1>
                    <h2 style="text-align: center; font-size: 18px; margin-bottom: 15px;">Congratulations!</h2>
                    <p>Dear ${firstName},</p>
                    <p>We are delighted to officially confirm your admission to Cannoga College following the successful confirmation of your tuition payment.</p>
                    <p>You have been admitted to study:</p>
                    <div style="margin: 20px 0;">
                        <p style="margin: 0 0 5px 0; font-weight: bold; text-decoration: underline;">Enrolment Details:</p>
                        <p style="margin: 0 0 5px 0;"><strong>Programme:</strong> ${applicationData?.course_title || 'Your Degree Programme'}</p>
                        <p style="margin: 0 0 5px 0;"><strong>Degree Level:</strong> ${applicationData?.course_degree_level === 'MASTER' ? "Master's Degree" : applicationData?.course_degree_level === 'BACHELOR' ? "Bachelor's Degree" : applicationData?.course_degree_level === 'DIPLOMA' ? "Ontario College Diploma" : applicationData?.course_degree_level === 'CERTICACATE' ? "Canadian Certificate" : "Bachelor's Degree"}</p>
                        <p style="margin: 0 0 5px 0;"><strong>Intake:</strong> ${applicationData?.intake || 'Fall 2026'}</p>
                        <p style="margin: 0 0 5px 0;"><strong>Duration:</strong> ${getIntakeStartDate(applicationData?.intake)} - ${getProgramEndDate(applicationData?.intake, applicationData?.course_degree_level)}</p>
                        <p style="margin: 0 0 5px 0;"><strong>Total Credits:</strong> ${applicationData?.course_degree_level === 'MASTER' ? '60 Credits' : applicationData?.course_degree_level === 'BACHELOR' ? '90 Credits' : applicationData?.course_degree_level === 'DIPLOMA' ? '60 Credits' : '30 Credits'}</p>
                        <p style="margin: 0;"><strong>Student ID:</strong> ${applicationData?.student_id || ''}</p>
                    </div>
                    <p>This marks a significant milestone, and we are confident that you will thrive academically and personally as part of the Cannoga community.</p>
                    <div style="margin: 20px 0;">
                        <p><strong>What Happens Next</strong></p>
                        <p>Now that your admission has been secured, you will begin the next critical phase of your journey – your Study Permit (Residence Permit) application.</p>
                        <p>You will receive the following in your student dashboard shortly:</p>
                        <ul>
                            <li>Your Official Admission Letter</li>
                            <li>Your Tuition Payment Receipt</li>
                            <li>Visa/Study Permit Guidance Documents</li>
                            <li>Instructions for your Residence Permit (RP) application</li>
                            <li>Accommodation details and options</li>
                            <li>Pre-arrival and onboarding information</li>
                        </ul>
                    </div>
                    <div style="margin: 20px 0;">
                        <p><strong>Your Immediate Next Steps</strong></p>
                        <p>To ensure a smooth process, please follow these steps carefully:</p>
                        <ul>
                            <li>Download Your Documents: Log in to your application dashboard and download all issued documents.</li>
                            <li>Begin Your Study Permit Application: Apply for your Canadian study permit for studies via the official immigration portal.</li>
                            <li>Book Your VFS Appointment: Schedule and attend your biometric appointment at the nearest VFS center.</li>
                            <li>Prepare Required Documents: Ensure you have: valid international passport, proof of funds, health insurance, and academic documents.</li>
                            <li>Follow All Guidance Provided: Our team will support you throughout this process to ensure accuracy and success.</li>
                        </ul>
                    </div>
                    <p>Log In to Your Dashboard</p>
                    <div style="margin: 20px 0;">
                        <p><strong>Accommodation & Student Life</strong></p>
                        <p>At Cannoga College, we ensure that your transition into Canada is as seamless as possible.</p>
                        <p>Once your payment is confirmed, your accommodation information will be made available in your dashboard, including:</p>
                        <ul>
                            <li>Student housing options (shared and private apartments)</li>
                            <li>Estimated monthly costs</li>
                            <li>Location and proximity to campus</li>
                            <li>Application guidance for housing providers</li>
                        </ul>
                        <p>Canada offers a safe, modern, and student-friendly environment, with excellent public services, efficient transport systems, and a high quality of life.</p>
                    </div>
                    <div style="margin: 20px 0;">
                        <p><strong>What to Look Forward To at Cannoga College</strong></p>
                        <p>As a Cannoga student, you will experience:</p>
                        <ul>
                            <li>A globally relevant curriculum designed for modern careers</li>
                            <li>A diverse and international student community</li>
                            <li>Career-focused learning with practical insights</li>
                            <li>Access to student support services and academic guidance</li>
                            <li>Opportunities to build a strong professional network in Europe</li>
                        </ul>
                        <p>You will also gain exposure to Canada's innovation-driven ecosystem, positioning you for global opportunities after graduation.</p>
                    </div>
                    <p>Important Note: As a confirmed student for the ${applicationData?.intake || 'Fall 2026'} intake, it is essential that you proceed with your study permit application immediately, as timelines are strict and processing times must be carefully considered.</p>
                    <p>We are excited to have you join Cannoga College and look forward to supporting you every step of the way.</p>
                    <p>Welcome to your next chapter.</p>
                    <div style="text-align: center;"><a href="https://cannogacollege.ca/portal/student" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Enter student Portal</a></div>
                    <p>Warm regards,</p>
                    <p>Admissions Office</p>
                    <p>Cannoga College</p>
                    <p>admissions@cannogacollege.ca</p>
                    <p>https://cannogacollege.ca</p>
                `;
                break;

            case 'PAYMENT_RECEIVED':
                studentSubject = "Payment Received - Pending Verification";
                const isHousingRec2 = additionalData?.paymentType === 'HOUSING';
                const paymentAncillaryFees = Array.isArray(additionalData?.ancillaryFees) ? additionalData.ancillaryFees : [];
                const totalAncillary2 = paymentAncillaryFees.reduce((acc: number, item: any) => acc + (item.amount || 0), 0);
                const baseAmount = additionalData?.amount || 0;
                const totalPaid = baseAmount + totalAncillary2;
                const formattedTotal2 = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(totalPaid);
                const formattedBase = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(baseAmount);
                
                let paymentAncillaryHtml = '';
                if (!isHousingRec2 && paymentAncillaryFees.length > 0) {
                    paymentAncillaryHtml = `
                    <p style="font-weight: bold; margin-bottom: 12px; font-size: 13px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em;">Payment Breakdown:</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #e5e7eb; gap: 24px;">
                        <span style="font-size: 13px; color: #4b5563; flex: 1;">Base Amount</span>
                        <span style="font-size: 13px; font-weight: 600; color: #111827; text-align: right;">${formattedBase}</span>
                    </div>
                    `;
                    paymentAncillaryFees.forEach((fee: any) => {
                        const formattedFee = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(fee.amount || 0);
                        paymentAncillaryHtml += `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #e5e7eb; gap: 24px;">
                            <span style="font-size: 13px; color: #4b5563; flex: 1;">${fee.name}</span>
                            <span style="font-size: 13px; font-weight: 600; color: #111827; text-align: right;">${formattedFee}</span>
                        </div>
                        `;
                    });
                    paymentAncillaryHtml += `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; margin-top: 8px; border-top: 2px solid #111827; gap: 24px;">
                            <span style="font-size: 14px; font-weight: 900; color: #111827; text-transform: uppercase; flex: 1;">Total</span>
                            <span style="font-size: 14px; font-weight: 900; color: #111827; text-align: right;">${formattedTotal2}</span>
                        </div>
                    `;
                }
                
                studentHtml = `
                    <img src="https://cannogacollege.ca/images/admissions/master-hero.png" alt="Cannoga College" style="width: 100%; height: 150px; object-fit: cover; margin-bottom: 20px;" />
                    <h1>Payment Received</h1>
                    <p>Hello ${firstName}, we have received your payment of <strong>${formattedTotal2}</strong>.</p>
                    <p><strong>Reference:</strong> ${additionalData?.reference || 'N/A'}</p>
                    ${paymentAncillaryHtml}
                    <p>Our team is now verifying the transaction. This usually takes 1-2 business days. You will receive another email once your ${isHousingRec2 ? 'housing' : 'enrollment'} is confirmed.</p>
                `;
                adminSubject = `New Payment (Pending): ${fullName}`;
                adminHtml = `
                    <h2>Payment Verification Required</h2>
                    <p><strong>From:</strong> ${fullName}</p>
                    <p><strong>Amount:</strong> ${formattedTotal2}</p>
                    <p><strong>Ref:</strong> ${additionalData?.reference || 'N/A'}</p>
                    <p><strong>Type:</strong> ${additionalData?.paymentType || 'TUITION'}</p>
                    <a href="https://cannogacollege.ca/admin/registrar" style="display:inline-block;background:#000;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">Verify in Registrar Panel</a>
                `;
                break;

            case 'TUITION_PAYMENT_VERICAED':
                studentSubject = "Payment Verified - Enrollment Confirmed!";
                studentHtml = `
                    <img src="https://cannogacollege.ca/images/admissions/master-hero.png" alt="Cannoga College" style="width: 100%; height: 150px; object-fit: cover; margin-bottom: 20px;" />
                    <h1 style="color: #034737; font-size: 24px; margin: 20px 0;">Payment Verified!</h1>
                    <p>Hello ${firstName},</p>
                    <p>Great news! Your tuition payment has been officially verified by our registrar's office.</p>
                    <p><strong>Status:</strong> ENROLLED</p>
                    <p>You can now log in to the student portal to access your official admission letter, payment receipt, and other academic resources.</p>
                    <a href="${portalUrl}/dashboard" style="display:inline-block;background:#034737;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;font-weight:bold;">Student Dashboard</a>
                `;
                adminSubject = `Payment Verified: ${fullName}`;
                adminHtml = `
                    <h2>Payment Confirmation</h2>
                    <p><strong>Student:</strong> ${fullName}</p>
                    <p><strong>Amount:</strong> ${record?.amount} ${record?.currency || 'CAD'}</p>
                    <p><strong>Ref:</strong> ${record?.transaction_reference || 'N/A'}</p>
                    <p>The student has been officially enrolled and their documents have been prepared.</p>
                `;
                break;

            case 'HOUSING_SUBMITTED':
                studentSubject = "Housing Application Received - Cannoga College";
                studentHtml = `
                    <h1>Housing Request Received</h1>
                    <p>Hello ${firstName}, thank you for applying for student housing.</p>
                    <p>Our housing department will review your preferences and contact you with availability and next steps.</p>
                `;
                adminSubject = `New Housing Application: ${fullName}`;
                adminHtml = `
                    <h2>Housing Request Alert</h2>
                    <p><strong>Student:</strong> ${fullName}</p>
                    <p><strong>Semester:</strong> ${additionalData?.semesterName || 'N/A'}</p>
                    <p><strong>Building Pref:</strong> ${additionalData?.preferredBuilding || 'N/A'}</p>
                    <p><strong>Move-in:</strong> ${additionalData?.moveInDate || 'N/A'}</p>
                    <a href="https://cannogacollege.ca/admin/housing" style="display:inline-block;background:#000;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">Manage Housing</a>
                `;
                break;
            
            case 'HOUSING_ASSIGNED':
                studentSubject = "Your Housing Assignment is Ready! - Cannoga College";
                studentHtml = `
                    <div style="text-align: center; margin-bottom: 25px;">
                        <img src="https://cannogacollege.ca/images/admissions/master-hero.png" alt="Housing" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;" />
                    </div>
                    <h1 style="color: #000; font-size: 24px; margin-bottom: 20px;">Housing Confirmed!</h1>
                    <p>Hello ${firstName},</p>
                    <p>We are excited to inform you that your student housing has been assigned at <strong>${additionalData?.buildingName || 'your assigned building'}</strong>.</p>
                    
                    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 25px 0;">
                        <p style="margin: 0 0 10px 0; font-size: 14px;"><strong>Room Details:</strong></p>
                        <p style="margin: 0 0 5px 0; font-size: 13px;">Building: ${additionalData?.buildingName}</p>
                        <p style="margin: 0 0 5px 0; font-size: 13px;">Room: #${additionalData?.roomNumber}</p>
                        <p style="margin: 0 0 5px 0; font-size: 13px;">Move-in Date: ${additionalData?.startDate}</p>
                    </div>

                    <p>You can now view your housing details, download your receipt, and check arrival instructions in the student portal.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://cannogacollege.ca/portal/student/housing" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Housing Dashboard</a>
                    </div>
                    
                    <p>We look forward to welcoming you to campus!</p>
                `;
                break;

            case 'APPLICATION_REJECTED':
                studentSubject = "Application Update - Cannoga College";
                studentHtml = `
                    <p>Dear ${firstName},</p>
                    <p>Thank you for your interest in Cannoga College. After careful review of your application, we regret to inform you that we cannot offer you admission at this time.</p>
                    <p>We wish you the best in your future creative endeavors.</p>
                `;
                break;
            case 'DOCS_REQUIRED':
                studentSubject = "Action Required: Documents Requested - Cannoga College";
                const docsList = (additionalData?.requestedDocuments as string[]) ||
                    (applicationData?.requested_documents as string[]) || [];
                const note = additionalData?.note || applicationData?.document_request_note || "";

                studentHtml = `
                    <h1 style="color: #9333ea;">Action Required: Documents Requested</h1>
                    <p>Dear ${firstName},</p>
                    <p>The admissions team has reviewed your application for <strong>${applicationData?.course_title || 'your program'}</strong> and requires additional information to proceed.</p>
                    
                    ${note ? `
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #eaeaea; margin: 20px 0;">
                        <p style="text-transform: uppercase; font-size: 11px; font-weight: bold; color: #666; margin-bottom: 8px; letter-spacing: 0.05em;">Message from Admissions:</p>
                        <p style="font-style: italic; margin: 0; color: #1a1a1a;">"${note}"</p>
                    </div>
                    ` : ''}

                    ${docsList.length > 0 ? `
                    <div style="margin: 20px 0;">
                        <p style="font-weight: bold; margin-bottom: 10px;">Required Documents:</p>
                        <ul>
                            ${docsList.map((doc: string) => `<li>${doc.replaceAll('_', ' ')}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}

                    <p>Please log in to your portal dashboard to upload the missing documents.</p>
                    <a href="${portalUrl}/dashboard" style="display:inline-block;background:#9333ea;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Upload Documents</a>
                `;
                break;
            case 'INVOICE_READY':
                const rawInvType = additionalData?.invoiceType || 'TUITION_DEPOSIT';
                const invType = rawInvType.split('_').map((word: string) => 
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                ).join(' ');
                const invAmt = additionalData?.amount ? new Intl.NumberFormat('en-IE', { style: 'currency', currency: additionalData?.currency || 'CAD', maximumFractionDigits: 0 }).format(additionalData.amount) : 'TBD';
                const invHero = "https://cannogacollege.ca/images/admissions/master-hero.png";
                const ancillaryFees = Array.isArray(additionalData?.ancillaryFees) ? additionalData.ancillaryFees : [
                    { name: 'Student Activity Fee', amount: 100 },
                    { name: 'Technology Fee', amount: 100 },
                    { name: 'Athletics and Recreation Fee', amount: 100 },
                    { name: 'Convocation Fee', amount: 100 },
                    { name: 'Student Counselling Fee', amount: 100 },
                    { name: 'Program Transcript Fee', amount: 100 },
                    { name: 'Student Experience Fee', amount: 100 }
                ];
                const totalAncillary = ancillaryFees.reduce((acc: number, item: any) => acc + (item.amount || 0), 0);
                const invoiceTotal = (additionalData?.amount || 0) + totalAncillary;
                const formattedTotal = new Intl.NumberFormat('en-IE', { style: 'currency', currency: additionalData?.currency || 'CAD', maximumFractionDigits: 0 }).format(invoiceTotal);

                studentSubject = `${invType} Invoice Ready for Payment - Cannoga College`;
                
                let ancillaryHtml = '';
                ancillaryFees.forEach((fee: any) => {
                    ancillaryHtml += `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
                            <p style="color: #6b7280; font-size: 12px; margin: 0;">${fee.name}</p>
                            <p style="color: #111827; font-size: 12px; font-weight: 600; margin: 0;">$ ${(fee.amount || 0).toLocaleString()}</p>
                        </div>
                    `;
                });
                
                studentHtml = `
                    <div style="text-align: center; margin-bottom: 25px;">
                        <img src="${invHero}" alt="Cannoga College" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;" />
                    </div>
                    
                    <h1 style="text-align: center; font-size: 24px; margin: 20px 0; color: #1a1a1a;">Billing & Payments</h1>
                    <h2 style="text-align: center; font-size: 18px; margin-bottom: 15px; color: #4b5563; font-weight: normal;">Invoice Ready for Payment</h2>
                    
                    <p>Dear ${firstName},</p>
                    <p>Your ${invType.toLowerCase()} invoice for the <strong>${applicationData?.course_title || 'degree programme'}</strong> has been generated and is now ready for payment.</p>
                    
                    <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #f3f4f6;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;">
                            <p style="color: #6b7280; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">Invoice Type</p>
                            <p style="color: #111827; font-size: 14px; font-weight: bold; margin: 0;">${invType}</p>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 4px; margin-bottom: 10px;">
                            <p style="color: #6b7280; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">Base Tuition</p>
                            <p style="color: #111827; font-size: 14px; font-weight: bold; margin: 0;">${invAmt}</p>
                        </div>
                        ${ancillaryHtml}
                        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; margin-top: 10px; border-top: 2px solid #e5e7eb;">
                            <p style="color: #111827; font-size: 14px; font-weight: 900; margin: 0; text-transform: uppercase;">Total Due</p>
                            <p style="color: #111827; font-size: 20px; font-weight: 900; margin: 0;">${formattedTotal}</p>
                        </div>
                    </div>
                    
                    <p>Please proceed to your student portal to complete the payment and secure your place in the programme.</p>
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="https://cannogacollege.ca/portal/application/payment" style="display:inline-block;background:#000000;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Pay Invoice Securely</a>
                    </div>
                    <p>If you have any questions or encounter issues, please contact our Finance Department.</p>
                `;
                
                adminSubject = `Invoice Sent: ${invType} - ${fullName}`;
                adminHtml = `
                    <h2>Invoice Notification Sent</h2>
                    <p><strong>Student:</strong> ${fullName}</p>
                    <p><strong>Type:</strong> ${invType}</p>
                    <p><strong>Base Amount:</strong> ${invAmt}</p>
                    <p><strong>Ancillary Fees:</strong> $${totalAncillary.toLocaleString()}</p>
                    <p><strong>Total:</strong> ${formattedTotal}</p>
                    <p>An email notification has been sent to the student regarding their ready invoice.</p>
                `;
                break;
        }

        // Email Wrapper Helper
        const wrapHtml = (content: string) => `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="color-scheme" content="light dark">
                <meta name="supported-color-schemes" content="light dark">
                <style>
                    :root { color-scheme: light dark; }
                    @media (prefers-color-scheme: dark) {
                        .logo { filter: invert(1) !important; }
                    }
                </style>
            </head>
            <body>
            <div class="email-container" style="font-family: 'Inter', -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, sans-serif; max-width: 600px; margin: 10px auto; padding: 15px 10px; background: #ffffff;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://cannogacollege.ca/images/logo-cannoga.png" class="logo" style="width: 100%; height: auto; max-width: 160px;" />
                </div>
                <div style="color: #1a1a1a; line-height: 1.5; font-size: 15px;">
                    ${content}
                </div>
                <hr style="border: 0; border-top: 1px solid #f0f0f0; margin: 30px 0;">
                <div style="text-align: center; color: #888; font-size: 11px;">
                    <p>&copy; ${new Date().getFullYear()} Cannoga College</p>
                    <p style="margin-bottom: 15px;">Ottawa, Ontario, Canada | +1 (613) 555-0181 | info@cannogacollege.ca</p>
                    <div style="margin-top: 15px;">
                        <a href="https://www.instagram.com/cannogacollege" style="color: #888; text-decoration: none; margin: 0 8px; font-weight: bold;">Instagram</a>
                        <a href="https://www.tiktok.com/@cannogacollege" style="color: #888; text-decoration: none; margin: 0 8px; font-weight: bold;">TikTok</a>
                    </div>
                </div>
            </div>
            </body>
            </html>
        `;

        let studentSuccess = true;
        let adminSuccess = true;
        const errors = [];

        // Send Student Email if applicable
        if (studentSubject && userEmail) {
            console.log(`[send-notification] Sending student email to: ${userEmail} (Subject: ${studentSubject})`);
            
            const finalHtml = notificationType === 'APPLICATION_SUBMITTED' 
                ? studentHtml 
                : wrapHtml(studentHtml);
                
            const { data, error } = await resend.emails.send({
                from: sender,
                to: [userEmail],
                subject: studentSubject,
                html: finalHtml,
            });
            if (error) {
                console.error(`[send-notification] Resend Student Error:`, error);
                studentSuccess = false;
                errors.push({ type: 'student', error });
            } else {
                console.log(`[send-notification] Student email sent successfully. ID: ${data?.id}`);
            }
        } else {
            console.warn(`[send-notification] Warning: No subject (${studentSubject}) or email (${userEmail}) for student notification.`);
        }

        // Send Admin Email if applicable
        if (adminSubject && adminEmail) {
            console.log(`[send-notification] Sending admin email to: ${adminEmail} (Subject: ${adminSubject})`);
            const { data, error } = await resend.emails.send({
                from: sender,
                to: [adminEmail],
                subject: `[Cannoga ADMIN] ${adminSubject}`,
                html: wrapHtml(adminHtml),
            });
            if (error) {
                console.error(`[send-notification] Resend Admin Error:`, error);
                adminSuccess = false;
                errors.push({ type: 'admin', error });
            } else {
                console.log(`[send-notification] Admin email sent successfully. ID: ${data?.id}`);
            }
        }

        if (!studentSuccess || !adminSuccess) {
            return new Response(JSON.stringify({ success: false, errors }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error: any) {
        console.error("Notification Error:", error);
        return new Response(JSON.stringify({ error: error.message || "An unknown error occurred" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});

