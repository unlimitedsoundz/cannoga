'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';

interface HealthCardItem {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    bgColor: string;
    borderColor: string;
    waveColor: string;
}

const HEALTH_CARDS: HealthCardItem[] = [
    {
        id: 'medical-clinic',
        title: 'ON-CAMPUS HEALTH CLINIC',
        subtitle: 'Primary Care & Nursing',
        description: 'Walk-in nursing triage, routine health assessments, doctor referrals, immunizations, and prescription coordination.',
        image: 'https://i.pinimg.com/736x/d3/b9/8e/d3b98e89679e5ca4c34400245499245b.jpg',
        bgColor: 'bg-[#0088dd]', // Vibrant blue
        borderColor: 'border-[#0088dd]',
        waveColor: '#005596',
    },
    {
        id: 'mental-wellness',
        title: 'MENTAL HEALTH & COUNSELING',
        subtitle: 'Confidential & Free',
        description: '1-on-1 registered psychotherapist sessions, stress management workshops, mindfulness clinics, and crisis intervention.',
        image: 'https://i.pinimg.com/736x/5b/f5/61/5bf561efb493ac87e969265065ee8004.jpg',
        bgColor: 'bg-[#4da674]', // Emerald green
        borderColor: 'border-[#4da674]',
        waveColor: '#28583c',
    },
    {
        id: 'uhip-insurance',
        title: 'HEALTH INSURANCE DESK (UHIP)',
        subtitle: 'Coverage & Claims Advising',
        description: 'Full medical, hospital, and emergency coverage support for international students in Ontario, plus domestic benefits guidance.',
        image: 'https://i.pinimg.com/736x/b5/ea/0e/b5ea0ebd677efd7be05dab54abafbc3b.jpg',
        bgColor: 'bg-[#c89211]', // Gold
        borderColor: 'border-[#c89211]',
        waveColor: '#8a650c',
    },
    {
        id: 'accessibility-services',
        title: 'ACCESSIBILITY & ACCOMMODATIONS',
        subtitle: 'Inclusive Learning Support',
        description: 'Personalized academic accommodation plans, assistive technology loans, exam room adjustments, and peer note-taking.',
        image: 'https://i.pinimg.com/1200x/3f/35/44/3f3544eadd901587f197029e880694a7.jpg',
        bgColor: 'bg-[#8e24aa]', // Purple
        borderColor: 'border-[#8e24aa]',
        waveColor: '#521363',
    },
    {
        id: 'crisis-support',
        title: '24/7 CRISIS & URGENT CARE',
        subtitle: 'Immediate Help Anytime',
        description: 'Round-the-clock telephone and text crisis response via Good2Talk, Ottawa Distress Centre, and campus security dispatch.',
        image: '/images/good2talk-ontario.png',
        bgColor: 'bg-[#e11d48]', // Crimson Rose
        borderColor: 'border-[#e11d48]',
        waveColor: '#881337',
    }
];

export function HealthServicesCarousel() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 280;
        const newIndex = Math.round(container.scrollLeft / (cardWidth + 20));
        setActiveIndex(Math.min(Math.max(newIndex, 0), HEALTH_CARDS.length - 1));
    };

    const scrollTo = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 280;
        const scrollAmount = direction === 'left' ? -(cardWidth + 20) : (cardWidth + 20);
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    return (
        <div className="relative w-full overflow-hidden py-2">
            {/* Scrollable Container */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {HEALTH_CARDS.map((card, idx) => (
                    <div
                        key={card.id}
                        className="shrink-0 w-[270px] sm:w-[310px] md:w-[330px] snap-center flex flex-col"
                    >
                        <div className={`flex flex-col h-full rounded-sm overflow-hidden border-2 ${card.borderColor} ${card.bgColor}`}>
                            {/* Card Top Image with Animated Wave */}
                            <div className="relative aspect-[16/11] w-full overflow-hidden bg-black/10">
                                <Image
                                    src={card.image}
                                    alt={card.title}
                                    fill
                                    className={card.id === 'crisis-support' ? 'object-contain p-5 bg-white' : 'object-cover'}
                                    sizes="(max-width: 640px) 270px, 330px"
                                />

                                {/* Organic Wavy Edge overlay */}
                                <div
                                    className="absolute bottom-[-16px] left-0 right-0 h-12 sm:h-16 overflow-hidden leading-none z-10 pointer-events-none"
                                    style={{ animationDelay: `${idx * 0.35}s` }}
                                >
                                    <svg
                                        viewBox="0 0 1440 200"
                                        preserveAspectRatio="none"
                                        className="w-full h-full fill-current block"
                                        style={{ color: card.waveColor }}
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M0,45 C320,105 640,-15 960,75 C1200,115 1380,45 1440,65 V200 H0 Z"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Card Bottom Solid Color Content */}
                            <div className="pt-4 pb-4 px-4 sm:px-5 flex flex-col justify-start min-h-[140px] text-white">
                                <span className="text-[11px] font-bold tracking-widest text-white/80 uppercase mb-0.5">
                                    {card.subtitle}
                                </span>
                                <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight leading-snug mb-2">
                                    {card.title}
                                </h3>
                                <p className="text-xs sm:text-sm font-medium text-white/95 leading-relaxed">
                                    {card.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-4 pt-1">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => scrollTo('left')}
                        className="p-2.5 rounded-full bg-slate-900 text-white hover:bg-[#c89211] transition-colors flex items-center justify-center border border-slate-700 cursor-pointer"
                        aria-label="Previous slide"
                    >
                        <ArrowLeft size={16} weight="bold" />
                    </button>
                    <button
                        onClick={() => scrollTo('right')}
                        className="p-2.5 rounded-full bg-slate-900 text-white hover:bg-[#c89211] transition-colors flex items-center justify-center border border-slate-700 cursor-pointer"
                        aria-label="Next slide"
                    >
                        <ArrowRight size={16} weight="bold" />
                    </button>
                </div>
            </div>
        </div>
    );
}
