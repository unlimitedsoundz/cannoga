import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Leadership & Governance | Cannoga College',
    description: 'Learn about the leadership, Board of Governors, and governance structure guiding Cannoga College in Ottawa, Ontario.',
    alternates: {
        canonical: 'https://cannogacollege.ca/about/leadership-and-governance/',
    },
};

export default function LeadershipLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
