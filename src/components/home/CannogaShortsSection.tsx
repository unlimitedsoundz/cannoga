'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
    Play, 
    YoutubeLogo, 
    TiktokLogo,
    X
} from '@phosphor-icons/react';

interface ShortItem {
    id: string;
    title: string;
    caption: string;
    thumbnailUrl: string;
    videoId: string; // YouTube Shorts Video ID
}

const SHORTS_DATA: ShortItem[] = [
    {
        id: '1',
        title: 'Dance if you are excited about summer break 😂',
        caption: 'Dance if you are excited about the summer break 😂 #CannogaOrientation #CampusLife',
        thumbnailUrl: '/images/admissions/events.jpg',
        videoId: 'OJRQFDSUMDY'
    },
    {
        id: '2',
        title: 'Finding your textbooks just got a lot easier 📚',
        caption: 'Finding your textbooks just got a lot easier 📚 #CannogaCampus #StudentResources',
        thumbnailUrl: '/images/admissions/campus-tour.jpg',
        videoId: 'FNerZMOydps'
    },
    {
        id: '3',
        title: 'There\'s always something you will love about Cannoga College',
        caption: 'There\'s always something you will love about Cannoga College 🇨🇦✨ #CannogaLife #Ottawa',
        thumbnailUrl: '/images/admissions/student-hub.jpg',
        videoId: '_JkrXe53EjI'
    },
    {
        id: '4',
        title: 'Meet Love, our Practical Nursing graduate 🇨🇦🎓',
        caption: 'Meet Love, our Practical Nursing graduate 🇨🇦🎓 #CannogaGrad #NursingExcellence',
        thumbnailUrl: '/images/placeholders/design.png',
        videoId: 'QorLfVUYanA'
    }
];

export function CannogaShortsSection() {
    // Track playing video ID for inline iframe playback
    const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

    return (
        <section className="py-16 bg-[#f2f8f6] border-t border-slate-200">
            <div className="container mx-auto px-4 md:px-12 lg:px-20 max-w-7xl">
                
                {/* Header Row with Title & Social Follow Icons */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-serif font-black tracking-tight text-[#0a151a] flex items-center gap-2">
                            <span className="text-[#0a151a]">Cannoga Shorts:</span>
                            <span className="font-normal text-slate-800">Big stories, small screen</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#0a151a]">FOLLOW US</span>
                        <div className="flex items-center gap-4 text-[#0a151a]">
                            <a href="https://youtube.com/@cannogacollege" target="_blank" rel="noopener noreferrer" className="hover:text-[#c89211] hover:scale-110 transition-all transform inline-block" aria-label="YouTube">
                                <YoutubeLogo size={26} weight="fill" />
                            </a>
                            <a href="https://www.tiktok.com/@cannoga_college" target="_blank" rel="noopener noreferrer" className="hover:text-[#c89211] hover:scale-110 transition-all transform inline-block" aria-label="TikTok">
                                <TiktokLogo size={26} weight="fill" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* 4 Vertical Shorts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {SHORTS_DATA.map((short) => {
                        const isPlaying = playingVideoId === short.id;

                        return (
                            <div key={short.id} className="flex flex-col group">
                                {/* Vertical 9:16 Video Box / Embedded Player */}
                                <div className="relative aspect-[9/16] w-full bg-black rounded-md overflow-hidden block shadow-md group-hover:shadow-xl transition-shadow border border-slate-800">
                                    {isPlaying ? (
                                        <div className="relative w-full h-full">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${short.videoId}?autoplay=1&rel=0&modestbranding=1`}
                                                title={short.title}
                                                className="w-full h-full border-0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                            {/* Stop / Close Overlay Button */}
                                            <button 
                                                onClick={() => setPlayingVideoId(null)}
                                                className="absolute top-3 right-3 z-30 p-2 bg-black/80 hover:bg-[#c89211] text-white rounded-full transition-colors shadow"
                                                aria-label="Close Video"
                                            >
                                                <X size={16} weight="bold" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setPlayingVideoId(short.id)}
                                            className="relative w-full h-full text-left cursor-pointer group/btn"
                                            aria-label={`Play ${short.title}`}
                                        >
                                            <Image
                                                src={short.thumbnailUrl}
                                                alt={short.title}
                                                fill
                                                className="object-cover group-hover/btn:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            />
                                            
                                            {/* Overlay Gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                            {/* Center Gold Circular Play Button */}
                                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                                <div className="w-14 h-14 rounded-full bg-[#f3b233] text-white flex items-center justify-center pl-1 shadow-xl transform group-hover/btn:scale-110 transition-transform">
                                                    <Play size={26} weight="fill" />
                                                </div>
                                            </div>

                                            {/* Video Title inside Frame */}
                                            <div className="absolute bottom-4 inset-x-4 z-20 text-white">
                                                <p className="text-xs font-bold leading-snug drop-shadow line-clamp-2">
                                                    {short.title}
                                                </p>
                                            </div>
                                        </button>
                                    )}
                                </div>

                                {/* Caption Text Below Thumbnail */}
                                <div className="mt-3 text-center px-1">
                                    <p className="text-xs text-slate-700 font-sans font-medium leading-snug line-clamp-2">
                                        {short.caption}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
