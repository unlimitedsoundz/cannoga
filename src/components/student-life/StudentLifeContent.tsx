'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, MapPin, Coffee, Users, House, Sparkle } from '@phosphor-icons/react';
import { Hero } from '@/components/layout/Hero';
import { StudentLifeExperienceCarousel } from '@/components/student-life/StudentLifeExperienceCarousel';
import { LearningSpacesAcademicCarousel } from '@/components/student-life/LearningSpacesAcademicCarousel';
import { ExploreHousingCarousel } from '@/components/housing/ExploreHousingCarousel';
import { CampusServicesAcademicCarousel } from '@/components/student-life/CampusServicesAcademicCarousel';
import StudentStoriesCarousel from '@/components/admissions/StudentStoriesCarousel';
import { StudentResourceHubCarousel } from '@/components/home/StudentResourceHubCarousel';

export default function StudentLifeContent() {
    return (
        <div className="flex flex-col min-h-screen bg-white text-black font-sans">
            {/* 1. HERO SECTION */}
            <Hero
                title="Student Life"
                body="Experience a supportive, diverse, and globally connected community in the heart of Ottawa. From modern collaborative studios to student-led societies, discover your campus life."
                backgroundColor="#0f2027"
                tinted
                lightText={true}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Student Life' }
                ]}
                image={{
                    src: "/images/vibrant-community.png",
                    alt: "Cannoga College Student Life in Ottawa"
                }}
            />

            {/* 2. VIBRANT STUDENT LIFE HIGHLIGHTS CAROUSEL */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4 md:px-12 lg:px-20 max-w-7xl">
                    <div className="mb-10 max-w-2xl text-left">
                        <span className="text-xs font-black uppercase tracking-widest text-[#c89211] mb-2 block">
                            Campus Experience
                        </span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0f2027] tracking-tight">
                            Explore Student Life
                        </h2>
                        <p className="text-slate-600 font-normal text-base mt-2">
                            Dive into clubs, modern residences, student dining, and wellness support across our Ottawa campus.
                        </p>
                    </div>

                    <StudentLifeExperienceCarousel />
                </div>
            </section>

            {/* 3. CAMPUS SETTING & ENVIRONMENT */}
            <section id="location" className="py-16 md:py-24 bg-slate-50 border-y border-slate-200">
                <div className="container mx-auto px-4 md:px-12 lg:px-20 max-w-7xl">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-6 space-y-6">
                            <h2 className="text-3xl md:text-4xl font-black text-[#0f2027] tracking-tight leading-tight font-serif">
                                An Urban Academic District in Canada’s Capital
                            </h2>
                            <p className="text-base md:text-lg text-slate-700 leading-relaxed font-medium">
                                Cannoga College forms a compact, accessible academic district in Ottawa where teaching facilities, student lounges, research labs, and transit routes are seamlessly integrated.
                            </p>
                        </div>

                        <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] rounded-xl overflow-hidden border border-slate-200">
                            <Image
                                src="/images/ottawa-campus.jpg"
                                alt="Ottawa Campus Environment"
                                fill
                                className="object-cover object-top"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. LEARNING SPACES & STUDIOS */}
            <section id="facilities" className="py-20 bg-white">
                <div className="container mx-auto px-4 md:px-12 lg:px-20 max-w-7xl">
                    <div className="mb-10 max-w-2xl text-left">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0f2027] tracking-tight">
                            Modern Learning Spaces
                        </h2>
                        <p className="text-slate-600 font-normal text-base mt-2">
                            Spaces engineered for hands-on technical training, creative design, and focused research.
                        </p>
                    </div>

                    <LearningSpacesAcademicCarousel />
                </div>
            </section>

            {/* 5. HOUSING & ACCOMMODATION SPOTLIGHT */}
            <section id="housing" className="py-20 bg-slate-50 border-y border-slate-200">
                <div className="container mx-auto px-4 md:px-12 lg:px-20 max-w-7xl">
                    <div className="mb-10 max-w-2xl text-left">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0f2027] tracking-tight">
                            Living at Cannoga
                        </h2>
                        <p className="text-slate-600 font-normal text-base mt-2">
                            Secure, affordable on-campus and off-campus housing tailored for student life.
                        </p>
                    </div>

                    <ExploreHousingCarousel />
                </div>
            </section>

            {/* 6. FIND YOUR PEOPLE & STUDENT STORIES CAROUSEL (COLUMBIA COLLEGE STYLE) */}
            <section className="py-16 md:py-24 bg-white text-black overflow-hidden">
                <div className="container mx-auto px-4 md:px-12 lg:px-20 max-w-7xl">
                    <StudentStoriesCarousel />
                </div>
            </section>

            {/* 7. CAMPUS DINING & SERVICES */}
            <section id="services" className="py-20 bg-slate-50 border-y border-slate-200">
                <div className="container mx-auto px-4 md:px-12 lg:px-20 max-w-7xl">
                    <div className="mb-10 max-w-2xl text-left">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0f2027] tracking-tight">
                            Dining, Retail &amp; Support
                        </h2>
                        <p className="text-slate-600 font-normal text-base mt-2">
                            Convenient services located on-campus to make your student life smooth and enjoyable.
                        </p>
                    </div>

                    <CampusServicesAcademicCarousel />
                </div>
            </section>

            {/* 8. STUDENT RESOURCE LINKS WITH LILAC BACKGROUND & SMOOTH HILL TOP EDGE (JUST LIKE HOME) */}
            <section className="relative bg-[#e8d5ff] pt-14 pb-20 md:pt-28 md:pb-24 text-slate-900">
                {/* Top Smooth Rolling Hills Wavy Edge (4px overlap closes any mobile gap line) */}
                <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none z-10 -translate-y-[calc(100%-4px)] pointer-events-none">
                    <svg viewBox="0 0 1440 90" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10 sm:h-14 md:h-20 text-[#e8d5ff] fill-current block scale-y-[1.05] origin-bottom">
                        <path d="M0,50 C240,15 480,85 720,40 C960,-5 1200,70 1440,35 V100 H0 Z" />
                    </svg>
                </div>

                <div className="container mx-auto px-4 md:px-12 lg:px-20 max-w-7xl relative z-20">
                    <div className="mb-12">
                        <h2 className="text-3xl font-serif font-bold text-[#0f2027]">Student Resource Hub</h2>
                        <p className="text-slate-700 text-sm mt-1">Direct access to campus services, health support, and academic governance.</p>
                    </div>

                    <StudentResourceHubCarousel />
                </div>

                {/* Bottom Prominent Wavy Edge */}
                <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-0 translate-y-[calc(100%-2px)] pointer-events-none">
                    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 sm:h-24 md:h-36 text-[#e8d5ff] fill-current block scale-y-[1.1] origin-top">
                        <path d="M0,0 C320,90 640,-30 960,70 C1200,120 1360,30 1440,50 V0 H0 Z" />
                    </svg>
                </div>
            </section>
        </div>
    );
}
