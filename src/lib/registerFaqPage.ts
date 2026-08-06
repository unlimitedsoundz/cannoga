import { createClient } from '@supabase/supabase-js';

export interface FaqPage {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}

export interface FAQItem {
    id: string;
    question: string;
    answer: string;
    order_index: number;
}

/**
 * Auto-registers a FAQ page in the database
 * If the page doesn't exist, it creates it
 * If it exists, it returns the existing record
 */
export async function registerFaqPage(name: string, slug: string): Promise<FaqPage> {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // First, try to find existing page
    const { data: existingPage, error: findError } = await supabase
        .from('faq_pages')
        .select('*')
        .eq('slug', slug)
        .single();

    if (findError && findError.code !== 'PGRST116') { // PGRST116 = not found
        throw new Error(`Error finding FAQ page: ${findError.message}`);
    }

    // If page exists, return it
    if (existingPage) {
        return existingPage;
    }

    // If page doesn't exist, create it
    const { data: newPage, error: insertError } = await supabase
        .from('faq_pages')
        .insert({
            name,
            slug
        })
        .select()
        .single();

    if (insertError) {
        throw new Error(`Error creating FAQ page: ${insertError.message}`);
    }

    return newPage;
}

/**
 * Fetches FAQs for a specific page slug at build time
 */
export async function getStaticFAQs(pageSlug: string): Promise<FAQItem[]> {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // First get the page
        const { data: pageData, error: pageError } = await supabase
            .from('faq_pages')
            .select('id')
            .eq('slug', pageSlug)
            .single();

        if (pageError || !pageData) {
            console.warn(`FAQ page not found for slug: ${pageSlug}`);
            return [];
        }

        // Then get FAQs for this page
        const { data: faqs, error: faqError } = await supabase
            .from('faq')
            .select('*')
            .eq('page_id', pageData.id)
            .eq('is_published', true)
            .order('order_index');

        if (faqError) {
            console.warn(`Error fetching FAQs for page ${pageSlug}:`, faqError);
            return [];
        }

        return faqs || [];
    } catch (error) {
        console.warn(`Error in getStaticFAQs for ${pageSlug}:`, error);
        return [];
    }
}