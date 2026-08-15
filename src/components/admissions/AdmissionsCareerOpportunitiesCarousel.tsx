'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import { Link } from '@/components/ui/Link';

interface CareerCardItem {
    id: string;
    title: string;
    description: string;
    href: string;
    image: string;
    bgColor: string;
    borderColor: string;
    waveColor: string;
}

const CAREER_CARDS: CareerCardItem[] = [
    {
        id: 'industry-collaboration',
        title: 'INDUSTRY COLLABORATION',
        description: 'Work on real-world projects and applied research with our global partners and tech leaders.',
        href: '/careers',
        image: '/images/018a4f1509eeb2689b7d07a9cc7f89ba.jpg',
        bgColor: 'bg-[#6366f1]', // Electric Indigo
        borderColor: 'border-[#6366f1]',
        waveColor: '#3730a3',
    },
    {
        id: 'alumni-networks',
        title: 'ALUMNI NETWORKS',
        description: 'Connect with successful graduates working in leading industries across Ottawa and worldwide.',
        href: '/careers',
        image: '/images/81bf468416f63752a8a72ca7896666ab.jpg',
        bgColor: 'bg-[#ec4899]', // Vibrant Hot Pink
        borderColor: 'border-[#ec4899]',
        waveColor: '#831843',
    },
    {
        id: 'career-services',
        title: 'CAREER & CO-OP SERVICES',
        description: 'Personalized career coaching, resume workshops, co-op placement, and employer networking events.',
        href: '/careers',
        image: '/images/f845f2f0c16fa812a425753a4b26328a.jpg',
        bgColor: 'bg-[#10b981]', // Electric Emerald
        borderColor: 'border-[#10b981]',
        waveColor: '#064e3b',
    },
    {
        id: 'internships-placements',
        title: 'WORK INTEGRATED LEARNING',
        description: 'Gain paid workplace experience, practicum hours, and direct pathway to full-time employment.',
        href: '/careers',
        image: '/images/studies-hero.jpg',
        bgColor: 'bg-[#f97316]', // Vibrant Orange
        borderColor: 'border-[#f97316]',
        waveColor: '#7c2d12',
    },
];

export function AdmissionsCareerOpportunitiesCarousel() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 350;
        const newIndex = Math.round(container.scrollLeft / (cardWidth + 24));
        setActiveIndex(Math.min(Math.max(newIndex, 0), CAREER_CARDS.length - 1));
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
                @keyframes waveFloatCareer {
                    0%, 100% {
                        transform: translateY(12px) scaleY(1);
                    }
                    50% {
                        transform: translateY(-8px) scaleY(1.12);
                    }
                }
                @keyframes arrowFloatCareer {
                    0%, 100% {
                        transform: translate(0, 0);
                    }
                    50% {
                        transform: translate(5px, -5px);
                    }
                }
                .animate-wave-career {
                    animation: waveFloatCareer 3.4s ease-in-out infinite;
                }
                .animate-arrow-career {
                    animation: arrowFloatCareer 2.2s ease-in-out infinite;
                }
            `}</style>

            {/* Scrollable Cards Track */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 px-1 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {CAREER_CARDS.map((card, idx) => (
                    <div
                        key={card.id}
                        className="snap-start shrink-0 w-[320px] sm:w-[420px] md:w-[460px] flex flex-col no-underline"
                    >
                        <Link
                            linkComponentProps={{ href: card.href }}
                            className={`block w-full p-3 sm:p-4 rounded-md ${card.bgColor} ${card.borderColor} border-4 no-underline overflow-hidden group hover:shadow-xl transition-all duration-300`}
                        >
                            {/* Card Top Image with Animated Wavy Cutout */}
                            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-sm bg-black/10">
                                <Image
                                    src={card.image}
                                    alt={card.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 640px) 320px, (max-width: 768px) 420px, 460px"
                                />

                                {/* Organic Wavy Edge overlay at BOTTOM of image */}
                                <div
                                    className="absolute bottom-[-24px] left-0 right-0 h-16 sm:h-24 overflow-hidden leading-none z-10 pointer-events-none animate-wave-career"
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
                            <div className="pt-6 pb-4 px-3 sm:px-5 flex flex-col justify-between min-h-[160px] sm:min-h-[180px] text-white">
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-[1.05] flex-1">
                                        {card.title}
                                    </h3>
                                    <div
                                        className="shrink-0 mt-1 animate-arrow-career"
                                        style={{ animationDelay: `${idx * 0.4}s` }}
                                    >
                                        <ArrowUpRight size={38} weight="bold" className="text-white" />
                                    </div>
                                </div>

                                <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed mt-4 font-sans">
                                    {card.description}
                                </p>
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
                    {CAREER_CARDS.map((_, idx) => (
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
