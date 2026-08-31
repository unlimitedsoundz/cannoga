import type { Metadata } from 'next';
import { Hero } from '@/components/layout/Hero';
import { Link } from '@/components/ui/Link';
import AcademicRegulationsAccordion from '@/components/academic/AcademicRegulationsAccordion';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';

export const metadata: Metadata = {
    title: 'Tuition Refund & Course Withdrawal Terms',
    description: 'Review official guidelines, Canadian IRCC study permit refund policies, withdrawal deadlines, and administrative procedures for tuition and fee refunds.',
    alternates: {
        canonical: 'https://cannogacollege.ca/refund-withdrawal-policy/',
    },
};

const refundPolicies = [
    {
        id: "refund-1",
        question: "1. Purpose & Institutional Compliance",
        order_index: 1,
        answer: (
            <div className="space-y-3">
                <p>The Refund &amp; Withdrawal Policy defines transparent financial rules for tuition disbursements, administrative deductions, and program withdrawals at Cannoga College in Ottawa, Ontario.</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Operates under the standards established by the Ontario Ministry of Colleges and Universities (MCU).</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span>Applies across all Bachelor&apos;s, Advanced Diploma, Diploma, and Postgraduate Certificate streams.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "refund-2",
        question: "2. Scope & Applicable Fee Types",
        order_index: 2,
        answer: (
            <div className="space-y-3">
                <p>This policy covers all financial fee categories associated with student registration:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Academic Tuition:</strong> Instructional fees for enrolled courses and laboratory units.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Tuition Confirmation Deposit:</strong> A standard $2,000 CAD deposit required to confirm admission and issue Provincial Attestation Letters (PAL). Credited 100% directly towards first-term tuition balance.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Administrative Registration Fees:</strong> Fixed non-refundable institutional enrollment processing fees.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Campus Housing &amp; Residence:</strong> Subject to specific residential license agreements.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Health Insurance (UHIP):</strong> Prorated according to provider cancellation policies.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "refund-3",
        question: "3. IRCC Study Permit / Visa Refusal Policy",
        order_index: 3,
        answer: (
            <div className="space-y-3">
                <p>International applicants denied a Study Permit by Immigration, Refugees and Citizenship Canada (IRCC) are entitled to a full tuition refund:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>100% Tuition Refund:</strong> All prepaid tuition fees will be refunded, less a standard $100 CAD administrative processing deduction.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Documentary Submission:</strong> Official IRCC Refusal Letter must be submitted to the Registrar within 14 calendar days of issuance.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Verification Protocol:</strong> Cannoga College verifies the authenticity of IRCC refusal documentation before releasing funds.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "refund-4",
        question: "4. Voluntary Program Withdrawal & Refund Schedule",
        order_index: 4,
        answer: (
            <div className="space-y-4">
                <p>Tuition refunds for voluntary withdrawals are calculated strictly from the official date of written notice received by the Registrar:</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse border border-slate-200">
                        <thead>
                            <tr className="bg-[#0a151a] text-white">
                                <th className="p-3 font-bold border border-slate-700">Withdrawal Notice Period</th>
                                <th className="p-3 font-bold border border-slate-700">Tuition Refund Percentage</th>
                                <th className="p-3 font-bold border border-slate-700">Transcript Record</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700 divide-y divide-slate-200">
                            <tr><td className="p-2.5 font-bold border">Prior to Term Start Date</td><td className="p-2.5 border">100% tuition (minus $100 CAD admin fee)</td><td className="p-2.5 border">No record on transcript</td></tr>
                            <tr><td className="p-2.5 font-bold border">Day 1 to Day 10 of Term</td><td className="p-2.5 border">80% tuition refund</td><td className="p-2.5 border">No record on transcript</td></tr>
                            <tr><td className="p-2.5 font-bold border">Day 11 to Day 20 of Term</td><td className="p-2.5 border">50% tuition refund</td><td className="p-2.5 border">Recorded as &apos;W&apos; (Withdrawn)</td></tr>
                            <tr><td className="p-2.5 font-bold border">Day 21 to Day 30 of Term</td><td className="p-2.5 border">25% tuition refund</td><td className="p-2.5 border">Recorded as &apos;W&apos; (Withdrawn)</td></tr>
                            <tr><td className="p-2.5 font-bold text-red-600 border">After Day 30 of Term</td><td className="p-2.5 font-bold text-red-600 border">0% (No refund)</td><td className="p-2.5 border">Recorded as &apos;W&apos; or &apos;F&apos;</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    },
    {
        id: "refund-5",
        question: "5. Refund Disbursement Channels & Timelines",
        order_index: 5,
        answer: (
            <div className="space-y-3">
                <p>Standard protocols for releasing approved refund disbursements:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Original Payment Source:</strong> In compliance with Canadian anti-money laundering (AML) laws, all refunds are returned to the originating bank account, credit card, or Flywire/Convera profile.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Processing Timeframe:</strong> Completed refund requests are audited and processed within 30 business days from approval date.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Banking Charges:</strong> International intermediary wire transfer charges and currency conversion adjustments are the responsibility of the recipient.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "refund-6",
        question: "6. Compassionate Grounds & Extenuating Circumstances",
        order_index: 6,
        answer: (
            <div className="space-y-3">
                <p>Exceptions to standard refund schedules under verified humanitarian emergencies:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Severe Medical Incapacity:</strong> Certified doctor&apos;s records proving sudden debilitating illness preventing study continuation.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Bereavement &amp; Crisis:</strong> Loss of an immediate family member or major civic disaster.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Review Panel:</strong> Special petitions are reviewed by the Registrar&apos;s Financial Appeals Committee for prorated adjustments.</span>
                    </li>
                </ul>
            </div>
        )
    }
];

export default function RefundWithdrawalPolicyPage() {
    return (
        <div className="min-h-screen bg-white text-black antialiased font-sans pb-24">
            {/* HERO SECTION */}
            <Hero
                title="Tuition Refund & Withdrawal Policy"
                body="Official institutional guidelines governing voluntary withdrawals, IRCC study permit refusals, tuition refund schedules, and financial obligations at Cannoga College."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                overlay={true}
                overlayOpacity="opacity-40"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Refund Policy' }
                ]}
                image={{
                    src: "/images/alumni-hero.png",
                    alt: "Cannoga Refund Policy"
                }}
            />

            {/* MAIN CONTENT ACCORDION */}
            <main className="container mx-auto max-w-5xl px-4 py-16 space-y-16 text-base md:text-lg font-normal text-slate-700 leading-relaxed">
                <section className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight">Tuition Disbursement &amp; Withdrawal Guidelines</h2>
                    <p className="text-slate-700 text-base md:text-lg font-normal leading-relaxed max-w-3xl">
                        Review refund schedules, Canadian study permit refusal rules, processing timelines, and withdrawal procedures.
                    </p>
                </section>

                <section className="pt-4">
                    <AcademicRegulationsAccordion items={refundPolicies} />
                </section>

                {/* RELATED LINKS */}
                <section className="pt-8 border-t border-slate-200 space-y-6">
                    <h3 className="text-2xl font-black text-black tracking-tight">Related Financial &amp; Admission Resources</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <Link 
                            href="/admissions/" 
                            className="p-5 border border-slate-200 hover:border-black transition-colors block text-[#0a151a] font-bold text-base no-underline rounded-sm space-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <span>Admissions Overview</span>
                                <ArrowRight size={16} weight="bold" />
                            </div>
                            <p className="text-sm text-slate-600 font-normal leading-normal">Entry requirements and deadlines</p>
                        </Link>
                        <Link 
                            href="/admissions-policy/" 
                            className="p-5 border border-slate-200 hover:border-black transition-colors block text-[#0a151a] font-bold text-base no-underline rounded-sm space-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <span>Admissions Policy</span>
                                <ArrowRight size={16} weight="bold" />
                            </div>
                            <p className="text-sm text-slate-600 font-normal leading-normal">Selection criteria and guidelines</p>
                        </Link>
                        <Link 
                            href="/contact/" 
                            className="p-5 border border-slate-200 hover:border-black transition-colors block text-[#0a151a] font-bold text-base no-underline rounded-sm space-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <span>Financial Services</span>
                                <ArrowRight size={16} weight="bold" />
                            </div>
                            <p className="text-sm text-slate-600 font-normal leading-normal">Billing and payments support</p>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
