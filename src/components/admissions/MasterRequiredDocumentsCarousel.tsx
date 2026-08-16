'use client';

import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import { Link } from '@/components/ui/Link';

export interface DocumentCardItem {
    id: string;
    title: string;
    description: string;
    href: string;
    bgColor: string;
    borderColor: string;
}

const DOCUMENT_CARDS: DocumentCardItem[] = [
    {
        id: 'certified-educational-documents',
        title: 'CERTIFIED EDUCATIONAL DOCUMENTS',
        description: 'Must be submitted after admission decision within 14 days of your admission decision.',
        href: '/portal/apply',
        bgColor: 'bg-[#6366f1]', // Electric Indigo
        borderColor: 'border-[#6366f1]',
    },
    {
        id: 'translations',
        title: 'TRANSLATIONS',
        description: 'Non-English/Non-English documents require official translations.',
        href: '/portal/apply',
        bgColor: 'bg-[#f97316]', // Vibrant Orange
        borderColor: 'border-[#f97316]',
    },
    {
        id: 'passport-id',
        title: 'PASSPORT / ID',
        description: 'Color PDF of the personal information page.',
        href: '/portal/apply',
        bgColor: 'bg-[#10b981]', // Electric Emerald
        borderColor: 'border-[#10b981]',
    },
];

export function MasterRequiredDocumentsCarousel() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 320;
        const newIndex = Math.round(container.scrollLeft / (cardWidth + 24));
        setActiveIndex(Math.min(Math.max(newIndex, 0), DOCUMENT_CARDS.length - 1));
    };

    const scrollTo = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const scrollAmount = (container.firstElementChild?.clientWidth || 320) + 24;
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    return (
        <div className="relative w-full my-4">
            {/* Scrollable Cards Track */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 px-1 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {DOCUMENT_CARDS.map((card, idx) => (
                    <div
                        key={card.id}
                        className="snap-start shrink-0 w-[300px] sm:w-[380px] md:w-[420px] flex flex-col no-underline"
                    >
                        <Link
                            linkComponentProps={{ href: card.href }}
                            className={`block w-full p-6 sm:p-8 rounded-md ${card.bgColor} ${card.borderColor} border-4 no-underline overflow-hidden relative min-h-[220px] sm:min-h-[250px] flex flex-col justify-between group transition-all`}
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

                                <div className="shrink-0 mb-0.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
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
                    {DOCUMENT_CARDS.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-2.5 transition-all rounded-full ${idx === activeIndex ? 'w-8 bg-[#0a151a]' : 'w-2.5 bg-slate-300'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
