'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import Link from 'next/link';

interface ServiceCard {
    id: string;
    title: string;
    description: string;
    href: string;
    image: string;
    bgColor: string;
    borderColor: string;
    waveColor: string;
}

const SERVICE_CARDS: ServiceCard[] = [
    {
        id: 'dining-cafe',
        title: 'CAMPUS DINING & CAFÉ',
        description: 'Fresh artisan coffee, hot breakfast, daily chef specials, and halal/vegan options.',
        href: '/student-life/cafe',
        image: '/images/hospitality-tourism.jpg',
        bgColor: 'bg-[#f57c00]', // Vibrant warm orange
        borderColor: 'border-[#f57c00]',
        waveColor: '#964b00',
    },
    {
        id: 'bookstore-supplies',
        title: 'BOOKSTORE & TECH SUPPLIES',
        description: 'Course textbooks, design supplies, digital electronics, and official Cannoga gear.',
        href: '#',
        image: 'https://i.pinimg.com/736x/12/5c/15/125c15265f92b5d4dd27c1bf051fc3ec.jpg',
        bgColor: 'bg-[#0088dd]', // Vibrant electric blue
        borderColor: 'border-[#0088dd]',
        waveColor: '#004c80',
    },
    {
        id: 'health-medical',
        title: 'HEALTH & MEDICAL DESK',
        description: 'On-site nursing support, health insurance advising, and confidential wellness counseling.',
        href: '/student-guide#support',
        image: 'https://i.pinimg.com/736x/d3/b9/8e/d3b98e89679e5ca4c34400245499245b.jpg',
        bgColor: 'bg-[#4da674]', // Vibrant green
        borderColor: 'border-[#4da674]',
        waveColor: '#28583c',
    },
    {
        id: 'career-hub',
        title: 'CAREER ADVISORY HUB',
        description: 'Internship placement, resume reviews, employer networking, and co-op interview workshops.',
        href: '/careers',
        image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&auto=format&fit=crop',
        bgColor: 'bg-[#8e24aa]', // Vibrant purple
        borderColor: 'border-[#8e24aa]',
        waveColor: '#521363',
    },
];

export function CampusServicesAcademicCarousel() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 280;
        const newIndex = Math.round(container.scrollLeft / (cardWidth + 20));
        setActiveIndex(Math.min(Math.max(newIndex, 0), SERVICE_CARDS.length - 1));
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
                @keyframes waveFloatServ {
                    0%, 100% {
                        transform: translateY(10px) scaleY(1);
                    }
                    50% {
                        transform: translateY(-6px) scaleY(1.12);
                    }
                }
                @keyframes arrowFloatServ {
                    0%, 100% {
                        transform: translate(0, 0);
                    }
                    50% {
                        transform: translate(4px, -4px);
                    }
                }
                .animate-wave-serv {
                    animation: waveFloatServ 3.2s ease-in-out infinite;
                }
                .animate-arrow-serv {
                    animation: arrowFloatServ 2.2s ease-in-out infinite;
                }
            `}</style>

            {/* Scrollable Cards Track (Compact Academic Style) */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 px-1 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {SERVICE_CARDS.map((card, idx) => (
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
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 640px) 270px, 360px"
                                />

                                {/* Organic Wavy Edge overlay at bottom of image */}
                                <div
                                    className="absolute bottom-[-16px] left-0 right-0 h-12 sm:h-16 overflow-hidden leading-none z-10 pointer-events-none animate-wave-serv"
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
                                        Learn More &rarr;
                                    </span>
                                    <div
                                        className="shrink-0 animate-arrow-serv group-hover:scale-110 transition-transform"
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
                    {SERVICE_CARDS.map((_, idx) => (
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
