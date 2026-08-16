import { Link } from '@/components/ui/Link';
import Image from 'next/image';
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Hero } from '@/components/layout/Hero';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import TuitionFAQ from '@/components/admissions/TuitionFAQ';
import DbPageContent from '@/components/DbPageContent';
import { getPageContentSection } from '@/lib/pageContentConfig';
import { registerFaqPage } from '@/lib/registerFaqPage';
import { createStaticClient } from '@/lib/supabase/static';
import TuitionEstimator from '@/components/admissions/TuitionEstimator';

export const metadata = {
    title: 'Tuition Fees, Payment Plans & Scholarships',
    description: 'Explore current tuition rates, acceptable payment methods, installments, and funding support for domestic and international students.',
    alternates: {
        canonical: 'https://cannogacollege.ca/admissions/tuition/',
    },
};

const sections = [
    { id: 'fee-structure', title: 'Fee Structure', content: '' },
    { id: 'tuition-estimator', title: 'Tuition & Fees Estimator', content: '' },
    { id: 'merit-scholarship', title: 'Merit Scholarship', content: '' },
    { id: 'payment-methods', title: 'Payment Methods', content: '' },
    { id: 'timing', title: 'Payment Schedule', content: '' },
    { id: 'additional-fees', title: 'Additional Fees & Benefits', content: '' },
    { id: 'refunds', title: 'Refund Policy', content: '' },
    { id: 'faq', title: 'General FAQ', content: '' },
    { id: 'contact', title: 'Contact Support', content: '' },
];

