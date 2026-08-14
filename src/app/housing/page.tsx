import { Metadata } from 'next';
import { Link } from "@aalto-dx/react-components";
import { Hero } from '@/components/layout/Hero';
import { Card } from '@/components/ui/Card';
import { ContentBox } from '@/components/ui/ContentBox';
import { Highlight } from '@/components/ui/Highlight';
import { ArrowRight, House, ShieldCheck, Scales, Buildings, UsersThree, CurrencyDollar, CheckCircle } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
    title: 'Student Housing & Residences — Cannoga College Ottawa',
    description: 'Discover on-campus residences, homestay programs, and verified off-campus rentals in Ottawa. Complete guide to student accommodations at Cannoga College.',
    alternates: {
        canonical: 'https://cannogacollege.ca/housing/',
    },
};

export default function HousingPage() {
    return (
        <div className="min-h-screen bg-white text-black font-sans pb-24">
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
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Student Life', href: '/student-life' },
                    { label: 'Housing & Accommodations' }
                ]}
            />

            <div className="container mx-auto px-4 max-w-6xl py-12 md:py-20 space-y-20">

                {/* OVERVIEW & HIGHLIGHT STATS */}
                <section>
                    <div className="max-w-3xl mb-12">
                        <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#c89211] font-bold block mb-2">Campus Community</span>
                        <h2 className="text-3xl md:text-5xl font-black text-black tracking-tight leading-tight">
                            Safe, Modern &amp; Connected Student Living
                        </h2>
                        <p className="mt-4 text-lg text-neutral-600 leading-relaxed font-medium">
                            Whether you prefer living directly on campus, sharing an apartment in downtown Ottawa, or living with a Canadian homestay family, Cannoga Housing Services supports you every step of the way.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { number: "100%", label: "First-Year Guarantee Option", desc: "Priority residence spots for new international & domestic students." },
                            { number: "15 min", label: "Transit to Downtown", desc: "Convenient OC Transpo light rail & bus access from all partner housing." },
                            { number: "$550+", label: "Monthly Starting Rent", desc: "Flexible budget options for shared, single, and homestay rooms." },
                            { number: "24/7", label: "Campus Security & Support", desc: "On-site residence advisors and round-the-clock emergency assistance." },
                        ].map((stat, i) => (
                            <div key={i} className="bg-[#f8f9fa] border-l-4 border-[#0a151a] p-6 space-y-2">
                                <span className="text-3xl font-black text-[#0a151a]">{stat.number}</span>
                                <h3 className="font-bold text-black text-base">{stat.label}</h3>
                                <p className="text-xs text-neutral-600 leading-relaxed">{stat.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* HOUSING OPTIONS */}
                <section className="space-y-10">
                    <div className="border-b border-neutral-200 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#c89211] font-bold block mb-1">Accommodation Types</span>
                            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight">Explore Housing Options</h2>
                        </div>
                        <p className="text-sm text-neutral-500 max-w-md">Find the living environment that matches your study lifestyle and budget.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card
                            title="On-Campus Residence"
                            body="Furnished private bedrooms with shared modern kitchens, high-speed Wi-Fi, study lounges, and social common rooms. Located steps from lecture halls and student services."
                            cta={{
                                label: "View Residence Suites",
                                linkComponentProps: { href: "#on-campus" }
                            }}
                        />
                        <Card
                            title="Canadian Homestay Program"
                            body="Immerse yourself in Canadian culture by living with a welcoming local Ottawa family. Includes a private furnished bedroom, utility bills, and home-cooked meal plans."
                            cta={{
                                label: "Explore Homestay",
                                linkComponentProps: { href: "#homestay" }
                            }}
                        />
                        <Card
                            title="Off-Campus Private Rentals"
                            body="Prefer independent living? Discover trusted rental partners and verified apartment listings in Sandy Hill, Centretown, Byward Market, and Glebe."
                            cta={{
                                label: "Search Private Rentals",
                                linkComponentProps: { href: "#off-campus" }
                            }}
                        />
                    </div>
                </section>

                {/* FEATURED HIGHLIGHT QUOTE */}
                <Highlight
                    body="Finding housing through Cannoga's residence portal was smooth and worry-free. Having a fully furnished apartment right next to my classes allowed me to focus 100% on my studies and meet friends from day one."
                    source="Anav Mukesh, MSc Student"
                    alignment="left"
                />

                {/* PRICING & COMPARISON */}
                <section className="bg-[#0a151a] text-white p-8 md:p-14 rounded-3xl space-y-8">
                    <div className="max-w-2xl">
                        <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#c89211] font-bold block mb-2">Cost &amp; Budgeting</span>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Average Monthly Housing Costs in Ottawa</h2>
                        <p className="text-neutral-300 text-sm leading-relaxed mt-2">
                            All prices are estimated in Canadian Dollars (CAD) per month and include utility baseline estimates.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 pt-4">
                        {[
                            {
                                type: "Shared Student Apartment",
                                price: "$550 – $850",
                                period: "per month",
                                features: ["Private bedroom in 3-4 bed suite", "Shared kitchen & bathroom", "Utilities & High-Speed Wi-Fi included", "Flexible 8-month academic leases"]
                            },
                            {
                                type: "On-Campus Residence Suite",
                                price: "$900 – $1,250",
                                period: "per month",
                                features: ["Fully furnished private room", "24/7 security & residence advisor", "Campus dining hall pass optional", "Steps to academic buildings"]
                            },
                            {
                                type: "Private Studio / 1-Bed Apartment",
                                price: "$1,200 – $1,600",
                                period: "per month",
                                features: ["100% private living space", "In-suite kitchen & laundry", "Located in prime Ottawa downtown", "Ideal for senior or graduate students"]
                            }
                        ].map((plan, i) => (
                            <div key={i} className="bg-[#12222a] border border-white/10 p-6 flex flex-col justify-between space-y-6">
                                <div className="space-y-4">
                                    <h3 className="font-bold text-white text-lg">{plan.type}</h3>
                                    <div>
                                        <span className="text-3xl font-black text-white">{plan.price}</span>
                                        <span className="text-xs text-neutral-400 block">{plan.period}</span>
                                    </div>
                                    <ul className="space-y-2 text-xs text-neutral-300 pt-2 border-t border-white/10">
                                        {plan.features.map((f, j) => (
                                            <li key={j} className="flex items-center gap-2">
                                                <CheckCircle size={14} weight="fill" className="text-[#c89211] shrink-0" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Link
                                    href="/portal/account/login"
                                    className="block text-center py-3 bg-white text-[#0a151a] font-bold text-xs uppercase tracking-wider hover:bg-[#c89211] hover:text-white transition-all no-underline"
                                >
                                    Apply via Housing Portal
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                {/* HOW TO APPLY & STEPS */}
                <section id="on-campus" className="scroll-mt-32">
                    <ContentBox
                        size="large"
                        icon="listChecks"
                        title="Step-by-Step Housing Application Process"
                        body={
                            <div className="space-y-8 text-left">
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
                                    <div key={step} className="flex gap-5 items-start">
                                        <div className="w-10 h-10 bg-[#0a151a] text-white flex items-center justify-center font-bold shrink-0 rounded-full">{step}</div>
                                        <div>
                                            <h4 className="font-bold text-black text-lg mb-1">{title}</h4>
                                            <p className="text-sm text-neutral-600 leading-relaxed">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                    />
                </section>

                {/* TENANT RIGHTS & LEGAL ADVICE */}
                <section id="off-campus" className="scroll-mt-32">
                    <div className="bg-[#f8f9fa] border-l-4 border-[#0a151a] p-8 md:p-12 space-y-6">
                        <div className="flex items-center gap-3">
                            <Scales size={32} weight="fill" className="text-[#0a151a]" />
                            <div>
                                <h3 className="text-2xl font-bold text-[#0a151a]">Ontario Tenant Rights & Legal Protections</h3>
                                <p className="text-xs text-neutral-500 font-medium">Residential Tenancies Act (RTA) — Province of Ontario</p>
                            </div>
                        </div>
                        <p className="text-sm text-neutral-700 leading-relaxed">
                            All off-campus student tenants in Ontario are protected under provincial law. Your landlord cannot request illegal key deposits, perform unlawful evictions, or raise rent outside annual government guidelines.
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 pt-2">
                            <div className="space-y-2">
                                <h4 className="font-bold text-[#0a151a] text-sm flex items-center gap-2">
                                    <ShieldCheck size={18} weight="fill" className="text-[#0a151a]" />
                                    Standard Ontario Lease
                                </h4>
                                <p className="text-xs text-neutral-600 leading-relaxed">
                                    Landlords must use the official Ontario Standard Lease template.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold text-[#0a151a] text-sm flex items-center gap-2">
                                    <ShieldCheck size={18} weight="fill" className="text-[#0a151a]" />
                                    First &amp; Last Month Limit
                                </h4>
                                <p className="text-xs text-neutral-600 leading-relaxed">
                                    Security deposits exceeding first and last month rent are illegal in Ontario.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold text-[#0a151a] text-sm flex items-center gap-2">
                                    <ShieldCheck size={18} weight="fill" className="text-[#0a151a]" />
                                    LTB Dispute Resolution
                                </h4>
                                <p className="text-xs text-neutral-600 leading-relaxed">
                                    Disputes are resolved fairly by the Ontario Landlord and Tenant Board.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* RELATED INTERNAL GUIDES */}
                <section className="pt-8 border-t border-neutral-200">
                    <h3 className="text-xl font-bold text-black mb-6">Related Student Guides</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <Link href="/student-guide/housing-for-students" className="bg-neutral-50 p-6 border border-neutral-200 hover:border-black transition-all group no-underline">
                            <h4 className="font-bold text-black group-hover:text-[#c89211] transition-colors mb-2">Housing Guide for Students →</h4>
                            <p className="text-xs text-neutral-600 leading-relaxed">Detailed rental market breakdowns, neighbourhood guides, and landlord checklists.</p>
                        </Link>
                        <Link href="/student-guide/arrival" className="bg-neutral-50 p-6 border border-neutral-200 hover:border-black transition-all group no-underline">
                            <h4 className="font-bold text-black group-hover:text-[#c89211] transition-colors mb-2">Ottawa Arrival Guide →</h4>
                            <p className="text-xs text-neutral-600 leading-relaxed">Airport pickup, SIM cards, opening Canadian bank accounts, and settling into Ottawa.</p>
                        </Link>
                        <Link href="/student-guide/international" className="bg-neutral-50 p-6 border border-neutral-200 hover:border-black transition-all group no-underline">
                            <h4 className="font-bold text-black group-hover:text-[#c89211] transition-colors mb-2">International Student Guide →</h4>
                            <p className="text-xs text-neutral-600 leading-relaxed">Study permits, visa compliance, health insurance (UHIP), and orientation programs.</p>
                        </Link>
                    </div>
                </section>

            </div>
        </div>
    );
}
