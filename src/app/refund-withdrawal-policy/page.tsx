import { Link } from "@aalto-dx/react-components";
import { ArrowLeft, FileText, CheckCircle, Warning, Envelope, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Hero } from '@/components/layout/Hero';

export const metadata = {
    title: 'Tuition Refund & Course Withdrawal Terms — Cannoga College',
    description: 'Review official guidelines, Canadian IRCC study permit refund policies, withdrawal deadlines, and administrative procedures for tuition and fee refunds.',
    alternates: {
        canonical: 'https://cannogacollege.ca/refund-withdrawal-policy/',
    },
};

export default function RefundWithdrawalPolicyPage() {
    return (
        <div className="bg-white min-h-screen font-sans text-black">
            {/* HERO SECTION */}
            <Hero
                title="Tuition Refund & Withdrawal Policy"
                body="Official institutional guidelines governing voluntary withdrawals, IRCC study permit refusals, tuition refund schedules, and financial obligations at Cannoga College in Ottawa, Ontario."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Admissions', href: '/admissions' },
                    { label: 'Refund Policy' }
                ]}
            />

            {/* MAIN CONTENT WITH SIDEBAR NAVIGATION */}
            <div className="container mx-auto max-w-6xl px-4 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* STICKY SECTION NAV */}
                <div className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-28 space-y-4 p-6 bg-slate-50 border border-slate-200 rounded-none text-xs font-bold uppercase tracking-wider text-slate-700">
                        <p className="text-slate-400 text-[10px] pb-2 border-b border-slate-200">Policy Table of Contents</p>
                        <nav className="flex flex-col space-y-2.5">
                            <a href="#purpose" className="hover:text-black transition-colors">1. Purpose & Compliance</a>
                            <a href="#scope" className="hover:text-black transition-colors">2. Policy Scope</a>
                            <a href="#definitions" className="hover:text-black transition-colors">3. Definitions</a>
                            <a href="#general-principles" className="hover:text-black transition-colors">4. General Principles</a>
                            <a href="#withdrawal-procedure" className="hover:text-black transition-colors">5. Withdrawal Procedures</a>
                            <a href="#ircc-visa-refusal" className="hover:text-black transition-colors">6. IRCC Visa Refusals</a>
                            <a href="#refund-schedule" className="hover:text-black transition-colors">7. Refund Schedule</a>
                            <a href="#refund-process" className="hover:text-black transition-colors">8. Refund Processing</a>
                            <a href="#special-circumstances" className="hover:text-black transition-colors">9. Special Circumstances</a>
                        </nav>
                    </div>
                </div>

                {/* POLICY CONTENT BODY */}
                <div className="lg:col-span-3 space-y-14">

                    {/* 1. PURPOSE */}
                    <section id="purpose" className="scroll-mt-28 border-t-2 border-[#0a151a] pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">01</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Purpose & Institutional Compliance</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            The purpose of this Refund & Withdrawal Policy is to define transparent financial rules for tuition payments, administrative processing fees, and formal program withdrawals at Cannoga College.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed mb-6">
                            This policy operates under the guidelines of the Ministry of Colleges and Universities (MCU) in Ontario and applies to all registered students across our <Link href="/degree-programmes" className="text-[#0a151a] font-bold underline hover:text-sky-700 transition-colors">Degree, Diploma, and Certificate Programs</Link>. For questions regarding your student balance, review the <Link href="/admissions/tuition" className="text-[#0a151a] font-bold underline hover:text-sky-700 transition-colors">Tuition & Fee Schedules</Link> or consult <Link href="/contact" className="text-[#0a151a] font-bold underline hover:text-sky-700 transition-colors">Student Financial Services</Link>.
                        </p>
                    </section>

                    {/* 2. SCOPE */}
                    <section id="scope" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">02</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Policy Scope</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">This policy applies to all financial transactions associated with:</p>
                        <ul className="list-disc pl-6 space-y-2 text-base text-slate-800 marker:text-black mb-6">
                            <li>Annual academic tuition fees (Domestic &amp; International)</li>
                            <li>Administrative registration fees and non-refundable deposits</li>
                            <li>On-campus housing and residence charges (refer to <Link href="/student-guide/housing-for-students" className="text-[#0a151a] font-bold underline hover:text-sky-700 transition-colors">Student Housing Services</Link>)</li>
                            <li>International student health insurance premiums</li>
                        </ul>
                    </section>

                    {/* 3. DEFINITIONS */}
                    <section id="definitions" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">03</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Definitions</h2>
                        </div>
                        <div className="border border-slate-200 rounded-none overflow-hidden text-sm">
                            <div className="grid grid-cols-1 md:grid-cols-3 bg-slate-100 p-4 font-bold text-slate-900 border-b border-slate-200">
                                <div>Term</div>
                                <div className="md:col-span-2">Official Canadian Institutional Definition</div>
                            </div>
                            {[
                                { term: "Voluntary Withdrawal", def: "Formal written notice submitted by a student to discontinue enrollment prior to academic deadlines." },
                                { term: "IRCC Visa Refusal", def: "Study Permit rejection issued by Immigration, Refugees and Citizenship Canada (IRCC)." },
                                { term: "Tuition Fee", def: "Instructional fees charged for registered academic credits, courses, and laboratory usage." },
                                { term: "Administrative Fee", def: "Non-refundable administrative fee of $100 CAD deducted from tuition refunds to cover processing." },
                                { term: "Leave of Absence", def: "An approved academic break granted by the Registrar's Office for up to two consecutive terms." },
                            ].map((item, i, arr) => (
                                <div key={i} className={`grid grid-cols-1 md:grid-cols-3 p-4 ${i !== arr.length - 1 ? 'border-b border-slate-200' : ''} hover:bg-slate-50 transition-colors`}>
                                    <div className="font-bold text-slate-900 mb-1 md:mb-0">{item.term}</div>
                                    <div className="md:col-span-2 text-slate-700">{item.def}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 4. GENERAL PRINCIPLES */}
                    <section id="general-principles" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">04</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">General Principles</h2>
                        </div>
                        <ul className="list-disc pl-6 space-y-3 text-base text-slate-800 marker:text-black">
                            <li>All tuition rates and mandatory fees are published in CAD ($) on the <Link href="/admissions/tuition" className="text-[#0a151a] font-bold underline hover:text-sky-700 transition-colors">Tuition Information page</Link>.</li>
                            <li>Registration is confirmed upon receipt of the required tuition deposit or official Letter of Acceptance (LOA).</li>
                            <li>Refunds are issued directly to the original account or payment channel used during tuition payment.</li>
                        </ul>
                    </section>

                    {/* 5. WITHDRAWAL PROCEDURE */}
                    <section id="withdrawal-procedure" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">05</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Withdrawal Procedures</h2>
                        </div>
                        <div className="space-y-6 text-base text-slate-700">
                            <div className="p-6 bg-slate-50 border border-slate-200 rounded-none">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">5.1 Voluntary Withdrawal Steps</h3>
                                <p className="mb-4">
                                    To officially withdraw from a program, students must submit a formal Withdrawal Form via the <Link href="/portal/apply" className="text-[#0a151a] font-bold underline hover:text-sky-700 transition-colors">Cannoga Student Portal</Link> or directly to the <Link href="/contact" className="text-[#0a151a] font-bold underline hover:text-sky-700 transition-colors">Office of the Registrar</Link>.
                                </p>
                                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                                    Note: Ceasing to attend classes or notifying an instructor does not constitute an official withdrawal.
                                </p>
                            </div>

                            <div className="p-6 bg-slate-50 border border-slate-200 rounded-none">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">5.2 Involuntary Withdrawal</h3>
                                <p className="mb-2">
                                    Involuntary withdrawal occurs in cases of academic dismissal, non-payment of tuition, or violations of the <Link href="/code-of-conduct" className="text-[#0a151a] font-bold underline hover:text-sky-700 transition-colors">Student Code of Conduct</Link>.
                                </p>
                                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                                    Refunds are not granted to students dismissed for disciplinary infractions.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 6. IRCC STUDY PERMIT REFUSAL POLICY */}
                    <section id="ircc-visa-refusal" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">06</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">IRCC Study Permit (Visa) Refusals</h2>
                        </div>
                        <div className="p-6 bg-sky-50 border border-sky-200 rounded-none text-slate-800 space-y-4">
                            <p className="text-base font-bold text-slate-900">
                                Protection for International Applicants:
                            </p>
                            <p className="text-base leading-relaxed">
                                International applicants who are refused a Canadian Study Permit by Immigration, Refugees and Citizenship Canada (IRCC) are eligible for a <strong>100% refund of prepaid tuition fees</strong>, minus a <strong>$100 CAD administrative processing fee</strong>.
                            </p>
                            <div className="text-sm space-y-2 pt-2 border-t border-sky-200">
                                <p className="font-bold text-slate-900">Requirements for Visa Refusal Refund:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Provide the official IRCC Refusal Letter issued by the Canadian Embassy or High Commission.</li>
                                    <li>Submit the refund request within 14 calendar days of receiving the IRCC refusal notice.</li>
                                    <li>Request must be submitted prior to the official course start date. Review <Link href="/student-guide/international" className="text-[#0a151a] font-bold underline hover:text-sky-700 transition-colors">International Student Guidelines</Link>.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 7. REFUND SCHEDULE */}
                    <section id="refund-schedule" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">07</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Tuition Refund Schedule (Semester Basis)</h2>
                        </div>
                        <div className="border border-slate-200 rounded-none overflow-hidden text-sm mb-4">
                            <div className="grid grid-cols-2 bg-slate-900 text-white p-4 font-bold uppercase text-xs tracking-wider">
                                <div>Withdrawal Timing</div>
                                <div>Tuition Refund Percentage</div>
                            </div>
                            {[
                                { timing: "Prior to Semester Start Date", refund: "100% Refund (minus $100 CAD admin fee)" },
                                { timing: "Within 1st to 10th Business Day of Term", refund: "80% Refund of Term Tuition" },
                                { timing: "11th to 20th Business Day of Term", refund: "50% Refund of Term Tuition" },
                                { timing: "After 20th Business Day of Term", refund: "0% Refund (Full Fee Payable)" },
                            ].map((item, i, arr) => (
                                <div key={i} className={`grid grid-cols-2 p-4 ${i !== arr.length - 1 ? 'border-b border-slate-200' : ''} hover:bg-slate-50 transition-colors`}>
                                    <div className="font-semibold text-slate-900">{item.timing}</div>
                                    <div className="font-black text-slate-900">{item.refund}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 8. REFUND PROCESSING */}
                    <section id="refund-process" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">08</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Refund Processing & Timeline</h2>
                        </div>
                        <ol className="list-decimal pl-6 space-y-3 text-base text-slate-800 marker:font-bold">
                            <li>The Office of the Registrar validates withdrawal dates and eligibility.</li>
                            <li>Student Financial Services calculates final refunds minus applicable processing charges.</li>
                            <li>Refunds are issued within <strong>30 business days</strong> via bank transfer, Flywire, or original credit card.</li>
                            <li>A formal electronic statement is emailed to the student upon execution.</li>
                        </ol>
                    </section>

                    {/* 9. SPECIAL CIRCUMSTANCES */}
                    <section id="special-circumstances" className="scroll-mt-28 border-t border-slate-200 pt-8 border-b pb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">09</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Special Extenuating Circumstances</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Students facing severe medical emergencies, bereavement, or compassionate grounds may petition for an exception to the standard refund schedule.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Appeals must be submitted with official supporting documentation to the <Link href="/contact" className="text-[#0a151a] font-bold underline hover:text-sky-700 transition-colors">Academic Appeals Committee</Link> within 30 days of withdrawal.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}
