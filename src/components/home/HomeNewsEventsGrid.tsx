'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export function HomeNewsEventsGrid() {
    const [news, setNews] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const supabase = createClient();
                
                // Fetch news
                const { data: newsData } = await supabase
                    .from('News')
                    .select('*')
                    .eq('published', true)
                    .order('publishDate', { ascending: false })
                    .limit(4);

                // Fetch events
                const { data: eventsData } = await supabase
                    .from('Event')
                    .select('*')
                    .eq('published', true)
                    .order('date', { ascending: true })
                    .limit(4);

                setNews(newsData || []);
                setEvents(eventsData || []);
            } catch (err) {
                console.error('Error fetching news/events:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Render skeleton loaders if fetching
    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex flex-col bg-white border border-neutral-300 h-96">
                        <div className="bg-[#555] h-12 w-full" />
                        <div className="p-6 flex-1 space-y-6">
                            <div className="h-6 bg-neutral-200 w-3/4" />
                            <div className="h-6 bg-neutral-200 w-5/6" />
                            <div className="h-6 bg-neutral-200 w-2/3" />
                        </div>
                        <div className="bg-[#ececec] h-12 border-t border-neutral-300 w-full" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Column 1: News */}
            <div className="flex flex-col bg-white border border-neutral-300">
                <div className="bg-[#555] text-white py-3 px-5 font-bold text-lg uppercase tracking-wider">
                    News
                </div>
                <div className="flex-1 flex flex-col justify-start">
                    {news.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center p-8 text-neutral-500 font-semibold">
                            No news available
                        </div>
                    ) : (
                        <ul className="divide-y divide-neutral-200">
                            {news.map((item) => (
                                <li key={item.id} className="py-4 px-5">
                                    <a
                                        href={`/news/${item.slug}`}
                                        className="text-[#000000] font-bold hover:underline hover:text-[#000000] leading-snug block transition-colors"
                                    >
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="bg-[#ececec] border-t border-neutral-300 py-3 px-5">
                    <a
                        href="/news"
                        className="text-neutral-700 font-bold hover:text-black flex items-center gap-1.5 text-sm transition-colors no-underline"
                    >
                        <span>▶ View All News</span>
                    </a>
                </div>
            </div>

            {/* Column 2: Important Dates */}
            <div className="flex flex-col bg-white border border-neutral-300">
                <div className="bg-[#555] text-white py-3 px-5 font-bold text-lg uppercase tracking-wider">
                    Important Dates
                </div>
                <div className="flex-1 flex flex-col justify-center items-center p-8 text-center">
                    <span className="text-[#000000] font-semibold text-lg">
                        No upcoming events
                    </span>
                </div>
                <div className="bg-[#ececec] border-t border-neutral-300 py-3 px-5">
                    <a
                        href="/news"
                        className="text-neutral-700 font-bold hover:text-black flex items-center gap-1.5 text-sm transition-colors no-underline"
                    >
                        <span>▶ View All Important Dates</span>
                    </a>
                </div>
            </div>

            {/* Column 3: CC Events */}
            <div className="flex flex-col bg-white border border-neutral-300">
                <div className="bg-[#555] text-white py-3 px-5 font-bold text-lg uppercase tracking-wider">
CC Events
                </div>
                <div className="flex-1 flex flex-col justify-start">
                    {events.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center p-8 text-[#000000] font-semibold text-lg text-center">
                            No upcoming events
                        </div>
                    ) : (
                        <ul className="divide-y divide-neutral-200">
                            {events.map((item) => (
                                <li key={item.id} className="py-4 px-5">
                                    <a
                                        href={`/news/events/${item.slug}`}
                                        className="text-[#000000] font-bold hover:underline hover:text-[#000000] leading-snug block transition-colors"
                                    >
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="bg-[#ececec] border-t border-neutral-300 py-3 px-5">
                    <a
                        href="/news"
                        className="text-neutral-700 font-bold hover:text-black flex items-center gap-1.5 text-sm transition-colors no-underline"
                    >
                        <span>▶ View All Events</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
