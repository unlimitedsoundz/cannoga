import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Advanced Diploma Student Portal & Resources",
    description: 'Explore checklists, applied capstone guidelines, and academic events for newly enrolled Advanced Diploma students.',
};

export default function MasterGuideLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
