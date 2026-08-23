import type { Metadata } from 'next';
import { Hero } from '@/components/layout/Hero';
import { Link } from '@/components/ui/Link';
import AcademicRegulationsAccordion from '@/components/academic/AcademicRegulationsAccordion';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';

export const metadata: Metadata = {
    title: 'Community Code of Conduct & Ethics',
    description: 'Learn about the behavioral standards, ethics, and values that guide interactions and maintain a respectful campus environment.',
    alternates: {
        canonical: 'https://cannogacollege.ca/code-of-conduct/',
    },
};

const conductPolicies = [
    {
        id: "conduct-1",
        question: "1. Purpose, Core Principles & Institutional Scope",
        order_index: 1,
        answer: (
            <div className="space-y-3">
                <p>The Code of Conduct of Cannoga College establishes behavioral standards expected of all members of the College community to foster a safe, inclusive, ethical, and academically focused environment.</p>
                <p className="font-semibold text-slate-900">This Code applies to conduct occurring:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>On campus facilities, lecture halls, studios, laboratories, and residence grounds in Ottawa.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Across digital learning management systems (LMS), student portals, and official virtual meeting spaces.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>During official academic internships, field research trips, study exchanges, and conferences.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>In any external context where an individual represents Cannoga College.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "conduct-2",
        question: "2. Scope of Application & Governance Authority",
        order_index: 2,
        answer: (
            <div className="space-y-3">
                <p>This Code governs all individuals holding active affiliation with Cannoga College, including:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>All enrolled students across Bachelor&apos;s, Master&apos;s, Diploma, and Certificate programmes.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Students on approved leaves of absence, internships, or exchange programmes.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Applicants who have accepted an official offer of admission.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Participants in College-sponsored athletic events, public seminars, and student club activities.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "conduct-3",
        question: "3. Institutional Core Values",
        order_index: 3,
        answer: (
            <div className="space-y-3">
                <p>Community life and governance at Cannoga College are grounded in five foundational pillars:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-4 border border-slate-200 rounded-sm">
                        <h4 className="font-bold text-slate-900 text-base">Respect &amp; Civility</h4>
                        <p className="text-sm text-slate-600 font-normal mt-1">Treating every individual with dignity, courtesy, and fairness regardless of background or perspective.</p>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-sm">
                        <h4 className="font-bold text-slate-900 text-base">Academic Integrity</h4>
                        <p className="text-sm text-slate-600 font-normal mt-1">Upholding honesty, intellectual transparency, and ethical attribution across all scholarly work.</p>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-sm">
                        <h4 className="font-bold text-slate-900 text-base">Inclusivity &amp; Diversity</h4>
                        <p className="text-sm text-slate-600 font-normal mt-1">Fostering a welcoming multicultural environment where diverse identities and ideas thrive.</p>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-sm">
                        <h4 className="font-bold text-slate-900 text-base">Safety &amp; Well-being</h4>
                        <p className="text-sm text-slate-600 font-normal mt-1">Maintaining secure physical and digital spaces free from harassment, violence, and intimidation.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: "conduct-4",
        question: "4. Expected Standards of Community Behavior",
        order_index: 4,
        answer: (
            <div className="space-y-3">
                <p>All students and campus community members are expected to:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Contribute positively to a supportive, respectful learning environment.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Comply with institutional policies, health &amp; safety instructions, and Ontario statutes.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Respect College property, library resources, laboratories, and physical facilities.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Cooperate constructively with campus safety officers, faculty, and administrative staff.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "conduct-5",
        question: "5. Prohibited Conduct & Disciplinary Violations",
        order_index: 5,
        answer: (
            <div className="space-y-3">
                <p>Cannoga College strictly prohibits the following categories of behavioral misconduct:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Harassment &amp; Bullying:</strong> Verbal abuse, psychological intimidation, sexual harassment, or discrimination based on protected grounds.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Disruptive Behavior:</strong> Actions that impede lectures, laboratory operations, examinations, or official College ceremonies.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Property Damage &amp; Theft:</strong> Vandalism, unauthorized appropriation, or defacement of institutional or peer assets.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Controlled Substances:</strong> Unauthorized possession, consumption, or distribution of illicit substances or open alcohol on campus premises.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "conduct-6",
        question: "6. Online & Digital Platform Conduct",
        order_index: 6,
        answer: (
            <div className="space-y-3">
                <p>Rules governing digital behavior across campus networks, online portals, and institutional social channels:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Cyberbullying, cyberstalking, and the creation of defamatory content targeting faculty or students are prohibited.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Sharing or commercial distribution of copyrighted lecture recordings and exam materials without consent is barred.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Misuse of student credentials, identity theft, or unauthorized access to registry databases will be referred for criminal investigation.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "conduct-7",
        question: "7. Misconduct Reporting & Confidential Disclosure",
        order_index: 7,
        answer: (
            <div className="space-y-3">
                <p>Procedures for filing complaints regarding student or faculty misconduct:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Reports may be submitted directly to the Office of Student Services, Campus Security, or via the confidential online reporting desk.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Anonymous reports are investigated to the extent possible while upholding natural justice and fair hearing standards.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Urgent physical safety threats should be reported immediately to Campus Security or 911 emergency services.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "conduct-8",
        question: "8. Disciplinary Investigation Process & Natural Justice",
        order_index: 8,
        answer: (
            <div className="space-y-3">
                <p>When formal misconduct allegations are lodged, the Disciplinary Hearing Board executes a structured, impartial review:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Written Notification:</strong> The student receives formal written notice outlining allegations, evidence, and scheduled hearing dates.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Right to Defense:</strong> The respondent is entitled to present witness statements, submit documentation, and be accompanied by an advisor.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Standard of Proof:</strong> Decisions are rendered based on the balance of probabilities (more likely than not).</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "conduct-9",
        question: "9. Range of Disciplinary Sanctions",
        order_index: 9,
        answer: (
            <div className="space-y-3">
                <p>Depending on severity and recidivism, the Disciplinary Board may impose one or more of the following sanctions:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Formal Written Warning:</strong> Documented reprimand placed on internal student file.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Restitution &amp; Community Service:</strong> Mandatory compensation for property damage or assigned service hours.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Disciplinary Probation:</strong> Restrictions on extracurriculars, club leadership, or campus privileges for a set period.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Suspension or Expulsion:</strong> Temporary exclusion or permanent termination of enrolment with official transcript notation.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "conduct-10",
        question: "10. Appeals Procedure & Non-Retaliation Policy",
        order_index: 10,
        answer: (
            <div className="space-y-3">
                <p>Guarantees protecting fairness and protecting individuals reporting violations:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Appeals Timeline:</strong> Sanctioned students may lodge a formal appeal to the President&apos;s Review Board within 10 business days of notice.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Valid Appeal Grounds:</strong> Evidence of procedural unfairness, substantial new evidence, or disproportionate severity of sanctions.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Strict Non-Retaliation:</strong> Any threat or act of retaliation against complainants or witnesses constitutes a severe independent violation resulting in immediate suspension.</span>
                    </li>
                </ul>
            </div>
        )
    }
];

export default function CodeOfConductPage() {
    return (
        <div className="min-h-screen bg-white text-black antialiased font-sans pb-24">
            {/* HERO SECTION */}
            <Hero
                title="Code of Conduct"
                body="Establishing behavioral standards, community ethics, and accountability expected of all members of the Cannoga College academic community."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                overlay={true}
                overlayOpacity="opacity-40"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Code of Conduct' }
                ]}
                image={{
                    src: "/images/alumni-hero.png",
                    alt: "Cannoga Code of Conduct"
                }}
            />

            {/* MAIN CONTENT ACCORDION */}
            <main className="container mx-auto max-w-5xl px-4 py-16 space-y-16 text-base md:text-lg font-normal text-slate-700 leading-relaxed">
                <section className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight">Community Standards &amp; Disciplinary Framework</h2>
                    <p className="text-slate-700 text-base md:text-lg font-normal leading-relaxed max-w-3xl">
                        Review the official behavioural guidelines, natural justice procedures, and sanctions governing all Cannoga students, faculty, and visitors.
                    </p>
                </section>

                <section className="pt-4">
                    <AcademicRegulationsAccordion items={conductPolicies} />
                </section>

                {/* RELATED LINKS */}
                <section className="pt-8 border-t border-slate-200 space-y-6">
                    <h3 className="text-2xl font-black text-black tracking-tight">Related Governance Documents</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <Link 
                            href="/academic-regulations/" 
                            className="p-5 border border-slate-200 hover:border-black transition-colors block text-[#0a151a] font-bold text-base no-underline rounded-sm space-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <span>Academic Regulations</span>
                                <ArrowRight size={16} weight="bold" />
                            </div>
                            <p className="text-sm text-slate-600 font-normal leading-normal">Coursework, GPA, and progression</p>
                        </Link>
                        <Link 
                            href="/student-handbook/" 
                            className="p-5 border border-slate-200 hover:border-black transition-colors block text-[#0a151a] font-bold text-base no-underline rounded-sm space-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <span>Student Handbook</span>
                                <ArrowRight size={16} weight="bold" />
                            </div>
                            <p className="text-sm text-slate-600 font-normal leading-normal">Campus services and student handbook</p>
                        </Link>
                        <Link 
                            href="/admissions-policy/" 
                            className="p-5 border border-slate-200 hover:border-black transition-colors block text-[#0a151a] font-bold text-base no-underline rounded-sm space-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <span>Admissions Policy</span>
                                <ArrowRight size={16} weight="bold" />
                            </div>
                            <p className="text-sm text-slate-600 font-normal leading-normal">Admissions criteria and appeals</p>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
