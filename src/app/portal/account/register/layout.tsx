import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Student Registration & Application Account',
    description: 'Create an official Cannoga College portal account to begin your admission application for career-focused programs in Ottawa, Ontario.',
    alternates: {
        canonical: 'https://cannogacollege.ca/portal/account/register',
    },
};

export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
