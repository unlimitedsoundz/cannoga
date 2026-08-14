import { Link } from '@/components/ui/Link';
import Image from 'next/image';
import { CaretLeft, ArrowRight, Calendar, FileText, CheckCircle, GraduationCap, Globe, Clock, User, Trophy as Award } from '@phosphor-icons/react/dist/ssr';
import { Hero } from '@/components/layout/Hero';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import AdmissionsCTA from '@/components/admissions/AdmissionsCTA';
import MasterFAQ from '@/components/admissions/MasterFAQ';
import DbPageContent from '@/components/DbPageContent';
import { getPageContentSection } from '@/lib/pageContentConfig';


export const metadata = {
    title: 'Postgraduate Admissions & Master\'s Entry — Cannoga College',
    description: 'Discover admissions criteria, application requirements, and selection procedures for our advanced Master\'s degree programs.',
    alternates: {
        canonical: 'https://cannogacollege.ca/admissions/master/',
    },
};

const sections = [
    { id: 'schedule', title: 'Admissions Schedule', content: '' },
    { id: 'study-options', title: 'Study Options', content: '' },
    { id: 'scholarships', title: 'Scholarships & Tuition Fees', content: '' },
    { id: 'eligibility', title: 'General Eligibility', content: '' },
    { id: 'field-reqs', title: 'Field-Specific Reqs', content: '' },
    { id: 'incomplete', title: 'Incomplete Degree', content: '' },
    { id: 'steps', title: 'Application Steps', content: '' },
    { id: 'documents', title: 'Required Documents', content: '' },
    { id: 'language', title: 'Language Requirements', content: '' },
    { id: 'gmat', title: 'GMAT/GRE', content: '' },
    { id: 'decisions', title: 'Decisions', content: '' },
    { id: 'after', title: 'After Admission', content: '' },
    { id: 'faq', title: 'FAQ', content: '' },
];





export default function MasterAdmissionsPage() {
    const pageSlug = 'admissions/master';
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
                backgroundColor="#9bd84c"
                tinted
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Admissions', href: '/admissions' },
                    { label: 'Master' }
                ]}
                image={{
                    src: "/images/admissions/master-hero.png",
                    alt: "Master's Application"
                }}
            >
                <Link
                    href="/portal/apply"
                    className="inline-flex items-center gap-2.5 bg-white hover:bg-slate-200 text-[#0a151a] font-bold text-xs uppercase tracking-wider px-6 py-3.5 no-underline transition-colors shadow-md shrink-0"
                >
                    <span>Start application</span>
                    <ArrowRight size={16} weight="bold" />
                </Link>
            </Hero>

            <div className="cc-container py-4 md:py-6">
                <main className="space-y-5 md:space-y-8">

                    <section id="schedule" className="scroll-mt-32">
                        <div className="cc-section-divider !mb-4 !pb-2"><h2 className="cc-h2">Admissions Schedule</h2></div>
                        <div className="prose-arrows"><DbPageContent pageSlug={pageSlug} sectionKey="schedule_content" fallbackContent={getSectionDefault('schedule_content')} /></div>
                    </section>

                    <section id="study-options" className="scroll-mt-32">
                        <div className="cc-section-divider !mb-4 !pb-2"><h2 className="cc-h2">Study Options</h2></div>
                        <div className="prose-arrows"><DbPageContent pageSlug={pageSlug} sectionKey="study_options_content" fallbackContent={getSectionDefault('study_options_content')} /></div>
                    </section>

                    <section id="scholarships" className="scroll-mt-32">
                        <div className="cc-section-divider !mb-4 !pb-2"><h2 className="cc-h2">Scholarships &amp; Fees</h2></div>
                        <div className="prose-arrows"><DbPageContent pageSlug={pageSlug} sectionKey="scholarships_content" fallbackContent={getSectionDefault('scholarships_content')} /></div>
                    </section>

                    <section id="eligibility" className="scroll-mt-32">
                        <div className="cc-section-divider !mb-4 !pb-2"><h2 className="cc-h2">General Eligibility</h2></div>
                        <div className="prose-arrows"><DbPageContent pageSlug={pageSlug} sectionKey="eligibility_content" fallbackContent={getSectionDefault('eligibility_content')} /></div>
                    </section>

                    <section id="field-reqs" className="scroll-mt-32">
                        <div className="cc-section-divider !mb-4 !pb-2"><h2 className="cc-h2">Field-Specific Requirements</h2></div>
                        <div className="prose-arrows"><DbPageContent pageSlug={pageSlug} sectionKey="field_reqs_content" fallbackContent={getSectionDefault('field_reqs_content')} /></div>
                    </section>

                    <section id="incomplete" className="scroll-mt-32">
                        <div className="cc-section-divider !mb-4 !pb-2"><h2 className="cc-h2">Incomplete Degree</h2></div>
                        <div className="prose-arrows"><DbPageContent pageSlug={pageSlug} sectionKey="incomplete_content" fallbackContent={getSectionDefault('incomplete_content')} /></div>
                    </section>

                    <section id="steps" className="scroll-mt-32">
                        <div className="cc-section-divider !mb-4 !pb-2"><h2 className="cc-h2">How to Apply</h2></div>
                        <div className="prose-arrows"><DbPageContent pageSlug={pageSlug} sectionKey="steps_content" fallbackContent={getSectionDefault('steps_content')} /></div>
                    </section>

                    <div className="my-4"><AdmissionsCTA /></div>

                    <section id="documents" className="scroll-mt-32">
                        <div className="cc-section-divider !mb-4 !pb-2"><h2 className="cc-h2">Required Documents</h2></div>
                        <div className="prose-arrows"><DbPageContent pageSlug={pageSlug} sectionKey="documents_content" fallbackContent={getSectionDefault('documents_content')} /></div>
                    </section>

                    <section id="language" className="scroll-mt-32">
                        <div className="cc-section-divider !mb-4 !pb-2"><h2 className="cc-h2">Language Proficiency</h2></div>
                        <div className="prose-arrows"><DbPageContent pageSlug={pageSlug} sectionKey="language_content" fallbackContent={getSectionDefault('language_content')} /></div>
                    </section>

                    <section id="gmat" className="scroll-mt-32">
                        <div className="cc-section-divider !mb-4 !pb-2"><h2 className="cc-h2">GMAT &amp; GRE</h2></div>
                        <div className="prose-arrows"><DbPageContent pageSlug={pageSlug} sectionKey="gmat_content" fallbackContent={getSectionDefault('gmat_content')} /></div>
                    </section>

                    <section id="decisions" className="scroll-mt-32">
                        <div className="cc-section-divider !mb-4 !pb-2"><h2 className="cc-h2">Decisions</h2></div>
                        <div className="prose-arrows"><DbPageContent pageSlug={pageSlug} sectionKey="decisions_content" fallbackContent={getSectionDefault('decisions_content')} /></div>
                    </section>

                    <section id="after" className="scroll-mt-32">
                        <div className="cc-section-divider !mb-4 !pb-2"><h2 className="cc-h2">After Admission</h2></div>
                        <div className="prose-arrows"><DbPageContent pageSlug={pageSlug} sectionKey="after_content" fallbackContent={getSectionDefault('after_content')} /></div>
                    </section>

                    <section id="faq" className="scroll-mt-32">
                        <div className="cc-section-divider !mb-4 !pb-2"><h2 className="cc-h2">FAQ</h2></div>
                        <MasterFAQ />
                    </section>

                </main>
            </div>
        </div>
        </GuideSidebarLayout>
    );
}
