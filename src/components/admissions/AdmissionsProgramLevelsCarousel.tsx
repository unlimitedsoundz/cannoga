'use client';

import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import { Link } from '@/components/ui/Link';

interface AcademicAdmissionsLinkItem {
    id: string;
    title: string;
    description: string;
    href: string;
    bgColor: string;
    borderColor: string;
    waveColor: string;
}

const ACADEMIC_ADMISSIONS_LINKS: AcademicAdmissionsLinkItem[] = [
    {
        id: 'bachelor',
        title: "BACHELOR'S ADMISSIONS",
        description: 'Explore 4-year undergraduate degree programmes, entrance requirements, and Canadian co-op pathways.',
        href: '/student-guide/bachelor',
        bgColor: 'bg-[#6366f1]', // Electric Indigo
        borderColor: 'border-[#6366f1]',
        waveColor: '#4f46e5',
    },
    {
        id: 'master',
        title: "MASTER'S ADMISSIONS",
        description: 'Find information on graduate programs, research specializations, and professional degree applications.',
        href: '/student-guide/master',
        bgColor: 'bg-[#ec4899]', // Vibrant Hot Pink
        borderColor: 'border-[#ec4899]',
        waveColor: '#db2777',
    },
    {
        id: 'diploma',
        title: 'DIPLOMA ADMISSIONS',
        description: 'Explore 2-year Diploma and 3-year Advanced Diploma career pathways, practicums, and requirements.',
        href: '/student-guide/diploma',
        bgColor: 'bg-[#10b981]', // Electric Emerald
        borderColor: 'border-[#10b981]',
        waveColor: '#059669',
    },
    {
        id: 'certificate',
        title: 'CERTIFICATE ADMISSIONS',
        description: 'Fast-track 1-year Certificates and Post-Graduate Certificates designed for targeted career advancement.',
        href: '/student-guide/certificate',
        bgColor: 'bg-[#f97316]', // Vibrant Orange
        borderColor: 'border-[#f97316]',
        waveColor: '#ea580c',
    },
];

export function AdmissionsProgramLevelsCarousel() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 350;
        const newIndex = Math.round(container.scrollLeft / (cardWidth + 24));
        setActiveIndex(Math.min(Math.max(newIndex, 0), ACADEMIC_ADMISSIONS_LINKS.length - 1));
    };

    const scrollTo = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const scrollAmount = (container.firstElementChild?.clientWidth || 350) + 24;
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <div className="relative w-full overflow-hidden">
            {/* Header / Title + Navigation Controls */}
            <div className="flex items-end justify-between mb-6">
                <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight font-serif">
                        Explore Admissions By Credential
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm mt-1 font-normal">
                        Detailed requirements, tuition details, and onboarding guides for each program level.
                    </p>
                </div>
                
                {/* Arrow Buttons */}
                <div className="hidden sm:flex items-center gap-2">
                    <button
                        onClick={() => scrollTo('left')}
                        aria-label="Previous items"
                        className="w-10 h-10 rounded-full border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition cursor-pointer shadow-2xs"
                    >
                        <ArrowLeft size={18} weight="bold" />
                    </button>
                    <button
                        onClick={() => scrollTo('right')}
                        aria-label="Next items"
                        className="w-10 h-10 rounded-full border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition cursor-pointer shadow-2xs"
                    >
                        <ArrowRight size={18} weight="bold" />
                    </button>
                </div>
            </div>

            {/* Scrollable Container */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 -mx-4 px-4 sm:mx-0 sm:px-0"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {ACADEMIC_ADMISSIONS_LINKS.map((item) => {
                    return (
                        <div
                            key={item.id}
                            className="w-[280px] sm:w-[320px] md:w-[360px] flex-shrink-0 snap-start"
                        >
                            <Link
                                href={item.href}
                                className={`block w-full p-6 sm:p-7 rounded-md ${item.bgColor} ${item.borderColor} border-4 no-underline overflow-hidden relative min-h-[220px] sm:min-h-[240px] flex flex-col justify-between group cursor-pointer transition-all duration-300 hover:brightness-105 shadow-md`}
                            >
                                {/* Top Label / Title */}
                                <div className="relative z-20">
                                    <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-[1.05]">
                                        {item.title}
                                    </h4>
                                </div>

                                {/* Bottom Description & Arrow Icon */}
                                <div className="relative z-20 pt-4 flex items-end justify-between gap-4 text-white">
                                    <p className="text-xs sm:text-sm font-medium text-white/95 leading-relaxed font-sans max-w-[82%]">
                                        {item.description}
                                    </p>
                                    <div className="shrink-0 mb-0.5 group-hover:scale-110 transition-transform">
                                        <ArrowUpRight size={32} weight="bold" className="text-white" />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>

            {/* Mobile Pagination Dots */}
            <div className="flex sm:hidden justify-center items-center gap-2 mt-4">
                {ACADEMIC_ADMISSIONS_LINKS.map((_, idx) => (
                    <span
                        key={idx}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            activeIndex === idx ? 'w-6 bg-slate-900' : 'w-2 bg-slate-300'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
