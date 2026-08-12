import type { Metadata } from 'next';
import { Link } from "@aalto-dx/react-components";

export const metadata: Metadata = {
    title: 'Academic Guidelines & Regulations — Cannoga College',
    description: 'Review the official policies, rules, and academic standards governing coursework, evaluations, and student progression at Cannoga College.',
    alternates: {
        canonical: 'https://cannogacollege.ca/academic-regulations/',
    },
};

export default function AcademicRegulationsPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-[#9c27b3] text-white pt-40 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#f3e600] mb-4">Official Regulations</p>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Academic Regulations</h1>
                    <p className="text-neutral-400 text-lg max-w-2xl">
                        The framework governing teaching, learning, assessment, and academic progression at Cannoga College.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="space-y-16">

                        {/* 1. Purpose */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">1</span>
                                <h2 className="text-2xl font-bold">Purpose</h2>
                            </div>
                            <p className="text-black leading-relaxed pl-14">
                                The Academic Regulations establish the framework governing teaching, learning, assessment, and academic progression at Cannoga College.
                            </p>
                        </div>

                        {/* 2. Academic Structure */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">2</span>
                                <h2 className="text-2xl font-bold">Academic Structure</h2>
                            </div>
                            <ul className="pl-14 space-y-2">
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                    Programmes are organized into academic terms or semesters
                                </li>
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                    Each programme carries a defined credit value
                                </li>
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                    Progression is based on successful completion of required credits
                                </li>
                            </ul>
                        </div>

                        {/* 3. Enrollment Status */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">3</span>
                                <h2 className="text-2xl font-bold">Enrollment Status</h2>
                            </div>
                            <div className="pl-14">
                                <p className="text-black mb-4">Students may hold one of the following statuses:</p>
                                <ul className="space-y-2">
                                    {["Enrolled", "On Leave of Absence", "Withdrawn", "Graduated", "Dismissed (academic or disciplinary grounds)"].map((item) => (
                                        <li key={item} className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* 4. Course Registration */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">4</span>
                                <h2 className="text-2xl font-bold">Course Registration</h2>
                            </div>
                            <div className="pl-14 space-y-4">
                                <p className="text-black">Students must register for courses within designated registration periods.</p>
                                <p className="text-black mb-3">Registration is subject to:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                        Programme requirements
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                        Prerequisites
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                        Credit limits
                                    </li>
                                </ul>
                                <p className="text-black">Late registration may not be permitted.</p>
                            </div>
                        </div>

                        {/* 5. Attendance */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">5</span>
                                <h2 className="text-2xl font-bold">Attendance</h2>
                            </div>
                            <ul className="pl-14 space-y-2">
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                    Regular attendance is expected
                                </li>
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                    Minimum attendance requirements may apply
                                </li>
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                    Failure to meet attendance requirements may affect assessment eligibility
                                </li>
                            </ul>
                        </div>

                        {/* 6. Assessment & Grading */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">6</span>
                                <h2 className="text-2xl font-bold">Assessment & Grading</h2>
                            </div>
                            <ul className="pl-14 space-y-2">
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                    Assessment methods may include examinations, coursework, projects, or practical work
                                </li>
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                    Grades are awarded according to published grading scales
                                </li>
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                    All grades are recorded in the official academic record
                                </li>
                            </ul>
                        </div>

                        {/* 7. Academic Integrity */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">7</span>
                                <h2 className="text-2xl font-bold">Academic Integrity</h2>
                            </div>
                            <div className="pl-14 space-y-4">
                                <p className="text-black">Students are expected to uphold high standards of academic honesty.</p>
                                <p className="text-black mb-3">Prohibited conduct includes:</p>
                                <ul className="space-y-2">
                                    {["Plagiarism", "Cheating", "Fabrication of data", "Unauthorized collaboration"].map((item) => (
                                        <li key={item} className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-black font-medium">Violations may result in academic penalties.</p>
                            </div>
                        </div>

                        {/* 8. Progression & Continuation */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">8</span>
                                <h2 className="text-2xl font-bold">Progression & Continuation</h2>
                            </div>
                            <ul className="pl-14 space-y-2">
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                    Students must meet minimum academic performance requirements to continue
                                </li>
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                    Academic probation may be applied where performance is unsatisfactory
                                </li>
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                    Failure to improve may result in dismissal
                                </li>
                            </ul>
                        </div>

                        {/* 9. Leave of Absence & Withdrawal */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">9</span>
                                <h2 className="text-2xl font-bold">Leave of Absence & Withdrawal</h2>
                            </div>
                            <ul className="pl-14 space-y-2">
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                    Students may apply for a temporary leave of absence
                                </li>
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                    Withdrawals must be formally requested
                                </li>
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                    Financial and academic implications may apply
                                </li>
                            </ul>
                        </div>

                        {/* 10. Graduation */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">10</span>
                                <h2 className="text-2xl font-bold">Graduation</h2>
                            </div>
                            <div className="pl-14 space-y-4">
                                <p className="text-black mb-3">To graduate, students must:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                        Complete all programme requirements
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                        Settle all academic and financial obligations
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                        Meet minimum academic standards
                                    </li>
                                </ul>
                                <p className="text-black font-medium">Degrees are conferred upon approval by the academic board.</p>
                            </div>
                        </div>

                        {/* 11. Records & Transcripts */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">11</span>
                                <h2 className="text-2xl font-bold">Records & Transcripts</h2>
                            </div>
                            <ul className="pl-14 space-y-2">
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                    Cannoga College maintains permanent academic records
                                </li>
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                    Official transcripts are issued upon request
                                </li>
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#9c27b3] rounded-full mt-2 shrink-0"></span>
                                    Records are retained in accordance with institutional policies
                                </li>
                            </ul>
                        </div>

                        {/* 12. Amendments */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">12</span>
                                <h2 className="text-2xl font-bold">Amendments</h2>
                            </div>
                            <p className="text-black leading-relaxed pl-14">
                                Cannoga College reserves the right to amend academic regulations. Changes will be communicated to students in advance where possible.
                            </p>
                        </div>

                    </div>

                    {/* Related Links */}
                    <div className="mt-20 pt-12 ">
                        <h3 className="font-bold text-lg mb-6">Related Documents</h3>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/admissions-policy" className="bg-[#9c27b3] text-white px-6 py-3 font-bold text-sm hover:bg-neutral-800 transition-colors">
                                Admissions Policy →
                            </Link>
                            <Link href="/admissions" className="border border-[#9c27b3] px-6 py-3 font-bold text-sm hover:bg-[#9c27b3] hover:text-white transition-colors">
                                Admissions Overview →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

