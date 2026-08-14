'use client';

import { Link } from "@aalto-dx/react-components";
import Image from 'next/image';
import { MapPin, Train, Building, BookOpen, Books as Library, House as Home, Users, Coffee, Compass, Info, ArrowRight, GraduationCap } from "@phosphor-icons/react";
import { Hero } from '@/components/layout/Hero';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';

export default function StudentLifeContent() {
    const sections = [
        { id: 'location', title: 'Location & Setting', content: '' },
        { id: 'accessibility', title: 'Accessibility', content: '' },
        { id: 'architecture', title: 'Campus Architecture', content: '' },
        { id: 'facilities', title: 'Academic Facilities', content: '' },
        { id: 'library', title: 'Library & Centres', content: '' },
        { id: 'housing', title: 'Housing & Daily Living', content: '' },
        { id: 'organizations', title: 'Student Organisations', content: '' },

        { id: 'services', title: 'Services & Amenities', content: '' },
    ];

    return (
        <GuideSidebarLayout sections={sections}>
            <div className="min-h-screen bg-white">
            {/* HERO SECTION */}
            <Hero
                title="Student life"
                body="Experience a supportive and vibrant campus environment. From coastal landscapes to modern academic facilities, discover how our community thrives in the heart of Ottawa."
                backgroundColor="#0f2027"
                tinted
                lightText={true}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Student life' }
                ]}
                image={{
                    src: "/images/1775992308619-019d8163-44a0-737f-adcd-915c11eb6189.png",
                    alt: "Student Life"
                }}
            />

            <div className="container mx-auto px-4 py-12 md:py-24">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Main Content */}
                    <main className="lg:w-full space-y-16 md:space-y-32">

                        {/* Location */}
                        <section id="location" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p6 text-black tracking-tight">Campus setting</h2>
                            <div className="grid lg:grid-cols-2 gap-0 overflow-hidden group">
                                {/* Left: Text Content */}
                                <div className="p-12 md:p-20 flex flex-col justify-center bg-white order-2 lg:order-1">
                                    <p className="text-aalto-3 text-black leading-aalto-3">
                                        The Cannoga College campus is located in the Ottawa region and forms a compact academic district where teaching facilities, student services, housing, and leisure areas are closely integrated. The campus is surrounded by coastal landscapes and protected green areas, offering a unique balance between urban infrastructure and natural surroundings.
                                    </p>
                                </div>

                                {/* Right: Square Image */}
                                <div className="relative aspect-square overflow-hidden bg-white order-1 lg:order-2">
                                    <Image
                                        src="/images/news/helsinki_study_hero_1771086748710.png"
                                        alt="Campus Setting"
                                        fill
                                        className="object-cover object-top"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Accessibility */}
                        <section id="accessibility" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p6 text-black tracking-tight">Global access</h2>
                            <div className="grid lg:grid-cols-2 gap-0 overflow-hidden group">
                                {/* Left: Square Image */}
                                <div className="relative aspect-square overflow-hidden bg-white">
                                    <Image
                                        src="/images/student-life/accessibility.jpg"
                                        alt="Accessibility"
                                        fill
                                        className="object-cover object-top"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>

                                {/* Right: Text Content */}
                                <div className="p-12 md:p-20 flex flex-col justify-center bg-[#0f2027] text-white">
                                    <div className="space-y-8">
                                        <p className="text-aalto-3 text-white/90 leading-aalto-3">
                                            The campus is directly connected to public transport networks. A dedicated transit route provides fast access to central Ottawa, with travel times typically under twenty minutes.
                                        </p>
                                        <p className="text-aalto-3 text-white/90 leading-aalto-3">
                                            Cycling infrastructure is well developed, with marked bike paths and secure bicycle parking available throughout the campus area.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Architecture */}
                        <section id="architecture" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p6 text-black tracking-tight">Built environment</h2>
                            <p className="text-aalto-3 text-black leading-aalto-3 max-w-4xl">
                                The campus features a mix of historically significant buildings and modern academic facilities. Architectural planning emphasizes openness and shared spaces. Teaching buildings, research facilities, and libraries are designed to support collaboration, independent study, and project-based learning.
                            </p>
                        </section>

                        {/* Academic Facilities */}
                        <section id="facilities" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p6 text-black tracking-tight">
                                Learning Spaces
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 mb-12">
                                {[
                                    { title: "Labs & Workshops", image: "/images/student-life/labs.png" },
                                    { title: "Collaborative Studios", image: "/images/student-life/studios.jpg" },
                                    { title: "Quiet Study Zones", image: "/images/student-life/quiet.jpg" }
                                ].map((item, idx) => (
                                    <div key={item.title} className={`group cursor-pointer bg-card overflow-hidden p-8`}>
                                        <div className="h-64 mb-8 overflow-hidden relative">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover object-top"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            />
                                        </div>
                                        <h3 className="font-bold text-xl uppercase tracking-tighter">{item.title}</h3>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <ul className="grid sm:grid-cols-2 gap-6 p-10 bg-neutral-100 text-black">
                                    {["Individual self study areas", "Group work rooms", "Technical workshops", "Creative design spaces"].map((item) => (
                                        <li key={item} className="font-bold uppercase tracking-widest text-sm flex items-center gap-4">
                                            <ArrowRight size={18} weight="bold" className="text-black" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Library */}
                        <section id="library" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p6 text-black tracking-tight">Knowledge center</h2>
                            <div className="grid lg:grid-cols-2 gap-0 overflow-hidden group">
                                {/* Left: Text Content */}
                                <div className="p-12 md:p-20 flex flex-col justify-center bg-white order-2 lg:order-1">
                                    <p className="text-xl text-black leading-relaxed font-medium mb-10">
                                        The central Learning Centre combines library services, digital resources, quiet reading zones, and collaborative areas. It serves as a primary academic hub for students across all fields of study.
                                    </p>
                                    <p className="text-lg text-black/60 italic leading-relaxed border-l-4 border-[#0f2027] pl-8 font-medium">
                                        "Designed to foster cross-disciplinary synergy, the center bridges the gap between traditional research and modern creative workflows."
                                    </p>
                                </div>

                                {/* Right: Square Image */}
                                <div className="relative aspect-square overflow-hidden bg-white order-1 lg:order-2">
                                     <Image
                                         src="/images/1775991969255-019d815e-0f7b-7a9f-8c49-7c04a49f0de8.png"
                                         alt="Library"
                                         fill
                                         className="object-cover object-top"
                                         sizes="(max-width: 1024px) 100vw, 50vw"
                                     />
                                </div>
                            </div>
                        </section>

                        {/* Housing */}
                        <section id="housing" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p6 text-black tracking-tight">Living at Cannoga</h2>
                            <div className="grid md:grid-cols-2 gap-4 lg:gap-8">
                                <div className="bg-card p-12 group">
                                    <div className="h-64 mb-10 relative overflow-hidden">
                                        <Image
                                            src="/images/student-life/apartments.jpg"
                                            alt="Shared Residences"
                                            fill
                                            className="object-cover object-top"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Shared Residences</h3>
                                    <p className="text-black leading-relaxed font-medium mb-8">Private room with shared kitchen and bathroom facilities. Affordable and social options for students looking for community.</p>
                                    <span className="inline-block bg-[#0f2027] text-[#c89211] px-6 py-2 text-sm font-bold uppercase tracking-[0.3em]">From ~300$/month</span>
                                </div>
                                <div className="bg-card p-12 group">
                                    <div className="h-64 mb-10 relative overflow-hidden">
                                        <Image
                                            src="/images/student-life/studio-apartments.jpg"
                                            alt="Studio Apartments"
                                            fill
                                            className="object-cover object-top"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Private Studios</h3>
                                    <p className="text-black leading-relaxed font-medium mb-8">Private apartments with individual kitchen and bathroom. Ideal for students who prefer focus and total independence.</p>
                                    <span className="inline-block bg-[#0f2027] text-[#c89211] px-6 py-2 text-sm font-bold uppercase tracking-[0.3em]">From ~450$/month</span>
                                </div>
                            </div>
                        </section>

                        {/* Organizations */}
                        <section id="organizations" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p6 text-black tracking-tight">Associations</h2>
                            <div className="grid lg:grid-cols-2 gap-0 overflow-hidden group mb-12">
                                {/* Left: Square Image */}
                                <div className="relative aspect-square md:aspect-auto md:h-full min-h-[400px] overflow-hidden bg-white">
                                    <Image
                                        src="/images/1775951882929-019d7efa-a205-73f9-9f42-775ee91c38fe.png"
                                        alt="Student Union & Communities"
                                        fill
                                        className="object-cover object-top"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                </div>

                                {/* Right: Text Content */}
                                <div className="p-12 md:p-20 flex flex-col justify-center bg-[#0f2027] text-white border-l border-[#1e3a47]">
                                    <div className="space-y-12">
                                        <div>
                                            <h3 className="text-3xl lg:text-4xl font-serif font-bold tracking-tight mb-2 text-white">Student Union</h3>
                                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#c89211]">Advocacy &amp; Events</p>
                                        </div>
                                        <div>
                                            <h3 className="text-3xl lg:text-4xl font-serif font-bold tracking-tight mb-2 text-white">Subject Clubs</h3>
                                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#c89211]">Field Specifics</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <ul className="grid sm:grid-cols-2 gap-6">
                                    {["Academic networking", "Cultural events", "Sports teams", "Debate & hobbies"].map((item) => (
                                        <li key={item} className="p-6 border-b border-neutral-100 font-bold uppercase tracking-widest text-sm flex items-center gap-4">
                                            <ArrowRight size={20} weight="bold" className="text-black" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Services */}
                        <section id="services" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p6 text-black tracking-tight">Integrated help</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0">
                                {[
                                    { name: "Restaurants", desc: "Campus Cafe", image: "/images/student-cafe.png" },
                                    { name: "Retail", desc: "Campus Supplies", image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop" },
                                    { name: "Health", desc: "Medical Support", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop" },
                                    { name: "Guidance", desc: "Career Support", image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&auto=format&fit=crop" }
                                ].map((item, idx) => (
                                    <Link key={item.name} href={item.name === "Restaurants" ? "/student-life/cafe/" : "#"} className={`bg-card group hover:bg-[#0f2027] hover:text-white transition-all p-8 flex flex-col no-underline`}>
                                        <div className="h-32 relative mb-6">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover object-top"
                                            />
                                        </div>
                                        <h3 className="font-bold text-lg uppercase tracking-tighter mb-2">{item.name}</h3>
                                        <p className="text-xs text-black/50 group-hover:text-white/50 font-bold uppercase tracking-widest">{item.desc}</p>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* Future Growth */}
                        <section id="future" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p6 text-black tracking-tight">
                                Evolution
                            </h2>
                            <p className="text-xl text-black leading-relaxed font-medium max-w-4xl">
                                Cannoga College continues to expand its infrastructure to support modern pedagogical methods and sustainability. Every new renovation focuses on energy efficiency, accessibility, and radically flexible learning environments.
                            </p>
                        </section>


                        {/* Summary */}
                        <section id="summary" className="scroll-mt-32 bg-[#0f2027] text-white p-12 md:p-20 border-y border-[#1e3a47]">
                            <h2 className="text-aalto-5 font-serif font-bold mb-8 text-white tracking-tight">Integrated Experience</h2>
                            <p className="text-xl text-white/90 leading-relaxed font-medium max-w-4xl">
                                Studying at Cannoga College means being part of an integrated academic ecosystem where teaching, research, and daily living coexist seamlessly. The combination of first-class infrastructure and natural surroundings supports both academic success and radical personal wellbeing.
                            </p>
                        </section>

                    </main>
                </div>
            </div>
        </div>
        </GuideSidebarLayout>
    );
}


