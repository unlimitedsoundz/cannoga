
import { Link } from '@/components/ui/Link';
import Image from 'next/image';
import { ArrowRight, CheckCircle, Globe, Users, BookOpen, Briefcase, GraduationCap, Calendar, MapPin, Buildings, Headset, GlobeHemisphereWest, Basketball, Quotes } from '@phosphor-icons/react/dist/ssr';
import { Hero } from '@/components/layout/Hero';
import BachelorFAQ from '@/components/admissions/BachelorFAQ';
import { StudyingAtCannogaCarousel } from '@/components/admissions/StudyingAtCannogaCarousel';
import DbPageContent from '@/components/DbPageContent';
import { getPageContentSection } from '@/lib/pageContentConfig';

import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SchemaLD } from '@/components/seo/SchemaLD';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata = {
    title: "Undergraduate Admissions & Bachelor's Entry",
    description: 'Learn about admissions criteria, application pathways, and scholarship options for our English-taught Bachelor\'s programs.',
    alternates: {
        canonical: 'https://cannogacollege.ca/admissions/bachelor/',
        languages: {
            'en': 'https://cannogacollege.ca/admissions/bachelor/',
        },
    },
};

const sections = [
    { id: 'benefits', title: 'How You Benefit', content: '' },
    { id: 'progression', title: 'Bachelor\'s to Master\'s', content: '' },
    { id: 'scholarships', title: 'Scholarships & Tuition Fees', content: '' },
    { id: 'admissions', title: 'Admission Info', content: '' },
    { id: 'events', title: 'Fairs & Events', content: '' },
    { id: 'faq', title: 'FAQ', content: '' },
    { id: 'more', title: 'Learn More', content: '' },
];



