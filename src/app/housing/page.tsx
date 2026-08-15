import { Metadata } from 'next';
import { StepBadge } from '@/components/ui/StepBadge';
import { Link } from "@aalto-dx/react-components";
import { Hero } from '@/components/layout/Hero';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import { Highlight } from '@/components/ui/Highlight';
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
    title: 'Student Housing & Residences â€” Cannoga College Ottawa',
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

                    {/* HOUSING OPTIONS */}
                    <section id="options" className="scroll-mt-32 space-y-4">
                        <div>
                            <h2 className="text-aalto-5 font-bold text-black tracking-tight mb-1">Explore Housing Options</h2>
                            <p className="text-sm text-neutral-500 font-medium">Find the living environment that matches your study lifestyle and budget.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <h3 className="font-bold text-base text-black mb-1">On-Campus Residence</h3>
                                <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium mb-2">Furnished private bedrooms with shared modern kitchens, high-speed Wi-Fi, study lounges, and social common rooms. Located steps from lecture halls and student services.</p>
                                <Link href="#application" className="font-bold underline text-xs uppercase tracking-widest text-[#0a151a]">View Residence Suites â†’</Link>
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-black mb-1">Canadian Homestay Program</h3>
                                <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium mb-2">Immerse yourself in Canadian culture by living with a welcoming local Ottawa family. Includes a private furnished bedroom, utility bills, and home-cooked meal plans.</p>
                                <Link href="#application" className="font-bold underline text-xs uppercase tracking-widest text-[#0a151a]">Explore Homestay â†’</Link>
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-black mb-1">Off-Campus Private Rentals</h3>
                                <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium mb-2">Prefer independent living? Discover trusted rental partners and verified apartment listings in Sandy Hill, Centretown, Byward Market, and Glebe.</p>
                                <Link href="#tenant-rights" className="font-bold underline text-xs uppercase tracking-widest text-[#0a151a]">Search Private Rentals â†’</Link>
                            </div>
                        </div>
                    </section>

                    {/* FEATURED HIGHLIGHT QUOTE */}
                    <Highlight
                        body="Finding housing through Cannoga's residence portal was smooth and worry-free. Having a fully furnished apartment right next to my classes allowed me to focus 100% on my studies and meet friends from day one."
                        source="Anav Mukesh, MSc Student"
                        alignment="left"
                    />

                    {/* PRICING & COMPARISON */}
                    <section id="pricing" className="scroll-mt-32 space-y-4">
                        <div>
                            <h2 className="text-aalto-5 font-bold text-black tracking-tight mb-1">Average Monthly Housing Costs in Ottawa</h2>
                            <p className="text-neutral-500 text-xs md:text-sm font-medium">
                                All prices are estimated in Canadian Dollars (CAD) per month and include utility baseline estimates.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 pt-2">
                            {[
                                {
                                    type: "Shared Student Apartment",
                                    price: "$550 â€“ $850",
                                    period: "per month",
                                    features: ["Private bedroom in 3-4 bed suite", "Shared kitchen & bathroom", "Utilities & High-Speed Wi-Fi included", "Flexible 8-month academic leases"]
                                },
                                {
                                    type: "On-Campus Residence Suite",
                                    price: "$900 â€“ $1,250",
                                    period: "per month",
                                    features: ["Fully furnished private room", "24/7 security & residence advisor", "Campus dining hall pass optional", "Steps to academic buildings"]
                                },
                                {
                                    type: "Private Studio / 1-Bed Apartment",
                                    price: "$1,200 â€“ $1,600",
                                    period: "per month",
                                    features: ["100% private living space", "In-suite kitchen & laundry", "Located in prime Ottawa downtown", "Ideal for senior or graduate students"]
                                }
                            ].map((plan, i) => (
                                <div key={i} className="space-y-2">
                                    <h3 className="font-bold text-black text-base">{plan.type}</h3>
                                    <div>
                                        <span className="text-2xl md:text-3xl font-black text-black">{plan.price}</span>
                                        <span className="text-xs text-neutral-500 block font-medium">{plan.period}</span>
                                    </div>
                                    <ul className="space-y-1.5 text-xs text-neutral-700 font-medium pt-1">
                                        {plan.features.map((f, j) => (
                                            <li key={j} className="flex items-center gap-2">
                                                <CheckCircle size={14} weight="fill" className="text-[#0a151a] shrink-0" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="pt-1">
                                        <Link
                                            href="/portal/account/login"
                                            className="font-bold underline text-xs uppercase tracking-widest text-[#0a151a]"
                                        >
                                            Apply via Housing Portal â†’
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                        <p className="text-xs text-neutral-500 font-medium mb-3">Residential Tenancies Act (RTA) â€” Province of Ontario</p>
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
                                <Link href="/student-guide/housing-for-students" className="font-bold text-black hover:text-[#c89211] transition-colors text-sm block mb-1">Housing Guide for Students â†’</Link>
                                <p className="text-xs text-neutral-600 leading-relaxed font-medium">Detailed rental market breakdowns, neighbourhood guides, and landlord checklists.</p>
                            </div>
                            <div>
                                <Link href="/student-guide/arrival" className="font-bold text-black hover:text-[#c89211] transition-colors text-sm block mb-1">Ottawa Arrival Guide â†’</Link>
                                <p className="text-xs text-neutral-600 leading-relaxed font-medium">Airport pickup, SIM cards, opening Canadian bank accounts, and settling into Ottawa.</p>
                            </div>
                            <div>
                                <Link href="/student-guide/international" className="font-bold text-black hover:text-[#c89211] transition-colors text-sm block mb-1">International Student Guide â†’</Link>
                                <p className="text-xs text-neutral-600 leading-relaxed font-medium">Study permits, visa compliance, health insurance (UHIP), and orientation programs.</p>
                            </div>
                        </div>
                    </section>

                </div>
            </GuideSidebarLayout>
        </div>
    );
}
