'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
    Play,
    SpeakerHigh,
    SpeakerSimpleSlash,
    CornersOut,
    FacebookLogo,
    InstagramLogo,
    YoutubeLogo,
    TiktokLogo,
    LinkedinLogo
} from '@phosphor-icons/react';

interface ShortItem {
    id: string;
    title: string;
    caption: string;
    thumbnailUrl: string;
    videoUrl?: string; // Link to YouTube Shorts, TikTok, or Instagram Reel
}

const SHORTS_DATA: ShortItem[] = [
    {
        id: '1',
        title: 'Dance if you are excited about summer break 😂',
        caption: 'Dance if you are excited about the summer break 😂 #CannogaOrientation #CampusLife',
        thumbnailUrl: '/images/admissions/events.jpg',
        videoUrl: 'https://www.youtube.com/shorts/OJRQFDSUMDY'
    },
    {
        id: '2',
        title: 'Finding your textbooks just got a lot easier 📚',
        caption: 'Finding your textbooks just got a lot easier 📚 #CannogaCampus #StudentResources',
        thumbnailUrl: '/images/admissions/campus-tour.jpg',
        videoUrl: 'https://www.youtube.com/shorts/FNerZMOydps'
    },
    {
        id: '3',
        title: 'There\'s always something you will love about Cannoga College',
        caption: 'There\'s always something you will love about Cannoga College 🇨🇦✨ #CannogaLife #Ottawa',
        thumbnailUrl: '/images/admissions/student-hub.jpg',
        videoUrl: 'https://www.youtube.com/shorts/_JkrXe53EjI'
    },
    {
        id: '4',
        title: 'Meet Love, our Practical Nursing graduate 🇨🇦🎓',
        caption: 'Meet Love, our Practical Nursing graduate 🇨🇦🎓 #CannogaGrad #NursingExcellence',
        thumbnailUrl: '/images/placeholders/design.png',
        videoUrl: 'https://www.youtube.com/shorts/QorLfVUYanA'
    }
];

export function CannogaShortsSection() {
    const [mutedStates, setMutedStates] = useState<{ [key: string]: boolean }>({
        '1': true,
        '2': true,
        '3': true,
        '4': true,
    });

    const toggleMute = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setMutedStates(prev => ({ ...prev, [id]: !prev[id] }));
    };

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
                        const isMuted = mutedStates[short.id];
                        return (
                            <div key={short.id} className="flex flex-col group">
                                {/* Vertical 9:16 Video Box */}
                                <a
                                    href={short.videoUrl || 'https://youtube.com/shorts'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative aspect-[9/16] w-full bg-slate-900 rounded-sm overflow-hidden block shadow-md group-hover:shadow-xl transition-shadow"
                                >
                                    <Image
                                        src={short.thumbnailUrl}
                                        alt={short.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    />

                                    {/* Center Gold Circular Play Button */}
                                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/20 group-hover:bg-black/10 transition-colors">
                                        <div className="w-14 h-14 rounded-full bg-[#f3b233] text-white flex items-center justify-center pl-1 shadow-lg transform group-hover:scale-110 transition-transform">
                                            <Play size={26} weight="fill" />
                                        </div>
                                    </div>

                                    {/* Bottom Video Controls Overlay Bar */}
                                    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20 flex items-center justify-between text-white text-xs">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => toggleMute(short.id, e)}
                                                className="hover:text-[#f3b233] transition-colors p-1"
                                                aria-label={isMuted ? "Unmute" : "Mute"}
                                            >
                                                {isMuted ? <SpeakerSimpleSlash size={16} weight="bold" /> : <SpeakerHigh size={16} weight="bold" />}
                                            </button>
                                            <div className="w-20 h-1 bg-white/40 rounded-full overflow-hidden">
                                                <div className="w-3/4 h-full bg-[#f3b233]"></div>
                                            </div>
                                        </div>
                                        <div className="hover:text-[#f3b233] transition-colors">
                                            <CornersOut size={16} weight="bold" />
                                        </div>
                                    </div>
                                </a>

                                {/* Caption Text Below Thumbnail */}
                                <div className="mt-3 text-center px-1">
                                    <p className="text-xs text-slate-700 font-sans font-medium leading-snug line-clamp-3">
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
