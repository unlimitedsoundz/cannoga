import { Link } from "@aalto-dx/react-components";

export default function CookiesContent() {
    return (
        <div className="bg-white min-h-screen font-sans text-black">
            {/* HERO SECTION */}
            <section className="bg-[#0a151a] text-white pt-28 pb-20 md:pt-40 md:pb-28 px-4 border-b border-slate-800">
                <div className="container mx-auto max-w-5xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-400 mb-6">
                        <Link href="/" className="text-sky-400 hover:text-white transition-colors no-underline">HOME</Link>
                        <span className="text-slate-600">/</span>
                        <span>LEGAL DOCUMENTATION</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white leading-tight">
                        Cookie Usage Policy
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl leading-relaxed">
                        Detailed explanation of how Cannoga College uses cookies and browser storage technologies to maintain platform security, preserve user preferences, and analyze site performance.
                    </p>
                </div>
            </section>

            {/* MAIN CONTENT WITH SIDEBAR NAVIGATION */}
            <div className="container mx-auto max-w-6xl px-4 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* STICKY SECTION NAV */}
                <div className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-28 space-y-4 p-6 bg-slate-50 border border-slate-200 rounded-none text-xs font-bold uppercase tracking-wider text-slate-700">
                        <p className="text-slate-400 text-[10px] pb-2 border-b border-slate-200">Cookie Table of Contents</p>
                        <nav className="flex flex-col space-y-2">
                            <a href="#introduction" className="hover:text-black transition-colors">1. Introduction</a>
                            <a href="#what-are-cookies" className="hover:text-black transition-colors">2. What Are Cookies</a>
                            <a href="#types-of-cookies" className="hover:text-black transition-colors">3. Cookie Categories</a>
                            <a href="#legal-basis" className="hover:text-black transition-colors">4. Legal Basis</a>
                            <a href="#managing-cookies" className="hover:text-black transition-colors">5. Preference Management</a>
                            <a href="#changes" className="hover:text-black transition-colors">6. Policy Updates</a>
                            <a href="#contact" className="hover:text-black transition-colors">7. Contact Information</a>
                        </nav>
                    </div>
                </div>

                {/* POLICY CONTENT BODY */}
                <div className="lg:col-span-3 space-y-14">

                    {/* 1. INTRODUCTION */}
                    <section id="introduction" className="scroll-mt-28 border-t-2 border-[#0a151a] pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">01</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Introduction</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Cannoga College uses cookies and similar digital technologies on its official portal and student systems to ensure proper functionality, enhance user experience, and support institutional operations.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            This policy should be read alongside the <Link href="/terms" className="text-[#0a151a] font-bold underline hover:text-sky-700 transition-colors">Terms of Use</Link> and <Link href="/accessibility" className="text-[#0a151a] font-bold underline hover:text-sky-700 transition-colors">Accessibility Statement</Link>.
                        </p>
                    </section>

                    {/* 2. WHAT ARE COOKIES */}
                    <section id="what-are-cookies" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">02</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">What Are Cookies</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Cookies are small text files stored securely on your browser or device when visiting a website. They help websites remember preferences, facilitate secure authentication, and evaluate system efficiency.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Cookies deployed by Cannoga College do not compromise device security or extract personal files.
                        </p>
                    </section>

                    {/* 3. TYPES OF COOKIES USED */}
                    <section id="types-of-cookies" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">03</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Types of Cookies Used</h2>
                        </div>
                        <div className="space-y-6 text-base text-slate-700">
                            <div className="border-l-2 border-[#0a151a] pl-4">
                                <h3 className="text-lg font-bold text-slate-900 mb-1">3.1 Strictly Necessary Cookies</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    Essential for basic portal operation, user authentication, security validation, and load balancing across web servers. Strictly necessary cookies cannot be disabled.
                                </p>
                            </div>

                            <div className="border-l-2 border-slate-300 pl-4">
                                <h3 className="text-lg font-bold text-slate-900 mb-1">3.2 Functional &amp; Preference Cookies</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    Store user preferences such as preferred language, accessibility toggles, and active portal sessions to deliver a customized user experience.
                                </p>
                            </div>

                            <div className="border-l-2 border-slate-300 pl-4">
                                <h3 className="text-lg font-bold text-slate-900 mb-1">3.3 Analytics &amp; Performance Cookies</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    Gather aggregated, anonymized metrics on page traffic, load times, and user interaction pathways to optimize platform performance.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 4. LEGAL BASIS */}
                    <section id="legal-basis" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">04</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Legal Basis for Cookie Usage</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            The deployment of essential cookies is based on technical necessity and institutional legitimate interest in maintaining secure digital infrastructure.
                        </p>
                    </section>

                    {/* 5. MANAGING COOKIES */}
                    <section id="managing-cookies" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">05</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Preference Management</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Users can configure or block cookies at any time through their web browser preferences. Please note that disabling essential cookies may impact portal functionality.
                        </p>
                    </section>

                    {/* 6. POLICY UPDATES */}
                    <section id="changes" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">06</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Policy Updates</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Cannoga College periodically updates this Cookie Policy to reflect technical enhancements or regulatory adjustments. Revisions are published directly on this page.
                        </p>
                    </section>

                    {/* 7. CONTACT INFORMATION */}
                    <section id="contact" className="scroll-mt-28 border-t border-slate-200 pt-8 border-b pb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">07</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Contact Information</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-6">
                            Questions regarding cookie practices may be submitted to the Cannoga College Information Officer via the official portal contact channels.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200">
                            <Link href="/terms" className="bg-[#0a151a] text-white px-6 py-3 font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors no-underline">
                                Terms of Use â†’
                            </Link>
                            <Link href="/accessibility" className="border border-[#0a151a] text-[#0a151a] px-6 py-3 font-bold text-xs uppercase tracking-wider hover:bg-[#0a151a] hover:text-white transition-colors no-underline">
                                Accessibility Statement â†’
                            </Link>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
