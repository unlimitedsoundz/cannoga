'use client';

import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import Link from 'next/link';

interface StudentCategoryItem {
    id: string;
    title: string;
    description: string;
    href: string;
    bgColor: string;
    borderColor: string;
}

const CATEGORY_CARDS: StudentCategoryItem[] = [
    {
        id: 'chat-with-students',
        title: 'CHAT WITH STUDENTS',
        description: 'Connect with current students and ambassadors to learn about life at Cannoga.',
        href: '/student-guide/chat-with-cannoga-students',
        bgColor: 'bg-[#6366f1]', // Electric Indigo
        borderColor: 'border-[#6366f1]',
    },
    {
        id: 'international-students',
        title: 'INTERNATIONAL STUDENTS',
        description: 'Support services, study permits, and integration into Ottawa’s multicultural community.',
        href: '/student-guide/international',
        bgColor: 'bg-[#06b6d4]', // Electric Cyan
        borderColor: 'border-[#06b6d4]',
    },
    {
        id: 'exchange-students',
        title: 'EXCHANGE STUDENTS',
        description: 'Orientation, course selection, and cultural adaptation for short-term studies.',
        href: '/student-guide/exchange',
        bgColor: 'bg-[#ec4899]', // Vibrant Hot Pink
        borderColor: 'border-[#ec4899]',
    },
    {
        id: 'bachelor-students',
        title: "BACHELOR'S GUIDE",
        description: 'Checklist, course planning, credit requirements, and academic regulations for undergraduates.',
        href: '/student-guide/bachelor',
        bgColor: 'bg-[#10b981]', // Electric Emerald
        borderColor: 'border-[#10b981]',
    },
    {
        id: 'master-students',
        title: "ADVANCED DIPLOMA'S GUIDE",
        description: '3-Year advanced technical curricula, applied research projects, labs, and career pathways.',
        href: '/student-guide/master',
        bgColor: 'bg-[#f97316]', // Vibrant Orange
        borderColor: 'border-[#f97316]',
    },
    {
        id: 'diploma-students',
        title: "DIPLOMA'S GUIDE",
        description: 'Applied technical curricula, co-op work terms, practical labs, and career pathways.',
        href: '/student-guide/diploma',
        bgColor: 'bg-[#6366f1]', // Indigo
        borderColor: 'border-[#6366f1]',
    },
    {
        id: 'certificate-students',
        title: "CERTIFICATE'S GUIDE",
        description: '1-Year intensive workforce credentials, industry bootcamps, and career readiness.',
        href: '/student-guide/certificate',
        bgColor: 'bg-[#a855f7]', // Purple
        borderColor: 'border-[#a855f7]',
    },
];

export function StudentCategoriesCarousel() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 350;
        const newIndex = Math.round(container.scrollLeft / (cardWidth + 24));
        setActiveIndex(Math.min(Math.max(newIndex, 0), CATEGORY_CARDS.length - 1));
    };

    const scrollTo = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const scrollAmount = (container.firstElementChild?.clientWidth || 350) + 24;
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    return (
        <div className="relative w-full my-6">
            <style jsx>{`
                @keyframes arrowFloatCat {
                    0%, 100% {
                        transform: translate(0, 0);
                    }
                    50% {
                        transform: translate(5px, -5px);
                    }
                }
                .animate-arrow-cat {
                    animation: arrowFloatCat 2.2s ease-in-out infinite;
                }
            `}</style>

            {/* Scrollable Cards Track */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 px-1 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {CATEGORY_CARDS.map((card, idx) => (
                    <div
                        key={card.id}
                        className="snap-start shrink-0 w-[290px] sm:w-[360px] md:w-[420px] flex flex-col no-underline"
                    >
                        <Link
                            href={card.href}
                            className={`block w-full p-6 sm:p-8 rounded-md ${card.bgColor} ${card.borderColor} border-4 no-underline overflow-hidden relative min-h-[240px] sm:min-h-[270px] flex flex-col justify-between group cursor-pointer  transition-all duration-300`}
                        >
                            {/* Card Content Header */}
                            <div className="relative z-20">
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-[1.05]">
                                    {card.title}
                                </h3>
                            </div>

                            {/* Card Bottom Description & Arrow Icon */}
                            <div className="relative z-20 pt-6 flex items-end justify-between gap-4 text-white">
                                <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed max-w-[85%] font-sans">
                                    {card.description}
                                </p>

                                <div
                                    className="shrink-0 mb-0.5 animate-arrow-cat group-hover:scale-110 transition-transform"
                                    style={{ animationDelay: `${idx * 0.4}s` }}
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
                        aria-label="Previous slide"
                    >
                        <ArrowLeft size={18} weight="bold" />
                    </button>
                    <button
                        onClick={() => scrollTo('right')}
                        className="p-3 rounded-full bg-slate-900 text-white hover:bg-[#c89211] transition-colors flex items-center justify-center border border-slate-700"
                        aria-label="Next slide"
                    >
                        <ArrowRight size={18} weight="bold" />
                    </button>
                </div>

                {/* Dot Indicators */}
                <div className="flex gap-2">
                    {CATEGORY_CARDS.map((_, idx) => (
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
