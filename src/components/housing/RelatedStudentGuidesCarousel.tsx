'use client';

import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import { Link } from '@/components/ui/Link';

interface RelatedGuideItem {
    id: string;
    title: string;
    description: string;
    href: string;
    bgColor: string;
    borderColor: string;
    waveColor: string;
}

const RELATED_GUIDES: RelatedGuideItem[] = [
    {
        id: 'health-wellbeing-guide',
        title: 'HEALTH & WELLBEING GUIDE',
        description: 'UHIP coverage, campus wellness, counseling services, and local clinic network in Ottawa.',
        href: '/student-guide/health-and-wellbeing/',
        bgColor: 'bg-[#6366f1]', // Electric Indigo
        borderColor: 'border-[#6366f1]',
        waveColor: '#4f46e5',
    },
    {
        id: 'arrival-guide',
        title: 'OTTAWA ARRIVAL GUIDE',
        description: 'Airport pickup, SIM cards, opening Canadian bank accounts, and settling into Ottawa.',
        href: '/student-guide/arrival',
        bgColor: 'bg-[#f97316]', // Vibrant Orange
        borderColor: 'border-[#f97316]',
        waveColor: '#ea580c',
    },
    {
        id: 'international-guide',
        title: 'INTERNATIONAL STUDENT GUIDE',
        description: 'Study permits, visa compliance, health insurance (UHIP), and orientation programs.',
        href: '/student-guide/international',
        bgColor: 'bg-[#10b981]', // Electric Emerald
        borderColor: 'border-[#10b981]',
        waveColor: '#059669',
    },
];

export function RelatedStudentGuidesCarousel() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 350;
        const newIndex = Math.round(container.scrollLeft / (cardWidth + 24));
        setActiveIndex(Math.min(Math.max(newIndex, 0), RELATED_GUIDES.length - 1));
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
        <div className="relative group/carousel w-full">
            {/* Scrollable Container */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {RELATED_GUIDES.map((item) => (
                    <div
                        key={item.id}
                        className="snap-start shrink-0 w-[280px] sm:w-[320px] md:w-[360px]"
                    >
                        <Link
                            href={item.href}
                            className={`group relative flex flex-col justify-between ${item.bgColor} border-4 ${item.borderColor} text-white p-6 sm:p-7 min-h-[220px] sm:min-h-[240px] transition-all duration-300 hover:-translate-y-1 block no-underline overflow-hidden`}
                        >
                            {/* Decorative Rolling Hill / Wave Edge */}
                            <div className="absolute top-0 right-0 w-36 h-36 opacity-30 pointer-events-none -mr-8 -mt-8">
                                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                    <circle cx="50" cy="50" r="40" fill={item.waveColor} />
                                </svg>
                            </div>

                            {/* Content Top */}
                            <div className="relative z-10 space-y-3">
                                <div className="flex items-center justify-between gap-3">
                                    <h4 className="text-base sm:text-lg font-black tracking-tight text-white uppercase leading-snug">
                                        {item.title}
                                    </h4>
                                    <div className="shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                        <ArrowUpRight size={18} weight="bold" />
                                    </div>
                                </div>
                                <p className="text-white/90 text-xs sm:text-sm font-medium leading-relaxed">
                                    {item.description}
                                </p>
                            </div>

                            {/* Bottom Visual Arrow */}
                            <div className="relative z-10 pt-4 mt-auto border-t border-white/20 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white">
                                <span>Explore Guide</span>
                                <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Navigation Controls below the carousel (Academic Credentials Carousel Style) */}
            <div className="flex items-center justify-between mt-8 pt-2">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => scrollTo('left')}
                        className="p-3 rounded-full bg-slate-900 text-white hover:bg-[#c89211] transition-colors flex items-center justify-center border border-slate-700 disabled:opacity-30 disabled:hover:bg-slate-900"
                        aria-label="Previous slide"
                        disabled={activeIndex === 0}
                    >
                        <ArrowLeft size={20} weight="bold" />
                    </button>
                    <button
                        onClick={() => scrollTo('right')}
                        className="p-3 rounded-full bg-slate-900 text-white hover:bg-[#c89211] transition-colors flex items-center justify-center border border-slate-700 disabled:opacity-30 disabled:hover:bg-slate-900"
                        aria-label="Next slide"
                        disabled={activeIndex === RELATED_GUIDES.length - 1}
                    >
                        <ArrowRight size={20} weight="bold" />
                    </button>
                </div>

                {/* Dot Indicators */}
                <div className="flex gap-2">
                    {RELATED_GUIDES.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                if (!scrollContainerRef.current) return;
                                const cardWidth = scrollContainerRef.current.firstElementChild?.clientWidth || 350;
                                scrollContainerRef.current.scrollTo({
                                    left: idx * (cardWidth + 24),
                                    behavior: 'smooth'
                                });
                            }}
                            className={`h-2.5 transition-all rounded-full ${
                                idx === activeIndex ? 'w-8 bg-[#0a151a]' : 'w-2.5 bg-slate-300'
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
