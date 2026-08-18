'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';

interface UhipCardItem {
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    href?: string;
    isExternal?: boolean;
    bgColor: string;
    borderColor: string;
    waveColor: string;
}

const UHIP_CARDS: UhipCardItem[] = [
    {
        id: 'hospital-emergency',
        title: 'HOSPITAL & EMERGENCY CARE',
        subtitle: '100% COVERED',
        description: 'Covers 100% of standard emergency hospital stays, surgical procedures, and emergency room visits across Canadian hospitals.',
        bgColor: 'bg-[#0088dd]', // Electric Blue
        borderColor: 'border-[#0088dd]',
        waveColor: '#005596',
    },
    {
        id: 'doctor-clinic',
        title: 'DOCTOR & CLINIC VISITS',
        subtitle: 'PRIMARY CARE',
        description: 'Full coverage for physician visits, specialist consultations, diagnostic lab tests, X-rays, and medical imaging in Ontario.',
        bgColor: 'bg-[#10b981]', // Electric Emerald
        borderColor: 'border-[#10b981]',
        waveColor: '#059669',
    },
    {
        id: 'prescriptions-dental',
        title: 'PRESCRIPTIONS & DENTAL',
        subtitle: 'CSA SUPPLEMENTAL',
        description: 'Cannoga Student Association (CSA) supplemental plan covers prescription drugs, basic dental care, and vision checks.',
        bgColor: 'bg-[#f97316]', // Vibrant Orange
        borderColor: 'border-[#f97316]',
        waveColor: '#ea580c',
    },
    {
        id: 'official-uhip-portal',
        title: 'OFFICIAL UHIP PORTAL',
        subtitle: 'EXTERNAL RESOURCE',
        description: 'View full policy coverage details, submission forms, and eligible network clinics directly on uhip.ca.',
        href: 'https://uhip.ca',
        isExternal: true,
        bgColor: 'bg-[#6366f1]', // Electric Indigo
        borderColor: 'border-[#6366f1]',
        waveColor: '#4f46e5',
    },
    {
        id: 'download-insurance-card',
        title: 'DOWNLOAD INSURANCE CARD',
        subtitle: 'STUDENT PORTAL',
        description: 'Log into your Cannoga Student Portal to access and download your personalized digital UHIP e-card anytime.',
        href: '/portal',
        isExternal: false,
        bgColor: 'bg-[#c89211]', // Vibrant Gold
        borderColor: 'border-[#c89211]',
        waveColor: '#8a650c',
    },
];

export function UhipQuickLinksCarousel() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 320;
        const newIndex = Math.round(container.scrollLeft / (cardWidth + 24));
        setActiveIndex(Math.min(Math.max(newIndex, 0), UHIP_CARDS.length - 1));
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
                @keyframes waveFloatUhip {
                    0%, 100% {
                        transform: translateY(8px) scaleY(1);
                    }
                    50% {
                        transform: translateY(-6px) scaleY(1.1);
                    }
                }
                @keyframes arrowFloatUhip {
                    0%, 100% {
                        transform: translate(0, 0);
                    }
                    50% {
                        transform: translate(4px, -4px);
                    }
                }
                .animate-wave-uhip {
                    animation: waveFloatUhip 3.4s ease-in-out infinite;
                }
                .animate-arrow-uhip {
                    animation: arrowFloatUhip 2.2s ease-in-out infinite;
                }
            `}</style>

            {/* Scrollable Cards Track */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 px-1 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {UHIP_CARDS.map((card, idx) => {
                    const cardContent = (
                        <div
                            className={`block w-full p-6 sm:p-7 rounded-md ${card.bgColor} ${card.borderColor} border-4 no-underline overflow-hidden relative min-h-[250px] sm:min-h-[270px] flex flex-col justify-between group cursor-pointer`}
                        >
                            {/* Organic Wavy Background Element */}
                            <div
                                className="absolute bottom-0 left-0 right-0 h-24 sm:h-28 overflow-hidden leading-none z-10 pointer-events-none animate-wave-uhip"
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
                                {card.subtitle && (
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80 block mb-1">
                                        {card.subtitle}
                                    </span>
                                )}
                                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-[1.08]">
                                    {card.title}
                                </h3>
                            </div>

                            {/* Card Bottom Description & Action Icon */}
                            <div className="relative z-20 pt-6 flex items-end justify-between gap-4 text-white">
                                <p className="text-xs sm:text-sm font-medium text-white/95 leading-relaxed max-w-[85%] font-sans">
                                    {card.description}
                                </p>

                                {card.href && (
                                    <div
                                        className="shrink-0 mb-0.5 animate-arrow-uhip"
                                        style={{ animationDelay: `${idx * 0.4}s` }}
                                    >
                                        <ArrowUpRight size={32} weight="bold" className="text-white" />
                                    </div>
                                )}
                            </div>
                        </div>
                    );

                    return (
                        <div
                            key={card.id}
                            className="snap-start shrink-0 w-[270px] sm:w-[330px] md:w-[360px] flex flex-col no-underline"
                        >
                            {card.href ? (
                                card.isExternal ? (
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
                                )
                            ) : (
                                cardContent
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
