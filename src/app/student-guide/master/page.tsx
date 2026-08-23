import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { Hero } from '@/components/layout/Hero';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import { StepBadge } from '@/components/ui/StepBadge';
import { StudentResourceHubCarousel } from '@/components/home/StudentResourceHubCarousel';
import { createStaticClient } from '@/lib/supabase/static';

export const metadata: Metadata = {
    title: 'Master’s Degree Student Guide | Cannoga College Ottawa',
    description: 'Comprehensive onboarding and reference guide for admitted Master’s graduate students at Cannoga College Ottawa: offer confirmation, tuition fees, study permits, graduate advisor matching, thesis roadmap, and campus arrival.',
    alternates: {
        canonical: 'https://cannogacollege.ca/student-guide/master/',
    },
};

export default async function MastersGuidePage() {
    const supabase = createStaticClient();
    let intlTuition = 9600;
    let domesticTuition = 5600;
    const tuitionDeposit = 2000;

    try {
        const { data: tuitionRows } = await supabase
            .from('tuition_info')
            .select('*')
            .eq('status', 'active');

        if (tuitionRows) {
            const masterRow = tuitionRows.find((r: any) => 
                (r.credential_type || '').toLowerCase().includes('master')
            );
            if (masterRow) {
                if (masterRow.international_tuition?.annualTuition) {
                    const parsed = parseInt(String(masterRow.international_tuition.annualTuition).replace(/[^0-9]/g, ''), 10);
                    if (parsed) intlTuition = parsed;
                } else if (masterRow.international_tuition) {
                    const val = typeof masterRow.international_tuition === 'number' 
                        ? masterRow.international_tuition 
                        : parseInt(String(masterRow.international_tuition).replace(/[^0-9]/g, ''), 10);
                    if (val) intlTuition = val;
                }

                if (masterRow.domestic_tuition?.annualTuition) {
                    const parsed = parseInt(String(masterRow.domestic_tuition.annualTuition).replace(/[^0-9]/g, ''), 10);
                    if (parsed) domesticTuition = parsed;
                } else if (masterRow.domestic_tuition) {
                    const val = typeof masterRow.domestic_tuition === 'number' 
                        ? masterRow.domestic_tuition 
                        : parseInt(String(masterRow.domestic_tuition).replace(/[^0-9]/g, ''), 10);
                    if (val) domesticTuition = val;
                }
            }
        }
    } catch (e) {
        console.error('Error fetching tuition in master guide:', e);
    }

    const sections = [
        { id: 'intro', title: 'Welcome Overview', content: '' },
        { id: 'accept', title: '1. Accept Admission', content: '' },
        { id: 'tuition', title: '2. Tuition & Funding', content: '' },
        { id: 'study-permit', title: '3. Canadian Study Permit', content: '' },
        { id: 'advising', title: '4. Graduate Advising & Thesis', content: '' },
        { id: 'it-account', title: '5. Student IT & Research Portal', content: '' },
        { id: 'healthcare', title: '6. Healthcare & Transit', content: '' },
        { id: 'orientation', title: '7. Graduate Orientation', content: '' },
        { id: 'housing', title: '8. Housing & Career Pathways', content: '' },
    ];

    return (
        <div className="min-h-screen bg-white text-black font-sans pb-12">
            {/* HERO SECTION */}
            <Hero
                title="Master’s Degree Student Guide"
                body="Official step-by-step onboarding guide for admitted Master’s graduate students at Cannoga College Ottawa campus. Complete all requirements before starting your graduate studies."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                image={{
                    src: "/images/student-guide-master.png",
                    alt: "Master Students Guide"
                }}
            />

            <GuideSidebarLayout 
                sections={sections}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Student Guide', href: '/student-guide' },
                    { label: "Master's Guide" }
                ]}
            >
                <div className="cc-container py-8 md:py-12 text-base md:text-lg font-normal text-slate-700 leading-relaxed">
                    <div className="space-y-10 md:space-y-14">

                        {/* Welcome Overview */}
                        <section id="intro" className="scroll-mt-28 space-y-4">
                            <h2 className="text-aalto-5 font-bold text-black tracking-tight">
                                Welcome to Graduate Studies at Cannoga
                            </h2>
                            <p className="text-slate-700 leading-relaxed font-normal">
                                Congratulations on your admission to graduate school at Cannoga College. Our 2-year Master’s degree programmes combine advanced interdisciplinary coursework with research projects, thesis guidance, and executive industry practicums in Ottawa. Follow this 8-step guide to confirm your enrollment, secure your funding and permits, and prepare for your graduate journey.
                            </p>
                        </section>

                        {/* Step 1: Accept Admission */}
                        <section id="accept" className="scroll-mt-28 space-y-4">
                            <div className="flex items-center gap-3.5">
                                <StepBadge step={1} />
                                <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">
                                    Accept Your Master's Offer of Admission
                                </h2>
                            </div>
                            <p className="text-slate-700 leading-relaxed font-normal">
                                To confirm your place in your graduate programme, sign into the <Link href="/portal/account/login/" className="text-black font-bold underline hover:text-[#c89211]">Cannoga Student Application Portal</Link> and submit your formal acceptance before the deadline stated on your Letter of Acceptance (LOA).
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-black block mb-1">Fall Intake (September)</span>
                                    <span className="text-slate-600 block text-sm">Acceptance Deadline: <strong>July 24, 2026</strong> (11:59 PM EST)</span>
                                    <span className="text-slate-500 block text-xs mt-1">Confirmation deposit required to release your official Provincial Attestation Letter (PAL).</span>
                                </div>
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-black block mb-1">Winter Intake (January)</span>
                                    <span className="text-slate-600 block text-sm">Acceptance Deadline: <strong>November 15, 2026</strong> (11:59 PM EST)</span>
                                    <span className="text-slate-500 block text-xs mt-1">Recommended early confirmation to ensure adequate visa processing times.</span>
                                </div>
                            </div>

                            <div className="p-5 bg-neutral-100 text-sm text-slate-700">
                                <strong className="text-black block mb-0.5">Confirmation Tuition Deposit</strong>
                                A non-refundable tuition deposit (${tuitionDeposit.toLocaleString()} CAD) is credited directly towards your first-term tuition balance.
                            </div>
                        </section>

                        {/* Step 2: Tuition & Funding */}
                        <section id="tuition" className="scroll-mt-28 space-y-4">
                            <div className="flex items-center gap-3.5">
                                <StepBadge step={2} />
                                <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">
                                    Graduate Tuition Fees &amp; Research Scholarships
                                </h2>
                            </div>
                            <p className="text-slate-700 leading-relaxed font-normal">
                                Master’s tuition is billed per academic term. You can view all invoices, fee breakdowns, and payment receipts directly inside the SIS Finance portal.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-neutral-50">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">International Master's Tuition</span>
                                    <span className="text-base font-black text-black block mt-1">${intlTuition.toLocaleString()} CAD / yr</span>
                                    <span className="text-xs text-slate-600 mt-1 block">Full-time graduate tuition across Business, Tech, Science &amp; Arts faculties.</span>
                                </div>
                                <div className="p-6 bg-neutral-50">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Domestic Master's Tuition</span>
                                    <span className="text-base font-black text-black block mt-1">${domesticTuition.toLocaleString()} CAD / yr</span>
                                    <span className="text-xs text-slate-600 mt-1 block">Full-time annual tuition rate for Canadian citizens and permanent residents.</span>
                                </div>
                                <div className="p-6 bg-neutral-50 md:col-span-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Graduate Research &amp; Merit Awards</span>
                                    <span className="text-base font-black text-black block mt-1">Up to $5,000 CAD</span>
                                    <span className="text-xs text-slate-600 mt-1 block">Merit-based entrance awards and departmental Graduate Research Assistantships (GRA) assigned upon faculty review.</span>
                                </div>
                            </div>

                            <p className="text-sm text-slate-600">
                                <strong>Approved Payment Channels:</strong> Flywire, CIBC International Student Pay, Canadian online banking (Bill Pay: Cannoga College), or major credit cards via the portal.
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
                                International graduate students must secure an approved Canadian Study Permit prior to arriving in Ottawa.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-neutral-50 space-y-2">
                                    <span className="font-bold text-base text-black block">International Graduate Students</span>
                                    <ul className="text-sm text-slate-600 space-y-1.5">
                                        <li>• Apply immediately with your official Cannoga College Letter of Acceptance (LOA) and Provincial Attestation Letter (PAL).</li>
                                        <li>• Master's degree students are prioritized for Canadian study permits with expanded PGWP benefits.</li>
                                        <li>• Family accompaniment: Spouses of eligible Master's degree students qualify for an Open Work Permit.</li>
                                    </ul>
                                </div>
                                <div className="p-6 bg-neutral-50 space-y-2">
                                    <span className="font-bold text-base text-black block">Canadian Citizens &amp; Permanent Residents</span>
                                    <ul className="text-sm text-slate-600 space-y-1.5">
                                        <li>• No study permit required.</li>
                                        <li>• Provide proof of Canadian status during registration.</li>
                                        <li>• Eligible for domestic tuition schedules and Ontario graduate funding (OSAP &amp; OGS).</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="p-5 bg-neutral-100 text-sm text-slate-700">
                                <strong>Work Authorization in Canada:</strong> Full-time Master's students holding a valid study permit are authorized to work off-campus in Canada during academic semesters and full-time during official scheduled breaks.
                            </div>
                        </section>

                        {/* Step 4: Graduate Advising & Thesis */}
                        <section id="advising" className="scroll-mt-28 space-y-4">
                            <div className="flex items-center gap-3.5">
                                <StepBadge step={4} />
                                <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">
                                    Graduate Course Enrolment &amp; Advisor Matching
                                </h2>
                            </div>
                            <p className="text-slate-700 leading-relaxed font-normal">
                                Master’s degree programmes require 60 to 90 graduate credits across 2 years, comprising core methodology seminars, advanced electives, and a Master's Thesis or Applied Capstone Project.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-base text-black block mb-1">Full-Time Graduate Load</span>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        3 to 4 graduate courses (9–12 credits) per semester. Full-time registration is required to maintain valid immigration standing and research eligibility.
                                    </p>
                                </div>
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-base text-black block mb-1">Faculty Research Supervisor</span>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Meet with your designated department graduate chair to define your research track, lab assignments, and thesis advisory committee.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Step 5: Student IT & Research Portal */}
                        <section id="it-account" className="scroll-mt-28 space-y-4">
                            <div className="flex items-center gap-3.5">
                                <StepBadge step={5} />
                                <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">
                                    Activate Student IT &amp; Research Portal
                                </h2>
                            </div>
                            <p className="text-slate-700 leading-relaxed font-normal">
                                Following confirmation deposit verification, your official Cannoga College Student ID and research computing credentials are created within 24 to 48 hours.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-sm text-black block">Cannoga Email &amp; 365</span>
                                    <span className="text-xs text-slate-600 block mt-1 font-mono">student@cannogacollege.ca</span>
                                </div>
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-sm text-black block">Student Information System</span>
                                    <span className="text-xs text-slate-600 block mt-1">Timetables, course registration &amp; transcripts</span>
                                </div>
                                <div className="p-6 bg-neutral-50">
                                    <span className="font-bold text-sm text-black block">Research Lab &amp; Wi-Fi</span>
                                    <span className="text-xs text-slate-600 block mt-1">High-performance campus computing network</span>
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
                                        International graduate students are automatically enrolled in the Cannoga Comprehensive Student Health Insurance Plan (providing physician care, hospital stays, prescription medicines, and emergency medical protection). Ontario residents use OHIP.
                                    </p>
                                </div>
                                <div className="p-6 bg-neutral-50 space-y-2">
                                    <span className="font-bold text-base text-black block">Student ID &amp; OC Transpo Transit</span>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Obtain your physical Cannoga Student Photo ID Card at the Ottawa Campus Registrar Desk (81 Montreal Rd) or access your digital card for city-wide Ottawa bus/O-Train transit privileges.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Step 7: Graduate Orientation */}
                        <section id="orientation" className="scroll-mt-28 space-y-4">
                            <div className="flex items-center gap-3.5">
                                <StepBadge step={7} />
                                <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">
                                    Graduate Orientation &amp; Arrival in Ottawa
                                </h2>
                            </div>
                            <p className="text-slate-700 leading-relaxed font-normal">
                                Graduate Orientation Week takes place the week before semester classes begin. All incoming Master’s students are strongly encouraged to participate.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="p-6 bg-neutral-50 text-sm">
                                    <span className="font-bold text-black block mb-1">Faculty Colloquium</span>
                                    <span className="text-slate-600 text-xs">Engage with graduate deans, senior researchers, and alumni fellows.</span>
                                </div>
                                <div className="p-6 bg-neutral-50 text-sm">
                                    <span className="font-bold text-black block mb-1">Research Facilities Tour</span>
                                    <span className="text-slate-600 text-xs">Tour specialized campus laboratories, library databases, and private study suites.</span>
                                </div>
                                <div className="p-6 bg-neutral-50 text-sm">
                                    <span className="font-bold text-black block mb-1">Airport Pickup</span>
                                    <span className="text-slate-600 text-xs">Free arrival service from Ottawa International Airport (YOW) for newly arriving students.</span>
                                </div>
                            </div>
                        </section>

                        {/* Step 8: Housing & Career Pathways */}
                        <section id="housing" className="scroll-mt-28 space-y-4">
                            <div className="flex items-center gap-3.5">
                                <StepBadge step={8} />
                                <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">
                                    Graduate Housing, Funding &amp; Career Pathways
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-neutral-50 space-y-2">
                                    <span className="font-bold text-base text-black block">Student Housing in Ottawa</span>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Cannoga assists graduate students with quiet, modern apartment rentals and partner residences near campus in Ottawa (ByWard Market, Sandy Hill, Vanier, and Downtown).
                                    </p>
                                </div>
                                <div className="p-6 bg-neutral-50 space-y-2">
                                    <span className="font-bold text-base text-black block">PGWP &amp; Career Pathways</span>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Graduates of full-time Master’s degree programmes in Canada qualify for up to a 3-year Post-Graduation Work Permit (PGWP), creating a direct pathway to permanent residency and professional career growth.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-2 flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/housing/"
                                    className="cc-btn-primary no-underline"
                                >
                                    Explore Graduate Housing <ArrowRight size={14} weight="bold" />
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
