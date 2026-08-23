import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { Hero } from '@/components/layout/Hero';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import { StepBadge } from '@/components/ui/StepBadge';
import { StudentResourceHubCarousel } from '@/components/home/StudentResourceHubCarousel';
import { createStaticClient } from '@/lib/supabase/static';

export const metadata: Metadata = {
    title: 'Bachelor’s Degree Student Guide | Cannoga College Ottawa',
    description: 'Complete onboarding roadmap for incoming Bachelor’s degree students at Cannoga College Ottawa: offer acceptance, tuition, Canadian study permits, course registration, IT access, healthcare, and campus arrival.',
    alternates: {
        canonical: 'https://cannogacollege.ca/student-guide/bachelor/',
    },
};

export default async function BachelorsGuidePage() {
    const supabase = createStaticClient();
    let intlTuition = 6400;
    let domesticTuition = 4000;
    const tuitionDeposit = 2000;

    try {
        const { data: tuitionRows } = await supabase
            .from('tuition_info')
            .select('*')
            .eq('status', 'active');

        if (tuitionRows) {
            const bachelorRow = tuitionRows.find((r: any) => 
                (r.credential_type || '').toLowerCase().includes('bachelor')
            );
            if (bachelorRow) {
                if (bachelorRow.international_tuition?.annualTuition) {
                    const parsed = parseInt(String(bachelorRow.international_tuition.annualTuition).replace(/[^0-9]/g, ''), 10);
                    if (parsed) intlTuition = parsed;
                } else if (bachelorRow.international_tuition) {
                    const val = typeof bachelorRow.international_tuition === 'number' 
                        ? bachelorRow.international_tuition 
                        : parseInt(String(bachelorRow.international_tuition).replace(/[^0-9]/g, ''), 10);
                    if (val) intlTuition = val;
                }

                if (bachelorRow.domestic_tuition?.annualTuition) {
                    const parsed = parseInt(String(bachelorRow.domestic_tuition.annualTuition).replace(/[^0-9]/g, ''), 10);
                    if (parsed) domesticTuition = parsed;
                } else if (bachelorRow.domestic_tuition) {
                    const val = typeof bachelorRow.domestic_tuition === 'number' 
                        ? bachelorRow.domestic_tuition 
                        : parseInt(String(bachelorRow.domestic_tuition).replace(/[^0-9]/g, ''), 10);
                    if (val) domesticTuition = val;
                }
            }
        }
    } catch (e) {
        console.error('Error fetching tuition in bachelor guide:', e);
    }

    const sections = [
        { id: 'intro', title: 'Welcome Overview', content: '' },
        { id: 'accept', title: '1. Accept Admission', content: '' },
        { id: 'tuition', title: '2. Tuition & Scholarships', content: '' },
        { id: 'study-permit', title: '3. Canadian Study Permit', content: '' },
        { id: 'enrolment', title: '4. Course Enrolment', content: '' },
        { id: 'it-account', title: '5. Student IT & Portal', content: '' },
        { id: 'healthcare', title: '6. Healthcare & Transit', content: '' },
        { id: 'orientation', title: '7. Campus Orientation', content: '' },
        { id: 'housing', title: '8. Housing & Ottawa Life', content: '' },
    ];

    return (
        <div className="min-h-screen bg-white text-black font-sans pb-12">
            {/* HERO SECTION */}
            <Hero
                title="Bachelor’s Degree Student Guide"
                body="Official step-by-step onboarding guide for admitted undergraduate students at Cannoga College Ottawa campus. Complete each requirement prior to your first semester."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                image={{
                    src: "/images/student-guide-bachelor.jpg",
                    alt: "Bachelor Students Guide"
                }}
            />

            <GuideSidebarLayout 
                sections={sections}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Student Guide', href: '/student-guide' },
                    { label: "Bachelor's Guide" }
                ]}
            >
                <div className="cc-container py-8 md:py-12 text-base md:text-lg font-normal text-slate-700 leading-relaxed">
                    <div className="space-y-10 md:space-y-14">

                        {/* Welcome Overview */}
                        <section id="intro" className="scroll-mt-28 space-y-4">
                            <h2 className="text-aalto-5 font-bold text-black tracking-tight">
                                Welcome to Cannoga College
                            </h2>
                            <p className="text-slate-700 leading-relaxed font-normal">
                                Congratulations on your admission to Cannoga College. Our 4-year Bachelor’s degree programmes combine rigorous academic theory with real-world co-op placements in Ottawa. Follow this 8-step roadmap to complete admissions requirements, secure your immigration status, register for courses, and prepare for campus life.
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
                                To confirm your seat in your chosen undergraduate programme, log into the <Link href="/portal/account/login/" className="text-black font-bold underline hover:text-[#c89211]">Cannoga Student Application Portal</Link> and submit your formal acceptance before the deadline stated on your Letter of Acceptance (LOA).
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-black block mb-1">Fall Intake (September)</span>
                                    <span className="text-slate-600 block text-sm">Acceptance Deadline: <strong>July 24, 2026</strong> (11:59 PM EST)</span>
                                    <span className="text-slate-500 block text-xs mt-1">Tuition deposit required to issue final Provincial Attestation Letter (PAL).</span>
                                </div>
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-black block mb-1">Winter Intake (January)</span>
                                    <span className="text-slate-600 block text-sm">Acceptance Deadline: <strong>November 15, 2026</strong> (11:59 PM EST)</span>
                                    <span className="text-slate-500 block text-xs mt-1">Recommended early acceptance for international visa processing times.</span>
                                </div>
                            </div>

                            <div className="p-5 bg-neutral-100 text-sm text-slate-700">
                                <strong className="text-black block mb-0.5">Confirmation Tuition Deposit</strong>
                                A non-refundable tuition deposit (${tuitionDeposit.toLocaleString()} CAD) is credited directly towards your first-term tuition balance.
                            </div>
                        </section>

                        {/* Step 2: Tuition & Scholarships */}
                        <section id="tuition" className="scroll-mt-28 space-y-4">
                            <div className="flex items-center gap-3.5">
                                <StepBadge step={2} />
                                <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">
                                    Tuition Fees, Payment Schedule &amp; Scholarships
                                </h2>
                            </div>
                            <p className="text-slate-700 leading-relaxed font-normal">
                                Bachelor’s degree tuition is assessed per academic term (Fall and Winter semesters). All fee schedules and official receipts are accessible inside your SIS Finance portal.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-neutral-50">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">International Bachelor's Tuition</span>
                                    <span className="text-base font-black text-black block mt-1">${intlTuition.toLocaleString()} CAD / yr</span>
                                    <span className="text-xs text-slate-600 mt-1 block">Full-time annual tuition rate across Business, Tech, Science &amp; Arts schools.</span>
                                </div>
                                <div className="p-6 bg-neutral-50">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Domestic Bachelor's Tuition</span>
                                    <span className="text-base font-black text-black block mt-1">${domesticTuition.toLocaleString()} CAD / yr</span>
                                    <span className="text-xs text-slate-600 mt-1 block">Full-time annual tuition rate for Canadian citizens and permanent residents.</span>
                                </div>
                                <div className="p-6 bg-neutral-50 md:col-span-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Entrance Scholarships</span>
                                    <span className="text-base font-black text-black block mt-1">Up to $3,000 CAD</span>
                                    <span className="text-xs text-slate-600 mt-1 block">Automatically awarded based on high school academic performance upon admission.</span>
                                </div>
                            </div>

                            <p className="text-sm text-slate-600">
                                <strong>Approved Payment Methods:</strong> Flywire, CIBC International Student Pay, Canadian online banking (Bill Pay: Cannoga College), or major credit cards via the portal.
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
                                International students must obtain a valid Canadian Study Permit from Immigration, Refugees and Citizenship Canada (IRCC) before traveling to Ottawa.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-neutral-50 space-y-2">
                                    <span className="font-bold text-base text-black block">International Students</span>
                                    <ul className="text-sm text-slate-600 space-y-1.5">
                                        <li>• Apply immediately upon receiving your official Letter of Acceptance (LOA) and Provincial Attestation Letter (PAL).</li>
                                        <li>• Ensure passport is valid for the full duration of your Bachelor's degree.</li>
                                        <li>• Prepare proof of financial support, biometrics, and medical exam if requested.</li>
                                    </ul>
                                </div>
                                <div className="p-6 bg-neutral-50 space-y-2">
                                    <span className="font-bold text-base text-black block">Canadian Citizens &amp; Permanent Residents</span>
                                    <ul className="text-sm text-slate-600 space-y-1.5">
                                        <li>• No study permit required.</li>
                                        <li>• Provide proof of Canadian citizenship or PR status during portal registration.</li>
                                        <li>• Eligible for domestic tuition fee schedules and provincial OSAP funding.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="p-5 bg-neutral-100 text-sm text-slate-700">
                                <strong>Off-Campus Work Authorization:</strong> Full-time undergraduate degree students holding a valid study permit are authorized to work off-campus in Canada during academic semesters and full-time during official semester breaks.
                            </div>
                        </section>

                        {/* Step 4: Course Enrolment */}
                        <section id="enrolment" className="scroll-mt-28 space-y-4">
                            <div className="flex items-center gap-3.5">
                                <StepBadge step={4} />
                                <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">
                                    Course Registration &amp; Academic Advising
                                </h2>
                            </div>
                            <p className="text-slate-700 leading-relaxed font-normal">
                                Undergraduate degrees at Cannoga College require 120 total academic credits (typically 30 credits / 10 courses per year across Fall and Winter terms). Course registration opens 6 weeks prior to term commencement.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-base text-black block mb-1">Standard Full-Time Load</span>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        5 courses (15 credits) per term. Maintaining full-time enrolment (minimum 9 credits / 3 courses) is required for international study permit compliance.
                                    </p>
                                </div>
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-base text-black block mb-1">Academic Advisor Mapping</span>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Schedule a 1-on-1 virtual or in-person degree planning session with your faculty academic advisor to verify prerequisites and major specializations.
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
                                Once your admission confirmation deposit is verified, your official Cannoga College Student ID and digital accounts are provisioned within 24 to 48 hours.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-sm text-black block">Cannoga Email &amp; 365</span>
                                    <span className="text-xs text-slate-600 block mt-1 font-mono">student@cannogacollege.ca</span>
                                </div>
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-sm text-black block">Student Information System</span>
                                    <span className="text-xs text-slate-600 block mt-1">Timetables, grades, transcripts</span>
                                </div>
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-sm text-black block">Campus Wi-Fi &amp; LMS</span>
                                    <span className="text-xs text-slate-600 block mt-1">High-speed Ottawa campus access</span>
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
                                        International students are automatically enrolled in the Cannoga Comprehensive Student Health Insurance Plan (covering physician visits, hospitalization, prescription medicine, and emergency care). Ontario residents use OHIP.
                                    </p>
                                </div>
                                <div className="p-6 bg-neutral-50 space-y-2">
                                    <span className="font-bold text-base text-black block">Student ID &amp; OC Transpo Transit</span>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Pick up your physical Cannoga Student Photo ID Card at the Ottawa Campus Registrar's Desk (81 Montreal Rd) or activate your digital card on the student portal for discounted Ottawa transit and city-wide student privileges.
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
                                Orientation Week is held during the week prior to classes starting. Attendance is strongly recommended for all incoming Bachelor’s degree students.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="p-6 bg-neutral-50 text-sm">
                                    <span className="font-bold text-black block mb-1">Faculty Welcome</span>
                                    <span className="text-slate-600 text-xs">Meet your department deans, professors, and academic mentors.</span>
                                </div>
                                <div className="p-6 bg-neutral-50 text-sm">
                                    <span className="font-bold text-black block mb-1">Campus &amp; Lab Tours</span>
                                    <span className="text-slate-600 text-xs">Explore classrooms, computer labs, library, and student lounges.</span>
                                </div>
                                <div className="p-6 bg-neutral-50 text-sm">
                                    <span className="font-bold text-black block mb-1">Airport Welcome</span>
                                    <span className="text-slate-600 text-xs">Free pickup service from Ottawa International Airport (YOW) for new arrivals.</span>
                                </div>
                            </div>
                        </section>

                        {/* Step 8: Housing & Ottawa Life */}
                        <section id="housing" className="scroll-mt-28 space-y-4">
                            <div className="flex items-center gap-3.5">
                                <StepBadge step={8} />
                                <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">
                                    Student Housing, Financial Aid &amp; Support
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-neutral-50 space-y-2">
                                    <span className="font-bold text-base text-black block">Student Housing in Ottawa</span>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Cannoga assists with on-campus partner residences and verified student apartments located near our central Ottawa campus (Vanier, ByWard Market, Sandy Hill, and Gloucester).
                                    </p>
                                </div>
                                <div className="p-6 bg-neutral-50 space-y-2">
                                    <span className="font-bold text-base text-black block">Financial Aid &amp; Work-Study</span>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Eligible domestic students can apply for Ontario Student Assistance Program (OSAP) funding. In addition, on-campus student work-study roles are available each semester.
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
