'use client';

import { useState, useEffect } from 'react';
import { Link } from "@aalto-dx/react-components";
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { formatToDDMMYYYY } from '@/utils/date';
import { Calendar, MapPin } from "@phosphor-icons/react";
import { Card } from '@/components/ui/Card';

interface DynamicNewsSectionProps {
    limit?: number;
    showExcerpt?: boolean;
    excludeId?: string | number;
    contentType?: 'news' | 'event' | 'blog' | 'all';
}

export default function DynamicNewsSection({ 
    limit = 9, 
    showExcerpt = true, 
    excludeId,
    contentType = 'all'
}: DynamicNewsSectionProps) {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchContent() {
            const supabase = createClient();
            let newsData: any[] = [];
            let eventsData: any[] = [];
            let blogData: any[] = [];

            // Fetch news if needed
            if (contentType === 'all' || contentType === 'news') {
                const { data } = await supabase
                    .from('News')
                    .select('*')
                    .eq('published', true)
                    .order('publishDate', { ascending: false })
                    .limit(limit);
                newsData = data || [];
            }

            // Fetch events if needed
            if (contentType === 'all' || contentType === 'event') {
                const { data } = await supabase
                    .from('Event')
                    .select('*')
                    .eq('published', true)
                    .order('date', { ascending: true })
                    .limit(limit);
                eventsData = data || [];
            }

            // Fetch blogs if needed
            if (contentType === 'blog') {
                const { data } = await supabase
                    .from('blogs')
                    .select('*')
                    .eq('published', true)
                    .order('publishDate', { ascending: false })
                    .limit(limit);
                blogData = data || [];
            }

            // Combine and sort
            let combined = [
                ...newsData.map((n: any) => ({ ...n, type: 'news', sortDate: n.publishDate })),
                ...eventsData.map((e: any) => ({ ...e, type: 'event', sortDate: e.date })),
                ...blogData.map((b: any) => ({ ...b, type: 'blog', sortDate: b.publishDate }))
            ].sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());

            // Exclude current item if needed
            if (excludeId) {
                combined = combined.filter(item => item.id !== excludeId);
            }

            setItems(combined.slice(0, limit));
            setLoading(false);
        }

        fetchContent();
    }, [limit, contentType]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex flex-col h-full bg-neutral-100 min-h-[400px]">
                        <div className="aspect-video bg-neutral-200 mb-4" />
                        <div className="p-5 space-y-4">
                            <div className="h-6 bg-neutral-200 w-3/4" />
                            <div className="h-4 bg-neutral-200 w-full" />
                            <div className="h-4 bg-neutral-200 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (items.length === 0) {
        const typeLabel = contentType === 'all' ? 'news or events' : contentType;
        return <div className="text-center py-12 text-neutral-500">No recent {typeLabel} found.</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {items.map((item) => {
                const isEvent = item.type === 'event';
                const isBlog = item.type === 'blog';
                
                let href = `/news/${item.slug}`;
                if (isEvent) href = `/news/events/${item.slug}`;
                if (isBlog) href = `https://ourblogs.cannogacollege.ca/${item.slug}`;

                const dateLabel = formatToDDMMYYYY(item.sortDate);
                let label = 'News';
                if (isEvent) label = 'Event';
                if (isBlog) label = 'Blog';

                const fallbackImage = "/images/admissions/events.jpg";

                return (
                    <Card
                        key={item.id}
                        title={item.title}
                        subtitle={
                            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black">
                                {isEvent ? <Calendar size={14} weight="bold" className="text-amber-600" /> : null}
                                <span>{dateLabel}</span>
                            </div>
                        }
                        badge={{
                            label: label,
                            className: isEvent ? 'bg-amber-500 text-black' : (isBlog ? 'bg-primary text-white' : 'bg-[#9c27b3] text-white')
                        }}
                        image={{
                            src: item.imageUrl || fallbackImage,
                            alt: item.title
                        }}
                        body={
                            showExcerpt && (
                                <div className="space-y-4">
                                    <p className="line-clamp-3">{item.excerpt || item.content?.replace(/[#*`]/g, '')}</p>
                                    {isEvent && item.location && (
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
                                            <MapPin size={12} weight="bold" />
                                            <span>{item.location}</span>
                                        </div>
                                    )}
                                </div>
                            )
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
    );
}

