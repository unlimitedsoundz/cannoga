import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
    ArrowRight, 
    GraduationCap, 
    BookOpen, 
    Briefcase, 
    CheckCircle, 
    Globe, 
    Certificate, 
    Building, 
    Clock, 
    Compass
} from '@phosphor-icons/react/dist/ssr';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { Hero } from '@/components/layout/Hero';
import { ProgramsAZTableView } from '@/components/programs/ProgramsAZTableView';

export const metadata: Metadata = {
    title: 'Academic Programs & Studies Directory — Cannoga College',
    description: 'Explore all career-focused certificates, diplomas, bachelor degrees, and master graduate programs at Cannoga College Ottawa campus.',
    alternates: {
        canonical: 'https://cannogacollege.ca/studies/',
    },
};

const PROGRAM_LEVELS = [
    {
        title: "Certificate Programs",
        level: "Certificate",
        duration: "1 Year (2 Semesters)",
        credits: "30 Credits",
        desc: "Short, targeted pathways designed for rapid skill acquisition, professional certification, and immediate entry into Ontario's workforce.",
        coop: "Co-op Available",
        link: "/degree-programmes#certificates",
        icon: Certificate,
        color: "from-amber-500/20 to-amber-700/10 border-amber-500/30 text-amber-400"
    },
    {
        title: "Diploma Programs",
        level: "Diploma",
        duration: "2 Years (4 Semesters)",
        credits: "60 Credits",
        desc: "Applied two-year post-secondary qualifications combining core academic fundamentals with intensive hands-on lab training.",
        coop: "Co-op Included",
        link: "/degree-programmes#diplomas",
        icon: BookOpen,
        color: "from-blue-500/20 to-blue-700/10 border-blue-500/30 text-blue-400"
    },
    {
        title: "Advanced Diplomas",
        level: "Advanced Diploma",
        duration: "3 Years (6 Semesters)",
        credits: "90 Credits",
        desc: "In-depth technical and technological training with specialized industry internships for senior technical roles.",
        coop: "Co-op & Capstone",
        link: "/degree-programmes#diplomas",
        icon: Briefcase,
        color: "from-purple-500/20 to-purple-700/10 border-purple-500/30 text-purple-400"
    },
    {
        title: "Bachelor's Degrees",
        level: "Bachelor",
        duration: "4 Years (8 Semesters)",
        credits: "120 Credits",
        desc: "Four-year undergraduate degree programs combining theoretical rigor, practical internships, and global academic standards.",
        coop: "Paid Co-op Terms",
        link: "/admissions/bachelor",
        icon: GraduationCap,
        color: "from-emerald-500/20 to-emerald-700/10 border-emerald-500/30 text-emerald-400"
    },
    {
        title: "Master's & Postgrad",
        level: "Master",
        duration: "1–2 Years",
        credits: "45–60 Credits",
        desc: "Advanced graduate studies and postgraduate certificates for professionals seeking leadership, specialization, or research excellence.",
        coop: "Industry Applied Thesis",
        link: "/admissions/master",
        icon: Globe,
        color: "from-rose-500/20 to-rose-700/10 border-rose-500/30 text-rose-400"
    }
];

const SCHOOLS_DIRECTORY = [
    {
        name: "School of Technology & Computing",
        slug: "technology",
        count: "12 Programs",
        programs: ["Applied AI & Machine Learning", "Cybersecurity Management", "Cloud Architecture & Software Engineering", "Data Analytics & Business Intelligence"],
        image: "/images/home-carousel-2.png",
        bg: "#0a151a"
    },
    {
        name: "School of Business & Finance",
        slug: "business",
        count: "10 Programs",
        programs: ["Accounting & Business Finance", "International Business Management", "Digital Marketing & Brand Analytics", "Human Resource Leadership"],
        image: "/images/studies-hero.jpg",
        bg: "#0a151a"
    },
    {
        name: "School of Health & Life Sciences",
        slug: "health-sciences",
        count: "8 Programs",
        programs: ["Practical Nursing & Clinical Care", "Biomedical Technology", "Healthcare Administration", "Public Health Analytics"],
        image: "/images/collins-huang.jpg",
        bg: "#0a151a"
    },
    {
        name: "School of Arts, Design & Media",
        slug: "arts-design",
        count: "9 Programs",
        programs: ["UX/UI Design & Digital Media", "Architectural Technology", "Film Production & Broadcasting", "Game Design & Interactive Media"],
        image: "/images/1775945541604-019d7e99-907d-7ab4-82ed-0977a1243bc3.png",
        bg: "#0a151a"
    }
];