export default async function TuitionPaymentPage() {
    const supabase = createStaticClient();
    let courses: any[] = [];
    let tuitionInfo: any[] = [];
    let heroVideoUrl = '/videos/wan2.6-t2v_a_%23_Tuition_Fees_Video.mp4';

    try {
        const { data: coursesData } = await supabase
            .from('Course')
            .select('*')
            .order('title');
        courses = coursesData || [];
    } catch (e) {
        console.error('Error fetching courses for tuition estimator:', e);
    }

    try {
        const { data: tuitionData } = await supabase
            .from('tuition_info')
            .select('*')
            .eq('status', 'active')
            .order('credential_type', { ascending: true });
        tuitionInfo = tuitionData || [];
    } catch (e) {
        console.error('Error fetching tuition_info:', e);
    }

    // For static build, we use empty FAQs - they will be loaded client-side
    const faqs: any[] = [];
    const pageSlug = 'admissions/tuition';
    const getSectionDefault = (sectionKey: string) => getPageContentSection(pageSlug, sectionKey)?.defaultContent ?? '';

    try {
        const { data: heroVideoData } = await supabase
            .from('page_content')
            .select('content')
            .eq('page_slug', pageSlug)
            .eq('section_key', 'hero_video_url')
            .maybeSingle();

        if (heroVideoData?.content?.trim()) {
            heroVideoUrl = heroVideoData.content.trim();
        } else {
            heroVideoUrl = getSectionDefault('hero_video_url') || heroVideoUrl;
        }
    } catch (e) {
        heroVideoUrl = getSectionDefault('hero_video_url') || heroVideoUrl;
    }

    // Register this page
    try {
        registerFaqPage("Tuition", "admissions/tuition");
    } catch (error) {
        // Ignore errors
    }

    // Helper to extract annual tuition from JSONB
    const getAnnualTuition = (jsonb: any, fallback: number): number => {
        if (!jsonb) return fallback;
        const val = jsonb.annualTuition || jsonb.domesticTuition || jsonb.tuition || jsonb.amount || jsonb.value;
        if (!val) return fallback;
        const cleaned = String(val).replace(/[^0-9.]/g, '');
        const num = parseFloat(cleaned);
        return isNaN(num) ? fallback : num;
    };

    // Map credential types to display names
    const credentialDisplay: Record<string, { label: string; duration: string; credits: string }> = {
        CERTIFICATE: { label: 'Certificate', duration: '1 Year', credits: '30 Credits' },
        DIPLOMA: { label: 'Ontario College Diploma', duration: '2 Years', credits: '60 Credits' },
        BACHELOR: { label: "Bachelor's Degree", duration: '4 Years', credits: '90 Credits' },
        MASTER: { label: "Master's Degree", duration: '2 Years', credits: '60 Credits' },
    };

    const fallbackRates: Record<string, { domestic: number; international: number }> = {
        CERTIFICATE: { domestic: 2400, international: 4000 },
        DIPLOMA: { domestic: 2400, international: 4000 },
        BACHELOR: { domestic: 4000, international: 6400 },
        MASTER: { domestic: 5600, international: 9600 },
    };

    const tuitionRates = tuitionInfo || [];

    return (
        <div className="min-h-screen bg-white text-black font-sans">
            {/* HERO SECTION */}
            <Hero
                title={
                    <DbPageContent
                        tagName="span"
                        pageSlug={pageSlug}
                        sectionKey="hero_title"
                        fallbackContent={getSectionDefault('hero_title') || 'Paying the Tuition Fee'}
                    />
                }
                body={
                    <DbPageContent
                        tagName="span"
                        pageSlug={pageSlug}
                        sectionKey="hero_subtitle"
                        fallbackContent={getSectionDefault('hero_subtitle') || 'Information on tuition fee structure, payment methods, and scholarship opportunities for international students.'}
                    />
                }
                backgroundColor="#000000"
                tinted
                videoSrc={heroVideoUrl}
                image={{
                    src: "/images/16c50757-90b9-46a7-9f37-b9cd5d4f4314.png",
                    alt: "Tuition Fees, Payment Plans & Scholarships"
                }}
            >
                <Link href="#payment-methods" className="bg-white text-[#0a151a] hover:bg-slate-200 font-bold text-xs uppercase tracking-wider px-6 py-3.5 transition-colors inline-flex items-center gap-2.5 no-underline shrink-0">
                    View payment methods <ArrowRight size={16} weight="bold" />
                </Link>
            </Hero>

            <GuideSidebarLayout
                sections={sections}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Admissions', href: '/admissions' },
                    { label: 'Tuition' }
                ]}
            >
                <div className="cc-container py-8 md:py-16">
                    <main className="space-y-12 md:space-y-16 text-sm sm:text-base font-normal text-slate-700 leading-relaxed">

                        <section id="fee-structure" className="scroll-mt-32 space-y-4">
                            <div className="cc-section-divider !mb-6">
                                <h2 className="cc-h2">How Much is the Tuition Fee?</h2>
                            </div>
                            <div className="space-y-4">
                                <DbPageContent pageSlug={pageSlug} sectionKey="costs_intro_content" fallbackContent={getSectionDefault('costs_intro_content')} className="space-y-4 text-sm sm:text-base font-normal text-slate-700 leading-relaxed" />
                                <DbPageContent pageSlug={pageSlug} sectionKey="fee_structure_content" fallbackContent={getSectionDefault('fee_structure_content')} className="space-y-4 text-sm sm:text-base font-normal text-slate-700 leading-relaxed" />
                            </div>

                            <div className="w-full overflow-x-auto my-4 rounded-lg border border-neutral-200 shadow-sm bg-white">
                                <table className="w-full table-fixed border-collapse">
                                    <thead>
                                        <tr className="bg-[#0a151a] text-white">
                                            <th className="w-[26%] border-b border-neutral-700 px-1.5 py-2 md:px-2.5 md:py-2.5 text-left text-[11px] md:text-xs font-normal uppercase tracking-tight">Programme</th>
                                            <th className="w-[15%] border-b border-neutral-700 px-1.5 py-2 md:px-2.5 md:py-2.5 text-left text-[11px] md:text-xs font-normal uppercase tracking-tight">Duration</th>
                                            <th className="w-[15%] border-b border-neutral-700 px-1.5 py-2 md:px-2.5 md:py-2.5 text-left text-[11px] md:text-xs font-normal uppercase tracking-tight">Credits</th>
                                            <th className="w-[22%] border-b border-neutral-700 px-1.5 py-2 md:px-2.5 md:py-2.5 text-right text-[11px] md:text-xs font-normal uppercase tracking-tight">Domestic<br />Students</th>
                                            <th className="w-[22%] border-b border-neutral-700 px-1.5 py-2 md:px-2.5 md:py-2.5 text-right text-[11px] md:text-xs font-normal uppercase tracking-tight">International<br />Students</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {['CERTIFICATE', 'DIPLOMA', 'BACHELOR', 'MASTER'].map((credentialType, idx) => {
                                            const info = tuitionRates.find((t: any) => t.credential_type === credentialType);
                                            const display = credentialDisplay[credentialType] || { label: credentialType, duration: '—', credits: '—' };
                                            const fallback = fallbackRates[credentialType] || { domestic: 0, international: 0 };
                                            const domestic = info ? getAnnualTuition(info.domestic_tuition, fallback.domestic) : fallback.domestic;
                                            const international = info ? getAnnualTuition(info.international_tuition, fallback.international) : fallback.international;
                                            return (
                                                <tr key={credentialType} className={idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/80'}>
                                                    <td className="border-b border-neutral-200 px-1.5 py-2 md:px-2.5 md:py-2.5 text-xs md:text-sm font-normal text-black">{display.label}</td>
                                                    <td className="border-b border-neutral-200 px-1.5 py-2 md:px-2.5 md:py-2.5 text-xs md:text-sm font-normal text-neutral-800">{display.duration}</td>
                                                    <td className="border-b border-neutral-200 px-1.5 py-2 md:px-2.5 md:py-2.5 text-xs md:text-sm font-normal text-neutral-800">{display.credits}</td>
                                                    <td className="border-b border-neutral-200 px-1.5 py-2 md:px-2.5 md:py-2.5 text-xs md:text-sm font-normal text-black text-right">${domestic.toLocaleString()}<span className="text-[11px] font-normal text-neutral-600"><br />/yr</span></td>
                                                    <td className="border-b border-neutral-200 px-1.5 py-2 md:px-2.5 md:py-2.5 text-xs md:text-sm font-normal text-[#0a151a] text-right">${international.toLocaleString()}<span className="text-[11px] font-normal text-neutral-600"><br />/yr</span></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="space-y-6 mt-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-900 tracking-tight">Certificate Program Fees</h3>
                                    <DbPageContent pageSlug={pageSlug} sectionKey="certificate_fees_content" fallbackContent={getSectionDefault('certificate_fees_content')} className="space-y-3 text-sm sm:text-base font-normal text-slate-700 leading-relaxed" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-900 tracking-tight">Diploma Program Fees</h3>
                                    <DbPageContent pageSlug={pageSlug} sectionKey="diploma_fees_content" fallbackContent={getSectionDefault('diploma_fees_content')} className="space-y-3 text-sm sm:text-base font-normal text-slate-700 leading-relaxed" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-900 tracking-tight">Bachelor's Program Fees</h3>
                                    <DbPageContent pageSlug={pageSlug} sectionKey="bachelor_fees_content" fallbackContent={getSectionDefault('bachelor_fees_content')} className="space-y-3 text-sm sm:text-base font-normal text-slate-700 leading-relaxed" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-900 tracking-tight">Master's Program Fees</h3>
                                    <DbPageContent pageSlug={pageSlug} sectionKey="master_fees_content" fallbackContent={getSectionDefault('master_fees_content')} className="space-y-3 text-sm sm:text-base font-normal text-slate-700 leading-relaxed" />
                                </div>
                            </div>
                        </section>

                        <section id="tuition-estimator" className="scroll-mt-32 space-y-4">
                            <div className="cc-section-divider !mb-6">
                                <h2 className="cc-h2">Interactive Tuition &amp; Fees Estimator</h2>
                                <p className="cc-label">Estimate your tuition and ancillary fees per semester</p>
                            </div>
                            <TuitionEstimator courses={courses || []} />
                        </section>

                        <section id="merit-scholarship" className="scroll-mt-32 space-y-4">
                            <div className="cc-section-divider !mb-6">
                                <h2 className="cc-h2">Merit Scholarships &amp; Financial Aid</h2>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Continuing Merit Scholarship</h3>
                                    <p className="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">
                                        Cannoga College rewards academic excellence. After the first year, international students can apply for a merit scholarship covering 50% of tuition for the next academic year:
                                    </p>
                                    <ul className="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5">
                                        <li><strong className="text-slate-900 font-bold">Academic Criteria:</strong> Complete at least 55 credits per academic year and maintain a minimum weighted GPA of 3.5 / 5.0.</li>
                                        <li><strong className="text-slate-900 font-bold">Application &amp; Review:</strong> Scholarship eligibility is automatically reviewed every August and eligible students will be notified before the autumn tuition deadline.</li>
                                    </ul>
                                </div>
                                
                                {/* OSAP / ONTARIO STUDENT FINANCIAL AID (Clean Layout - No Containers) */}
                                <div className="space-y-4 pt-4 border-t border-slate-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-2">
                                        {/* Official OSAP Logo - Increased Size */}
                                        <div className="relative w-32 h-20 shrink-0">
                                            <Image
                                                src="/images/osap-logo.jpg"
                                                alt="Ontario Student Assistance Program (OSAP) Logo"
                                                fill
                                                className="object-contain object-left sm:object-center"
                                                priority
                                            />
                                        </div>
                                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                            Ontario Student Assistance Program (OSAP)
                                        </h3>
                                    </div>

                                    <p className="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">
                                        For Canadian citizens, Permanent Residents (PR), and protected persons residing in Ontario, get help with the cost of your Cannoga College post-secondary education through provincial and federal student loans, non-repayable grants, and bursaries.
                                    </p>
                                    <p className="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">
                                        The <strong className="text-slate-900 font-bold">Ontario Student Assistance Program (OSAP)</strong> and the National Student Loans Service Centre (NSLSC) offer flexible programs to calculate aid funding, cover educational living expenses, and assist with income-tailored loan repayment plans after graduation.
                                    </p>

                                    <ul className="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5">
                                        <li>
                                            <strong className="text-slate-900 font-bold">Non-Repayable Grants:</strong> Direct government funding that you do not need to pay back.
                                        </li>
                                        <li>
                                            <strong className="text-slate-900 font-bold">Student Loans:</strong> Interest-free funding throughout your full-time period of study.
                                        </li>
                                        <li>
                                            <strong className="text-slate-900 font-bold">Repayment Assistance:</strong> Repayment Assistance Plan (RAP) based on income after graduation.
                                        </li>
                                    </ul>

                                    <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-900">
                                        <Link href="https://www.ontario.ca/page/osap-ontario-student-assistance-program" target="_blank" className="underline hover:text-[#002f6c]">
                                            Check OSAP Eligibility Criteria &rarr;
                                        </Link>
                                        <span className="text-slate-300">•</span>
                                        <Link href="https://osap.gov.on.ca/AidEstimator2627Web/enterapp/enter.xhtml" target="_blank" className="underline hover:text-[#002f6c]">
                                            Estimate OSAP Aid Amount &rarr;
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="payment-methods" className="scroll-mt-32 space-y-4">
                            <div className="cc-section-divider !mb-6">
                                <h2 className="cc-h2">How Do I Pay?</h2>
                            </div>
                            <DbPageContent pageSlug={pageSlug} sectionKey="payment_methods_content" fallbackContent={getSectionDefault('payment_methods_content')} className="space-y-4 text-sm sm:text-base font-normal text-slate-700 leading-relaxed" />
                        </section>

                        <section id="timing" className="scroll-mt-32 space-y-4">
                            <div className="cc-section-divider !mb-6">
                                <h2 className="cc-h2">Tuition Fee Payment Schedule</h2>
                            </div>
                            <DbPageContent pageSlug={pageSlug} sectionKey="timing_content" fallbackContent={getSectionDefault('timing_content')} className="space-y-4 text-sm sm:text-base font-normal text-slate-700 leading-relaxed" />
                        </section>

                        <section id="additional-fees" className="scroll-mt-32 space-y-4">
                            <div className="cc-section-divider !mb-6">
                                <h2 className="cc-h2">Additional Fees &amp; Student Benefits</h2>
                            </div>
                            <DbPageContent pageSlug={pageSlug} sectionKey="additional_fees_content" fallbackContent={getSectionDefault('additional_fees_content')} className="space-y-6 text-sm sm:text-base font-normal text-slate-700 leading-relaxed" />
                        </section>

                        <section id="refunds" className="scroll-mt-32 space-y-4">
                            <div className="cc-section-divider !mb-6">
                                <h2 className="cc-h2">Refund Policy</h2>
                            </div>
                            <DbPageContent pageSlug={pageSlug} sectionKey="refunds_content" fallbackContent={getSectionDefault('refunds_content')} className="space-y-6 text-sm sm:text-base font-normal text-slate-700 leading-relaxed" />
                        </section>

                        <section id="faq" className="scroll-mt-32 space-y-4">
                            <div className="pb-1">
                                <h2 className="cc-h2">General FAQ</h2>
                            </div>
                            <TuitionFAQ />
                        </section>

                        <section id="contact" className="scroll-mt-32 space-y-4">
                            <div className="cc-section-divider !mb-6">
                                <h2 className="cc-h2">Need Help?</h2>
                            </div>
                            <DbPageContent pageSlug={pageSlug} sectionKey="contact_content" fallbackContent={getSectionDefault('contact_content')} className="space-y-4 text-sm sm:text-base font-normal text-slate-700 leading-relaxed" />
                        </section>

                    </main>
                </div>
            </GuideSidebarLayout>
        </div>
    );
}
