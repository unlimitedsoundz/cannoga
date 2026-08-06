'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CaretLeft, CaretRight, ArrowRight } from "@phosphor-icons/react/dist/ssr";

const stories = [
    {
        id: 1,
        name: 'Uchida Ideguchi',
        programme: "Bachelor's in International Business",
        quote: "Cannoga College provided me with a unique multidisciplinary environment where I could combine my interest in tech with business strategy. The practical projects were eye-opening.",
        image: '/images/3d2c3049cce3060bc36cd51b2dbaafb6.jpg'
    },
    {
        id: 2,
        name: 'Maria Petrova',
        programme: "Master's in Design Management",
        quote: "Studying in Ottawa, Ontario, Canada has been a life-changing experience. The focus on work-life balance and deep collaborative research at Cannoga is truly world-class.",
        image: '/images/student-story-2.jpg'
    }
];

export default function StudentStoriesCarousel() {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent((prev) => (prev + 1) % stories.length);
    const prev = () => setCurrent((prev) => (prev - 1 + stories.length) % stories.length);

    return (
        <div className="relative w-full h-[750px] md:h-[500px] overflow-hidden bg-neutral-50 group">
            {stories.map((story, index) => (
                <div
                    key={story.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    <div className="flex flex-col md:flex-row h-full">
                        {/* Image Side */}
                        <div className="relative h-[300px] md:h-full md:w-1/2">
                            <Image
                                src={story.image}
                                alt={story.name}
                                fill
                                className="object-cover object-top"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>

                        {/* Content Side */}
                        <div className="p-8 md:p-16 flex flex-col justify-center text-black bg-neutral-50 md:w-1/2 relative">
                            <div className="max-w-xl animate-in fade-in slide-in-from-right-8 duration-700">
                                <p className="text-xl md:text-2xl text-black font-bold leading-tight mb-8 italic">
                                    "{story.quote}"
                                </p>
                                <div className="pl-8 mb-12">
                                    <h4 className="text-xl font-black text-black uppercase tracking-tighter">{story.name}</h4>
                                    <p className="text-[10px] font-black text-black uppercase tracking-[0.3em] mt-1">{story.programme}</p>
                                </div>

                                <div className="pt-8 opacity-80">
                                    <a 
                                        href="https://ourblogs.cannogacollege.ca/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 font-bold underline underline-offset-4 hover:gap-5 transition-all text-sm group/link"
                                    >
                                        Visit Student Blogs <ArrowRight size={14} weight="bold" className="group-hover/link:translate-x-2 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Controls */}
            <div className="absolute bottom-0 right-0 flex z-20">
                <button
                    onClick={prev}
                    className="w-14 h-14 bg-white flex items-center justify-center text-black hover:bg-[#9c27b3] hover:text-white transition-all active:scale-95"
                    aria-label="Previous story"
                >
                    <CaretLeft size={20} weight="bold" />
                </button>
                <button
                    onClick={next}
                    className="w-14 h-14 bg-[#9c27b3] text-white flex items-center justify-center transition-all hover:bg-neutral-800 active:scale-95"
                    aria-label="Next story"
                >
                    <CaretRight size={20} weight="bold" />
                </button>
            </div>
        </div>
    );
}



