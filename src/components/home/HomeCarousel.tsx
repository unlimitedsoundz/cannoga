'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Link } from '@/components/ui/Link';
import { CaretLeft, CaretRight, ArrowRight } from '@phosphor-icons/react';

interface Slide {
    title: string;
    body: string;
    image: string;
    btnText: string;
    btnHref: string;
}

const slides: Slide[] = [
    {
        title: "The future you want is yours to make",
        body: "With practical, hands-on learning, Cannoga College prepares you for success. Explore our programs and discover your potential in the heart of Ottawa, Ontario, Canada.",
        image: "/images/heffring-hero-new.png",
        btnText: "Start your application",
        btnHref: "/admissions"
    },
    {
        title: "Experience that sets you apart",
        body: "Earn while you learn. Our industry connections connect students with paid, on-the-job training in Ottawa's top tech firms and creative studios.",
        image: "/images/home-carousel-2.png",
        btnText: "Explore programs",
        btnHref: "/studies"
    },
    {
        title: "State-of-the-art campus in Ottawa",
        body: "Enjoy advanced facilities, modern laboratories, and collaborative workspaces designed to foster innovation and learning.",
        image: "/images/home-carousel-3.png",
        btnText: "Book a campus visit",
        btnHref: "/contact"
    }
];

export function HomeCarousel() {
    const [current, setCurrent] = useState(0);

    // Auto-advance slide every 6 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % slides.length);
    };

    return (
        <section className="relative overflow-hidden text-white min-h-[500px] lg:h-[600px] flex items-center border-b border-[#0f2027]/10">
            {/* Slide Container */}
            <div className="relative w-full h-full min-h-[500px] lg:h-[600px]">
                {slides.map((slide, idx) => (
                    <div
                        key={idx}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${idx === current ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0 w-full h-full bg-neutral-900">
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                priority={idx === 0}
                                className="object-cover object-center"
                                sizes="100vw"
                            />
                            <div className="absolute inset-0 bg-black/40 z-[1]" />
                        </div>

                        {/* Content Overlay */}
                        <div className="container mx-auto px-4 md:px-12 lg:px-20 h-full relative z-20 flex items-center justify-start">
                            <div className="w-full lg:w-3/5 p-8 md:p-12 lg:p-16 flex flex-col space-y-6 text-white text-left items-start rounded-none">
                                <div className="space-y-4">
                                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                                        {slide.title}
                                    </h1>
                                    <p className="text-lg lg:text-xl text-white max-w-xl font-medium leading-relaxed mr-auto">
                                        {slide.body}
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <Link
                                        href={slide.btnHref}
                                        className="inline-flex items-center gap-2 bg-[#0f2027] hover:bg-[#1a3644] text-white font-bold text-sm tracking-wider uppercase px-8 py-4 no-underline rounded-sm transition-colors border border-white/20"
                                        noHover
                                    >
                                        <span>{slide.btnText}</span>
                                        <ArrowRight size={18} weight="bold" className="text-[#c89211]" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Manual Controls */}
            <button
                onClick={prevSlide}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 z-30 rounded-full bg-[#0f2027]/60 hover:bg-[#0f2027] w-12 h-12 flex items-center justify-center text-white transition-colors border border-white/20"
                aria-label="Previous slide"
            >
                <CaretLeft size={24} weight="bold" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 z-30 rounded-full bg-[#0f2027]/60 hover:bg-[#0f2027] w-12 h-12 flex items-center justify-center text-white transition-colors border border-white/20"
                aria-label="Next slide"
            >
                <CaretRight size={24} weight="bold" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex gap-2.5">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`w-3.5 h-3.5 rounded-full transition-all duration-300 border-2 border-white ${idx === current ? 'bg-white scale-110' : 'bg-transparent hover:bg-white/30'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}

