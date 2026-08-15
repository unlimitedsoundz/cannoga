import { Link } from "@aalto-dx/react-components";

export default function TermsContent() {
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
                        Terms of Use &amp; Conditions
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl leading-relaxed">
                        Standard legal terms, conditions, and rules governing access to and usage of all public Cannoga College websites, digital platforms, and online services.
                    </p>
                </div>
            </section>

            {/* MAIN CONTENT WITH SIDEBAR NAVIGATION */}
            <div className="container mx-auto max-w-6xl px-4 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* STICKY SECTION NAV */}
                <div className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-28 space-y-4 p-6 bg-slate-50 border border-slate-200 rounded-none text-xs font-bold uppercase tracking-wider text-slate-700">
                        <p className="text-slate-400 text-[10px] pb-2 border-b border-slate-200">Terms Table of Contents</p>
                        <nav className="flex flex-col space-y-2">
                            <a href="#acceptance" className="hover:text-black transition-colors">1. Acceptance of Terms</a>
                            <a href="#scope" className="hover:text-black transition-colors">2. Scope of Application</a>
                            <a href="#use-of-services" className="hover:text-black transition-colors">3. Use of Digital Services</a>
                            <a href="#intellectual-property" className="hover:text-black transition-colors">4. Intellectual Property</a>
                            <a href="#user-generated-content" className="hover:text-black transition-colors">5. User Content</a>
                            <a href="#availability" className="hover:text-black transition-colors">6. Service Availability</a>
                            <a href="#limitation-of-liability" className="hover:text-black transition-colors">7. Limitation of Liability</a>
                            <a href="#data-protection" className="hover:text-black transition-colors">8. Data Protection</a>
                            <a href="#external-links" className="hover:text-black transition-colors">9. External Links</a>
                            <a href="#changes" className="hover:text-black transition-colors">10. Terms Amendments</a>
                            <a href="#governing-law" className="hover:text-black transition-colors">11. Governing Law</a>
                            <a href="#contact" className="hover:text-black transition-colors">12. Contact Information</a>
                        </nav>
                    </div>
                </div>

                {/* POLICY CONTENT BODY */}
                <div className="lg:col-span-3 space-y-14">

                    {/* 1. ACCEPTANCE OF TERMS */}
                    <section id="acceptance" className="scroll-mt-28 border-t-2 border-[#0a151a] pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">01</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Acceptance of Terms</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            By accessing or using Cannoga College websites, digital platforms, and online services, users agree to comply with these Terms of Use and Conditions. If a user does not agree with these terms, they must refrain from using the services.
                        </p>
                    </section>

                    {/* 2. SCOPE OF APPLICATION */}
                    <section id="scope" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">02</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Scope of Application</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            These Terms apply to all users of Cannoga College digital services, including prospective students, enrolled students, staff, research partners, and web visitors.
                        </p>
                    </section>

                    {/* 3. USE OF DIGITAL SERVICES */}
                    <section id="use-of-services" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">03</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Use of Digital Services</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Users agree to use Cannoga College services lawfully, respectfully, and in a manner that does not disrupt or harm institutional systems, digital content, or other users.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Prohibited activities include unauthorized access, misuse of institutional data, system interference, and any activity that violates applicable laws or institutional regulations.
                        </p>
                    </section>

                    {/* 4. INTELLECTUAL PROPERTY */}
                    <section id="intellectual-property" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">04</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Intellectual Property</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            All content on Cannoga College websites, including text, images, graphics, logos, documents, and digital course materials, is the intellectual property of Cannoga College or its licensors unless otherwise stated.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Content may not be copied, reproduced, modified, distributed, or used for commercial purposes without prior explicit written permission.
                        </p>
                    </section>

                    {/* 5. USER GENERATED CONTENT */}
                    <section id="user-generated-content" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">05</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">User Generated Content</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Where users are permitted to submit content such as applications, feedback, or portal messages, they are responsible for ensuring the accuracy, legality, and appropriateness of such submissions.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Cannoga College reserves the right to remove or restrict any content that violates these Terms or applicable laws.
                        </p>
                    </section>

                    {/* 6. AVAILABILITY OF SERVICES */}
                    <section id="availability" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">06</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Availability of Services</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Cannoga College aims to maintain continuous availability of its digital platforms but does not guarantee uninterrupted access. Services may be temporarily suspended due to technical maintenance or unforeseen service disruptions.
                        </p>
                    </section>

                    {/* 7. LIMITATION OF LIABILITY */}
                    <section id="limitation-of-liability" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">07</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Limitation of Liability</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Cannoga College is not liable for direct or indirect damages arising from the use or inability to use its digital services, except where liability cannot be excluded under applicable Canadian law.
                        </p>
                    </section>

                    {/* 8. DATA PROTECTION */}
                    <section id="data-protection" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">08</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Data Protection</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed">
                            The processing of personal data is governed by the Cannoga College Privacy Policy and applicable data protection legislation in Ontario, Canada.
                        </p>
                    </section>

                    {/* 9. EXTERNAL LINKS */}
                    <section id="external-links" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">09</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">External Links</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Cannoga College websites may contain links to external third-party sites. Cannoga College is not responsible for the content or privacy practices of external resources.
                        </p>
                    </section>

                    {/* 10. CHANGES TO THE TERMS */}
                    <section id="changes" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">10</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Changes to the Terms</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Cannoga College reserves the right to update these Terms of Use at any time. Revised terms take effect immediately upon official publication on the web portal.
                        </p>
                    </section>

                    {/* 11. GOVERNING LAW */}
                    <section id="governing-law" className="scroll-mt-28 border-t border-slate-200 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">11</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Governing Law &amp; Jurisdiction</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed">
                            These Terms are governed by the laws of Ontario and the federal laws of Canada. Any legal proceedings shall be subject to the exclusive jurisdiction of Canadian courts.
                        </p>
                    </section>

                    {/* 12. CONTACT INFORMATION */}
                    <section id="contact" className="scroll-mt-28 border-t border-slate-200 pt-8 border-b pb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">12</span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Contact Information</h2>
                        </div>
                        <p className="text-base text-slate-700 leading-relaxed mb-6">
                            Questions regarding these Terms of Use may be directed to the Office of General Counsel through official College communication channels.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200">
                            <Link href="/cookies" className="bg-[#0a151a] text-white px-6 py-3 font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors no-underline">
                                Cookie Policy →
                            </Link>
                            <Link href="/accessibility" className="border border-[#0a151a] text-[#0a151a] px-6 py-3 font-bold text-xs uppercase tracking-wider hover:bg-[#0a151a] hover:text-white transition-colors no-underline">
                                Accessibility Statement →
                            </Link>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
