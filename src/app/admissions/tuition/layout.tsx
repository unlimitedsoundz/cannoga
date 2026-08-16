import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tuition Fees & Fee Estimator | Cannoga College Ottawa',
    description: 'Calculate your estimated tuition fees, mandatory ancillary fees, and payment deadlines for domestic and international programs at Cannoga College.',
    alternates: {
        canonical: 'https://cannogacollege.ca/admissions/tuition/',
    },
    openGraph: {
        title: 'Tuition Fees & Fee Estimator | Cannoga College Ottawa',
        description: 'Calculate your estimated tuition fees, mandatory ancillary fees, and payment deadlines for domestic and international programs at Cannoga College.',
        url: 'https://cannogacollege.ca/admissions/tuition/',
    },
};

export default function TuitionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
