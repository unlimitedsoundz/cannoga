"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";

export function PreFooterBanner() {
    const [translateY, setTranslateY] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (containerRef.current) {
                        const rect = containerRef.current.getBoundingClientRect();
                        const windowHeight = window.innerHeight;
                        if (rect.top < windowHeight && rect.bottom > 0) {
                            const centerY = rect.top + rect.height / 2;
                            const viewportCenter = windowHeight / 2;
                            const offsetFromCenter = centerY - viewportCenter;
                            // 18% parallax movement ratio for subtle, natural depth without zoom
                            setTranslateY(offsetFromCenter * 0.18);
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section className="bg-white pt-20 sm:pt-28 md:pt-32 pb-8 sm:pb-12 px-4 sm:px-6 md:px-8 lg:px-12 relative z-0">
            <div 
                ref={containerRef}
                className="w-full max-w-[1700px] mx-auto relative rounded-none md:rounded-sm overflow-hidden min-h-[520px] sm:min-h-[620px] md:min-h-[700px] flex flex-col justify-end p-6 sm:p-12 md:p-16 shadow-2xl"
            >
                {/* Parallax Background Container */}
                <div 
                    className="absolute -top-[12%] -bottom-[12%] left-0 right-0 w-full h-[124%] will-change-transform pointer-events-none"
                    style={{ transform: `translate3d(0, ${translateY}px, 0)` }}
                >
                    <Image
                        src="/images/start-your-journey.jpg"
                        alt="Cannoga College student reading in library"
                        fill
                        priority
                        className="object-cover object-[30%_center] sm:object-center"
                        sizes="100vw"
                    />
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
