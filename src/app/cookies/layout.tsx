import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cookies & Digital Privacy Policy Cannoga College',
    description: 'Read how our online systems utilize cookies to deliver personalized content, ensure security, and improve website navigation.',
};

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
