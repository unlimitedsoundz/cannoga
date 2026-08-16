import { Metadata } from 'next';
import { StepBadge } from '@/components/ui/StepBadge';
import { Link } from "@aalto-dx/react-components";
import { Hero } from '@/components/layout/Hero';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import { Highlight } from '@/components/ui/Highlight';
import { CheckCircle, Quotes } from "@phosphor-icons/react/dist/ssr";
import { HousingOptionsHubCarousel } from '@/components/housing/HousingOptionsHubCarousel';
import { ExploreHousingCarousel } from '@/components/housing/ExploreHousingCarousel';

export const metadata: Metadata = {
    title: 'Student Housing & Residences — Cannoga College Ottawa',
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
                title="Student Housing & Accommodations"
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
                    { label: 'Housing & Accommodations' }
                ]}
            >
                <div className="cc-container py-8 md:py-12 space-y-10">

                    {/* OVERVIEW & HIGHLIGHT STATS */}
                    <section id="overview" className="scroll-mt-32">
                        <div className="max-w-3xl mb-6">
                            <h2 className="text-2xl md:text-4xl font-bold text-black tracking-tight leading-tight">
                                Safe, Modern &amp; Connected Student Living
                            </h2>
                            <p className="mt-2 text-base text-neutral-600 leading-relaxed font-medium">
                                Whether you prefer living directly on campus, sharing an apartment in downtown Ottawa, or living with a Canadian homestay family, Cannoga Housing Services supports you every step of the way.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { number: "100%", label: "First-Year Guarantee Option", desc: "Priority residence spots for new international & domestic students." },
                                { number: "15 min", label: "Transit to Downtown", desc: "Convenient OC Transpo light rail & bus access from all partner housing." },
                                { number: "$550+", label: "Monthly Starting Rent", desc: "Flexible budget options for shared, single, and homestay rooms." },
                                { number: "24/7", label: "Campus Security & Support", desc: "On-site residence advisors and round-the-clock emergency assistance." },
                            ].map((stat, i) => (
                                <div key={i} className="space-y-1">
                                    <span className="text-2xl md:text-3xl font-black text-[#0a151a]">{stat.number}</span>
                                    <h3 className="font-bold text-black text-sm md:text-base">{stat.label}</h3>
                                    <p className="text-xs text-neutral-600 leading-relaxed font-medium">{stat.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* HOUSING OPTIONS (Carousel Style) */}
                    <section id="options" className="scroll-mt-32 space-y-6">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight mb-2">Explore Housing Options</h2>
                            <p className="text-sm text-neutral-600 font-medium">Find the living environment that matches your study lifestyle and budget.</p>
                        </div>

                        <ExploreHousingCarousel />
                    </section>

                    {/* FEATURED STUDENT QUOTE (President Quote Style - No Background Container) */}
                    <div className="relative py-4 my-2">
                        {/* Blue quote icon */}
                        <Quotes
                            size={52}
                            weight="fill"
                            className="text-blue-500 mb-3"
                        />
                        <div className="space-y-4 pl-4 md:pl-6 border-l-4 border-blue-400">
                            <blockquote className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 leading-snug">
                                &ldquo;Finding housing through Cannoga&apos;s residence portal was smooth and worry-free. Having a fully furnished apartment right next to my classes allowed me to focus 100% on my studies and meet friends from day one.&rdquo;
                            </blockquote>
                            <div className="flex items-center gap-3 pt-1">
                                <div className="w-8 h-0.5 bg-[#c89211]"></div>
                                <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#0f2027]">
                                    Anav Mukesh, MSc Student
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* PRICING & COMPARISON (Student Resource Hub Carousel Style) */}
                    <section id="pricing" className="scroll-mt-32 space-y-6">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight mb-2">Average Monthly Housing Costs in Ottawa</h2>
                            <p className="text-neutral-600 text-sm font-medium">
                                All prices are estimated in Canadian Dollars (CAD) per month and include utility baseline estimates.
                            </p>
                        </div>

                        <HousingOptionsHubCarousel />
                    </section>

                    {/* HOW TO APPLY & STEPS */}
                    <section id="application" className="scroll-mt-32">
                        <h2 className="text-aalto-5 font-bold text-black tracking-tight mb-3">Step-by-Step Housing Application Process</h2>
                        <div className="space-y-3 text-left">
                            {[
                                {
                                    step: 1,
                                    title: "Receive Admission Offer",
                                    desc: "Once accepted into a Cannoga College degree, diploma, or certificate program, you will receive your Student ID and access credentials."
                                },
                                {
                                    step: 2,
                                    title: "Log into the Cannoga Student Housing Portal",
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
                                <div key={step} className="flex gap-3 items-start">
                                <StepBadge step={step} size="w-8 h-8" />
                                    <div>
                                        <h4 className="font-bold text-black text-base mb-0.5">{title}</h4>
                                        <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* TENANT RIGHTS & LEGAL ADVICE */}
                    <section id="tenant-rights" className="scroll-mt-32">
                        <h2 className="text-aalto-5 font-bold text-black tracking-tight mb-2">Ontario Tenant Rights & Legal Protections</h2>
                        <p className="text-xs text-neutral-500 font-medium mb-3">Residential Tenancies Act (RTA) — Province of Ontario</p>
                        <p className="text-xs md:text-sm text-neutral-700 leading-relaxed font-medium mb-3">
                            All off-campus student tenants in Ontario are protected under provincial law. Your landlord cannot request illegal key deposits, perform unlawful evictions, or raise rent outside annual government guidelines.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4 pt-1">
                            <div className="space-y-1">
                                <h4 className="font-bold text-[#0a151a] text-sm">
                                    Standard Ontario Lease
                                </h4>
                                <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                                    Landlords must use the official Ontario Standard Lease template.
                                </p>
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-bold text-[#0a151a] text-sm">
                                    First &amp; Last Month Limit
                                </h4>
                                <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                                    Security deposits exceeding first and last month rent are illegal in Ontario.
                                </p>
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-bold text-[#0a151a] text-sm">
                                    LTB Dispute Resolution
                                </h4>
                                <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                                    Disputes are resolved fairly by the Ontario Landlord and Tenant Board.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* RELATED INTERNAL GUIDES */}
                    <section id="related" className="scroll-mt-32 pt-4 border-t border-neutral-200">
                        <h3 className="text-lg font-bold text-black mb-3">Related Student Guides</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <Link href="/student-guide/housing-for-students" className="font-bold text-black hover:text-[#c89211] transition-colors text-sm block mb-1">Housing Guide for Students →</Link>
                                <p className="text-xs text-neutral-600 leading-relaxed font-medium">Detailed rental market breakdowns, neighbourhood guides, and landlord checklists.</p>
                            </div>
                            <div>
                                <Link href="/student-guide/arrival" className="font-bold text-black hover:text-[#c89211] transition-colors text-sm block mb-1">Ottawa Arrival Guide →</Link>
                                <p className="text-xs text-neutral-600 leading-relaxed font-medium">Airport pickup, SIM cards, opening Canadian bank accounts, and settling into Ottawa.</p>
                            </div>
                            <div>
                                <Link href="/student-guide/international" className="font-bold text-black hover:text-[#c89211] transition-colors text-sm block mb-1">International Student Guide →</Link>
                                <p className="text-xs text-neutral-600 leading-relaxed font-medium">Study permits, visa compliance, health insurance (UHIP), and orientation programs.</p>
                            </div>
                        </div>
                    </section>

                </div>
            </GuideSidebarLayout>
        </div>
    );
}
