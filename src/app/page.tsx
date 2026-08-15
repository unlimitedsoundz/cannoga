import * as React from "react";
import Image from "next/image";
import { Link } from "@/components/ui/Link";
import { ArrowRight, CaretRight as ChevronRight, Calendar, MapPin, Notebook, GraduationCap } from "@phosphor-icons/react/dist/ssr";
import { HomeCarousel } from "@/components/home/HomeCarousel";
import { HomeNewsEventsGrid } from "@/components/home/HomeNewsEventsGrid";
import { Metadata } from "next";
import { createStaticClient } from "@/lib/supabase/static";

import StudentStoriesCarousel from "@/components/admissions/StudentStoriesCarousel";
import { CannogaShortsSection } from "@/components/home/CannogaShortsSection";
import { AcademicCredentialsCarousel } from "@/components/home/AcademicCredentialsCarousel";
import { AcademicSchoolsCarousel } from "@/components/home/AcademicSchoolsCarousel";

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
        .select('*')
        .eq('published', true)
        .order('publishDate', { ascending: false })
        .limit(5);

    const { data: events } = await supabase
        .from('Event')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: true })
        .limit(4);

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

            {/* 2. EXPLORE PROGRAMS & COURSES (COLUMBIA COLLEGE STYLE VIBRANT CAROUSEL) */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 md:px-28 lg:px-40">
                    <div className="mb-10 max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0f2027] tracking-tight">Academic Programs &amp; Credentials</h2>
                        <p className="text-slate-600 font-normal text-base mt-2">Explore career-focused post-secondary education at our Ottawa campus.</p>
                    </div>

                    <AcademicCredentialsCarousel />
                </div>
            </section>

            {/* 3. NEWS & EVENTS GRID */}
            <section className="py-20 container mx-auto px-4 md:px-28 lg:px-40">
                <HomeNewsEventsGrid initialNews={news || []} initialEvents={events || []} />
            </section>

            {/* 3.5 CANNOGA SHORTS SECTION */}
            <CannogaShortsSection />

            {/* 4. FEATURED SCHOOLS (COLUMBIA COLLEGE STYLE VIBRANT CAROUSEL) */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 md:px-28 lg:px-40">
                    <div className="mb-10 max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0f2027] tracking-tight">Academic Schools</h2>
                        <p className="text-slate-600 font-normal text-base mt-2">Discover Cannoga College's specialized academic divisions.</p>
                    </div>

                    <AcademicSchoolsCarousel schools={schools || []} />
                </div>
            </section>

            {/* 5. STUDENT STORIES & EXPERIENCE */}
            <section className="py-16 bg-white text-black">
                <div className="container mx-auto px-4 md:px-12 lg:px-20 max-w-7xl">
                    <div className="mb-8">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0f2027]">Student Stories</h2>
                        <p className="text-slate-600 text-sm mt-1">Hear directly from students studying at Cannoga College Ottawa.</p>
                    </div>
                    <StudentStoriesCarousel />
                </div>
            </section>

            {/* 6. STUDENT RESOURCE LINKS WITH LILAC BACKGROUND & SMOOTH HILL TOP EDGE */}
            <section className="relative bg-[#e8d5ff] pt-14 pb-20 md:pt-28 md:pb-24 text-slate-900">
                {/* Top Smooth Rolling Hills Wavy Edge (4px overlap closes any mobile gap line) */}
                <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none z-10 -translate-y-[calc(100%-4px)] pointer-events-none">
                    <svg viewBox="0 0 1440 90" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10 sm:h-14 md:h-20 text-[#e8d5ff] fill-current block scale-y-[1.05] origin-bottom">
                        <path d="M0,50 C240,15 480,85 720,40 C960,-5 1200,70 1440,35 V100 H0 Z" />
                    </svg>
                </div>

                <div className="container mx-auto px-4 md:px-28 lg:px-40 relative z-20">
                    <div className="mb-12">
                        <h2 className="text-3xl font-serif font-bold text-[#0f2027]">Student Resource Hub</h2>
                        <p className="text-slate-700 text-sm mt-1">Direct access to campus services, financial aid, and academic governance.</p>
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
                                    className="flex items-start gap-4 p-5 bg-white border border-purple-200/60 no-underline rounded-sm"
                                >
                                    <div className="p-3 bg-[#0f2027] text-white rounded-full shrink-0 flex items-center justify-center w-11 h-11">
                                        <Icon size={20} weight="bold" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#0f2027] mt-0.5 text-base">
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

