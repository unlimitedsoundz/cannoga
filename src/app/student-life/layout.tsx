import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Student Culture, Sports & Recreation',
    description: 'Discover the community aspects of Cannoga: student unions, sports clubs, recreational amenities, and city life in Ottawa.',
};

export default function StudentLifeLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
