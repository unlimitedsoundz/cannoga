"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";

export function PreFooterBanner() {
    return (
        <section className="bg-white pt-10 sm:pt-28 md:pt-32 pb-6 sm:pb-12 px-2 sm:px-6 md:px-8 lg:px-12 relative z-0">
            <div 
                className="w-full max-w-[1700px] mx-auto relative rounded-none md:rounded-sm overflow-hidden aspect-[9/16] sm:aspect-auto sm:min-h-[620px] md:min-h-[700px] flex flex-col justify-end p-5 sm:p-12 md:p-16 shadow-2xl"
            >
                {/* Background Container */}
                <div className="absolute inset-0 w-full h-full pointer-events-none">
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
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/50 to-black/20 pointer-events-none" />

                {/* Content Overlay */}
                <div className="relative z-10 text-white max-w-6xl">
                    
                    {/* White Cannoga Logo (Larger on Mobile) */}
                    <div className="mb-4 sm:mb-8">
                        <Image
                            src="/images/logo-cannoga.png"
                            alt="Cannoga College"
                            width={240}
                            height={80}
                            className="h-14 sm:h-12 md:h-16 w-auto object-contain brightness-0 invert"
                        />
                    </div>

                    {/* Bold Headline (Larger font size on Mobile with tighter leading) */}
                    <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-[100px] font-black text-white uppercase tracking-tight leading-[0.88] sm:leading-[0.92] mb-5 sm:mb-12 font-sans">
                        SEE YOU AT<br />THE TOP
                    </h2>

                    {/* Vertical Links on Mobile (Bold & Reduced Spacing) */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-10 md:gap-14 font-black text-lg sm:text-xl md:text-2xl text-white uppercase tracking-wider">
                        <Link 
                            href="/about" 
                            className="group relative inline-flex items-center gap-2.5 text-white no-underline py-0.5"
                        >
                            <span className="relative z-10 font-black">WHY CANNOGA COLLEGE?</span>
                            <ArrowRight size={22} weight="bold" className="text-white transition-transform duration-300 group-hover:translate-x-2.5 shrink-0" />
                            <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-white transition-all duration-300 group-hover:w-full" />
                        </Link>
                        <Link 
                            href="/admissions/application-process" 
                            className="group relative inline-flex items-center gap-2.5 text-white no-underline py-0.5"
                        >
                            <span className="relative z-10 font-black">APPLY NOW</span>
                            <ArrowRight size={22} weight="bold" className="text-white transition-transform duration-300 group-hover:translate-x-2.5 shrink-0" />
                            <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-white transition-all duration-300 group-hover:w-full" />
                        </Link>
                        <Link 
                            href="/contact" 
                            className="group relative inline-flex items-center gap-2.5 text-white no-underline py-0.5"
                        >
                            <span className="relative z-10 font-black">CONTACT US</span>
                            <ArrowRight size={22} weight="bold" className="text-white transition-transform duration-300 group-hover:translate-x-2.5 shrink-0" />
                            <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-white transition-all duration-300 group-hover:w-full" />
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}
