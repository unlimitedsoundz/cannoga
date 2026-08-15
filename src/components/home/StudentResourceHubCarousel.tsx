'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import { Link } from '@/components/ui/Link';

interface ResourceCardItem {
    id: string;
    title: string;
    description: string;
    href: string;
    image: string;
    bgColor: string;
    borderColor: string;
    waveColor: string;
}

const RESOURCE_CARDS: ResourceCardItem[] = [
    {
        id: 'campus-tour',
        title: 'EXPLORE CAMPUS & BOOK A TOUR',
        description: 'Guided tours of our Ottawa campus labs, student residence, and academic facilities.',
        href: '/contact',
        image: '/images/vibrant-community.png',
        bgColor: 'bg-[#6366f1]', // Electric Indigo
        borderColor: 'border-[#6366f1]',
        waveColor: '#3730a3',
    },
    {
        id: 'student-support',
        title: 'STUDENT SUPPORT & HEALTH SERVICES',
        description: 'Comprehensive health, mental wellness, accessibility, and personal advising resources.',
        href: '/student-guide#support',
        image: '/images/health-community.jpg',
        bgColor: 'bg-[#ec4899]', // Vibrant Hot Pink
        borderColor: 'border-[#ec4899]',
        waveColor: '#831843',
    },
    {
        id: 'careers',
        title: 'GRADUATE EMPLOYMENT & CAREERS',
        description: 'Direct connections with top employers, co-op hub, resume workshops, and career coaching.',
        href: '/careers',
        image: '/images/technology.jpg',
        bgColor: 'bg-[#10b981]', // Electric Emerald
        borderColor: 'border-[#10b981]',
        waveColor: '#064e3b',
    },
    {
        id: 'financial-aid',
        title: 'FINANCIAL AID & OSAP GUIDANCE',
        description: 'Explore scholarships, bursaries, work-study opportunities, and government assistance.',
        href: '/admissions/tuition',
        image: '/images/studies-hero.jpg',
        bgColor: 'bg-[#f97316]', // Vibrant Orange
        borderColor: 'border-[#f97316]',
        waveColor: '#7c2d12',
    },
    {
        id: 'admissions-req',
        title: 'ADMISSIONS & ENTRY REQUIREMENTS',
        description: 'Detailed program entry specs, prerequisite codes, and international qualification guides.',
        href: '/admissions',
        image: '/images/school-of-science-hero.jpg',
        bgColor: 'bg-[#06b6d4]', // Electric Cyan
        borderColor: 'border-[#06b6d4]',
        waveColor: '#164e63',
    },
    {
        id: 'code-of-conduct',
        title: 'STUDENT RIGHTS & CODE OF CONDUCT',
        description: 'Academic integrity, student governance, rights, regulations, and institutional policies.',
        href: '/code-of-conduct',
        image: '/images/arts-design.jpg',
        bgColor: 'bg-[#8b5cf6]', // Deep Purple
        borderColor: 'border-[#8b5cf6]',
        waveColor: '#4c1d95',
    },
];

export function StudentResourceHubCarousel() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 350;
        const newIndex = Math.round(container.scrollLeft / (cardWidth + 24));
        setActiveIndex(Math.min(Math.max(newIndex, 0), RESOURCE_CARDS.length - 1));
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
                @keyframes waveFloatHub {
                    0%, 100% {
                        transform: translateY(16px) scaleY(1);
                    }
                    50% {
                        transform: translateY(-10px) scaleY(1.15);
                    }
                }
                @keyframes arrowFloatHub {
                    0%, 100% {
                        transform: translate(0, 0);
                    }
                    50% {
                        transform: translate(5px, -5px);
                    }
                }
                .animate-wave-hub {
                    animation: waveFloatHub 3.4s ease-in-out infinite;
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
                {RESOURCE_CARDS.map((card, idx) => (
                    <div
                        key={card.id}
                        className="snap-start shrink-0 w-[350px] sm:w-[440px] md:w-[500px] flex flex-col no-underline"
                    >
                        <Link
                            linkComponentProps={{ href: card.href }}
                            className={`block w-full p-3 sm:p-4 rounded-md ${card.bgColor} ${card.borderColor} border-4 no-underline overflow-hidden`}
                        >
                            {/* Card Top Image with Animated Wavy Cutout */}
                            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-sm bg-black/10">
                                <Image
                                    src={card.image}
                                    alt={card.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 350px, (max-width: 768px) 440px, 500px"
                                />

                                {/* Organic Wavy Edge overlay at BOTTOM of image with smooth wave animation */}
                                <div
                                    className="absolute bottom-[-24px] left-0 right-0 h-16 sm:h-24 overflow-hidden leading-none z-10 pointer-events-none animate-wave-hub"
                                    style={{ animationDelay: `${idx * 0.4}s` }}
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
                            <div className="pt-6 pb-4 px-4 sm:px-6 flex items-end justify-between gap-4 min-h-[160px] sm:min-h-[190px] text-white">
                                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-[1.02] flex-1">
                                    {card.title}
                                </h3>

                                {/* Thick Arrow Icon in Bottom Right with Floating Animation */}
                                <div
                                    className="shrink-0 mb-1 animate-arrow-hub"
                                    style={{ animationDelay: `${idx * 0.4}s` }}
                                >
                                    <ArrowUpRight size={44} weight="bold" className="text-white" />
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
                    {RESOURCE_CARDS.map((_, idx) => (
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
