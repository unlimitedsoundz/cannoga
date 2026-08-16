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

        async function loadPageContent() {
            try {
                const { data, error } = await supabase!
                    .from('page_content')
                    .select('content')
                    .eq('page_slug', pageSlug)
                    .eq('section_key', sectionKey)
                    .single();

                if (!error && data?.content && mounted) {
                    setContent(data.content);
                }
            } catch (err) {
                console.error('Failed to load page content:', err);
            }
        }

        loadPageContent();

        // ── Realtime Subscription: Instantly reflect edits made from /sis/admin/website/page-contents/ without page refresh ──
        const channelName = `realtime:page_content:${pageSlug.replace(/[^a-zA-Z0-9]/g, '_')}:${sectionKey.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const channel = supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'page_content',
                    filter: `page_slug=eq.${pageSlug}`,
                },
                (payload: any) => {
                    const newRow = payload.new;
                    if (newRow && newRow.section_key === sectionKey && mounted) {
                        setContent(newRow.content || '');
                    }
                }
            )
            .subscribe();

        return () => {
            mounted = false;
            supabase.removeChannel(channel);
        };
    }, [pageSlug, sectionKey, supabase, skipDbFetch]);

    return createElement(tagName, {
        className: `${className || ''} ck-content`,
        style,
        dangerouslySetInnerHTML: { __html: content },
    });
}
