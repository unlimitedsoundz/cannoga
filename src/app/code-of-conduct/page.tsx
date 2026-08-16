import type { Metadata } from 'next';
import { Link } from "@aalto-dx/react-components";

export const metadata: Metadata = {
    title: 'Community Code of Conduct & Ethics',
    description: 'Learn about the behavioral standards, ethics, and values that guide interactions and maintain a respectful campus environment.',
    alternates: {
        canonical: 'https://cannogacollege.ca/code-of-conduct/',
    },
};

export default function CodeOfConductPage() {
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
                        Code of Conduct
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl leading-relaxed">
                        Establishing standards of behavior expected of all members of the Cannoga College community to ensure a safe, respectful, ethical, and academically focused environment.
                    </p>
                </div>
            </section>

            {/* MAIN CONTENT WITH SIDEBAR NAVIGATION */}
            <div className="container mx-auto max-w-6xl px-4 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* STICKY SECTION NAV */}
                <div className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-28 space-y-4 p-6 bg-slate-50 border border-slate-200 rounded-none text-xs font-bold uppercase tracking-wider text-slate-700">
                        <p className="text-slate-400 text-[10px] pb-2 border-b border-slate-200">Code Table of Contents</p>
                        <nav className="flex flex-col space-y-2">
                            <a href="#purpose" className="hover:text-black transition-colors">1. Purpose & Principles</a>
                            <a href="#scope" className="hover:text-black transition-colors">2. Scope of Application</a>
                            <a href="#values" className="hover:text-black transition-colors">3. Core Values</a>
                            <a href="#standards" className="hover:text-black transition-colors">4. Expected Standards</a>
                            <a href="#prohibited" className="hover:text-black transition-colors">5. Prohibited Conduct</a>
                            <a href="#digital" className="hover:text-black transition-colors">6. Online & Digital Conduct</a>
                            <a href="#reporting" className="hover:text-black transition-colors">7. Reporting Misconduct</a>
                            <a href="#process" className="hover:text-black transition-colors">8. Disciplinary Process</a>
                            <a href="#sanctions" className="hover:text-black transition-colors">9. Disciplinary Sanctions</a>
                            <a href="#appeals" className="hover:text-black transition-colors">10. Appeals Procedure</a>
                            <a href="#confidentiality" className="hover:text-black transition-colors">11. Confidentiality</a>
                            <a href="#non-retaliation" className="hover:text-black transition-colors">12. Non-Retaliation</a>
                            <a href="#responsibility" className="hover:text-black transition-colors">13. Student Responsibility</a>
                            <a href="#amendments" className="hover:text-black transition-colors">14. Governance</a>
                            <a href="#effective-date" className="hover:text-black transition-colors">15. Effective Date</a>
                        </nav>
                    </div>
                </div>

                {/* POLICY CONTENT BODY */}
                <div className="lg:col-span-3 space-y-14">

                    {/* 1. PURPOSE AND PRINCIPLES */}
                    <section id="purpose" className="scroll-mt-28 border-t-2 border-[#0a151a] pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">01</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Purpose &amp; Principles</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            The Code of Conduct of Cannoga College establishes standards of behavior expected of all members of the College community. It aims to ensure a safe, respectful, ethical, and academically focused environment that supports learning and institutional integrity.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed mb-3 font-medium">This Code applies to conduct occurring:</p>
                        <ul className="list-disc pl-6 space-y-2 text-base text-slate-800 marker:text-black">
                            <li>On campus or institutional premises in Ottawa.</li>
                            <li>Online and within digital learning environments or student portals.</li>
                            <li>During academic, administrative, or College-related activities.</li>
                            <li>In any context where a student represents Cannoga College.</li>
                        </ul>
                    </section>

                    {/* 2. SCOPE OF APPLICATION */}
                    <section id="scope" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">02</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Scope of Application</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">This Code of Conduct applies to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-base text-slate-800 marker:text-black mb-4">
                            <li>All enrolled students across Bachelor&apos;s, Master&apos;s, Diploma, and Certificate programmes.</li>
                            <li>Students on approved leave of absence or exchange programmes.</li>
                            <li>Applicants who have accepted an offer of admission.</li>
                            <li>Participants in College-sponsored events and activities.</li>
                        </ul>
                        <p className="text-base text-slate-700 leading-relaxed">
                            The College reserves the right to take action when conduct adversely affects the institution or its community.
                        </p>
                    </section>

                    {/* 3. CORE VALUES */}
                    <section id="values" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">03</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Core Values</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">Members of the Cannoga College community are expected to uphold the following values:</p>
                        <ul className="list-disc pl-6 space-y-2 text-base text-slate-800 marker:text-black">
                            <li><strong>Integrity and Honesty:</strong> Truthfulness in all academic and personal interactions.</li>
                            <li><strong>Respect for Others:</strong> Dignity, inclusion, and courtesy toward all community members.</li>
                            <li><strong>Responsibility and Accountability:</strong> Owning one&apos;s actions and their impact.</li>
                            <li><strong>Academic Professionalism:</strong> Rigorous, ethical pursuit of knowledge and skill.</li>
                            <li><strong>Regulatory Compliance:</strong> Adherence to College policies and applicable Canadian law.</li>
                        </ul>
                    </section>

                    {/* 4. EXPECTED STANDARDS OF BEHAVIOR */}
                    <section id="standards" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">04</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Expected Standards of Behavior</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">Students are expected to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-base text-slate-800 marker:text-black">
                            <li>Act with honesty and integrity in all academic and non-academic activities.</li>
                            <li>Treat fellow students, staff, faculty, and visitors with respect.</li>
                            <li>Follow all academic, administrative, and financial regulations.</li>
                            <li>Use institutional systems and campus resources responsibly.</li>
                            <li>Comply with federal, provincial, and local laws.</li>
                        </ul>
                    </section>

                    {/* 5. PROHIBITED CONDUCT */}
                    <section id="prohibited" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">05</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Prohibited Conduct</h2>
                        </div>
                        <div className="space-y-6 text-base text-slate-700">
                            <div className="border-l-2 border-[#0a151a] pl-4">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">5.1 Academic Misconduct</h3>
                                <ul className="list-disc pl-5 space-y-1 text-slate-800">
                                    <li>Plagiarism and submitting uncredited work.</li>
                                    <li>Cheating during assessments or exams.</li>
                                    <li>Fabrication or falsification of academic data.</li>
                                    <li>Unauthorized collaboration or impersonation.</li>
                                </ul>
                            </div>

                            <div className="border-l-2 border-slate-300 pl-4">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">5.2 Disruptive &amp; Abusive Behavior</h3>
                                <ul className="list-disc pl-5 space-y-1 text-slate-800">
                                    <li>Harassment, intimidation, or physical threats.</li>
                                    <li>Discrimination or hate speech.</li>
                                    <li>Verbal or written abuse toward faculty, staff, or peers.</li>
                                    <li>Disrupting teaching, research, or administrative operations.</li>
                                </ul>
                            </div>

                            <div className="border-l-2 border-slate-300 pl-4">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">5.3 Resource Misuse &amp; Safety Violations</h3>
                                <ul className="list-disc pl-5 space-y-1 text-slate-800">
                                    <li>Unauthorized system access or credential sharing.</li>
                                    <li>Tampering with IT systems or campus facilities.</li>
                                    <li>Actions endangering the safety of others or property damage.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 6. ONLINE AND DIGITAL CONDUCT */}
                    <section id="digital" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">06</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Online &amp; Digital Conduct</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Students must adhere strictly to this Code when utilizing LMS platforms, student portals, college email, or participating in official social media groups.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-base text-slate-800 marker:text-black">
                            <li>Cyber harassment, trolling, or inappropriate communications are prohibited.</li>
                            <li>Unauthorized recording or distribution of lecture content is forbidden.</li>
                        </ul>
                    </section>

                    {/* 7. REPORTING MISCONDUCT */}
                    <section id="reporting" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">07</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Reporting Misconduct</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Concerns or policy violations may be reported in good faith to academic staff, department heads, or designated compliance officers.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Knowingly submitting false or malicious reports constitutes a direct violation of this Code.
                        </p>
                    </section>

                    {/* 8. DISCIPLINARY PROCESS */}
                    <section id="process" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">08</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Disciplinary Process</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Alleged infractions undergo objective investigation by the Disciplinary Board. Students will be provided written notification of allegations and an opportunity to respond.
                        </p>
                    </section>

                    {/* 9. DISCIPLINARY SANCTIONS */}
                    <section id="sanctions" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">09</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Disciplinary Sanctions</h2>
                        </div>
                        <div className="border border-slate-200 rounded-none overflow-hidden text-sm mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 bg-slate-100 p-4 font-bold text-slate-900 border-b border-slate-200">
                                <div>Sanction Level</div>
                                <div className="md:col-span-2 font-bold">Institutional Action</div>
                            </div>
                            {[
                                { term: "Written Warning", def: "Formal reprimand placed in permanent student record." },
                                { term: "Academic Penalty", def: "Grade reduction, zero score on assignment, or module failure." },
                                { term: "Disciplinary Probation", def: "Conditional enrollment period with restricted privileges." },
                                { term: "Suspension", def: "Temporary removal from campus and academic system access." },
                                { term: "Expulsion / Dismissal", def: "Permanent termination of student status at Cannoga College." },
                            ].map((item, i, arr) => (
                                <div key={i} className={`grid grid-cols-1 md:grid-cols-3 p-4 ${i !== arr.length - 1 ? 'border-b border-slate-200' : ''} hover:bg-slate-50 transition-colors`}>
                                    <div className="font-bold text-slate-900 mb-1 md:mb-0">{item.term}</div>
                                    <div className="md:col-span-2 text-slate-700">{item.def}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 10. APPEALS PROCEDURE */}
                    <section id="appeals" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">10</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Appeals Procedure</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Students have the right to appeal disciplinary outcomes within 14 calendar days based on procedural error, new evidence, or disproportionality of sanctions. Decisions rendered by the Appeals Panel are final.
                        </p>
                    </section>

                    {/* 11. CONFIDENTIALITY AND RECORDS */}
                    <section id="confidentiality" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">11</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Confidentiality &amp; Records</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Disciplinary records are maintained confidentially and separately from academic transcripts, accessible only by authorized personnel in compliance with privacy laws.
                        </p>
                    </section>

                    {/* 12. NON-RETALIATION */}
                    <section id="non-retaliation" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">12</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Non-Retaliation</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Cannoga College strictly prohibits retaliation against any individual who reports misconduct in good faith or participates in a disciplinary proceeding.
                        </p>
                    </section>

                    {/* 13. STUDENT RESPONSIBILITY */}
                    <section id="responsibility" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">13</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Responsibility to Know the Code</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            All students are responsible for reading, understanding, and complying with this Code. Ignorance of institutional regulations does not exempt a student from responsibility.
                        </p>
                    </section>

                    {/* 14. GOVERNANCE AND AMENDMENTS */}
                    <section id="amendments" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">14</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Governance &amp; Amendments</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            This Code is reviewed annually by the Academic Council. Amendments are effective upon official publication on the web portal.
                        </p>
                    </section>

                    {/* 15. EFFECTIVE DATE */}
                    <section id="effective-date" className="scroll-mt-28 border-t border-slate-200 pt-8 border-b pb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">15</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Effective Date</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-6">
                            This Code of Conduct is effective for the 2026–2027 Academic Year and applies to all active students.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200">
                            <Link href="/admissions-policy" className="bg-[#0a151a] text-white px-6 py-3 font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors no-underline">
                                Admissions Policy →
                            </Link>
                            <Link href="/student-handbook" className="border border-[#0a151a] text-[#0a151a] px-6 py-3 font-bold text-xs uppercase tracking-wider hover:bg-[#0a151a] hover:text-white transition-colors no-underline">
                                Student Handbook →
                            </Link>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
