'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CaretLeft, CaretRight, ArrowRight } from "@phosphor-icons/react/dist/ssr";

const stories = [
    {
        id: 1,
        name: 'Collins Huang',
        programme: "Bachelor's in International Business",
        quote: "Cannoga College provided me with a unique multidisciplinary environment where I could combine my interest in tech with business strategy. The practical co-op experience in Ottawa was eye-opening.",
        image: '/images/collins-huang.jpg'
    },
    {
        id: 2,
        name: 'Maria Petrova',
        programme: "Master's in Design Management",
        quote: "Studying in Ottawa, Ontario, Canada has been a life-changing experience. The focus on work-life balance and deep collaborative research at Cannoga is truly world-class.",
        image: '/images/student-story-2.jpg'
    },
    {
        id: 3,
        name: 'Marcus Vance',
        programme: "Advanced Diploma in Software Engineering",
        quote: "The hands-on lab facilities and close mentorship from faculty helped me secure a full-time software developer role in Ottawa's Kanata North tech hub before graduation.",
        image: '/images/home-carousel-1.png'
    },
    {
        id: 4,
        name: 'Elena Rostova',
        programme: "Honours Bachelor of Environmental Science",
        quote: "Conducting field research along the Rideau Canal and participating in green campus initiatives gave me direct insights into sustainable urban policy.",
        image: '/images/home-carousel-2.png'
    }
];

export default function StudentStoriesCarousel() {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent((prev) => (prev + 1) % stories.length);
    const prev = () => setCurrent((prev) => (prev - 1 + stories.length) % stories.length);

    return (
        <div className="relative w-full min-h-[550px] md:h-[500px] overflow-hidden bg-slate-900 group rounded-sm shadow-sm">
            {stories.map((story, index) => (
                <div
                    key={story.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                        }`}
                >
                    <div className="flex flex-col md:flex-row h-full">
                        {/* Image Side */}
                        <div className="relative h-[260px] md:h-full md:w-1/2 overflow-hidden">
                            <Image
                                src={story.image}
                                alt={story.name}
                                fill
                                className="object-cover object-center"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900/60 via-transparent to-transparent md:hidden" />
                        </div>

                        {/* Content Side */}
                        <div className="p-8 md:p-14 flex flex-col justify-between text-white bg-slate-900 md:w-1/2 relative">
                            <div>
                                <span className="text-[#c89211] font-bold uppercase tracking-widest text-[11px] mb-4 block">Student Voice &amp; Campus Experience</span>
                                <p className="text-lg md:text-xl text-slate-100 font-serif leading-relaxed mb-6 italic">
                                    "{story.quote}"
                                </p>
                                <div className="border-l-2 border-[#c89211] pl-4">
                                    <h4 className="text-lg font-bold text-white uppercase tracking-tight">{story.name}</h4>
                                    <p className="text-xs text-slate-300 font-medium tracking-wide mt-0.5">{story.programme}</p>
                                </div>
                            </div>

                            <div className="pt-6 flex items-center justify-between">
                                <a 
                                    href="/student-guide" 
                                    className="inline-flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#c89211] hover:underline"
                                >
                                    Read Student Guide <ArrowRight size={14} weight="bold" />
                                </a>

                                {/* Story Indicators */}
                                <div className="flex gap-1.5 pr-28">
                                    {stories.map((s, idx) => (
                                        <button
                                            key={s.id}
                                            onClick={() => setCurrent(idx)}
                                            className={`h-1.5 transition-all rounded-full ${idx === current ? 'w-6 bg-[#c89211]' : 'w-1.5 bg-slate-700 hover:bg-slate-500'}`}
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
            <div className="absolute bottom-0 right-0 flex z-20">
                <button
                    onClick={prev}
                    className="w-12 h-12 md:w-14 md:h-14 bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 transition-all active:scale-95 border-r border-slate-700"
                    aria-label="Previous story"
                >
                    <CaretLeft size={20} weight="bold" />
                </button>
                <button
                    onClick={next}
                    className="w-12 h-12 md:w-14 md:h-14 bg-[#0f2027] text-white flex items-center justify-center transition-all hover:bg-slate-800 active:scale-95"
                    aria-label="Next story"
                >
                    <CaretRight size={20} weight="bold" />
                </button>
            </div>
        </div>
    );
}



