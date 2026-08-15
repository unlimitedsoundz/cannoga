'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from '@phosphor-icons/react';
import { Link } from '@/components/ui/Link';

// Single informational card styled similarly to AcademicSchoolsCarousel cards
export function InternationalInfoCard() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(false);

    const waveKeyframes = `
        @keyframes waveFloatInfo {
            0%, 100% { transform: translateY(12px) scaleY(1); }
            50% { transform: translateY(-8px) scaleY(1.12); }
        }
        @keyframes arrowFloatInfo {
            0%, 100% { transform: translate(0,0); }
            50% { transform: translate(5px, -5px); }
        }
    `;

    return (
        <div className="relative w-full max-w-[520px] mx-auto">
            <style jsx>{`{waveKeyframes}`}</style>
            <div
                className="block w-full p-4 sm:p-6 rounded-md bg-[#6366f1] border-[#6366f1] border-4 overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
                {/* Image with wavy cutout */}
                <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-sm bg-black/10">
                    <Image
                        src="/images/ottawa-campus.jpg"
                        alt="Cannoga College campus in Ottawa, Ontario, Canada"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 350px, (max-width: 768px) 420px, 520px"
                    />
                    <div
                        className="absolute bottom-[-24px] left-0 right-0 h-16 sm:h-24 overflow-hidden leading-none z-10 pointer-events-none"
                        style={{ animation: 'waveFloatInfo 3.4s ease-in-out infinite' }}
                    >
                        <svg
                            viewBox="0 0 1440 200"
                            preserveAspectRatio="none"
                            className="w-full h-full fill-current block"
                            style={{ color: '#4f46e5' }}
                        >
                            <path
                                fill="currentColor"
                                d="M0,45 C320,105 640,-15 960,75 C1200,115 1380,45 1440,65 V200 H0 Z"
                            />
                        </svg>
                    </div>
                </div>
                {/* Text content */}
                <div className="pt-6 text-white">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-[1.02] mb-4">
                        Study in Ottawa, Ontario, Canada with Cannoga College
                    </h2>
                    <p className="text-base sm:text-lg font-medium mb-3">
                        <strong>Quality &amp; Safety</strong> World‑leading education in a safe, inclusive, and equal society.
                    </p>
                    <p className="text-base sm:text-lg font-medium mb-3">
                        <strong>Practical Innovation</strong> Focus on applied learning, independent research, and real‑world industry applications.
                    </p>
                    <p className="text-base sm:text-lg font-medium mb-4">
                        <strong>Life Balance</strong> Flexibility and student wellbeing support to shape your own unique academic path.
                    </p>
                    <Link
                        linkComponentProps={{ href: '/student-guide/international' }}
                        className="inline-flex items-center gap-2 text-sm font-bold text-white hover:underline"
                    >
                        Read Our International Student Guide
                        <ArrowUpRight size={16} weight="bold" className="text-white" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
