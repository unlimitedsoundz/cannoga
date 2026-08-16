import Image from 'next/image';
import Link from 'next/link';
import { News, Event } from '@/types/database';
import NewsList from '@/components/news/NewsList';
import { createStaticClient } from '@/lib/supabase/static';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { Newspaper } from "@phosphor-icons/react/dist/ssr";
import { Hero } from '@/components/layout/Hero';

export const metadata = {
    title: 'Newsroom, Press Releases & Event Calendar',
    description: 'Explore current Ottawa campus news, academic research breakthroughs, official press releases, and upcoming events at Cannoga College.',
    alternates: {
        canonical: 'https://cannogacollege.ca/news/',
    },
};

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
            excerpt: 'Canada has become one of North America\'s premier study destinations. From world-class education to a thriving tech scene, discover why students are flocking to Ottawa.',
            imageUrl: '/images/news/why-study-in-ottawa.jpg',
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
        <div className="min-h-screen bg-white text-black antialiased font-sans pb-24">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'News & Events', item: '/news' }
            ]} />

            {/* HERO SECTION */}
            <Hero
                title="Newsroom & Event Calendar"
                body="Stay informed with campus announcements, academic breakthroughs, student achievements, and upcoming institutional events at Cannoga College."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                overlay={true}
                overlayOpacity="opacity-40"
                image={{
                    src: "/images/home-carousel-3.png",
                    alt: "Cannoga College Newsroom"
                }}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'News & Events' }
                ]}
            />

            <div className="container mx-auto max-w-5xl px-4 py-16 space-y-16">
                {/* SEARCHABLE FILTERABLE NEWS & EVENTS LIST */}
                <NewsList staticArticles={staticArticles} />

                {/* ARCHIVE DIRECTORY STYLED IN BORDERLESS ROWS */}
                {allRecent.length > 0 && (
                    <section className="pt-12 border-t border-slate-200 space-y-6">
                        <div>
                            <h2 className="text-3xl font-black text-black tracking-tight mb-2">Recent Announcements & Media Releases</h2>
                            <p className="text-slate-600 text-sm font-medium">
                                Direct links to all current campus press statements and scheduled academic symposiums.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            {allRecent.map((item: any) => {
                                const href = item.type === 'event' ? `/news/events/${item.slug}` : `/news/${item.slug}`;
                                const rawDate = item.publishDate || item.date || '';
                                const cleanDate = rawDate.includes('T') ? rawDate.split('T')[0] : rawDate.split(' ')[0];

                                return (
                                    <div key={item.id || item.slug} className="space-y-1 w-full border-b border-slate-100 pb-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <Link href={href} className="text-slate-900 font-bold text-lg leading-snug hover:text-[#c89211] transition-colors no-underline">
                                                {item.title}
                                            </Link>
                                            <span className="text-xs font-bold uppercase tracking-wider text-[#c89211] shrink-0">
                                                {item.type === 'event' ? 'Event' : 'News'}
                                            </span>
                                        </div>
                                        {cleanDate && (
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                Published: {cleanDate}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
