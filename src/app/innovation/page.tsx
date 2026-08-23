import Link from 'next/link';
import { Hero } from '@/components/layout/Hero';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { 
    ArrowRight,
    ArrowUpRight
} from "@phosphor-icons/react/dist/ssr";

export const metadata = {
    title: 'Center for Innovation & Entrepreneurial Support',
    description: 'Discover student incubators, start-up mentoring programs, venture acceleration, and commercialization research at the Cannoga Innovation Hub in Ottawa.',
    alternates: {
        canonical: 'https://cannogacollege.ca/innovation/',
    },
};

export default function InnovationPage() {
    const INCUBATOR_PILLARS = [
        {
            id: "student-incubator",
            title: "STUDENT STARTUP INCUBATOR",
            desc: "12-week acceleration program providing non-dilutive seed funding, prototyping labs, and 1-on-1 executive mentorship.",
            href: "/admissions",
            bgColor: "bg-[#6366f1]", // Electric Indigo
            borderColor: "border-[#6366f1]",
            waveColor: "#4f46e5",
        },
        {
            id: "tech-transfer",
            title: "TECHNOLOGY TRANSFER & IP",
            desc: "Bridging academic research and commercial markets through patent licensing, corporate spin-offs, and commercialization.",
            href: "/research",
            bgColor: "bg-[#ec4899]", // Vibrant Hot Pink
            borderColor: "border-[#ec4899]",
            waveColor: "#db2777",
        },
        {
            id: "cleantech-labs",
            title: "CLEANTECH & AI R&D LABS",
            desc: "Advanced infrastructure for green building materials, renewable microgrids, and collaborative artificial intelligence pilots.",
            href: "/degree-programmes",
            bgColor: "bg-[#10b981]", // Electric Emerald
            borderColor: "border-[#10b981]",
            waveColor: "#059669",
        }
    ];

    const SUCCESS_STORIES = [
        {
            id: "ecofibre",
            title: "ECOFIBRE MATERIALS",
            desc: "Structural bio-composites from Ontario forestry residue reducing industrial carbon intensity by 38%. $2.5M Seed Raised.",
            href: "/research",
            bgColor: "bg-[#f97316]", // Vibrant Orange
            borderColor: "border-[#f97316]",
            waveColor: "#ea580c",
        },
        {
            id: "wattshare",
            title: "WATTSHARE SMART GRID",
            desc: "Peer-to-peer microgrid energy trading algorithms for municipal housing & commercial properties. $1.2M Pre-Seed & Pilot.",
            href: "/research",
            bgColor: "bg-[#06b6d4]", // Electric Cyan
            borderColor: "border-[#06b6d4]",
            waveColor: "#0891b2",
        },
        {
            id: "urbanharvest",
            title: "URBANHARVEST ROBOTICS",
            desc: "Automated indoor climate control and hydroponic harvesting robotics. Acquired and integrated into regional food supply chain.",
            href: "/research",
            bgColor: "bg-[#8b5cf6]", // Deep Purple
            borderColor: "border-[#8b5cf6]",
            waveColor: "#7c3aed",
        }
    ];

    return (
        <div className="min-h-screen bg-white text-black antialiased font-sans pb-24">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Innovation Hub', item: '/innovation' }
            ]} />

            {/* Custom Animations for Exact Hub Look */}
            <style>{`
                @keyframes waveFloatHub {
                    0%, 100% {
                        transform: translateY(8px) scaleY(1);
                    }
                    50% {
                        transform: translateY(-6px) scaleY(1.1);
                    }
                }
                @keyframes arrowFloatHub {
                    0%, 100% {
                        transform: translate(0, 0);
                    }
                    50% {
                        transform: translate(5px, -5px);
                    }
                }
                .animate-wave-hub {
                    animation: waveFloatHub 3.4s ease-in-out infinite;
                }
                .animate-arrow-hub {
                    animation: arrowFloatHub 2.2s ease-in-out infinite;
                }
            `}</style>

            {/* Hero Component */}
            <Hero
                title="Center for Innovation & Entrepreneurship"
                body="Incubating groundbreaking GreenTech, AI, and sustainable start-ups. From campus research laboratories to global commercial markets."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                overlay={true}
                overlayOpacity="opacity-40"
                image={{
                    src: "https://i.pinimg.com/1200x/3a/fc/2e/3afc2ee1c71a241ef26350edd46622c9.jpg",
                    alt: "Cannoga Center for Innovation & Entrepreneurship"
                }}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Innovation Hub' }
                ]}
            >
                <div className="flex flex-wrap gap-4 pt-2">
                    <Link
                        href="#incubator-programs"
                        className="inline-flex items-center gap-2 bg-white text-[#0a151a] hover:bg-neutral-100 font-bold text-xs uppercase tracking-wider px-8 py-4 transition-colors no-underline rounded-sm shadow-md"
                    >
                        <span>Explore Incubator Programs</span>
                        <ArrowRight size={16} weight="bold" />
                    </Link>
                    <Link
                        href="/research/"
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 transition-colors no-underline rounded-sm border border-white/30 shadow-md"
                    >
                        <span>Tech Transfer Office</span>
                        <ArrowRight size={16} weight="bold" />
                    </Link>
                </div>
            </Hero>

            <div className="container mx-auto max-w-5xl px-4 py-16 space-y-16 text-base md:text-lg font-normal text-slate-700 leading-relaxed">
                {/* Introduction & Overview */}
                <section className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight">Ottawa Technology Ecosystem</h2>
                    <p className="text-slate-700 text-base md:text-lg font-normal leading-relaxed">
                        The Cannoga Innovation Hub connects ambitious student entrepreneurs, faculty researchers, and industry partners across the National Capital Region. Through non-dilutive seed funding, prototyping labs, and direct connections to Ottawa’s technology investment sector, we accelerate early-stage ventures from initial concept to commercial viability.
                    </p>
                </section>

                {/* Core Programs & Support Services */}
                <section id="incubator-programs" className="scroll-mt-32 space-y-8 pt-8 border-t border-slate-200">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight mb-2">Core Programs &amp; Support Services</h2>
                        <p className="text-slate-700 text-base md:text-lg font-normal leading-relaxed">
                            Structured incubation frameworks tailored for students, faculty founders, and regional spin-offs.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                        {INCUBATOR_PILLARS.map((card, idx) => (
                            <div key={card.id} className="flex flex-col no-underline">
                                <Link
                                    href={card.href}
                                    className={`group block w-full p-6 sm:p-8 rounded-md ${card.bgColor} ${card.borderColor} border-4 no-underline overflow-hidden relative min-h-[260px] sm:min-h-[300px] flex flex-col justify-between transition-transform hover:-translate-y-1 duration-200`}
                                >
                                    {/* Card Content Header */}
                                    <div className="relative z-20">
                                        <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-[1.02]">
                                            {card.title}
                                        </h3>
                                    </div>

                                    {/* Animated Wave SVG */}
                                    <div
                                        className="absolute -bottom-10 -right-10 w-48 h-48 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity animate-wave-hub"
                                        style={{ animationDelay: `${idx * 0.5}s` }}
                                    >
                                        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                            <path
                                                d="M39.9,-65.7C51.6,-58.6,61.1,-48.3,67.8,-36.3C74.6,-24.3,78.5,-10.6,77.3,2.8C76.1,16.2,69.8,29.3,61.4,40.6C53,51.8,42.5,61.2,30.3,66.8C18.1,72.4,4.2,74.2,-9.2,72.6C-22.6,71,-35.5,66,-46.8,58.3C-58.1,50.6,-67.8,40.2,-73.4,27.8C-79,15.4,-80.5,1,-77.4,-12.3C-74.3,-25.6,-66.6,-37.8,-56.3,-45.5C-46,-53.2,-33.1,-56.4,-20.7,-63.1C-8.3,-69.8,3.6,-80,15.9,-80.6C28.2,-81.2,40.9,-72.2,39.9,-65.7Z"
                                                fill={card.waveColor}
                                            />
                                        </svg>
                                    </div>

                                    {/* Card Bottom Description & Arrow Icon */}
                                    <div className="relative z-20 pt-6 flex items-end justify-between gap-4 text-white">
                                        <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed max-w-[85%] font-sans">
                                            {card.desc}
                                        </p>

                                        <div
                                            className="shrink-0 mb-0.5 animate-arrow-hub"
                                            style={{ animationDelay: `${idx * 0.4}s` }}
                                        >
                                            <ArrowUpRight size={44} weight="bold" className="text-white" />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Venture Portfolio & Spin-Offs */}
                <section className="space-y-8 pt-8 border-t border-slate-200">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight mb-2">Venture Portfolio &amp; Spin-Offs</h2>
                        <p className="text-slate-700 text-base md:text-lg font-normal leading-relaxed">
                            Select early-stage ventures launched through Cannoga Innovation Hub acceleration cohorts.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                        {SUCCESS_STORIES.map((card, idx) => (
                            <div key={card.id} className="flex flex-col no-underline">
                                <Link
                                    href={card.href}
                                    className={`group block w-full p-6 sm:p-8 rounded-md ${card.bgColor} ${card.borderColor} border-4 no-underline overflow-hidden relative min-h-[260px] sm:min-h-[300px] flex flex-col justify-between transition-transform hover:-translate-y-1 duration-200`}
                                >
                                    {/* Card Content Header */}
                                    <div className="relative z-20">
                                        <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-[1.02]">
                                            {card.title}
                                        </h3>
                                    </div>

                                    {/* Animated Wave SVG */}
                                    <div
                                        className="absolute -bottom-10 -right-10 w-48 h-48 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity animate-wave-hub"
                                        style={{ animationDelay: `${idx * 0.5}s` }}
                                    >
                                        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                            <path
                                                d="M39.9,-65.7C51.6,-58.6,61.1,-48.3,67.8,-36.3C74.6,-24.3,78.5,-10.6,77.3,2.8C76.1,16.2,69.8,29.3,61.4,40.6C53,51.8,42.5,61.2,30.3,66.8C18.1,72.4,4.2,74.2,-9.2,72.6C-22.6,71,-35.5,66,-46.8,58.3C-58.1,50.6,-67.8,40.2,-73.4,27.8C-79,15.4,-80.5,1,-77.4,-12.3C-74.3,-25.6,-66.6,-37.8,-56.3,-45.5C-46,-53.2,-33.1,-56.4,-20.7,-63.1C-8.3,-69.8,3.6,-80,15.9,-80.6C28.2,-81.2,40.9,-72.2,39.9,-65.7Z"
                                                fill={card.waveColor}
                                            />
                                        </svg>
                                    </div>

                                    {/* Card Bottom Description & Arrow Icon */}
                                    <div className="relative z-20 pt-6 flex items-end justify-between gap-4 text-white">
                                        <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed max-w-[85%] font-sans">
                                            {card.desc}
                                        </p>

                                        <div
                                            className="shrink-0 mb-0.5 animate-arrow-hub"
                                            style={{ animationDelay: `${idx * 0.4}s` }}
                                        >
                                            <ArrowUpRight size={44} weight="bold" className="text-white" />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact & Application Callout */}
                <section className="pt-8 border-t border-slate-200">
                    <div className="p-8 bg-[#0a151a] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-sm">
                        <div className="max-w-2xl space-y-2">
                            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Ready to Launch Your Venture?</h2>
                            <p className="text-slate-300 text-base md:text-lg font-normal leading-relaxed">
                                Applications for the upcoming Spring Incubator Cohort are now open to all registered Cannoga students, faculty researchers, and recent graduates.
                            </p>
                        </div>
                        <div className="shrink-0">
                            <Link
                                href="/admissions/"
                                className="inline-flex items-center gap-2 bg-white text-[#0a151a] hover:bg-neutral-100 font-bold text-xs uppercase tracking-widest px-8 py-4 no-underline rounded-sm transition-colors shadow-md"
                            >
                                <span>Apply for Incubator</span>
                                <ArrowRight size={16} weight="bold" />
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
