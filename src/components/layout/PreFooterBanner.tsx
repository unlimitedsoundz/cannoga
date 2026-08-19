"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";

export function PreFooterBanner() {
    return (
        <section className="bg-transparent pt-0 sm:pt-12 md:pt-16 pb-6 sm:pb-12 px-2 sm:px-6 md:px-8 lg:px-12 relative z-10">
            <div 
                className="w-full max-w-[1700px] mx-auto relative rounded-none md:rounded-sm overflow-hidden aspect-[9/16] sm:aspect-auto sm:min-h-[620px] md:min-h-[700px] flex flex-col justify-end p-6 sm:p-12 md:p-16 shadow-2xl"
            >
                {/* Background Container */}
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                    <Image
                        src="/images/prefooter-banner.png"
                        alt="Cannoga College student"
                        fill
                        priority
                        className="object-cover object-[70%_25%] sm:object-[65%_30%] md:object-[60%_30%]"
                        sizes="100vw"
                    />
                </div>

                {/* Dark Contrast Gradient Overlay */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/60 to-black/25 pointer-events-none" />

                {/* Content Overlay */}
                <div className="relative z-10 text-white max-w-6xl">
                    
                    {/* White Cannoga Logo (Prominently Extra Large on Mobile) */}
                    <div className="mb-5 sm:mb-8">
                        <Image
                            src="/images/logo-cannoga.png"
                            alt="Cannoga College"
                            width={450}
                            height={140}
                            className="h-24 sm:h-14 md:h-20 w-auto object-contain brightness-0 invert"
                        />
                    </div>

                    {/* Bold Headline (Extra-Large Font Size on Mobile) */}
                    <h2 className="text-7xl sm:text-7xl md:text-8xl lg:text-[100px] font-black text-white uppercase tracking-tight leading-[0.84] sm:leading-[0.92] mb-6 sm:mb-12 font-sans">
                        SEE YOU AT<br />THE TOP
                    </h2>

                    {/* Vertical Links on Mobile (Extra Bold & Larger Text) */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-10 md:gap-14 font-black text-xl sm:text-xl md:text-2xl text-white uppercase tracking-wider">
                        <Link 
                            href="/about" 
                            className="group relative inline-flex items-center gap-3 text-white no-underline py-1"
                        >
                            <span className="relative z-10 font-black">WHY CANNOGA COLLEGE?</span>
                            <ArrowRight size={26} weight="bold" className="text-white transition-transform duration-300 group-hover:translate-x-2.5 shrink-0" />
                            <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-white transition-all duration-300 group-hover:w-full" />
                        </Link>
                        <Link 
                            href="/admissions/application-process" 
                            className="group relative inline-flex items-center gap-3 text-white no-underline py-1"
                        >
                            <span className="relative z-10 font-black">APPLY NOW</span>
                            <ArrowRight size={26} weight="bold" className="text-white transition-transform duration-300 group-hover:translate-x-2.5 shrink-0" />
                            <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-white transition-all duration-300 group-hover:w-full" />
                        </Link>
                        <Link 
                            href="/contact" 
                            className="group relative inline-flex items-center gap-3 text-white no-underline py-1"
                        >
                            <span className="relative z-10 font-black">CONTACT US</span>
                            <ArrowRight size={26} weight="bold" className="text-white transition-transform duration-300 group-hover:translate-x-2.5 shrink-0" />
                            <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-white transition-all duration-300 group-hover:w-full" />
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}
