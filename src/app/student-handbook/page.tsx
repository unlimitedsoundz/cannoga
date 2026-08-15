import type { Metadata } from 'next';
import { Link } from "@aalto-dx/react-components";
import { StudentResourceHubCarousel } from '@/components/home/StudentResourceHubCarousel';

export const metadata: Metadata = {
    title: 'Official Student Handbook & Regulations — Cannoga College',
    description: 'Read the official student handbook detailing code of ethics, grade appeal procedures, housing policies, and campus rules.',
    alternates: {
        canonical: 'https://cannogacollege.ca/student-handbook/',
    },
};

export default function StudentHandbookPage() {
    return (
        <div className="bg-white min-h-screen font-sans text-black">
            {/* HERO SECTION */}
            <section className="bg-[#0a151a] text-white pt-28 pb-20 md:pt-40 md:pb-28 px-4 border-b border-slate-800">
                <div className="container mx-auto max-w-5xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-400 mb-6">
                        <Link href="/" className="text-sky-400 hover:text-white transition-colors no-underline">HOME</Link>
                        <span className="text-slate-600">/</span>
                        <span>INSTITUTIONAL POLICIES</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white leading-tight">
                        Student Handbook
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl leading-relaxed">
                        Academic Year 2026–2027 official guide to academic life, institutional policies, student responsibilities, and regulations at Cannoga College in Ottawa, Ontario.
                    </p>
                </div>
            </section>

            {/* MAIN CONTENT WITH SIDEBAR NAVIGATION */}
            <div className="container mx-auto max-w-6xl px-4 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* STICKY SECTION NAV */}
                <div className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-28 space-y-4 p-6 bg-slate-50 border border-slate-200 rounded-none text-xs font-bold uppercase tracking-wider text-slate-700">
                        <p className="text-slate-400 text-[10px] pb-2 border-b border-slate-200">Handbook Table of Contents</p>
                        <nav className="flex flex-col space-y-2">
                            <a href="#welcome" className="hover:text-black transition-colors">1. Welcome Message</a>
                            <a href="#about" className="hover:text-black transition-colors">2. About Cannoga</a>
                            <a href="#status" className="hover:text-black transition-colors">3. Enrollment Status</a>
                            <a href="#academic-structure" className="hover:text-black transition-colors">4. Academic Structure</a>
                            <a href="#registration" className="hover:text-black transition-colors">5. Course Registration</a>
                            <a href="#attendance" className="hover:text-black transition-colors">6. Attendance</a>
                            <a href="#assessment" className="hover:text-black transition-colors">7. Assessment & Grading</a>
                            <a href="#progression" className="hover:text-black transition-colors">8. Progression</a>
                            <a href="#systems" className="hover:text-black transition-colors">9. Digital Systems</a>
                            <a href="#tuition" className="hover:text-black transition-colors">10. Tuition & Fees</a>
                            <a href="#housing" className="hover:text-black transition-colors">11. Housing & Services</a>
                            <a href="#conduct" className="hover:text-black transition-colors">12. Conduct & Discipline</a>
                            <a href="#leave" className="hover:text-black transition-colors">13. Leave & Withdrawal</a>
                            <a href="#records" className="hover:text-black transition-colors">14. Student Records</a>
                            <a href="#appeals" className="hover:text-black transition-colors">15. Complaints & Appeals</a>
                            <a href="#graduation" className="hover:text-black transition-colors">16. Graduation</a>
                            <a href="#governance" className="hover:text-black transition-colors">17. Governance</a>
                            <a href="#contact" className="hover:text-black transition-colors">18. Contact</a>
                        </nav>
                    </div>
                </div>

                {/* HANDBOOK CONTENT BODY */}
                <div className="lg:col-span-3 space-y-14">

                    {/* 1. WELCOME MESSAGE */}
                    <section id="welcome" className="scroll-mt-28 border-t-2 border-[#0a151a] pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">01</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Welcome Message</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Welcome to Cannoga College.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            This Student Handbook is the official guide to academic life, institutional policies, student responsibilities, and available services at Cannoga College. All students are required to read, understand, and comply with the regulations outlined in this handbook.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            This handbook forms part of the regulatory framework of Cannoga College and applies to all enrolled Bachelor&apos;s, Master&apos;s, Diploma, and Certificate students.
                        </p>
                    </section>

                    {/* 2. ABOUT CANNOGA COLLEGE */}
                    <section id="about" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">02</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">About Cannoga College</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Cannoga College is a higher education institution offering internationally oriented Bachelor&apos;s, Master&apos;s, Diploma, and Certificate programmes in Ottawa, Ontario, Canada. The College is committed to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-base text-slate-800 marker:text-black mb-4">
                            <li>Academic excellence and practical career readiness</li>
                            <li>Ethical conduct and institutional integrity</li>
                            <li>Transparency in governance and student administration</li>
                            <li>Student-centred learning and inclusive support</li>
                            <li>Global accessibility for domestic and international scholars</li>
                        </ul>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Cannoga College operates in full accordance with recognized academic standards and Ontario Ministry guidelines.
                        </p>
                    </section>

                    {/* 3. STUDENT STATUS & ENROLLMENT */}
                    <section id="status" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">03</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Student Status &amp; Enrollment</h2>
                        </div>
                        <div className="space-y-6 text-base text-slate-700">
                            <div className="border-l-2 border-[#0a151a] pl-4">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">3.1 Admission vs Enrollment</h3>
                                <p className="mb-2 font-semibold text-slate-900">A student becomes a fully enrolled student only after:</p>
                                <ul className="list-disc pl-5 space-y-1 text-slate-800 mb-4">
                                    <li>Accepting an official offer of admission via the student portal.</li>
                                    <li>Paying required tuition or enrollment confirmation fees.</li>
                                    <li>Receiving official enrollment confirmation from the Registrar.</li>
                                </ul>
                                <p className="mb-2 font-semibold text-slate-900">Upon complete enrollment:</p>
                                <ul className="list-disc pl-5 space-y-1 text-slate-800">
                                    <li>A permanent Student ID number is issued.</li>
                                    <li>Institutional email (@cannogacollege.ca) is activated.</li>
                                    <li>Full academic system and LMS access is granted.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3">3.2 Student Status Categories</h3>
                                <div className="border border-slate-200 rounded-none overflow-hidden text-sm">
                                    <div className="grid grid-cols-1 md:grid-cols-3 bg-slate-100 p-4 font-bold text-slate-900 border-b border-slate-200">
                                        <div>Status Code</div>
                                        <div className="md:col-span-2 font-bold">Institutional Definition</div>
                                    </div>
                                    {[
                                        { term: "Enrolled", def: "Actively registered and attending academic courses." },
                                        { term: "On Leave", def: "Approved temporary formal absence from studies." },
                                        { term: "Withdrawn", def: "Voluntarily discontinued studies at Cannoga College." },
                                        { term: "Graduated", def: "Successfully completed all academic degree requirements." },
                                        { term: "Dismissed", def: "Discontinued due to academic or disciplinary grounds." },
                                    ].map((item, i, arr) => (
                                        <div key={i} className={`grid grid-cols-1 md:grid-cols-3 p-4 ${i !== arr.length - 1 ? 'border-b border-slate-200' : ''} hover:bg-slate-50 transition-colors`}>
                                            <div className="font-bold text-slate-900 mb-1 md:mb-0">{item.term}</div>
                                            <div className="md:col-span-2 text-slate-700">{item.def}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 4. ACADEMIC STRUCTURE */}
                    <section id="academic-structure" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">04</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Academic Structure</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Cannoga College structures its academic offerings across clear degree pathways. Each programme defines required learning outcomes, credit totals, prerequisite chains, and progression rules.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-base text-slate-800 marker:text-black">
                            <li>Registration deadlines and drop dates are specified in the official Academic Calendar.</li>
                            <li>The academic year consists of Fall (September – December) and Winter (January – April) semesters.</li>
                            <li>All curriculum structures comply with provincial post-secondary accreditation frameworks.</li>
                        </ul>
                    </section>

                    {/* 5. COURSE REGISTRATION */}
                    <section id="registration" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">05</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Course Registration</h2>
                        </div>
                        <ul className="list-disc pl-6 space-y-2.5 text-base text-slate-800 marker:text-black mb-4">
                            <li>Students must register for courses during published registration windows via the Student Information System (SIS).</li>
                            <li>Students must satisfy all prerequisite course requirements prior to enrolling in advanced modules.</li>
                            <li>Changes to course selection during the published Add/Drop period must be submitted officially.</li>
                        </ul>
                    </section>

                    {/* 6. ATTENDANCE & ENGAGEMENT */}
                    <section id="attendance" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">06</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Attendance &amp; Engagement</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Regular class attendance and active participation are essential components of academic success at Cannoga College.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-base text-slate-800 marker:text-black">
                            <li>Certain specialized laboratory, workshop, and seminar courses enforce mandatory minimum attendance.</li>
                            <li>Unexcused absences exceeding institutional thresholds may result in grade penalties or course failure.</li>
                        </ul>
                    </section>

                    {/* 7. ASSESSMENT & GRADING */}
                    <section id="assessment" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">07</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Assessment &amp; Grading</h2>
                        </div>
                        <div className="space-y-6 text-base text-slate-700">
                            <div className="p-6 bg-slate-50 border border-slate-200 rounded-none">
                                <h3 className="text-lg font-bold text-slate-900 mb-3">7.1 Academic Integrity Policy</h3>
                                <p className="mb-3 font-medium text-slate-800">Cannoga College strictly prohibits all forms of academic dishonesty, including:</p>
                                <ul className="list-disc pl-5 space-y-1.5 text-slate-800 mb-4">
                                    <li>Plagiarism (submitting work without proper citation or attribution).</li>
                                    <li>Cheating during examinations or assessments.</li>
                                    <li>Fabrication or falsification of research data and results.</li>
                                    <li>Unauthorized collaboration or use of unauthorized AI generation tools where prohibited.</li>
                                </ul>
                                <p className="text-slate-800">Violations may incur formal penalties including grade reduction, module failure, or academic expulsion.</p>
                            </div>
                        </div>
                    </section>

                    {/* 8. ACADEMIC PROGRESSION */}
                    <section id="progression" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">08</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Academic Progression</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Students must maintain satisfactory academic standing as defined by their specific program regulations.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-base text-slate-800 marker:text-black">
                            <li>Students falling below GPA minimums will be placed on Academic Probation.</li>
                            <li>Continued underperformance across consecutive terms may lead to academic suspension or dismissal.</li>
                        </ul>
                    </section>

                    {/* 9. DIGITAL SYSTEMS */}
                    <section id="systems" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">09</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Digital Systems &amp; IT Usage</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Students are provided access to the Learning Management System (LMS), Student Information System (SIS), and digital library catalog.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-base text-slate-800 marker:text-black">
                            <li>Credentials must be kept confidential; sharing account credentials is strictly prohibited.</li>
                            <li>Use of college network infrastructure must comply with the Acceptable IT Use Policy.</li>
                        </ul>
                    </section>

                    {/* 10. TUITION FEES & PAYMENTS */}
                    <section id="tuition" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">10</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Tuition Fees &amp; Financial Obligations</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Tuition schedules are published annually. Students are required to settle tuition fees by the designated payment deadlines each semester.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-base text-slate-800 marker:text-black">
                            <li>Unpaid financial balances will result in financial holds affecting course registration and transcript issuance.</li>
                            <li>Refunds and withdrawals are governed strictly by the <Link href="/refund-withdrawal-policy" className="text-[#0a151a] font-bold underline hover:text-sky-700 transition-colors">Tuition Refund & Withdrawal Policy</Link>.</li>
                        </ul>
                    </section>

                    {/* 11. HOUSING & SERVICES */}
                    <section id="housing" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">11</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Housing &amp; Campus Services</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Cannoga College provides student support services including housing advisory, international student advising, and accessibility services.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-base text-slate-800 marker:text-black">
                            <li>Student housing placements are subject to availability and residence community guidelines.</li>
                        </ul>
                    </section>

                    {/* 12. STUDENT CONDUCT & DISCIPLINE */}
                    <section id="conduct" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">12</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Student Conduct &amp; Discipline</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Students are expected to conduct themselves respectfully toward faculty, staff, and peers at all times.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            For complete behavioral guidelines and disciplinary escalation frameworks, refer to the official <Link href="/code-of-conduct" className="text-[#0a151a] font-bold underline hover:text-sky-700 transition-colors">Code of Conduct</Link>.
                        </p>
                    </section>

                    {/* 13. LEAVE OF ABSENCE & WITHDRAWAL */}
                    <section id="leave" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">13</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Leave of Absence &amp; Withdrawal</h2>
                        </div>
                        <ul className="list-disc pl-6 space-y-2.5 text-base text-slate-800 marker:text-black">
                            <li>Formal requests for Leave of Absence must be submitted to the Registrar prior to term commencement.</li>
                            <li>Official withdrawal requires formal written notification and clearance from financial and academic services.</li>
                        </ul>
                    </section>

                    {/* 14. STUDENT RECORDS & TRANSCRIPTS */}
                    <section id="records" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">14</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Student Records &amp; Transcripts</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Permanent academic transcripts are maintained confidentially by the Office of the Registrar in compliance with privacy regulations. Official transcripts can be ordered through the student portal.
                        </p>
                    </section>

                    {/* 15. COMPLAINTS & APPEALS */}
                    <section id="appeals" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">15</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Complaints &amp; Appeals</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Students have the right to file formal academic or administrative grievances. Grade appeals must be submitted within 14 calendar days of grade publication in accordance with Academic Regulations.
                        </p>
                    </section>

                    {/* 16. GRADUATION */}
                    <section id="graduation" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">16</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Graduation &amp; Degree Conferral</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Degrees and diplomas are conferred upon students who have satisfied all academic curriculum requirements, maintained required academic standing, and cleared all financial accounts.
                        </p>
                    </section>

                    {/* 17. GOVERNANCE & AMENDMENTS */}
                    <section id="governance" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">17</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Governance &amp; Amendments</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Cannoga College reserves the right to make necessary updates to institutional regulations and handbooks. Any changes are approved by the Academic Council and published on the official web portal.
                        </p>
                    </section>

                    {/* 18. CONTACT & OFFICIAL COMMUNICATION */}
                    <section id="contact" className="scroll-mt-28 border-t border-slate-200 pt-8 border-b pb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">18</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Contact &amp; Official Channels</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-6">
                            All official academic and administrative communication is sent via official student email (@cannogacollege.ca) and student portal notifications.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200">
                            <Link href="/admissions-policy" className="bg-[#0a151a] text-white px-6 py-3 font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors no-underline">
                                Admissions Policy →
                            </Link>
                            <Link href="/academic-regulations" className="border border-[#0a151a] text-[#0a151a] px-6 py-3 font-bold text-xs uppercase tracking-wider hover:bg-[#0a151a] hover:text-white transition-colors no-underline">
                                Academic Regulations →
                            </Link>
                        </div>
                    </section>

                    {/* STUDENT RESOURCE HUB */}
                    <section id="resource-hub" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="mb-6">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">Student Resource Hub</h2>
                            <p className="text-sm text-slate-600 font-medium">Quick access to student support desks, health resources, careers, and financial guidance.</p>
                        </div>
                        <StudentResourceHubCarousel />
                    </section>

                </div>
            </div>
        </div>
    );
}
