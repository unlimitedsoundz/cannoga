import CookiesContent from '@/components/legal/CookiesContent';

export const metadata = {
    title: 'Cookie Usage Statement Cannoga College',
    description: 'Detailed outline of the cookie categories we collect and instructions on managing your browser preferences.',
    alternates: {
        canonical: 'https://cannogacollege.ca/cookies/',
    },
};

export default function CookiePolicyPage() {
    return <CookiesContent />;
}
