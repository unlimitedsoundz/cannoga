'use client';

import { useEffect, useState, useMemo, type ReactNode } from 'react';
import { createClient } from '@/utils/supabase/client';
import FAQ, { type FAQItem } from '@/components/FAQ';

interface DbFAQProps {
    pageSlug: string;
    fallbackFaqs?: FAQItem[];
    refreshKey?: string | number;
}

export default function DbFAQ({ pageSlug, fallbackFaqs, refreshKey }: DbFAQProps) {
    const sanitize = (text: string) => {
        let cleaned = text;
        cleaned = cleaned
            .replace(/European Union \(EU\), European Economic Area \(EEA\), or Switzerland/gi, 'Canada')
            .replace(/European Union \(EU\)/gi, 'Canada')
            .replace(/European Economic Area \(EEA\)/gi, 'Canada')
            .replace(/European Economic Area/gi, 'Canada')
            .replace(/European Union/gi, 'Canada')
            .replace(/EU\/EEA/gi, 'Domestic')
            .replace(/long-term resident's EU study permit \(P-EU\)/gi, 'Permanent Resident (PR) status')
            .replace(/EU study permit/gi, 'Canadian study permit')
            .replace(/EU Blue Card issued in Canada/gi, 'Canadian Work Permit')
            .replace(/EU Family Member's Residence Card/gi, 'Canadian Permanent Resident card')
            .replace(/P-EU/gi, 'PR')
            .replace(/European Health Insurance Card \(EHIC\): For EU citizens/gi, 'Provincial Health Insurance (OHIP): For eligible Ontario residents')
            .replace(/European Health Insurance Card \(EHIC\)/gi, 'provincial health insurance')
            .replace(/EU citizens/gi, 'Domestic students')
            .replace(/non-EU/gi, 'international');

        if (pageSlug === 'admissions/tuition') {
            return cleaned
                .replace(/Flywire/gi, 'our secure payment gateway')
                .replace(/https:\/\/www\.flywire\.com\//gi, '#')
                .replace(/Cannoga College/gi, 'Cannoga College')
                .replace(/Cannoga/gi, 'Cannoga College')
                .replace(/Ottawa, Canada/gi, 'Ottawa, Ontario, Canada')
                .replace(/Ottawa Canada/gi, 'Ottawa, Ontario, Canada')
                .replace(/\bOttawa\b/gi, 'Ottawa')
                .replace(/\bCanada\b/gi, 'Canada');
        }
        if (pageSlug === 'admissions/application-process') {
            return cleaned
                .replace(/Algonquin College/gi, 'Cannoga College')
                .replace(/Algonquin/gi, 'Cannoga College')
                .replace(/https:\/\/www\.algonquincollege\.com\//gi, 'https://cannogacollege.ca/')
                .replace(/https:\/\/www\.algonquincollege\.ca\//gi, 'https://cannogacollege.ca/');
        }

        // Remove Motivation letter, Recommendation letter, and CV mentions from FAQ text
        cleaned = cleaned
            .replace(/,\s*motivation letter/gi, '')
            .replace(/motivation letter and\s*/gi, '')
            .replace(/motivation letter/gi, 'academic documents')
            .replace(/letters of recommendation and\s*/gi, '')
            .replace(/,\s*letters of recommendation/gi, '')
            .replace(/letters of recommendation/gi, 'academic transcripts')
            .replace(/letter of recommendation/gi, 'academic transcript')
            .replace(/,\s*CV\/Resume/gi, '')
            .replace(/CV\/Resume and\s*/gi, '')
            .replace(/CV\/Resume/gi, 'academic records')
            .replace(/,\s*curriculum vitae/gi, '')
            .replace(/curriculum vitae/gi, 'academic records')
            .replace(/,\s*CV/gi, '')
            .replace(/CV and\s*/gi, '')
            .replace(/\bCV\b/g, 'academic records')
            .replace(/\bResume\b/g, 'academic records');

        return cleaned;
    };

    const dedupeFaqs = (items: FAQItem[]) => {
        const seen = new Set<string>();
        const unique: FAQItem[] = [];

        for (const item of items) {
            const cleanQ = (item.question || '')
                .toString()
                .trim()
                .toLowerCase()
                .replace(/[^\w\s]/g, '')
                .replace(/\s+/g, ' ');
            if (!cleanQ) continue;
            if (seen.has(cleanQ)) continue;
            seen.add(cleanQ);
            unique.push(item);
        }

        return unique;
    };

    const [faqs, setFaqs] = useState<FAQItem[]>(() => {
        const items = fallbackFaqs || [];
        if (pageSlug === 'admissions/tuition') {
            return dedupeFaqs(items.map(faq => ({
                ...faq,
                question: sanitize(faq.question),
                answer: sanitize(faq.answer as string)
            })));
        }
        return items;
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = useMemo(() => typeof window !== 'undefined' ? createClient() : null, []);

    useEffect(() => {
        if (!supabase) return;
        let mounted = true;

        async function loadFaqs() {
            setLoading(true);
            setError(null);

            try {
                const { data: pageData, error: pageError } = await supabase!
                    .from('faq_pages')
                    .select('id')
                    .eq('slug', pageSlug)
                    .single();

                if (pageError || !pageData || !supabase) {
                    if (mounted) setLoading(false);
                    return;
                }

                const { data: faqData, error: faqError } = await supabase
                    .from('faq')
                    .select('id, question, answer, order_index')
                    .eq('page_id', pageData.id)
                    .eq('is_published', true)
                    .order('order_index');

                if (!faqError && mounted) {
                    const sanitizedFaqs = dedupeFaqs((faqData || []).map((faq: { id: string; question: string; answer: string; order_index?: number }) => ({
                        ...faq,
                        question: sanitize(faq.question),
                        answer: sanitize(faq.answer)
                    })));
                    setFaqs(sanitizedFaqs);
                }
            } catch (loadError) {
                console.error('Failed to load FAQs:', loadError);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }
        loadFaqs();

        return () => {
            mounted = false;
        };
    }, [pageSlug, refreshKey]);

    const displayFaqs = dedupeFaqs(faqs.length > 0 ? faqs : fallbackFaqs || []);

    if (loading) {
        return (
            <div className="bg-white p-8 text-center text-black">
                Loading FAQs...
            </div>
        );
    }

    if (error && displayFaqs.length === 0) {
        return (
            <div className="bg-white p-8 text-center text-black">
                {error}
            </div>
        );
    }

    return <FAQ faqs={displayFaqs} />;
}
