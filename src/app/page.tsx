import * as React from "react";
import Image from "next/image";
import { Link } from "@/components/ui/Link";
import { ArrowRight, CaretRight as ChevronRight, Calendar, MapPin, Notebook, GraduationCap } from "@phosphor-icons/react/dist/ssr";
import { HomeCarousel } from "@/components/home/HomeCarousel";
import { HomeNewsEventsGrid } from "@/components/home/HomeNewsEventsGrid";
import ProgramSearch from "@/components/home/ProgramSearch";
import { Metadata } from "next";
import { createStaticClient } from "@/lib/supabase/static";

export const metadata: Metadata = {
  title: 'Cannoga College | International Higher Education in Canada',
  description: 'Pursue your academic and career goals at Cannoga College. We offer Degree, Diploma, and Certificate programs in Ottawa, Ontario, Canada.',
  alternates: {
    canonical: 'https://cannogacollege.ca/',
  },
};

export const revalidate = 3600;

export default async function Home() {
    const supabase = createStaticClient();

    const { data: schools } = await supabase
        .from('School')
        .select('name, slug, description, imageUrl')
        .order('name', { ascending: true });

    const { data: courses } = await supabase
        .from('Course')
        .select('title, slug, degreeLevel, duration, description, imageUrl, schoolId')
        .limit(6);

    const { data: news } = await supabase
        .from('News')
        .select('title, slug, publishDate')
        .eq('published', true)
        .order('publishDate', { ascending: false })
        .limit(3);

    const { data: events } = await supabase
        .from('Event')
        .select('title, slug, date')
        .eq('published', true)
        .order('date', { ascending: true })
        .limit(3);

    return (
        <div className="flex flex-col min-h-screen bg-white text-black font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": "Cannoga College",
                        "alternateName": "Cannoga College Ottawa campus",
                        "url": "https://cannogacollege.ca"
                    })
                }}
            />

            {/* 1. HERO CAROUSEL */}
            <HomeCarousel />

            {/* 2. EXPLORE PROGRAMS & COURSES */}
            <section className="py-20 bg-[#f5f5f5]">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                        <div className="text-left max-w-2xl">
                            <h2 className="text-3xl font-black text-[#000000] uppercase tracking-tight">Explore Our Programs and Courses</h2>
                            <p className="text-[#000000] font-semibold mt-2">Find the right academic path tailored to your goals at our Ottawa campus.</p>
                        </div>
                        <ProgramSearch />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { name: "Certificate Programs", desc: "Short, career-focused pathways for practical skill-building and fast entry into the workforce", href: "/degree-programmes#certificates" },
                            { name: "Diploma Programs", desc: "Two-year applied study options with project-based learning and strong industry relevance", href: "/degree-programmes#diplomas" },
                            { name: "Bachelor's & Master's Degrees", desc: "Flexible undergraduate and graduate study routes for academic and professional growth", href: "/degree-programmes" },
                            { name: "Schools & Institutes", desc: "Discover the academic schools that shape our certificate, diploma and degree offerings", href: "/schools" },
                            { name: "Programs A-Z", desc: "Browse all academic pathways, courses and credentials in one place", href: "/studies" },
                            { name: "Ottawa campus Info", desc: "Explore campus facilities, support services and study-life resources", href: "/contact" },
                        ].map((card) => (
                            <Link
                                key={card.name}
                                linkComponentProps={{ href: card.href }}
                                className="group p-8 bg-white border border-neutral-100 flex flex-col justify-between hover:border-[#9c27b3] hover:shadow-lg transition-all duration-300 no-underline"
                            >
                                <div>
                                    <h3 className="text-xl font-bold text-[#000000] group-hover:text-[#000000] transition-colors">{card.name}</h3>
                                    <p className="text-neutral-500 text-sm mt-2">{card.desc}</p>
                                </div>
                                <div className="mt-6 flex items-center gap-1 text-[#000000] font-bold text-xs uppercase tracking-wider">
                                    <span>Explore</span>
                                    <ChevronRight size={14} weight="bold" className="transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. NEWS & EVENTS GRID */}
            <section className="py-20 container mx-auto px-4">
                <HomeNewsEventsGrid />
            </section>

            {/* 4. FEATURED SCHOOLS */}
            {schools && schools.length > 0 && (
                <section className="py-20 bg-neutral-50">
                    <div className="container mx-auto px-4">
                        <div className="mb-12 border-b border-neutral-200 pb-4">
                            <h2 className="text-2xl font-bold uppercase tracking-widest mb-2 text-black">Our Schools</h2>
                            <p className="text-neutral-500 text-sm">Explore our academic schools and discover your path.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {schools.map((school) => (
                                <Link key={school.slug} href={`/schools/${school.slug}`} className="group bg-white border border-neutral-200 p-6 hover:border-[#9c27b3] hover:shadow-lg transition-all no-underline">
                                    <h3 className="font-bold text-neutral-900 group-hover:text-[#9c27b3] transition-colors mb-2">{school.name}</h3>
                                    <p className="text-sm text-neutral-500 line-clamp-2">{school.description}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 5. STUDENT RESOURCE LINKS */}
            <section className="py-20 bg-neutral-50">
                <div className="container mx-auto px-4">
                    <div className="mb-12 border-b border-neutral-200 pb-4">
                        <h2 className="text-2xl font-black text-[#000000] uppercase tracking-tight">Student Resource Hub</h2>
                        <p className="text-neutral-500 text-sm">Quick access to campus programs, finance help, and student associations.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Explore campus and book a tour", href: "/contact", icon: MapPin },
                            { title: "Student Support Services", href: "/student-guide#support", icon: Notebook },
                            { title: "CC Career Opportunities", href: "/careers", icon: GraduationCap },
                            { title: "Financial Aid & Student Awards", href: "/admissions/tuition", icon: Calendar },
                            { title: "Admissions Office Details", href: "/admissions", icon: GraduationCap },
                            { title: "Students' Association Portal", href: "/student-guide", icon: Notebook },
                        ].map((link, idx) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={idx}
                                    linkComponentProps={{ href: link.href }}
                                    className="group flex items-start gap-4 p-4 hover:bg-white border border-transparent hover:border-neutral-200 transition-all no-underline"
                                >
                                    <div className="p-3 bg-[#f5f5f5] text-[#000000] group-hover:bg-[#9c27b3] group-hover:text-white transition-colors rounded-full">
                                        <Icon size={20} weight="bold" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#000000] group-hover:text-[#000000] group-hover:underline transition-colors mt-1">
                                            {link.title}
                                        </h4>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}

