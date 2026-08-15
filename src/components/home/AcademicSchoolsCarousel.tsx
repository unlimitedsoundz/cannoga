'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import { Link } from '@/components/ui/Link';

export interface SchoolData {
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
}

interface SchoolCardItem {
    id: string;
    title: string;
    href: string;
    image: string;
    bgColor: string;
    borderColor: string;
    waveColor: string;
}

const SCHOOL_COLOR_PALETTES = [
    { bgColor: 'bg-[#6366f1]', borderColor: 'border-[#6366f1]', waveColor: '#3730a3' }, // Electric Indigo
    { bgColor: 'bg-[#ec4899]', borderColor: 'border-[#ec4899]', waveColor: '#831843' }, // Vibrant Hot Pink
    { bgColor: 'bg-[#10b981]', borderColor: 'border-[#10b981]', waveColor: '#064e3b' }, // Electric Emerald
    { bgColor: 'bg-[#f97316]', borderColor: 'border-[#f97316]', waveColor: '#7c2d12' }, // Vibrant Bright Orange
    { bgColor: 'bg-[#06b6d4]', borderColor: 'border-[#06b6d4]', waveColor: '#164e63' }, // Electric Cyan
    { bgColor: 'bg-[#8b5cf6]', borderColor: 'border-[#8b5cf6]', waveColor: '#4c1d95' }, // Vibrant Deep Purple
    { bgColor: 'bg-[#ef4444]', borderColor: 'border-[#ef4444]', waveColor: '#7f1d1d' }, // Electric Crimson
    { bgColor: 'bg-[#84cc16]', borderColor: 'border-[#84cc16]', waveColor: '#365314' }, // Vibrant Lime Green
];

function getSchoolHeroImage(slug: string, dbImageUrl?: string): string {
    const s = slug.toLowerCase();
    if (s === 'business') return '/images/studies-hero.jpg';
    if (s === 'science' || s === 'environmental-science') return '/images/school-of-science-hero.jpg';
    if (s === 'health-community' || s === 'health-sciences') return '/images/health-community.jpg';
    if (s === 'technology' || s === 'computer-science') return '/images/technology.jpg';
    if (s === 'arts' || s === 'arts-design') return '/images/arts-design.jpg';
    if (s === 'transportation-aviation') return '/images/transportation-aviation.jpg';
    if (s === 'hospitality-tourism') return '/images/hospitality-tourism.jpg';
    if (s === 'education-social-sciences') return '/images/education-social-sciences.jpg';
    return dbImageUrl || '/images/arts-design.jpg';
}

const DEFAULT_SCHOOLS: SchoolCardItem[] = [
    {
        id: 'technology',
        title: 'SCHOOL OF TECHNOLOGY',
        href: '/schools/technology',
        image: '/images/technology.jpg',
        bgColor: 'bg-[#6366f1]',
        borderColor: 'border-[#6366f1]',
        waveColor: '#3730a3',
    },
    {
        id: 'health',
        title: 'SCHOOL OF HEALTH & COMMUNITY',
        href: '/schools/health-community',
        image: '/images/health-community.jpg',
        bgColor: 'bg-[#ec4899]',
        borderColor: 'border-[#ec4899]',
        waveColor: '#831843',
    },
    {
        id: 'business',
        title: 'SCHOOL OF BUSINESS',
        href: '/schools/business',
        image: '/images/studies-hero.jpg',
        bgColor: 'bg-[#f97316]',
        borderColor: 'border-[#f97316]',
        waveColor: '#7c2d12',
    },
    {
        id: 'arts',
        title: 'SCHOOL OF ARTS & DESIGN',
        href: '/schools/arts-design',
        image: '/images/arts-design.jpg',
        bgColor: 'bg-[#10b981]',
        borderColor: 'border-[#10b981]',
        waveColor: '#064e3b',
    },
    {
        id: 'science',
        title: 'SCHOOL OF SCIENCE & ENG.',
        href: '/schools/science',
        image: '/images/school-of-science-hero.jpg',
        bgColor: 'bg-[#06b6d4]',
        borderColor: 'border-[#06b6d4]',
        waveColor: '#164e63',
    },
    {
        id: 'transportation',
        title: 'TRANSPORTATION & AVIATION',
        href: '/schools/transportation-aviation',
        image: '/images/transportation-aviation.jpg',
        bgColor: 'bg-[#8b5cf6]',
        borderColor: 'border-[#8b5cf6]',
        waveColor: '#4c1d95',
    },
    {
        id: 'education',
        title: 'EDUCATION & SOCIAL SCIENCES',
        href: '/schools/education-social-sciences',
        image: '/images/education-social-sciences.jpg',
        bgColor: 'bg-[#ef4444]',
        borderColor: 'border-[#ef4444]',
        waveColor: '#7f1d1d',
    },
];

interface AcademicSchoolsCarouselProps {
    schools?: SchoolData[];
}

export function AcademicSchoolsCarousel({ schools }: AcademicSchoolsCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const cardsToRender: SchoolCardItem[] = (schools && schools.length > 0)
        ? schools.map((s, idx) => {
            const palette = SCHOOL_COLOR_PALETTES[idx % SCHOOL_COLOR_PALETTES.length];
            return {
                id: s.slug,
                title: s.name.toUpperCase(),
                href: `/schools/${s.slug}`,
                image: getSchoolHeroImage(s.slug, s.imageUrl),
                bgColor: palette.bgColor,
                borderColor: palette.borderColor,
                waveColor: palette.waveColor,
            };
        })
        : DEFAULT_SCHOOLS;

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 320;
        const newIndex = Math.round(container.scrollLeft / (cardWidth + 24));
        setActiveIndex(Math.min(Math.max(newIndex, 0), cardsToRender.length - 1));
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
                @keyframes waveFloatSchools {
                    0%, 100% {
                        transform: translateY(12px) scaleY(1);
                    }
                    50% {
                        transform: translateY(-8px) scaleY(1.12);
                    }
                }
                @keyframes arrowFloatSchools {
                    0%, 100% {
                        transform: translate(0, 0);
                    }
                    50% {
                        transform: translate(5px, -5px);
                    }
                }
                .animate-wave-schools {
                    animation: waveFloatSchools 3.4s ease-in-out infinite;
                }
                .animate-arrow-schools {
                    animation: arrowFloatSchools 2.2s ease-in-out infinite;
                }
            `}</style>

            {/* Scrollable Cards Track */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 px-1 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {cardsToRender.map((card, idx) => (
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
                                    className="absolute bottom-[-24px] left-0 right-0 h-16 sm:h-24 overflow-hidden leading-none z-10 pointer-events-none animate-wave-schools"
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
                                    className="shrink-0 mb-1 animate-arrow-schools"
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
                    {cardsToRender.map((_, idx) => (
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
