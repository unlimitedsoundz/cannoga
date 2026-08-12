import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Student Academic Support & Guide Portal — Cannoga College',
    description: 'Your primary portal for academic calendars, digital learning systems, housing advice, and wellness resources.',
};

export default function StudentGuideLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
