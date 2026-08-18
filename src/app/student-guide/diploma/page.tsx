import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { Hero } from '@/components/layout/Hero';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import { StepBadge } from '@/components/ui/StepBadge';
import { StudentResourceHubCarousel } from '@/components/home/StudentResourceHubCarousel';
import { createStaticClient } from '@/lib/supabase/static';

export const metadata: Metadata = {
    title: 'Diploma & Advanced Diploma Student Guide | Cannoga College Ottawa',
    description: 'Comprehensive onboarding and reference guide for admitted Diploma and Advanced Diploma students at Cannoga College Ottawa: offer acceptance, tuition, study permits, co-op practicums, and campus arrival.',
    alternates: {
        canonical: 'https://cannogacollege.ca/student-guide/diploma/',
    },
};

export default async function DiplomaGuidePage() {
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
            const diplomaRow = tuitionRows.find((r: any) => 
                (r.credential_type || '').toLowerCase().includes('diploma')
            );
            if (diplomaRow) {
                if (diplomaRow.international_tuition?.annualTuition) {
                    const parsed = parseInt(String(diplomaRow.international_tuition.annualTuition).replace(/[^0-9]/g, ''), 10);
                    if (parsed) intlTuition = parsed;
                } else if (diplomaRow.international_tuition) {
                    const val = typeof diplomaRow.international_tuition === 'number' 
                        ? diplomaRow.international_tuition 
                        : parseInt(String(diplomaRow.international_tuition).replace(/[^0-9]/g, ''), 10);
                    if (val) intlTuition = val;
                }

                if (diplomaRow.domestic_tuition?.annualTuition) {
                    const parsed = parseInt(String(diplomaRow.domestic_tuition.annualTuition).replace(/[^0-9]/g, ''), 10);
                    if (parsed) domesticTuition = parsed;
                } else if (diplomaRow.domestic_tuition) {
                    const val = typeof diplomaRow.domestic_tuition === 'number' 
                        ? diplomaRow.domestic_tuition 
                        : parseInt(String(diplomaRow.domestic_tuition).replace(/[^0-9]/g, ''), 10);
                    if (val) domesticTuition = val;
                }
            }
        }
    } catch (e) {
        console.error('Error fetching tuition in diploma guide:', e);
    }

    const sections = [
        { id: 'intro', title: 'Welcome Overview', content: '' },
        { id: 'accept', title: '1. Accept Admission', content: '' },
        { id: 'tuition', title: '2. Tuition & Scholarships', content: '' },
        { id: 'study-permit', title: '3. Canadian Study Permit', content: '' },
        { id: 'enrolment', title: '4. Course Enrolment & Co-op', content: '' },
        { id: 'it-account', title: '5. Student IT & Portal', content: '' },
        { id: 'healthcare', title: '6. Healthcare & Transit', content: '' },
        { id: 'orientation', title: '7. Campus Orientation', content: '' },
        { id: 'housing', title: '8. Housing & Career Support', content: '' },
    ];

    return (
        <div className="min-h-screen bg-white text-black font-sans pb-12">
            {/* HERO SECTION */}
            <Hero
                title="Diploma Students Guide"
                body="Official step-by-step onboarding guide for admitted 2-Year Diploma and 3-Year Advanced Diploma students at Cannoga College Ottawa campus. Follow this roadmap to prepare for your studies."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                image={{
                    src: "/images/student-guide-diploma.jpg",
                    alt: "Diploma Students Guide"
                }}
            />

            <GuideSidebarLayout 
                sections={sections}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Student Guide', href: '/student-guide' },
                    { label: "Diploma's Guide" }
                ]}
            >
                <div className="cc-container py-8 md:py-12 text-base md:text-lg font-normal text-slate-700 leading-relaxed">
                    <div className="space-y-10 md:space-y-14">

                        {/* Welcome Overview */}
                        <section id="intro" className="scroll-mt-28 space-y-4">
                            <h2 className="text-aalto-5 font-bold text-black tracking-tight">
                                Welcome to Cannoga Diploma Programmes
                            </h2>
                            <p className="text-slate-700 leading-relaxed font-normal">
                                Congratulations on your admission to Cannoga College. Our career-focused 2-year Diploma (60 credits) and 3-year Advanced Diploma (90 credits) programmes provide hands-on applied learning and co-op work terms aligned with Canadian industry standards. Complete this 8-step guide to finalize your admissions, immigration, and course scheduling.
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
                                To confirm your seat in your diploma stream, log into the <Link href="/portal/account/login" className="text-black font-bold underline hover:text-[#c89211]">Cannoga Student Application Portal</Link> and accept your offer prior to the date listed on your Letter of Acceptance (LOA).
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
                                    <span className="text-slate-500 block text-xs mt-1">Recommended early submission for timely study permit visa approval.</span>
                                </div>
                            </div>

                            <div className="p-5 bg-neutral-100 text-sm text-slate-700">
                                <strong className="text-black block mb-0.5">Confirmation Tuition Deposit</strong>
                                A non-refundable tuition deposit (${tuitionDeposit.toLocaleString()} CAD) is credited directly towards your first-term diploma tuition balance.
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
                                Diploma tuition is billed per semester across Fall and Winter terms. Access your official student statements and tax receipts through the SIS portal.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-neutral-50">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">International Diploma Tuition</span>
                                    <span className="text-base font-black text-black block mt-1">${intlTuition.toLocaleString()} CAD / yr</span>
                                    <span className="text-xs text-slate-600 mt-1 block">Full-time annual tuition rate across Technology, Business, and Health faculties.</span>
                                </div>
                                <div className="p-6 bg-neutral-50">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Domestic Diploma Tuition</span>
                                    <span className="text-base font-black text-black block mt-1">${domesticTuition.toLocaleString()} CAD / yr</span>
                                    <span className="text-xs text-slate-600 mt-1 block">Full-time annual tuition for Canadian citizens and permanent residents.</span>
                                </div>
                                <div className="p-6 bg-neutral-50 md:col-span-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Entrance Bursaries &amp; Merit Awards</span>
                                    <span className="text-base font-black text-black block mt-1">Up to $2,500 CAD</span>
                                    <span className="text-xs text-slate-600 mt-1 block">Merit-based entrance bursaries awarded automatically upon admission evaluation.</span>
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
                                International students admitted to diploma programmes must obtain a valid Canadian Study Permit from IRCC before traveling to Canada.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-neutral-50 space-y-2">
                                    <span className="font-bold text-base text-black block">International Students</span>
                                    <ul className="text-sm text-slate-600 space-y-1.5">
                                        <li>• Apply immediately with your official Letter of Acceptance (LOA) and Provincial Attestation Letter (PAL).</li>
                                        <li>• Full-time diploma programs qualify for Canadian Post-Graduation Work Permit (PGWP) pathways.</li>
                                        <li>• Ensure your co-op work permit application is submitted concurrently if your diploma has a required co-op placement.</li>
                                    </ul>
                                </div>
                                <div className="p-6 bg-neutral-50 space-y-2">
                                    <span className="font-bold text-base text-black block">Canadian Citizens &amp; Permanent Residents</span>
                                    <ul className="text-sm text-slate-600 space-y-1.5">
                                        <li>• No study permit required.</li>
                                        <li>• Submit proof of Canadian status during registration.</li>
                                        <li>• Eligible for domestic tuition schedules and Ontario OSAP student loans.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="p-5 bg-neutral-100 text-sm text-slate-700">
                                <strong>Off-Campus Work Authorization:</strong> Full-time diploma students on a study permit are authorized to work off-campus in Canada during academic semesters and full-time during official scheduled breaks.
                            </div>
                        </section>

                        {/* Step 4: Course Enrolment & Co-op */}
                        <section id="enrolment" className="scroll-mt-28 space-y-4">
                            <div className="flex items-center gap-3.5">
                                <StepBadge step={4} />
                                <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">
                                    Course Enrolment &amp; Co-op Practicum
                                </h2>
                            </div>
                            <p className="text-slate-700 leading-relaxed font-normal">
                                Standard full-time diploma load is 5 courses (15 credits) per semester. Enrolment opens 6 weeks prior to the start of classes through the Cannoga SIS.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-base text-black block mb-1">Practical Lab Workshops</span>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Hands-on workshop, laboratory, and studio components are embedded directly into your weekly timetable at the Ottawa campus.
                                    </p>
                                </div>
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-base text-black block mb-1">Co-op &amp; Career Placement</span>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Career Services coordinates resume reviews, employer interview fairs, and verified industry co-op work terms across Ottawa.
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
                                After your confirmation deposit is processed, your official student ID and digital accounts are provisioned within 24 to 48 hours.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-sm text-black block">Cannoga Email &amp; 365</span>
                                    <span className="text-xs text-slate-600 block mt-1 font-mono">student@cannogacollege.ca</span>
                                </div>
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-sm text-black block">Student Information System</span>
                                    <span className="text-xs text-slate-600 block mt-1">Class schedules, course materials &amp; grades</span>
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
                                        International diploma students receive comprehensive student health insurance coverage for clinics, prescriptions, and emergencies. Ontario residents use OHIP.
                                    </p>
                                </div>
                                <div className="p-6 bg-neutral-50 space-y-2">
                                    <span className="font-bold text-base text-black block">Student ID &amp; OC Transpo Transit</span>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Collect your Cannoga Student Photo ID Card at the Ottawa Campus Registrar Desk (81 Montreal Rd) or use your digital card for discounted city-wide transit.
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
                                Orientation sessions occur the week prior to classes starting. Learn how to navigate campus, connect with faculty instructors, and access career labs.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="p-6 bg-neutral-50 text-sm">
                                    <span className="font-bold text-black block mb-1">Program Overview</span>
                                    <span className="text-slate-600 text-xs">Meet your program coordinators, lab instructors, and class peers.</span>
                                </div>
                                <div className="p-6 bg-neutral-50 text-sm">
                                    <span className="font-bold text-black block mb-1">Campus &amp; Lab Tours</span>
                                    <span className="text-slate-600 text-xs">Explore technical labs, library resources, and student study areas.</span>
                                </div>
                                <div className="p-6 bg-neutral-50 text-sm">
                                    <span className="font-bold text-black block mb-1">Airport Pickup</span>
                                    <span className="text-slate-600 text-xs">Free arrival service from Ottawa International Airport (YOW) for new arrivals.</span>
                                </div>
                            </div>
                        </section>

                        {/* Step 8: Housing & Career Support */}
                        <section id="housing" className="scroll-mt-28 space-y-4">
                            <div className="flex items-center gap-3.5">
                                <StepBadge step={8} />
                                <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">
                                    Student Housing, Funding &amp; Career Services
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-neutral-50 space-y-2">
                                    <span className="font-bold text-base text-black block">Student Housing in Ottawa</span>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Cannoga assists diploma students with verified rentals and partner residences conveniently located across central Ottawa.
                                    </p>
                                </div>
                                <div className="p-6 bg-neutral-50 space-y-2">
                                    <span className="font-bold text-base text-black block">Career Services &amp; PGWP</span>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Access ongoing career development, resume clinics, interview workshops, and Post-Graduation Work Permit (PGWP) transition support.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-2 flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/housing"
                                    className="cc-btn-primary no-underline"
                                >
                                    Explore Housing <ArrowRight size={14} weight="bold" />
                                </Link>
                                <Link
                                    href="/admissions/contact-information"
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
