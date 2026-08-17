import { Hero } from '@/components/layout/Hero';
import { Link } from '@/components/ui/Link';
import AcademicRegulationsAccordion from '@/components/academic/AcademicRegulationsAccordion';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';

const termsPolicies = [
    {
        id: "term-1",
        question: "1. Acceptance of Terms & Digital Agreement",
        order_index: 1,
        answer: (
            <div className="space-y-3">
                <p>By accessing or interacting with Cannoga College websites, portal services, application desks, and learning systems, you agree to be legally bound by these Terms of Use and all incorporated policies.</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>If you do not agree to these terms, you must discontinue use of the digital services immediately.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Use of authenticated student portals is further subject to the Student Code of Conduct.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "term-2",
        question: "2. Permitted Use & System Security Restrictions",
        order_index: 2,
        answer: (
            <div className="space-y-3">
                <p>Users are granted a limited, revocable, non-exclusive license to access public and authorized portal resources for educational, administrative, and research purposes.</p>
                <p className="font-semibold text-slate-900">Strictly prohibited activities include:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Attempting unauthorized access, penetration testing, or vulnerability scanning of college infrastructure.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Deploying automated scrapers, data harvesters, bots, or extraction scripts without written consent.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Sharing portal passwords, impersonating other users, or misrepresenting institutional affiliation.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "term-3",
        question: "3. Institutional Intellectual Property & Copyright",
        order_index: 3,
        answer: (
            <div className="space-y-3">
                <p>All digital assets, logos, brand typography, syllabus materials, videos, graphics, and underlying software code are the proprietary intellectual property of Cannoga College or licensed contributors.</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Reproduction, commercial resale, public dissemination, or mirrored hosting of curriculum content is prohibited.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Personal educational fair-use downloads are permitted strictly for enrolled students for coursework completion.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "term-4",
        question: "4. User Accounts, Credentials & Security",
        order_index: 4,
        answer: (
            <div className="space-y-3">
                <p>Security responsibilities for individuals holding Cannoga digital user credentials:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Users are solely responsible for maintaining the confidentiality of their Single Sign-On (SSO) login details.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Any activity originating under an authenticated account is attributed legally to the registered account holder.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Suspected security breaches or compromised passwords must be reported immediately to the IT Help Desk.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "term-5",
        question: "5. Service Availability, Disclaimers & Limitations of Liability",
        order_index: 5,
        answer: (
            <div className="space-y-3">
                <p>Legal provisions governing service delivery and platform availability:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Service Warranty:</strong> Digital services are provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of uninterrupted uptime during maintenance cycles.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Limitation of Liability:</strong> In no event shall Cannoga College be liable for indirect, incidental, or consequential damages resulting from digital platform downtime.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "term-6",
        question: "6. Data Privacy, Privacy Compliance & Governing Law",
        order_index: 6,
        answer: (
            <div className="space-y-3">
                <p>Jurisdiction, privacy statutes, and legal enforcement framework:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Privacy Compliance:</strong> All personal data collection adheres strictly to the Canadian Freedom of Information and Protection of Privacy Act (FIPPA) and PIPEDA.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Governing Law:</strong> These terms are governed exclusively by the laws of the Province of Ontario and the federal laws of Canada.</span>
                    </li>
                </ul>
            </div>
        )
    }
];

export default function TermsContent() {
    return (
        <div className="min-h-screen bg-white text-black antialiased font-sans pb-24">
            {/* HERO SECTION */}
            <Hero
                title="Terms of Use"
                body="Standard legal terms, conditions, acceptable use rules, and intellectual property policies governing access to all public and authenticated Cannoga College digital systems."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                overlay={true}
                overlayOpacity="opacity-40"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Terms of Use' }
                ]}
                image={{
                    src: "/images/alumni-hero.png",
                    alt: "Cannoga Terms of Use"
                }}
            />

            {/* MAIN CONTENT ACCORDION */}
            <main className="container mx-auto max-w-5xl px-4 py-16 space-y-16 text-base md:text-lg font-normal text-slate-700 leading-relaxed">
                <section className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight">Digital System Agreements &amp; Governance</h2>
                    <p className="text-slate-700 text-base md:text-lg font-normal leading-relaxed max-w-3xl">
                        Review terms governing digital service access, cybersecurity responsibilities, data protection, and intellectual property rights.
                    </p>
                </section>

                <section className="pt-4">
                    <AcademicRegulationsAccordion items={termsPolicies} />
                </section>

                {/* RELATED LINKS */}
                <section className="pt-8 border-t border-slate-200 space-y-6">
                    <h3 className="text-2xl font-black text-black tracking-tight">Related Institutional Policies</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <Link 
                            href="/privacy" 
                            className="p-5 border border-slate-200 hover:border-black transition-colors block text-[#0a151a] font-bold text-base no-underline rounded-sm space-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <span>Privacy Policy</span>
                                <ArrowRight size={16} weight="bold" />
                            </div>
                            <p className="text-sm text-slate-600 font-normal leading-normal">Student data retention and privacy</p>
                        </Link>
                        <Link 
                            href="/code-of-conduct" 
                            className="p-5 border border-slate-200 hover:border-black transition-colors block text-[#0a151a] font-bold text-base no-underline rounded-sm space-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <span>Code of Conduct</span>
                                <ArrowRight size={16} weight="bold" />
                            </div>
                            <p className="text-sm text-slate-600 font-normal leading-normal">Community ethics and digital conduct</p>
                        </Link>
                        <Link 
                            href="/academic-regulations" 
                            className="p-5 border border-slate-200 hover:border-black transition-colors block text-[#0a151a] font-bold text-base no-underline rounded-sm space-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <span>Academic Regulations</span>
                                <ArrowRight size={16} weight="bold" />
                            </div>
                            <p className="text-sm text-slate-600 font-normal leading-normal">Academic rules and grading standards</p>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
