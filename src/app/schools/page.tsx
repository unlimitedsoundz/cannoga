
import { AcademicSchoolsCarousel } from '@/components/home/AcademicSchoolsCarousel';
import { School } from '@/types/database';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { Hero } from '@/components/layout/Hero';
import { createStaticClient } from '@/lib/supabase/static';

export const metadata = {
    title: 'Academic Faculties & Schools Cannoga College',
    description: 'Explore our diverse schools, including Business, Technology, Science, Health, and Arts. Find your academic department today.',
    alternates: {
        canonical: 'https://cannogacollege.ca/schools/',
    },
};

export default async function SchoolsPage() {
    const supabase = createStaticClient();
    const { data: schools } = await supabase
        .from('School')
        .select('id, name, slug, description, imageUrl')
        .order('name', { ascending: true });

    return (
        <div className="min-h-screen bg-white">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Schools', item: '/schools' }
            ]} />
            {/* Hero Section */}
            <Hero
                title="Our Schools"
                body="Cannoga College is organized into specialized schools, each driving innovation in technology, business, science, and design through world-class research and English-taught certificate, diploma, bachelor’s and master’s programmes."
                backgroundColor="#000000"
                tinted
                lightText={true}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Schools' }
                ]}
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <AcademicSchoolsCarousel schools={schools || []} />
            </div>
        </div>
    );
}
