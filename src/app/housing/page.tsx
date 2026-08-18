import { Metadata } from 'next';
import { StepBadge } from '@/components/ui/StepBadge';
import { Link } from "@aalto-dx/react-components";
import { Hero } from '@/components/layout/Hero';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import { Highlight } from '@/components/ui/Highlight';
import { CheckCircle, Quotes, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { HousingOptionsHubCarousel } from '@/components/housing/HousingOptionsHubCarousel';
import { ExploreHousingCarousel } from '@/components/housing/ExploreHousingCarousel';
import { RelatedStudentGuidesCarousel } from '@/components/housing/RelatedStudentGuidesCarousel';

export const metadata: Metadata = {
    title: 'Student Housing & Residences',
    description: 'Discover on-campus residences, homestay programs, and verified off-campus rentals in Ottawa. Complete guide to student accommodations at Cannoga College.',
    alternates: {
        canonical: 'https://cannogacollege.ca/housing/',
    },
};

const sections = [
    { id: 'overview', title: 'Housing Overview', content: '' },
    { id: 'options', title: 'Housing Options', content: '' },
    { id: 'pricing', title: 'Monthly Costs', content: '' },
    { id: 'application', title: 'Application Process', content: '' },
    { id: 'tenant-rights', title: 'Tenant Rights', content: '' },
    { id: 'related', title: 'Related Guides', content: '' },
];

export default function HousingPage() {
    return (
        <div className="min-h-screen bg-white text-black font-sans pb-12">
            {/* HERO SECTION */}
            <Hero
                title="Housing"
                body="Welcome to your new home in Ottawa. Explore on-campus student residences, verified local homestays, and off-campus rental support tailored for Cannoga College students."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                overlay={true}
                overlayOpacity="opacity-40"
                image={{
                    src: "/images/student-housing-hero.png",
                    alt: "Cannoga College Student Housing & Residences in Ottawa"
                }}
            />

            <GuideSidebarLayout
                sections={sections}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Student Life', href: '/student-life' },
                    { label: 'Housing' }
                ]}
            >
                <div className="cc-container py-8 md:py-12 space-y-10 md:space-y-14 text-base md:text-lg font-normal text-slate-700 leading-relaxed">

                    {/* OVERVIEW & HIGHLIGHT STATS */}
                    <section id="overview" className="scroll-mt-32 space-y-4">
                        <div className="max-w-3xl mb-6">
                            <h2 className="text-2xl md:text-4xl font-bold text-black tracking-tight leading-tight">
                                Safe, Modern &amp; Connected Student Living
                            </h2>
                            <p className="mt-2 text-base md:text-lg text-slate-700 leading-relaxed font-normal">
                                Whether you prefer living directly on campus, sharing an apartment in downtown Ottawa, or living with a Canadian homestay family, Cannoga Housing Services supports you every step of the way.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                            {[
                                { number: "100%", label: "First-Year Guarantee Option", desc: "Priority residence spots for new international & domestic students." },
                                { number: "15 min", label: "Transit to Downtown", desc: "Convenient OC Transpo light rail & bus access from all partner housing." },
                                { number: "$550+", label: "Monthly Starting Rent", desc: "Flexible budget options for shared, single, and homestay rooms." },
                                { number: "24/7", label: "Campus Security & Support", desc: "On-site residence advisors and round-the-clock emergency assistance." },
                            ].map((stat, i) => (
                                <div key={i} className="space-y-1">
                                    <span className="text-2xl md:text-3xl font-black text-[#0a151a]">{stat.number}</span>
                                    <h3 className="font-bold text-black text-base md:text-lg">{stat.label}</h3>
                                    <p className="text-base text-slate-700 leading-relaxed font-normal">{stat.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* HOUSING OPTIONS (Carousel Style) */}
                    <section id="options" className="scroll-mt-32 space-y-6">
                        <div>
                            <h2 className="text-aalto-5 font-bold text-black tracking-tight mb-2">Explore Housing Options</h2>
                            <p className="text-base md:text-lg text-slate-700 font-normal">Find the living environment that matches your study lifestyle and budget.</p>
                        </div>

                        <ExploreHousingCarousel />
                    </section>

                    {/* FEATURED STUDENT QUOTE (President Quote Style - No Background Container) */}
                    <Highlight
                        body="Finding housing through Cannoga's residence portal was smooth and worry-free. Having a fully furnished apartment right next to my classes allowed me to focus 100% on my studies and meet friends from day one."
                        source="Anav Mukesh from India, MSc Cybersecurity"
                    />

                    {/* PRICING & COMPARISON (Student Resource Hub Carousel Style) */}
                    <section id="pricing" className="scroll-mt-32 space-y-6">
                        <div>
                            <h2 className="text-aalto-5 font-bold text-black tracking-tight mb-2">Average Monthly Housing Costs in Ottawa</h2>
                            <p className="text-base md:text-lg text-slate-700 font-normal">
                                All prices are estimated in Canadian Dollars (CAD) per month and include utility baseline estimates.
                            </p>
                        </div>

                        <HousingOptionsHubCarousel />
                    </section>

                    {/* HOW TO APPLY & STEPS */}
                    <section id="application" className="scroll-mt-32 space-y-4">
                        <h2 className="text-aalto-5 font-bold text-black tracking-tight mb-3">Step-by-Step Housing Application Process</h2>
                        <div className="space-y-4 text-left">
                            {[
                                {
                                    step: 1,
                                    title: "Receive Admission Offer",
                                    desc: "Once accepted into a Cannoga College degree, diploma, or certificate program, you will receive your Student ID and access credentials."
                                },
                                {
                                    step: 2,
                                    title: "Log into the Student Housing Portal",
                                    desc: "Access the online portal to indicate your accommodation preferences (On-Campus Residence, Homestay, or Off-Campus assistance)."
                                },
                                {
                                    step: 3,
                                    title: "Submit Roommate & Suite Preferences",
                                    desc: "Select single gender or co-ed floors, quiet study floors, dietary needs, or request specific friends as suite mates."
                                },
                                {
                                    step: 4,
                                    title: "Confirm Offer & Deposit",
                                    desc: "Pay your initial housing deposit to secure your room guarantee for the upcoming Autumn or Winter academic intake."
                                }
                            ].map(({ step, title, desc }) => (
                                <div key={step} className="flex gap-4 items-start">
                                <StepBadge step={step} size="w-8 h-8" />
                                    <div>
                                        <h4 className="font-bold text-black text-base md:text-lg mb-1">{title}</h4>
                                        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* TENANT RIGHTS & LEGAL ADVICE */}
                    <section id="tenant-rights" className="scroll-mt-32 space-y-4">
                        <h2 className="text-aalto-5 font-bold text-black tracking-tight mb-2">Ontario Tenant Rights &amp; Legal Protections</h2>
                        <p className="text-sm font-bold uppercase tracking-widest text-[#0a151a] mb-2">
                            <a
                                href="https://www.ontario.ca/laws/statute/06r17"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 hover:text-[#c89211] underline transition-colors"
                            >
                                Residential Tenancies Act (RTA) — Province of Ontario
                                <ArrowSquareOut size={14} weight="bold" />
                            </a>
                        </p>
                        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal mb-3">
                            All off-campus student tenants in Ontario are protected under provincial law. Your landlord cannot request illegal key deposits, perform unlawful evictions, or raise rent outside annual government guidelines.
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 pt-2">
                            <div className="space-y-2">
                                <h4 className="font-bold text-[#0a151a] text-base md:text-lg">
                                    Standard Ontario Lease
                                </h4>
                                <p className="text-base text-slate-700 leading-relaxed font-normal">
                                    Landlords must use the official Ontario Standard Lease template.
                                </p>
                                <a
                                    href="https://www.ontario.ca/page/guide-ontarios-standard-lease-new-residential-tenancy-agreements"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#0a151a] hover:text-[#c89211] underline transition-colors"
                                >
                                    View Standard Lease Form <ArrowSquareOut size={14} weight="bold" />
                                </a>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold text-[#0a151a] text-base md:text-lg">
                                    First &amp; Last Month Limit
                                </h4>
                                <p className="text-base text-slate-700 leading-relaxed font-normal">
                                    Security deposits exceeding first and last month rent are illegal in Ontario.
                                </p>
                                <a
                                    href="https://www.ontario.ca/page/renting-ontario-your-rights#section-3"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#0a151a] hover:text-[#c89211] underline transition-colors"
                                >
                                    Ontario Rent & Deposit Rules <ArrowSquareOut size={14} weight="bold" />
                                </a>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold text-[#0a151a] text-base md:text-lg">
                                    LTB Dispute Resolution
                                </h4>
                                <p className="text-base text-slate-700 leading-relaxed font-normal">
                                    Disputes are resolved fairly by the Ontario Landlord and Tenant Board.
                                </p>
                                <a
                                    href="https://tribunalsontario.ca/ltb/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#0a151a] hover:text-[#c89211] underline transition-colors"
                                >
                                    Tribunals Ontario (LTB) Portal <ArrowSquareOut size={14} weight="bold" />
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* RELATED INTERNAL GUIDES */}
                    <section id="related" className="scroll-mt-32 pt-8 border-t border-neutral-200 space-y-4">
                        <div className="mb-4">
                            <h3 className="text-aalto-5 font-bold text-black tracking-tight">Related Student Guides</h3>
                            <p className="text-base md:text-lg text-slate-700 font-normal">Explore detailed guidance on arrival, housing checklists, and international student compliance.</p>
                        </div>
                        <RelatedStudentGuidesCarousel />
                    </section>

                </div>
            </GuideSidebarLayout>
        </div>
    );
}
