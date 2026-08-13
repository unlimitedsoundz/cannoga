'use client';

import React from 'react';
import { 
    YoutubeLogo, 
    TiktokLogo
} from '@phosphor-icons/react';

interface ShortItem {
    id: string;
    title: string;
    caption: string;
    videoId: string; // YouTube Shorts Video ID
}

const SHORTS_DATA: ShortItem[] = [
    {
        id: '1',
        title: 'Dance if you are excited about summer break 😂',
        caption: 'Dance if you are excited about the summer break 😂 #CannogaOrientation #CampusLife',
        videoId: 'OJRQFDSUMDY'
    },
    {
        id: '2',
        title: 'Finding your textbooks just got a lot easier 📚',
        caption: 'Finding your textbooks just got a lot easier 📚 #CannogaCampus #StudentResources',
        videoId: 'FNerZMOydps'
    },
    {
        id: '3',
        title: 'There\'s always something you will love about Cannoga College',
        caption: 'There\'s always something you will love about Cannoga College 🇨🇦✨ #CannogaLife #Ottawa',
        videoId: '_JkrXe53EjI'
    },
    {
        id: '4',
        title: 'Meet Love, our Practical Nursing graduate 🇨🇦🎓',
        caption: 'Meet Love, our Practical Nursing graduate 🇨🇦🎓 #CannogaGrad #NursingExcellence',
        videoId: 'QorLfVUYanA'
    }
];

export function CannogaShortsSection() {
    return (
        <section className="py-16 bg-[#f2f8f6] border-t border-slate-200">
            <div className="container mx-auto px-4 md:px-12 lg:px-20 max-w-7xl">
                
                {/* Header Row with Title & Social Follow Icons */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-serif font-black tracking-tight text-[#0a151a] flex items-center gap-2">
                            <span className="text-[#0a151a]">Cannoga Shorts:</span>
                            <span className="font-normal text-slate-800">Campus Life in Motion</span>
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

                {/* 4 Vertical Shorts Grid - Embedded YouTube Players Direct */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {SHORTS_DATA.map((short) => {
                        return (
                            <div key={short.id} className="flex flex-col group">
                                {/* Vertical 9:16 Direct Embedded YouTube Video Box */}
                                <div className="relative aspect-[9/16] w-full bg-black rounded-md overflow-hidden block shadow-md group-hover:shadow-xl transition-shadow border border-slate-800">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${short.videoId}?rel=0&modestbranding=1`}
                                        title={short.title}
                                        className="w-full h-full border-0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>

                                {/* Caption Text Below Video */}
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
