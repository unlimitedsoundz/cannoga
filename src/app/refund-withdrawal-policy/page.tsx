import { Link } from "@aalto-dx/react-components";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
    title: 'Tuition Refund & Course Withdrawal Terms — Cannoga College',
    description: 'Review key guidelines, deadlines, and requirements regarding tuition refunds and formal course withdrawals.',
    alternates: {
        canonical: 'https://cannogacollege.ca/refund-withdrawal-policy/',
    },
};

export default function RefundWithdrawalPolicyPage() {
    return (
        <div className="bg-white min-h-screen font-sans text-black">
            {/* HERO SECTION */}
            <section className="bg-[#0a151a] text-white pt-32 pb-24 md:pt-48 md:pb-32 px-4">
                <div className="container mx-auto max-w-4xl">
                    <Link href="/admissions" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft size={20} /> Back to Admissions
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white">
                        Refund & Withdrawal Policy
                    </h1>
                    <p className="text-xl md:text-2xl text-neutral-300 max-w-2xl leading-relaxed">
                        Clear guidance on financial obligations, procedures for withdrawal, and transparency regarding tuition, fees, and housing.
                    </p>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
                <div className="space-y-16">

                    {/* 1. PURPOSE */}
                    <section id="purpose" className="scroll-mt-32">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-12 border-t border-[#0a151a] pt-8">
                            <div className="md:w-1/4">
                                <span className="text-sm font-bold uppercase tracking-widest text-neutral-500">01</span>
                            </div>
                            <div className="md:w-3/4">
                                <h2 className="text-3xl font-bold mb-6">Purpose</h2>
                                <p className="text-lg leading-relaxed mb-6">
                                    The purpose of this Refund & Withdrawal Policy is to:
                                </p>
                                <ul className="list-disc pl-6 space-y-4 text-lg text-neutral-800 marker:text-black">
                                    <li>Provide clear guidance on financial obligations for tuition, fees, and housing.</li>
                                    <li>Define procedures for voluntary and involuntary withdrawal.</li>
                                    <li>Ensure fairness, transparency, and compliance with institutional regulations.</li>
                                </ul>
                                <p className="text-lg leading-relaxed mt-6">
                                    This policy applies to all students enrolled at Cannoga College, including Bachelor’s, Master’s, full-time, and part-time students.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 2. SCOPE */}
                    <section id="scope" className="scroll-mt-32">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-12 border-t border-[#0a151a] pt-8">
                            <div className="md:w-1/4">
                                <span className="text-sm font-bold uppercase tracking-widest text-neutral-500">02</span>
                            </div>
                            <div className="md:w-3/4">
                                <h2 className="text-3xl font-bold mb-6">Scope</h2>
                                <p className="text-lg leading-relaxed mb-4">This policy covers:</p>
                                <ul className="list-disc pl-6 space-y-2 text-lg text-neutral-800 marker:text-black mb-6">
                                    <li>Tuition fees</li>
                                    <li>Enrollment fees</li>
                                    <li>Housing fees (where applicable)</li>
                                    <li>Other University-administered fees</li>
                                </ul>
                                <p className="text-lg leading-relaxed mb-4">It applies to:</p>
                                <ul className="list-disc pl-6 space-y-2 text-lg text-neutral-800 marker:text-black">
                                    <li>Domestic and international students</li>
                                    <li>Students on leave of absence</li>
                                    <li>Students who withdraw voluntarily or are dismissed</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 3. DECANITIONS */}
                    <section id="definitions" className="scroll-mt-32">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-12 border-t border-[#0a151a] pt-8">
                            <div className="md:w-1/4">
                                <span className="text-sm font-bold uppercase tracking-widest text-neutral-500">03</span>
                            </div>
                            <div className="md:w-3/4">
                                <h2 className="text-3xl font-bold mb-6">Definitions</h2>
                                <div className="border border-neutral-200">
                                    <div className="grid grid-cols-1 md:grid-cols-3 border-b border-neutral-200 bg-neutral-50 p-4 font-bold">
                                        <div>Term</div>
                                        <div className="md:col-span-2">Definition</div>
                                    </div>
                                    {[
                                        { term: "Withdrawal", def: "Formal discontinuation of enrollment by the student" },
                                        { term: "Leave of Absence", def: "Temporary break approved by the University" },
                                        { term: "Tuition Fee", def: "Fee for academic instruction, registration, and course materials" },
                                        { term: "Enrollment Fee", def: "Non-refundable administrative fee of 100 Euros will be deducted" },
                                        { term: "Housing Fee", def: "Fee for University-provided accommodation or services" },
                                    ].map((item, i) => (
                                        <div key={i} className={`grid grid-cols-1 md:grid-cols-3 p-4 ${i !== 4 ? 'border-b border-neutral-200' : ''}`}>
                                            <div className="font-bold md:font-normal mb-1 md:mb-0">{item.term}</div>
                                            <div className="md:col-span-2 text-neutral-700">{item.def}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 4. GENERAL PRINCIPLES */}
                    <section id="general-principles" className="scroll-mt-32">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-12 border-t border-[#0a151a] pt-8">
                            <div className="md:w-1/4">
                                <span className="text-sm font-bold uppercase tracking-widest text-neutral-500">04</span>
                            </div>
                            <div className="md:w-3/4">
                                <h2 className="text-3xl font-bold mb-6">General Principles</h2>
                                <ul className="list-disc pl-6 space-y-4 text-lg text-neutral-800 marker:text-black">
                                    <li>All fees are clearly published on the University website and in official communications.</li>
                                    <li>Enrollment is confirmed only upon full payment of required fees.</li>
                                    <li>Refunds are processed according to this policy and the student’s date of withdrawal.</li>
                                    <li>Refunds do not include penalties or administrative deductions unless stated.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 5. WITHDRAWAL PROCEDURE */}
                    <section id="withdrawal-procedure" className="scroll-mt-32">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-12 border-t border-[#0a151a] pt-8">
                            <div className="md:w-1/4">
                                <span className="text-sm font-bold uppercase tracking-widest text-neutral-500">05</span>
                            </div>
                            <div className="md:w-3/4">
                                <h2 className="text-3xl font-bold mb-8">Withdrawal Procedure</h2>

                                <div className="mb-8">
                                    <h3 className="text-xl font-bold mb-4">5.1 Voluntary Withdrawal</h3>
                                    <ul className="list-disc pl-6 space-y-2 text-lg text-neutral-800 marker:text-black">
                                        <li>Students must submit a written withdrawal request to the Admissions or Registrar’s Office.</li>
                                        <li>The effective date of withdrawal is the date the request is received.</li>
                                        <li>Tuition and fees will be calculated based on the academic calendar and withdrawal date.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold mb-4">5.2 Involuntary Withdrawal</h3>
                                    <p className="text-lg leading-relaxed mb-4">Involuntary withdrawal may result from:</p>
                                    <ul className="list-disc pl-6 space-y-2 text-lg text-neutral-800 marker:text-black mb-4">
                                        <li>Academic dismissal</li>
                                        <li>Violation of University policies</li>
                                        <li>Non-payment of fees</li>
                                    </ul>
                                    <p className="text-neutral-700 italic">Refunds are not guaranteed in cases of disciplinary dismissal or non-compliance.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 6. REFUND POLICY */}
                    <section id="refund-policy" className="scroll-mt-32">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-12 border-t border-[#0a151a] pt-8">
                            <div className="md:w-1/4">
                                <span className="text-sm font-bold uppercase tracking-widest text-neutral-500">06</span>
                            </div>
                            <div className="md:w-3/4">
                                <h2 className="text-3xl font-bold mb-8">Refund Policy</h2>

                                <div className="mb-10">
                                    <h3 className="text-xl font-bold mb-4">6.1 Tuition Fee Refund Schedule</h3>
                                    <div className="border border-neutral-200 mb-4">
                                        <div className="grid grid-cols-2 border-b border-neutral-200 bg-neutral-50 p-4 font-bold">
                                            <div>Withdrawal Date</div>
                                            <div>Refund % of Tuition</div>
                                        </div>
                                        {[
                                            { date: "Before semester starts", refund: "100% (minus enrollment fee)" },
                                            { date: "Within 1st 2 weeks", refund: "75%" },
                                            { date: "Weeks 3–4", refund: "50%" },
                                            { date: "Weeks 5–6", refund: "25%" },
                                            { date: "After 6 weeks", refund: "0%" },
                                        ].map((item, i, arr) => (
                                            <div key={i} className={`grid grid-cols-2 p-4 ${i !== arr.length - 1 ? 'border-b border-neutral-200' : ''}`}>
                                                <div className="font-medium text-neutral-900">{item.date}</div>
                                                <div className="font-bold text-black">{item.refund}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-sm text-neutral-500 font-bold uppercase tracking-wide">Note: Enrollment fees are non-refundable.</p>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-xl font-bold mb-4">6.2 Housing Fee Refunds</h3>
                                    <ul className="list-disc pl-6 space-y-2 text-lg text-neutral-800 marker:text-black">
                                        <li>Housing refunds follow the same schedule as tuition, unless otherwise specified in housing contracts.</li>
                                        <li>Partial refunds may apply for early termination of housing agreements.</li>
                                        <li>Any damage or breach of contract may result in deductions.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold mb-4">6.3 Other Fees</h3>
                                    <ul className="list-disc pl-6 space-y-2 text-lg text-neutral-800 marker:text-black">
                                        <li>Student activity fees, IT fees, or other miscellaneous charges are generally non-refundable.</li>
                                        <li>Exceptions may be made at the discretion of the University administration.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 7. REFUND PROCESS */}
                    <section id="refund-process" className="scroll-mt-32">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-12 border-t border-[#0a151a] pt-8">
                            <div className="md:w-1/4">
                                <span className="text-sm font-bold uppercase tracking-widest text-neutral-500">07</span>
                            </div>
                            <div className="md:w-3/4">
                                <h2 className="text-3xl font-bold mb-6">Refund Process</h2>
                                <ol className="list-decimal pl-6 space-y-4 text-lg text-neutral-800 marker:text-black marker:font-bold">
                                    <li>Registrar calculates refundable amount based on dates and fees paid.</li>
                                    <li>Refund request approved by Finance Office.</li>
                                    <li>Refund processed within 14 days via the original payment method.</li>
                                    <li>Confirmation email issued to the student.</li>
                                </ol>
                            </div>
                        </div>
                    </section>

                    {/* 8. CANCELLATION OF OFFER */}
                    <section id="cancellation" className="scroll-mt-32">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-12 border-t border-[#0a151a] pt-8">
                            <div className="md:w-1/4">
                                <span className="text-sm font-bold uppercase tracking-widest text-neutral-500">08</span>
                            </div>
                            <div className="md:w-3/4">
                                <h2 className="text-3xl font-bold mb-6">Cancellation of Offer</h2>
                                <p className="text-lg leading-relaxed mb-4">
                                    Students who accept an offer but withdraw before enrollment may be eligible for full tuition refund minus enrollment fee.
                                </p>
                                <p className="text-lg leading-relaxed text-neutral-700">
                                    International students should confirm visa and housing implications.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 9. LEAVE OF ABSENCE */}
                    <section id="leave-of-absence" className="scroll-mt-32">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-12 border-t border-[#0a151a] pt-8">
                            <div className="md:w-1/4">
                                <span className="text-sm font-bold uppercase tracking-widest text-neutral-500">09</span>
                            </div>
                            <div className="md:w-3/4">
                                <h2 className="text-3xl font-bold mb-6">Leave of Absence</h2>
                                <ul className="list-disc pl-6 space-y-2 text-lg text-neutral-800 marker:text-black">
                                    <li>Students on approved leave of absence remain enrolled but may defer tuition for that term.</li>
                                    <li>Tuition already paid is generally credited to the following semester.</li>
                                    <li>Housing arrangements may need separate negotiation.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 10. SPECIAL CIRCUMSTANCES */}
                    <section id="special-circumstances" className="scroll-mt-32">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-12 border-t border-[#0a151a] pt-8">
                            <div className="md:w-1/4">
                                <span className="text-sm font-bold uppercase tracking-widest text-neutral-500">10</span>
                            </div>
                            <div className="md:w-3/4">
                                <h2 className="text-3xl font-bold mb-6">Special Circumstances</h2>
                                <p className="text-lg leading-relaxed mb-4">Refunds may be considered for:</p>
                                <ul className="list-disc pl-6 space-y-2 text-lg text-neutral-800 marker:text-black mb-6">
                                    <li>Medical emergencies with documentation</li>
                                    <li>National or international crises affecting attendance</li>
                                    <li>Exceptional personal circumstances</li>
                                </ul>
                                <p className="text-neutral-700 italic">All special cases are reviewed individually by the Registrar and Finance Office.</p>
                            </div>
                        </div>
                    </section>

                    {/* 11. COMMUNICATION & DISPUTES */}
                    <section id="communication" className="scroll-mt-32">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-12 border-t border-[#0a151a] pt-8">
                            <div className="md:w-1/4">
                                <span className="text-sm font-bold uppercase tracking-widest text-neutral-500">11</span>
                            </div>
                            <div className="md:w-3/4">
                                <h2 className="text-3xl font-bold mb-6">Communication & Disputes</h2>
                                <ul className="list-disc pl-6 space-y-2 text-lg text-neutral-800 marker:text-black">
                                    <li>All withdrawal and refund decisions are communicated via official student email.</li>
                                    <li>Disputes must be submitted in writing within 14 days of the decision.</li>
                                    <li>Final decisions rest with the University administration.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 12. POLICY REVIEW */}
                    <section id="policy-review" className="scroll-mt-32 border-b border-[#0a151a] pb-16">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-12 border-t border-[#0a151a] pt-8">
                            <div className="md:w-1/4">
                                <span className="text-sm font-bold uppercase tracking-widest text-neutral-500">12</span>
                            </div>
                            <div className="md:w-3/4">
                                <h2 className="text-3xl font-bold mb-6">Policy Review</h2>
                                <ul className="list-disc pl-6 space-y-2 text-lg text-neutral-800 marker:text-black">
                                    <li>This policy is reviewed annually.</li>
                                    <li>Updates are published on the University website.</li>
                                    <li>The University reserves the right to amend the policy at any time.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}

