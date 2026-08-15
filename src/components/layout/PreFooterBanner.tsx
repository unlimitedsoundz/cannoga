"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck } from "@phosphor-icons/react";

export function PreFooterBanner() {
    return (
        <section className="bg-[#cad6ce] py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto relative rounded-none md:rounded-sm overflow-hidden min-h-[460px] sm:min-h-[520px] md:min-h-[580px] flex flex-col justify-end p-8 sm:p-12 md:p-16 border border-white/10 shadow-2xl group">
                
                {/* Background Library Imagery */}
                <Image
                    src="/images/start-your-journey.png"
                    alt="Cannoga College student reading in library"
                    fill
                    priority
                    className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 1280px) 100vw, 1280px"
                />

                {/* Dark Contrast Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />

                {/* Content Overlay */}
                <div className="relative z-10 text-white max-w-4xl">
                    
                    {/* College Crest Icon */}
                    <div className="mb-6 flex items-center">
                        <div className="w-12 h-14 bg-white/10 backdrop-blur-md border border-white/30 rounded-t-md rounded-b-xl flex items-center justify-center text-white shadow-lg">
                            <ShieldCheck size={28} weight="fill" className="text-white" />
                        </div>
                    </div>

                    {/* Bold Headline */}
                    <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tight leading-[0.95] mb-8 sm:mb-12 font-sans">
                        START YOUR<br />JOURNEY
                    </h2>

                    {/* Bottom Link Options */}
                    <div className="flex flex-wrap items-center gap-6 sm:gap-10 md:gap-14 font-extrabold text-sm sm:text-base md:text-lg text-white uppercase tracking-wider">
                        <Link 
                            href="/about" 
                            className="inline-flex items-center gap-2 text-white hover:text-[#c89211] transition-colors no-underline group/link"
                        >
                            <span>WHY CANNOGA COLLEGE?</span>
                            <ArrowRight size={20} weight="bold" className="group-hover/link:translate-x-1.5 transition-transform" />
                        </Link>
                        <Link 
                            href="/admissions/application-process" 
                            className="inline-flex items-center gap-2 text-white hover:text-[#c89211] transition-colors no-underline group/link"
                        >
                            <span>APPLY NOW</span>
                            <ArrowRight size={20} weight="bold" className="group-hover/link:translate-x-1.5 transition-transform" />
                        </Link>
                        <Link 
                            href="/contact" 
                            className="inline-flex items-center gap-2 text-white hover:text-[#c89211] transition-colors no-underline group/link"
                        >
                            <span>CONTACT US</span>
                            <ArrowRight size={20} weight="bold" className="group-hover/link:translate-x-1.5 transition-transform" />
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}
