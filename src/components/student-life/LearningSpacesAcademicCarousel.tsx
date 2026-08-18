'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import Link from 'next/link';

interface LearningSpaceCard {
    id: string;
    title: string;
    description: string;
    href: string;
    image: string;
    bgColor: string;
    borderColor: string;
    waveColor: string;
}

const LEARNING_SPACE_CARDS: LearningSpaceCard[] = [
    {
        id: 'labs-workshops',
        title: 'LABS & WORKSHOPS',
        description: 'High-performance computing clusters, robotics testbeds, electronics benches, and rapid prototyping kits.',
        href: '/schools/technology',
        image: 'https://i.pinimg.com/736x/cd/f7/c1/cdf7c142057a51bf96a072f725d460ea.jpg',
        bgColor: 'bg-[#0088dd]', // Electric Blue
        borderColor: 'border-[#0088dd]',
        waveColor: '#004c80',
    },
    {
        id: 'collaborative-studios',
        title: 'COLLABORATIVE STUDIOS',
        description: 'Open architecture drafting spaces, digital media editing suites, and multidisciplinary design bays.',
        href: '/schools/arts-design',
        image: 'https://i.pinimg.com/1200x/84/a4/21/84a421a4a2e279978309e91023400d23.jpg',
        bgColor: 'bg-[#8e24aa]', // Deep Purple
        borderColor: 'border-[#8e24aa]',
        waveColor: '#521363',
    },
    {
        id: 'quiet-study',
        title: 'QUIET STUDY ZONES',
        description: 'Acoustically isolated study cubicles, presentation rehearsal rooms, and comfortable reading pods.',
        href: '/student-guide#support',
        image: 'https://i.pinimg.com/736x/8f/f0/39/8ff039189a6f5191e341afbc0102e750.jpg',
        bgColor: 'bg-[#4da674]', // Emerald Green
        borderColor: 'border-[#4da674]',
        waveColor: '#28583c',
    },
    {
        id: 'research-commons',
        title: 'RESEARCH COMMONS',
        description: 'Digital research data repositories, capstone workspaces, and faculty mentorship lounges.',
        href: '/research',
        image: 'https://i.pinimg.com/736x/10/84/9c/10849c6fb5d9eced68c33c50b0a5fecd.jpg',
        bgColor: 'bg-[#f57c00]', // Warm Orange
        borderColor: 'border-[#f57c00]',
        waveColor: '#964b00',
    },
];

export function LearningSpacesAcademicCarousel() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 280;
        const newIndex = Math.round(container.scrollLeft / (cardWidth + 20));
        setActiveIndex(Math.min(Math.max(newIndex, 0), LEARNING_SPACE_CARDS.length - 1));
    };

    const scrollTo = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const scrollAmount = (container.firstElementChild?.clientWidth || 280) + 20;
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    return (
        <div className="relative w-full">
            <style jsx>{`
                @keyframes waveFloatLearn {
                    0%, 100% {
                        transform: translateY(10px) scaleY(1);
                    }
                    50% {
                        transform: translateY(-6px) scaleY(1.12);
                    }
                }
                @keyframes arrowFloatLearn {
                    0%, 100% {
                        transform: translate(0, 0);
                    }
                    50% {
                        transform: translate(4px, -4px);
                    }
                }
                .animate-wave-learn {
                    animation: waveFloatLearn 3.2s ease-in-out infinite;
                }
                .animate-arrow-learn {
                    animation: arrowFloatLearn 2.2s ease-in-out infinite;
                }
            `}</style>

            {/* Scrollable Cards Track (Compact Academic Style) */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 px-1 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {LEARNING_SPACE_CARDS.map((card, idx) => (
                    <div
                        key={card.id}
                        className="snap-start shrink-0 w-[270px] sm:w-[320px] md:w-[360px] flex flex-col no-underline"
                    >
                        <Link
                            href={card.href}
                            className={`block w-full p-2.5 sm:p-3 rounded-md ${card.bgColor} ${card.borderColor} border-4 no-underline overflow-hidden group`}
                        >
                            {/* Card Top Image with Animated Organic Wavy Cutout */}
                            <div className="relative aspect-[16/11] w-full overflow-hidden rounded-sm bg-black/10">
                                <Image
                                    src={card.image}
                                    alt={card.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 270px, 360px"
                                />

                                {/* Organic Wavy Edge overlay at bottom of image */}
                                <div
                                    className="absolute bottom-[-16px] left-0 right-0 h-12 sm:h-16 overflow-hidden leading-none z-10 pointer-events-none animate-wave-learn"
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
                            <div className="pt-4 pb-2 px-3 sm:px-4 flex flex-col justify-between min-h-[140px] text-white">
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-[1.08] mb-1.5">
                                        {card.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm font-medium text-white/95 leading-relaxed line-clamp-2">
                                        {card.description}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-3 mt-1 border-t border-white/20">
                                    <span className="text-[11px] font-black uppercase tracking-wider text-white">
                                        Explore Space &rarr;
                                    </span>
                                    <div
                                        className="shrink-0 animate-arrow-learn group-hover:scale-110 transition-transform"
                                        style={{ animationDelay: `${idx * 0.35}s` }}
                                    >
                                        <ArrowUpRight size={26} weight="bold" className="text-white" />
                                    </div>
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
                        className="p-2.5 rounded-full bg-slate-900 text-white hover:bg-[#c89211] transition-colors flex items-center justify-center border border-slate-700"
                        aria-label="Previous slide"
                    >
                        <ArrowLeft size={16} weight="bold" />
                    </button>
                    <button
                        onClick={() => scrollTo('right')}
                        className="p-2.5 rounded-full bg-slate-900 text-white hover:bg-[#c89211] transition-colors flex items-center justify-center border border-slate-700"
                        aria-label="Next slide"
                    >
                        <ArrowRight size={16} weight="bold" />
                    </button>
                </div>

                {/* Dot Indicators */}
                <div className="flex gap-1.5">
                    {LEARNING_SPACE_CARDS.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-2 transition-all rounded-full ${
                                idx === activeIndex ? 'w-6 bg-[#0a151a]' : 'w-2 bg-slate-300'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
