import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Student Housing & Accommodation',
    description: 'Explore on-campus residences and off-campus housing options for Cannoga College students in Ottawa, Ontario. View residence options, amenities, and cost breakdowns.',
    alternates: {
        canonical: 'https://cannogacollege.ca/housing/',
    },
    openGraph: {
        title: 'Student Housing & Accommodation',
        description: 'Explore on-campus residences and off-campus housing options for Cannoga College students in Ottawa, Ontario.',
        url: 'https://cannogacollege.ca/housing/',
        images: ['/images/housing/main-residence.png'],
    },
};

export default function HousingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
