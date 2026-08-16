'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "@phosphor-icons/react";

interface Peer {
    id: number;
    name: string;
    firstName: string;
    country: string;
    flag: string;
    programme: string;
    image: string;
    quote: string;
    cardBgClass: string;
    imagePosition?: string;
    storyUrl?: string;
    buttonText?: string;
}

const peers: Peer[] = [
    {
        id: 3,
        name: "Chinaza Kamsiyochukwu",
        firstName: "CHINAZA",
        country: "NIGERIA",
        flag: "🇳🇬",
        programme: "Honours Bachelor of Environmental Science",
        image: "https://i.pinimg.com/1200x/72/a1/7c/72a17cb6e8bda24fd421065e8ad24296.jpg",
        quote: "My study abroad journey in Ottawa, Ontario, Canada has been a rollercoaster of emotions, challenges, and growth.",
        cardBgClass: "bg-[#e11d48] hover:bg-[#be123c]",
        storyUrl: "https://ourblogs.cannogacollege.ca/study-abroad-journey-ottawa,%20canada",
        buttonText: "Read Full Story",
    },
    {
        id: 4,
        name: "Collins Huang",
        firstName: "HUANG",
        country: "TAIWAN",
        flag: "🇹🇼",
        programme: "Bachelor's in International Business",
        image: "/images/collins-huang.jpg",
        quote: "Earn while you learn. The co-op program allowed me to gain real Canadian work experience in Ottawa's top firms.",
        cardBgClass: "bg-[#7c3aed] hover:bg-[#6d28d9]",
    },
    {
        id: 5,
        name: "Maria Petrova",
        firstName: "MARIA",
        country: "UKRAINE",
        flag: "🇺🇦",
        programme: "Master's in Design Management",
        image: "/images/student-story-2.jpg",
        quote: "Studying in Ottawa has been life-changing. Collaborative research and welcoming community at Cannoga are truly world-class.",
        cardBgClass: "bg-[#d97706] hover:bg-[#b45309]",
    },
    {
        id: 6,
        name: "Sergei Voldov",
        firstName: "SERGEI",
        country: "RUSSIA",
        flag: "🇷🇺",
        programme: "Advanced Diploma in Software Engineering",
        image: "/images/student-story-4.jpg",
        quote: "The practical coding labs helped me land a full-time software engineering offer in Ottawa's tech hub before graduation.",
        cardBgClass: "bg-[#2563eb] hover:bg-[#1d4ed8]",
    }
];

export default function StudentStoriesCarousel() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeCardId, setActiveCardId] = useState<number | null>(null);

    // Close open card overlay when clicking outside the carousel component
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setActiveCardId(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
        }
    };

    return (
        <div ref={containerRef} className="w-full relative">
            <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
                
                {/* Left Side Static Title Section */}
                <div className="w-full lg:w-[360px] shrink-0 flex flex-col justify-between py-2">
                    <div>
                        {/* Bold Vertical Heading */}
                        <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#1b2a4a] leading-[0.88] uppercase font-sans mb-6">
                            FIND<br />YOUR<br />PEOPLE
                        </h2>
                    </div>

                    {/* Left / Right Arrow Navigation Controls */}
                    <div className="flex items-center gap-3 pt-4">
                        <button
                            onClick={scrollLeft}
                            className="p-3 rounded-full bg-slate-900 text-white hover:bg-[#c89211] transition-colors flex items-center justify-center border border-slate-700"
                            aria-label="Scroll previous student"
                        >
                            <ArrowLeft size={20} weight="bold" />
                        </button>
                        <button
                            onClick={scrollRight}
                            className="p-3 rounded-full bg-slate-900 text-white hover:bg-[#c89211] transition-colors flex items-center justify-center border border-slate-700"
                            aria-label="Scroll next student"
                        >
                            <ArrowRight size={20} weight="bold" />
                        </button>
                    </div>
                </div>

                {/* Right Side Cards Horizontal Carousel */}
                <div className="flex-1 min-w-0">
                    <div 
                        ref={scrollRef}
                        className="flex gap-5 sm:gap-6 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {peers.map((peer) => {
                            const isOpen = activeCardId === peer.id;
                            return (
                                <div
                                    key={peer.id}
                                    onClick={() => setActiveCardId(isOpen ? null : peer.id)}
                                    className="w-[350px] sm:w-[350px] h-[380px] sm:h-[440px] shrink-0 relative overflow-hidden group rounded-none transition-all duration-300 cursor-pointer snap-start"
                                >
                                    {/* Background Image */}
                                    <Image
                                        src={peer.image}
                                        alt={peer.name}
                                        fill
                                        className={`object-cover transition-transform duration-700 ${peer.imagePosition || 'object-center'} ${isOpen ? 'scale-105 filter brightness-75' : 'group-hover:scale-105'}`}
                                        sizes="(max-width: 768px) 350px, 350px"
                                    />

                                    {/* Top Gradient & Student Origin Banner */}
                                    <div className="absolute top-0 inset-x-0 z-10 p-5 bg-gradient-to-b from-black/85 via-black/40 to-transparent">
                                        <span className="text-xs sm:text-sm font-black tracking-wider text-white uppercase font-sans">
                                            STUDENT FROM {peer.country}
                                        </span>
                                    </div>

                                    {/* Bottom / Sliding Up Full Height Panel */}
                                    <div
                                        className={`absolute inset-x-0 bottom-0 z-20 ${peer.cardBgClass} text-white transition-all duration-500 ease-out flex flex-col justify-between ${
                                            isOpen ? 'h-full p-6 sm:p-7 pt-14' : 'min-h-[96px] sm:min-h-[110px] p-4 sm:p-5'
                                        }`}
                                    >
                                        {/* Header area in slider */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <span className={`font-black uppercase tracking-tighter leading-[0.9] font-sans block transition-all ${
                                                    isOpen ? 'text-xl sm:text-2xl md:text-3xl' : 'text-3xl sm:text-4xl md:text-5xl'
                                                }`}>
                                                    {isOpen ? peer.name : `MEET ${peer.firstName}`}
                                                </span>
                                                {isOpen && (
                                                    <span className="text-xs font-bold text-white/80 uppercase tracking-wider block mt-1">
                                                        {peer.programme}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="shrink-0 p-1">
                                                {isOpen ? (
                                                    <X size={28} weight="bold" className="text-white" />
                                                ) : (
                                                    <ArrowUpRight size={32} weight="bold" className="text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Testimonial body content revealed when slid up */}
                                        {isOpen && (
                                            <div className="flex flex-col justify-between flex-1 mt-4 pt-4 border-t border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                                <p className="text-white/95 text-base sm:text-lg leading-relaxed italic font-serif my-auto">
                                                    "{peer.quote}"
                                                </p>
                                                <a
                                                    href={peer.storyUrl || "/student-guide"}
                                                    target={peer.storyUrl?.startsWith('http') ? "_blank" : undefined}
                                                    rel={peer.storyUrl?.startsWith('http') ? "noopener noreferrer" : undefined}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="inline-flex items-center justify-center w-full bg-white text-slate-900 font-black text-xs uppercase tracking-wider py-3 px-4 rounded-sm transition-colors hover:bg-slate-100 no-underline gap-2 mt-4"
                                                >
                                                    {peer.buttonText || "Read Full Student Guide"} <ArrowUpRight size={16} weight="bold" />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
