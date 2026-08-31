'use client';

import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import Link from 'next/link';

interface MasterStudyOption {
    id: string;
    title: string;
    description: string;
    href: string;
    degreeText: string;
    bgColor: string;
    borderColor: string;
}

const STUDY_OPTIONS: MasterStudyOption[] = [
    {
        id: 'art-design',
        title: 'ART & DESIGN',
        description: 'Advanced Diploma in Design, Architecture, Visual Arts, and Media Practices.',
        degreeText: 'Advanced Diploma (3 Years)',
        href: '/schools/arts-design',
        bgColor: 'bg-[#ec4899]', // Vibrant Rose/Pink
        borderColor: 'border-[#ec4899]',
    },
    {
        id: 'business-economics',
        title: 'BUSINESS & ECONOMICS',
        description: 'Advanced Diploma in Accounting & Finance, Strategic Management, and Economics.',
        degreeText: 'Advanced Diploma (3 Years)',
        href: '/schools/business',
        bgColor: 'bg-[#f97316]', // Vibrant Orange
        borderColor: 'border-[#f97316]',
    },
    {
        id: 'technology-engineering',
        title: 'TECHNOLOGY & ENGINEERING',
        description: 'Advanced Diploma in Engineering, Computer Science, Data Analytics, and Architecture.',
        degreeText: 'Advanced Diploma (3 Years)',
        href: '/schools/technology',
        bgColor: 'bg-[#6366f1]', // Electric Indigo
        borderColor: 'border-[#6366f1]',
    },
    {
        id: 'education',
        title: 'EDUCATION',
        description: 'Advanced Diploma in Pedagogy, Educational Leadership, and Curriculum Design.',
        degreeText: 'Advanced Diploma (3 Years)',
        href: '/schools/education-social-sciences',
        bgColor: 'bg-[#ef4444]', // Electric Crimson
        borderColor: 'border-[#ef4444]',
    },
    {
        id: 'science',
        title: 'SCIENCE',
        description: 'Advanced Diploma in Environmental Science, Applied Physics, and Bio-Analytics.',
        degreeText: 'Advanced Diploma (3 Years)',
        href: '/schools/science',
        bgColor: 'bg-[#06b6d4]', // Electric Cyan
        borderColor: 'border-[#06b6d4]',
    },
    {
        id: 'health-life-sciences',
        title: 'HEALTH & LIFE SCIENCES',
        description: 'Advanced Diploma in Healthcare Leadership, Clinical Management, and Public Health.',
        degreeText: 'Advanced Diploma (3 Years)',
        href: '/schools/health-community',
        bgColor: 'bg-[#10b981]', // Electric Emerald
        borderColor: 'border-[#10b981]',
    },
    {
        id: 'transportation-aviation',
        title: 'TRANSPORTATION & AVIATION',
        description: 'Advanced Diploma in Aviation Operations, Supply Chain Logistics, and Transport Safety.',
        degreeText: 'Advanced Diploma (3 Years)',
        href: '/schools/transportation-aviation',
        bgColor: 'bg-[#8b5cf6]', // Deep Purple
        borderColor: 'border-[#8b5cf6]',
    },
];

export function MasterStudyOptionsCarousel() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 360;
        const newIndex = Math.round(container.scrollLeft / (cardWidth + 24));
        setActiveIndex(Math.min(Math.max(newIndex, 0), STUDY_OPTIONS.length - 1));
    };

    const scrollTo = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const scrollAmount = (container.firstElementChild?.clientWidth || 360) + 24;
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    return (
        <div className="relative w-full my-6">
            <style jsx>{`
                @keyframes arrowFloatHub {
                    0%, 100% {
                        transform: translate(0, 0);
                    }
                    50% {
                        transform: translate(5px, -5px);
                    }
                }
                .animate-arrow-hub {
                    animation: arrowFloatHub 2.2s ease-in-out infinite;
                }
            `}</style>

            {/* Scrollable Cards Track */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 px-1 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {STUDY_OPTIONS.map((card, idx) => (
                    <div
                        key={card.id}
                        className="snap-start shrink-0 w-[300px] sm:w-[380px] md:w-[440px] flex flex-col no-underline"
                    >
                        <Link
                            href={card.href}
                            className={`block w-full p-6 sm:p-8 rounded-md ${card.bgColor} ${card.borderColor} border-4 no-underline overflow-hidden relative min-h-[260px] sm:min-h-[300px] flex flex-col justify-between   transition- group`}
                        >
                            {/* Card Content Header */}
                            <div className="relative z-20">
                                <span className="inline-block px-2.5 py-0.5 mb-3 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/25 text-white/95 border border-white/10">
                                    {card.degreeText}
                                </span>
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-[1.05]">
                                    {card.title}
                                </h3>
                            </div>

                            {/* Card Bottom Description & Arrow Icon */}
                            <div className="relative z-20 pt-6 flex items-end justify-between gap-4 text-white">
                                <p className="text-xs sm:text-sm font-medium text-white/95 leading-relaxed max-w-[85%] font-sans">
                                    {card.description}
                                </p>

                                <div
                                    className="shrink-0 mb-0.5 animate-arrow-hub group-hover:scale-110 transition-transform"
                                    style={{ animationDelay: `${idx * 0.3}s` }}
                                >
                                    <ArrowUpRight size={38} weight="bold" className="text-white" />
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Navigation Controls below the carousel */}
            <div className="flex items-center justify-between mt-6 pt-2">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => scrollTo('left')}
                        className="p-3 rounded-full bg-slate-900 text-white hover:bg-[#c89211] transition-colors flex items-center justify-center border border-slate-700"
                        aria-label="Previous study option"
                    >
                        <ArrowLeft size={18} weight="bold" />
                    </button>
                    <button
                        onClick={() => scrollTo('right')}
                        className="p-3 rounded-full bg-slate-900 text-white hover:bg-[#c89211] transition-colors flex items-center justify-center border border-slate-700"
                        aria-label="Next study option"
                    >
                        <ArrowRight size={18} weight="bold" />
                    </button>
                </div>

                {/* Dot Indicators */}
                <div className="flex gap-1.5">
                    {STUDY_OPTIONS.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-2 transition-all rounded-full ${
                                idx === activeIndex ? 'w-7 bg-[#0a151a]' : 'w-2 bg-slate-300'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
