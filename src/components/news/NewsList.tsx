'use client';

import { useState, useEffect } from 'react';
import { Link } from "@aalto-dx/react-components";
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { formatToDDMMYYYY } from '@/utils/date';
import { Calendar, MapPin, ArrowRight, CaretLeft, CaretRight, MagnifyingGlass, Funnel, X } from "@phosphor-icons/react";
import { Card } from '@/components/ui/Card';
import { SearchField } from '@aalto-dx/react-modules';

interface NewsListProps {
    staticArticles?: any[];
}

export default function NewsList({ staticArticles = [] }: NewsListProps) {
    const [items, setItems] = useState<any[]>([]);
    const [filteredItems, setFilteredItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const itemsPerPage = 9;

    const categories = ['All', 'News', 'Events'];

    useEffect(() => {
        async function fetchContent() {
            const supabase = createClient();

            // Fetch news
            const { data: newsData, error: newsError } = await supabase
                .from('News')
                .select('*')
                .eq('published', true)
                .order('publishDate', { ascending: false });

            if (newsError) {
                console.error('Error fetching news:', newsError.message || newsError);
                console.debug('Full news error details:', newsError);
            }

            // Fetch events
            const { data: eventsData, error: eventsError } = await supabase
                .from('Event')
                .select('*')
                .eq('published', true)
                .order('date', { ascending: true });

            if (eventsError) {
                console.error('Error fetching events:', eventsError.message || eventsError);
                console.debug('Full events error details:', eventsError);
            }

            // Combine and sort
            const combined = [
                ...staticArticles,
                ...(newsData || []).map((n: any) => ({ ...n, type: 'news', sortDate: n.publishDate })),
                ...(eventsData || []).map((e: any) => ({ ...e, type: 'event', sortDate: e.date }))
            ].sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());

            setItems(combined);
            setLoading(false);
        }

        fetchContent();
    }, [staticArticles]);

    useEffect(() => {
        let filtered = items;

        // Apply Category Filter
        if (selectedCategory !== 'All') {
            const type = selectedCategory === 'News' ? 'news' : 'event';
            filtered = filtered.filter(item => item.type === type);
        }

        // Apply Search Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item => 
                item.title?.toLowerCase().includes(query) || 
                item.excerpt?.toLowerCase().includes(query) ||
                item.content?.toLowerCase().includes(query)
            );
        }

        setFilteredItems(filtered);
        setCurrentPage(1); // Reset to first page on filter change
    }, [items, selectedCategory, searchQuery]);

    // Pagination logic
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex flex-col bg-neutral-100 h-[450px]">
                        <div className="aspect-[16/9] bg-neutral-200" />
                        <div className="p-6 space-y-4">
                            <div className="h-6 bg-neutral-200 w-3/4" />
                            <div className="h-4 bg-neutral-200 w-full" />
                            <div className="h-4 bg-neutral-200 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-stretch md:items-center justify-between">
                <div className="w-full md:w-96">
                    <SearchField
                        placeholder="Search news & events..."
                        value={searchQuery}
                        onChange={(v) => setSearchQuery(v)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <div className="flex items-center gap-2 text-neutral-500 mr-2">
                        <Funnel size={18} weight="bold" />
                        <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">Filter:</span>
                    </div>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                                selectedCategory === cat
                                    ? 'bg-[#0a151a] text-white'
                                    : 'bg-white text-black hover:text-black'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {filteredItems.length === 0 ? (
                <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
                    <p className="text-neutral-500 font-medium">No results found matching your search and filters.</p>
                    <button 
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('All');
                        }}
                        className="mt-4 text-black font-bold underline"
                    >
                        Clear all filters
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentItems.map((item: any) => {
                    const isEvent = item.type === 'event';
                    const href = isEvent ? `/news/events/${item.slug}` : `/news/${item.slug}`;
                    const displayDate = formatToDDMMYYYY(item.sortDate);
                    const fallbackImage = "/images/admissions/events.jpg";

                    return (
                        <Card
                            key={item.id}
                            title={item.title}
                            subtitle={
                                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black">
                                    {isEvent ? <Calendar size={14} weight="bold" className="text-amber-600" /> : null}
                                    <span>{displayDate}</span>
                                </div>
                            }
                            badge={{
                                label: isEvent ? 'Event' : 'News',
                                className: isEvent ? 'bg-amber-500 text-black' : 'bg-[#0a151a] text-white'
                            }}
                            image={{
                                src: item.imageUrl || fallbackImage,
                                alt: item.title
                            }}
                            body={
                                <div className="space-y-4">
                                    <p>{item.excerpt || item.content?.replace(/[#*`]/g, '').slice(0, 150)}...</p>
                                    {isEvent && item.location && (
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
                                            <MapPin size={12} weight="bold" />
                                            <span>{item.location}</span>
                                        </div>
                                    )}
                                </div>
                            }
                            cta={{
                                label: "Read more",
                                linkComponentProps: {
                                    href: href
                                }
                            }}
                        />
                    );
                })}
                </div>
            )}

            {/* Pagination Navigation */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-8">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 bg-neutral-100 hover:bg-[#0a151a] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-neutral-100 disabled:hover:text-black cursor-pointer disabled:cursor-not-allowed"
                    >
                        <CaretLeft size={20} weight="bold" />
                    </button>

                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }).map((_, i) => {
                            const pageNumber = i + 1;
                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`w-10 h-10 flex items-center justify-center font-bold transition-all ${currentPage === pageNumber
                                            ? 'bg-[#0a151a] text-white'
                                            : 'bg-neutral-100 text-black hover:bg-neutral-200'
                                        }`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 bg-neutral-100 hover:bg-[#0a151a] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-neutral-100 disabled:hover:text-black cursor-pointer disabled:cursor-not-allowed"
                    >
                        <CaretRight size={20} weight="bold" />
                    </button>
                </div>
            )}
        </div>
    );
}

