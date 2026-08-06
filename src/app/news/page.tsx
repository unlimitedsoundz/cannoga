
import { Link } from "@aalto-dx/react-components";
import Image from 'next/image';
import { News, Event } from '@/types/database';
import { formatToDDMMYYYY } from '@/utils/date';
import { Calendar, MapPin, ArrowRight } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
    title: 'Newsroom, Press Releases & Event Calendar — Cannoga College',
    description: 'Keep up with current campus news, press releases, breakthroughs, and public events from Cannoga.',
    alternates: {
        canonical: 'https://cannogacollege.ca/news/',
    },
};

import { Hero } from '@/components/layout/Hero';
import NewsList from '@/components/news/NewsList';
import { createStaticClient } from '@/lib/supabase/static';
import NextLink from 'next/link';

export default async function NewsPage() {

    const supabase = createStaticClient();
    const { data: recentNews } = await supabase
        .from('News')
        .select('slug, title, publishDate')
        .eq('published', true)
        .order('publishDate', { ascending: false })
        .limit(6);

    const { data: recentEvents } = await supabase
        .from('Event')
        .select('slug, title, date')
        .eq('published', true)
        .order('date', { ascending: true })
        .limit(6);

    const staticArticles = [
        {
            id: 'static-why-study-ottawa-canada',
            title: 'Why Study in Ottawa Canada? 10 Reasons International Students Choose Ottawa',
            slug: 'why-study-in-ottawa-canada',
            excerpt: 'Canada has become one of North America\'s most attractive study destinations. From world-class education to a thriving tech scene, discover why students are flocking to Ottawa.',
            imageUrl: '/images/news/helsinki-study-hero.png',
            publishDate: '2026.02.14',
            type: 'news',
            sortDate: '2026.02.14',
            published: true,
        },
    ];

    const allRecent = [
        ...staticArticles.map(a => ({ ...a, type: 'news' as const })),
        ...(recentNews || []).map(n => ({ ...n, type: 'news' as const })),
        ...(recentEvents || []).map(e => ({ ...e, type: 'event' as const })),
    ]
        .sort((a, b) => {
            const getDate = (x: any) => new Date(x.sortDate || x.publishDate || x.date || 0).getTime();
            return getDate(b) - getDate(a);
        })
        .slice(0, 12);

    return (
        <div className="min-h-screen bg-white text-black font-sans">
            {/* HERO SECTION */}
    <Hero
                 title="News & Events"
                 body="Stay up to date with the latest stories, research breakthroughs, and upcoming events from Cannoga College."
                 backgroundColor="#ffeb3b"
                 tinted={false}
                 lightText={false}
                 breadcrumbs={[
                     { label: 'Home', href: '/' },
                     { label: 'News & Events' }
                 ]}
             />

            <div className="cc-container cc-section">
                <NewsList staticArticles={staticArticles} />
            </div>

            {allRecent.length > 0 && (
                <div className="cc-container cc-section">
                    <h2 className="text-2xl font-bold uppercase tracking-widest mb-8 text-black">All Articles</h2>
                    <ul className="space-y-4">
                        {allRecent.map((item: any) => {
                            const href = item.type === 'event' ? `/news/events/${item.slug}` : `/news/${item.slug}`;
                            return (
                                <li key={item.id || item.slug} className="border-b border-neutral-200 pb-4">
                                    <NextLink href={href} className="text-black font-bold hover:underline text-lg no-underline">
                                        {item.title}
                                    </NextLink>
                                    <span className="block text-sm text-neutral-500 mt-1">
                                        {item.type === 'event' ? 'Event' : 'News'} — {item.publishDate || item.date}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div >
    );
}

