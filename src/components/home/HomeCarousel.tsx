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
        image: "/images/home-carousel-1.png",
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
    const [scrollY, setScrollY] = useState(0);

    // Auto-advance slide every 6 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    // Parallax scroll tracking
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY < 800) {
                setScrollY(window.scrollY);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % slides.length);
    };

    return (
        <div className="w-full container mx-auto px-4 sm:px-6 lg:px-8 pt-0">
            <section className="relative group overflow-hidden text-white aspect-[9/16] sm:aspect-auto sm:min-h-[520px] md:min-h-[600px] lg:h-[680px] flex items-center border-b border-[#0f2027]/10">
                {/* Slide Container */}
                <div className="relative w-full h-full aspect-[9/16] sm:aspect-auto sm:min-h-[520px] md:min-h-[600px] lg:h-[680px]">
                    {slides.map((slide, idx) => (
                        <div
                            key={idx}
                            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${idx === current ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}
                        >
                            {/* Background Image with Parallax Scroll Effect */}
                            <div
                                className="absolute inset-0 w-full h-full bg-[#0a151a] parallax-bg"
                                style={{
                                    backgroundImage: `url(${slide.image})`,
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 z-[1]" />
                            </div>

                            {/* Content Overlay */}
                            <div className="w-full h-full relative z-20 flex items-center justify-start px-6 md:px-10 lg:px-12 py-8 lg:py-12">
                                <div className="w-full lg:w-3/5 flex flex-col space-y-6 text-white text-left items-start">
                                    <div className="space-y-4">
                                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                                            {slide.title}
                                        </h1>
                                        <p className="text-lg lg:text-xl text-white max-w-xl font-medium leading-relaxed mr-auto">
                                            {slide.body}
                                        </p>
                                    </div>

                                    <div className="pt-2">
                                        <Link
                                            href={slide.btnHref}
                                            className="inline-flex items-center gap-2 bg-white hover:bg-neutral-100 text-[#0a151a] font-bold text-sm tracking-wider uppercase px-8 py-4 no-underline rounded-sm transition-colors shadow-md"
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

                {/* Bottom Navigation & Indicator Controls */}
                <div className="absolute bottom-6 left-6 right-6 md:left-12 md:right-12 z-30 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-3 pointer-events-auto">
                        <button
                            onClick={prevSlide}
                            className="p-3 rounded-full bg-[#0a151a] text-white hover:bg-[#c89211] transition-colors flex items-center justify-center border border-white/20 shadow-md"
                            aria-label="Previous slide"
                        >
                            <CaretLeft size={20} weight="bold" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="p-3 rounded-full bg-[#0a151a] text-white hover:bg-[#c89211] transition-colors flex items-center justify-center border border-white/20 shadow-md"
                            aria-label="Next slide"
                        >
                            <CaretRight size={20} weight="bold" />
                        </button>
                    </div>

                    {/* Pagination Indicators */}
                    <div className="flex items-center gap-2 pointer-events-auto">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrent(idx)}
                                className="transition-all duration-300 rounded-full"
                                style={{
                                    width: idx === current ? 28 : 10,
                                    height: 10,
                                    background: idx === current ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

