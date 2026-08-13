'use client';

import { useEffect, useState } from "react";

const sections = [
    { id: 'acceptance', title: '1. Acceptance of Terms' },
    { id: 'scope', title: '2. Scope of Application' },
    { id: 'use-of-services', title: '3. Use of Digital Services' },
    { id: 'intellectual-property', title: '4. Intellectual Property' },
    { id: 'user-generated-content', title: '5. User Generated Content' },
    { id: 'availability', title: '6. Availability of Services' },
    { id: 'limitation-of-liability', title: '7. Limitation of Liability' },
    { id: 'data-protection', title: '8. Data Protection' },
    { id: 'external-links', title: '9. External Links' },
    { id: 'changes', title: '10. Changes to the Terms' },
    { id: 'governing-law', title: '11. Governing Law' },
    { id: 'contact', title: '12. Contact Information' },
];

export default function TermsContent() {
    const [activeSection, setActiveSection] = useState('acceptance');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.5, rootMargin: '-80px 0px -40% 0px' }
        );

        sections.forEach((section) => {
            const element = document.getElementById(section.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans">
            {/* HERO SECTION */}
            <section className="relative h-[40vh] flex items-center bg-neutral-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl space-y-4">
                        <div className="text-xs font-bold uppercase tracking-widest text-neutral-500">Legal Documentation</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight pt-8">
                            Terms of Use and Conditions
                        </h1>
                        <p className="text-lg text-neutral-600 leading-relaxed">
                            The terms governing the use of Cannoga College digital platforms and services.
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8 md:py-24">
                <div className="grid lg:grid-cols-12 gap-16">
                    {/* Sidebar navigation */}
                    <aside className="lg:col-span-3 hidden lg:block">
                        <div className="sticky top-24 space-y-2">
                            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-6 pb-2">Contents</h3>
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`block text-left py-2 px-3 text-xs font-bold uppercase tracking-tight transition-all duration-200 border-l-2 ${activeSection === section.id
                                        ? 'text-black border-[#0a151a] bg-neutral-50'
                                        : 'text-neutral-400 border-transparent hover:text-neutral-600 hover:border-neutral-200'
                                        }`}
                                >
                                    {section.title}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Content */}
                    <main className="lg:col-span-9 max-w-3xl">
                        <div className="prose prose-neutral max-w-none space-y-8 md:space-y-24">
                            {/* 1. Acceptance of Terms */}
                            <section id="acceptance" className="scroll-mt-32">
                                <h2 className="text-2xl font-bold mb-8  pb-10 pl-2">1. Acceptance of Terms</h2>
                                <div className="space-y-6 text-neutral-700 leading-relaxed">
                                    <p>
                                        By accessing or using Cannoga College websites digital platforms and services users agree to comply with these Terms of Use and Conditions. If a user does not agree with these terms they should refrain from using the services.
                                    </p>
                                </div>
                            </section>

                            {/* 2. Scope of Application */}
                            <section id="scope" className="scroll-mt-32">
                                <h2 className="text-2xl font-bold mb-8  pb-10 pl-2">2. Scope of Application</h2>
                                <div className="space-y-6 text-neutral-700 leading-relaxed">
                                    <p>
                                        These Terms apply to all users of Cannoga College digital services including prospective students enrolled students staff partners and visitors.
                                    </p>
                                </div>
                            </section>

                            {/* 3. Use of Digital Services */}
                            <section id="use-of-services" className="scroll-mt-32">
                                <h2 className="text-2xl font-bold mb-8  pb-10 pl-2">3. Use of Digital Services</h2>
                                <div className="space-y-6 text-neutral-700 leading-relaxed">
                                    <p>
                                        Users agree to use Cannoga College services lawfully respectfully and in a manner that does not disrupt or harm systems content or other users.
                                    </p>
                                    <p>
                                        Prohibited activities include unauthorised access misuse of data interference with services and any activity that violates applicable laws or institutional policies.
                                    </p>
                                </div>
                            </section>

                            {/* 4. Intellectual Property */}
                            <section id="intellectual-property" className="scroll-mt-32">
                                <h2 className="text-2xl font-bold mb-8  pb-10 pl-2">4. Intellectual Property</h2>
                                <div className="space-y-6 text-neutral-700 leading-relaxed">
                                    <p>
                                        All content on Cannoga College websites including text images graphics logos documents and digital materials is the intellectual property of Cannoga College or its licensors unless otherwise stated.
                                    </p>
                                    <p>
                                        Content may not be copied reproduced modified distributed or used for commercial purposes without prior written permission.
                                    </p>
                                </div>
                            </section>

                            {/* 5. User Generated Content */}
                            <section id="user-generated-content" className="scroll-mt-32">
                                <h2 className="text-2xl font-bold mb-8  pb-10 pl-2">5. User Generated Content</h2>
                                <div className="space-y-6 text-neutral-700 leading-relaxed">
                                    <p>
                                        Where users are permitted to submit content such as applications feedback or messages they are responsible for ensuring the accuracy legality and appropriateness of such content.
                                    </p>
                                    <p>
                                        Cannoga College reserves the right to remove or restrict content that violates these Terms or applicable laws.
                                    </p>
                                </div>
                            </section>

                            {/* 6. Availability of Services */}
                            <section id="availability" className="scroll-mt-32">
                                <h2 className="text-2xl font-bold mb-8  pb-10 pl-2">6. Availability of Services</h2>
                                <div className="space-y-6 text-neutral-700 leading-relaxed">
                                    <p>
                                        Cannoga College aims to ensure continuous availability of its digital services but does not guarantee uninterrupted access. Services may be temporarily unavailable due to maintenance technical issues or external factors.
                                    </p>
                                </div>
                            </section>

                            {/* 7. Limitation of Liability */}
                            <section id="limitation-of-liability" className="scroll-mt-32">
                                <h2 className="text-2xl font-bold mb-8  pb-10 pl-2">7. Limitation of Liability</h2>
                                <div className="space-y-6 text-neutral-700 leading-relaxed">
                                    <p>
                                        Cannoga College is not liable for direct or indirect damages arising from the use or inability to use its digital services except where liability cannot be excluded under applicable law.
                                    </p>
                                </div>
                            </section>

                            {/* 8. Data Protection */}
                            <section id="data-protection" className="scroll-mt-32">
                                <h2 className="text-2xl font-bold mb-8  pb-10 pl-2">8. Data Protection</h2>
                                <div className="space-y-6 text-neutral-700 leading-relaxed">
                                    <p>
                                        The processing of personal data is governed by the Cannoga College Privacy Policy. Users are encouraged to review the Privacy Policy to understand how personal data is handled.
                                    </p>
                                </div>
                            </section>

                            {/* 9. External Links */}
                            <section id="external-links" className="scroll-mt-32">
                                <h2 className="text-2xl font-bold mb-8  pb-10 pl-2">9. External Links</h2>
                                <div className="space-y-6 text-neutral-700 leading-relaxed">
                                    <p>
                                        Cannoga College websites may contain links to external websites. Cannoga College is not responsible for the content or data protection practices of external sites.
                                    </p>
                                </div>
                            </section>

                            {/* 10. Changes to the Terms */}
                            <section id="changes" className="scroll-mt-32">
                                <h2 className="text-2xl font-bold mb-8  pb-10 pl-2">10. Changes to the Terms</h2>
                                <div className="space-y-6 text-neutral-700 leading-relaxed">
                                    <p>
                                        Cannoga College may update these Terms of Use and Conditions at any time. Updated terms will be published on the official website and apply from the date of publication.
                                    </p>
                                </div>
                            </section>

                            {/* 11. Governing Law */}
                            <section id="governing-law" className="scroll-mt-32">
                                <h2 className="text-2xl font-bold mb-8  pb-10 pl-2">11. Governing Law and Jurisdiction</h2>
                                <div className="space-y-6 text-neutral-700 leading-relaxed">
                                    <p>
                                        These Terms are governed by the laws of Canada. Any disputes arising in connection with these Terms shall be subject to the jurisdiction of Canadian courts unless otherwise required by law.
                                    </p>
                                </div>
                            </section>

                            {/* 12. Contact Information */}
                            <section id="contact" className="scroll-mt-32">
                                <h2 className="text-2xl font-bold mb-8  pb-10 pl-2">12. Contact Information</h2>
                                <div className="space-y-6 text-neutral-700 leading-relaxed">
                                    <p>
                                        For questions regarding these Terms of Use and Conditions please contact Cannoga College through the official communication channels listed on the website.
                                    </p>
                                </div>
                            </section>

                        </div>

                        <div className="mt-24 pt-8">
                            <p className="text-xs text-neutral-400 font-medium uppercase tracking-widest">
                                Published February 1, 2020.
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

