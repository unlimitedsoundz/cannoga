import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Bachelor\'s Degree Student Orientation Cannoga College',
    description: 'Access key schedules, course selection instructions, and advisors for new Bachelor\'s degree students.',
};

export default function BachelorGuideLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
