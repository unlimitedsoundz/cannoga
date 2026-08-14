'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CaretLeft, CaretRight, ArrowRight } from "@phosphor-icons/react/dist/ssr";

const stories = [
    {
        id: 1,
        name: 'Chinaza Kamsiyochukwu',
        programme: "Honours Bachelor of Environmental Science",
        quote: "Conducting field research along the Rideau Canal and participating in green campus initiatives gave me direct insights into sustainable urban policy.",
        image: 'https://i.pinimg.com/1200x/72/a1/7c/72a17cb6e8bda24fd421065e8ad24296.jpg',
        imagePosition: 'object-[center_30%] md:object-[center_20%]'
    },
    {
        id: 2,
        name: 'Collins Huang',
        programme: "Bachelor's in International Business",
        quote: "Cannoga College provided me with a unique multidisciplinary environment where I could combine my interest in tech with business strategy. The practical co-op experience in Ottawa was eye-opening.",
        image: '/images/collins-huang.jpg',
        imagePosition: 'object-[center_20%]'
    },
    {
        id: 3,
        name: 'Maria Petrova',
        programme: "Master's in Design Management",
        quote: "Studying in Ottawa, Ontario, Canada has been a life-changing experience. The focus on work-life balance and deep collaborative research at Cannoga is truly world-class.",
        image: '/images/student-story-2.jpg',
        imagePosition: 'object-top'
    },
    {
        id: 4,
        name: 'Sergei Voldov',
        programme: "Advanced Diploma in Software Engineering",
        quote: "The hands-on lab facilities and close mentorship from faculty helped me secure a full-time software developer role in Ottawa's Kanata North tech hub before graduation.",
        image: '/images/student-story-4.jpg',
        imagePosition: 'object-center md:object-[center_15%]'
    }
];

export default function StudentStoriesCarousel() {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent((prev) => (prev + 1) % stories.length);
    const prev = () => setCurrent((prev) => (prev - 1 + stories.length) % stories.length);

    return (
        <div className="relative w-full h-[600px] sm:h-[560px] md:h-[380px] overflow-hidden bg-white group">
            {stories.map((story, index) => (
                <div
                    key={story.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                        }`}
                >
                    <div className="flex flex-col md:flex-row h-full w-full">
                        {/* Image Side with Heavy Edge Feathering */}
                        <div className="relative h-[290px] sm:h-[310px] md:h-full w-full md:w-1/2 shrink-0 overflow-hidden bg-white">
                            <div
                                className="relative w-full h-full"
                                style={{
                                    WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 90%)',
                                    maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 90%)',
                                }}
                            >
                                <Image
                                    src={story.image}
                                    alt={story.name}
                                    fill
                                    className={`object-cover ${story.imagePosition}`}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority={index === 0}
                                />
                            </div>

                            {/* Heavy Multi-Directional Gradient Feather Overlays */}
                            <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-white via-white/90 to-transparent z-10 pointer-events-none" />
                            <div className="absolute inset-y-0 left-0 w-12 md:w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
                            <div className="absolute inset-x-0 top-0 h-12 md:h-20 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
                            <div className="absolute inset-x-0 bottom-0 h-24 md:h-20 bg-gradient-to-t from-white via-white/90 to-transparent z-10 pointer-events-none" />
                        </div>

                        {/* Content Side */}
                        <div className="p-6 md:p-10 flex flex-col justify-between text-slate-900 bg-white w-full md:w-1/2 h-[310px] sm:h-[250px] md:h-full relative">
                            <div>
                                <p className="text-base md:text-lg text-slate-800 font-serif leading-relaxed mb-4 italic">
                                    "{story.quote}"
                                </p>
                                <div>
                                    <h4 className="text-base font-bold text-[#0a151a] uppercase tracking-tight">{story.name}</h4>
                                    <p className="text-[11px] text-[#c89211] font-bold tracking-wide mt-0.5">{story.programme}</p>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                                <a 
                                    href="/student-guide" 
                                    className="inline-flex items-center gap-2 font-bold text-[11px] uppercase tracking-wider text-[#0a151a] hover:text-[#c89211] transition-colors"
                                >
                                    Read Student Guide <ArrowRight size={13} weight="bold" />
                                </a>

                                {/* Story Indicators */}
                                <div className="flex gap-1.5">
                                    {stories.map((s, idx) => (
                                        <button
                                            key={s.id}
                                            onClick={() => setCurrent(idx)}
                                            className={`h-1.5 transition-all rounded-full ${idx === current ? 'w-5 bg-[#0a151a]' : 'w-1.5 bg-slate-300 hover:bg-slate-400'}`}
                                            aria-label={`Go to slide ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Controls */}
            <button
                onClick={prev}
                className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 z-30 rounded-full bg-[#0a151a] hover:bg-[#0f2027] w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white transition-colors border border-white/20 shadow-md"
                aria-label="Previous story"
            >
                <CaretLeft size={22} weight="bold" />
            </button>
            <button
                onClick={next}
                className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-30 rounded-full bg-[#0a151a] hover:bg-[#0f2027] w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white transition-colors border border-white/20 shadow-md"
                aria-label="Next story"
            >
                <CaretRight size={22} weight="bold" />
            </button>
        </div>
    );
}



