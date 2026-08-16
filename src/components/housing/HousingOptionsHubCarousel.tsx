'use client';

import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle } from '@phosphor-icons/react';
import Link from 'next/link';

interface HousingOptionCard {
    id: string;
    title: string;
    price: string;
    period: string;
    features: string[];
    href: string;
    bgColor: string;
    borderColor: string;
}

const HOUSING_OPTIONS: HousingOptionCard[] = [
    {
        id: 'shared-apt',
        title: 'SHARED STUDENT APARTMENT',
        price: '$550 – $850',
        period: 'per month',
        features: [
            'Private bedroom in 3-4 bed suite',
            'Shared kitchen & bathroom',
            'Utilities & High-Speed Wi-Fi included',
            'Flexible 8-month academic leases',
        ],
        href: '/portal/account/login/',
        bgColor: 'bg-[#6366f1]', // Electric Indigo
        borderColor: 'border-[#6366f1]',
    },
    {
        id: 'residence-suite',
        title: 'ON-CAMPUS RESIDENCE SUITE',
        price: '$900 – $1,250',
        period: 'per month',
        features: [
            'Fully furnished private room',
            '24/7 security & residence advisor',
            'Campus dining hall pass optional',
            'Steps to academic buildings',
        ],
        href: '/portal/account/login/',
        bgColor: 'bg-[#ec4899]', // Vibrant Hot Pink
        borderColor: 'border-[#ec4899]',
    },
    {
        id: 'private-studio',
        title: 'PRIVATE STUDIO / 1-BED APARTMENT',
        price: '$1,200 – $1,600',
        period: 'per month',
        features: [
            '100% private living space',
            'In-suite kitchen & laundry',
            'Located in prime Ottawa downtown',
            'Ideal for senior or graduate students',
        ],
        href: '/portal/account/login/',
        bgColor: 'bg-[#10b981]', // Electric Emerald
        borderColor: 'border-[#10b981]',
    },
];

export function HousingOptionsHubCarousel() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 350;
        const newIndex = Math.round(container.scrollLeft / (cardWidth + 24));
        setActiveIndex(Math.min(Math.max(newIndex, 0), HOUSING_OPTIONS.length - 1));
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
                @keyframes arrowFloatHousing {
                    0%, 100% {
                        transform: translate(0, 0);
                    }
                    50% {
                        transform: translate(5px, -5px);
                    }
                }
                .animate-arrow-housing {
                    animation: arrowFloatHousing 2.2s ease-in-out infinite;
                }
            `}</style>

            {/* Scrollable Cards Track */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 px-1 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {HOUSING_OPTIONS.map((card, idx) => (
                    <div
                        key={card.id}
                        className="snap-start shrink-0 w-[320px] sm:w-[400px] md:w-[440px] flex flex-col no-underline"
                    >
                        <Link
                            href={card.href}
                            className={`block w-full p-6 sm:p-8 rounded-md ${card.bgColor} ${card.borderColor} border-4 no-underline overflow-hidden relative min-h-[360px] sm:min-h-[380px] flex flex-col justify-between transition-transform hover:-translate-y-1 duration-200`}
                        >
                            {/* Card Header & Price */}
                            <div className="relative z-20">
                                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-[1.08] mb-3">
                                    {card.title}
                                </h3>
                                <div>
                                    <span className="text-3xl sm:text-4xl font-black text-white">{card.price}</span>
                                    <span className="text-xs sm:text-sm text-white/80 block font-semibold mt-0.5">{card.period}</span>
                                </div>
                            </div>

                            {/* Features List */}
                            <div className="relative z-20 my-4 py-3 border-t border-white/20">
                                <ul className="space-y-2 text-xs sm:text-sm font-medium text-white/95 leading-snug">
                                    {card.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-center gap-2">
                                            <CheckCircle size={16} weight="fill" className="text-white shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Card Bottom CTA & Arrow Icon */}
                            <div className="relative z-20 pt-2 flex items-center justify-between gap-4 text-white border-t border-white/20">
                                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white underline">
                                    Apply via Housing Portal
                                </span>

                                <div
                                    className="shrink-0 mb-0.5 animate-arrow-housing"
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
            <div className="flex items-center justify-between mt-8 pt-2">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => scrollTo('left')}
                        className="p-3 rounded-full bg-slate-900 text-white hover:bg-[#c89211] transition-colors flex items-center justify-center border border-slate-700"
                        aria-label="Previous slide"
                    >
                        <ArrowLeft size={20} weight="bold" />
                    </button>
                    <button
                        onClick={() => scrollTo('right')}
                        className="p-3 rounded-full bg-slate-900 text-white hover:bg-[#c89211] transition-colors flex items-center justify-center border border-slate-700"
                        aria-label="Next slide"
                    >
                        <ArrowRight size={20} weight="bold" />
                    </button>
                </div>

                {/* Dot Indicators */}
                <div className="flex gap-2">
                    {HOUSING_OPTIONS.map((_, idx) => (
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