export default function StudiesPage() {
    return (
        <div className="min-h-screen bg-white">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Studies', item: '/studies' }
            ]} />

            {/* Hero Header */}
            <Hero
                title="Academic Programs & Study Options"
                body="Explore over 40 career-focused certificates, diplomas, bachelor degrees, and master graduate programs at Cannoga College Ottawa campus."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                overlay={true}
                overlayOpacity="opacity-40"
                image={{
                    src: "/images/studies-hero.jpg",
                    alt: "Cannoga College of Business building with students entering campus"
                }}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Studies' }
                ]}
            >
                <div className="flex flex-wrap gap-4">
                    <Link
                        href="#all-programs"
                        className="inline-flex items-center gap-2 bg-[#0a151a] hover:bg-[#12222a] text-white font-bold text-xs uppercase tracking-widest px-8 py-4 no-underline rounded-lg transition-colors border border-white/20 shadow-lg"
                    >
                        <span>Browse Program Catalog</span>
                        <ArrowRight size={16} weight="bold" className="text-[#c89211]" />
                    </Link>
                    <Link
                        href="/admissions"
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest px-8 py-4 no-underline rounded-lg transition-colors border border-white/20"
                    >
                        <span>Apply for Admission</span>
                        <ArrowRight size={16} weight="bold" />
                    </Link>
                </div>
            </Hero>

            {/* Program Levels Banner Grid */}
            <div className="bg-slate-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="text-[#c89211] font-bold text-xs uppercase tracking-widest block mb-2">Qualifications Framework</span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">Choose Your Study Pathway</h2>
                        <p className="text-sm text-slate-300 mt-2">Every program is structured with high academic standards, hands-on learning, and Post-Graduation Work Permit (PGWP) eligibility.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {PROGRAM_LEVELS.map((item, idx) => (
                            <Link
                                key={idx}
                                href={item.link}
                                className="group relative bg-[#0a151a] border border-white/10 p-6 rounded-xl hover:border-[#c89211]/50 transition-all flex flex-col justify-between no-underline"
                            >
                                <div>
                                    <h3 className="text-base font-extrabold text-white mb-1 group-hover:text-[#c89211] transition-colors">{item.title}</h3>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mb-3">
                                        <span>{item.duration}</span>
                                        <span>•</span>
                                        <span>{item.credits}</span>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed mb-4">{item.desc}</p>
                                </div>
                                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-[#c89211]">
                                    <span>{item.coop}</span>
                                    <ArrowRight size={14} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Interactive Programs Directory */}
            <div id="all-programs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="mb-10 text-center md:text-left">
                    <span className="text-[#c89211] font-bold text-xs uppercase tracking-widest block mb-1">Interactive Catalog</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Full Program Directory</h2>
                    <p className="text-sm text-slate-600 mt-1 max-w-2xl">Filter by academic level, school faculty, or co-op eligibility. Compare tuition fees and credit requirements for domestic and international students.</p>
                </div>

                <ProgramsAZTableView />
            </div>

            {/* Schools & Faculties Grid */}
            <div className="bg-slate-50 py-16 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                        <div>
                            <span className="text-[#c89211] font-bold text-xs uppercase tracking-widest block mb-1">Academic Faculties</span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Explore by School</h2>
                        </div>
                        <Link href="/admissions" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0a151a] hover:text-[#c89211] transition-colors">
                            View All School Faculties <ArrowRight size={14} weight="bold" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {SCHOOLS_DIRECTORY.map((school, idx) => (
                            <div key={idx} className="group relative bg-[#0a151a] rounded-2xl overflow-hidden border border-white/10 shadow-lg min-h-[360px] flex flex-col justify-end p-8">
                                <div className="absolute inset-0">
                                    <Image
                                        src={school.image}
                                        alt={school.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-40"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a151a] via-[#0a151a]/80 to-transparent" />
                                </div>
                                <div className="relative z-10 text-white">
                                    <span className="inline-block px-3 py-1 bg-[#c89211] text-[#0a151a] text-[10px] font-black uppercase tracking-widest rounded-md mb-3">{school.count}</span>
                                    <h3 className="text-xl font-extrabold text-white mb-3">{school.name}</h3>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {school.programs.map((p, pIdx) => (
                                            <span key={pIdx} className="bg-white/10 text-slate-200 text-xs px-2.5 py-1 rounded-md border border-white/10 font-medium">
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                    <Link 
                                        href={`/schools/${school.slug}`} 
                                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-[#c89211] transition-colors"
                                    >
                                        Browse School Programs <ArrowRight size={14} weight="bold" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Experiential Learning & Support Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-[#0a151a] rounded-2xl p-8 md:p-12 border border-white/10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-2xl">
                        <span className="text-[#c89211] font-bold text-xs uppercase tracking-widest block mb-2">Work-Integrated Learning</span>
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-4">Paid Co-Op Terms & Industry Internships</h2>
                        <p className="text-sm text-slate-300 leading-relaxed mb-6">
                            Over 85% of Cannoga College diploma and degree programs feature mandatory or optional co-op placements with leading Ottawa technology firms, federal government agencies, and clinical networks.
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-200">
                            <span className="flex items-center gap-1.5"><CheckCircle size={16} className="text-[#c89211]" /> PGWP Eligible</span>
                            <span className="flex items-center gap-1.5"><CheckCircle size={16} className="text-[#c89211]" /> Industry Mentorship</span>
                            <span className="flex items-center gap-1.5"><CheckCircle size={16} className="text-[#c89211]" /> Ottawa Tech Hub Connections</span>
                        </div>
                    </div>
                    <div className="shrink-0 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <Link
                            href="/admissions"
                            className="inline-flex items-center justify-center gap-2 bg-[#c89211] hover:bg-[#b07e0e] text-[#0a151a] font-bold text-xs uppercase tracking-widest px-8 py-4 no-underline rounded-lg transition-colors shadow-lg text-center"
                        >
                            <span>Apply Today</span>
                            <ArrowRight size={16} weight="bold" />
                        </Link>
                        <Link
                            href="/student-guide"
                            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest px-8 py-4 no-underline rounded-lg transition-colors border border-white/20 text-center"
                        >
                            <span>Student Guide</span>
                            <Compass size={16} weight="bold" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
