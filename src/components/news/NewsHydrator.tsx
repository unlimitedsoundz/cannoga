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
        setNews(initialNews);
    }, [initialNews]);

    return <>{children(news)}</>;
}
