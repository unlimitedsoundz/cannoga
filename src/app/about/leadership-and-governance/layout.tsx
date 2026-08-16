import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Leadership & Governance',
    description: 'Learn about the leadership team, Board of Governors, and senior administrative governance structure at Cannoga College.',
    alternates: {
        canonical: 'https://cannogacollege.ca/about/leadership-and-governance/',
    },
    openGraph: {
        title: 'Leadership & Governance',
        description: 'Learn about the leadership team, Board of Governors, and senior administrative governance structure at Cannoga College.',
        url: 'https://cannogacollege.ca/about/leadership-and-governance/',
    },
};

export default function LeadershipGovernanceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
