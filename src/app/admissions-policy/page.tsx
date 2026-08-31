import type { Metadata } from 'next';
import { Hero } from '@/components/layout/Hero';
import { Link } from '@/components/ui/Link';
import AcademicRegulationsAccordion from '@/components/academic/AcademicRegulationsAccordion';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';

export const metadata: Metadata = {
    title: 'Admissions Policy & Guidelines',
    description: 'Learn about our admissions principles, selection criteria, eligibility standards, and evaluation framework for prospective students.',
    alternates: {
        canonical: 'https://cannogacollege.ca/admissions-policy/',
    },
};

const admissionsPolicies = [
    {
        id: "adm-1",
        question: "1. Purpose, Scope & Non-Discrimination Policy",
        order_index: 1,
        answer: (
            <div className="space-y-3">
                <p>Cannoga College is committed to equitable, transparent, and merit-based access to higher education. This policy defines the institutional criteria and procedural framework governing all undergraduate and postgraduate admissions.</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Equal Opportunity:</strong> Decisions are made without regard to race, ancestry, place of origin, ethnic origin, citizenship, creed, sex, sexual orientation, gender identity, age, marital status, or disability.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Integrity:</strong> All applicant dossiers are vetted for authentic academic credentials under Ontario Ministry standards.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "adm-2",
        question: "2. Undergraduate Entry Requirements",
        order_index: 2,
        answer: (
            <div className="space-y-3">
                <p>Standard qualification benchmarks for undergraduate degree and diploma candidates:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Ontario Secondary School Diploma (OSSD):</strong> Or equivalent Canadian/International secondary credential with at least six Grade 12 U/M courses.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Minimum GPA Threshold:</strong> Competitive overall average of 70% or higher (higher thresholds apply to specialized engineering and computing tracks).</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Prerequisite Subjects:</strong> Grade 12 English (ENG4U) and mathematics prerequisites as specified by faculty curriculum.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "adm-3",
        question: "3. Advanced Diploma & Postgraduate Entry Requirements",
        order_index: 3,
        answer: (
            <div className="space-y-3">
                <p>Criteria for entry into 3-year Advanced Diploma and postgraduate certificate programmes:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Recognized Bachelor&apos;s Degree:</strong> Minimum 4-year undergraduate degree from an accredited university or institutional equivalent.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Academic Standing:</strong> Minimum cumulative GPA of 3.0 on a 4.0 scale (or equivalent B grade / second-class upper division) in final two years of study.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Required Documentation:</strong> Official undergraduate academic transcripts, degree graduation certificate, and proof of English language proficiency.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "adm-4",
        question: "4. English Language Proficiency (ELP) Standards",
        order_index: 4,
        answer: (
            <div className="space-y-3">
                <p>Applicants whose primary language is not English must demonstrate proficiency through recognized standardized examinations:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-4 border border-slate-200 rounded-sm">
                        <h4 className="font-bold text-slate-900 text-base">IELTS Academic</h4>
                        <p className="text-sm text-slate-600 font-normal mt-1">Undergraduate: 6.5 overall (no band under 6.0). Postgraduate: 7.0 overall (no band under 6.5).</p>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-sm">
                        <h4 className="font-bold text-slate-900 text-base">TOEFL iBT</h4>
                        <p className="text-sm text-slate-600 font-normal mt-1">Undergraduate: Minimum score 88 (subscores 20+). Postgraduate: Minimum score 100 (subscores 22+).</p>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-sm">
                        <h4 className="font-bold text-slate-900 text-base">Duolingo English Test (DET)</h4>
                        <p className="text-sm text-slate-600 font-normal mt-1">Undergraduate: Minimum 115. Postgraduate: Minimum 125 overall.</p>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-sm">
                        <h4 className="font-bold text-slate-900 text-base">ELP Exemption</h4>
                        <p className="text-sm text-slate-600 font-normal mt-1">Granted if applicant has completed 3+ consecutive years of full-time study in an English-medium curriculum.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: "adm-5",
        question: "5. Application Assessment & Selection Process",
        order_index: 5,
        answer: (
            <div className="space-y-3">
                <p>How the Admissions Committee reviews and ranks submissions:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Holistic Evaluation:</strong> Primary emphasis on certified academic transcripts, prerequisite performance, and overall grade point averages.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Conditional Offers:</strong> Issued to graduating high school or university students pending final transcript submission.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Provincial Attestation Letter (PAL):</strong> Distributed to eligible international candidates upon acceptance and required tuition deposit.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "adm-6",
        question: "6. Credential Authentication & Fraud Prevention",
        order_index: 6,
        answer: (
            <div className="space-y-3">
                <p>Institutional verification procedures ensuring academic honesty:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Direct Verification:</strong> Transcripts and test scores are verified directly with issuing exam boards (WES, ICAS, IELTS, ETS, Duolingo).</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Revocation of Offer:</strong> Misrepresentation, forged documents, or fraudulent statements will lead to immediate cancellation of admission and disciplinary barring.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "adm-7",
        question: "7. Admissions Appeals & Re-evaluation",
        order_index: 7,
        answer: (
            <div className="space-y-3">
                <p>Procedures for requesting a review of an adverse admissions decision:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Submission Window:</strong> Written appeal must be filed with the Registrar within 14 calendar days of decision notice.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Valid Grounds:</strong> Documented administrative error, calculation mistake, or unforeseen extenuating medical circumstances. Academic discretion alone is not appealable.</span>
                    </li>
                </ul>
            </div>
        )
    }
];

export default function AdmissionsPolicyPage() {
    return (
        <div className="min-h-screen bg-white text-black antialiased font-sans pb-24">
            {/* HERO SECTION */}
            <Hero
                title="Admissions Policy"
                body="Institutional guidelines, eligibility standards, and evaluation frameworks governing student entry to Cannoga College in Ottawa."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                overlay={true}
                overlayOpacity="opacity-40"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Admissions Policy' }
                ]}
                image={{
                    src: "/images/alumni-hero.png",
                    alt: "Cannoga Admissions Policy"
                }}
            />

            {/* MAIN CONTENT ACCORDION */}
            <main className="container mx-auto max-w-5xl px-4 py-16 space-y-16 text-base md:text-lg font-normal text-slate-700 leading-relaxed">
                <section className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight">Institutional Admissions Standards</h2>
                    <p className="text-slate-700 text-base md:text-lg font-normal leading-relaxed max-w-3xl">
                        Review the formal guidelines, minimum academic thresholds, and verification criteria applicable to all prospective students.
                    </p>
                </section>

                <section className="pt-4">
                    <AcademicRegulationsAccordion items={admissionsPolicies} />
                </section>

                {/* RELATED LINKS */}
                <section className="pt-8 border-t border-slate-200 space-y-6">
                    <h3 className="text-2xl font-black text-black tracking-tight">Related Admissions Links</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <Link 
                            href="/admissions/master/" 
                            className="p-5 border border-slate-200 hover:border-black transition-colors block text-[#0a151a] font-bold text-base no-underline rounded-sm space-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <span>Advanced Diploma Admissions</span>
                                <ArrowRight size={16} weight="bold" />
                            </div>
                            <p className="text-sm text-slate-600 font-normal leading-normal">Entry criteria and deadlines</p>
                        </Link>
                        <Link 
                            href="/admissions/bachelor/" 
                            className="p-5 border border-slate-200 hover:border-black transition-colors block text-[#0a151a] font-bold text-base no-underline rounded-sm space-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <span>Bachelor's Admissions</span>
                                <ArrowRight size={16} weight="bold" />
                            </div>
                            <p className="text-sm text-slate-600 font-normal leading-normal">High school entry standards</p>
                        </Link>
                        <Link 
                            href="/refund-withdrawal-policy/" 
                            className="p-5 border border-slate-200 hover:border-black transition-colors block text-[#0a151a] font-bold text-base no-underline rounded-sm space-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <span>Refund Policy</span>
                                <ArrowRight size={16} weight="bold" />
                            </div>
                            <p className="text-sm text-slate-600 font-normal leading-normal">Tuition deposits and withdrawals</p>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
