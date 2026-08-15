import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Incoming Exchange & Mobility Student Info Cannoga College',
    description: 'Resource hub for incoming exchange partners. Information on courses open to visitor profiles, housing allocations, and credit transfers.',
};

export default function ExchangeGuideLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
