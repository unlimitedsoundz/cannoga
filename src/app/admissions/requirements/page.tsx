import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { Link } from '@/components/ui/Link';
import { CTA } from '@/components/ui/CTA';
import Image from 'next/image';
import ApplicationFAQ from '@/components/admissions/ApplicationFAQ';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import DbPageContent from '@/components/DbPageContent';
import { getPageContentSection } from '@/lib/pageContentConfig';
import { Hero } from '@/components/layout/Hero';
import CountryRequirementsDropdown from '@/components/admissions/CountryRequirementsDropdown';
import ApplicationProcess from '@/components/admissions/ApplicationProcess';

const sections = [
    { id: 'steps', title: 'Application Steps', content: '' },
    { id: 'documents', title: 'Required Documents', content: '' },
    { id: 'requirements', title: 'Specific Requirements', content: '' },
    { id: 'evaluation', title: 'Evaluation & Decisions', content: '' },
    { id: 'faq', title: 'FAQ', content: '' },
];

export const metadata = {
    title: 'Academic Admission Requirements & Criteria — Cannoga College',
    description: 'Find clear, step-by-step instructions on submitting your application, preparing your portfolio, tracking deadlines, and joining Cannoga College.',
    alternates: {
        canonical: 'https://cannogacollege.ca/admissions/requirements/',
    },
};

export default function RequirementsPage() {
    const pageSlug = 'admissions-application-process';
    const getSectionDefault = (sectionKey: string) => getPageContentSection(pageSlug, sectionKey)?.defaultContent ?? '';

    return (
        <GuideSidebarLayout sections={sections}>
            <div className="min-h-screen bg-white text-black">

            {/* ── HERO ── */}
            <Hero
                title={
                    <DbPageContent
                        tagName="span"
                        pageSlug={pageSlug}
                        sectionKey="hero_title"
                        fallbackContent={getSectionDefault('hero_title') || 'Admission Requirements'}
                    />
                }
                body={
                    <DbPageContent
                        tagName="span"
                        pageSlug={pageSlug}
                        sectionKey="hero_subtitle"
                        fallbackContent={getSectionDefault('hero_subtitle') || 'Follow our step-by-step guide to ensure a smooth application to Cannoga College.'}
                    />
                }
                backgroundColor="#0f2027"
                tinted
                lightText={true}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Admissions', href: '/admissions' },
                    { label: 'Requirements' }
                ]}
                image={{
                    src: "/images/admissions/application-process-hero.jpg",
                    alt: "Application Process at Cannoga College"
                }}
            >
                <div className="flex flex-wrap gap-4">
                    <Link
                        href="#steps"
                        className="inline-flex items-center gap-2 bg-white hover:bg-neutral-100 text-[#0a151a] font-bold text-sm tracking-wider uppercase px-8 py-4 no-underline rounded-sm transition-colors shadow-md"
                    >
                        <span>Application Steps</span>
                        <ArrowRight size={18} weight="bold" className="text-[#c89211]" />
                    </Link>
                </div>
            </Hero>

            {/* ── Content ── */}
            <div className="cc-container py-12 md:py-20">
                <div className="max-w-4xl mx-auto space-y-16">

                    {/* International Admissions Requirements by Country */}
                    <section className="scroll-mt-32">
                        <h2 className="text-3xl font-black text-black mb-8">International Admissions Requirements</h2>
                        <CountryRequirementsDropdown />
                    </section>

                    {/* 10-Step Application Process */}
                    <section className="scroll-mt-32">
                        <h2 className="text-3xl font-black text-black mb-8">Application Process</h2>
                        <ApplicationProcess />
                    </section>

                    <section className="mt-4">
                        <CTA
                            title="Ready to Start Your Journey?"
                            body="Join the next generation of global leaders at Cannoga College. Create your portal account to begin your official application."
                            cta={{
                                label: "Create Portal Account",
                                linkComponentProps: {
                                    href: "/portal/account/register",
                                },
                            }}
                        />
                    </section>

                    <section id="faq" className="scroll-mt-32">
                        <div className="cc-section-divider">
                            <h2 className="cc-h2">Frequently Asked Questions</h2>
                        </div>
                        <p className="text-neutral-500 mb-8 leading-relaxed">
                            Find quick answers to common questions regarding the application process.
                        </p>
                        <ApplicationFAQ />
                    </section>

                </div>
            </div>
        </div>
        </GuideSidebarLayout>
    );
}
