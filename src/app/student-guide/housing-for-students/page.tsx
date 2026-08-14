import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@aalto-dx/react-components";
import { Hero } from '@/components/layout/Hero';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import { Highlight } from '@/components/ui/Highlight';

export const metadata = {
    title: 'Student Accommodations & Off-Campus Rentals — Cannoga College',
    description: 'Explore student housing options in Ottawa. Learn about university partners, average rental costs, and local neighborhoods.',
    alternates: {
        canonical: 'https://cannogacollege.ca/student-guide/housing-for-students/',
    },
};

const sections = [
    { id: 'overview', title: 'Housing Overview', content: '' },
    { id: 'providers', title: 'Housing Providers', content: '' },
    { id: 'applying', title: 'How to Apply', content: '' },
    { id: 'private-market', title: 'Private Market', content: '' },
    { id: 'tenant-rights', title: 'Tenant Rights', content: '' },
    { id: 'settling-in', title: 'Settling In', content: '' },
];

export default function HousingGuidePage() {
    return (
        <GuideSidebarLayout sections={sections}>
            <div className="min-h-screen bg-white text-black font-sans pb-12">
                <Hero
                    title="Housing for Students"
                    body="Finding a comfortable place to live is essential for your academic success. This guide covers student housing options and the Ottawa rental market."
                    backgroundColor="#0a151a"
                    tinted
                    lightText={true}
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Student Guide', href: '/student-guide' },
                        { label: 'Housing' }
                    ]}
                    image={{
                        src: "/images/student-housing-hero.png",
                        alt: "Student Housing in Ottawa"
                    }}
                />

                <div className="cc-container py-8 md:py-12">
                    <div className="space-y-10">

                        {/* Overview */}
                        <section id="overview" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-3 text-black tracking-tight">Your New Home in Ottawa</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4 max-w-3xl text-sm md:text-base font-medium">
                                Ottawa&apos;s student housing market is competitive — especially for September intake. We strongly recommend starting your search as soon as you receive your <Link href="/admissions/requirements" className="text-[#0a151a] underline hover:text-[#c89211] transition-colors">admission offer</Link>. Options range from on-campus residences and student-specific buildings to private rentals. Review our <Link href="/student-guide/arrival" className="text-[#0a151a] underline hover:text-[#c89211] transition-colors">Arrival Guide</Link>, learn about <Link href="/international" className="text-[#0a151a] underline hover:text-[#c89211] transition-colors">international student support</Link>, or check <Link href="/admissions/tuition" className="text-[#0a151a] underline hover:text-[#c89211] transition-colors">tuition & fees</Link>.
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-bold text-base text-black mb-1">Shared Apartments</h3>
                                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium">A cost-effective option where you have your own private bedroom but share the kitchen and common areas with 2–4 other students. Typical rent: $400–$600/month.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-black mb-1">Studio & Bachelor Apartments</h3>
                                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium">A self-contained private apartment with your own kitchen and bathroom. Highly popular — expect a competitive rental market. Typical rent: $800–$1,200/month.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-black mb-1">On-Campus Residence</h3>
                                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium">Limited spots available through Cannoga Housing and Ottawa-area student residence providers. Priority given to first-year and international students. Apply early via the housing portal.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-black mb-1">Homestay</h3>
                                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium">Live with a local Ottawa family for a cultural immersion experience. Includes a private bedroom and often meals. Great for improving English and adjusting to Canadian life. Typical cost: $800–$1,200/month including meals.</p>
                                </div>
                            </div>
                        </section>

                        <Highlight
                            body="Moving to Ottawa was a big step, but the college's housing guide made it so much easier. I found a great shared apartment in Centretown within two weeks of my acceptance."
                            source="Anav Mukesh, MSc Student"
                            alignment="left"
                        />

                        {/* Providers */}
                        <section id="providers" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-3 text-black tracking-tight">Ottawa Student Housing Providers</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                   <h4 className="font-bold text-black text-base">Cannoga Housing</h4>
                                   <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium">Cannoga College&apos;s official student housing partner, offering on-campus and nearby residences with furnished rooms and shared facilities.</p>
                                   <Link href="/housing" className="font-bold underline text-xs uppercase tracking-widest hover:text-[#000000] transition-colors block">Cannoga Housing →</Link>
                                </div>
                                <div className="space-y-1">
                                   <h4 className="font-bold text-black text-base">CampusOne</h4>
                                   <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium">A modern student residence provider with properties near Ottawa campuses. Offers private and shared suites, study rooms, and social spaces.</p>
                                   <Link href="https://www.campusone.ca" target="_blank" className="font-bold underline text-xs uppercase tracking-widest hover:text-[#000000] transition-colors block">campusone.ca →</Link>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-black text-base">Minto</h4>
                                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium">A major Canadian rental housing provider with apartments across Ottawa. Look for Minto properties in Sandy Hill, Centretown, and other central neighbourhoods.</p>
                                    <Link href="https://www.minto.com" target="_blank" className="font-bold underline text-xs uppercase tracking-widest hover:text-[#000000] transition-colors block">minto.com →</Link>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-black text-base">Homestay</h4>
                                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium">Live with a local Ottawa family for a cultural immersion experience. Includes a private bedroom and often meals. Great for improving English and adjusting to Canadian life.</p>
                                    <Link href="/housing#homestay" className="font-bold underline text-xs uppercase tracking-widest hover:text-[#000000] transition-colors block">Cannoga Homestay →</Link>
                                </div>
                            </div>
                        </section>

                        {/* How to Apply */}
                        <section id="applying" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-3 text-black tracking-tight">How to Secure Housing</h2>
                            <div className="space-y-3 text-left">
                                {[
                                    {
                                        step: 1,
                                        title: "Accept Your Study Offer",
                                        desc: "Begin your housing search immediately after receiving your admission offer. The Ottawa housing market is competitive, especially for autumn intake."
                                    },
                                    {
                                        step: 2,
                                        title: "Choose Your Area",
                                        desc: "Popular student neighbourhoods include Sandy Hill, Centretown, Byward Market, and Glebe. All are well-connected by Ottawa's public transport (OC Transpo)."
                                    },
                                    {
                                        step: 3,
                                        title: "Submit Your Application",
                                        desc: "Apply through housing providers' websites (e.g., Cannoga Housing, CampusOne, Minto) or rental platforms like Rentals.ca and Kijiji. For homestay, contact an accredited homestay provider directly. Prepare proof of enrollment, personal details, and be ready to pay a deposit (usually one month's rent)."
                                    },
                                    {
                                        step: 4,
                                        title: "Sign Your Lease",
                                        desc: "Review the rental agreement carefully. Ontario's Residential Tenancies Act protects tenants. The deposit is typically one month's rent."
                                    },
                                    {
                                        step: 5,
                                        title: "Consider Homestay",
                                        desc: "If you prefer a family environment, apply through an accredited homestay provider. Homestay includes a private bedroom and often meals, making it easier to adjust to Canadian life and improve your English."
                                    },
                                ].map(({ step, title, desc }) => (
                                    <div key={step} className="flex gap-3 items-start">
                                        <div className="w-7 h-7 bg-[#0a151a] text-white flex items-center justify-center font-bold text-xs shrink-0 rounded-full">{step}</div>
                                        <div>
                                            <h4 className="font-bold text-black mb-0.5 text-sm md:text-base">{title}</h4>
                                            <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Private Market */}
                        <section id="private-market" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-3 text-black tracking-tight">Private Rental Market</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4 max-w-3xl text-sm font-medium">
                                The Ottawa private market offers many listings. Use these trusted Canadian platforms to search for rentals. Always visit (or arrange a video tour) before paying any deposit.
                            </p>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <h3 className="font-bold text-base mb-1 text-black">Rentals.ca</h3>
                                    <p className="text-xs md:text-sm text-neutral-600 font-medium leading-relaxed mb-2">Canada&apos;s most popular rental listing site with extensive Ottawa coverage. Filter by district, price, and size.</p>
                                    <Link href="https://rentals.ca" target="_blank" className="font-bold underline text-xs uppercase tracking-widest text-[#0a151a]">Search on Rentals.ca →</Link>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base mb-1 text-black">Kijiji</h3>
                                    <p className="text-xs md:text-sm text-neutral-600 font-medium leading-relaxed mb-2">A major Canadian classifieds site for rental apartments and shared housing in Ottawa.</p>
                                    <Link href="https://www.kijiji.ca" target="_blank" className="font-bold underline text-xs uppercase tracking-widest text-[#0a151a]">Browse on Kijiji →</Link>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base mb-1 text-black">PadMapper</h3>
                                    <p className="text-xs md:text-sm text-neutral-600 font-medium leading-relaxed mb-2">Popular Canadian map-based rental search for apartments, rooms, and shared housing in Ottawa.</p>
                                    <Link href="https://www.padmapper.com" target="_blank" className="font-bold underline text-xs uppercase tracking-widest text-[#0a151a]">Search on PadMapper →</Link>
                                </div>
                            </div>
                        </section>

                        {/* Tenant Rights */}
                        <section id="tenant-rights" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-3 text-black tracking-tight">Tenant Rights in Ontario & Canada</h2>
                            <div className="space-y-4">
                                <h3 className="text-base md:text-lg font-bold text-[#0a151a]">Residential Tenancies Act (RTA) Protections</h3>
                                <p className="text-xs md:text-sm text-neutral-700 leading-relaxed font-medium">
                                    Rental housing in Ontario is strictly governed by the <strong>Residential Tenancies Act (RTA)</strong> and enforced by the <strong>Landlord and Tenant Board (LTB)</strong>. As a student tenant, you have key legal protections:
                                </p>
                                <div className="grid md:grid-cols-2 gap-4 pt-1">
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-[#0a151a] text-sm">
                                            Standard Ontario Lease Form
                                        </h4>
                                        <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                                            Landlords must use the official Ontario Standard Lease agreement. Any clauses contradicting the RTA are void.
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-[#0a151a] text-sm">
                                            Deposits & Rent Guidelines
                                        </h4>
                                        <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                                            Landlords may only collect first and last month&apos;s rent deposit. Security, damage, or key deposits exceeding key replacement costs are illegal.
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-[#0a151a] text-sm">
                                            Rent Increase Caps & Notice
                                        </h4>
                                        <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                                            Rent can only be increased once every 12 months, subject to annual provincial guidelines, with at least 90 days written notice.
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-[#0a151a] text-sm">
                                            Protection Against Arbitrary Eviction
                                        </h4>
                                        <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                                            A landlord cannot evict you without an official order from the Landlord and Tenant Board (LTB).
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                                    <span className="text-xs text-neutral-500 font-medium">Need legal housing assistance or advice?</span>
                                    <Link href="https://tribunalsontario.ca/ltb/" target="_blank" className="font-bold underline text-xs uppercase tracking-widest text-[#0a151a] inline-flex items-center gap-1">
                                        Landlord and Tenant Board (LTB) <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </section>

                        {/* Settling In */}
                        <section id="settling-in" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-3 text-black tracking-tight">Settling Into Ottawa Life</h2>
                            <div className="space-y-3">
                                <p className="text-xs md:text-sm text-neutral-700 leading-relaxed font-medium">
                                    Ottawa is a welcoming, walkable city with four distinct seasons. Winters are cold (bring warm layers!) but beautiful, and summers are warm and festival-filled. Most apartment buildings include in-suite or shared laundry, and many are pet-friendly.
                                </p>
                                <ul className="space-y-1.5 text-xs md:text-sm text-neutral-700 font-medium">
                                    {[
                                        "Ottawa's Byward Market has fresh food, cafes, and local crafts",
                                        "Loblaws, Metro, and Sobeys are popular for affordable grocery shopping",
                                        "The OC Transpo bus and light rail network connect all major neighbourhoods",
                                        "Most landlords accept online bank transfers — Canadian banks like RBC, TD, and Scotiabank are common",
                                    ].map((tip, i) => (
                                       <li key={i} className="flex gap-2 items-start">
                                           <ArrowRight size={14} className="mt-1 shrink-0 text-[#0a151a]" />
                                           <span>{tip}</span>
                                       </li>
                                   ))}
                                </ul>
                                <div className="pt-2">
                                    <Link
                                        href="/student-guide/arrival"
                                        className="inline-flex items-center gap-2 text-[#0a151a] font-bold text-xs uppercase tracking-widest underline hover:text-[#c89211] transition-colors"
                                    >
                                        Read the Full Arrival Guide <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </GuideSidebarLayout>
    );
}

