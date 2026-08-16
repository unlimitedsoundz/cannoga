'use client';

import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import { Link } from '@/components/ui/Link';

interface AdmissionsQuickLinkItem {
    id: string;
    title: string;
    description: string;
    href: string;
    isExternal?: boolean;
    bgColor: string;
    borderColor: string;
    waveColor: string;
}

const ADMISSIONS_QUICK_LINKS: AdmissionsQuickLinkItem[] = [
    {
        id: 'start-application',
        title: 'START APPLICATION',
        description: 'Begin your 2026 application for Bachelor’s, Master’s, Diploma, or Certificate programs at Cannoga College.',
        href: '/portal/apply',
        bgColor: 'bg-[#6366f1]', // Electric Indigo
        borderColor: 'border-[#6366f1]',
        waveColor: '#4f46e5',
    },
    {
        id: 'pay-fees',
        title: 'PAY YOUR FEES',
        description: 'Secure your enrollment, pay program tuition deposits, and generate your official Provincial Attestation Letter (PAL).',
        href: '/portal/dashboard',
        bgColor: 'bg-[#ec4899]', // Vibrant Hot Pink
        borderColor: 'border-[#ec4899]',
        waveColor: '#db2777',
    },
    {
        id: 'study-in-canada-ircc',
        title: 'STUDY IN CANADA (IRCC)',
        description: 'Official Government of Canada resources, student visa requirements, post-graduate work permits, and immigration guides.',
        href: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html',
        isExternal: true,
        bgColor: 'bg-[#10b981]', // Electric Emerald
        borderColor: 'border-[#10b981]',
        waveColor: '#059669',
    },
    {
        id: 'study-permit-guide',
        title: 'STUDY PERMIT GUIDE',
        description: 'Step-by-step checklist to prepare documentation and apply for your Canadian international study permit.',
        href: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/apply.html',
        isExternal: true,
        bgColor: 'bg-[#f97316]', // Vibrant Orange
        borderColor: 'border-[#f97316]',
        waveColor: '#ea580c',
    },
];

export function AdmissionsQuickLinksCarousel() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 350;
        const newIndex = Math.round(container.scrollLeft / (cardWidth + 24));
        setActiveIndex(Math.min(Math.max(newIndex, 0), ADMISSIONS_QUICK_LINKS.length - 1));
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
                @keyframes waveFloatAdmissions {
                    0%, 100% {
                        transform: translateY(8px) scaleY(1);
                    }
                    50% {
                        transform: translateY(-6px) scaleY(1.1);
                    }
                }
                @keyframes arrowFloatAdmissions {
                    0%, 100% {
                        transform: translate(0, 0);
                    }
                    50% {
                        transform: translate(5px, -5px);
                    }
                }
                .animate-wave-admissions {
                    animation: waveFloatAdmissions 3.4s ease-in-out infinite;
                }
                .animate-arrow-admissions {
                    animation: arrowFloatAdmissions 2.2s ease-in-out infinite;
                }
            `}</style>

            {/* Scrollable Cards Track */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 px-1 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {ADMISSIONS_QUICK_LINKS.map((card, idx) => (
                    <div
                        key={card.id}
                        className="snap-start shrink-0 w-[300px] sm:w-[380px] md:w-[440px] flex flex-col no-underline"
                    >
                        {card.isExternal ? (
                            <a
                                href={card.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`block w-full p-6 sm:p-8 rounded-md ${card.bgColor} ${card.borderColor} border-4 no-underline overflow-hidden relative min-h-[240px] sm:min-h-[270px] flex flex-col justify-between group cursor-pointer  transition-all duration-300`}
                            >
                                {/* Card Content Header */}
                                <div className="relative z-20">
                                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-[1.05]">
                                        {card.title}
                                    </h3>
                                </div>

                                {/* Card Bottom Description & Arrow Icon */}
                                <div className="relative z-20 pt-6 flex items-end justify-between gap-4 text-white">
                                    <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed max-w-[85%] font-sans">
                                        {card.description}
                                    </p>

                                    <div
                                        className="shrink-0 mb-0.5 animate-arrow-admissions"
                                        style={{ animationDelay: `${idx * 0.4}s` }}
                                    >
                                        <ArrowUpRight size={38} weight="bold" className="text-white" />
                                    </div>
                                </div>
                            </a>
                        ) : (
                            <Link
                                linkComponentProps={{ href: card.href }}
                                className={`block w-full p-6 sm:p-8 rounded-md ${card.bgColor} ${card.borderColor} border-4 no-underline overflow-hidden relative min-h-[240px] sm:min-h-[270px] flex flex-col justify-between group cursor-pointer  transition-all duration-300`}
                            >
                                {/* Card Content Header */}
                                <div className="relative z-20">
                                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-[1.05]">
                                        {card.title}
                                    </h3>
                                </div>

                                {/* Card Bottom Description & Arrow Icon */}
                                <div className="relative z-20 pt-6 flex items-end justify-between gap-4 text-white">
                                    <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed max-w-[85%] font-sans">
                                        {card.description}
                                    </p>

                                    <div
                                        className="shrink-0 mb-0.5 animate-arrow-admissions"
                                        style={{ animationDelay: `${idx * 0.4}s` }}
                                    >
                                        <ArrowUpRight size={38} weight="bold" className="text-white" />
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            {/* Navigation Controls below the carousel */}
            <div className="flex items-center justify-between mt-6 pt-2">
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
                    {ADMISSIONS_QUICK_LINKS.map((_, idx) => (
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
