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
        title: "ADVANCED DIPLOMA ADMISSIONS",
        description: 'Explore 3-year Advanced Diploma programmes, technical specializations, and professional practicums.',
        href: '/student-guide/master',
        bgColor: 'bg-[#ec4899]', // Vibrant Hot Pink
        borderColor: 'border-[#ec4899]',
        waveColor: '#db2777',
    },
    {
        id: 'diploma',
        title: 'DIPLOMA ADMISSIONS',
        description: 'Explore 2-year Diploma career pathways, practicums, and requirements.',
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
        <div className="relative w-full">
            <style jsx>{`
                @keyframes arrowFloatCred {
                    0%, 100% {
                        transform: translate(0, 0);
                    }
                    50% {
                        transform: translate(5px, -5px);
                    }
                }
                .animate-arrow-cred {
                    animation: arrowFloatCred 2.2s ease-in-out infinite;
                }
            `}</style>

            {/* Header / Title */}
            <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight font-serif">
                    Explore Admissions By Credential
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-1 font-normal">
                    Detailed requirements, tuition details, and onboarding guides for each program level.
                </p>
            </div>

            {/* Scrollable Container */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 px-1 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {ACADEMIC_ADMISSIONS_LINKS.map((item, idx) => {
                    return (
                        <div
                            key={item.id}
                            className="snap-start shrink-0 w-[300px] sm:w-[380px] md:w-[440px] flex flex-col no-underline"
                        >
                            <Link
                                href={item.href}
                                className={`block w-full p-6 sm:p-8 rounded-md ${item.bgColor} ${item.borderColor} border-4 no-underline overflow-hidden relative min-h-[240px] sm:min-h-[270px] flex flex-col justify-between group cursor-pointer transition-all duration-300 hover:brightness-105 shadow-md`}
                            >
                                {/* Top Label / Title */}
                                <div className="relative z-20">
                                    <h4 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-[1.05]">
                                        {item.title}
                                    </h4>
                                </div>

                                {/* Bottom Description & Arrow Icon */}
                                <div className="relative z-20 pt-6 flex items-end justify-between gap-4 text-white">
                                    <p className="text-xs sm:text-sm font-medium text-white/95 leading-relaxed font-sans max-w-[85%]">
                                        {item.description}
                                    </p>
                                    <div
                                        className="shrink-0 mb-0.5 animate-arrow-cred"
                                        style={{ animationDelay: `${idx * 0.4}s` }}
                                    >
                                        <ArrowUpRight size={40} weight="bold" className="text-white" />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>

            {/* Navigation Controls below the carousel (Matching Home) */}
            <div className="flex items-center justify-between mt-8 pt-2">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => scrollTo('left')}
                        className="p-3 rounded-full bg-slate-900 text-white hover:bg-[#c89211] transition-colors flex items-center justify-center border border-slate-700 cursor-pointer"
                        aria-label="Previous slide"
                    >
                        <ArrowLeft size={20} weight="bold" />
                    </button>
                    <button
                        onClick={() => scrollTo('right')}
                        className="p-3 rounded-full bg-slate-900 text-white hover:bg-[#c89211] transition-colors flex items-center justify-center border border-slate-700 cursor-pointer"
                        aria-label="Next slide"
                    >
                        <ArrowRight size={20} weight="bold" />
                    </button>
                </div>

                {/* Dot Indicators */}
                <div className="flex gap-2">
                    {ACADEMIC_ADMISSIONS_LINKS.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-2.5 transition-all rounded-full ${
                                idx === activeIndex ? 'w-8 bg-[#0a151a]' : 'w-2.5 bg-slate-300'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
