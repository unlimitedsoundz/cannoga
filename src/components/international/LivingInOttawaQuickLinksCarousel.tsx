'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';

interface QuickLinkCardItem {
    id: string;
    title: string;
    description: string;
    href: string;
    isExternal?: boolean;
    bgColor: string;
    borderColor: string;
    waveColor: string;
}

const LIVING_CARDS: QuickLinkCardItem[] = [
    {
        id: 'health-uhip',
        title: 'STUDENT HEALTH CARE & UHIP',
        description: 'All international students in Ontario are covered by the University Health Insurance Plan (UHIP) for 100% medical, clinic, and hospital care, plus on-campus counseling and nursing triage.',
        href: '/student-guide/health-and-wellbeing/',
        bgColor: 'bg-[#0088dd]', // Electric Blue
        borderColor: 'border-[#0088dd]',
        waveColor: '#005596',
    },
    {
        id: 'local-culture',
        title: 'LOCAL CULTURE',
        description: 'Ottawa is bilingual (English & French), diverse, and welcoming. It’s one of the world’s safest cities with a vibrant arts scene, national museums, and four distinct seasons.',
        href: '/student-life/',
        bgColor: 'bg-[#8e24aa]', // Deep Purple / Violet
        borderColor: 'border-[#8e24aa]',
        waveColor: '#521363',
    },
    {
        id: 'working-while-studying',
        title: 'WORKING WHILE STUDYING',
        description: 'Your Canadian study permit allows you to work up to 30 hours/week during term time (full-time during holidays). Many local employers actively recruit Cannoga students.',
        href: '/careers/',
        bgColor: 'bg-[#10b981]', // Electric Emerald
        borderColor: 'border-[#10b981]',
        waveColor: '#059669',
    },
    {
        id: 'language-careers',
        title: 'LANGUAGE & CAREERS',
        description: 'Cannoga’s Career Centre offers job boards, resume workshops, internships, and networking events with Ottawa’s tech, government, and business sectors.',
        href: '/careers/',
        bgColor: 'bg-[#f97316]', // Vibrant Orange
        borderColor: 'border-[#f97316]',
        waveColor: '#ea580c',
    },
];

export function LivingInOttawaQuickLinksCarousel() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 320;
        const newIndex = Math.round(container.scrollLeft / (cardWidth + 24));
        setActiveIndex(Math.min(Math.max(newIndex, 0), LIVING_CARDS.length - 1));
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
        <div className="relative w-full">
            <style jsx>{`
                @keyframes waveFloatLiving {
                    0%, 100% {
                        transform: translateY(8px) scaleY(1);
                    }
                    50% {
                        transform: translateY(-6px) scaleY(1.1);
                    }
                }
                @keyframes arrowFloatLiving {
                    0%, 100% {
                        transform: translate(0, 0);
                    }
                    50% {
                        transform: translate(4px, -4px);
                    }
                }
                .animate-wave-living {
                    animation: waveFloatLiving 3.4s ease-in-out infinite;
                }
                .animate-arrow-living {
                    animation: arrowFloatLiving 2.2s ease-in-out infinite;
                }
            `}</style>

            {/* Scrollable Cards Track */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 px-1 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {LIVING_CARDS.map((card, idx) => {
                    const cardContent = (
                        <div
                            className={`block w-full p-6 sm:p-7 rounded-md ${card.bgColor} ${card.borderColor} border-4 no-underline overflow-hidden relative min-h-[250px] sm:min-h-[270px] flex flex-col justify-between group cursor-pointer`}
                        >
                            {/* Organic Wavy Background Element */}
                            <div
                                className="absolute bottom-0 left-0 right-0 h-24 sm:h-28 overflow-hidden leading-none z-10 pointer-events-none animate-wave-living"
                                style={{ animationDelay: `${idx * 0.4}s` }}
                            >
                                <svg
                                    viewBox="0 0 1440 320"
                                    preserveAspectRatio="none"
                                    className="w-full h-full fill-current block opacity-40"
                                    style={{ color: card.waveColor }}
                                >
                                    <path
                                        fill="currentColor"
                                        d="M0,160 C320,300 480,40 800,180 C1120,320 1280,100 1440,200 V320 H0 Z"
                                    />
                                </svg>
                            </div>

                            {/* Card Content Header */}
                            <div className="relative z-20">
                                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-[1.08]">
                                    {card.title}
                                </h3>
                            </div>

                            {/* Card Bottom Description & Action Icon */}
                            <div className="relative z-20 pt-6 flex items-end justify-between gap-4 text-white">
                                <p className="text-xs sm:text-sm font-medium text-white/95 leading-relaxed max-w-[85%] font-sans">
                                    {card.description}
                                </p>

                                <div
                                    className="shrink-0 mb-0.5 animate-arrow-living"
                                    style={{ animationDelay: `${idx * 0.4}s` }}
                                >
                                    <ArrowUpRight size={32} weight="bold" className="text-white" />
                                </div>
                            </div>
                        </div>
                    );

                    return (
                        <div
                            key={card.id}
                            className="snap-start shrink-0 w-[270px] sm:w-[330px] md:w-[360px] flex flex-col no-underline"
                        >
                            {card.isExternal ? (
                                <a
                                    href={card.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block no-underline"
                                >
                                    {cardContent}
                                </a>
                            ) : (
                                <Link href={card.href} className="block no-underline">
                                    {cardContent}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Navigation Controls below the carousel */}
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
