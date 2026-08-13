import * as React from "react";
import Image from "next/image";
import { Link } from "@/components/ui/Link";
import { ArrowRight, CaretRight as ChevronRight, Calendar, MapPin, Notebook, GraduationCap } from "@phosphor-icons/react/dist/ssr";
import { HomeCarousel } from "@/components/home/HomeCarousel";
import { HomeNewsEventsGrid } from "@/components/home/HomeNewsEventsGrid";
import ProgramSearch from "@/components/home/ProgramSearch";
import { Metadata } from "next";
import { createStaticClient } from "@/lib/supabase/static";

import StudentStoriesCarousel from "@/components/admissions/StudentStoriesCarousel";

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
            <section className="py-20 bg-[#f8fafc] border-b border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                        <div className="text-left max-w-2xl">
                            <span className="text-[#c89211] font-bold uppercase tracking-widest text-xs mb-2 block">Academic Pathways in Ottawa</span>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0f2027] tracking-tight">Academic Programs &amp; Credentials</h2>
                            <p className="text-slate-600 font-normal text-base mt-2">Explore career-focused post-secondary education at our Ottawa campus (DLI #O19394821).</p>
                        </div>
                        <ProgramSearch />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { name: "Ontario College Certificates", desc: "1-year career-focused pathways designed for rapid skill acquisition and practical workforce entry", href: "/degree-programmes#certificates" },
                            { name: "Ontario College Diplomas", desc: "2-year applied learning programs integrating hands-on labs, industry software, and co-op placement", href: "/degree-programmes#diplomas" },
                            { name: "Advanced Diplomas & Degrees", desc: "3-year advanced diplomas and 4-year Honours Bachelor's Degrees combining academic depth with co-op pathways", href: "/degree-programmes" },
                            { name: "Academic Schools & Faculties", desc: "Eight specialized faculties delivering technology, health, business, and creative design education", href: "/schools" },
                            { name: "Program Directory A–Z", desc: "Browse all approved Ontario post-secondary courses, prerequisite codes, and credential specs", href: "/studies" },
                            { name: "Ottawa Campus & Co-op Hub", desc: "Explore campus facilities, student support services, and Ottawa tech-sector co-op partnerships", href: "/contact" },
                        ].map((card) => (
                            <Link
                                key={card.name}
                                linkComponentProps={{ href: card.href }}
                                className="group p-8 bg-white border border-slate-200 flex flex-col justify-between hover:border-[#0f2027] hover:shadow-md transition-all duration-200 no-underline rounded-sm"
                            >
                                <div>
                                    <h3 className="text-xl font-serif font-bold text-[#0f2027] group-hover:text-[#0f2027] transition-colors">{card.name}</h3>
                                    <p className="text-slate-600 text-sm mt-3 leading-relaxed">{card.desc}</p>
                                </div>
                                <div className="mt-6 flex items-center gap-1.5 text-[#0f2027] font-bold text-xs uppercase tracking-wider">
                                    <span>View Credentials</span>
                                    <ChevronRight size={14} weight="bold" className="transform group-hover:translate-x-1 transition-transform text-[#c89211]" />
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
                <section className="py-20 bg-[#f8fafc] border-t border-b border-slate-200">
                    <div className="container mx-auto px-4">
                        <div className="mb-12 border-b border-slate-200 pb-4">
                            <span className="text-[#c89211] font-bold uppercase tracking-widest text-xs mb-2 block">Faculties &amp; Divisions</span>
                            <h2 className="text-3xl font-serif font-bold text-[#0f2027]">Academic Schools</h2>
                            <p className="text-slate-600 text-sm mt-1">Discover Cannoga College's specialized academic divisions.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {schools.map((school) => (
                                <Link key={school.slug} href={`/schools/${school.slug}`} className="group bg-white border border-slate-200 p-6 hover:border-[#0f2027] hover:shadow-md transition-all no-underline rounded-sm">
                                    <h3 className="font-serif font-bold text-[#0f2027] group-hover:text-[#c89211] transition-colors mb-2">{school.name}</h3>
                                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{school.description}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 5. STUDENT STORIES & EXPERIENCE */}
            <section className="py-12 bg-[#0a151a] text-white">
                <div className="container mx-auto px-4">
                    <div className="mb-6 border-b border-white/10 pb-3">
                        <span className="text-[#c89211] font-bold uppercase tracking-widest text-xs mb-1.5 block">Campus Life &amp; Voices</span>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">Student Stories</h2>
                        <p className="text-slate-400 text-sm mt-0.5">Hear directly from students studying at Cannoga College Ottawa.</p>
                    </div>
                    <StudentStoriesCarousel />
                </div>
            </section>

            {/* 5. STUDENT RESOURCE LINKS */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="mb-12 border-b border-slate-200 pb-4">
                        <span className="text-[#c89211] font-bold uppercase tracking-widest text-xs mb-2 block">Essential Information</span>
                        <h2 className="text-3xl font-serif font-bold text-[#0f2027]">Student Resource Hub</h2>
                        <p className="text-slate-600 text-sm mt-1">Direct access to campus services, financial aid, and academic governance.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Explore Campus & Book a Tour", href: "/contact", icon: MapPin },
                            { title: "Student Support & Health Services", href: "/student-guide#support", icon: Notebook },
                            { title: "Graduate Employment & Career Services", href: "/careers", icon: GraduationCap },
                            { title: "Financial Aid & OSAP Guidance", href: "/admissions/tuition", icon: Calendar },
                            { title: "Admissions & Entry Requirements", href: "/admissions", icon: GraduationCap },
                            { title: "Student Rights & Code of Conduct", href: "/code-of-conduct", icon: Notebook },
                        ].map((link, idx) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={idx}
                                    linkComponentProps={{ href: link.href }}
                                    className="group flex items-start gap-4 p-5 bg-[#f8fafc] hover:bg-white border border-slate-200 hover:border-[#0f2027] hover:shadow-sm transition-all no-underline rounded-sm"
                                >
                                    <div className="p-3 bg-[#0f2027] text-white group-hover:bg-[#c89211] transition-colors rounded-sm shrink-0">
                                        <Icon size={20} weight="bold" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#0f2027] group-hover:text-[#0f2027] transition-colors mt-0.5 text-base">
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

