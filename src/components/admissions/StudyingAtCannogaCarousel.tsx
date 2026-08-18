'use client';

import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import { Link } from '@/components/ui/Link';

interface StudyingAtCannogaItem {
    id: string;
    title: string;
    description: string;
    href: string;
    bgColor: string;
    borderColor: string;
    waveColor: string;
}

const STUDYING_CARDS: StudyingAtCannogaItem[] = [
    {
        id: 'modern-campus',
        title: 'MODERN CAMPUS',
        description: 'State-of-the-art facilities, modern computer & design labs, study lounges, and collaborative spaces.',
        href: '/contact',
        bgColor: 'bg-[#6366f1]', // Electric Indigo
        borderColor: 'border-[#6366f1]',
        waveColor: '#4f46e5',
    },
    {
        id: 'support',
        title: 'SUPPORT',
        description: 'Dedicated academic advisors, personalized career counseling, tutoring, and student health support.',
        href: '/student-guide/health-and-wellbeing/',
        bgColor: 'bg-[#ec4899]', // Vibrant Hot Pink
        borderColor: 'border-[#ec4899]',
        waveColor: '#db2777',
    },
    {
        id: 'community',
        title: 'COMMUNITY',
        description: 'A vibrant global network representing over 60+ countries in Ottawa’s thriving tech and cultural hub.',
        href: '/student-guide/international',
        bgColor: 'bg-[#06b6d4]', // Electric Cyan
        borderColor: 'border-[#06b6d4]',
        waveColor: '#0891b2',
    },
    {
        id: 'careers',
        title: 'CAREERS',
        description: 'Co-op internships, resume workshops, executive mentoring, and direct employer hiring networks.',
        href: '/careers',
        bgColor: 'bg-[#10b981]', // Electric Emerald
        borderColor: 'border-[#10b981]',
        waveColor: '#059669',
    },
    {
        id: 'student-life',
        title: 'STUDENT LIFE',
        description: 'Student-led clubs, recreational sports, cultural events, hackathons, and Ottawa campus activities.',
        href: '/student-life',
        bgColor: 'bg-[#f97316]', // Vibrant Orange
        borderColor: 'border-[#f97316]',
        waveColor: '#ea580c',
    },
];

export function StudyingAtCannogaCarousel() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 350;
        const newIndex = Math.round(container.scrollLeft / (cardWidth + 24));
        setActiveIndex(Math.min(Math.max(newIndex, 0), STUDYING_CARDS.length - 1));
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
                @keyframes waveFloatStudying {
                    0%, 100% {
                        transform: translateY(8px) scaleY(1);
                    }
                    50% {
                        transform: translateY(-6px) scaleY(1.1);
                    }
                }
                @keyframes arrowFloatStudying {
                    0%, 100% {
                        transform: translate(0, 0);
                    }
                    50% {
                        transform: translate(5px, -5px);
                    }
                }
                .animate-wave-studying {
                    animation: waveFloatStudying 3.4s ease-in-out infinite;
                }
                .animate-arrow-studying {
                    animation: arrowFloatStudying 2.2s ease-in-out infinite;
                }
            `}</style>

            {/* Scrollable Cards Track */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 px-1 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {STUDYING_CARDS.map((card, idx) => (
                    <div
                        key={card.id}
                        className="snap-start shrink-0 w-[300px] sm:w-[380px] md:w-[420px] flex flex-col no-underline"
                    >
                        <Link
                            linkComponentProps={{ href: card.href }}
                            className={`block w-full p-6 sm:p-8 rounded-md ${card.bgColor} ${card.borderColor} border-4 no-underline overflow-hidden relative min-h-[260px] sm:min-h-[290px] flex flex-col justify-between group`}
                        >
                            {/* Card Content Header */}
                            <div className="relative z-20">
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-[1.05]">
                                    {card.title}
                                </h3>
                            </div>

                            {/* Card Bottom Description & Arrow Icon */}
                            <div className="relative z-20 pt-6 flex items-end justify-between gap-4 text-white">
                                <p className="text-xs sm:text-sm md:text-base font-medium text-white/95 leading-relaxed max-w-[82%] font-sans">
                                    {card.description}
                                </p>
                                <div className="shrink-0 mb-1 animate-arrow-studying">
                                    <ArrowUpRight
                                        size={40}
                                        weight="bold"
                                        className="text-white"
                                    />
                                </div>
                            </div>

                            {/* SVG Geometric Waves Background Layer */}
                            <div className="absolute inset-0 z-10 opacity-35 pointer-events-none overflow-hidden flex items-end">
                                <svg
                                    className="w-full h-44 animate-wave-studying"
                                    viewBox="0 0 500 150"
                                    preserveAspectRatio="none"
                                >
                                    <path
                                        d="M0.00,49.98 C149.99,150.00 349.81,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
                                        fill={card.waveColor}
                                    />
                                    <path
                                        d="M0.00,80.00 C180.00,160.00 310.00,10.00 500.00,90.00 L500.00,150.00 L0.00,150.00 Z"
                                        fill="#ffffff"
                                        fillOpacity="0.12"
                                    />
                                </svg>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Navigation Controls below the carousel */}
            <div className="flex items-center justify-between mt-8 pt-2 px-1">
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
                    {STUDYING_CARDS.map((_, idx) => (
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
