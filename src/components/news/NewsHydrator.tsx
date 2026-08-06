'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { News } from '@/types/database';

interface NewsHydratorProps {
    initialNews: News;
    children: (news: News) => React.ReactNode;
}

export default function NewsHydrator({ initialNews, children }: NewsHydratorProps) {
    const [news, setNews] = useState<News>(initialNews);

    useEffect(() => {
        async function fetchLatest() {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('News')
                .select('*')
                .eq('id', initialNews.id)
                .single();

            if (data && !error) {
                // Only update if there's a meaningful change (content or title)
                if (data.content !== initialNews.content || data.title !== initialNews.title) {
                    setNews(data as News);
                }
            }
        }

        fetchLatest();
    }, [initialNews.id, initialNews.content]);

    return <>{children(news)}</>;
}
