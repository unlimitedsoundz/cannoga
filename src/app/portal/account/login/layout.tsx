import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Student & Applicant Portal Login',
    description: 'Log in to your Cannoga College student or applicant portal to manage your applications, enrollment, tuition invoices, and academic records.',
    alternates: {
        canonical: 'https://cannogacollege.ca/portal/account/login',
    },
};

export default function PortalLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
