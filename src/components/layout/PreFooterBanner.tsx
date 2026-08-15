"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";

export function PreFooterBanner() {
    const [translateY, setTranslateY] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top < windowHeight && rect.bottom > 0) {
                const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
                setTranslateY((scrollProgress - 0.5) * 80);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section className="bg-white py-8 sm:py-12 px-4 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden">
            <div 
                ref={containerRef}
                className="w-full max-w-[1700px] mx-auto relative rounded-none md:rounded-sm overflow-hidden min-h-[520px] sm:min-h-[620px] md:min-h-[700px] flex flex-col justify-end p-6 sm:p-12 md:p-16 border border-white/10 shadow-2xl"
            >
                {/* Parallax Background Container */}
                <div 
                    className="absolute -top-20 -bottom-20 left-0 right-0 w-full h-[calc(100%+10rem)] transition-transform duration-100 ease-out will-change-transform"
                    style={{ transform: `translate3d(0, ${translateY}px, 0)` }}
                >
                    <Image
                        src="/images/start-your-journey.jpg"
                        alt="Cannoga College student reading in library"
                        fill
                        priority
                        className="object-cover object-center scale-105"
                        sizes="100vw"
                    />
                </div>

                {/* Wavy Decorative Cut Element Top */}
                <div className="absolute top-0 left-0 right-0 z-20 overflow-hidden leading-none pointer-events-none">
                    <svg 
                        className="relative block w-full h-10 sm:h-14 md:h-16 text-white" 
                        viewBox="0 0 1200 120" 
                        preserveAspectRatio="none"
                        fill="currentColor"
                    >
                        <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,0 L0,0 Z"></path>
                    </svg>
                </div>

                {/* Dark Contrast Gradient Overlay */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/40 to-black/20 pointer-events-none" />

                {/* Content Overlay */}
                <div className="relative z-10 text-white max-w-6xl">
                    
                    {/* White Cannoga Logo (Non-clickable) */}
                    <div className="mb-6 md:mb-8">
                        <Image
                            src="/images/logo-cannoga.png"
                            alt="Cannoga College"
                            width={180}
                            height={60}
                            className="h-10 md:h-14 w-auto object-contain brightness-0 invert"
                        />
                    </div>

                    {/* Bold Headline */}
                    <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[100px] font-black text-white uppercase tracking-tight leading-[0.92] mb-8 sm:mb-12 font-sans">
                        SEE YOU AT<br />THE TOP
                    </h2>

                    {/* Bottom Link Options */}
                    <div className="flex flex-wrap items-center gap-6 sm:gap-10 md:gap-14 font-black text-base sm:text-xl md:text-2xl text-white uppercase tracking-wider">
                        <Link 
                            href="/about" 
                            className="group relative inline-flex items-center gap-3 text-white no-underline py-1"
                        >
                            <span className="relative z-10 font-black">WHY CANNOGA COLLEGE?</span>
                            <ArrowRight size={24} weight="bold" className="text-white transition-transform duration-300 group-hover:translate-x-2.5 shrink-0" />
                            <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-white transition-all duration-300 group-hover:w-full" />
                        </Link>
                        <Link 
                            href="/admissions/application-process" 
                            className="group relative inline-flex items-center gap-3 text-white no-underline py-1"
                        >
                            <span className="relative z-10 font-black">APPLY NOW</span>
                            <ArrowRight size={24} weight="bold" className="text-white transition-transform duration-300 group-hover:translate-x-2.5 shrink-0" />
                            <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-white transition-all duration-300 group-hover:w-full" />
                        </Link>
                        <Link 
                            href="/contact" 
                            className="group relative inline-flex items-center gap-3 text-white no-underline py-1"
                        >
                            <span className="relative z-10 font-black">CONTACT US</span>
                            <ArrowRight size={24} weight="bold" className="text-white transition-transform duration-300 group-hover:translate-x-2.5 shrink-0" />
                            <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-white transition-all duration-300 group-hover:w-full" />
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}
