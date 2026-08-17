import Image from 'next/image';
import { Link } from '@/components/ui/Link';
import { ArrowRight, ArrowUpRight, Globe, Users, GraduationCap, Briefcase, CalendarCheck, BookOpen, Medal, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { Hero } from '@/components/layout/Hero';

export const metadata = {
    title: 'Global Alumni Network & Community',
    description: 'Connect with over 18,000+ Cannoga College graduates worldwide. Access career services, research databases, mentorship programs, and regional alumni chapters.',
    alternates: {
        canonical: 'https://cannogacollege.ca/alumni/',
    },
};

export default function AlumniPage() {
    const alumniStats = [
        { label: "Global Graduates", value: "18,500+" },
        { label: "Countries Represented", value: "94" },
        { label: "Active Regional Chapters", value: "12" },
        { label: "Mentorship Matches", value: "1,200/yr" }
    ];

    const benefits = [
        {
            id: "library-access",
            title: "LIFELONG LIBRARY ACCESS",
            desc: "Continued access to Cannoga's digital library, peer-reviewed journals, and research databases worldwide.",
            href: "/research",
            bgColor: "bg-[#6366f1]", // Electric Indigo
            borderColor: "border-[#6366f1]",
        },
        {
            id: "chapter-networking",
            title: "GLOBAL CHAPTER NETWORKING",
            desc: "Invitations to regional alumni gatherings, annual summits, and professional forums in Ottawa, Toronto, London, and beyond.",
            href: "#chapters",
            bgColor: "bg-[#ec4899]", // Vibrant Hot Pink
            borderColor: "border-[#ec4899]",
        },
        {
            id: "career-coaching",
            title: "CAREER & EXECUTIVE COACHING",
            desc: "One-on-one career advising, resume reviews, and access to Cannoga's exclusive alumni job board.",
            href: "/careers",
            bgColor: "bg-[#10b981]", // Electric Emerald
            borderColor: "border-[#10b981]",
        },
        {
            id: "mentorship-program",
            title: "STUDENT MENTORSHIP PROGRAM",
            desc: "Give back by guiding current undergraduate and graduate students as a verified Cannoga Peer Mentor.",
            href: "/student-guide",
            bgColor: "bg-[#f97316]", // Vibrant Orange
            borderColor: "border-[#f97316]",
        },
        {
            id: "continuing-education",
            title: "CONTINUING EDUCATION DISCOUNT",
            desc: "20% tuition discount on executive certificates, professional micro-credentials, and lifelong learning workshops.",
            href: "/studies",
            bgColor: "bg-[#06b6d4]", // Electric Cyan
            borderColor: "border-[#06b6d4]",
        },
        {
            id: "news-digest",
            title: "ALUMNI NEWS & IMPACT DIGEST",
            desc: "Quarterly publication highlighting research breakthroughs, graduate achievements, and institutional updates.",
            href: "/news",
            bgColor: "bg-[#8b5cf6]", // Deep Purple
            borderColor: "border-[#8b5cf6]",
        }
    ];

    const chapters = [
        { city: "Ottawa (Main Chapter)", contact: "ottawa.alumni@cannogacollege.ca", members: "6,400+ Alumni" },
        { city: "Toronto & GTA", contact: "toronto.alumni@cannogacollege.ca", members: "3,800+ Alumni" },
        { city: "Vancouver & West Coast", contact: "vancouver.alumni@cannogacollege.ca", members: "2,100+ Alumni" },
        { city: "International & Europe", contact: "global.alumni@cannogacollege.ca", members: "4,200+ Alumni" }
    ];

    return (
        <div className="min-h-screen bg-white text-black antialiased font-sans pb-24">
            
            {/* HERO SECTION MATCHING HOME DESIGN */}
            <Hero
                title="Cannoga Alumni Network"
                body="Empowering a global network of over 18,000+ professionals committed to sustainable impact, leadership, and technological innovation. Graduation is just the beginning."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                overlay={true}
                overlayOpacity="opacity-50"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Community', href: '/about' },
                    { label: 'Alumni' }
                ]}
                image={{
                    src: "/images/alumni-hero.png",
                    alt: "Cannoga Alumni Network"
                }}
            >
                <div className="flex flex-wrap gap-4">
                    <Link
                        href="/portal/login"
                        className="inline-flex items-center gap-2 bg-white hover:bg-slate-200 text-[#0a151a] font-extrabold text-xs uppercase tracking-wider px-6 py-4 transition-colors no-underline rounded-sm shadow-md"
                    >
                        <span>Access Alumni Portal</span>
                        <ArrowRight size={16} weight="bold" />
                    </Link>
                    <Link
                        href="#benefits"
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider px-6 py-4 transition-colors no-underline rounded-sm border border-white/30"
                    >
                        <span>Explore Privileges</span>
                    </Link>
                </div>
            </Hero>

            {/* KEY STATS BAR */}
            <section className="bg-[#0f2027] text-white py-12 border-b border-slate-800">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {alumniStats.map((stat, idx) => (
                            <div key={idx} className="flex flex-col items-center space-y-2">
                                <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-none">{stat.value}</div>
                                <div className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-white !text-white">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="container mx-auto max-w-5xl px-4 py-16 space-y-16 text-base md:text-lg font-normal text-slate-700 leading-relaxed">

                {/* OVERVIEW SECTION */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-black text-black tracking-tight">Lifelong Connection &amp; Impact</h2>
                    <p className="text-slate-700 text-base md:text-lg font-normal leading-relaxed">
                        Cannoga College Master&apos;s and Undergraduate Alumni represent an active global community leading projects across sustainability, public policy, technology, business, and health sciences. Our alumni office provides continuous services, event invitations, and career advancement tools to support your lifelong journey.
                    </p>
                </section>

                {/* RESOURCE HUB CARDS FOR ALUMNI SERVICES & BENEFITS */}
                <section id="benefits" className="scroll-mt-32 space-y-8 pt-8 border-t border-slate-200">
                    <div>
                        <h2 className="text-3xl font-black text-black tracking-tight mb-2">Alumni Privileges &amp; Services</h2>
                        <p className="text-slate-700 text-base md:text-lg font-normal leading-relaxed">
                            As a verified Cannoga graduate, you hold lifetime access to institutional resources and career networks.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                        {benefits.map((card) => (
                            <div key={card.id} className="flex flex-col no-underline">
                                <Link
                                    href={card.href}
                                    className={`group block w-full p-6 sm:p-8 rounded-md ${card.bgColor} ${card.borderColor} border-4 no-underline overflow-hidden relative min-h-[250px] sm:min-h-[280px] flex flex-col justify-between transition-transform hover:-translate-y-1 duration-200`}
                                >
                                    {/* Card Content Header */}
                                    <div className="relative z-20">
                                        <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-[1.05]">
                                            {card.title}
                                        </h3>
                                    </div>

                                    {/* Card Bottom Description & Arrow Icon */}
                                    <div className="relative z-20 pt-6 flex items-end justify-between gap-4 text-white">
                                        <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed max-w-[85%] font-sans">
                                            {card.desc}
                                        </p>

                                        <div className="shrink-0 mb-0.5 transform transition-transform group-hover:translate-x-1.5 group-hover:-translate-y-1.5 duration-200">
                                            <ArrowUpRight size={38} weight="bold" className="text-white" />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                {/* REGIONAL CHAPTERS DIRECTORY */}
                <section id="chapters" className="pt-8 border-t border-slate-200 space-y-6">
                    <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">Regional Alumni Chapters</h2>
                    <p className="text-slate-700 text-base md:text-lg font-normal leading-relaxed">
                        Connect with local chapter leaders, participate in regional networking mixers, and attend Cannoga speaker panels in your area.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {chapters.map((chapter, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-5 border border-slate-200 hover:border-black transition-colors rounded-sm">
                                <div className="p-2.5 bg-[#0f2027] text-[#c89211] rounded-full shrink-0 mt-0.5">
                                    <Globe size={20} weight="bold" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-base md:text-lg text-slate-900">{chapter.city}</h3>
                                    <span className="inline-block text-xs font-bold text-[#c89211] uppercase tracking-wider">{chapter.members}</span>
                                    <a href={`mailto:${chapter.contact}`} className="text-[#0f2027] font-bold text-sm underline hover:text-[#c89211] transition-colors block pt-1">
                                        {chapter.contact}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CALL TO ACTION ROW */}
                <section className="pt-8 border-t border-slate-200">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#0f2027] text-white p-8">
                        <div className="space-y-2">
                            <span className="text-[#c89211] font-bold uppercase tracking-wider text-xs block">Official Alumni Portal</span>
                            <h3 className="text-2xl font-black text-white">Update Your Contact Details &amp; Directory Listing</h3>
                            <p className="text-slate-300 text-base font-normal max-w-xl">
                                Access your official transcripts, request alumni identity credentials, or update your current professional title in the Cannoga Alumni Directory.
                            </p>
                        </div>
                        <Link 
                            href="/portal/login" 
                            className="inline-flex items-center gap-2 bg-[#c89211] hover:bg-[#b07f0e] text-[#0f2027] font-extrabold text-xs uppercase tracking-wider px-6 py-4 whitespace-nowrap transition-colors no-underline shrink-0"
                        >
                            <span>Alumni Portal Access</span>
                            <ArrowRight size={14} weight="bold" />
                        </Link>
                    </div>
                </section>

            </div>
        </div>
    );
}
