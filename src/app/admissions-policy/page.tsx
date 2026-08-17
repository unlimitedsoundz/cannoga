import type { Metadata } from 'next';
import { Hero } from '@/components/layout/Hero';
import { Link } from '@/components/ui/Link';
import AcademicRegulationsAccordion from '@/components/academic/AcademicRegulationsAccordion';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';

export const metadata: Metadata = {
    title: 'Institutional Admissions Policy',
    description: 'Read the official policy governing selection standards, fairness, equality, and admission decisions at Cannoga College.',
    alternates: {
        canonical: 'https://cannogacollege.ca/admissions-policy/',
    },
};

const admissionsPolicies = [
    {
        id: "adm-1",
        question: "1. Purpose, Core Principles & Diversity Commitment",
        order_index: 1,
        answer: (
            <div className="space-y-3">
                <p>The Admissions Policy of Cannoga College defines the principles, academic criteria, and evaluation procedures governing entry into all Bachelor&apos;s, Master&apos;s, Diploma, and Certificate programmes.</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Equal Opportunity:</strong> Absolute fairness, transparent merit assessment, and non-discrimination on grounds of nationality, gender, ethnicity, or faith.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Ontario Standards:</strong> Complies fully with Ontario Ministry of Colleges and Universities admission directives.</span>
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
        question: "3. Postgraduate & Master's Entry Requirements",
        order_index: 3,
        answer: (
            <div className="space-y-3">
                <p>Criteria for entry into postgraduate certificate and Master&apos;s degree programmes:</p>
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
                        <span><strong>Supporting Portfolio:</strong> Statement of intent, curriculum vitae, 2 academic/professional recommendation letters, and writing samples.</span>
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
        question: "5. Application Evaluation, Offers & Acceptance",
        order_index: 5,
        answer: (
            <div className="space-y-3">
                <p>The Admissions Committee conducts holistic assessments of each applicant profile:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Conditional Offer of Admission:</strong> Issued pending the receipt of final secondary/university transcripts or English language test scores.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Unconditional Offer:</strong> Issued once all academic prerequisites and document authentications are satisfied.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Acceptance Deposit:</strong> Securing an enrolment seat requires submitting an official Acceptance Form and tuition confirmation deposit by the deadline.</span>
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
                <p>Cannoga College maintains rigorous verification mechanisms against credential forgery:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>All academic transcripts, degree certificates, and test scores are cross-verified with issuing examination bodies and World Education Services (WES).</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Discovery of falsified documents or misleading statements will result in immediate revocation of offers, expulsion, and notification to Canadian immigration authorities.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "adm-7",
        question: "7. Admissions Appeals & Re-Evaluation Rights",
        order_index: 7,
        answer: (
            <div className="space-y-3">
                <p>Applicants whose applications are declined may request a formal re-evaluation if valid grounds exist:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Appeals Window:</strong> Must be submitted in writing within 14 calendar days of receiving the rejection notice.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Valid Grounds:</strong> Documented administrative error, omission of submitted credentials, or substantial updated academic grades.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Admissions Review Board:</strong> The Dean of Admissions convenes a review panel whose final written determination is conclusive.</span>
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
                body="Defining the principles, evaluation criteria, equality standards, and procedures governing admission to all academic programs at Cannoga College."
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
                    <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight">Selection Standards &amp; Entry Framework</h2>
                    <p className="text-slate-700 text-base md:text-lg font-normal leading-relaxed max-w-3xl">
                        Review academic entry benchmarks, English language requirements, credential authentication, and appeals procedures.
                    </p>
                </section>

                <section className="pt-4">
                    <AcademicRegulationsAccordion items={admissionsPolicies} />
                </section>

                {/* RELATED LINKS */}
                <section className="pt-8 border-t border-slate-200 space-y-6">
                    <h3 className="text-2xl font-black text-black tracking-tight">Related Admissions Resources</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <Link 
                            href="/admissions" 
                            className="p-5 border border-slate-200 hover:border-black transition-colors block text-[#0a151a] font-bold text-base no-underline rounded-sm space-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <span>Admissions Overview</span>
                                <ArrowRight size={16} weight="bold" />
                            </div>
                            <p className="text-sm text-slate-600 font-normal leading-normal">Application deadlines and fees</p>
                        </Link>
                        <Link 
                            href="/degree-programmes" 
                            className="p-5 border border-slate-200 hover:border-black transition-colors block text-[#0a151a] font-bold text-base no-underline rounded-sm space-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <span>Degree Programmes</span>
                                <ArrowRight size={16} weight="bold" />
                            </div>
                            <p className="text-sm text-slate-600 font-normal leading-normal">Explore faculty curriculum and majors</p>
                        </Link>
                        <Link 
                            href="/refund-withdrawal-policy" 
                            className="p-5 border border-slate-200 hover:border-black transition-colors block text-[#0a151a] font-bold text-base no-underline rounded-sm space-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <span>Refund Policy</span>
                                <ArrowRight size={16} weight="bold" />
                            </div>
                            <p className="text-sm text-slate-600 font-normal leading-normal">Tuition deposit and withdrawal terms</p>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
