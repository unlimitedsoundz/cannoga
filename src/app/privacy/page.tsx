import { Link } from "@aalto-dx/react-components";

export const metadata = {
    title: 'Privacy & Data Protection Notice',
    description: 'Our formal privacy notice detailing how we collect, process, and protect student and website user data under GDPR rules.',
    alternates: {
        canonical: 'https://cannogacollege.ca/privacy/',
    },
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-white font-sans">
            {/* 1. Hero Section */}
            <section className="relative h-[40vh] flex items-center bg-neutral-100 border-b border-neutral-200">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl space-y-4">
                        <div className="text-xs font-bold uppercase tracking-widest text-neutral-500">Legal Documentation</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight pt-8">
                            Privacy Policy
                        </h1>
                        <p className="text-lg text-neutral-600 leading-relaxed">
                            How Cannoga College handles personal data in accordance with the GDPR and Canadian data protection legislation.
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. Main Content */}
            <div className="container mx-auto px-4 py-8 md:py-24">
                <div className="grid lg:grid-cols-12 gap-16">

                    {/* Sidebar Navigation */}
                    <aside className="lg:col-span-3 hidden lg:block">
                        <div className="sticky top-24 space-y-2">
                            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-6">Contents</h3>
                            {[
                                { id: 'introduction', label: '1. Introduction' },
                                { id: 'data-controller', label: '2. Data Controller' },
                                { id: 'scope', label: '3. Scope' },
                                { id: 'categories', label: '4. Data Categories' },
                                { id: 'legal-basis', label: '5. Legal Basis' },
                                { id: 'purposes', label: '6. Purposes' },
                                { id: 'retention', label: '7. Retention' },
                                { id: 'sharing', label: '8. Data Sharing' },
                                { id: 'transfers', label: '9. Int. Transfers' },
                                { id: 'security', label: '10. Data Security' },
                                { id: 'rights', label: '11. Your Rights' },
                                { id: 'cookies', label: '12. Cookies' },
                                { id: 'changes', label: '13. Amendments' },
                                { id: 'contact', label: '14. Contact' },
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

                    {/* Policy Content */}
                    <main className="lg:col-span-9 max-w-3xl">

                        <div className="prose prose-neutral max-w-none space-y-8 md:space-y-16">

                            <section id="introduction" className="scroll-mt-32 space-y-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#0a151a] pb-10 pl-2">1. Introduction</h2>
                                <p className="text-neutral-700 leading-relaxed">
                                    Cannoga College is committed to protecting the privacy and personal data of its students, applicants, staff, partners, alumni, and website users. This Privacy Policy explains how Cannoga College collects, uses, stores, shares, and protects personal data in accordance with applicable data protection laws, including the General Data Protection Regulation (GDPR) and relevant Canadian data protection legislation.
                                </p>
                                <p className="text-neutral-700 leading-relaxed">
                                    By engaging with Cannoga College, including applying for admission, enrolling in programmes, using our services, or visiting our digital platforms, you acknowledge that your personal data may be processed as described in this policy.
                                </p>
                            </section>

                            <section id="data-controller" className="scroll-mt-32 space-y-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#0a151a] pb-10 pl-2">2. Data Controller</h2>
                                <p className="text-neutral-700 leading-relaxed">
                                    Cannoga College acts as the data controller for personal data processed in relation to its educational, administrative, and operational activities.
                                    Contact details of the Data Protection Officer or responsible unit will be made available on the official Cannoga College website.
                                </p>
                            </section>

                            <section id="scope" className="scroll-mt-32 space-y-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#0a151a] pb-10 pl-2">3. Scope of This Policy</h2>
                                <p className="text-neutral-700 leading-relaxed">
                                    This Privacy Policy applies to all personal data processed by Cannoga College, including data related to prospective students, enrolled students, graduates, staff, visiting lecturers, partners, research participants, and users of Cannoga College websites, systems, and services.
                                </p>
                            </section>

                            <section id="categories" className="scroll-mt-32 space-y-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#0a151a] pb-10 pl-2">4. Categories of Personal Data Collected</h2>
                                <p className="text-neutral-700 leading-relaxed mb-6">
                                    Cannoga College may collect and process the following categories of personal data where relevant and lawful:
                                </p>
                                <ul className="space-y-4 text-neutral-700 list-none p-0">
                                    <li><span className="font-bold">Identification data:</span> name, date of birth, nationality, and identification numbers where required by law</li>
                                    <li><span className="font-bold">Contact information:</span> address, email address, telephone number, and emergency contact details</li>
                                    <li><span className="font-bold">Application and admission data:</span> academic background, qualifications, transcripts, and supporting documents</li>
                                    <li><span className="font-bold">Study related data:</span> enrolment records, course registrations, grades, credits, attendance, learning progress, and thesis information</li>
                                    <li><span className="font-bold">Financial data:</span> tuition fee records, payment information, scholarships, grants, and invoicing details</li>
                                    <li><span className="font-bold">Employment related data:</span> for staff including recruitment records, contracts, payroll information, and performance related data</li>
                                    <li><span className="font-bold">Technical data:</span> IP addresses, log data, device information, and usage data from digital platforms</li>
                                    <li><span className="font-bold">Communication data:</span> emails, messages, feedback, surveys, and support requests</li>
                                </ul>
                                <p className="text-sm text-neutral-500 italic mt-6">
                                    Cannoga College does not intentionally collect sensitive personal data unless required by law or necessary to fulfil statutory obligations.
                                </p>
                            </section>

                            <section id="legal-basis" className="scroll-mt-32 space-y-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#0a151a] pb-10 pl-2">5. Legal Basis for Processing</h2>
                                <p className="text-neutral-700 leading-relaxed mb-6">
                                    Personal data is processed on one or more of the following legal bases:
                                </p>
                                <ul className="space-y-3 text-neutral-700 list-none p-0">
                                    <li>• Performance of a contract</li>
                                    <li>• Compliance with legal obligations under Canadian and EU law</li>
                                    <li>• Legitimate interests related to education and administration</li>
                                    <li>• Consent where explicitly required</li>
                                </ul>
                            </section>

                            <section id="purposes" className="scroll-mt-32 space-y-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#0a151a] pb-10 pl-2">6. Purposes of Data Processing</h2>
                                <p className="text-neutral-700 leading-relaxed mb-6">
                                    Cannoga College processes personal data for the following purposes:
                                </p>
                                <ul className="space-y-2 text-neutral-700 list-none p-0 text-sm">
                                    <li>• Managing student admissions and academic administration</li>
                                    <li>• Delivering educational programmes, teaching, and assessment</li>
                                    <li>• Maintaining student records and qualifications</li>
                                    <li>• Providing academic support and student welfare services</li>
                                    <li>• Managing tuition fees, billing, and scholarships</li>
                                    <li>• Conducting quality assurance and accreditation</li>
                                    <li>• Managing human resources and employment</li>
                                    <li>• Ensuring campus and information security</li>
                                    <li>• Fulfilling legal reporting obligations</li>
                                </ul>
                            </section>

                            <section id="retention" className="scroll-mt-32 space-y-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#0a151a] pb-10 pl-2">7. Data Retention</h2>
                                <p className="text-neutral-700 leading-relaxed">
                                    Personal data is retained only for as long as necessary to fulfil the purposes for which it was collected and to comply with legal retention requirements.
                                    Retention periods are defined in accordance with Canadian archival regulations, education legislation, and internal data management policies.
                                    When personal data is no longer required, it is securely deleted or anonymised.
                                </p>
                            </section>

                            <section id="sharing" className="scroll-mt-32 space-y-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#0a151a] pb-10 pl-2">8. Data Sharing and Disclosure</h2>
                                <p className="text-neutral-700 leading-relaxed">
                                    Cannoga College may share personal data with third parties only where necessary and lawful, including government authorities, educational partners, service providers, and research partners. All third parties are required to process data in accordance with law and confidentiality obligations.
                                </p>
                            </section>

                            <section id="transfers" className="scroll-mt-32 space-y-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#0a151a] pb-10 pl-2">9. International Data Transfers</h2>
                                <p className="text-neutral-700 leading-relaxed">
                                    Where personal data is transferred outside the EEA, Cannoga College ensures appropriate safeguards are in place, such as adequacy decisions or standard contractual clauses.
                                </p>
                            </section>

                            <section id="security" className="scroll-mt-32 space-y-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#0a151a] pb-10 pl-2">10. Data Security</h2>
                                <p className="text-neutral-700 leading-relaxed">
                                    We implement appropriate technical and organisational measures to protect data against unauthorised access, loss, or misuse. This includes access controls, encryption, and regular security reviews.
                                </p>
                            </section>

                            <section id="rights" className="scroll-mt-32 space-y-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#0a151a] pb-10 pl-2">11. Data Subject Rights</h2>
                                <p className="text-neutral-700 leading-relaxed mb-6">
                                    Individuals have the following rights under applicable law:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-neutral-600">
                                    <li>• Right to access personal data</li>
                                    <li>• Right to rectification</li>
                                    <li>• Right to erasure</li>
                                    <li>• Right to restriction of processing</li>
                                    <li>• Right to data portability</li>
                                    <li>• Right to object to processing</li>
                                    <li>• Right to withdraw consent</li>
                                    <li>• Right to lodge a complaint</li>
                                </div>
                            </section>

                            <section id="cookies" className="scroll-mt-32 space-y-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#0a151a] pb-10 pl-2">12. Cookies and Digital Services</h2>
                                <p className="text-neutral-700 leading-relaxed">
                                    Our platforms use cookies to ensure functionality and improve user experience. Detailed info is in our separate Cookie Policy.
                                </p>
                            </section>

                            <section id="changes" className="scroll-mt-32 space-y-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#0a151a] pb-10 pl-2">13. Changes to This Policy</h2>
                                <p className="text-neutral-700 leading-relaxed">
                                    This policy may be updated from time to time. The latest version will always be available on our website.
                                </p>
                            </section>

                            <section id="contact" className="scroll-mt-32 space-y-4 pt-8 underline-offset-4">
                                <h2 className="text-2xl font-bold text-black border-b border-[#0a151a] pb-10 pl-2">14. Contact Information</h2>
                                <p className="text-neutral-700 leading-relaxed">
                                    For questions or requests, please contact Cannoga College through the official channels listed on our website.
                                </p>
                                <div className="pt-4">
                                    <p className="text-sm font-bold text-black">Data Protection Officer</p>
                                    <p className="text-sm text-neutral-500">privacy@cannogacollege.ca</p>
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

