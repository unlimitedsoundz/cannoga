import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SchemaLD } from '@/components/seo/SchemaLD';
import { FlipbookViewer } from '@/components/flipbook/FlipbookViewer';
import { getPublicationBySlug, ALL_PUBLICATIONS } from '@/lib/flipbook/publication-config';

interface EditionPageProps {
    params: Promise<{
        edition: string;
    }>;
}

export async function generateStaticParams() {
    return ALL_PUBLICATIONS.map((pub) => ({
        edition: pub.slug,
    }));
}

export async function generateMetadata({ params }: EditionPageProps): Promise<Metadata> {
    const { edition } = await params;
    const publication = getPublicationBySlug(edition);

    if (!publication) {
        return {
            title: 'Viewbook Edition Not Found | Cannoga College',
        };
    }

    return {
        title: `${publication.title} | Cannoga College`,
        description: publication.description,
        alternates: {
            canonical: `https://cannogacollege.ca/viewbook/${publication.slug}`,
        },
        openGraph: {
            title: publication.title,
            description: publication.description,
            url: `https://cannogacollege.ca/viewbook/${publication.slug}`,
            images: [
                {
                    url: `https://cannogacollege.ca${publication.ogImage}`,
                    width: 1200,
                    height: 1200,
                    alt: publication.title
                }
            ],
            type: 'article',
        }
    };
}

export default async function EditionViewbookPage({ params }: EditionPageProps) {
    const { edition } = await params;
    const publication = getPublicationBySlug(edition);

    if (!publication) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#050b0e] text-white flex flex-col">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Viewbook', item: '/viewbook' },
                { name: publication.edition, item: `/viewbook/${publication.slug}` }
            ]} />

            <SchemaLD data={{
                "@context": "https://schema.org",
                "@type": "DigitalDocument",
                "name": publication.title,
                "headline": `${publication.edition} Academic Prospectus`,
                "description": publication.description,
                "url": `https://cannogacollege.ca/viewbook/${publication.slug}`,
                "author": {
                    "@type": "EducationalOrganization",
                    "name": "Cannoga College",
                    "url": "https://cannogacollege.ca"
                }
            }} />

            <Suspense fallback={<div className="min-h-screen bg-[#050b0e] flex items-center justify-center text-white text-sm font-semibold">Loading Viewbook...</div>}>
                <FlipbookViewer publication={publication} />
            </Suspense>
        </main>
    );
}
