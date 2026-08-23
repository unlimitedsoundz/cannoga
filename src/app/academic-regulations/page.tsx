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
        question: "1. Purpose and Institutional Scope",
        order_index: 1,
        answer: (
            <div className="space-y-3">
                <p>The Academic Regulations establish the mandatory framework governing curriculum design, teaching standards, assessments, student rights, and progression criteria across all academic schools at Cannoga College.</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Applies to all registered students enrolled in Degree, Diploma, and Postgraduate certificate programs.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Operates under the authority of the Academic Board and the Office of the Registrar in Ottawa, Ontario.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Students are responsible for familiarizing themselves with institutional regulations upon enrollment.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "reg-2",
        question: "2. Academic Structure & Credit System",
        order_index: 2,
        answer: (
            <div className="space-y-3">
                <p>Academic programmes at Cannoga College are structured into standard semesters adhering to Canadian post-secondary credit allocation standards:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Semester Format:</strong> The academic year consists of Fall (September – December), Winter (January – April), and optional Summer (May – August) sessions.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Credit Definition:</strong> One credit represents approximately 25 to 30 hours of combined lecture contact, laboratory exercises, and independent research.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Standard Workload:</strong> Full-time undergraduate workload consists of 15 credits (typically 5 courses) per semester. Minimum full-time status requires at least 9 credits.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "reg-3",
        question: "3. Student Enrollment Status & Registry Classifications",
        order_index: 3,
        answer: (
            <div className="space-y-3">
                <p>Enrolled individuals hold one of the following official registry classifications:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-4 border border-slate-200 rounded-sm">
                        <h4 className="font-bold text-slate-900 text-base">Active Enrolled Status</h4>
                        <p className="text-sm text-slate-600 font-normal mt-1">Student is registered in approved courses, has fulfilled tuition commitments, and maintains library and campus facility privileges.</p>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-sm">
                        <h4 className="font-bold text-slate-900 text-base">Leave of Absence</h4>
                        <p className="text-sm text-slate-600 font-normal mt-1">Formal authorized hiatus for medical, personal, or military reasons. Granted for up to 2 consecutive semesters with guaranteed re-entry.</p>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-sm">
                        <h4 className="font-bold text-slate-900 text-base">Academic Probation</h4>
                        <p className="text-sm text-slate-600 font-normal mt-1">Conditional status where cumulative GPA drops below 2.0. Mandatory advising and course load restrictions apply.</p>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-sm">
                        <h4 className="font-bold text-slate-900 text-base">Official Withdrawal</h4>
                        <p className="text-sm text-slate-600 font-normal mt-1">Voluntary discontinuation of studies processed via the Registrar. Student must reapply for future admission consideration.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: "reg-4",
        question: "4. Course Registration, Add/Drop & Prerequisites",
        order_index: 4,
        answer: (
            <div className="space-y-3">
                <p>Students must complete course registration through the digital student portal within designated enrolment windows:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Add/Drop Period:</strong> Courses may be added or dropped without academic penalty during the first 10 business days of each standard term.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Course Withdrawal (W):</strong> Withdrawals after the add/drop window up to week 8 result in a recorded &apos;W&apos; mark, which does not impact cumulative GPA.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Prerequisite Waiver:</strong> Students seeking to bypass prerequisites must obtain written approval from the Department Chair prior to term commencement.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "reg-5",
        question: "5. Attendance, Laboratory & Studio Engagement",
        order_index: 5,
        answer: (
            <div className="space-y-3">
                <p>Active participation in lectures, seminars, laboratory practicals, and design studios is fundamental to curriculum mastery:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Mandatory Practical Sessions:</strong> Laboratory and studio courses require a minimum 80% physical attendance record to be eligible for final grading.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Excused Absences:</strong> Medical illnesses, family emergencies, or documented institutional athletic representation must be submitted within 5 days.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Unexcused Absences:</strong> Exceeding unexcused absence limits may result in administrative withdrawal (grade of &apos;FW&apos;) from the course.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "reg-6",
        question: "6. Grading Scale & Evaluation Framework",
        order_index: 6,
        answer: (
            <div className="space-y-4">
                <p>Academic performance is evaluated using a standard 4.0 grade point scale:</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse border border-slate-200">
                        <thead>
                            <tr className="bg-[#0a151a] text-white">
                                <th className="p-3 font-bold border border-slate-700">Grade</th>
                                <th className="p-3 font-bold border border-slate-700">Percentage</th>
                                <th className="p-3 font-bold border border-slate-700">GPA Value</th>
                                <th className="p-3 font-bold border border-slate-700">Performance Description</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700 divide-y divide-slate-200">
                            <tr><td className="p-2.5 font-bold border">A+ / A</td><td className="p-2.5 border">85% – 100%</td><td className="p-2.5 font-bold border">4.00</td><td className="p-2.5 border">Exceptional / Outstanding mastery</td></tr>
                            <tr><td className="p-2.5 font-bold border">A-</td><td className="p-2.5 border">80% – 84%</td><td className="p-2.5 font-bold border">3.70</td><td className="p-2.5 border">Excellent command of concepts</td></tr>
                            <tr><td className="p-2.5 font-bold border">B+ / B</td><td className="p-2.5 border">73% – 79%</td><td className="p-2.5 font-bold border">3.00 – 3.30</td><td className="p-2.5 border">Very Good / Solid comprehension</td></tr>
                            <tr><td className="p-2.5 font-bold border">B-</td><td className="p-2.5 border">70% – 72%</td><td className="p-2.5 font-bold border">2.70</td><td className="p-2.5 border">Good foundational competence</td></tr>
                            <tr><td className="p-2.5 font-bold border">C+ / C</td><td className="p-2.5 border">60% – 69%</td><td className="p-2.5 font-bold border">2.00 – 2.30</td><td className="p-2.5 border">Satisfactory passing standard</td></tr>
                            <tr><td className="p-2.5 font-bold border">D</td><td className="p-2.5 border">50% – 59%</td><td className="p-2.5 font-bold border">1.00</td><td className="p-2.5 border">Marginal pass; prerequisite restrictions apply</td></tr>
                            <tr><td className="p-2.5 font-bold text-red-600 border">F</td><td className="p-2.5 border">0% – 49%</td><td className="p-2.5 font-bold text-red-600 border">0.00</td><td className="p-2.5 border">Failure; no credits awarded</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    },
    {
        id: "reg-7",
        question: "7. Academic Integrity, Plagiarism & AI Policies",
        order_index: 7,
        answer: (
            <div className="space-y-3">
                <p>Cannoga College adheres to zero tolerance for academic dishonesty and intellectual fraud:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Plagiarism:</strong> Representing another person&apos;s ideas, text, design, or source code without formal citation or credit.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Generative AI Use:</strong> AI tools may only be utilized where course instructors explicitly authorize them in the syllabus. Undisclosed AI generation constitutes plagiarism.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Disciplinary Sanctions:</strong> First infractions result in grade of zero for the assignment and formal notation. Repeat violations result in course failure, suspension, or permanent expulsion.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "reg-8",
        question: "8. Academic Appeals, Petitions & Grade Reviews",
        order_index: 8,
        answer: (
            <div className="space-y-3">
                <p>Students hold the right to appeal formal grades or academic standing decisions where procedural error or unfairness is substantiated:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Informal Resolution:</strong> The student must first consult with the course instructor within 10 business days of grade release.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Formal Stage 2 Appeal:</strong> If unresolved, a written petition is submitted to the Academic Appeals Committee accompanied by evidence.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Committee Ruling:</strong> The Appeals Committee convenes an independent review panel whose decision is final and binding.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "reg-9",
        question: "9. Examinations, In-Person Invigilation & Deferred Exams",
        order_index: 9,
        answer: (
            <div className="space-y-3">
                <p>Examination protocols maintain academic security and equal assessment conditions:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Official Identification:</strong> Students must present a valid Cannoga Student ID Card at all midterm and final examination sessions.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Prohibited Items:</strong> Smart devices, unapproved calculators, notes, and unauthorized electronic aids are strictly barred from examination halls.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Deferred Examinations:</strong> Petitions for deferred exams due to severe medical incapacity must be accompanied by certified physician documentation within 48 hours.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "reg-10",
        question: "10. Accessibility Accommodations & Special Considerations",
        order_index: 10,
        answer: (
            <div className="space-y-3">
                <p>Cannoga College is committed to inclusive education and barrier-free learning:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Accessibility Services:</strong> Students with diagnosed disabilities, neurodivergent conditions, or temporary injuries can register with the Student Accessibility Centre.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Standard Accommodations:</strong> Extra time on assessments, quiet testing environments, assistive software, and tailored classroom materials.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Confidentiality:</strong> Medical and diagnostic records remain strictly confidential and do not appear on academic transcripts.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "reg-11",
        question: "11. Degree Conferral, Graduation & Honours Distinctions",
        order_index: 11,
        answer: (
            <div className="space-y-3">
                <p>Degrees, diplomas, and postgraduate certificates are conferred upon meeting all governance benchmarks:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Graduation Application:</strong> Prospective graduates must submit an Intent to Graduate form via the student portal by published deadlines.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Graduation with Distinction:</strong> Awarded to undergraduate graduates achieving a cumulative GPA of 3.80 or higher with zero probationary marks.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Financial Clearance:</strong> All library loans, parking citations, and outstanding tuition balances must be settled before parchment release.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "reg-12",
        question: "12. Research Ownership & Intellectual Property (IP)",
        order_index: 12,
        answer: (
            <div className="space-y-3">
                <p>Policy governing student and faculty research output, creations, and patents:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Student Coursework IP:</strong> Students retain primary copyright over course assignments, creative portfolios, and independent theses.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Sponsored Industry Research:</strong> Projects funded by commercial grants or institutional research partners operate under joint IP agreements negotiated prior to project commencement.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Institutional Repository:</strong> All final theses and capstone projects are archived in the Cannoga Open Access Research Repository for public scholarly citation.</span>
                    </li>
                </ul>
            </div>
        )
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
                            href="/admissions-policy/" 
                            className="p-5 border border-slate-200 hover:border-black transition-colors block text-[#0a151a] font-bold text-base no-underline rounded-sm space-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <span>Admissions Policy</span>
                                <ArrowRight size={16} weight="bold" />
                            </div>
                            <p className="text-sm text-slate-600 font-normal leading-normal">Undergraduate and graduate entry criteria</p>
                        </Link>
                        <Link 
                            href="/student-guide/" 
                            className="p-5 border border-slate-200 hover:border-black transition-colors block text-[#0a151a] font-bold text-base no-underline rounded-sm space-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <span>Student Guide</span>
                                <ArrowRight size={16} weight="bold" />
                            </div>
                            <p className="text-sm text-slate-600 font-normal leading-normal">Campus life, registration, and services</p>
                        </Link>
                        <Link 
                            href="/contact/" 
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


