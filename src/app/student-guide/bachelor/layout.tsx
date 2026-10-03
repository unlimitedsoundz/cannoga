import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Ontario College Diploma Student Orientation",
    description: 'Access key schedules, course selection instructions, and academic advisors for Ontario College Diploma students.',
};

export default function BachelorGuideLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
