
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { Link } from '@/components/ui/Link';
import { CTA } from '@/components/ui/CTA';
import Image from 'next/image';
import ApplicationFAQ from '@/components/admissions/ApplicationFAQ';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import DbPageContent from '@/components/DbPageContent';
import { getPageContentSection } from '@/lib/pageContentConfig';
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
    title: 'How to Apply: Step-by-Step Admissions Guide — Cannoga College',
    description: 'Find clear, step-by-step instructions on submitting your application, preparing your portfolio, tracking deadlines, and joining Cannoga College.',
    alternates: {
        canonical: 'https://cannogacollege.ca/admissions/application-process/',
    },
};

export default function ApplicationProcessPage() {
    const pageSlug = 'admissions-application-process';
    const getSectionDefault = (sectionKey: string) => getPageContentSection(pageSlug, sectionKey)?.defaultContent ?? '';

    return (
        <GuideSidebarLayout sections={sections}>
            <div className="min-h-screen bg-white text-black">

            {/* ── HERO – Home-page style ── */}
            <section
                className="relative overflow-hidden text-white"
                style={{ background: '#000000' }}
            >
                {/* Decorative blobs */}
                <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
                    <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
                    <div className="absolute bottom-0 -left-20 w-[350px] h-[350px] rounded-full bg-white/5 blur-2xl" />
                </div>

                <div className="relative z-10 cc-container flex flex-col lg:flex-row items-center gap-8 lg:gap-16 py-16 lg:py-0 lg:min-h-[580px]">
                    {/* Left: Text */}
                    <div className="lg:w-1/2 space-y-7 flex flex-col justify-center">
                        {/* Breadcrumb */}
                        <nav className="flex items-center gap-2 text-white/50 text-xs font-semibold uppercase tracking-widest">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <span>/</span>
                            <Link href="/admissions" className="hover:text-white transition-colors">Admissions</Link>
                            <span>/</span>
                            <span className="text-white/80">How to Apply</span>
                        </nav>

                        <DbPageContent
                            tagName="h1"
                            className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight text-white"
                            pageSlug={pageSlug}
                            sectionKey="hero_title"
                            fallbackContent={getSectionDefault('hero_title') || 'How to Apply'}
                        />
                        <DbPageContent
                            tagName="p"
                            className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed"
                            pageSlug={pageSlug}
                            sectionKey="hero_subtitle"
                            fallbackContent={getSectionDefault('hero_subtitle') || 'Follow our step-by-step guide to ensure a smooth application to Cannoga College.'}
                        />

                        <div className="flex flex-wrap gap-4 pt-2">
                            <Link
                                href="#steps"
                                className="inline-flex items-center gap-2 bg-white text-[#000000] px-7 py-3.5 font-bold hover:bg-neutral-100 transition-all text-sm uppercase tracking-widest"
                            >
                                Application Steps <ArrowRight size={18} weight="bold" />
                            </Link>
                        </div>
                    </div>

                    {/* Right: Image */}
                    <div className="lg:w-1/2 h-full w-full relative lg:translate-y-8 flex justify-center lg:block order-first lg:order-none">
                        <div className="relative w-full aspect-[4/3] lg:h-[520px] lg:aspect-auto overflow-hidden shadow-2xl">
                            <Image
                                src="/images/admissions/application-process-hero.jpg"
                                alt="Application Process at Cannoga College"
                                fill
                                priority
                                className="object-cover object-center opacity-90"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            {/* Bottom gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/40 via-transparent to-transparent" />
                        </div>
                    </div>
                </div>
            </section>

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
