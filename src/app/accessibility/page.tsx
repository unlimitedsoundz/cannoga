import { Link } from "@aalto-dx/react-components";

export const metadata = {
    title: 'Digital Accessibility Commitment & Policy — Cannoga College',
    description: 'Read our dedication to providing accessible digital experiences, learning tools, and web platforms for all members of our community.',
    alternates: {
        canonical: 'https://cannogacollege.ca/accessibility/',
    },
};

export default function AccessibilityPage() {
    return (
        <div className="min-h-screen bg-white font-sans">
            {/* 1. Hero Section */}
            <section className="relative h-[40vh] flex items-center bg-neutral-100 border-b border-neutral-200">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl space-y-4">
                        <div className="text-xs font-bold uppercase tracking-widest text-neutral-500">Institutional Policy</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight pt-8">
                            Accessibility Statement
                        </h1>
                        <p className="text-lg text-neutral-600 leading-relaxed">
                            Cannoga College is committed to ensuring digital accessibility for all users, regardless of ability or technology used.
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. Main Content */}
            <div className="container mx-auto px-4 py-24">
                <div className="grid lg:grid-cols-12 gap-16">

                    {/* Sidebar Navigation */}
                    <aside className="lg:col-span-3 hidden lg:block">
                        <div className="sticky top-24 space-y-2">
                            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-6">Contents</h3>
                            {[
                                { id: 'commitment', label: '1. Commitment' },
                                { id: 'scope', label: '2. Scope' },
                                { id: 'standards', label: '3. Standards' },
                                { id: 'status', label: '4. Status' },
                                { id: 'features', label: '5. Features' },
                                { id: 'non-accessible', label: '6. Non-Accessible' },
                                { id: 'alternative', label: '7. Alternative Access' },
                                { id: 'feedback', label: '8. Feedback' },
                                { id: 'enforcement', label: '9. Enforcement' },
                                { id: 'improvement', label: '10. Improvement' },
                                { id: 'preparation', label: '11. Preparation' },
                                { id: 'date', label: '12. Date' },
                            ].map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    className="block py-1 text-sm text-neutral-500 hover:text-black hover:font-medium transition-all"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </aside>

                    {/* Content */}
                    <main className="lg:col-span-9 max-w-3xl">

                        <div className="prose prose-neutral max-w-none space-y-16">

                            <section id="commitment" className="scroll-mt-32 space-y-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#9c27b3] pb-10 pl-2">1. Commitment to Accessibility</h2>
                                <p className="text-neutral-700 leading-relaxed">
                                    Cannoga College is committed to ensuring digital accessibility for all users including students applicants staff partners and members of the public. We strive to provide an inclusive online environment that allows everyone to access information services and digital content equally regardless of ability or technology used.
                                </p>
                                <p className="text-neutral-700 leading-relaxed">
                                    This Accessibility Statement describes how Cannoga College complies with applicable accessibility legislation and standards and how users can report accessibility issues.
                                </p>
                            </section>

                            <section id="scope" className="scroll-mt-32 space-y-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#9c27b3] pb-10 pl-2">2. Scope of This Statement</h2>
                                <p className="text-neutral-700 leading-relaxed">
                                    This Accessibility Statement applies to the official Cannoga College website and related digital services including online application platforms learning management systems and publicly available digital content provided by Cannoga College.
                                </p>
                            </section>

                            <section id="standards" className="scroll-mt-32 space-y-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#9c27b3] pb-10 pl-2">3. Accessibility Standards and Legislation</h2>
                                <p className="text-neutral-700 leading-relaxed mb-6">
                                    Cannoga College aims to comply with the following standards and legal requirements:
                                </p>
                                <ul className="space-y-2 text-neutral-700 list-none p-0 text-sm">
                                    <li>• Web Content Accessibility Guidelines WCAG 2.1 level AA</li>
                                    <li>• European Accessibility Act where applicable</li>
                                    <li>• Canadian Act on the Provision of Digital Services</li>
                                    <li>• Relevant European Union accessibility regulations</li>
                                </ul>
                                <p className="text-neutral-700 leading-relaxed mt-4">
                                    Compliance with these standards ensures that digital content is perceivable operable understandable and robust.
                                </p>
                            </section>

                            <section id="status" className="scroll-mt-32 space-y-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#9c27b3] pb-10 pl-2">4. Accessibility Status</h2>
                                <p className="text-neutral-700 leading-relaxed">
                                    Cannoga College digital services are partially compliant with WCAG 2.1 level AA. Continuous efforts are being made to improve accessibility and to address any identified shortcomings.
                                </p>
                            </section>

                            <section id="features" className="scroll-mt-32 space-y-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#9c27b3] pb-10 pl-2">5. Accessible Content and Features</h2>
                                <p className="text-neutral-700 leading-relaxed mb-6">
                                    The following accessibility features are implemented across Cannoga College digital platforms where possible:
                                </p>
                                <ul className="space-y-3 text-neutral-700 list-none p-0 text-sm">
                                    <li>• Clear and consistent navigation structures</li>
                                    <li>• Sufficient color contrast between text and background</li>
                                    <li>• Resizable text without loss of content or functionality</li>
                                    <li>• Logical heading structures and meaningful page titles</li>
                                    <li>• Keyboard accessibility for core functions</li>
                                    <li>• Alternative text for images and non text content</li>
                                    <li>• Accessible forms with labels and error messages</li>
                                    <li>• Compatibility with screen readers and assistive technologies</li>
                                </ul>
                            </section>

                            <section id="non-accessible" className="scroll-mt-32 space-y-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#9c27b3] pb-10 pl-2">6. Non Accessible Content</h2>
                                <p className="text-neutral-700 leading-relaxed mb-4">
                                    Despite ongoing improvements some content may not yet fully meet accessibility requirements. This may include:
                                </p>
                                <ul className="space-y-2 text-neutral-700 list-none p-0 text-sm">
                                    <li>• Older documents such as PDF files that are not fully accessible</li>
                                    <li>• Third party content or systems not fully controlled by Cannoga College</li>
                                    <li>• Complex data visualisations that may require additional accessibility enhancements</li>
                                    <li>• Video or audio content that may lack captions or transcripts</li>
                                </ul>
                                <p className="text-neutral-700 leading-relaxed mt-4">
                                    Cannoga College is actively working to address these issues and prioritises accessibility improvements based on user impact.
                                </p>
                            </section>

                            <section id="alternative" className="scroll-mt-32 space-y-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#9c27b3] pb-10 pl-2">7. Alternative Access</h2>
                                <p className="text-neutral-700 leading-relaxed">
                                    If a user is unable to access specific content or services due to accessibility limitations Cannoga College will provide information in an alternative accessible format upon request whenever reasonably possible.
                                </p>
                            </section>

                            <section id="feedback" className="scroll-mt-32 space-y-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#9c27b3] pb-10 pl-2">8. Feedback and Contact Information</h2>
                                <p className="text-neutral-700 leading-relaxed">
                                    Cannoga College welcomes feedback on the accessibility of its digital services. Users who experience accessibility barriers or require assistance are encouraged to contact the institution.
                                </p>
                                <p className="text-neutral-700 leading-relaxed">
                                    Accessibility related feedback can be submitted through the official Cannoga College contact channels listed on the website. Requests will be handled promptly and in accordance with applicable regulations.
                                </p>
                            </section>

                            <section id="enforcement" className="scroll-mt-32 space-y-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#9c27b3] pb-10 pl-2">9. Enforcement Procedure</h2>
                                <p className="text-neutral-700 leading-relaxed">
                                    If a user is not satisfied with the response received from Cannoga College they may contact the supervisory authority responsible for monitoring digital accessibility in Ottawa, Ontario, Canada.
                                </p>
                                <p className="text-neutral-700 leading-relaxed">
                                    Information about the supervisory authority and the enforcement procedure is available on the official Canadian government websites.
                                </p>
                            </section>

                            <section id="improvement" className="scroll-mt-32 space-y-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#9c27b3] pb-10 pl-2">10. Continuous Improvement</h2>
                                <p className="text-neutral-700 leading-relaxed mb-4">
                                    Cannoga College regularly reviews and updates its digital services to improve accessibility. This includes:
                                </p>
                                <ul className="space-y-2 text-neutral-700 list-none p-0 text-sm">
                                    <li>• Ongoing accessibility testing and audits</li>
                                    <li>• Staff training on accessibility best practices</li>
                                    <li>• Integrating accessibility requirements into digital development processes</li>
                                    <li>• Monitoring compliance with evolving legal and technical standards</li>
                                </ul>
                            </section>

                            <section id="preparation" className="scroll-mt-32 space-y-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#9c27b3] pb-10 pl-2">11. Preparation of This Statement</h2>
                                <p className="text-neutral-700 leading-relaxed">
                                    This Accessibility Statement was prepared based on internal assessments and reviews of Cannoga College digital services.
                                </p>
                                <p className="text-neutral-700 leading-relaxed">
                                    The statement is reviewed periodically and updated when significant changes are made to digital services or accessibility standards.
                                </p>
                            </section>

                            <section id="date" className="scroll-mt-32 space-y-4 pt-8">
                                <h2 className="text-2xl font-bold text-black border-b border-[#9c27b3] pb-10 pl-2">12. Date of Statement</h2>
                                <p className="text-neutral-700 leading-relaxed">
                                    This Accessibility Statement is effective upon publication and reflects the current accessibility status of Cannoga College digital services.
                                </p>
                            </section>

                        </div>

                        <div className="mt-24 pt-8 border-t border-neutral-200">
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

