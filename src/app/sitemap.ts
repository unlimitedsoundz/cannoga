import { MetadataRoute } from 'next';
import { createStaticClient } from '@/lib/supabase/static';

export const revalidate = 86400; // Revalidate daily

type SitemapEntry = {
    url: string;
    lastModified?: string;
    changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
};

const BASE_URL = 'https://cannogacollege.ca';

function make(url: string, changeFrequency: SitemapEntry['changeFrequency'], priority: number, lastModified?: string): SitemapEntry {
    return {
        url: url.endsWith('/') ? url : `${url}/`,
        changeFrequency,
        priority,
        ...(lastModified ? { lastModified } : {}),
    };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createStaticClient();

    // --- Static core / admissions pages ---
    const corePages: SitemapEntry[] = [
        make(`${BASE_URL}/`, 'weekly', 1.0, '2026-07-17'),
        make(`${BASE_URL}/admissions`, 'weekly', 0.9),
        make(`${BASE_URL}/admissions/bachelor`, 'monthly', 0.9),
        make(`${BASE_URL}/admissions/master`, 'monthly', 0.9),
        make(`${BASE_URL}/admissions/application-process`, 'monthly', 0.8),
        make(`${BASE_URL}/admissions/tuition`, 'monthly', 0.8),
        make(`${BASE_URL}/admissions/requirements`, 'monthly', 0.8),
        make(`${BASE_URL}/admissions/contact-information`, 'monthly', 0.8),
        make(`${BASE_URL}/admissions-policy`, 'yearly', 0.5),
        make(`${BASE_URL}/degree-programmes`, 'monthly', 0.8),
        make(`${BASE_URL}/studies`, 'weekly', 0.9),
    ];

    // --- Studies / courses (dynamic from DB) ---
    const { data: courses } = await supabase.from('Course').select('slug');
    const coursePages: SitemapEntry[] = (courses || []).map((c: { slug: string }) =>
        make(`${BASE_URL}/studies/${c.slug}`, 'monthly', 0.6)
    );

    // --- Schools & departments (dynamic from DB) ---
    const { data: schools } = await supabase.from('School').select('slug');
    const { data: departments } = await supabase
        .from('Department')
        .select('slug, school:School(slug)');

    const schoolPages: SitemapEntry[] = [
        make(`${BASE_URL}/schools`, 'monthly', 0.7),
        ...(schools || []).map((s: { slug: string }) =>
            make(`${BASE_URL}/schools/${s.slug}`, 'monthly', 0.7)
        ),
    ];

    const departmentPages: SitemapEntry[] = (departments || [])
        .filter((d: any) => d.school && (d.school as any).slug)
        .map((d: any) =>
            make(`${BASE_URL}/schools/${(d.school as any).slug}/${d.slug}`, 'monthly', 0.6)
        );

    // --- Research ---
    const { data: projects } = await supabase.from('ResearchProject').select('slug');
    const researchPages: SitemapEntry[] = [
        make(`${BASE_URL}/research`, 'monthly', 0.6),
        make(`${BASE_URL}/research/projects`, 'monthly', 0.6),
        make(`${BASE_URL}/research/publications`, 'monthly', 0.5),
        ...(projects || []).map((p: { slug: string }) =>
            make(`${BASE_URL}/research/projects/${p.slug}`, 'monthly', 0.5)
        ),
    ];

    // --- News & events ---
    const { data: news } = await supabase.from('News').select('slug');
    const { data: events } = await supabase.from('Event').select('slug');
    const newsPages: SitemapEntry[] = [
        make(`${BASE_URL}/news`, 'daily', 0.6),
        ...(news || []).map((n: { slug: string }) =>
            make(`${BASE_URL}/news/${n.slug}`, 'weekly', 0.5)
        ),
        ...(events || []).map((e: { slug: string }) =>
            make(`${BASE_URL}/news/events/${e.slug}`, 'weekly', 0.5)
        ),
    ];

    // --- Student guides & life ---
    const studentPages: SitemapEntry[] = [
        make(`${BASE_URL}/housing`, 'monthly', 0.8),
        make(`${BASE_URL}/student-guide`, 'monthly', 0.6),
        make(`${BASE_URL}/student-guide/international`, 'monthly', 0.7),
        make(`${BASE_URL}/student-guide/arrival`, 'monthly', 0.6),
        make(`${BASE_URL}/student-guide/exchange`, 'monthly', 0.6),
        make(`${BASE_URL}/student-guide/bachelor`, 'monthly', 0.6),
        make(`${BASE_URL}/student-guide/master`, 'monthly', 0.6),
        make(`${BASE_URL}/student-guide/housing-for-students`, 'monthly', 0.6),
        make(`${BASE_URL}/student-guide/chat-with-cannoga-students`, 'monthly', 0.5),
        make(`${BASE_URL}/student-life`, 'monthly', 0.5),
        make(`${BASE_URL}/student-life/cafe`, 'monthly', 0.3),
        make(`${BASE_URL}/international`, 'monthly', 0.7),
    ];

    // --- Institutional pages ---
    const institutionalPages: SitemapEntry[] = [
        make(`${BASE_URL}/about`, 'monthly', 0.5),
        make(`${BASE_URL}/contact`, 'monthly', 0.5),
        make(`${BASE_URL}/alumni`, 'monthly', 0.4),
        make(`${BASE_URL}/collaboration`, 'monthly', 0.4),
        make(`${BASE_URL}/innovation`, 'monthly', 0.4),
        make(`${BASE_URL}/art`, 'monthly', 0.3),
        make(`${BASE_URL}/academic-regulations`, 'yearly', 0.3),
        make(`${BASE_URL}/code-of-conduct`, 'yearly', 0.3),
        make(`${BASE_URL}/student-handbook`, 'yearly', 0.4),
        make(`${BASE_URL}/refund-withdrawal-policy`, 'yearly', 0.3),
        make(`${BASE_URL}/terms`, 'yearly', 0.3),
    ];

    // --- Legal & utility pages ---
    const legalPages: SitemapEntry[] = [
        make(`${BASE_URL}/privacy`, 'yearly', 0.2),
        make(`${BASE_URL}/cookies`, 'yearly', 0.2),
        make(`${BASE_URL}/accessibility`, 'yearly', 0.2),
        make(`${BASE_URL}/site-index`, 'monthly', 0.3),
    ];

    return [
        ...corePages,
        ...coursePages,
        ...schoolPages,
        ...departmentPages,
        ...researchPages,
        ...newsPages,
        ...studentPages,
        ...institutionalPages,
        ...legalPages,
    ];
}
