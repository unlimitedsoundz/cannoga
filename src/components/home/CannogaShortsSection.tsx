'use client';

import React, { useState, useEffect } from 'react';
import {
    YoutubeLogo,
    TiktokLogo,
    CircleNotch,
    ArrowDown,
    Play
} from '@phosphor-icons/react';

interface ShortItem {
    id: string;
    title: string;
    caption: string;
    videoId: string;
    publishedAt?: string;
    views?: string;
    thumbnailUrl?: string;
}

const FALLBACK_SHORTS: ShortItem[] = [
    {
        id: 'b-VP-yWxKZg',
        title: "Update of Ariana's 1 month journey so far at Cannoga College ❤️",
        caption: "Update of Ariana's 1 month journey so far at Cannoga College ❤️ #CannogaCollege #Ottawa #CampusLife",
        videoId: 'b-VP-yWxKZg',
        views: '62 views'
    },
    {
        id: '87Y3tSEXQ4o',
        title: 'International student orientation and onboarding ongoing. Visit the administrative office 9am-4pm',
        caption: 'International student orientation and onboarding ongoing. Visit the administrative office 9am-4pm #CannogaCollege #Ottawa #CampusLife',
        videoId: '87Y3tSEXQ4o',
        views: '20 views'
    },
    {
        id: 'b0muxfZzSPg',
        title: 'Orientation in 1 week ❤️',
        caption: 'Orientation in 1 week ❤️ #CannogaCollege #Ottawa #CampusLife',
        videoId: 'b0muxfZzSPg'
    },
    {
        id: 'MdUR4hCTXw8',
        title: "it's fraud prevention week💡 🚨",
        caption: "it's fraud prevention week💡 🚨 #CannogaCollege #Ottawa #CampusLife",
        videoId: 'MdUR4hCTXw8',
        views: '1.3K views'
    }
];

export function CannogaShortsSection() {
    const [shorts, setShorts] = useState<ShortItem[]>(FALLBACK_SHORTS);
    const [page, setPage] = useState(1);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Initial fetch on component mount
    useEffect(() => {
        let isMounted = true;

        async function fetchInitialShorts() {
            try {
                const res = await fetch('/api/shorts/?page=1&limit=4', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    if (isMounted && data.shorts && data.shorts.length > 0) {
                        setShorts(data.shorts);
                        setHasMore(data.hasMore);
                        setPage(1);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch shorts:', err);
            } finally {
                if (isMounted) setIsLoadingInitial(false);
            }
        }

        fetchInitialShorts();

        return () => {
            isMounted = false;
        };
    }, []);

    // Load more shorts
    const handleLoadMore = async () => {
        if (isLoadingMore || !hasMore) return;
        setIsLoadingMore(true);

        const nextPage = page + 1;
        try {
            const res = await fetch(`/api/shorts/?page=${nextPage}&limit=4`, { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                if (data.shorts && data.shorts.length > 0) {
                    setShorts(prev => [...prev, ...data.shorts]);
                    setHasMore(data.hasMore);
                    setPage(nextPage);
                } else {
                    setHasMore(false);
                }
            }
        } catch (err) {
            console.error('Failed to load more shorts:', err);
        } finally {
            setIsLoadingMore(false);
        }
    };

    return (
        <section className="relative bg-[#d6f5eb] pt-14 pb-16 sm:py-24 text-slate-900">
            {/* Top Random Wavy Edge */}
            <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none z-10 -translate-y-[calc(100%-4px)] pointer-events-none">
                <svg viewBox="0 0 1440 90" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10 sm:h-14 md:h-20 text-[#d6f5eb] fill-current block scale-y-[1.05] origin-bottom">
                    <path d="M0,60 C150,15 320,80 500,25 C680,85 850,20 1020,70 C1200,10 1350,65 1440,30 V100 H0 Z" />
                </svg>
            </div>

            <div className="container mx-auto px-4 md:px-12 lg:px-20 max-w-7xl relative z-20">

                {/* Header Row with Title & Social Follow Icons */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
                    <div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight text-[#0a151a] flex flex-wrap items-baseline gap-x-2 gap-y-1">
                            <span className="text-[#0a151a]">Cannoga Shorts:</span>
                            <span className="font-normal text-slate-800">Campus Life in Motion</span>
                        </h2>
                    </div>

                    <div className="flex items-center justify-between sm:justify-start gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#0a151a]">FOLLOW US</span>
                        <div className="flex items-center gap-4 text-[#0a151a]">
                            <a href="https://youtube.com/@cannogacollege" target="_blank" rel="noopener noreferrer" className="hover:text-[#c89211] hover:scale-110 transition-all transform inline-block" aria-label="YouTube">
                                <YoutubeLogo size={24} weight="fill" />
                            </a>
                            <a href="https://www.tiktok.com/@cannoga_college" target="_blank" rel="noopener noreferrer" className="hover:text-[#c89211] hover:scale-110 transition-all transform inline-block" aria-label="TikTok">
                                <TiktokLogo size={24} weight="fill" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Vertical 9:16 Shorts Grid with Dynamic Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {shorts.map((short, idx) => (
                        <div
                            key={`${short.id}-${idx}`}
                            className="flex flex-col group w-full transition-all duration-300 animate-fadeIn"
                        >
                            {/* Vertical 9:16 Direct Embedded YouTube Video Box */}
                            <div className="relative aspect-[9/16] w-full bg-black rounded-xl overflow-hidden block shadow-md group-hover:shadow-2xl transition-all duration-300 border border-slate-800">
                                <iframe
                                    src={`https://www.youtube.com/embed/${short.videoId}?rel=0&modestbranding=1`}
                                    title={short.title}
                                    className="w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    loading="lazy"
                                />
                            </div>

                            {/* Caption Text Below Video */}
                            <div className="mt-3 text-center px-1">
                                <p className="text-xs text-slate-800 font-sans font-semibold leading-snug line-clamp-2 group-hover:text-black transition-colors">
                                    {short.caption}
                                </p>
                                {short.views && (
                                    <p className="text-[11px] font-medium text-slate-500 mt-1">
                                        {short.views}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Skeletons while initial loading */}
                    {isLoadingInitial && shorts.length === 0 && (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex flex-col animate-pulse">
                                <div className="aspect-[9/16] w-full bg-slate-300/80 rounded-xl" />
                                <div className="h-4 bg-slate-300/80 rounded mt-3 w-3/4 mx-auto" />
                            </div>
                        ))
                    )}
                </div>

                {/* Load More Button & Channel Link Section */}
                <div className="mt-10 sm:mt-12 flex flex-col items-center justify-center gap-3">
                    {hasMore ? (
                        <button
                            onClick={handleLoadMore}
                            disabled={isLoadingMore}
                            className="inline-flex items-center gap-2.5 bg-[#0a151a] hover:bg-black text-white px-7 py-3.5 rounded-full font-bold text-sm shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 cursor-pointer"
                        >
                            {isLoadingMore ? (
                                <>
                                    <CircleNotch size={18} className="animate-spin text-white" />
                                    <span>Loading Shorts...</span>
                                </>
                            ) : (
                                <>
                                    <ArrowDown size={18} weight="bold" />
                                    <span>Load More Shorts</span>
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="text-center">
                            <p className="text-xs font-semibold text-slate-600 mb-2">You&apos;ve viewed all featured shorts!</p>
                            <a
                                href="https://youtube.com/@cannogacollege"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0a151a] hover:text-[#c89211] underline transition-colors"
                            >
                                <YoutubeLogo size={18} weight="fill" />
                                Explore more videos on YouTube &rarr;
                            </a>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}
