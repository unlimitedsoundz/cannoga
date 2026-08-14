
// @ts-nocheck
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
        const rawStatus = (applicationData?.status || '').toUpperCase();
        const rawOldStatus = (old_record?.status || '').toUpperCase();

        if (!notificationType || notificationType === 'INSERT' || notificationType === 'UPDATE') {
            if (table === 'applications' || applicationId) {
                if (rawStatus === 'SUBMITTED' || rawStatus === 'SUBMIT') {
                    notificationType = 'APPLICATION_SUBMITTED';
                } else if (rawStatus === 'OFFER_ISSUED' || rawStatus === 'ADMITTED') {
                    notificationType = 'OFFER_LETTER_READY';
                } else if (rawStatus === 'OFFER_ACCEPTED') {
                    notificationType = 'OFFER_ACCEPTED';
                } else if (rawStatus === 'ADMISSION_LETTER_GENERATED' || rawStatus === 'ENROLLED' || record?.enrollment_status === 'Active') {
                    notificationType = 'ADMISSION_LETTER_READY';
                } else if (rawStatus === 'REJECTED') {
                    notificationType = 'APPLICATION_REJECTED';
                } else if (rawStatus === 'DOCS_REQUIRED') {
                    notificationType = 'DOCS_REQUIRED';
                } else {
                    notificationType = null;
                }
            } else if (table === 'profiles') {
                notificationType = 'USER_REGISTRATION';
            } else if (table === 'module_enrollments') {
                notificationType = 'MODULE_REGISTRATION';
            } else if (table === 'tuition_payments') {
                notificationType = 'TUITION_PAYMENT_VERIFIED';
            }
        }

        if (!notificationType) {
            return new Response(JSON.stringify({ message: "No notification action required" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Configuration
        const adminEmail = Deno.env.get("ADMIN_NOTIFICATION_EMAIL") || "unlymitedsoundz@gmail.com";
        const sender = Deno.env.get("SENDER_EMAIL") || "Cannoga College <onboarding@resend.dev>";

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
        const studentAttachments: any[] = [];

        const portalUrl = "https://cannogacollege.ca/portal";

        // Pre-compute tuition values for email templates
        const appNationality = (applicationData?.personal_info?.nationality || applicationData?.user?.country_of_residence || '').toLowerCase();
        const isAppDomestic = appNationality === 'finland' || appNationality === 'finnish' || appNationality === 'eu' || appNationality === 'domestic';
        const appDegreeLevel = (applicationData?.course_degree_level || '').toUpperCase();
        let appAnnualTuition = 6400;
        const appDepositTuition = 2000;
        if (appDegreeLevel.includes('CERTICACATE') || appDegreeLevel.includes('DIPLOMA')) {
            appAnnualTuition = isAppDomestic ? 2400 : 4000;
        } else if (appDegreeLevel.includes('BACHELOR')) {
            appAnnualTuition = isAppDomestic ? 4000 : 6400;
        } else if (appDegreeLevel.includes('MASTER')) {
            appAnnualTuition = isAppDomestic ? 5600 : 9600;
        }

        switch (notificationType) {
            case 'USER_REGISTRATION':
                studentSubject = "Welcome to Cannoga College — Account Created";
                studentHtml = `
                    <p>Dear ${fullName},</p>
                    <p>Welcome to Cannoga College! Your student portal account has been successfully created.</p>
                    <p>You can now log in to complete your program application, track your admission status, or access student services.</p>
                    <p><a href="${portalUrl}">Access Student Portal</a></p>
                    <p>If you have any questions, our Admissions Office is here to help.</p>
                    <p>Warm regards,<br>Cannoga College Admissions Office</p>
                `;
                adminSubject = `New Portal Registration: ${fullName}`;
                adminHtml = `
                    <h2>New Student Account Created</h2>
                    <p><strong>Name:</strong> ${fullName}</p>
                    <p><strong>Email:</strong> ${userEmail}</p>
                    <p>A new student has registered an account on the Cannoga portal.</p>
                    <p><a href="https://cannogacollege.ca/admin/registrar">View in Admin Registrar</a></p>
                `;
                break;

            case 'MODULE_REGISTRATION':
                studentSubject = "Course Module Registration Confirmation — Cannoga College";
                studentHtml = `
                    <p>Dear ${fullName},</p>
                    <p>Your course module registration has been recorded successfully.</p>
                    <p><strong>Status:</strong> REGISTERED</p>
                    <p>Please log in to your student portal to review your class timetable, LMS links, and course materials.</p>
                    <p><a href="${portalUrl}/student">View Course Timetable</a></p>
                    <p>Kind regards,<br>Office of the Registrar</p>
                `;
                adminSubject = `Module Registration: ${fullName}`;
                adminHtml = `
                    <h2>Course Module Registration Alert</h2>
                    <p><strong>Student:</strong> ${fullName}</p>
                    <p><strong>Email:</strong> ${userEmail}</p>
                    <p>The student has registered for a new academic course module.</p>
                `;
                break;

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
                    <p><a href="https://cannogacollege.ca/admin/admissions">Process in Admin Panel</a></p>
                `;
                break;

            case 'OFFER_LETTER_READY':
                studentSubject = "Letter of Acceptance (LOA) — Cannoga College";

                // Generate / Fetch LOA PDF and Download URL
                const offerAppId = applicationData?.id || record?.id || record?.application_id;
                let loaDocUrl = applicationData?.document_url || null;
                if (offerAppId) {
                    try {
                        const { data: pdfRes } = await supabaseAdmin.functions.invoke('generate-admission-letter', {
                            body: { applicationId: offerAppId, type: 'OFFER' }
                        });
                        if (pdfRes?.url) {
                            loaDocUrl = pdfRes.url;
                        }
                        if (pdfRes?.pdfBase64) {
                            studentAttachments.push({
                                filename: `Cannoga_Letter_of_Acceptance_${firstName || 'Student'}.pdf`,
                                content: pdfRes.pdfBase64
                            });
                            console.log(`[send-notification] Attached LOA PDF as base64 content.`);
                        } else if (loaDocUrl) {
                            try {
                                const fetchRes = await fetch(loaDocUrl);
                                if (fetchRes.ok) {
                                    const buf = await fetchRes.arrayBuffer();
                                    const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
                                    studentAttachments.push({
                                        filename: `Cannoga_Letter_of_Acceptance_${firstName || 'Student'}.pdf`,
                                        content: b64
                                    });
                                    console.log(`[send-notification] Fetched and attached LOA PDF from public URL as base64.`);
                                }
                            } catch (fErr) {
                                console.warn("[send-notification] Could not fetch public LOA PDF URL:", fErr);
                            }
                        }
                    } catch (err) {
                        console.error("[send-notification] Error generating LOA PDF attachment via function:", err);
                    }
                }

                if (!loaDocUrl && offerAppId) {
                    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
                    loaDocUrl = `${supabaseUrl}/storage/v1/object/public/application-documents/offer-letters/offer_letter_${offerAppId}.pdf`;
                }

                studentHtml = `
                    <p>Dear ${firstName},</p>
                    <p>I am delighted to inform you that you have been offered a conditional place to study at Cannoga College.</p>
                    <p><strong>Programme Details:</strong></p>
                    <p>Programme: ${applicationData?.course_title || 'Your Degree Programme'}</p>
                    <p>Degree Level: ${applicationData?.course_degree_level === 'MASTER' ? "Master's Degree" : applicationData?.course_degree_level === 'BACHELOR' ? "Bachelor's Degree" : applicationData?.course_degree_level === 'DIPLOMA' ? "Ontario College Diploma" : applicationData?.course_degree_level === 'CERTICACATE' ? "Canadian Certificate" : "Bachelor's Degree"}</p>
                    <p>Intake: ${applicationData?.intake || 'Fall 2026'}</p>
                    <p>Duration: ${getIntakeStartDate(applicationData?.intake)} - ${getProgramEndDate(applicationData?.intake, applicationData?.course_degree_level)}</p>
                    <p>Total Credits: ${applicationData?.course_degree_level === 'MASTER' ? '60 Credits' : applicationData?.course_degree_level === 'BACHELOR' ? '90 Credits' : applicationData?.course_degree_level === 'DIPLOMA' ? '60 Credits' : '30 Credits'}</p>
                    
                    <p><strong>Financial Summary (1st Year):</strong></p>
                    <p>Tuition Rate Classification: ${isAppDomestic ? 'Domestic (Canadian / EU Resident)' : 'International Student'}</p>
                    <p>Annual Tuition Fee (${isAppDomestic ? 'Domestic' : 'International'}): $${appAnnualTuition.toLocaleString()} CAD</p>
                    <p>Tuition Deposit (50% to Secure Place): $${appDepositTuition.toLocaleString()} CAD</p>

                    <p><strong>What Does a Conditional Offer Mean?</strong></p>
                    <p>A conditional offer means that you have a place reserved for you, provided you meet certain conditions. In most cases, the primary condition is the payment of your tuition fee deposit or the submission of final verified academic documents.</p>

                    <p><strong>Your Next Steps</strong></p>
                    <p>To secure your place, please complete the following steps:</p>
                    <ul>
                        <li>Review Your Letter of Acceptance (LOA): Log in to your student dashboard to carefully read the terms of your conditional offer.</li>
                        <li>Accept Your Offer: Confirm your acceptance of the offer in the portal.</li>
                        <li>Fulfill Your Conditions: Fulfill the conditions outlined in your Letter of Acceptance (LOA) (such as paying your tuition fee deposit). Once the conditions are met, you will be issued your Provincial Attestation Letter (PAL). Please allow 6-10 working days for issuance.</li>
                    </ul>

                    <p><a href="https://cannogacollege.ca/portal">Log In and View Letter of Acceptance</a></p>

                    <p>Important Request: Please act promptly to accept your offer and fulfill the conditions, as places are limited and allocated on a first-come, first-served basis once conditions are met.</p>
                    <p>We are very impressed by your application and look forward to welcoming you to our creative community in Canada.</p>
                    <p>Warm regards,<br>
                    Todd Banning<br>
                    International Admissions Officer<br>
                    admissions@cannogacollege.ca<br>
                    https://cannogacollege.ca</p>
                `;

                adminSubject = `Offer Issued: ${fullName}`;
                adminHtml = `
                    <h2>Conditional Admission Offer Issued</h2>
                    <p><strong>Student:</strong> ${fullName}</p>
                    <p><strong>Email:</strong> ${userEmail}</p>
                    <p><strong>Program:</strong> ${applicationData?.course_title || 'N/A'}</p>
                    <p>A conditional offer of admission has been sent to the student.</p>
                `;
                break;

            case 'OFFER_ACCEPTED':
                studentSubject = "Letter of Acceptance Confirmed — Cannoga College";

                const acceptedAppId = applicationData?.id || record?.id || record?.application_id;
                let acceptedDocUrl = applicationData?.document_url || null;
                if (acceptedAppId) {
                    try {
                        const { data: pdfRes } = await supabaseAdmin.functions.invoke('generate-admission-letter', {
                            body: { applicationId: acceptedAppId, type: 'OFFER' }
                        });
                        if (pdfRes?.url) {
                            acceptedDocUrl = pdfRes.url;
                        }
                        if (pdfRes?.pdfBase64) {
                            studentAttachments.push({
                                filename: `Cannoga_Letter_of_Acceptance_${firstName || 'Student'}.pdf`,
                                content: pdfRes.pdfBase64
                            });
                        } else if (acceptedDocUrl) {
                            try {
                                const fetchRes = await fetch(acceptedDocUrl);
                                if (fetchRes.ok) {
                                    const buf = await fetchRes.arrayBuffer();
                                    const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
                                    studentAttachments.push({
                                        filename: `Cannoga_Letter_of_Acceptance_${firstName || 'Student'}.pdf`,
                                        content: b64
                                    });
                                }
                            } catch (fErr) {
                                console.warn("[send-notification] Could not fetch accepted LOA PDF URL:", fErr);
                            }
                        }
                    } catch (err) {
                        console.error("[send-notification] Error retrieving LOA PDF for offer acceptance:", err);
                    }
                }

                if (!acceptedDocUrl && acceptedAppId) {
                    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
                    acceptedDocUrl = `${supabaseUrl}/storage/v1/object/public/application-documents/offer-letters/offer_letter_${acceptedAppId}.pdf`;
                }

                studentHtml = `
                    <p>Dear ${firstName},</p>
                    <p>Congratulations! Thank you for accepting your offer of admission to Cannoga College for the <strong>${applicationData?.course_title || 'degree programme'}</strong>.</p>
                    <p><strong>Fulfill Your Conditions:</strong> Fulfill the conditions outlined in your Letter of Acceptance (LOA) (such as paying your tuition fee deposit). Once the conditions are met, you will be issued your Provincial Attestation Letter (PAL). Please allow 6-10 working days for issuance.</p>
                    ${acceptedDocUrl ? `<p><a href="${acceptedDocUrl}" target="_blank">Download Official Letter of Acceptance (LOA PDF)</a></p>` : ''}
                    <p><a href="https://cannogacollege.ca/portal">Log In to Student Portal</a></p>
                    <p>Warm regards,<br>
                    Todd Banning<br>
                    International Admissions Officer<br>
                    admissions@cannogacollege.ca<br>
                    https://cannogacollege.ca</p>
                `;
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
                    <p>Dear ${firstName},</p>
                    <p>We are delighted to officially confirm your admission to Cannoga College following the successful confirmation of your tuition payment.</p>
                    <p>You have been admitted to study:</p>
                    <p><strong>Enrolment Details:</strong></p>
                    <p>Programme: ${applicationData?.course_title || 'Your Degree Programme'}</p>
                    <p>Degree Level: ${applicationData?.course_degree_level === 'MASTER' ? "Master's Degree" : applicationData?.course_degree_level === 'BACHELOR' ? "Bachelor's Degree" : applicationData?.course_degree_level === 'DIPLOMA' ? "Ontario College Diploma" : applicationData?.course_degree_level === 'CERTICACATE' ? "Canadian Certificate" : "Bachelor's Degree"}</p>
                    <p>Intake: ${applicationData?.intake || 'Fall 2026'}</p>
                    <p>Duration: ${getIntakeStartDate(applicationData?.intake)} - ${getProgramEndDate(applicationData?.intake, applicationData?.course_degree_level)}</p>
                    <p>Total Credits: ${applicationData?.course_degree_level === 'MASTER' ? '60 Credits' : applicationData?.course_degree_level === 'BACHELOR' ? '90 Credits' : applicationData?.course_degree_level === 'DIPLOMA' ? '60 Credits' : '30 Credits'}</p>
                    <p>Student ID: ${applicationData?.student_id || ''}</p>
                    
                    <p>This marks a significant milestone, and we are confident that you will thrive academically and personally as part of the Cannoga community.</p>
                    
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

                    <p><strong>Your Immediate Next Steps</strong></p>
                    <p>To ensure a smooth process, please follow these steps carefully:</p>
                    <ul>
                        <li>Download Your Documents: Log in to your application dashboard and download all issued documents.</li>
                        <li>Begin Your Study Permit Application: Apply for your Canadian study permit for studies via the official immigration portal.</li>
                        <li>Book Your VFS Appointment: Schedule and attend your biometric appointment at the nearest VFS center.</li>
                        <li>Prepare Required Documents: Ensure you have: valid international passport, proof of funds, health insurance, and academic documents.</li>
                        <li>Follow All Guidance Provided: Our team will support you throughout this process to ensure accuracy and success.</li>
                    </ul>

                    <p><strong>Accommodation & Student Life</strong></p>
                    <p>At Cannoga College, we ensure that your transition into Canada is as seamless as possible.</p>
                    <p>Once your payment is confirmed, your accommodation information will be made available in your dashboard, including student housing options, estimated monthly costs, location, and application guidance.</p>
                    <p>Canada offers a safe, modern, and student-friendly environment, with excellent public services, efficient transport systems, and a high quality of life.</p>

                    <p><strong>What to Look Forward To at Cannoga College</strong></p>
                    <ul>
                        <li>A globally relevant curriculum designed for modern careers</li>
                        <li>A diverse and international student community</li>
                        <li>Career-focused learning with practical insights</li>
                        <li>Access to student support services and academic guidance</li>
                    </ul>

                    <p>Important Note: As a confirmed student for the ${applicationData?.intake || 'Fall 2026'} intake, it is essential that you proceed with your study permit application immediately.</p>
                    <p>We are excited to have you join Cannoga College and look forward to supporting you every step of the way.</p>
                    <p><a href="https://cannogacollege.ca/portal/student">Enter Student Portal</a></p>
                    <p>Warm regards,<br><br>
                    Admissions Office<br><br>
                    Cannoga College<br><br>
                    admissions@cannogacollege.ca<br><br>
                    https://cannogacollege.ca</p>
                `;

                // Attach Official Admission Letter PDF if applicable
                const admAppId = applicationData?.id || record?.id || record?.application_id;
                if (admAppId) {
                    try {
                        const { data: pdfRes } = await supabaseAdmin.functions.invoke('generate-admission-letter', {
                            body: { applicationId: admAppId, type: 'ADMISSION' }
                        });
                        if (pdfRes?.pdfBase64) {
                            studentAttachments.push({
                                filename: `Cannoga_Official_Admission_Letter_${firstName || 'Student'}.pdf`,
                                content: pdfRes.pdfBase64
                            });
                            console.log(`[send-notification] Attached Official Admission Letter PDF as base64.`);
                        } else if (pdfRes?.url) {
                            try {
                                const fetchRes = await fetch(pdfRes.url);
                                if (fetchRes.ok) {
                                    const buf = await fetchRes.arrayBuffer();
                                    const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
                                    studentAttachments.push({
                                        filename: `Cannoga_Official_Admission_Letter_${firstName || 'Student'}.pdf`,
                                        content: b64
                                    });
                                }
                            } catch (fErr) {
                                console.warn("[send-notification] Could not fetch public admission letter URL:", fErr);
                            }
                        }
                    } catch (err) {
                        console.error("[send-notification] Error generating Admission Letter PDF attachment:", err);
                    }
                }

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

                studentHtml = `
                    <p>Hello ${firstName}, we have received your payment of <strong>${formattedTotal2}</strong>.</p>
                    <p><strong>Reference:</strong> ${additionalData?.reference || 'N/A'}</p>
                    <p>Our team is now verifying the transaction. This usually takes 1-2 business days. You will receive another email once your ${isHousingRec2 ? 'housing' : 'enrollment'} is confirmed.</p>
                `;
                adminSubject = `New Payment (Pending): ${fullName}`;
                adminHtml = `
                    <h2>Payment Verification Required</h2>
                    <p><strong>From:</strong> ${fullName}</p>
                    <p><strong>Amount:</strong> ${formattedTotal2}</p>
                    <p><strong>Ref:</strong> ${additionalData?.reference || 'N/A'}</p>
                    <p><strong>Type:</strong> ${additionalData?.paymentType || 'TUITION'}</p>
                    <p><a href="https://cannogacollege.ca/admin/registrar">Verify in Registrar Panel</a></p>
                `;
                break;

            case 'TUITION_PAYMENT_VERICAED':
                studentSubject = "Payment Verified - Enrollment Confirmed!";
                studentHtml = `
                    <p>Hello ${firstName},</p>
                    <p>Great news! Your tuition payment has been officially verified by our registrar's office.</p>
                    <p><strong>Status:</strong> ENROLLED</p>
                    <p>You can now log in to the student portal to access your official admission letter, payment receipt, and other academic resources.</p>
                    <p><a href="${portalUrl}/dashboard">Student Dashboard</a></p>
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
                    <p><a href="https://cannogacollege.ca/admin/housing">Manage Housing</a></p>
                `;
                break;

            case 'HOUSING_ASSIGNED':
                studentSubject = "Your Housing Assignment is Ready! - Cannoga College";
                studentHtml = `
                    <p>Hello ${firstName},</p>
                    <p>We are excited to inform you that your student housing has been assigned at <strong>${additionalData?.buildingName || 'your assigned building'}</strong>.</p>
                    <p>Building: ${additionalData?.buildingName || 'N/A'}</p>
                    <p>Room: #${additionalData?.roomNumber || 'N/A'}</p>
                    <p>Move-in Date: ${additionalData?.startDate || 'N/A'}</p>
                    <p><a href="https://cannogacollege.ca/portal/student/housing">View Housing Dashboard</a></p>
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
                    <p>Dear ${firstName},</p>
                    <p>The admissions team has reviewed your application for <strong>${applicationData?.course_title || 'your program'}</strong> and requires additional information to proceed.</p>
                    ${note ? `<p>Message from Admissions: "${note}"</p>` : ''}
                    ${docsList.length > 0 ? `
                    <p>Required Documents:</p>
                    <ul>
                        ${docsList.map((doc: string) => `<li>${doc.replaceAll('_', ' ')}</li>`).join('')}
                    </ul>
                    ` : ''}
                    <p><a href="${portalUrl}/dashboard">Upload Documents</a></p>
                `;
                break;

            case 'INVOICE_READY':
                const rawInvType = additionalData?.invoiceType || 'TUITION_DEPOSIT';
                const invType = rawInvType.split('_').map((word: string) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                ).join(' ');
                const invAmt = additionalData?.amount ? new Intl.NumberFormat('en-IE', { style: 'currency', currency: additionalData?.currency || 'CAD', maximumFractionDigits: 0 }).format(additionalData.amount) : 'TBD';
                const ancillaryFees = Array.isArray(additionalData?.ancillaryFees) ? additionalData.ancillaryFees : [];
                const totalAncillary = ancillaryFees.reduce((acc: number, item: any) => acc + (item.amount || 0), 0);
                const invoiceTotal = (additionalData?.amount || 0) + totalAncillary;
                const formattedTotal = new Intl.NumberFormat('en-IE', { style: 'currency', currency: additionalData?.currency || 'CAD', maximumFractionDigits: 0 }).format(invoiceTotal);

                studentSubject = `${invType} Invoice Ready for Payment - Cannoga College`;
                studentHtml = `
                    <p>Dear ${firstName},</p>
                    <p>Your ${invType.toLowerCase()} invoice for <strong>${applicationData?.course_title || 'degree programme'}</strong> has been generated and is now ready for payment.</p>
                    <p>Invoice Type: ${invType}</p>
                    <p>Base Tuition: ${invAmt}</p>
                    <p>Total Due: ${formattedTotal}</p>
                    <p><a href="https://cannogacollege.ca/portal/application/payment">Pay Invoice Securely</a></p>
                `;

                adminSubject = `Invoice Sent: ${invType} - ${fullName}`;
                adminHtml = `
                    <h2>Invoice Notification Sent</h2>
                    <p><strong>Student:</strong> ${fullName}</p>
                    <p><strong>Type:</strong> ${invType}</p>
                    <p><strong>Total:</strong> ${formattedTotal}</p>
                `;
                break;
        }

        // Email Wrapper Helper - Minimalist unstyled HTML with Cannoga Logo & Studies Hero
        const wrapHtml = (content: string) => `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <style>
                    body { margin: 0; padding: 15px; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111111; }
                    p { margin: 0 0 8px 0; line-height: 1.45; }
                    ul { margin: 4px 0 10px 0; padding-left: 20px; }
                    li { margin-bottom: 3px; line-height: 1.45; }
                    strong { color: #111111; }
                    a { color: #034737; text-decoration: underline; }
                </style>
            </head>
            <body>
                <div style="max-width: 600px; margin: 0 auto;">
                    <div style="margin-bottom: 12px;">
                        <img src="https://cannogacollege.ca/images/logo-cannoga.png" alt="Cannoga College Logo" style="max-width: 90px; height: auto; display: block;" />
                    </div>
                    <div style="margin-bottom: 16px;">
                        <img src="https://cannogacollege.ca/images/studies-hero.jpg" alt="Cannoga College" style="width: 100%; max-height: 200px; object-fit: cover; display: block;" />
                    </div>
                    <div style="font-size: 14px; color: #111111;">
                        ${content}
                    </div>
                    <div style="margin-top: 24px; padding-top: 14px; border-top: 1px solid #eeeeee; font-size: 12px; color: #666666;">
                        <p style="margin: 0 0 3px 0;"><strong>Cannoga College</strong></p>
                        <p style="margin: 0 0 3px 0;">Ottawa, Ontario, Canada | admissions@cannogacollege.ca</p>
                        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Cannoga College. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        let studentSuccess = true;
        let adminSuccess = true;
        const errors = [];

        let studentResult = null;
        let adminResult = null;

        // Send Student Email if applicable
        if (studentSubject && userEmail) {
            console.log(`[send-notification] Sending student email to: ${userEmail} (Subject: ${studentSubject})`);

            const finalHtml = wrapHtml(studentHtml);
            const emailOptions: any = {
                from: sender,
                to: [userEmail],
                subject: studentSubject,
                html: finalHtml,
            };
            if (studentAttachments.length > 0) {
                emailOptions.attachments = studentAttachments;
                console.log(`[send-notification] Attaching ${studentAttachments.length} file(s) to student email.`);
            }

            const { data, error } = await resend.emails.send(emailOptions);
            if (error) {
                console.error(`[send-notification] Resend Student Error:`, error);
                studentSuccess = false;
                errors.push({ type: 'student', error });
            } else {
                console.log(`[send-notification] Student email sent successfully. ID: ${data?.id}`);
                studentResult = data;
            }
        } else {
            console.warn(`[send-notification] Warning: No subject (${studentSubject}) or email (${userEmail}) for student notification.`);
        }

        // Send Admin Email if applicable (only if different or if configured)
        if (adminSubject && adminEmail && adminEmail !== userEmail) {
            console.log(`[send-notification] Sending admin email to: ${adminEmail} (Subject: ${adminSubject})`);
            const { data, error } = await resend.emails.send({
                from: sender,
                to: [adminEmail],
                subject: `[Cannoga ADMIN] ${adminSubject}`,
                html: wrapHtml(adminHtml),
            });
            if (error) {
                console.error(`[send-notification] Resend Admin Error (non-fatal in dev mode):`, error);
                // Mark non-fatal so student email success is preserved in test mode
                errors.push({ type: 'admin', error });
            } else {
                console.log(`[send-notification] Admin email sent successfully. ID: ${data?.id}`);
                adminResult = data;
            }
        }

        if (!studentSuccess) {
            return new Response(JSON.stringify({ success: false, errors }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({
            success: true,
            studentEmailId: studentResult?.id,
            adminEmailId: adminResult?.id,
            warnings: errors
        }), {
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

