import { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SchemaLD } from '@/components/seo/SchemaLD';
import { Hero } from '@/components/layout/Hero';
import { AcademicSchoolsCarousel } from '@/components/home/AcademicSchoolsCarousel';
import { InteractiveCampusMap } from '@/components/campus/InteractiveCampusMap';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Contact Directory & General Inquiries',
    description: 'Find primary phone lines, office locations, email directories, and contact forms for administrative departments at Cannoga College.',
    alternates: {
        canonical: 'https://cannogacollege.ca/contact/',
    },
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white text-black antialiased font-sans pb-20">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Contact', item: '/contact' }
            ]} />

            <SchemaLD data={{
                "@context": "https://schema.org",
                "@type": "ContactPage",
                "name": "Contact Cannoga College",
                "url": "https://cannogacollege.ca/contact",
                "mainEntity": {
                    "@type": "EducationalOrganization",
                    "name": "Cannoga College",
                    "email": "Cannoga@cannogacollege.ca",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "81 Montreal Rd",
                        "addressLocality": "Ottawa",
                        "postalCode": "K1L 6E8",
                        "addressCountry": "CA"
                    }
                }
            }} />

            {/* HERO SECTION */}
            <Hero
                title="Contact Information"
                body="Cannoga College provides direct contact information for administrative services including Registry, Admissions, Student Services, and general inquiries to support students, applicants, staff, and partners."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                overlay
                overlayOpacity="opacity-40"
                image={{
                    src: "/images/contact-hero.png",
                    alt: "Contact Cannoga College"
                }}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Directory' }
                ]}
            />

            <div className="container mx-auto max-w-5xl px-4 py-16 space-y-16 text-base md:text-lg font-normal text-slate-700 leading-relaxed">

                {/* ASK ABOUT APPLYING / CONTACT DIRECTORY - CLEAN HORIZONTAL ROWS */}
                <section id="contact-directory" className="scroll-mt-32 space-y-8">
                    <div>
                        <h2 className="text-3xl font-black text-black tracking-tight mb-2">Main Contact Directory</h2>
                        <p className="text-slate-700 text-base md:text-lg font-normal leading-relaxed">
                            Reach out directly to our central admissions team, student registry, or campus location.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6 pt-2">
                        {/* Email */}
                        <div className="space-y-1">
                            <h3 className="text-slate-900 font-bold text-base md:text-lg leading-snug">Email Enquiries</h3>
                            <a href="mailto:admissions@cannogacollege.ca" className="text-slate-500 font-bold underline hover:text-slate-700 transition-colors text-base md:text-lg block">
                                admissions@cannogacollege.ca
                            </a>
                        </div>

                        {/* Talk to Cannoga */}
                        <div className="space-y-1">
                            <h3 className="text-slate-900 font-bold text-base md:text-lg leading-snug">Talk to Cannoga</h3>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Admissions office International students only</p>
                            <a href="tel:+12272500427" className="text-slate-500 font-bold underline hover:text-slate-700 transition-colors text-base md:text-lg block">
                                Talk to Admissions
                            </a>
                        </div>

                        {/* WhatsApp */}
                        <div className="space-y-1">
                            <h3 className="text-slate-900 font-bold text-base md:text-lg leading-snug">WhatsApp</h3>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">WhatsApp only</p>
                            <a
                                href="https://wa.me/17822063309"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-500 font-bold underline hover:text-slate-700 transition-colors text-base md:text-lg block"
                            >
                                Chat on WhatsApp (Admissions)
                            </a>
                        </div>

                        {/* Where to reach us */}
                        <div className="space-y-2">
                            <h3 className="text-slate-900 font-bold text-base md:text-lg leading-snug">Where to reach us</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base md:text-lg text-slate-700 font-normal">
                                <div className="p-5 border border-slate-200 hover:border-black transition-colors rounded-sm space-y-1">
                                    <h4 className="font-bold text-slate-900 text-base md:text-lg">Campus Address</h4>
                                    <p className="leading-relaxed">
                                        Cannoga College – Ottawa campus<br />
                                        81 Montreal Rd,<br />
                                        K1L 6E8 Ottawa, Ontario, Canada
                                    </p>
                                </div>
                                <div className="p-5 border border-slate-200 hover:border-black transition-colors rounded-sm space-y-1">
                                    <h4 className="font-bold text-slate-900 text-base md:text-lg">Mailing Address</h4>
                                    <p className="leading-relaxed">
                                        Cannoga College – Ottawa campus<br />
                                        81 Montreal Rd,<br />
                                        K1L 6E8 Ottawa, Ontario, Canada
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Application Note */}
                        <div className="pt-2 space-y-1">
                            <h3 className="text-slate-900 font-bold text-base md:text-lg leading-snug">Application Note</h3>
                            <p className="text-slate-700 text-base md:text-lg font-normal leading-relaxed">
                                All formal applications must be submitted through the Cannoga College online portal during the official application periods.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Key Department Services */}
                <section className="pt-8 border-t border-slate-200">
                    <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight mb-8">Department Directory</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 border border-slate-200 hover:border-black transition-colors rounded-sm space-y-2">
                            <h3 className="font-bold text-base md:text-lg text-slate-900">Registry Office</h3>
                            <p className="text-base md:text-lg text-slate-700 font-normal leading-relaxed">Responsible for receiving official academic correspondence and documentation.</p>
                            <a href="mailto:registry@cannogacollege.ca" className="text-[#0a151a] font-bold text-base underline hover:text-slate-600 transition-colors block pt-1">
                                registry@cannogacollege.ca
                            </a>
                        </div>

                        <div className="p-6 border border-slate-200 hover:border-black transition-colors rounded-sm space-y-2">
                            <h3 className="font-bold text-base md:text-lg text-slate-900">Admissions Services</h3>
                            <p className="text-base md:text-lg text-slate-700 font-normal leading-relaxed">Information on degree programmes, requirements, scholarships, and deadlines.</p>
                            <a href="mailto:admissions@cannogacollege.ca" className="text-[#0a151a] font-bold text-base underline hover:text-slate-600 transition-colors block pt-1">
                                admissions@cannogacollege.ca
                            </a>
                        </div>

                        <div className="p-6 border border-slate-200 hover:border-black transition-colors rounded-sm space-y-2">
                            <h3 className="font-bold text-base md:text-lg text-slate-900">Student Services</h3>
                            <p className="text-base md:text-lg text-slate-700 font-normal leading-relaxed">Comprehensive support for enrolled students including study planning and guidance.</p>
                            <a href="mailto:studentservices@cannogacollege.ca" className="text-[#0a151a] font-bold text-base underline hover:text-slate-600 transition-colors block pt-1">
                                studentservices@cannogacollege.ca
                            </a>
                        </div>

                        <div className="p-6 border border-slate-200 hover:border-black transition-colors rounded-sm space-y-2">
                            <h3 className="font-bold text-base md:text-lg text-slate-900">Archives &amp; Transcripts</h3>
                            <p className="text-base md:text-lg text-slate-700 font-normal leading-relaxed">Permanent academic records storage, transcript verification, and archival documents.</p>
                            <a href="mailto:archives@cannogacollege.ca" className="text-[#0a151a] font-bold text-base underline hover:text-slate-600 transition-colors block pt-1">
                                archives@cannogacollege.ca
                            </a>
                        </div>
                    </div>
                </section>

                {/* Academic Schools */}
                <section className="pt-8 border-t border-slate-200">
                    <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight mb-8">Academic Schools &amp; Faculties</h2>
                    <AcademicSchoolsCarousel />
                </section>

                {/* Campus Map & Directions */}
                <section className="pt-8 border-t border-slate-200">
                    <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight mb-2">Campus Location Map</h2>
                    <p className="text-slate-700 text-base md:text-lg mb-6 leading-relaxed font-normal">
                        Explore learning spaces, laboratories, and administrative centers at our Ottawa campus.
                    </p>
                    <InteractiveCampusMap />
                </section>

            </div>
        </main>
    );
}
