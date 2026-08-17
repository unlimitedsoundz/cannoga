import Link from 'next/link';
import { Hero } from '@/components/layout/Hero';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { 
    RocketLaunch as Rocket, 
    Lightbulb, 
    Lightning, 
    Handshake, 
    Bank, 
    TrendUp, 
    CheckCircle, 
    ArrowRight 
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
            id: "pillar-1",
            title: "Student Startup Incubator",
            period: "12-Week Acceleration Cohort",
            description: "An intensive cohort-based incubator providing non-dilutive seed funding, dedicated desk space, technical prototyping facilities, and direct executive mentorship for student and alumni founders.",
            features: [
                "Up to $15,000 non-dilutive seed grants per venture",
                "1-on-1 mentorship with Ottawa technology executives",
                "24/7 access to Makerspace & Prototyping Labs",
                "Legal & intellectual property advisory support"
            ],
            link: "/admissions",
            bgColor: "bg-[#f5f8fa]",
            borderColor: "border-[#008080]",
            tag: "ACCELERATION"
        },
        {
            id: "pillar-2",
            title: "Technology Transfer & IP",
            period: "Commercialization & Licensing",
            description: "Bridging academic research and commercial markets. We guide faculty and student researchers through patenting, licensing, corporate validation, and venture spin-offs.",
            features: [
                "Patent landscape analysis & filing support",
                "Industry licensing & technology matchmaking",
                "Corporate venture partnership development",
                "Commercial feasibility & market validation"
            ],
            link: "/research",
            bgColor: "bg-[#fff8f0]",
            borderColor: "border-[#e06d53]",
            tag: "IP & PATENTS"
        },
        {
            id: "pillar-3",
            title: "Applied CleanTech & AI Labs",
            period: "Specialized R&D Infrastructure",
            description: "State-of-the-art testing infrastructure dedicated to green construction materials, renewable microgrids, applied artificial intelligence, and sustainable industrial solutions.",
            features: [
                "Advanced AI compute clusters & dataset access",
                "Environmental lifecycle assessment tools",
                "Clean energy microgrid testing bed",
                "Collaborative industry-sponsored pilot projects"
            ],
            link: "/degree-programmes",
            bgColor: "bg-[#f0fbfb]",
            borderColor: "border-[#006699]",
            tag: "R&D FACILITY"
        }
    ];

    const SUCCESS_STORIES = [
        {
            id: "venture-1",
            name: "EcoFibre Materials",
            founders: "Dr. Mitchell S. & Sarah K. (Alumna '23)",
            sector: "CleanTech & Sustainable Materials",
            desc: "Engineered structural bio-composites from Ontario forestry residue, reducing industrial construction carbon intensity by 38%.",
            milestone: "$2.5M Seed Funding Raised",
            status: "Scaling Production in Eastern Ontario",
            bgColor: "bg-[#e8f4ea]",
            borderColor: "border-[#1b5e20]",
            tag: "CLEANTECH",
            href: "/research"
        },
        {
            id: "venture-2",
            name: "WattShare Energy",
            founders: "Alex Chen & Marcus Vance",
            sector: "Smart Grid Software",
            desc: "Developed peer-to-peer microgrid energy trading algorithms for municipal housing projects and commercial office complexes.",
            milestone: "$1.2M Pre-Seed & Pilot Deployment",
            status: "Active in 14 Ottawa Commercial Properties",
            bgColor: "bg-[#e3f2fd]",
            borderColor: "border-[#0d47a1]",
            tag: "SMART GRID",
            href: "/research"
        },
        {
            id: "venture-3",
            name: "UrbanHarvest Robotics",
            founders: "Elena Bouchard (Faculty Founder)",
            sector: "AgriTech & Automation",
            desc: "Created automated indoor climate control and hydroponic harvesting robotics for northern urban micro-farming installations.",
            milestone: "Commercial Acquisition in 2025",
            status: "Integrated into Regional Supply Chain",
            bgColor: "bg-[#fbe9e7]",
            borderColor: "border-[#bf360c]",
            tag: "AGRITECH",
            href: "/research"
        }
    ];

    return (
        <div className="min-h-screen bg-white text-black antialiased font-sans pb-24">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Innovation Hub', item: '/innovation' }
            ]} />

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
                    src: "/images/alumni-hero.png",
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
                        href="/research"
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                        {INCUBATOR_PILLARS.map((pillar) => (
                            <div key={pillar.id} className="flex flex-col no-underline">
                                <Link
                                    href={pillar.link}
                                    className={`group block w-full p-6 sm:p-8 rounded-md ${pillar.bgColor} ${pillar.borderColor} border-4 no-underline overflow-hidden relative min-h-[340px] flex flex-col justify-between transition-transform hover:-translate-y-1 duration-200 shadow-sm`}
                                >
                                    <div className="relative z-20 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black uppercase tracking-wider text-slate-900 bg-white/80 px-2 py-0.5 border border-slate-200 rounded-xs">
                                                {pillar.tag}
                                            </span>
                                            <div className="text-black transform group-hover:translate-x-1.5 group-hover:-translate-y-1.5 transition-transform duration-200">
                                                <ArrowRight size={20} weight="bold" />
                                            </div>
                                        </div>

                                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                                            {pillar.title}
                                        </h3>
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                            {pillar.period}
                                        </p>
                                        <p className="text-slate-700 text-base md:text-lg font-normal leading-relaxed">
                                            {pillar.description}
                                        </p>
                                        <ul className="space-y-2 pt-2 text-slate-700 text-base md:text-lg font-normal leading-relaxed">
                                            {pillar.features.map((feat, fIdx) => (
                                                <li key={fIdx} className="flex gap-2.5 items-start">
                                                    <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2.5 shrink-0" />
                                                    <span>{feat}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="relative z-20 pt-6 mt-4 border-t border-slate-900/10 flex items-center justify-between">
                                        <span className="text-sm font-bold uppercase tracking-wider text-slate-900 group-hover:underline">
                                            Learn More
                                        </span>
                                        <ArrowRight size={16} weight="bold" className="text-slate-900" />
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                        {SUCCESS_STORIES.map((story) => (
                            <div key={story.id} className="flex flex-col no-underline">
                                <Link
                                    href={story.href}
                                    className={`group block w-full p-6 sm:p-8 rounded-md ${story.bgColor} ${story.borderColor} border-4 no-underline overflow-hidden relative min-h-[340px] flex flex-col justify-between transition-transform hover:-translate-y-1 duration-200 shadow-sm`}
                                >
                                    <div className="relative z-20 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black uppercase tracking-wider text-slate-900 bg-white/80 px-2 py-0.5 border border-slate-200 rounded-xs">
                                                {story.tag}
                                            </span>
                                            <div className="text-black transform group-hover:translate-x-1.5 group-hover:-translate-y-1.5 transition-transform duration-200">
                                                <ArrowRight size={20} weight="bold" />
                                            </div>
                                        </div>

                                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                                            {story.name}
                                        </h3>
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                            Founders: {story.founders}
                                        </p>
                                        <p className="text-slate-700 text-base md:text-lg font-normal leading-relaxed">
                                            {story.desc}
                                        </p>
                                    </div>

                                    <div className="relative z-20 pt-6 mt-4 border-t border-slate-900/10 space-y-1.5">
                                        <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                            <TrendUp size={16} weight="bold" className="text-[#0a151a]" />
                                            <span>{story.milestone}</span>
                                        </div>
                                        <p className="text-xs text-slate-600 font-semibold">{story.status}</p>
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
                                href="/admissions"
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
