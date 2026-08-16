import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Platform Terms of Service & Agreements',
    description: 'Read the policies outlining acceptable use, data security responsibilities, and legal agreements for our website visitors.',
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
