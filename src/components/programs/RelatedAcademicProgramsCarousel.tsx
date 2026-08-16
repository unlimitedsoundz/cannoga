'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import Link from 'next/link';

export interface RelatedProgramItem {
    id: string;
    title: string;
    slug: string;
    degreeLevel?: string;
    duration?: string;
    description?: string;
    schoolSlug?: string;
    imageUrl?: string;
}

interface RelatedAcademicProgramsCarouselProps {
    programs: RelatedProgramItem[];
    title?: string;
    subtitle?: string;
}

const PROGRAM_COLOR_PALETTES = [
    { bgColor: 'bg-[#2563eb]', borderColor: 'border-[#2563eb]', waveColor: '#1d4ed8' }, // Blue
    { bgColor: 'bg-[#6366f1]', borderColor: 'border-[#6366f1]', waveColor: '#3730a3' }, // Indigo
    { bgColor: 'bg-[#ec4899]', borderColor: 'border-[#ec4899]', waveColor: '#831843' }, // Hot Pink
    { bgColor: 'bg-[#06b6d4]', borderColor: 'border-[#06b6d4]', waveColor: '#164e63' }, // Cyan
    { bgColor: 'bg-[#10b981]', borderColor: 'border-[#10b981]', waveColor: '#064e3b' }, // Emerald
    { bgColor: 'bg-[#f97316]', borderColor: 'border-[#f97316]', waveColor: '#7c2d12' }, // Bright Orange
    { bgColor: 'bg-[#8b5cf6]', borderColor: 'border-[#8b5cf6]', waveColor: '#4c1d95' }, // Deep Purple
    { bgColor: 'bg-[#eab308]', borderColor: 'border-[#eab308]', waveColor: '#713f12' }, // Yellow
];

function getProgramImage(schoolSlug?: string, slug?: string, customImage?: string): string {
    if (customImage) return customImage;
    const s = (schoolSlug || slug || '').toLowerCase();
    if (s.includes('business') || s.includes('finance') || s.includes('accounting') || s.includes('marketing') || s.includes('management')) {
        return '/images/studies-hero.jpg';
    }
    if (s.includes('tech') || s.includes('computer') || s.includes('ai') || s.includes('cyber') || s.includes('engineering')) {
        return '/images/technology.jpg';
    }
    if (s.includes('health') || s.includes('nursing') || s.includes('biomed') || s.includes('kinesiology') || s.includes('dental')) {
        return '/images/health-community.jpg';
    }
    if (s.includes('science') || s.includes('math') || s.includes('physics') || s.includes('env')) {
        return '/images/school-of-science-hero.jpg';
    }
    if (s.includes('transport') || s.includes('aviation') || s.includes('flight') || s.includes('automotive')) {
        return '/images/transportation-aviation.jpg';
    }
    if (s.includes('hospitality') || s.includes('tourism') || s.includes('culinary') || s.includes('hotel')) {
        return '/images/hospitality-tourism.jpg';
    }
    if (s.includes('education') || s.includes('social') || s.includes('child') || s.includes('psychology')) {
        return '/images/education-social-sciences.jpg';
    }
    return '/images/arts-design.jpg';
}

export function RelatedAcademicProgramsCarousel({
    programs,
    title = 'Related Academic Programs',
    subtitle = 'Explore other accredited credentials and specializations at Cannoga College.',
}: RelatedAcademicProgramsCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    if (!programs || programs.length === 0) return null;

    const cards = programs.map((p, idx) => {
        const palette = PROGRAM_COLOR_PALETTES[idx % PROGRAM_COLOR_PALETTES.length];
        return {
            id: p.id || p.slug,
            title: p.title,
            slug: p.slug,
            href: `/studies/${p.slug}/`,
            degreeLevel: p.degreeLevel || 'Ontario College Credential',
            duration: p.duration || '2 Years',
            image: getProgramImage(p.schoolSlug, p.slug, p.imageUrl),
            bgColor: palette.bgColor,
            borderColor: palette.borderColor,
            waveColor: palette.waveColor,
        };
    });

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 320;
        const newIndex = Math.round(container.scrollLeft / (cardWidth + 24));
        setActiveIndex(Math.min(Math.max(newIndex, 0), cards.length - 1));
    };

    const scrollTo = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 320;
        const scrollAmount = cardWidth + 24;
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    return (
        <div className="w-full">
            <style jsx>{`
                @keyframes waveFloatProg {
                    0%, 100% {
                        transform: translateY(12px) scaleY(1);
                    }
                    50% {
                        transform: translateY(-8px) scaleY(1.12);
                    }
                }
                @keyframes arrowFloatProg {
                    0%, 100% {
                        transform: translate(0, 0);
                    }
                    50% {
                        transform: translate(5px, -5px);
                    }
                }
                .animate-wave-prog {
                    animation: waveFloatProg 3.4s ease-in-out infinite;
                }
                .animate-arrow-prog {
                    animation: arrowFloatProg 2.2s ease-in-out infinite;
                }
            `}</style>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
                            {subtitle}
                        </p>
                    )}
                </div>
                <Link
                    href="/studies/"
                    className="hidden sm:inline-flex items-center gap-1 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 hover:text-sky-700 underline"
                >
                    <span>View All Programs</span>
                    <span>&rarr;</span>
                </Link>
            </div>

            {/* Scrollable Cards Track */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 px-1 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {cards.map((card, idx) => (
                    <div
                        key={card.id}
                        className="snap-start shrink-0 w-[300px] sm:w-[380px] md:w-[440px] flex flex-col no-underline"
                    >
                        <Link
                            href={card.href}
                            className={`block w-full p-3 sm:p-4 rounded-md ${card.bgColor} ${card.borderColor} border-4 no-underline overflow-hidden transition-transform hover:-translate-y-1 duration-200`}
                        >
                            {/* Card Top Image with Animated Wavy Cutout */}
                            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-sm bg-black/10">
                                <Image
                                    src={card.image}
                                    alt={card.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 300px, (max-width: 768px) 380px, 440px"
                                />

                                {/* Organic Wavy Edge overlay at BOTTOM of image */}
                                <div
                                    className="absolute bottom-[-24px] left-0 right-0 h-16 sm:h-20 overflow-hidden leading-none z-10 pointer-events-none animate-wave-prog"
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
                            <div className="pt-6 pb-3 px-3 sm:px-5 flex items-end justify-between gap-4 min-h-[140px] sm:min-h-[160px] text-white">
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-[1.05] flex-1">
                                    {card.title}
                                </h3>

                                {/* Thick Arrow Icon in Bottom Right */}
                                <div
                                    className="shrink-0 mb-1 animate-arrow-prog"
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
                    {cards.map((_, idx) => (
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
