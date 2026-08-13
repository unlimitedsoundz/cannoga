import type { Metadata } from 'next';
import { Link } from "@aalto-dx/react-components";

export const metadata: Metadata = {
    title: 'Community Code of Conduct & Ethics — Cannoga College',
    description: 'Learn about the behavioral standards, ethics, and values that guide interactions and maintain a respectful campus environment.',
    alternates: {
        canonical: 'https://cannogacollege.ca/code-of-conduct/',
    },
};

export default function CodeOfConductPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-[#0a151a] text-white pt-40 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#f3e600] mb-4">Official Policy</p>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Code of Conduct</h1>
                    <p className="text-neutral-400 text-lg max-w-2xl">
                        Establishing standards of behavior expected of all members of the University community to ensure a safe, respectful, ethical, and academically focused environment.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="space-y-16">

                        {/* 1. Purpose and Principles */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">1</span>
                                <h2 className="text-2xl font-bold">Purpose and Principles</h2>
                            </div>
                            <div className="pl-14">
                                <p className="text-black leading-relaxed mb-4">
                                    The Code of Conduct of Cannoga College establishes standards of behavior expected of all members of the University community. It aims to ensure a safe, respectful, ethical, and academically focused environment that supports learning and institutional integrity.
                                </p>
                                <p className="text-black mb-2 font-bold">This Code applies to conduct occurring:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        On campus or institutional premises
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Online and within digital systems
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        During academic, administrative, or University-related activities
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        In any context where a student represents Cannoga College
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 2. Scope of Application */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">2</span>
                                <h2 className="text-2xl font-bold">Scope of Application</h2>
                            </div>
                            <div className="pl-14">
                                <p className="text-black mb-4">This Code of Conduct applies to:</p>
                                <ul className="space-y-2 mb-4">
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        All enrolled students (Bachelor&apos;s and Master&apos;s)
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Students on leave of absence
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Applicants who have accepted an offer of admission
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Participants in University-sponsored activities
                                    </li>
                                </ul>
                                <p className="text-black">The University reserves the right to take action when conduct adversely affects the institution or its community.</p>
                            </div>
                        </div>

                        {/* 3. Core Values */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">3</span>
                                <h2 className="text-2xl font-bold">Core Values</h2>
                            </div>
                            <div className="pl-14">
                                <p className="text-black mb-4">Members of the Cannoga College community are expected to uphold the following values:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Integrity and honesty
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Respect for others
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Responsibility and accountability
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Academic professionalism
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Compliance with institutional regulations
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 4. Expected Standards of Behavior */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">4</span>
                                <h2 className="text-2xl font-bold">Expected Standards of Behavior</h2>
                            </div>
                            <div className="pl-14">
                                <p className="text-black mb-4">Students are expected to:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Act with honesty and integrity in all academic and non-academic activities
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Treat fellow students, staff, faculty, and visitors with respect
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Follow all academic, administrative, and financial regulations
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Use institutional systems and resources responsibly
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Comply with applicable laws and regulations
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 5. Prohibited Conduct */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">5</span>
                                <h2 className="text-2xl font-bold">Prohibited Conduct</h2>
                            </div>
                            <div className="pl-14 space-y-8">
                                <p className="text-black">The following behaviors are strictly prohibited and may result in disciplinary action.</p>

                                <div>
                                    <h3 className="font-bold text-lg mb-3">5.1 Academic Misconduct</h3>
                                    <p className="text-black mb-2">Includes but is not limited to:</p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Plagiarism
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Cheating during assessments
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Fabrication or falsification of academic data
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Unauthorized collaboration
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Submission of work not authored by the student
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg mb-3">5.2 Disruptive or Abusive Behavior</h3>
                                    <p className="text-black mb-2">Includes:</p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Harassment, intimidation, or threats
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Discrimination or hate speech
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Verbal or written abuse
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Behavior that disrupts teaching, learning, or administrative processes
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg mb-3">5.3 Misuse of Institutional Resources</h3>
                                    <p className="text-black mb-2">Includes:</p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Unauthorized access to systems or data
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Sharing login credentials
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Tampering with IT systems
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Misuse of email, platforms, or networks
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg mb-3">5.4 Dishonesty and Misrepresentation</h3>
                                    <p className="text-black mb-2">Includes:</p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Providing false information to the University
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Submitting fraudulent documents
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Impersonation
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Misrepresentation of affiliation with Cannoga College
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg mb-3">5.5 Safety and Security Violations</h3>
                                    <p className="text-black mb-2">Includes:</p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Actions that endanger the safety of others
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Damage to property
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Failure to comply with safety instructions
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Unauthorized access to restricted areas
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg mb-3">5.6 Financial Misconduct</h3>
                                    <p className="text-black mb-2">Includes:</p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Non-payment of fees after enrollment
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Fraudulent payment activity
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Abuse of refund or financial aid processes
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 6. Online and Digital Conduct */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">6</span>
                                <h2 className="text-2xl font-bold">Online and Digital Conduct</h2>
                            </div>
                            <div className="pl-14">
                                <p className="text-black mb-3">Students must adhere to this Code when using:</p>
                                <ul className="space-y-2 mb-4">
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Learning Management Systems (LMS)
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Student portals
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Institutional email
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Online classrooms and forums
                                    </li>
                                </ul>
                                <p className="text-black mb-2">Prohibited digital behavior includes:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Cyber harassment
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Academic dishonesty in online assessments
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Unauthorized recording or distribution of content
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Inappropriate or offensive communications
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 7. Reporting Misconduct */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">7</span>
                                <h2 className="text-2xl font-bold">Reporting Misconduct</h2>
                            </div>
                            <div className="pl-14 space-y-6">
                                <div>
                                    <h3 className="font-bold text-lg mb-3">7.1 Reporting Channels</h3>
                                    <p className="text-black mb-2">Concerns or violations may be reported to:</p>
                                    <ul className="space-y-2 mb-2">
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Academic staff
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Administrative offices
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Designated student services or compliance units
                                        </li>
                                    </ul>
                                    <p className="text-black text-sm italic">Reports should be made in good faith.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-3">7.2 False or Malicious Reports</h3>
                                    <p className="text-black">Knowingly submitting false or malicious reports may itself result in disciplinary action.</p>
                                </div>
                            </div>
                        </div>

                        {/* 8. Disciplinary Process */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">8</span>
                                <h2 className="text-2xl font-bold">Disciplinary Process</h2>
                            </div>
                            <div className="pl-14 space-y-6">
                                <div>
                                    <h3 className="font-bold text-lg mb-3">8.1 Investigation</h3>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Alleged violations are reviewed objectively
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            The student may be required to provide a response
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Relevant evidence is examined
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-3">8.2 Interim Measures</h3>
                                    <p className="text-black mb-2">Where necessary, the University may impose temporary measures, including:</p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Restricted access to systems
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Suspension pending investigation
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-3">8.3 Decision</h3>
                                    <p className="text-black mb-2">Decisions are based on:</p>
                                    <ul className="space-y-2 mb-2">
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Severity of the violation
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Previous conduct
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Impact on the community
                                        </li>
                                    </ul>
                                    <p className="text-black text-sm italic">Outcomes are communicated formally.</p>
                                </div>
                            </div>
                        </div>

                        {/* 9. Disciplinary Sanctions */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">9</span>
                                <h2 className="text-2xl font-bold">Disciplinary Sanctions</h2>
                            </div>
                            <div className="pl-14">
                                <p className="text-black mb-3">Sanctions may include, but are not limited to:</p>
                                <ul className="space-y-2 mb-2">
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Written warning
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Academic penalty
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Probation
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Suspension
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Dismissal from the University
                                    </li>
                                </ul>
                                <p className="text-black text-sm italic">Sanctions are proportionate and documented.</p>
                            </div>
                        </div>

                        {/* 10. Appeals */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">10</span>
                                <h2 className="text-2xl font-bold">Appeals</h2>
                            </div>
                            <div className="pl-14">
                                <p className="text-black mb-3">Students have the right to appeal certain disciplinary decisions.</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Appeals must be submitted in writing
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Appeals must be based on procedural error, new evidence, or disproportional sanction
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Appeal decisions are final
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 11. Confidentiality and Records */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">11</span>
                                <h2 className="text-2xl font-bold">Confidentiality and Records</h2>
                            </div>
                            <div className="pl-14">
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Disciplinary records are maintained securely
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Access is limited to authorized personnel
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Records are retained in accordance with institutional policies
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 12. Non-Retaliation */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">12</span>
                                <h2 className="text-2xl font-bold">Non-Retaliation</h2>
                            </div>
                            <div className="pl-14">
                                <p className="text-black mb-2">Cannoga College prohibits retaliation against individuals who:</p>
                                <ul className="space-y-2 mb-2">
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Report misconduct in good faith
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Participate in disciplinary processes
                                    </li>
                                </ul>
                                <p className="text-black font-bold">Retaliation is a serious violation of this Code.</p>
                            </div>
                        </div>

                        {/* 13. Responsibility to Know the Code */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">13</span>
                                <h2 className="text-2xl font-bold">Responsibility to Know the Code</h2>
                            </div>
                            <div className="pl-14">
                                <p className="text-black mb-2">Students are responsible for:</p>
                                <ul className="space-y-2 mb-2">
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Reading and understanding this Code of Conduct
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Seeking clarification where needed
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Complying with all applicable regulations
                                    </li>
                                </ul>
                                <p className="text-black italic">Ignorance of the Code does not exempt a student from responsibility.</p>
                            </div>
                        </div>

                        {/* 14. Amendments and Review */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">14</span>
                                <h2 className="text-2xl font-bold">Amendments and Review</h2>
                            </div>
                            <div className="pl-14">
                                <p className="text-black mb-2">Cannoga College reserves the right to:</p>
                                <ul className="space-y-2 mb-2">
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Amend this Code of Conduct
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Update disciplinary procedures
                                    </li>
                                </ul>
                                <p className="text-black">The most current version is published on the official website.</p>
                            </div>
                        </div>

                        {/* 15. Effective Date */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">15</span>
                                <h2 className="text-2xl font-bold">Effective Date</h2>
                            </div>
                            <div className="pl-14">
                                <p className="text-black">This Code of Conduct takes effect upon publication and applies to all students enrolled thereafter.</p>
                            </div>
                        </div>

                    </div>

                    {/* Related Links */}
                    <div className="mt-20 pt-12">
                        <h3 className="font-bold text-lg mb-6">Related Documents</h3>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/academic-regulations" className="bg-[#0a151a] text-white px-6 py-3 font-bold text-sm hover:bg-neutral-800 transition-colors">
                                Academic Regulations →
                            </Link>
                            <Link href="/student-handbook" className="border border-[#0a151a] px-6 py-3 font-bold text-sm hover:bg-[#0a151a] hover:text-white transition-colors">
                                Student Handbook →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

