"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";
import { Logo } from "@/components/ui/Logo";

export function PreFooterBanner() {
    return (
        <section className="bg-[#cad6ce] py-3 sm:py-4 px-1 sm:px-2 md:px-3">
            <div className="w-full max-w-[1850px] mx-auto relative rounded-none md:rounded-sm overflow-hidden min-h-[520px] sm:min-h-[620px] md:min-h-[700px] flex flex-col justify-end p-6 sm:p-12 md:p-16 border border-white/10 shadow-2xl">
                
                {/* Background Library Imagery */}
                <Image
                    src="/images/start-your-journey.jpg"
                    alt="Cannoga College student reading in library"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="100vw"
                />

                {/* Dark Contrast Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

                {/* Content Overlay */}
                <div className="relative z-10 text-white max-w-6xl">
                    
                    {/* White Cannoga Logo */}
                    <div className="mb-6 md:mb-8">
                        <Logo className="h-10 md:h-14 text-white" />
                    </div>

                    {/* Bold Headline */}
                    <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[100px] font-black text-white uppercase tracking-tight leading-[0.92] mb-8 sm:mb-12 font-sans">
                        START YOUR<br />JOURNEY
                    </h2>

                    {/* Bottom Link Options */}
                    <div className="flex flex-wrap items-center gap-6 sm:gap-10 md:gap-14 font-extrabold text-base sm:text-xl md:text-2xl text-white uppercase tracking-wider">
                        <Link 
                            href="/about" 
                            className="inline-flex items-center gap-2 text-white no-underline"
                        >
                            <span>WHY CANNOGA COLLEGE?</span>
                            <ArrowRight size={24} weight="bold" />
                        </Link>
                        <Link 
                            href="/admissions/application-process" 
                            className="inline-flex items-center gap-2 text-white no-underline"
                        >
                            <span>APPLY NOW</span>
                            <ArrowRight size={24} weight="bold" />
                        </Link>
                        <Link 
                            href="/contact" 
                            className="inline-flex items-center gap-2 text-white no-underline"
                        >
                            <span>CONTACT US</span>
                            <ArrowRight size={24} weight="bold" />
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}