export default function BachelorAdmissionsPage() {
    const pageSlug = 'admissions-bachelor';
    const getSectionDefault = (sectionKey: string) => getPageContentSection(pageSlug, sectionKey)?.defaultContent ?? '';

    return (
        <div className="min-h-screen bg-white">
            {/* HERO SECTION */}
            <Hero
                title={
                    <DbPageContent
                        tagName="span"
                        pageSlug={pageSlug}
                        sectionKey="hero_title"
                        fallbackContent={getSectionDefault('hero_title')}
                    />
                }
                body={
                    <DbPageContent
                        tagName="span"
                        pageSlug={pageSlug}
                        sectionKey="hero_subtitle"
                        fallbackContent={getSectionDefault('hero_subtitle')}
                    />
                }
                backgroundColor="#000000"
                tinted
                overlay={true}
                overlayOpacity="opacity-40"
                lightText={true}
                image={{
                    src: "/images/admissions/bachelor-hero.png",
                    alt: "Bachelor's Students"
                }}
                imagePosition="object-left-top"
            >
                <Link
                    href="/admissions/application-process"
                    className="inline-flex items-center gap-2.5 bg-white hover:bg-slate-200 text-[#0a151a] font-bold text-xs uppercase tracking-wider px-6 py-3.5 no-underline transition-colors shadow-md shrink-0"
                >
                    <span>Start application</span>
                    <ArrowRight size={16} weight="bold" />
                </Link>
            </Hero>

            <GuideSidebarLayout 
                sections={sections}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Admissions', href: '/admissions' },
                    { label: "Bachelor's Admissions" }
                ]}
            >

            <div className="cc-container py-8 md:py-16">
                <main className="space-y-10 md:space-y-14 text-sm sm:text-base font-normal text-slate-700 leading-relaxed">

                    {/* How You Benefit */}
                    <section id="benefits" className="scroll-mt-32 space-y-2">
                        <div className="cc-section-divider !mb-3 !pb-2">
                            <h2 className="cc-h2">How You Benefit from Our Programmes</h2>
                        </div>
                        <DbPageContent
                            pageSlug={pageSlug}
                            sectionKey="benefits_content"
                            fallbackContent={getSectionDefault('benefits_content')}
                            className="space-y-2 text-sm sm:text-base font-normal text-slate-700 leading-relaxed"
                        />
                    </section>

                    {/* From Bachelor's to Master's */}
                    <section id="progression" className="scroll-mt-32 space-y-2">
                        <div className="cc-section-divider !mb-3 !pb-2">
                            <h2 className="cc-h2">From Bachelor's to Master's</h2>
                        </div>
                        <DbPageContent
                            pageSlug={pageSlug}
                            sectionKey="progression_content"
                            fallbackContent={getSectionDefault('progression_content')}
                            className="space-y-2 text-sm sm:text-base font-normal text-slate-700 leading-relaxed"
                        />
                    </section>

                    {/* Scholarships */}
                    <section id="scholarships" className="scroll-mt-32 space-y-2">
                        <div className="cc-section-divider !mb-3 !pb-2">
                            <h2 className="cc-h2">Scholarships and Tuition Fees</h2>
                        </div>
                        <DbPageContent
                            pageSlug={pageSlug}
                            sectionKey="scholarships_content"
                            fallbackContent={getSectionDefault('scholarships_content')}
                            className="space-y-2 text-sm sm:text-base font-normal text-slate-700 leading-relaxed"
                        />
                    </section>

                    {/* Admissions Info */}
                    <section id="admissions" className="scroll-mt-32 space-y-2">
                        <div className="cc-section-divider !mb-3 !pb-2">
                            <h2 className="cc-h2">Information on Student Admissions</h2>
                        </div>
                        <DbPageContent
                            pageSlug={pageSlug}
                            sectionKey="admissions_content"
                            fallbackContent={getSectionDefault('admissions_content')}
                            className="space-y-2 text-sm sm:text-base font-normal text-slate-700 leading-relaxed"
                        />
                    </section>

                    {/* Learn More */}
                    <section id="more" className="scroll-mt-32 space-y-2">
                        <div className="cc-section-divider !mb-3 !pb-2">
                            <h2 className="cc-h2">Learn More About Studying at Cannoga</h2>
                        </div>
                        <p className="text-sm sm:text-base text-slate-600 font-normal mb-2">Explore campus spaces, student services, global community, careers, and athletics.</p>
                        <StudyingAtCannogaCarousel />
                    </section>

                    {/* Fairs & Events */}
                    <section id="events" className="scroll-mt-32 space-y-2">
                        <div className="cc-section-divider !mb-3 !pb-2">
                            <h2 className="cc-h2">Fairs and Events</h2>
                        </div>
                        <DbPageContent
                            pageSlug={pageSlug}
                            sectionKey="events_content"
                            fallbackContent={getSectionDefault('events_content')}
                            className="space-y-2 text-sm sm:text-base font-normal text-slate-700 leading-relaxed"
                        />
                    </section>

                    {/* FAQ */}
                    <section id="faq" className="scroll-mt-32 space-y-2">
                        <div className="cc-section-divider !mb-3 !pb-2">
                            <h2 className="cc-h2">Frequently Asked Questions</h2>
                        </div>
                        <BachelorFAQ />
                    </section>

                </main>
            </div>
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Admissions', item: '/admissions' },
                { name: 'Bachelor\'s Admissions', item: '/admissions/bachelor' }
            ]} />
            <SchemaLD data={{
                "@context": "https://schema.org",
                "@type": "EducationalOccupationalProgram",
                "name": "Bachelor's Degree Programmes",
                "description": "Information on Bachelor's degree programmes taught in English at Cannoga College.",
                "provider": {
                    "@type": "UniversityOrUniversity",
                    "name": "Cannoga College",
                    "url": "https://cannogacollege.ca"
                },
                "educationalLevel": "Bachelor",
                "offers": {
                    "@type": "Offer",
                    "category": "Bachelor's Programmes"
                }
            }} />
            </GuideSidebarLayout>
        </div>
    );
}
