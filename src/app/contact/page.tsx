import { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SchemaLD } from '@/components/seo/SchemaLD';
import { Hero } from '@/components/layout/Hero';
import { AcademicSchoolsCarousel } from '@/components/home/AcademicSchoolsCarousel';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Contact Directory & General Inquiries — Cannoga College',
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

            <div className="container mx-auto max-w-5xl px-4 py-16 space-y-16">

                {/* ASK ABOUT APPLYING / CONTACT DIRECTORY - CLEAN HORIZONTAL ROWS */}
                <section id="contact-directory" className="scroll-mt-32 space-y-8">
                    <div>
                        <h2 className="text-3xl font-black text-black tracking-tight mb-2">Main Contact Directory</h2>
                        <p className="text-slate-700 text-base md:text-lg font-medium leading-relaxed">
                            Reach out directly to our central admissions team, student registry, or campus location.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6 pt-2">
                        {/* Email */}
                        <div>
                            <h3 className="text-slate-900 font-bold text-base leading-snug">Email Enquiries</h3>
                            <a href="mailto:admissions@cannogacollege.ca" className="text-[#0f2027] font-bold underline hover:text-[#c89211] transition-colors text-sm mt-1 block">
                                admissions@cannogacollege.ca
                            </a>
                            <p className="text-slate-600 text-sm font-normal mt-1 leading-normal">
                                Ottawa, Ontario, Canada resident and international inquiries
                            </p>
                        </div>

                        {/* Talk to Cannoga */}
                        <div>
                            <h3 className="text-slate-900 font-bold text-base leading-snug">Talk to Cannoga</h3>
                            <div className="mt-1 space-y-1">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Admissions office International students only</p>
                                <a href="tel:+12272500427" className="text-[#0f2027] font-bold underline hover:text-[#c89211] transition-colors text-sm block">
                                    Talk to Admissions: +1 (227) 250-0427
                                </a>
                            </div>
                        </div>

                        {/* Where to reach us */}
                        <div>
                            <h3 className="text-slate-900 font-bold text-base leading-snug">Where to reach us</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 text-sm text-slate-700">
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">Campus Address</h4>
                                    <p className="leading-relaxed mt-0.5">
                                        Cannoga College – Ottawa campus<br />
                                        81 Montreal Rd,<br />
                                        K1L 6E8 Ottawa, Ontario, Canada
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">Mailing Address</h4>
                                    <p className="leading-relaxed mt-0.5">
                                        Cannoga College – Ottawa campus<br />
                                        81 Montreal Rd,<br />
                                        K1L 6E8 Ottawa, Ontario, Canada
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Application Note */}
                        <div className="pt-2">
                            <h3 className="text-slate-900 font-bold text-base leading-snug">Application Note</h3>
                            <p className="text-slate-600 text-sm font-normal mt-1 leading-normal">
                                All formal applications must be submitted through the Cannoga College online portal during the official application periods.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Key Department Services */}
                <section className="pt-8 border-t border-slate-200">
                    <h2 className="text-2xl font-black text-black tracking-tight mb-8">Department Directory</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-base text-slate-900">Registry Office</h3>
                            <p className="text-sm text-slate-600 mt-1 mb-2">Responsible for receiving official academic correspondence and documentation.</p>
                            <a href="mailto:registry@cannogacollege.ca" className="text-[#0f2027] font-bold text-sm underline hover:text-[#c89211] transition-colors">
                                registry@cannogacollege.ca
                            </a>
                        </div>

                        <div>
                            <h3 className="font-bold text-base text-slate-900">Admissions Services</h3>
                            <p className="text-sm text-slate-600 mt-1 mb-2">Information on degree programmes, requirements, scholarships, and deadlines.</p>
                            <a href="mailto:admissions@cannogacollege.ca" className="text-[#0f2027] font-bold text-sm underline hover:text-[#c89211] transition-colors">
                                admissions@cannogacollege.ca
                            </a>
                        </div>

                        <div>
                            <h3 className="font-bold text-base text-slate-900">Student Services</h3>
                            <p className="text-sm text-slate-600 mt-1 mb-2">Comprehensive support for enrolled students including study planning and guidance.</p>
                            <a href="mailto:studentservices@cannogacollege.ca" className="text-[#0f2027] font-bold text-sm underline hover:text-[#c89211] transition-colors">
                                studentservices@cannogacollege.ca
                            </a>
                        </div>

                        <div>
                            <h3 className="font-bold text-base text-slate-900">Archives & Transcripts</h3>
                            <p className="text-sm text-slate-600 mt-1 mb-2">Permanent academic records storage, transcript verification, and archival documents.</p>
                            <a href="mailto:archives@cannogacollege.ca" className="text-[#0f2027] font-bold text-sm underline hover:text-[#c89211] transition-colors">
                                archives@cannogacollege.ca
                            </a>
                        </div>
                    </div>
                </section>

                {/* Academic Schools */}
                <section className="pt-8 border-t border-slate-200">
                    <h2 className="text-2xl font-black text-black tracking-tight mb-8">Academic Schools & Faculties</h2>
                    <AcademicSchoolsCarousel />
                </section>

                {/* Campus Map & Directions */}
                <section className="pt-8 border-t border-slate-200">
                    <h2 className="text-2xl font-black text-black tracking-tight mb-6">Campus Location Map</h2>
                    <p className="text-slate-700 mb-6 leading-relaxed font-medium">
                        Explore learning spaces, laboratories, and administrative centers at our Ottawa campus.
                    </p>
                    <div className="overflow-hidden border border-slate-200">
                        <Image 
                            src="/images/Cannoga College Campus MAp.png" 
                            alt="Cannoga College Campus Map" 
                            width={1200}
                            height={800}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </section>

            </div>
        </main>
    );
}
