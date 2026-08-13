import { ArrowRight, CheckCircle } from '@phosphor-icons/react/dist/ssr';
import { Link } from '@/components/ui/Link';
import { CTA } from '@/components/ui/CTA';
import Image from 'next/image';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import CountryRequirementsDropdown from '@/components/admissions/CountryRequirementsDropdown';
import { Card } from '@/components/ui/Card';

const sections = [
    { id: 'overview', title: 'Overview', content: '' },
    { id: 'bachelor', title: "Bachelor's Requirements", content: '' },
    { id: 'master', title: "Master's Requirements", content: '' },
    { id: 'country-requirements', title: 'Country Specifics', content: '' },
    { id: 'english-proficiency', title: 'English Proficiency', content: '' },
    { id: 'faq', title: 'FAQ', content: '' },
];

export const metadata = {
    title: 'Academic Admission Requirements & Criteria — Cannoga College',
    description: 'Find everything you need to know about academic thresholds, English proficiency (IELTS/TOEFL), and required documentation for your application to Cannoga College in Ottawa, Ontario.',
    alternates: {
        canonical: 'https://cannogacollege.ca/admissions/requirements/',
    },
};

export default function RequirementsPage() {
    return (
        <GuideSidebarLayout sections={sections}>
            <div className="min-h-screen bg-white text-black font-sans pb-20">

                {/* ── HERO ── */}
                <section className="relative overflow-hidden text-white bg-[#000000]">
                    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
                        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
                        <div className="absolute bottom-0 -left-20 w-[350px] h-[350px] rounded-full bg-white/5 blur-2xl" />
                    </div>

                    <div className="relative z-10 cc-container flex flex-col lg:flex-row items-center gap-8 lg:gap-16 py-16 lg:py-0 lg:min-h-[520px]">
                        <div className="lg:w-1/2 space-y-6 flex flex-col justify-center">
                            <nav className="flex items-center gap-2 text-white/60 text-xs font-semibold uppercase tracking-widest">
                                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                                <span>/</span>
                                <Link href="/admissions" className="hover:text-white transition-colors">Admissions</Link>
                                <span>/</span>
                                <span className="text-white">Requirements</span>
                            </nav>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight text-white">
                                Admission Requirements
                            </h1>
                            <p className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed">
                                Find everything you need to know about academic thresholds, English proficiency, and required documentation for your application to Cannoga College.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <Link
                                    href="/portal/account/register"
                                    className="inline-flex items-center gap-2 bg-white text-[#000000] px-7 py-3.5 font-bold hover:bg-neutral-100 transition-all text-sm uppercase tracking-widest"
                                >
                                    Start Application <ArrowRight size={18} weight="bold" />
                                </Link>
                                <Link
                                    href="/admissions/application-process"
                                    className="inline-flex items-center gap-2 border-2 border-white text-white px-7 py-3.5 font-bold hover:bg-white/10 transition-all text-sm uppercase tracking-widest"
                                >
                                    How to Apply
                                </Link>
                            </div>
                        </div>

                        <div className="lg:w-1/2 h-full w-full relative lg:translate-y-8 flex justify-center lg:block order-first lg:order-none">
                            <div className="relative w-full aspect-[4/3] lg:h-[460px] lg:aspect-auto overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/admissions/hero.jpg"
                                    alt="Academic Admission Requirements at Cannoga College Ottawa"
                                    fill
                                    priority
                                    className="object-cover object-center opacity-90"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/50 via-transparent to-transparent" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── MAIN CONTENT ── */}
                <div className="cc-container py-12 md:py-20">
                    <div className="max-w-4xl mx-auto space-y-16 md:space-y-24">

                        {/* Overview */}
                        <section id="overview" className="scroll-mt-32">
                            <div className="cc-section-divider mb-8">
                                <h2 className="cc-h2">Admission Criteria & Criteria Overview</h2>
                            </div>
                            <p className="text-lg text-neutral-600 leading-relaxed max-w-3xl mb-6">
                                Cannoga College evaluates applicants holistically based on academic achievements, language proficiency, relevant background experience, and motivation. Requirements vary depending on your program level and country of study.
                            </p>
                        </section>

                        {/* Bachelor's Degrees */}
                        <section id="bachelor" className="scroll-mt-32">
                            <div className="cc-section-divider mb-8">
                                <h2 className="cc-h2">Bachelor's Degree Requirements</h2>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                <Card
                                    title="Upper Secondary Education"
                                    body="Certificate of Matriculation, High School Diploma, or equivalent foreign qualification from a recognized institution."
                                />
                                <Card
                                    title="English Proficiency"
                                    body="Minimum IELTS 6.0 overall, TOEFL iBT 60, PTE Academic 54, or equivalent certified test score."
                                />
                                <Card
                                    title="Entrance Exam / SAT"
                                    body="Applying via SAT scores is accepted for all Engineering, Technology, and Business degree programs."
                                />
                            </div>
                        </section>

                        {/* Master's Degrees */}
                        <section id="master" className="scroll-mt-32">
                            <div className="cc-section-divider mb-8">
                                <h2 className="cc-h2">Master's Degree Requirements</h2>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                <Card
                                    title="Bachelor's Degree"
                                    body="Completed Bachelor's degree in a relevant field of study from an accredited university or college."
                                />
                                <Card
                                    title="Work Experience"
                                    body="Minimum of 2 years of relevant post-graduation professional work experience for post-graduate master programs."
                                />
                                <Card
                                    title="Motivation Video & CV"
                                    body="A 2-minute video introducing yourself and your goals, alongside an updated professional resume."
                                />
                            </div>
                        </section>

                        {/* Country-Specific Requirements */}
                        <section id="country-requirements" className="scroll-mt-32">
                            <div className="cc-section-divider mb-8">
                                <h2 className="cc-h2">International Admissions Requirements by Country</h2>
                            </div>
                            <CountryRequirementsDropdown />
                        </section>

                        {/* English Proficiency */}
                        <section id="english-proficiency" className="scroll-mt-32">
                            <div className="cc-section-divider mb-8">
                                <h2 className="cc-h2">English Language Proficiency & Exemptions</h2>
                            </div>
                            <div className="bg-[#f5f5f5] p-8 space-y-6">
                                <h3 className="text-xl font-bold text-black">Accepted Test Scores</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-neutral-700">
                                        <CheckCircle size={20} weight="fill" className="text-[#0a151a] shrink-0 mt-0.5" />
                                        <span><strong>IELTS Academic:</strong> Overall 6.0 (with no individual band below 5.5) for Bachelor's; 6.5 for Master's.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-neutral-700">
                                        <CheckCircle size={20} weight="fill" className="text-[#0a151a] shrink-0 mt-0.5" />
                                        <span><strong>TOEFL iBT:</strong> Minimum score of 60 (Bachelor's) or 80 (Master's).</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-neutral-700">
                                        <CheckCircle size={20} weight="fill" className="text-[#0a151a] shrink-0 mt-0.5" />
                                        <span><strong>Duolingo English Test:</strong> Minimum score of 105 (Bachelor's) or 115 (Master's).</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-neutral-700">
                                        <CheckCircle size={20} weight="fill" className="text-[#0a151a] shrink-0 mt-0.5" />
                                        <span><strong>PTE Academic:</strong> Minimum score of 54 (Bachelor's) or 62 (Master's).</span>
                                    </li>
                                </ul>

                                <div className="pt-4 border-t border-neutral-200">
                                    <h4 className="font-bold text-black mb-2">Exemptions</h4>
                                    <p className="text-neutral-600 text-sm leading-relaxed">
                                        Applicants who have completed upper secondary or higher education in English in Canada, USA, UK, Australia, New Zealand, or select English-speaking nations are exempt from language test submission.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* CTA */}
                        <section className="mt-8">
                            <CTA
                                title="Ready to Begin Your Application?"
                                body="Join students from around the world at Cannoga College in Ottawa, Ontario. Create your portal account to start your official application."
                                cta={{
                                    label: "Create Portal Account",
                                    linkComponentProps: {
                                        href: "/portal/account/register",
                                    },
                                }}
                            />
                        </section>

                        {/* FAQ */}
                        <section id="faq" className="scroll-mt-32">
                            <div className="cc-section-divider mb-8">
                                <h2 className="cc-h2">Requirements FAQ</h2>
                            </div>
                            <div className="space-y-6">
                                <div className="border-b border-neutral-100 pb-6">
                                    <h3 className="font-bold text-lg text-black mb-2">When is the application deadline?</h3>
                                    <p className="text-neutral-600 leading-relaxed">
                                        Deadlines vary by intake term. Fall Intake (September) applications close June 30, and Winter Intake (January) applications close October 31.
                                    </p>
                                </div>
                                <div className="border-b border-neutral-100 pb-6">
                                    <h3 className="font-bold text-lg text-black mb-2">Can I submit certified translations of my documents?</h3>
                                    <p className="text-neutral-600 leading-relaxed">
                                        Yes, all official transcripts and academic records not issued in English or French must be accompanied by certified official translations.
                                    </p>
                                </div>
                                <div className="pb-6">
                                    <h3 className="font-bold text-lg text-black mb-2">Are conditional offers available for language preparation?</h3>
                                    <p className="text-neutral-600 leading-relaxed">
                                        Yes, applicants who meet all academic requirements but fall slightly below language requirements may receive a conditional letter of acceptance pending completion of an accredited pathway program.
                                    </p>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>

            </div>
        </GuideSidebarLayout>
    );
}
