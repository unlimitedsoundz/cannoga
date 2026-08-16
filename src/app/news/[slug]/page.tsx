 
import { createStaticClient } from '@/lib/supabase/static';

// Revalidate every hour; admin mutations call revalidatePath() for immediate updates.
export const revalidate = 3600;
import Link from 'next/link';
import Image from 'next/image';
import { News } from '@/types/database';
import { notFound } from 'next/navigation';
import { formatToDDMMYYYY } from '@/utils/date';
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";
import NewsDetailClient from '@/components/news/NewsDetailClient';

interface Props {
    params: Promise<{
        slug: string;
    }>;
}


export const dynamicParams = true;

export async function generateStaticParams() {
    const supabase = createStaticClient();
    const { data: news } = await supabase.from('News').select('slug');
    return (news || []).map((item) => ({
        slug: item.slug,
    }));
}

export async function generateMetadata({ params }: Props) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const supabase = createStaticClient();

    const { data: news } = await supabase
        .from('News')
        .select('title, excerpt')
        .eq('slug', slug)
        .single();

    if (!news) return { title: 'News Not Found' };

    return {
        title: `${news.title} Institutional News`,
        description: `Read the latest update from Cannoga College: ${news.excerpt?.substring(0, 120) || ''}`,
        alternates: {
            canonical: `https://cannogacollege.ca/news/${slug}/`,
        },
    };
}

export default async function NewsArticlePage({ params }: Props) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const supabase = createStaticClient();

    const { data: newsItem, error } = await supabase
        .from('News')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !newsItem) {
        if (error?.code !== 'PGRST116') console.error('Error fetching news:', error);
        notFound();
    }

    const item = newsItem as News;

    return <NewsDetailClient initialNews={item} />;
}
