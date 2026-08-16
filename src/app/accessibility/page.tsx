import type { Metadata } from 'next';
import { Link } from "@aalto-dx/react-components";

export const metadata: Metadata = {
    title: 'Digital Accessibility Commitment & Policy',
    description: 'Read our dedication to providing accessible digital experiences, learning tools, and web platforms for all members of our community.',
    alternates: {
        canonical: 'https://cannogacollege.ca/accessibility/',
    },
};

export default function AccessibilityPage() {
    return (
        <div className="bg-white min-h-screen font-sans text-black">
            {/* HERO SECTION */}
            <section className="bg-[#0a151a] text-white pt-28 pb-20 md:pt-40 md:pb-28 px-4 border-b border-slate-800">
                <div className="container mx-auto max-w-5xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-400 mb-6">
                        <Link href="/" className="text-sky-400 hover:text-white transition-colors no-underline">HOME</Link>
                        <span className="text-slate-600">/</span>
                        <span>INSTITUTIONAL POLICIES</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white leading-tight">
                        Accessibility Statement
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl leading-relaxed">
                        Cannoga College is committed to ensuring digital accessibility for all students, staff, and public visitors, regardless of ability or technology used.
                    </p>
                </div>
            </section>

            {/* MAIN CONTENT WITH SIDEBAR NAVIGATION */}
            <div className="container mx-auto max-w-6xl px-4 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* STICKY SECTION NAV */}
                <div className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-28 space-y-4 p-6 bg-slate-50 border border-slate-200 rounded-none text-xs font-bold uppercase tracking-wider text-slate-700">
                        <p className="text-slate-400 text-[10px] pb-2 border-b border-slate-200">Accessibility Table of Contents</p>
                        <nav className="flex flex-col space-y-2">
                            <a href="#commitment" className="hover:text-black transition-colors">1. Commitment</a>
                            <a href="#scope" className="hover:text-black transition-colors">2. Scope of Statement</a>
                            <a href="#standards" className="hover:text-black transition-colors">3. Standards &amp; Laws</a>
                            <a href="#status" className="hover:text-black transition-colors">4. Compliance Status</a>
                            <a href="#features" className="hover:text-black transition-colors">5. Accessible Features</a>
                            <a href="#non-accessible" className="hover:text-black transition-colors">6. Non-Accessible Content</a>
                            <a href="#alternative" className="hover:text-black transition-colors">7. Alternative Access</a>
                            <a href="#feedback" className="hover:text-black transition-colors">8. Feedback &amp; Contact</a>
                            <a href="#enforcement" className="hover:text-black transition-colors">9. Enforcement</a>
                            <a href="#improvement" className="hover:text-black transition-colors">10. Continuous Review</a>
                            <a href="#preparation" className="hover:text-black transition-colors">11. Preparation</a>
                            <a href="#effective-date" className="hover:text-black transition-colors">12. Statement Date</a>
                        </nav>
                    </div>
                </div>

                {/* POLICY CONTENT BODY */}
                <div className="lg:col-span-3 space-y-14">

                    {/* 1. COMMITMENT TO ACCESSIBILITY */}
                    <section id="commitment" className="scroll-mt-28 border-t-2 border-[#0a151a] pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">01</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Commitment to Accessibility</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Cannoga College is dedicated to ensuring digital accessibility for all users, including students, applicants, faculty, staff, and community members. We strive to provide an inclusive online environment that enables equal access to educational resources and institutional content.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            This Accessibility Statement details how Cannoga College complies with accessibility legislation and how users can request accommodations or report barriers.
                        </p>
                    </section>

                    {/* 2. SCOPE OF THIS STATEMENT */}
                    <section id="scope" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">02</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Scope of This Statement</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed">
                            This statement applies to all official Cannoga College web platforms, application portals, learning management systems (LMS), and digital publications published under the cannogacollege.ca domain.
                        </p>
                    </section>

                    {/* 3. ACCESSIBILITY STANDARDS & LEGISLATION */}
                    <section id="standards" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">03</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Accessibility Standards &amp; Legislation</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Cannoga College aligns its digital platforms with the following standards and frameworks:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-base text-slate-800 marker:text-black">
                            <li>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.</li>
                            <li>Accessibility for Ontarians with Disabilities Act (AODA) standards.</li>
                            <li>Canadian Accessible Digital Services regulations.</li>
                        </ul>
                    </section>

                    {/* 4. COMPLIANCE STATUS */}
                    <section id="status" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">04</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Compliance Status</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Cannoga College web portals are substantially compliant with WCAG 2.1 Level AA standards. Active testing and technical auditing are conducted continually to identify and resolve accessibility gaps.
                        </p>
                    </section>

                    {/* 5. ACCESSIBLE FEATURES */}
                    <section id="features" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">05</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Accessible Content &amp; Features</h2>
                        </div>
                        <ul className="list-disc pl-6 space-y-2 text-[#0a151a] marker:text-black">
                            <li>High contrast color ratios designed for enhanced readability.</li>
                            <li>Full keyboard navigation support across interactive components.</li>
                            <li>Structured HTML heading hierarchies (H1–H4) for screen reader compatibility.</li>
                            <li>Alternative text (`alt` attributes) for non-decorative imagery.</li>
                            <li>Scalable typography without loss of layout structure.</li>
                        </ul>
                    </section>

                    {/* 6. NON-ACCESSIBLE CONTENT */}
                    <section id="non-accessible" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">06</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Non-Accessible Content</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Certain legacy PDF publications or third-party embedded services may not fully satisfy WCAG 2.1 AA requirements. Cannoga College prioritizes remedying these items upon notification.
                        </p>
                    </section>

                    {/* 7. ALTERNATIVE ACCESS */}
                    <section id="alternative" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">07</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Alternative Formats</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Upon request, Cannoga College will provide digital documentation in alternative accessible formats (e.g. large print, structured text files) within reasonable turnaround windows.
                        </p>
                    </section>

                    {/* 8. FEEDBACK & CONTACT */}
                    <section id="feedback" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">08</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Feedback &amp; Assistance</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed">
                            If you encounter accessibility barriers on our digital platforms, please contact the Accessibility Services Desk via the official contact page.
                        </p>
                    </section>

                    {/* 9. ENFORCEMENT */}
                    <section id="enforcement" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">09</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Enforcement Procedure</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Users unsatisfied with an accessibility grievance response may escalate inquiries to the relevant provincial accessibility authority in Ontario, Canada.
                        </p>
                    </section>

                    {/* 10. CONTINUOUS REVIEW */}
                    <section id="improvement" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">10</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Continuous Review</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Accessibility protocols are reviewed during each major software release to maintain compliance with evolving standards.
                        </p>
                    </section>

                    {/* 11. PREPARATION */}
                    <section id="preparation" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">11</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Statement Preparation</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed">
                            This statement was prepared following internal technical audits of core portal components.
                        </p>
                    </section>

                    {/* 12. STATEMENT DATE */}
                    <section id="effective-date" className="scroll-mt-28 border-t border-slate-200 pt-8 border-b pb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">12</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Statement Date</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-6">
                            This Accessibility Statement is effective for the 2026–2027 Academic Year.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200">
                            <Link href="/terms" className="bg-[#0a151a] text-white px-6 py-3 font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors no-underline">
                                Terms of Use →
                            </Link>
                            <Link href="/cookies" className="border border-[#0a151a] text-[#0a151a] px-6 py-3 font-bold text-xs uppercase tracking-wider hover:bg-[#0a151a] hover:text-white transition-colors no-underline">
                                Cookie Policy →
                            </Link>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
