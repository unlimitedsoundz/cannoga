'use client';

import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';

interface CalendarCardItem {
    id: string;
    title: string;
    period: string;
    description: string;
    bgColor: string;
    borderColor: string;
}

const CALENDAR_CARDS: CalendarCardItem[] = [
    {
        id: 'fall-semester',
        title: 'FALL SEMESTER',
        period: 'September – December',
        description: 'New student orientation, course registrations, teaching periods 1 & 2, and mid-term assessments.',
        bgColor: 'bg-[#6366f1]', // Electric Indigo
        borderColor: 'border-[#6366f1]',
    },
    {
        id: 'winter-semester',
        title: 'WINTER SEMESTER',
        period: 'January – April',
        description: 'Winter intake start, teaching periods 3 & 4, capstone project submissions, and final assessments.',
        bgColor: 'bg-[#06b6d4]', // Electric Cyan
        borderColor: 'border-[#06b6d4]',
    },
    {
        id: 'teaching-exam-periods',
        title: 'TEACHING & EXAMS',
        period: 'Modular Sessions',
        description: 'Scheduled lecture blocks, hands-on lab evaluations, assessment weeks, and official grade releases.',
        bgColor: 'bg-[#ec4899]', // Vibrant Hot Pink
        borderColor: 'border-[#ec4899]',
    },
    {
        id: 'breaks-recess',
        title: 'ACADEMIC BREAKS',
        period: 'Winter & Summer Recess',
        description: 'Reading week, statutory Canadian holiday breaks, winter holidays, and optional summer courses.',
        bgColor: 'bg-[#10b981]', // Electric Emerald
        borderColor: 'border-[#10b981]',
    },
];

export function AcademicCalendarCarousel() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 350;
        const newIndex = Math.round(container.scrollLeft / (cardWidth + 24));
        setActiveIndex(Math.min(Math.max(newIndex, 0), CALENDAR_CARDS.length - 1));
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
            {/* Scrollable Cards Track */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 px-1 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {CALENDAR_CARDS.map((card) => (
                    <div
                        key={card.id}
                        className="snap-start shrink-0 w-[290px] sm:w-[360px] md:w-[420px] flex flex-col no-underline"
                    >
                        <div
                            className={`block w-full p-6 sm:p-8 rounded-md ${card.bgColor} ${card.borderColor} border-4 no-underline overflow-hidden relative min-h-[220px] sm:min-h-[250px] flex flex-col justify-between`}
                        >
                            {/* Card Content Header */}
                            <div className="relative z-20">
                                <span className="inline-block px-2.5 py-0.5 mb-3 rounded-full text-[11px] font-black uppercase tracking-wider bg-black/25 text-white/95 border border-white/10">
                                    {card.period}
                                </span>
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-[1.05]">
                                    {card.title}
                                </h3>
                            </div>

                            {/* Card Bottom Description */}
                            <div className="relative z-20 pt-4 flex items-end justify-between gap-4 text-white">
                                <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed font-sans">
                                    {card.description}
                                </p>
                            </div>
                        </div>
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
                    {CALENDAR_CARDS.map((_, idx) => (
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
