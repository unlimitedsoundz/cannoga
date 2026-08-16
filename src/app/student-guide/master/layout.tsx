import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Master's Student Portal & Resources",
    description: 'Explore checklists, research thesis guidelines, and postgraduate events for newly enrolled master\'s students.',
};

export default function MasterGuideLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
