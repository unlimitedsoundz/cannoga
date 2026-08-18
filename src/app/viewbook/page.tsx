import { Suspense } from 'react';
import { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SchemaLD } from '@/components/seo/SchemaLD';
import { FlipbookViewer } from '@/components/flipbook/FlipbookViewer';
import { CANNOGA_VIEWBOOK_2026_2027 } from '@/lib/flipbook/publication-config';

export const metadata: Metadata = {
    title: '2026/2027 Digital Viewbook | Cannoga College',
    description: 'Explore Cannoga College academic programs, degree pathways, student services, tuition fees, scholarships, and admissions guide in Ottawa, Ontario, Canada.',
    alternates: {
        canonical: 'https://cannogacollege.ca/viewbook',
    },
    openGraph: {
        title: 'Cannoga College 2026/2027 Viewbook',
        description: 'Explore programs, admissions, tuition fees, and campus life in our interactive digital publication.',
        url: 'https://cannogacollege.ca/viewbook',
        siteName: 'Cannoga College',
        images: [
            {
                url: 'https://cannogacollege.ca/images/viewbook-cover-og.jpg',
                width: 1200,
                height: 1200,
                alt: 'Cannoga College 2026/2027 Viewbook Cover'
            }
        ],
        type: 'article',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Cannoga College 2026/2027 Digital Viewbook',
        description: 'Explore academic programs, degree pathways, and student life in Ottawa.',
        images: ['https://cannogacollege.ca/images/viewbook-cover-og.jpg'],
    }
};

export default function ViewbookPage() {
    return (
        <main className="min-h-screen bg-[#050b0e] text-white flex flex-col">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Viewbook', item: '/viewbook' }
            ]} />

            <SchemaLD data={{
                "@context": "https://schema.org",
                "@type": "DigitalDocument",
                "name": "Cannoga College 2026/2027 Viewbook",
                "headline": "Official 2026/2027 Academic Prospectus & Admissions Guide",
                "description": "Explore Cannoga College academic programs, admissions pathways, student support, tuition fees, and campus life in Ottawa, Ontario, Canada.",
                "url": "https://cannogacollege.ca/viewbook",
                "author": {
                    "@type": "EducationalOrganization",
                    "name": "Cannoga College",
                    "url": "https://cannogacollege.ca"
                },
                "publisher": {
                    "@type": "EducationalOrganization",
                    "name": "Cannoga College",
                    "logo": "https://cannogacollege.ca/logo-cannoga.png"
                },
                "inLanguage": "en-CA",
                "fileFormat": "application/pdf"
            }} />

            <Suspense fallback={<div className="min-h-screen bg-[#050b0e] flex items-center justify-center text-white text-sm font-semibold">Loading Viewbook...</div>}>
                <FlipbookViewer publication={CANNOGA_VIEWBOOK_2026_2027} />
            </Suspense>
        </main>
    );
}
