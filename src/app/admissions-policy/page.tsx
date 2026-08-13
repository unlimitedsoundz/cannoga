import type { Metadata } from 'next';
import { Link } from "@aalto-dx/react-components";

export const metadata: Metadata = {
    title: 'Institutional Admissions Policy — Cannoga College',
    description: 'Read the policy governing selection standards, fairness, equality, and admission decisions at Cannoga College.',
    alternates: {
        canonical: 'https://cannogacollege.ca/admissions-policy/',
    },
};

export default function AdmissionsPolicyPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-[#0a151a] text-white pt-40 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#f3e600] mb-4">Official Policy</p>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Admissions Policy</h1>
                    <p className="text-neutral-400 text-lg max-w-2xl">
                        Defining the principles, criteria, and procedures governing admission to all programmes at Cannoga College.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="space-y-16">

                        {/* 1. Purpose */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">1</span>
                                <h2 className="text-2xl font-bold">Purpose</h2>
                            </div>
                            <p className="text-black leading-relaxed pl-14">
                                The Admissions Policy of Cannoga College defines the principles, criteria, and procedures governing admission to Bachelor&apos;s and Master&apos;s programmes. The policy ensures fairness, transparency, and equal opportunity for all applicants.
                            </p>
                        </div>

                        {/* 2. Scope */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">2</span>
                                <h2 className="text-2xl font-bold">Scope</h2>
                            </div>
                            <div className="pl-14">
                                <p className="text-black mb-4">This policy applies to:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        All undergraduate (Bachelor&apos;s) programmes
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        All postgraduate (Master&apos;s) programmes
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        All diploma and certificate programmes
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Domestic and international applicants
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Full-time and part-time study modes (where applicable)
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 3. General Admission Principles */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">3</span>
                                <h2 className="text-2xl font-bold">General Admission Principles</h2>
                            </div>
                            <div className="pl-14">
                                <p className="text-black mb-4">Cannoga College:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Admits students based on academic merit and programme suitability
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Applies consistent and transparent evaluation criteria
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Does not discriminate on the basis of nationality, gender, religion, ethnicity, or background
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Reserves the right to verify all submitted documents
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 4. Admission Requirements */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">4</span>
                                <h2 className="text-2xl font-bold">Admission Requirements</h2>
                            </div>
                            <div className="pl-14 space-y-8">
                                <div>
                                    <h3 className="font-bold text-lg mb-3">4.1 Bachelor&apos;s Programmes</h3>
                                    <p className="text-black mb-3">Applicants must:</p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Hold a recognized secondary school qualification or equivalent
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Meet minimum academic requirements specified for the programme
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Demonstrate sufficient proficiency in the language of instruction (where required)
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Submit all required documents by the stated deadline
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-3">4.2 Master&apos;s Programmes</h3>
                                    <p className="text-black mb-3">Applicants must:</p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Hold a recognized Bachelor&apos;s degree or equivalent in a relevant field
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Meet programme-specific academic and professional requirements
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Provide transcripts and degree certificates
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Demonstrate language proficiency where applicable
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 5. Application Process */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">5</span>
                                <h2 className="text-2xl font-bold">Application Process</h2>
                            </div>
                            <ul className="pl-14 space-y-2">
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                    Applications are submitted online through the official Cannoga College application portal
                                </li>
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                    The application is free of charge
                                </li>
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                    Applicants must provide accurate and complete information
                                </li>
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                    Incomplete applications may not be reviewed
                                </li>
                            </ul>
                        </div>

                        {/* 6. Admission Decisions */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">6</span>
                                <h2 className="text-2xl font-bold">Admission Decisions</h2>
                            </div>
                            <div className="pl-14 space-y-6">
                                <div>
                                    <p className="text-black mb-3">Admission outcomes may include:</p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Unconditional Offer
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Conditional Offer
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Rejection
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-black mb-3">Cannoga College reserves the right to:</p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Request additional documentation
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Conduct interviews or assessments if required
                                        </li>
                                        <li className="flex items-start gap-3 text-black">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                            Limit admissions based on capacity
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 7. Offer Acceptance */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">7</span>
                                <h2 className="text-2xl font-bold">Offer Acceptance</h2>
                            </div>
                            <ul className="pl-14 space-y-2">
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                    Offers must be accepted within the stated deadline
                                </li>
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                    Acceptance may require payment of tuition or enrollment fees
                                </li>
                                <li className="flex items-start gap-3 text-black">
                                    <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                    Failure to accept within the deadline may result in withdrawal of the offer
                                </li>
                            </ul>
                        </div>

                        {/* 8. Verification & Misrepresentation */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">8</span>
                                <h2 className="text-2xl font-bold">Verification & Misrepresentation</h2>
                            </div>
                            <div className="pl-14 space-y-4">
                                <p className="text-black">All documents are subject to verification.</p>
                                <p className="text-black mb-3">Submission of false or misleading information may result in:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Rejection of application
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Withdrawal of offer
                                    </li>
                                    <li className="flex items-start gap-3 text-black">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0"></span>
                                        Termination of enrollment
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 9. Appeals */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">9</span>
                                <h2 className="text-2xl font-bold">Appeals</h2>
                            </div>
                            <p className="text-black leading-relaxed pl-14">
                                Applicants may submit a written appeal regarding admission decisions within the specified timeframe. Appeals are reviewed by the admissions committee, and decisions are final.
                            </p>
                        </div>

                        {/* 10. Policy Review */}
                        <div>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black text-neutral-100">10</span>
                                <h2 className="text-2xl font-bold">Policy Review</h2>
                            </div>
                            <p className="text-black leading-relaxed pl-14">
                                This policy is reviewed periodically and may be updated. The latest version is published on the Cannoga College website.
                            </p>
                        </div>

                    </div>

                    {/* Related Links */}
                    <div className="mt-20 pt-12 ">
                        <h3 className="font-bold text-lg mb-6">Related Documents</h3>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/academic-regulations" className="bg-[#0a151a] text-white px-6 py-3 font-bold text-sm hover:bg-neutral-800 transition-colors">
                                Academic Regulations →
                            </Link>
                            <Link href="/admissions" className="border border-[#0a151a] px-6 py-3 font-bold text-sm hover:bg-[#0a151a] hover:text-white transition-colors">
                                Admissions Overview →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

