import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { Hero } from '@/components/layout/Hero';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import { StepBadge } from '@/components/ui/StepBadge';
import { StudentResourceHubCarousel } from '@/components/home/StudentResourceHubCarousel';
import { createStaticClient } from '@/lib/supabase/static';

export const metadata: Metadata = {
    title: 'Certificate & Post-Graduate Certificate Student Guide | Cannoga College Ottawa',
    description: 'Comprehensive onboarding and reference guide for admitted Certificate and Post-Graduate Certificate students at Cannoga College Ottawa: offer acceptance, tuition fees, study permits, fast-track career training, and campus arrival.',
    alternates: {
        canonical: 'https://cannogacollege.ca/student-guide/certificate/',
    },
};

export default async function CertificateGuidePage() {
    const supabase = createStaticClient();
    let intlTuition = 4000;
    let domesticTuition = 2400;
    const tuitionDeposit = 2000;

    try {
        const { data: tuitionRows } = await supabase
            .from('tuition_info')
            .select('*')
            .eq('status', 'active');

        if (tuitionRows) {
            const certRow = tuitionRows.find((r: any) => 
                (r.credential_type || '').toLowerCase().includes('certificate')
            );
            if (certRow) {
                if (certRow.international_tuition?.annualTuition) {
                    const parsed = parseInt(String(certRow.international_tuition.annualTuition).replace(/[^0-9]/g, ''), 10);
                    if (parsed) intlTuition = parsed;
                } else if (certRow.international_tuition) {
                    const val = typeof certRow.international_tuition === 'number' 
                        ? certRow.international_tuition 
                        : parseInt(String(certRow.international_tuition).replace(/[^0-9]/g, ''), 10);
                    if (val) intlTuition = val;
                }

                if (certRow.domestic_tuition?.annualTuition) {
                    const parsed = parseInt(String(certRow.domestic_tuition.annualTuition).replace(/[^0-9]/g, ''), 10);
                    if (parsed) domesticTuition = parsed;
                } else if (certRow.domestic_tuition) {
                    const val = typeof certRow.domestic_tuition === 'number' 
                        ? certRow.domestic_tuition 
                        : parseInt(String(certRow.domestic_tuition).replace(/[^0-9]/g, ''), 10);
                    if (val) domesticTuition = val;
                }
            }
        }
    } catch (e) {
        console.error('Error fetching tuition in certificate guide:', e);
    }

    const sections = [
        { id: 'intro', title: 'Welcome Overview', content: '' },
        { id: 'accept', title: '1. Accept Admission', content: '' },
        { id: 'tuition', title: '2. Tuition & Fees', content: '' },
        { id: 'study-permit', title: '3. Canadian Study Permit', content: '' },
        { id: 'enrolment', title: '4. Course Enrolment & Labs', content: '' },
        { id: 'it-account', title: '5. Student IT & Portal', content: '' },
        { id: 'healthcare', title: '6. Healthcare & Transit', content: '' },
        { id: 'orientation', title: '7. Campus Orientation', content: '' },
        { id: 'housing', title: '8. Housing & Career Placement', content: '' },
    ];

    return (
        <div className="min-h-screen bg-white text-black font-sans pb-12">
            {/* HERO SECTION */}
            <Hero
                title="Certificate Students Guide"
                body="Official step-by-step onboarding guide for admitted 1-Year Certificate and Post-Graduate Certificate students at Cannoga College Ottawa campus. Complete all requirements before term commencement."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                image={{
                    src: "/images/student-guide-certificate.jpg",
                    alt: "Certificate Students Guide"
                }}
            />

            <GuideSidebarLayout 
                sections={sections}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Student Guide', href: '/student-guide' },
                    { label: "Certificate's Guide" }
                ]}
            >
                <div className="cc-container py-8 md:py-12 text-base md:text-lg font-normal text-slate-700 leading-relaxed">
                    <div className="space-y-10 md:space-y-14">

                        {/* Welcome Overview */}
                        <section id="intro" className="scroll-mt-28 space-y-4">
                            <h2 className="text-aalto-5 font-bold text-black tracking-tight">
                                Welcome to Cannoga Certificate Programmes
                            </h2>
                            <p className="text-slate-700 leading-relaxed font-normal">
                                Congratulations on your admission to Cannoga College. Our 1-year Certificate (30 credits) and Post-Graduate Certificate programmes provide intensive, career-focused training with hands-on technical labs and immediate workforce readiness in Ottawa. Follow this 8-step roadmap to finalize your enrollment and prepare for your arrival.
                            </p>
                        </section>

                        {/* Step 1: Accept Admission */}
                        <section id="accept" className="scroll-mt-28 space-y-4">
                            <div className="flex items-center gap-3.5">
                                <StepBadge step={1} />
                                <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">
                                    Accept Your Offer of Admission
                                </h2>
                            </div>
                            <p className="text-slate-700 leading-relaxed font-normal">
                                To confirm your seat in your certificate stream, log into the <Link href="/portal/account/login/" className="text-black font-bold underline hover:text-[#c89211]">Cannoga Student Application Portal</Link> and submit your formal acceptance prior to the deadline on your Letter of Acceptance (LOA).
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-black block mb-1">Fall Intake (September)</span>
                                    <span className="text-slate-600 block text-sm">Acceptance Deadline: <strong>July 24, 2026</strong> (11:59 PM EST)</span>
                                    <span className="text-slate-500 block text-xs mt-1">Confirmation deposit required to release your Provincial Attestation Letter (PAL).</span>
                                </div>
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-black block mb-1">Winter Intake (January)</span>
                                    <span className="text-slate-600 block text-sm">Acceptance Deadline: <strong>November 15, 2026</strong> (11:59 PM EST)</span>
                                    <span className="text-slate-500 block text-xs mt-1">Recommended early confirmation to ensure adequate study permit processing time.</span>
                                </div>
                            </div>

                            <div className="p-5 bg-neutral-100 text-sm text-slate-700">
                                <strong className="text-black block mb-0.5">Confirmation Tuition Deposit</strong>
                                A non-refundable tuition deposit (${tuitionDeposit.toLocaleString()} CAD) is credited directly towards your first-term tuition balance.
                            </div>
                        </section>

                        {/* Step 2: Tuition & Fees */}
                        <section id="tuition" className="scroll-mt-28 space-y-4">
                            <div className="flex items-center gap-3.5">
                                <StepBadge step={2} />
                                <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">
                                    Tuition Fees, Payment Schedule &amp; Bursaries
                                </h2>
                            </div>
                            <p className="text-slate-700 leading-relaxed font-normal">
                                Certificate programme tuition covers direct course instruction, technical lab licensing, and studio access across both terms. Fee statements are available on the SIS portal.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-neutral-50">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">International Certificate Tuition</span>
                                    <span className="text-base font-black text-black block mt-1">${intlTuition.toLocaleString()} CAD / yr</span>
                                    <span className="text-xs text-slate-600 mt-1 block">Full-time annual tuition across Technology, Business, and Applied Arts.</span>
                                </div>
                                <div className="p-6 bg-neutral-50">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Domestic Certificate Tuition</span>
                                    <span className="text-base font-black text-black block mt-1">${domesticTuition.toLocaleString()} CAD / yr</span>
                                    <span className="text-xs text-slate-600 mt-1 block">Full-time annual tuition rate for Canadian citizens and permanent residents.</span>
                                </div>
                                <div className="p-6 bg-neutral-50 md:col-span-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Entrance Bursaries &amp; Merit Awards</span>
                                    <span className="text-base font-black text-black block mt-1">Up to $2,000 CAD</span>
                                    <span className="text-xs text-slate-600 mt-1 block">Merit-based entrance bursaries evaluated automatically upon offer issuance.</span>
                                </div>
                            </div>

                            <p className="text-sm text-slate-600">
                                <strong>Approved Payment Options:</strong> Flywire, CIBC International Student Pay, Canadian online banking (Bill Pay: Cannoga College), or major credit cards.
                            </p>
                        </section>

                        {/* Step 3: Canadian Study Permit */}
                        <section id="study-permit" className="scroll-mt-28 space-y-4">
                            <div className="flex items-center gap-3.5">
                                <StepBadge step={3} />
                                <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">
                                    Canadian Study Permit &amp; Visa (IRCC)
                                </h2>
                            </div>
                            <p className="text-slate-700 leading-relaxed font-normal">
                                International students admitted to full-time certificate programmes must hold a valid Canadian Study Permit issued by IRCC prior to arrival.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-neutral-50 space-y-2">
                                    <span className="font-bold text-base text-black block">International Students</span>
                                    <ul className="text-sm text-slate-600 space-y-1.5">
                                        <li>• Apply immediately with your official Letter of Acceptance (LOA) and Provincial Attestation Letter (PAL).</li>
                                        <li>• Full-time certificate programs provide comprehensive career credentials in high-demand Canadian industries.</li>
                                        <li>• Prepare proof of financial support, biometrics, and medical documentation if requested.</li>
                                    </ul>
                                </div>
                                <div className="p-6 bg-neutral-50 space-y-2">
                                    <span className="font-bold text-base text-black block">Canadian Citizens &amp; Permanent Residents</span>
                                    <ul className="text-sm text-slate-600 space-y-1.5">
                                        <li>• No study permit required.</li>
                                        <li>• Submit proof of Canadian status during registration.</li>
                                        <li>• Eligible for domestic tuition schedules and Ontario OSAP student funding.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="p-5 bg-neutral-100 text-sm text-slate-700">
                                <strong>Off-Campus Work Authorization:</strong> Full-time certificate students on a study permit are authorized to work off-campus in Canada during academic semesters and full-time during official scheduled breaks.
                            </div>
                        </section>

                        {/* Step 4: Course Enrolment & Labs */}
                        <section id="enrolment" className="scroll-mt-28 space-y-4">
                            <div className="flex items-center gap-3.5">
                                <StepBadge step={4} />
                                <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">
                                    Course Enrolment &amp; Intensive Lab Training
                                </h2>
                            </div>
                            <p className="text-slate-700 leading-relaxed font-normal">
                                Certificate programmes require 30 total credits (typically 5 courses / 15 credits per semester). Course enrolment opens 6 weeks prior to term commencement via the Cannoga SIS.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-base text-black block mb-1">Applied Studio &amp; Tech Labs</span>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Direct hands-on lab sessions and industry-standard software tools are integrated into every weekly class schedule.
                                    </p>
                                </div>
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-base text-black block mb-1">Career &amp; Industry Workshops</span>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Participate in specialized industry guest lectures, networking bootcamps, and technical portfolio development workshops.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Step 5: Student IT & Portal */}
                        <section id="it-account" className="scroll-mt-28 space-y-4">
                            <div className="flex items-center gap-3.5">
                                <StepBadge step={5} />
                                <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">
                                    Activate Student IT &amp; Learning Portal
                                </h2>
                            </div>
                            <p className="text-slate-700 leading-relaxed font-normal">
                                Following confirmation deposit verification, your official Cannoga College Student ID and digital accounts are provisioned within 24 to 48 hours.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-sm text-black block">Cannoga Email &amp; 365</span>
                                    <span className="text-xs text-slate-600 block mt-1 font-mono">student@cannogacollege.ca</span>
                                </div>
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-sm text-black block">Student Information System</span>
                                    <span className="text-xs text-slate-600 block mt-1">Timetables, course materials &amp; grades</span>
                                </div>
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-sm text-black block">Campus Wi-Fi &amp; LMS</span>
                                    <span className="text-xs text-slate-600 block mt-1">High-speed Ottawa campus connectivity</span>
                                </div>
                            </div>
                        </section>

                        {/* Step 6: Healthcare & Transit */}
                        <section id="healthcare" className="scroll-mt-28 space-y-4">
                            <div className="flex items-center gap-3.5">
                                <StepBadge step={6} />
                                <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">
                                    Healthcare Coverage &amp; Ottawa Transit
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-neutral-50 space-y-2">
                                    <span className="font-bold text-base text-black block">Health Insurance Coverage</span>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        International certificate students receive comprehensive student health insurance coverage for clinics, prescriptions, and emergencies. Ontario residents use OHIP.
                                    </p>
                                </div>
                                <div className="p-6 bg-neutral-50 space-y-2">
                                    <span className="font-bold text-base text-black block">Student ID &amp; OC Transpo Transit</span>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Collect your Cannoga Student Photo ID Card at the Ottawa Campus Registrar Desk (81 Montreal Rd) or activate your digital card for city-wide transit privileges.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Step 7: Campus Orientation */}
                        <section id="orientation" className="scroll-mt-28 space-y-4">
                            <div className="flex items-center gap-3.5">
                                <StepBadge step={7} />
                                <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">
                                    Campus Orientation &amp; Arrival in Ottawa
                                </h2>
                            </div>
                            <p className="text-slate-700 leading-relaxed font-normal">
                                Orientation sessions occur the week prior to classes starting. Learn about campus resources, meet your instructors, and explore technical facilities.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="p-6 bg-neutral-50 text-sm">
                                    <span className="font-bold text-black block mb-1">Certificate Overview</span>
                                    <span className="text-slate-600 text-xs">Meet your department deans, lab coordinators, and cohort members.</span>
                                </div>
                                <div className="p-6 bg-neutral-50 text-sm">
                                    <span className="font-bold text-black block mb-1">Campus &amp; Lab Tours</span>
                                    <span className="text-slate-600 text-xs">Explore technical laboratories, library suites, and student lounges.</span>
                                </div>
                                <div className="p-6 bg-neutral-50 text-sm">
                                    <span className="font-bold text-black block mb-1">Airport Pickup</span>
                                    <span className="text-slate-600 text-xs">Free arrival service from Ottawa International Airport (YOW) for new arrivals.</span>
                                </div>
                            </div>
                        </section>

                        {/* Step 8: Housing & Career Placement */}
                        <section id="housing" className="scroll-mt-28 space-y-4">
                            <div className="flex items-center gap-3.5">
                                <StepBadge step={8} />
                                <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">
                                    Student Housing, Funding &amp; Career Placement
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-neutral-50 space-y-2">
                                    <span className="font-bold text-base text-black block">Student Housing in Ottawa</span>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Cannoga assists certificate students with verified rentals and partner residences located across central Ottawa.
                                    </p>
                                </div>
                                <div className="p-6 bg-neutral-50 space-y-2">
                                    <span className="font-bold text-base text-black block">Career Readiness &amp; Advising</span>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Access ongoing career development, resume clinics, technical interview prep, and employer hiring events throughout your program.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-2 flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/housing/"
                                    className="cc-btn-primary no-underline"
                                >
                                    Explore Housing <ArrowRight size={14} weight="bold" />
                                </Link>
                                <Link
                                    href="/admissions/contact-information/"
                                    className="cc-btn-outline no-underline"
                                >
                                    Contact Admissions Advisors
                                </Link>
                            </div>
                        </section>

                        {/* Student Resource Hub */}
                        <section id="resource-hub" className="scroll-mt-28 pt-8 border-t border-neutral-200 space-y-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black mb-1 text-black tracking-tight">Student Resource Hub</h2>
                                <p className="text-base text-slate-600 font-normal">Explore campus services, academic resources, career support, and student rights.</p>
                            </div>
                            <StudentResourceHubCarousel />
                        </section>

                    </div>
                </div>
            </GuideSidebarLayout>
        </div>
    );
}
