'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

// Footer brand colour used as accent
const ACCENT = '#0a151a';

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return {
        month: d.toLocaleString('en-CA', { month: 'short' }).toUpperCase(),
        day: d.getDate(),
        full: d.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' }),
    };
}

// Static fallback important dates when DB has no events
const FALLBACK_DATES = [
    { id: 'f1', category: 'CURRENT STUDENTS', title: 'Fall Semester Registration Opens', date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2).toISOString(), slug: '' },
    { id: 'f2', category: 'ALL STUDENTS', title: 'Orientation Week — Ottawa Campus', date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7).toISOString(), slug: '' },
    { id: 'f3', category: 'INTERNATIONAL', title: 'IRCC Study Permit Deadline Reminder', date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 14).toISOString(), slug: '' },
    { id: 'f4', category: 'CURRENT STUDENTS', title: 'Last Day to Add/Drop Courses', date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 21).toISOString(), slug: '' },
];

const FALLBACK_NEWS = [
    { id: 'n1', title: 'Cannoga College Recognized as Top Ontario Institution for Graduate Employment', publishDate: new Date().toISOString(), excerpt: 'The latest Ministry of Colleges survey confirms Cannoga graduates lead provincial employment outcomes, with a 94% placement rate within six months.', slug: 'cannoga-graduate-employment-2026', imageUrl: '' },
    { id: 'n2', title: 'New Partnerships Announced with Ottawa Tech Sector for Co-op Placements', publishDate: new Date(Date.now() - 86400000 * 3).toISOString(), excerpt: 'Eight leading Ottawa employers have signed co-op agreements to host Cannoga College students across engineering, business, and technology programs.', slug: 'ottawa-coop-partnerships', imageUrl: '' },
];

export function HomeNewsEventsGrid() {
    const [news, setNews] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                const supabase = createClient();
                const { data: newsData } = await supabase.from('News').select('*').eq('published', true).order('publishDate', { ascending: false }).limit(5);
                const { data: eventsData } = await supabase.from('Event').select('*').eq('published', true).order('date', { ascending: true }).limit(4);
                setNews(newsData && newsData.length > 0 ? newsData : FALLBACK_NEWS);
                setEvents(eventsData && eventsData.length > 0 ? eventsData : FALLBACK_DATES);
            } catch {
                setNews(FALLBACK_NEWS);
                setEvents(FALLBACK_DATES);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const prev = useCallback(() => setActiveIndex(i => (i === 0 ? Math.max(0, (news.length || 1) - 1) : i - 1)), [news.length]);
    const next = useCallback(() => setActiveIndex(i => (i >= (news.length || 1) - 1 ? 0 : i + 1)), [news.length]);

    const activeNews = news[activeIndex] || null;

    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 items-stretch animate-pulse">
                <div className="lg:col-span-2 bg-neutral-100 h-[480px]" />
                <div className="bg-[#0a151a] h-[480px]" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 items-stretch border border-neutral-200 shadow-sm overflow-hidden">

            {/* ── LEFT: News Carousel ── */}
            <div className="lg:col-span-2 flex flex-col bg-white">
                {/* Header row */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                        <span style={{ color: ACCENT }}>New</span> and Notable
                    </h3>
                    <a href="/news" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors no-underline">
                        VIEW MORE NEWS →
                    </a>
                </div>

                {/* Carousel body */}
                <div className="relative flex-1 flex flex-col">
                    {/* Image */}
                    <div className="relative overflow-hidden bg-slate-200" style={{ minHeight: '240px', maxHeight: '280px' }}>
                        {activeNews?.imageUrl ? (
                            <img src={activeNews.imageUrl} alt={activeNews.title} className="w-full h-full object-cover" style={{ minHeight: '240px', maxHeight: '280px' }} />
                        ) : (
                            <div className="w-full flex items-center justify-center bg-slate-100" style={{ minHeight: '240px' }}>
                                <div className="text-center p-6">
                                    <div className="text-5xl mb-2">📰</div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Cannoga College News</p>
                                </div>
                            </div>
                        )}

                        {/* Carousel arrows */}
                        {news.length > 1 && (
                            <>
                                <button
                                    onClick={prev}
                                    aria-label="Previous"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white border border-neutral-200 flex items-center justify-center shadow transition-all"
                                >
                                    <CaretLeft size={18} weight="bold" />
                                </button>
                                <button
                                    onClick={next}
                                    aria-label="Next"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white border border-neutral-200 flex items-center justify-center shadow transition-all"
                                >
                                    <CaretRight size={18} weight="bold" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Article content */}
                    {activeNews && (
                        <div className="p-6 flex-1 flex flex-col justify-between border-b border-neutral-200">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                    {formatDate(activeNews.publishDate || activeNews.date || new Date().toISOString()).full}
                                </p>
                                <a
                                    href={`/news/${activeNews.slug}`}
                                    className="block font-black text-base leading-snug mb-3 hover:underline transition-colors no-underline uppercase tracking-tight"
                                    style={{ color: ACCENT }}
                                >
                                    {activeNews.title}
                                </a>
                                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                                    {activeNews.excerpt || activeNews.description || 'Read the full story on the Cannoga College news portal.'}
                                </p>
                            </div>
                            <a
                                href={`/news/${activeNews.slug}`}
                                className="mt-4 self-start inline-block border border-slate-900 text-slate-900 text-xs font-bold uppercase tracking-widest px-5 py-2 hover:bg-slate-900 hover:text-white transition-colors no-underline"
                            >
                                Read More
                            </a>
                        </div>
                    )}

                    {/* Pagination dots */}
                    {news.length > 1 && (
                        <div className="flex items-center justify-center gap-2 py-4">
                            {news.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    className="transition-all"
                                    style={{
                                        width: i === activeIndex ? 20 : 10,
                                        height: 10,
                                        background: i === activeIndex ? ACCENT : '#cbd5e1',
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── RIGHT: Important Dates ── */}
            <div className="flex flex-col" style={{ background: ACCENT }}>
                {/* Header */}
                <div className="px-6 py-5 border-b border-white/10">
                    <h3 className="text-lg font-black text-white tracking-tight uppercase">Important Dates</h3>
                </div>

                {/* Date entries */}
                <div className="flex-1">
                    {events.map((ev) => {
                        const d = formatDate(ev.date || ev.publishDate || new Date().toISOString());
                        return (
                            <a
                                key={ev.id}
                                href={ev.slug ? `/news/events/${ev.slug}` : '/news'}
                                className="flex items-start gap-4 px-6 py-5 hover:bg-white/5 transition-colors no-underline group"
                            >
                                {/* Date block */}
                                <div className="shrink-0 text-white text-center w-14">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">{d.month}</div>
                                    <div className="text-4xl font-black leading-none text-white">{d.day}</div>
                                </div>
                                {/* Divider */}
                                <div className="w-px self-stretch bg-white/20 shrink-0" />
                                {/* Content */}
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">
                                        {ev.category || ev.type || 'CURRENT STUDENTS'}
                                    </p>
                                    <p className="text-sm font-black text-white uppercase leading-snug group-hover:underline">
                                        {ev.title}
                                    </p>
                                </div>
                            </a>
                        );
                    })}
                </div>

                {/* Footer CTA */}
                <div className="px-6 py-5 border-t border-white/10">
                    <a
                        href="/news"
                        className="inline-block border border-white text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 hover:bg-white transition-colors no-underline"
                        style={{ color: 'white' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = ACCENT; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'white'; }}
                    >
                        View More
                    </a>
                </div>
            </div>

        </div>
    );
}
