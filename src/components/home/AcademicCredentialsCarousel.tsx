'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import { Link } from '@/components/ui/Link';

interface CredentialCard {
    id: string;
    title: string;
    description: string;
    href: string;
    image: string;
    bgColor: string; // Tailored vibrant hex or class
    borderColor: string;
    waveColor: string; // Darker matching shade for wave edge
}

const CREDENTIAL_CARDS: CredentialCard[] = [
    {
        id: 'certificates',
        title: 'ONTARIO COLLEGE CERTIFICATES',
        description: '1-year career-focused pathways designed for rapid skill acquisition and practical workforce entry.',
        href: '/degree-programmes#certificates',
        image: '/images/technology.jpg',
        bgColor: 'bg-[#4da674]', // Vibrant green
        borderColor: 'border-[#4da674]',
        waveColor: '#28583c', // Darker green shade
    },
    {
        id: 'diplomas',
        title: 'ONTARIO COLLEGE DIPLOMAS',
        description: '2-year applied learning programs integrating hands-on labs, industry software, and co-op placement.',
        href: '/degree-programmes#diplomas',
        image: '/images/school-of-science.jpg',
        bgColor: 'bg-[#0088dd]', // Vibrant electric blue
        borderColor: 'border-[#0088dd]',
        waveColor: '#004c80', // Darker blue shade
    },
    {
        id: 'degrees',
        title: 'ADVANCED DIPLOMAS & DEGREES',
        description: "3-year advanced diplomas and 4-year Honours Bachelor's Degrees combining academic depth with co-op pathways.",
        href: '/degree-programmes',
        image: '/images/student-story-2.jpg',
        bgColor: 'bg-[#e53935]', // Vibrant bold red
        borderColor: 'border-[#e53935]',
        waveColor: '#8e1917', // Darker red shade
    },
    {
        id: 'schools',
        title: 'ACADEMIC SCHOOLS & FACULTIES',
        description: 'Eight specialized faculties delivering technology, health, business, and creative design education.',
        href: '/schools',
        image: '/images/arts-design.jpg',
        bgColor: 'bg-[#8e24aa]', // Vibrant deep purple
        borderColor: 'border-[#8e24aa]',
        waveColor: '#521363', // Darker purple shade
    },
    {
        id: 'directory',
        title: 'PROGRAM DIRECTORY A–Z',
        description: 'Browse all approved Ontario post-secondary courses, prerequisite codes, and credential specs.',
        href: '/degree-programmes#programs-az',
        image: '/images/school-of-education-social-sciences.jpg',
        bgColor: 'bg-[#f57c00]', // Vibrant warm orange
        borderColor: 'border-[#f57c00]',
        waveColor: '#964b00', // Darker burnt orange shade
    },
    {
        id: 'coop',
        title: 'OTTAWA CAMPUS & CO-OP HUB',
        description: 'Explore campus facilities, student support services, and Ottawa tech-sector co-op partnerships.',
        href: '/contact',
        image: '/images/vibrant-community.png',
        bgColor: 'bg-[#0097a7]', // Vibrant cyan teal
        borderColor: 'border-[#0097a7]',
        waveColor: '#00535c', // Darker teal shade
    },
];

export function AcademicCredentialsCarousel() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 320;
        const newIndex = Math.round(container.scrollLeft / (cardWidth + 24));
        setActiveIndex(Math.min(Math.max(newIndex, 0), CREDENTIAL_CARDS.length - 1));
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
                @keyframes waveFloat {
                    0%, 100% {
                        transform: translateY(16px) scaleY(1);
                    }
                    50% {
                        transform: translateY(-10px) scaleY(1.15);
                    }
                }
                @keyframes arrowFloat {
                    0%, 100% {
                        transform: translate(0, 0);
                    }
                    50% {
                        transform: translate(5px, -5px);
                    }
                }
                .animate-wave-element {
                    animation: waveFloat 3.4s ease-in-out infinite;
                }
                .animate-arrow-element {
                    animation: arrowFloat 2.2s ease-in-out infinite;
                }
            `}</style>

            {/* Scrollable Cards Track */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 px-1 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {CREDENTIAL_CARDS.map((card, idx) => (
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
                                    className="absolute bottom-[-24px] left-0 right-0 h-16 sm:h-24 overflow-hidden leading-none z-10 pointer-events-none animate-wave-element"
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
                                    className="shrink-0 mb-1 animate-arrow-element"
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
                    {CREDENTIAL_CARDS.map((_, idx) => (
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
