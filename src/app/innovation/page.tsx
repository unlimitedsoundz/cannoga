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
    title: 'Center for Innovation & Entrepreneurial Support — Cannoga College',
    description: 'Discover student incubators, start-up mentoring programs, venture acceleration, and commercialization research at the Cannoga Innovation Hub in Ottawa.',
    alternates: {
        canonical: 'https://cannogacollege.ca/innovation/',
    },
};

export default function InnovationPage() {
    const INCUBATOR_PILLARS = [
        {
            title: "Student Startup Incubator",
            icon: Rocket,
            period: "12-Week Acceleration Program",
            description: "An intensive cohort-based incubator providing seed funding, dedicated desk space, technical prototyping facilities, and direct executive mentorship for student and alumni founders.",
            features: [
                "Up to $15,000 non-dilutive seed grants per team",
                "1-on-1 mentorship with Ottawa tech executives",
                "24/7 access to Makerspace & Hardware Prototyping Lab",
                "Legal & intellectual property advisory support"
            ],
            link: "/admissions"
        },
        {
            title: "Technology Transfer & Commercialization",
            icon: Lightbulb,
            period: "IP & Licensing Services",
            description: "Bridging the gap between academic research and commercial markets. We guide faculty, student researchers, and industry partners through patenting, licensing, and venture spin-offs.",
            features: [
                "Patent landscape analysis & filing assistance",
                "Industry licensing & technology matching",
                "Corporate venture partnership development",
                "Commercial feasibility & market validation testing"
            ],
            link: "/research"
        },
        {
            title: "Applied CleanTech & AI Labs",
            icon: Lightning,
            period: "Specialized R&D Infrastructure",
            description: "State-of-the-art testing facilities dedicated to green building materials, renewable microgrid simulation, applied artificial intelligence, and sustainable industrial solutions.",
            features: [
                "Advanced AI compute clusters & dataset access",
                "Environmental lifecycle assessment tools",
                "Clean energy microgrid testing bed",
                "Collaborative industry-sponsored pilot projects"
            ],
            link: "/degree-programmes"
        }
    ];

    const SUCCESS_STORIES = [
        {
            name: "EcoFibre Materials",
            founders: "Dr. Mitchell S. & Sarah K. (Alumna '23)",
            sector: "CleanTech & Sustainable Materials",
            desc: "Engineered structural bio-composites from Ontario forestry residue, reducing industrial construction carbon intensity by 38%.",
            milestone: "$2.5M Seed Funding Raised",
            status: "Scaling Production in Eastern Ontario"
        },
        {
            name: "WattShare Energy",
            founders: "Alex Chen & Marcus Vance",
            sector: "Smart Grid Software",
            desc: "Developed peer-to-peer microgrid energy trading algorithms for municipal housing projects and commercial office complexes.",
            milestone: "$1.2M Pre-Seed & Pilot Deployment",
            status: "Active in 14 Ottawa Commercial Properties"
        },
        {
            name: "UrbanHarvest Robotics",
            founders: "Elena Bouchard (Faculty Founder)",
            sector: "AgriTech & Automation",
            desc: "Created automated indoor climate control and hydroponic harvesting robotics for northern urban micro-farming installations.",
            milestone: "Commercial Acquisition in 2025",
            status: "Integrated into Regional Supply Chain"
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
                    src: "/images/studies-hero.jpg",
                    alt: "Cannoga Innovation Hub"
                }}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Innovation Hub' }
                ]}
            >
                <div className="flex flex-wrap gap-4">
                    <Link
                        href="#incubator-programs"
                        className="inline-flex items-center gap-2 bg-white hover:bg-neutral-100 text-black font-bold text-xs uppercase tracking-widest px-8 py-4 no-underline shadow-md transition-colors"
                    >
                        <span>Explore Incubator Programs</span>
                        <ArrowRight size={16} weight="bold" />
                    </Link>
                    <Link
                        href="/research"
                        className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-black font-bold text-xs uppercase tracking-widest px-8 py-4 no-underline shadow-md transition-colors"
                    >
                        <span>Tech Transfer Office</span>
                        <ArrowRight size={16} weight="bold" />
                    </Link>
                </div>
            </Hero>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 max-w-6xl space-y-12">
                {/* Introduction & Overview */}
                <section className="space-y-2">
                    <h2 className="text-aalto-5 font-bold text-black tracking-tight">Ottawa Technology Ecosystem</h2>
                    <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
                        The Cannoga Innovation Hub connects ambitious student entrepreneurs, faculty researchers, and industry partners across the National Capital Region. Through non-dilutive seed funding, prototyping labs, and direct connections to Ottawa’s technology investment sector, we accelerate early-stage ventures from initial concept to commercial viability.
                    </p>
                </section>

                {/* Core Programs & Support Services */}
                <section id="incubator-programs" className="space-y-6">
                    <h2 className="text-aalto-5 font-bold text-black tracking-tight">Core Programs &amp; Support Services</h2>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        {INCUBATOR_PILLARS.map((pillar, idx) => {
                            const IconComp = pillar.icon;
                            return (
                                <div key={idx} className="py-2 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <IconComp size={20} weight="bold" className="text-black" />
                                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">{pillar.period}</span>
                                        </div>
                                        <h3 className="font-bold text-lg text-black mb-1">{pillar.title}</h3>
                                        <p className="text-sm text-neutral-700 leading-relaxed font-medium mb-3">{pillar.description}</p>
                                        
                                        <ul className="space-y-1.5 text-xs text-neutral-700 font-medium">
                                            {pillar.features.map((feat, fIdx) => (
                                                <li key={fIdx} className="flex gap-2 items-start">
                                                    <ArrowRight size={14} className="mt-0.5 shrink-0 text-[#0a151a]" />
                                                    <span>{feat}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="pt-4">
                                        <Link 
                                            href={pillar.link} 
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-black hover:underline"
                                        >
                                            <span>Learn More</span>
                                            <ArrowRight size={14} weight="bold" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Venture Portfolio & Spin-Offs */}
                <section className="space-y-6">
                    <div>
                        <h2 className="text-aalto-5 font-bold text-black tracking-tight">Venture Portfolio &amp; Spin-Offs</h2>
                        <p className="text-sm text-neutral-600 font-medium mt-1">Select early-stage ventures launched through Cannoga Innovation Hub acceleration cohorts.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {SUCCESS_STORIES.map((story, idx) => (
                            <div key={idx} className="py-2 space-y-2">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                                        {story.sector}
                                    </span>
                                    <h3 className="font-bold text-lg text-black">{story.name}</h3>
                                    <p className="text-xs text-neutral-500 font-semibold mb-2">Founders: {story.founders}</p>
                                    <p className="text-sm text-neutral-700 leading-relaxed font-medium">{story.desc}</p>
                                </div>
                                <div className="pt-2">
                                    <div className="text-xs font-bold text-black flex items-center gap-1.5">
                                        <TrendUp size={14} weight="bold" />
                                        <span>{story.milestone}</span>
                                    </div>
                                    <p className="text-xs text-neutral-500 font-medium">{story.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact & Application Callout */}
                <section className="pt-6 border-t border-neutral-200">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="max-w-2xl space-y-1">
                            <h2 className="text-lg font-bold text-black">Ready to Launch Your Venture?</h2>
                            <p className="text-sm text-neutral-700 font-medium leading-relaxed">
                                Applications for the upcoming Spring Incubator Cohort are now open to all registered Cannoga students, faculty researchers, and recent graduates.
                            </p>
                        </div>
                        <div className="shrink-0">
                            <Link
                                href="/admissions"
                                className="inline-flex items-center gap-2 bg-[#0f2027] hover:bg-black text-white font-bold text-xs uppercase tracking-widest px-6 py-3 no-underline transition-colors"
                            >
                                <span>Apply for Incubator</span>
                                <ArrowRight size={14} weight="bold" />
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
