
import { Link } from '@/components/ui/Link';
import Image from 'next/image';
import { ArrowRight, CheckCircle, Globe, Users, BookOpen, Briefcase, GraduationCap, Calendar, MapPin, Buildings, Headset, GlobeHemisphereWest, Basketball } from '@phosphor-icons/react/dist/ssr';
import { Hero } from '@/components/layout/Hero';
import BachelorFAQ from '@/components/admissions/BachelorFAQ';
import DbPageContent from '@/components/DbPageContent';
import { getPageContentSection } from '@/lib/pageContentConfig';

import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SchemaLD } from '@/components/seo/SchemaLD';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata = {
    title: 'Undergraduate Admissions & Bachelor\'s Entry — Cannoga College',
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
        <GuideSidebarLayout sections={sections}>
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
                overlay={false}
                overlayOpacity="opacity-100"
                lightText={true}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Admissions', href: '/admissions' },
                    { label: 'Bachelor' }
                ]}
                image={{
                    src: "/images/admissions/bachelor-hero.png",
                    alt: "Bachelor's Students"
                }}
                imagePosition="object-left-top"
            >
                <Link
                    href="/admissions/application-process"
                    className="inline-flex items-center gap-2 bg-[#0f2027] hover:bg-[#1a3644] text-white font-bold text-sm tracking-wider uppercase px-8 py-4 no-underline rounded-sm transition-colors border border-white/20"
                >
                    <span>Start application</span>
                    <ArrowRight size={18} weight="bold" className="text-[#c89211]" />
                </Link>
            </Hero>

            <div className="cc-container py-8 md:py-16">
                <div className="space-y-12 md:space-y-20">

                    {/* How You Benefit */}
                    <section id="benefits" className="scroll-mt-32">
                        <div className="cc-section-divider">
                            <h2 className="cc-h2">How You Benefit from Our Programmes</h2>
                        </div>
                        <div className="prose-arrows">
                            <DbPageContent
                                pageSlug={pageSlug}
                                sectionKey="benefits_content"
                                fallbackContent={getSectionDefault('benefits_content')}
                            />
                        </div>
                    </section>

                    {/* From Bachelor's to Master's */}
                    <section id="progression" className="scroll-mt-32">
                        <div className="cc-section-divider">
                            <h2 className="cc-h2">From Bachelor's to Master's</h2>
                        </div>
                        <div className="prose-arrows">
                            <DbPageContent
                                pageSlug={pageSlug}
                                sectionKey="progression_content"
                                fallbackContent={getSectionDefault('progression_content')}
                            />
                        </div>
                    </section>

                </div>
            </div>

            {/* QUOTE BANNER */}
            <div className="w-full cc-section-tinted py-8 my-0">
                <div className="cc-container text-left md:text-center max-w-4xl mx-auto">
                    <DbPageContent
                        pageSlug={pageSlug}
                        sectionKey="quote_content"
                        fallbackContent={getSectionDefault('quote_content')}
                    />
                </div>
            </div>

            <div className="cc-container py-8 md:py-16">
                <div className="space-y-12 md:space-y-20">

                        {/* Scholarships */}
                        <section id="scholarships" className="scroll-mt-32">
                            <div className="cc-section-divider">
                                <h2 className="cc-h2">Scholarships and Tuition Fees</h2>
                            </div>
                            <div className="prose-arrows">
                                <DbPageContent
                                    pageSlug={pageSlug}
                                    sectionKey="scholarships_content"
                                    fallbackContent={getSectionDefault('scholarships_content')}
                                />
                            </div>
                        </section>

                        {/* Admissions Info */}
                        <section id="admissions" className="scroll-mt-32">
                            <div className="cc-section-divider">
                                <h2 className="cc-h2">Information on Student Admissions</h2>
                            </div>
                            <div className="prose-arrows">
                                <DbPageContent
                                    pageSlug={pageSlug}
                                    sectionKey="admissions_content"
                                    fallbackContent={getSectionDefault('admissions_content')}
                                />
                            </div>
                        </section>

                         {/* Learn More */}
                         <section id="more" className="scroll-mt-32">
                             <div className="cc-section-divider mb-8">
                                 <h2 className="cc-h2">Learn More About Studying at Cannoga</h2>
                             </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                 <div className="bg-[#f8fafc] border border-neutral-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                                     <div className="w-10 h-10 rounded-full bg-[#0a151a] text-white flex items-center justify-center mb-4 shrink-0">
                                         <Buildings size={20} weight="bold" />
                                     </div>
                                     <div>
                                         <h3 className="font-bold text-lg text-black mb-1">Modern Campus</h3>
                                         <p className="text-sm text-black leading-relaxed">State-of-the-art facilities</p>
                                     </div>
                                 </div>

                                 <div className="bg-[#f8fafc] border border-neutral-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                                     <div className="w-10 h-10 rounded-full bg-[#0a151a] text-white flex items-center justify-center mb-4 shrink-0">
                                         <Headset size={20} weight="bold" />
                                     </div>
                                     <div>
                                         <h3 className="font-bold text-lg text-black mb-1">Support</h3>
                                         <p className="text-sm text-black leading-relaxed">Advisors and counseling</p>
                                     </div>
                                 </div>

                                 <div className="bg-[#f8fafc] border border-neutral-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                                     <div className="w-10 h-10 rounded-full bg-[#0a151a] text-white flex items-center justify-center mb-4 shrink-0">
                                         <GlobeHemisphereWest size={20} weight="bold" />
                                     </div>
                                     <div>
                                         <h3 className="font-bold text-lg text-black mb-1">Community</h3>
                                         <p className="text-sm text-black leading-relaxed">Global network</p>
                                     </div>
                                 </div>

                                 <div className="bg-[#f8fafc] border border-neutral-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                                     <div className="w-10 h-10 rounded-full bg-[#0a151a] text-white flex items-center justify-center mb-4 shrink-0">
                                         <Briefcase size={20} weight="bold" />
                                     </div>
                                     <div>
                                         <h3 className="font-bold text-lg text-black mb-1">Careers</h3>
                                         <p className="text-sm text-black leading-relaxed">Internships and mentoring</p>
                                     </div>
                                 </div>

                                 <div className="bg-[#f8fafc] border border-neutral-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
                                     <div className="w-10 h-10 rounded-full bg-[#0a151a] text-white flex items-center justify-center mb-4 shrink-0">
                                         <Basketball size={20} weight="bold" />
                                     </div>
                                     <div>
                                         <h3 className="font-bold text-lg text-black mb-1">Student Life</h3>
                                         <p className="text-sm text-black leading-relaxed">Clubs and sports</p>
                                     </div>
                                 </div>
                             </div>
                         </section>

                         {/* Fairs & Events */}
                         <section id="events" className="scroll-mt-32">
                             <div className="cc-section-divider">
                                 <h2 className="cc-h2">Fairs and Events</h2>
                             </div>
                             <div className="prose-arrows">
                                 <DbPageContent
                                     pageSlug={pageSlug}
                                     sectionKey="events_content"
                                     fallbackContent={getSectionDefault('events_content')}
                                 />
                             </div>
                         </section>

                         {/* FAQ */}
                         <section id="faq" className="scroll-mt-32">
                             <div className="cc-section-divider">
                                 <h2 className="cc-h2">Frequently Asked Questions</h2>
                             </div>
                             <BachelorFAQ />
                         </section>

                </div>
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
        </div>
        </GuideSidebarLayout>
    );
}
