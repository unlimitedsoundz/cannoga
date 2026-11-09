'use client';

import { createElement, useEffect, useState, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';

interface DbPageContentProps {
    pageSlug: string;
    sectionKey: string;
    fallbackContent: string;
    className?: string;
    tagName?: keyof JSX.IntrinsicElements;
    style?: React.CSSProperties;
    skipDbFetch?: boolean;
}

// Module-level cache & in-flight request deduplication per pageSlug
const pageContentCache = new Map<string, Promise<Record<string, string>>>();

function fetchPageSections(supabase: ReturnType<typeof createClient>, pageSlug: string): Promise<Record<string, string>> {
    const cached = pageContentCache.get(pageSlug);
    if (cached) return cached;

    const promise = (async () => {
        try {
            const { data, error } = await supabase
                .from('page_content')
                .select('section_key, content')
                .eq('page_slug', pageSlug)
                .limit(100);

            if (error || !data) return {};
            const map: Record<string, string> = {};
            for (const row of data) {
                if (row.section_key && row.content) {
                    map[row.section_key] = row.content;
                }
            }
            return map;
        } catch (err) {
            console.error('Failed to load page content:', err);
            pageContentCache.delete(pageSlug);
            return {};
        }
    })();

    pageContentCache.set(pageSlug, promise);
    return promise;
}

export default function DbPageContent({
    pageSlug,
    sectionKey,
    fallbackContent,
    className,
    tagName = 'div',
    style,
    skipDbFetch = false,
}: DbPageContentProps) {
    const sanitize = (text: string) => {
        if (pageSlug === 'admissions/master' && sectionKey === 'study_options_content') {
            return text
                .replace(/<div class="grid md:grid-cols-2 lg:grid-cols-3[\s\S]*?<\/div>\s*<\/div>/gi, '')
                .replace(/<p[^>]*>You can find all Cannoga College study options on the[\s\S]*?<\/p>/gi, '')
                .replace(/<p[^>]*>Explore our postgraduate study options in the interactive carousel[\s\S]*?<\/p>/gi, '');
        }
        return text;
    };
    const [content, setContent] = useState(() => sanitize(fallbackContent));

    const supabase = useMemo(() => typeof window !== 'undefined' ? createClient() : null, []);

    useEffect(() => {
        if (!supabase || skipDbFetch) return;
        let mounted = true;

        fetchPageSections(supabase, pageSlug).then((sections) => {
            if (mounted && sections[sectionKey]) {
                setContent(sanitize(sections[sectionKey]));
            }
        });

        return () => {
            mounted = false;
        };
    }, [pageSlug, sectionKey, supabase, skipDbFetch]);

    return createElement(tagName, {
        className: `${className || ''} ck-content`,
        style,
        dangerouslySetInnerHTML: { __html: content },
    });
}
