import Image from 'next/image';
import { Link } from '@/components/ui/Link';
import { ArrowRight, Globe, Users, GraduationCap, Briefcase, CalendarCheck, BookOpen, Medal, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
    title: 'Global Alumni Network & Community — Cannoga College',
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
            title: "Lifelong Library & Research Access",
            desc: "Continued access to Cannoga's digital library, peer-reviewed journals, and research databases worldwide."
        },
        {
            title: "Global Chapter Networking",
            desc: "Invitations to regional alumni gatherings, annual summits, and professional forums in Ottawa, Toronto, London, and beyond."
        },
        {
            title: "Career & Executive Coaching",
            desc: "One-on-one career advising, resume reviews, and access to Cannoga's exclusive alumni job board."
        },
        {
            title: "Student Mentorship Program",
            desc: "Give back by guiding current undergraduate and graduate students as a verified Cannoga Peer Mentor."
        },
        {
            title: "Continuing Education Discount",
            desc: "20% tuition discount on executive certificates, professional micro-credentials, and lifelong learning workshops."
        },
        {
            title: "Alumni News & Impact Digest",
            desc: "Quarterly publication highlighting research breakthroughs, graduate achievements, and institutional updates."
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
            
            {/* HERO SECTION WITH FULL BACKGROUND OVERLAY */}
            <section className="relative bg-[#191919] text-white pt-32 pb-24 md:pt-44 md:pb-32 px-4 border-b border-slate-800 overflow-hidden">
                {/* Background Image with 20% Opacity Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image 
                        src="/images/alumni-hero.png" 
                        alt="Cannoga Alumni Network" 
                        fill
                        className="object-cover object-top opacity-20"
                        priority
                    />
                    <div className="absolute inset-0 bg-[#191919]/75"></div>
                </div>

                <div className="container mx-auto max-w-5xl relative z-10">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c89211] mb-6">
                        <Link href="/" className="text-[#c89211] hover:text-white transition-colors no-underline">HOME</Link>
                        <span className="text-slate-500">/</span>
                        <span>COMMUNITY</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white leading-tight max-w-3xl">
                        Cannoga Alumni Network
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl font-medium">
                        Empowering a global network of over 18,000+ professionals committed to sustainable impact, leadership, and technological innovation. Graduation is just the beginning.
                    </p>
                </div>
            </section>

            {/* KEY STATS BAR */}
            <section className="bg-[#0f2027] text-white py-10 border-b border-slate-800">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {alumniStats.map((stat, idx) => (
                            <div key={idx} className="space-y-1">
                                <div className="text-3xl md:text-4xl font-black text-[#c89211]">{stat.value}</div>
                                <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="container mx-auto max-w-5xl px-4 py-16 space-y-16">

                {/* OVERVIEW SECTION */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-black text-black tracking-tight">Lifelong Connection & Impact</h2>
                    <p className="text-slate-700 text-base md:text-lg font-medium leading-relaxed">
                        Cannoga College Master&apos;s and Undergraduate Alumni represent an active global community leading projects across sustainability, public policy, technology, business, and health sciences. Our alumni office provides continuous services, event invitations, and career advancement tools to support your lifelong journey.
                    </p>
                </section>

                {/* BORDERLESS HORIZONTAL ROWS FOR ALUMNI SERVICES & BENEFITS */}
                <section id="benefits" className="scroll-mt-32 space-y-8 pt-8 border-t border-slate-200">
                    <div>
                        <h2 className="text-3xl font-black text-black tracking-tight mb-2">Alumni Privileges & Services</h2>
                        <p className="text-slate-700 text-base md:text-lg font-medium leading-relaxed">
                            As a verified Cannoga graduate, you hold lifetime access to institutional resources and career networks.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6 pt-2">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-4">
                                <div className="p-2 bg-[#0f2027] text-[#c89211] rounded-full shrink-0 mt-0.5">
                                    <GraduationCap size={16} weight="bold" />
                                </div>
                                <div>
                                    <h3 className="text-slate-900 font-bold text-base leading-snug">{benefit.title}</h3>
                                    <p className="text-slate-600 text-sm font-normal mt-1 leading-relaxed">
                                        {benefit.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* REGIONAL CHAPTERS DIRECTORY */}
                <section className="pt-8 border-t border-slate-200">
                    <h2 className="text-2xl font-black text-black tracking-tight mb-6">Regional Alumni Chapters</h2>
                    <p className="text-slate-700 text-base font-medium leading-relaxed mb-8">
                        Connect with local chapter leaders, participate in regional networking mixers, and attend Cannoga speaker panels in your area.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {chapters.map((chapter, idx) => (
                            <div key={idx} className="flex items-start gap-4">
                                <div className="p-2 bg-[#0f2027] text-[#c89211] rounded-full shrink-0 mt-0.5">
                                    <Globe size={16} weight="bold" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-slate-900">{chapter.city}</h3>
                                    <span className="inline-block text-xs font-bold text-[#c89211] uppercase tracking-wider mt-0.5 mb-1">{chapter.members}</span>
                                    <a href={`mailto:${chapter.contact}`} className="text-[#0f2027] font-bold text-sm underline hover:text-[#c89211] transition-colors block">
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
                            <h3 className="text-2xl font-black text-white">Update Your Contact Details & Directory Listing</h3>
                            <p className="text-slate-300 text-sm max-w-xl font-normal">
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
