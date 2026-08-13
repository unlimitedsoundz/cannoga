'use client';

import { useEffect, useState } from "react";

const sections = [
    { id: 'introduction', title: '1. Introduction' },
    { id: 'what-are-cookies', title: '2. What Are Cookies' },
    { id: 'types-of-cookies', title: '3. Types of Cookies Used' },
    { id: 'legal-basis', title: '4. Legal Basis for Cookie Use' },
    { id: 'managing-cookies', title: '5. Managing Cookies' },
    { id: 'changes', title: '6. Changes to the Cookie Policy' },
    { id: 'contact', title: '7. Contact Information' },
];

export default function CookiesContent() {
    const [activeSection, setActiveSection] = useState('introduction');

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
            <section className="relative h-[40vh] flex items-center bg-neutral-100 border-b border-neutral-200">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl space-y-4">
                        <div className="text-xs font-bold uppercase tracking-widest text-neutral-500">Legal Documentation</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight pt-8">
                            Cookie Policy
                        </h1>
                        <p className="text-lg text-neutral-600 leading-relaxed">
                            How Cannoga College uses cookies and similar technologies to ensure proper functionality and improve user experience.
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8 md:py-24">
                <div className="grid lg:grid-cols-12 gap-16">
                    {/* Sidebar navigation */}
                    <aside className="lg:col-span-3 hidden lg:block">
                        <div className="sticky top-24 space-y-2">
                            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-6 border-b border-neutral-100 pb-2">Contents</h3>
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
                            {/* 1. Introduction */}
                            <section id="introduction" className="scroll-mt-32">
                                <h2 className="text-2xl font-bold mb-8  pb-10 pl-2">1. Introduction</h2>
                                <div className="space-y-6 text-neutral-700 leading-relaxed">
                                    <p>
                                        Cannoga College uses cookies and similar technologies on its website and digital platforms to ensure proper functionality improve user experience analyse usage and support institutional services. This Cookie Policy explains what cookies are how they are used and the choices available to users.
                                    </p>
                                    <p>
                                        This policy should be read together with the Cannoga College Privacy Policy and Accessibility Statement.
                                    </p>
                                </div>
                            </section>

                            {/* 2. What Are Cookies */}
                            <section id="what-are-cookies" className="scroll-mt-32">
                                <h2 className="text-2xl font-bold mb-8  pb-10 pl-2">2. What Are Cookies</h2>
                                <div className="space-y-6 text-neutral-700 leading-relaxed">
                                    <p>
                                        Cookies are small text files stored on a user’s device when visiting a website. Cookies help websites remember user preferences enable core functions and collect information about how services are used.
                                    </p>
                                    <p>
                                        Cookies do not harm user devices and do not directly identify individuals.
                                    </p>
                                </div>
                            </section>

                            {/* 3. Types of Cookies Used */}
                            <section id="types-of-cookies" className="scroll-mt-32">
                                <h2 className="text-2xl font-bold mb-8  pb-10 pl-2">3. Types of Cookies Used</h2>
                                <div className="space-y-8 text-neutral-700 leading-relaxed">
                                    <div>
                                        <h3 className="text-lg font-bold text-black mb-4">Essential Cookies</h3>
                                        <p>
                                            These cookies are necessary for the basic operation of the website and digital services. They enable core functions such as page navigation secure access and form submissions. Essential cookies cannot be disabled.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-black mb-4">Functional Cookies</h3>
                                        <p>
                                            Functional cookies allow the website to remember user preferences such as language selection accessibility settings and session choices to provide a more personalised experience.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-black mb-4">Analytics Cookies</h3>
                                        <p>
                                            Analytics cookies collect aggregated information about how users interact with the website. This data is used to analyse usage patterns improve content and enhance performance.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-black mb-4">Third Party Cookies</h3>
                                        <p>
                                            Some services integrated into Cannoga College platforms may place cookies through third party providers such as embedded content analytics tools or payment services. These cookies are governed by the privacy policies of the respective providers.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* 4. Legal Basis for Cookie Use */}
                            <section id="legal-basis" className="scroll-mt-32">
                                <h2 className="text-2xl font-bold mb-8  pb-10 pl-2">4. Legal Basis for Cookie Use</h2>
                                <div className="space-y-6 text-neutral-700 leading-relaxed">
                                    <p>
                                        The use of essential cookies is based on legitimate interest and technical necessity. Non essential cookies such as analytics or functional cookies are used based on user consent where required by law.
                                    </p>
                                </div>
                            </section>

                            {/* 5. Managing Cookies */}
                            <section id="managing-cookies" className="scroll-mt-32">
                                <h2 className="text-2xl font-bold mb-8  pb-10 pl-2">5. Managing Cookies</h2>
                                <div className="space-y-6 text-neutral-700 leading-relaxed">
                                    <p>
                                        Users can manage or disable cookies through their browser settings. Blocking cookies may affect the functionality and usability of Cannoga College digital services.
                                    </p>
                                    <p>
                                        Information on managing cookies is available in browser help sections.
                                    </p>
                                </div>
                            </section>

                            {/* 6. Changes to the Cookie Policy */}
                            <section id="changes" className="scroll-mt-32">
                                <h2 className="text-2xl font-bold mb-8  pb-10 pl-2">6. Changes to the Cookie Policy</h2>
                                <div className="space-y-6 text-neutral-700 leading-relaxed">
                                    <p>
                                        Cannoga College may update this Cookie Policy to reflect changes in legal requirements or digital services. The latest version will always be published on the official website.
                                    </p>
                                </div>
                            </section>

                            {/* 7. Contact Information */}
                            <section id="contact" className="scroll-mt-32">
                                <h2 className="text-2xl font-bold mb-8  pb-10 pl-2">7. Contact Information</h2>
                                <div className="space-y-6 text-neutral-700 leading-relaxed">
                                    <p>
                                        Questions regarding this Cookie Policy can be directed to Cannoga College through official contact channels listed on the website.
                                    </p>
                                </div>
                            </section>

                        </div>

                        <div className="mt-24 pt-8 border-t border-neutral-200">
                            <p className="text-xs text-neutral-400 font-medium uppercase tracking-widest">
                                Effective as of February 1, 2020.
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

