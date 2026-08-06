import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Careers & Job Opportunities — Cannoga College',
    description: 'Explore faculty positions, research fellowships, and staff career opportunities within our dynamic campus community.',
    alternates: {
        canonical: 'https://www.cannogacollege.ca/careers',
    },
};

export default function CareersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
