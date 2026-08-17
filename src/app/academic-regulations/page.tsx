import type { Metadata } from 'next';
import { Hero } from '@/components/layout/Hero';
import { Link } from '@/components/ui/Link';
import AcademicRegulationsAccordion from '@/components/academic/AcademicRegulationsAccordion';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';

export const metadata: Metadata = {
    title: 'Academic Guidelines & Regulations',
    description: 'Review the official policies, rules, and academic standards governing coursework, evaluations, and student progression at Cannoga College.',
    alternates: {
        canonical: 'https://cannogacollege.ca/academic-regulations/',
    },
};

const regulations = [
    {
        id: "reg-1",
        question: "1. Purpose and Scope",
        order_index: 1,
        answer: "The Academic Regulations establish the framework governing teaching, learning, assessment, and academic progression at Cannoga College. These policies apply to all registered students across undergraduate and postgraduate programmes."
    },
    {
        id: "reg-2",
        question: "2. Academic Structure & Credit Framework",
        order_index: 2,
        answer: (
            <div className="space-y-3">
                <p>Academic programmes at Cannoga College are organized into defined terms and modular credit units:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Programmes are organized into structured academic terms or semesters.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Each programme and individual course carries a defined credit value based on contact and independent study workload.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Academic progression is contingent upon the successful completion and verification of required credits.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "reg-3",
        question: "3. Student Enrollment Status",
        order_index: 3,
        answer: (
            <div className="space-y-3">
                <p>Enrolled individuals at Cannoga College hold one of the following official registry statuses:</p>
                <ul className="space-y-2.5 pl-1">
                    {[
                        "Enrolled: Actively registered and attending courses",
                        "On Leave of Absence: Approved temporary pause in academic studies",
                        "Withdrawn: Formally discontinued studies through the Registry Office",
                        "Graduated: Successfully completed all degree requirements",
                        "Dismissed: Terminated on academic probation or disciplinary grounds"
                    ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                            <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )
    },
    {
        id: "reg-4",
        question: "4. Course Registration & Deadlines",
        order_index: 4,
        answer: (
            <div className="space-y-3">
                <p>Students must complete course registration through the digital student portal within published enrolment periods.</p>
                <p className="font-semibold text-slate-900">Registration is strictly subject to:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Programme requirements and mandatory curriculum pathways</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Verification of course prerequisites and language requirements</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Maximum semester credit caps and course capacity limits</span>
                    </li>
                </ul>
                <p className="text-sm text-slate-500 italic">Late course registrations are subject to registry approval and administrative late fees.</p>
            </div>
        )
    },
    {
        id: "reg-5",
        question: "5. Attendance and Participation",
        order_index: 5,
        answer: (
            <div className="space-y-3">
                <p>Regular attendance and active engagement in lectures, seminars, laboratory practicals, and collaborative studios are expected of all enrolled students.</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Minimum mandatory attendance thresholds apply to accredited practical modules.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Failure to satisfy attendance requirements may result in disqualification from final assessments or examinations.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "reg-6",
        question: "6. Assessment & Grading Schemes",
        order_index: 6,
        answer: (
            <div className="space-y-3">
                <p>Student academic achievement is measured using transparent, criterion-referenced evaluation frameworks:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Assessment methods include written examinations, applied coursework, laboratory reports, design portfolios, and thesis defences.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Grades are awarded in accordance with Cannoga&apos;s institutional grading scale.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>All officially verified grades are recorded in the central transcript database.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "reg-7",
        question: "7. Academic Integrity & Code of Ethics",
        order_index: 7,
        answer: (
            <div className="space-y-3">
                <p>All members of the Cannoga College academic community are required to maintain the highest standards of intellectual honesty.</p>
                <p className="font-semibold text-slate-900">Strictly prohibited violations include:</p>
                <ul className="space-y-2.5 pl-1">
                    {[
                        "Plagiarism: Submitting work, code, or ideas of others without explicit citation",
                        "Cheating: Unauthorized assistance or materials during examinations",
                        "Data Fabrication: Falsification of research metrics, experiment results, or survey data",
                        "Unauthorized Collaboration: Joint submission on individual graded assessments"
                    ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                            <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
                <p className="text-sm font-semibold text-slate-800">Integrity violations carry severe penalties ranging from course failure to formal institutional expulsion.</p>
            </div>
        )
    },
    {
        id: "reg-8",
        question: "8. Academic Progression & Continuation",
        order_index: 8,
        answer: (
            <div className="space-y-3">
                <p>Students must meet minimum GPA and credit completion milestones at the conclusion of each academic cycle:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Students must maintain satisfactory academic standing to progress to subsequent years.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Academic probation is issued when cumulative performance drops below threshold.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Failure to clear probationary standing within the designated period leads to academic discontinuation.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "reg-9",
        question: "9. Leave of Absence & Withdrawal Policy",
        order_index: 9,
        answer: (
            <div className="space-y-3">
                <p>Guidelines for temporary study pauses and permanent institutional withdrawals:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Leaves of absence may be granted for medical, personal, or military reasons upon submission of documentary proof.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Official withdrawal forms must be processed through Student Services and the Registry.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Fee adjustments and transcript notations are determined based on the official withdrawal date.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "reg-10",
        question: "10. Degree Conferral & Graduation",
        order_index: 10,
        answer: (
            <div className="space-y-3">
                <p>Degrees, diplomas, and postgraduate credentials are officially conferred by the Academic Council upon satisfying all graduation requirements:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Successful completion and credit validation of all mandatory and elective modules</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Full clearance of all financial, library, and laboratory obligations</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Attainment of the minimum qualifying cumulative grade point average (GPA)</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "reg-11",
        question: "11. Permanent Records & Transcript Issuance",
        order_index: 11,
        answer: (
            <div className="space-y-3">
                <p>Cannoga College securely maintains complete academic transcripts in compliance with Canadian privacy and institutional retention statutes.</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Official sealed transcripts and e-transcripts can be requested via the Student Portal.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Academic records are retained permanently in the institutional registry.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "reg-12",
        question: "12. Regulatory Amendments & Updates",
        order_index: 12,
        answer: "Cannoga College reserves the right to amend and refine academic regulations to reflect evolving accreditation standards and educational best practices. Any policy revisions will be officially published and communicated to students through institutional channels."
    }
];

export default function AcademicRegulationsPage() {
    return (
        <div className="min-h-screen bg-white text-black antialiased font-sans pb-24">
            {/* HERO SECTION */}
            <Hero
                title="Academic Regulations"
                body="The official framework governing teaching, learning, assessment, and academic progression across all programmes at Cannoga College."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                overlay={true}
                overlayOpacity="opacity-40"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Academic Regulations' }
                ]}
                image={{
                    src: "/images/alumni-hero.png",
                    alt: "Cannoga Academic Regulations"
                }}
            />

            {/* MAIN CONTENT ACCORDION */}
            <main className="container mx-auto max-w-5xl px-4 py-16 space-y-16 text-base md:text-lg font-normal text-slate-700 leading-relaxed">
                <section className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight">Official Policies &amp; Standards</h2>
                    <p className="text-slate-700 text-base md:text-lg font-normal leading-relaxed max-w-3xl">
                        Select any regulation below to review full policy guidelines, student responsibilities, and procedural details.
                    </p>
                </section>

                <section className="pt-4">
                    <AcademicRegulationsAccordion items={regulations} />
                </section>

                {/* RELATED LINKS */}
                <section className="pt-8 border-t border-slate-200 space-y-6">
                    <h3 className="text-2xl font-black text-black tracking-tight">Related Policies &amp; Documents</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <Link 
                            href="/admissions-policy" 
                            className="p-5 border border-slate-200 hover:border-black transition-colors block text-[#0a151a] font-bold text-base no-underline rounded-sm space-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <span>Admissions Policy</span>
                                <ArrowRight size={16} weight="bold" />
                            </div>
                            <p className="text-sm text-slate-600 font-normal leading-normal">Undergraduate and graduate entry criteria</p>
                        </Link>
                        <Link 
                            href="/student-guide" 
                            className="p-5 border border-slate-200 hover:border-black transition-colors block text-[#0a151a] font-bold text-base no-underline rounded-sm space-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <span>Student Guide</span>
                                <ArrowRight size={16} weight="bold" />
                            </div>
                            <p className="text-sm text-slate-600 font-normal leading-normal">Campus life, registration, and services</p>
                        </Link>
                        <Link 
                            href="/contact" 
                            className="p-5 border border-slate-200 hover:border-black transition-colors block text-[#0a151a] font-bold text-base no-underline rounded-sm space-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <span>Registry Office</span>
                                <ArrowRight size={16} weight="bold" />
                            </div>
                            <p className="text-sm text-slate-600 font-normal leading-normal">Official transcripts and records</p>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}


