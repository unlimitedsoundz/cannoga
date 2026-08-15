"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";
import { Logo } from "@/components/ui/Logo";

export function PreFooterBanner() {
    return (
        <section className="bg-[#cad6ce] py-8 sm:py-12 px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="w-full max-w-[1700px] mx-auto relative rounded-none md:rounded-sm overflow-hidden min-h-[520px] sm:min-h-[620px] md:min-h-[700px] flex flex-col justify-end p-6 sm:p-12 md:p-16 border border-white/10 shadow-2xl">
                
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
                            className="group relative inline-flex items-center gap-3 text-white hover:text-[#c89211] transition-all duration-300 no-underline py-1"
                        >
                            <span className="relative z-10">WHY CANNOGA COLLEGE?</span>
                            <span className="p-2 rounded-full bg-white/10 group-hover:bg-[#c89211] group-hover:text-black transition-all duration-300 flex items-center justify-center transform group-hover:translate-x-2 shadow-sm">
                                <ArrowRight size={20} weight="bold" />
                            </span>
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#c89211] transition-all duration-300 group-hover:w-full" />
                        </Link>
                        <Link 
                            href="/admissions/application-process" 
                            className="group relative inline-flex items-center gap-3 text-white hover:text-[#c89211] transition-all duration-300 no-underline py-1"
                        >
                            <span className="relative z-10">APPLY NOW</span>
                            <span className="p-2 rounded-full bg-white/10 group-hover:bg-[#c89211] group-hover:text-black transition-all duration-300 flex items-center justify-center transform group-hover:translate-x-2 shadow-sm">
                                <ArrowRight size={20} weight="bold" />
                            </span>
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#c89211] transition-all duration-300 group-hover:w-full" />
                        </Link>
                        <Link 
                            href="/contact" 
                            className="group relative inline-flex items-center gap-3 text-white hover:text-[#c89211] transition-all duration-300 no-underline py-1"
                        >
                            <span className="relative z-10">CONTACT US</span>
                            <span className="p-2 rounded-full bg-white/10 group-hover:bg-[#c89211] group-hover:text-black transition-all duration-300 flex items-center justify-center transform group-hover:translate-x-2 shadow-sm">
                                <ArrowRight size={20} weight="bold" />
                            </span>
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#c89211] transition-all duration-300 group-hover:w-full" />
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}
