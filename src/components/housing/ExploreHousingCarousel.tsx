'use client';

import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import Link from 'next/link';

interface HousingExploreCard {
    id: string;
    title: string;
    description: string;
    href: string;
    cta: string;
    bgColor: string;
    borderColor: string;
}

const EXPLORE_HOUSING_CARDS: HousingExploreCard[] = [
    {
        id: 'on-campus',
        title: 'ON-CAMPUS RESIDENCE',
        description:
            'Furnished private bedrooms with shared modern kitchens, high-speed Wi-Fi, study lounges, and social common rooms. Located steps from lecture halls and student services.',
        href: '/housing#application',
        cta: 'View Residence Suites',
        bgColor: 'bg-[#6366f1]', // Electric Indigo
        borderColor: 'border-[#6366f1]',
    },
    {
        id: 'homestay',
        title: 'CANADIAN HOMESTAY PROGRAM',
        description:
            'Immerse yourself in Canadian culture by living with a welcoming local Ottawa family. Includes a private furnished bedroom, utility bills, and home-cooked meal plans.',
        href: '/housing#application',
        cta: 'Explore Homestay',
        bgColor: 'bg-[#ec4899]', // Vibrant Hot Pink
        borderColor: 'border-[#ec4899]',
    },
    {
        id: 'off-campus',
        title: 'OFF-CAMPUS PRIVATE RENTALS',
        description:
            'Prefer independent living? Discover trusted rental partners and verified apartment listings in Sandy Hill, Centretown, Byward Market, and Glebe.',
        href: '/housing#tenant-rights',
        cta: 'Search Private Rentals',
        bgColor: 'bg-[#10b981]', // Electric Emerald
        borderColor: 'border-[#10b981]',
    },
    {
        id: 'shared-suites',
        title: 'SHARED STUDENT FLATS',
        description:
            'Budget-friendly shared suites from ~$300/mo with individual lease agreements, study desks, laundry facilities, and fast transit access.',
        href: '/housing#pricing',
        cta: 'Browse Shared Suites',
        bgColor: 'bg-[#f97316]', // Vibrant Orange
        borderColor: 'border-[#f97316]',
    },
];

export function ExploreHousingCarousel() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 350;
        const newIndex = Math.round(container.scrollLeft / (cardWidth + 24));
        setActiveIndex(Math.min(Math.max(newIndex, 0), EXPLORE_HOUSING_CARDS.length - 1));
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
        <div className="relative w-full">
            <style jsx>{`
                @keyframes arrowFloatExplore {
                    0%, 100% {
                        transform: translate(0, 0);
                    }
                    50% {
                        transform: translate(5px, -5px);
                    }
                }
                .animate-arrow-explore {
                    animation: arrowFloatExplore 2.2s ease-in-out infinite;
                }
            `}</style>

            {/* Scrollable Cards Track */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 px-1 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {EXPLORE_HOUSING_CARDS.map((card, idx) => (
                    <div
                        key={card.id}
                        className="snap-start shrink-0 w-[300px] sm:w-[380px] md:w-[420px] flex flex-col no-underline"
                    >
                        <Link
                            href={card.href}
                            className={`block w-full p-6 sm:p-8 rounded-md ${card.bgColor} ${card.borderColor} border-4 no-underline overflow-hidden relative min-h-[290px] sm:min-h-[310px] flex flex-col justify-between transition-transform hover:-translate-y-1 duration-200`}
                        >
                            {/* Card Content Header */}
                            <div className="relative z-20">
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-[1.05] mb-3">
                                    {card.title}
                                </h3>
                                <p className="text-xs sm:text-sm font-medium text-white/95 leading-relaxed font-sans">
                                    {card.description}
                                </p>
                            </div>

                            {/* Card Bottom CTA & Arrow Icon */}
                            <div className="relative z-20 pt-4 flex items-center justify-between gap-4 text-white border-t border-white/20 mt-4">
                                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white underline">
                                    {card.cta}
                                </span>

                                <div
                                    className="shrink-0 mb-0.5 animate-arrow-explore"
                                    style={{ animationDelay: `${idx * 0.4}s` }}
                                >
                                    <ArrowUpRight size={36} weight="bold" className="text-white" />
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
                    {EXPLORE_HOUSING_CARDS.map((_, idx) => (
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
