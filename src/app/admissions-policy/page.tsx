import type { Metadata } from 'next';
import { Link } from "@aalto-dx/react-components";

export const metadata: Metadata = {
    title: 'Institutional Admissions Policy',
    description: 'Read the official policy governing selection standards, fairness, equality, and admission decisions at Cannoga College.',
    alternates: {
        canonical: 'https://cannogacollege.ca/admissions-policy/',
    },
};

export default function AdmissionsPolicyPage() {
    return (
        <div className="bg-white min-h-screen font-sans text-black">
            {/* HERO SECTION */}
            <section className="bg-[#0a151a] text-white pt-28 pb-20 md:pt-40 md:pb-28 px-4 border-b border-slate-800">
                <div className="container mx-auto max-w-5xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-400 mb-6">
                        <Link href="/admissions" className="text-sky-400 hover:text-white transition-colors no-underline">ADMISSIONS</Link>
                        <span className="text-slate-600">/</span>
                        <span>INSTITUTIONAL POLICIES</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white leading-tight">
                        Admissions Policy
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl leading-relaxed">
                        Defining the principles, evaluation criteria, equality standards, and procedures governing admission to all academic programs at Cannoga College in Ottawa, Ontario.
                    </p>
                </div>
            </section>

            {/* MAIN CONTENT WITH SIDEBAR NAVIGATION */}
            <div className="container mx-auto max-w-6xl px-4 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* STICKY SECTION NAV */}
                <div className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-28 space-y-4 p-6 bg-slate-50 border border-slate-200 rounded-none text-xs font-bold uppercase tracking-wider text-slate-700">
                        <p className="text-slate-400 text-[10px] pb-2 border-b border-slate-200">Policy Table of Contents</p>
                        <nav className="flex flex-col space-y-2.5">
                            <a href="#purpose" className="hover:text-black transition-colors">1. Purpose</a>
                            <a href="#scope" className="hover:text-black transition-colors">2. Policy Scope</a>
                            <a href="#general-principles" className="hover:text-black transition-colors">3. General Principles</a>
                            <a href="#admission-requirements" className="hover:text-black transition-colors">4. Requirements</a>
                            <a href="#application-process" className="hover:text-black transition-colors">5. Application Process</a>
                            <a href="#admission-decisions" className="hover:text-black transition-colors">6. Decisions</a>
                            <a href="#offer-acceptance" className="hover:text-black transition-colors">7. Acceptance</a>
                            <a href="#verification" className="hover:text-black transition-colors">8. Verification</a>
                            <a href="#appeals" className="hover:text-black transition-colors">9. Appeals</a>
                            <a href="#policy-review" className="hover:text-black transition-colors">10. Policy Review</a>
                        </nav>
                    </div>
                </div>

                {/* POLICY CONTENT BODY */}
                <div className="lg:col-span-3 space-y-14">

                    {/* 1. PURPOSE */}
                    <section id="purpose" className="scroll-mt-28 border-t-2 border-[#0a151a] pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">01</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Purpose</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            The Admissions Policy of Cannoga College defines the principles, criteria, and procedures governing admission to Bachelor&apos;s, Master&apos;s, Diploma, and Certificate programmes.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            This policy ensures absolute fairness, transparency, and equal opportunity for all domestic and international applicants seeking admission to Cannoga College.
                        </p>
                    </section>

                    {/* 2. SCOPE */}
                    <section id="scope" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">02</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Policy Scope</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">This policy applies to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-base text-slate-800 marker:text-black">
                            <li>All undergraduate (Bachelor&apos;s) degree programmes</li>
                            <li>All postgraduate (Master&apos;s) degree programmes</li>
                            <li>All diploma and certificate academic streams</li>
                            <li>Both domestic and international student applicants</li>
                            <li>Full-time and part-time study modes (where applicable)</li>
                        </ul>
                    </section>

                    {/* 3. GENERAL ADMISSION PRINCIPLES */}
                    <section id="general-principles" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">03</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">General Admission Principles</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">Cannoga College operates under the following core admissions principles:</p>
                        <ul className="list-disc pl-6 space-y-2 text-base text-slate-800 marker:text-black">
                            <li>Admits students based on academic merit, suitability, and potential for success.</li>
                            <li>Applies consistent, objective, and transparent evaluation criteria for all portfolios.</li>
                            <li>Does not discriminate on the basis of nationality, gender, religion, ethnicity, age, or background.</li>
                            <li>Reserves the right to verify all submitted academic records and supporting credentials.</li>
                        </ul>
                    </section>

                    {/* 4. ADMISSION REQUIREMENTS */}
                    <section id="admission-requirements" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">04</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Admission Requirements</h2>
                        </div>
                        <div className="space-y-6 text-base text-slate-700">
                            <div className="border-l-2 border-[#0a151a] pl-4">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">4.1 Bachelor&apos;s Programmes</h3>
                                <p className="mb-2 font-semibold text-slate-900">Applicants must:</p>
                                <ul className="list-disc pl-5 space-y-1 text-slate-800">
                                    <li>Hold a recognized secondary school diploma or equivalent secondary qualification.</li>
                                    <li>Meet minimum academic grade requirements specified for the chosen program.</li>
                                    <li>Demonstrate sufficient proficiency in English (or French where applicable).</li>
                                    <li>Submit all required documents by the official application deadline.</li>
                                </ul>
                            </div>

                            <div className="border-l-2 border-slate-300 pl-4">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">4.2 Master&apos;s Programmes</h3>
                                <p className="mb-2 font-semibold text-slate-900">Applicants must:</p>
                                <ul className="list-disc pl-5 space-y-1 text-slate-800">
                                    <li>Hold a recognized Bachelor&apos;s degree or equivalent in a relevant field.</li>
                                    <li>Meet program-specific academic and professional background requirements.</li>
                                    <li>Provide official transcripts, degree certificates, and recommendation letters.</li>
                                    <li>Demonstrate required language proficiency for advanced graduate study.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 5. APPLICATION PROCESS */}
                    <section id="application-process" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">05</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Application Process</h2>
                        </div>
                        <ul className="list-disc pl-6 space-y-2.5 text-base text-slate-800 marker:text-black">
                            <li>Applications must be submitted online through the official <Link href="/portal/apply" className="text-[#0a151a] font-bold underline hover:text-sky-700 transition-colors">Cannoga College Application Portal</Link>.</li>
                            <li>Submitting an application through the online portal is free of charge.</li>
                            <li>Applicants must provide complete, truthful, and accurate personal and academic information.</li>
                            <li>Incomplete applications or missing transcripts will delay processing and may not be reviewed.</li>
                        </ul>
                    </section>

                    {/* 6. ADMISSION DECISIONS */}
                    <section id="admission-decisions" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">06</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Admission Decisions</h2>
                        </div>
                        <div className="border border-slate-200 rounded-none overflow-hidden text-sm mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 bg-slate-100 p-4 font-bold text-slate-900 border-b border-slate-200">
                                <div>Decision Outcome</div>
                                <div className="md:col-span-2 font-bold">Institutional Meaning</div>
                            </div>
                            {[
                                { term: "Unconditional Offer", def: "Applicant has met all academic and administrative entry requirements and is granted full admission." },
                                { term: "Conditional Offer", def: "Applicant is accepted pending fulfillment of specific conditions (e.g. final transcript, language exam)." },
                                { term: "Rejection", def: "Applicant does not meet current entry criteria or program capacity limits." },
                            ].map((item, i, arr) => (
                                <div key={i} className={`grid grid-cols-1 md:grid-cols-3 p-4 ${i !== arr.length - 1 ? 'border-b border-slate-200' : ''} hover:bg-slate-50 transition-colors`}>
                                    <div className="font-bold text-slate-900 mb-1 md:mb-0">{item.term}</div>
                                    <div className="md:col-span-2 text-slate-700">{item.def}</div>
                                </div>
                            ))}
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Cannoga College reserves the right to request supplementary documentation, conduct personal interviews/assessments, or limit admissions based on program enrollment caps.
                        </p>
                    </section>

                    {/* 7. OFFER ACCEPTANCE */}
                    <section id="offer-acceptance" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">07</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Offer Acceptance</h2>
                        </div>
                        <ul className="list-disc pl-6 space-y-2 text-base text-slate-800 marker:text-black">
                            <li>Offers must be officially accepted within the deadline specified in the Letter of Acceptance (LOA).</li>
                            <li>Acceptance requires payment of the required tuition deposit or confirmation fee. Review <Link href="/refund-withdrawal-policy" className="text-[#0a151a] font-bold underline hover:text-sky-700 transition-colors">Tuition Refund & Withdrawal Policy</Link>.</li>
                            <li>Failure to accept within the specified deadline may result in forfeiture of the offer.</li>
                        </ul>
                    </section>

                    {/* 8. VERIFICATION & MISREPRESENTATION */}
                    <section id="verification" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">08</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Verification &amp; Misrepresentation</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            All academic documents, test scores, and credentials are subject to rigorous verification with issuing authorities.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Submission of false, altered, or misleading information will result in immediate rejection of the application, revocation of any issued offer, or termination of active enrollment.
                        </p>
                    </section>

                    {/* 9. APPEALS */}
                    <section id="appeals" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">09</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Appeals Procedure</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Applicants may submit a written appeal regarding admission decisions within 14 calendar days of receiving a refusal notice.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Appeals are independently reviewed by the Admissions Appeals Committee. Decisions rendered by the committee are final.
                        </p>
                    </section>

                    {/* 10. POLICY REVIEW */}
                    <section id="policy-review" className="scroll-mt-28 border-t border-slate-200 pt-8 border-b pb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">10</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Policy Review & Updates</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-6">
                            This policy is reviewed annually by the Academic Senate to ensure compliance with provincial higher education standards and IRCC regulations.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200">
                            <Link href="/refund-withdrawal-policy" className="bg-[#0a151a] text-white px-6 py-3 font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors no-underline">
                                Refund & Withdrawal Policy →
                            </Link>
                            <Link href="/admissions" className="border border-[#0a151a] text-[#0a151a] px-6 py-3 font-bold text-xs uppercase tracking-wider hover:bg-[#0a151a] hover:text-white transition-colors no-underline">
                                Admissions Overview →
                            </Link>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
