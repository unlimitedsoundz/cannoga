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
import { AcademicSchoolsCarousel } from '@/components/home/AcademicSchoolsCarousel';
import { AcademicCredentialsCarousel } from '@/components/home/AcademicCredentialsCarousel';
import { createStaticClient } from '@/lib/supabase/static';

export const metadata: Metadata = {
    title: 'Academic Programs & Studies Directory — Cannoga College',
    description: 'Explore all career-focused certificates, diplomas, bachelor degrees, and master graduate programs at Cannoga College Ottawa campus.',
    alternates: {
        canonical: 'https://cannogacollege.ca/studies/',
    },
};

const SCHOOLS_DIRECTORY = [
    {
        name: "School of Technology & Computing",
        slug: "technology",
        count: "12 Programs",
        programs: ["Applied AI & Machine Learning", "Cybersecurity Management", "Cloud Architecture & Software Engineering", "Data Analytics & Business Intelligence"],
        image: "/images/technology.jpg",
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
        name: "School of Health & Community Services",
        slug: "health-community",
        count: "8 Programs",
        programs: ["Practical Nursing & Clinical Care", "Biomedical Technology", "Healthcare Administration", "Public Health Analytics"],
        image: "/images/health-community.jpg",
        bg: "#0a151a"
    },
    {
        name: "School of Arts, Design & Media",
        slug: "arts-design",
        count: "9 Programs",
        programs: ["UX/UI Design & Digital Media", "Architectural Technology", "Film Production & Broadcasting", "Game Design & Interactive Media"],
        image: "/images/arts-design.jpg",
        bg: "#0a151a"
    }
];

export default async function StudiesPage() {
    const supabase = createStaticClient();
    const { data: schools } = await supabase
        .from('School')
        .select('id, name, slug, description, imageUrl')
        .order('name', { ascending: true });

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
                        className="inline-flex items-center gap-2 bg-white hover:bg-neutral-100 text-black font-bold text-xs uppercase tracking-widest px-8 py-4 no-underline shadow-md transition-colors"
                    >
                        <span>Browse Program Catalog</span>
                        <ArrowRight size={16} weight="bold" className="text-black" />
                    </Link>
                    <Link
                        href="/admissions"
                        className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-black font-bold text-xs uppercase tracking-widest px-8 py-4 no-underline shadow-md transition-colors"
                    >
                        <span>Apply for Admission</span>
                        <ArrowRight size={16} weight="bold" className="text-black" />
                    </Link>
                </div>
            </Hero>

            {/* Academic Credentials & Programs Carousel */}
            <div className="bg-white py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-10">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Academic Credentials &amp; Programs</h2>
                        <p className="text-sm text-slate-600 mt-1">Explore career-focused certificates, diplomas, bachelor's degrees, and graduate master studies.</p>
                    </div>
                    <AcademicCredentialsCarousel />
                </div>
            </div>

            {/* Main Interactive Programs Directory */}
            <div id="all-programs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="mb-10 text-center md:text-left">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Full Program Directory</h2>
                    <p className="text-sm text-slate-600 mt-1 max-w-2xl">Filter by academic level, school faculty, or co-op eligibility. Compare tuition fees and credit requirements for domestic and international students.</p>
                </div>

                <ProgramsAZTableView />
            </div>

            {/* Schools & Faculties Carousel */}
            <div className="bg-slate-50 py-16 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 text-left max-w-2xl">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Academic Schools</h2>
                        <p className="text-sm text-slate-600 mt-2">Explore specialized schools and faculties across Cannoga College.</p>
                    </div>

                    <AcademicSchoolsCarousel schools={schools || []} />
                </div>
            </div>

            {/* Experiential Learning & Support Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 border-t border-neutral-200">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div className="max-w-3xl">
                        <h2 className="text-xl md:text-2xl font-black tracking-tight text-black mb-3">Paid Co-Op Terms &amp; Industry Internships</h2>
                        <p className="text-xs md:text-sm text-neutral-600 leading-relaxed mb-4">
                            Over 85% of Cannoga College diploma and degree programs feature mandatory or optional co-op placements with leading Ottawa technology firms, federal government agencies, and clinical networks.
                        </p>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-neutral-700">
                            <span className="flex items-center gap-1.5"><CheckCircle size={15} className="text-black" /> PGWP Eligible</span>
                            <span className="flex items-center gap-1.5"><CheckCircle size={15} className="text-black" /> Industry Mentorship</span>
                            <span className="flex items-center gap-1.5"><CheckCircle size={15} className="text-black" /> Ottawa Tech Hub Connections</span>
                        </div>
                    </div>
                    <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto pt-2 md:pt-0">
                        <Link
                            href="/admissions"
                            className="inline-flex items-center justify-center gap-2 bg-[#0f2027] hover:bg-black text-white font-bold text-xs uppercase tracking-widest px-6 py-3 no-underline transition-colors text-center"
                        >
                            <span>Apply Today</span>
                            <ArrowRight size={14} weight="bold" />
                        </Link>
                        <Link
                            href="/student-guide"
                            className="inline-flex items-center justify-center gap-2 border border-neutral-300 hover:border-black text-black font-bold text-xs uppercase tracking-widest px-6 py-3 no-underline transition-colors text-center"
                        >
                            <span>Student Guide</span>
                            <Compass size={14} weight="bold" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
