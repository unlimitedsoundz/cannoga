import { Link } from '@/components/ui/Link';
import Image from 'next/image';
import { EnvelopeSimple, Phone, MapPin, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata = {
    title: 'Admissions Contact Directory & Inquiry Desk — Cannoga College',
    description: 'Reach out to our admissions team for personalized guidance. Find telephone numbers, email addresses, and support hours.',
    alternates: {
        canonical: 'https://cannogacollege.ca/admissions/contact-information/',
    },
};

export default function AdmissionsContactInfo() {
    return (
        <div className="bg-white text-black antialiased font-sans flex flex-col min-h-screen">
            
            <main className="pt-24 pb-32">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-12">
                        
                        {/* Sidebar */}
                        <aside className="lg:w-1/4">
                            <div className="sticky top-32">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-black mb-8 px-4">Admission Services</h2>
                                <ul className="space-y-1">
                                    <li>
                                         <Link href="/admissions" className="block py-2 px-4 text-black hover:opacity-70 transition-opacity no-underline font-medium text-sm">
                                             Study at Cannoga
                                         </Link>
                                    </li>
                                    <li>
                                        <Link href="/degree-programmes" className="block py-2 px-4 text-black hover:opacity-70 transition-opacity no-underline font-medium text-sm">
                                            Degree programmes
                                        </Link>
                                    </li>
                                    <li>
                                        <div>
                                            <Link href="/admissions" className="flex items-center justify-between py-2 px-4 text-black font-bold text-sm no-underline">
                                                How to apply
                                            </Link>
                                            <ul className="mt-1 space-y-1">
                                                <li>
                                                    <Link href="/admissions/contact-information" className="block py-2 px-8 text-black font-bold text-sm no-underline text-[#c89211]">
                                                        Contact Admission Services
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li>
                                        <Link href="/admissions" className="block py-2 px-4 text-black hover:opacity-70 transition-opacity no-underline font-medium text-sm">
                                            Events for applicants
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="https://ourblogs.cannogacollege.ca" target="_blank" className="block py-2 px-4 text-black hover:opacity-70 transition-opacity no-underline font-medium text-sm">
                                            Student stories
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </aside>

                        {/* Page Body */}
                        <div className="lg:w-3/4">
                            
                            {/* Breadcrumbs */}
                            <Breadcrumbs 
                                items={[
                                    { label: 'Home', linkComponentProps: { href: '/' } },
                                    { label: 'Admissions', linkComponentProps: { href: '/admissions' } },
                                    { label: 'Contact Information' }
                                ]} 
                            />

                            {/* Title & Ingress */}
                            <div className="mb-12">
                                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-neutral-900 mb-6 leading-tight">
                                    Contact Information for Cannoga College Admission Services
                                </h1>
                                <p className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-3xl font-medium">
                                    You can contact Cannoga College Admission Services by email or by phone during our customer service hours. If your inquiry concerns a specific study programme, please include the name of the programme in the subject line of your message.
                                </p>
                            </div>

                            {/* Hero Image */}
                            <div className="mb-16">
                                <div className="rounded-none overflow-hidden aspect-[21/9] relative group mb-4">
                                    <Image 
                                        src="/images/Cannoga College Campus MAp.png" 
                                        alt="Cannoga College Campus Map" 
                                        width={1600}
                                        height={900}
                                        className="w-full h-full object-cover object-top"
                                    />
                                </div>
                                <div className="text-xs text-slate-500 font-medium">
                                    Photo: Cannoga College Campus, Ottawa
                                </div>
                            </div>

                            {/* ASK ABOUT APPLYING - CLEAN HORIZONTAL ROWS */}
                            <section id="ask-about-applying" className="scroll-mt-32 mb-16 space-y-8">
                                <div>
                                    <h2 className="text-3xl font-black text-black tracking-tight mb-2">Ask About Applying</h2>
                                    <p className="text-slate-700 text-base md:text-lg font-medium leading-relaxed">
                                        Get direct guidance from the Cannoga College admissions team and international student advisors.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-6 pt-2">
                                    {/* Email */}
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-[#0f2027] text-[#c89211] rounded-full shrink-0 mt-0.5">
                                            <EnvelopeSimple size={16} weight="bold" />
                                        </div>
                                        <div>
                                            <h3 className="text-slate-900 font-bold text-base leading-snug">Email</h3>
                                            <a href="mailto:admissions@cannogacollege.ca" className="text-[#0f2027] font-bold underline hover:text-[#c89211] transition-colors text-sm mt-1 block">
                                                admissions@cannogacollege.ca
                                            </a>
                                            <p className="text-slate-600 text-sm font-normal mt-1 leading-normal">
                                                Ottawa, Ontario, Canada resident enquiries
                                            </p>
                                        </div>
                                    </div>

                                    {/* Talk to Cannoga */}
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-[#0f2027] text-[#c89211] rounded-full shrink-0 mt-0.5">
                                            <Phone size={16} weight="bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <div>
                                                <h3 className="text-slate-900 font-bold text-base leading-snug">Talk to Cannoga</h3>
                                                <div className="mt-1 space-y-1">
                                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Admissions office International students only</p>
                                                    <a href="tel:+12272500427" className="text-[#0f2027] font-bold underline hover:text-[#c89211] transition-colors text-sm block">
                                                        Talk to Admissions: +1 (227) 250-0427
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="text-xs text-slate-800 space-y-1 pt-1">
                                                <p className="font-bold text-slate-900 text-xs uppercase tracking-wider text-[#c89211] mb-1">Telephone service hours (UTC +2):</p>
                                                <ul className="space-y-0.5 text-xs text-slate-700 font-medium">
                                                    <li className="flex gap-2"><span className="font-bold text-slate-900 w-10">Mon:</span><span>12:30 pm – 2:00 pm</span></li>
                                                    <li className="flex gap-2"><span className="font-bold text-slate-900 w-10">Tue:</span><span>9:30 am – 11:00 am</span></li>
                                                    <li className="flex gap-2"><span className="font-bold text-slate-900 w-10">Wed:</span><span>9:30 am – 11:00 am</span></li>
                                                    <li className="flex gap-2"><span className="font-bold text-slate-900 w-10">Thu:</span><span>9:30 am – 11:00 am</span></li>
                                                    <li className="flex gap-2"><span className="font-bold text-slate-900 w-10">Fri:</span><span className="text-red-600 font-bold">Closed</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Where to reach us */}
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-[#0f2027] text-[#c89211] rounded-full shrink-0 mt-0.5">
                                            <MapPin size={16} weight="bold" />
                                        </div>
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
                                    </div>

                                    {/* Application Note */}
                                    <div className="flex items-start gap-4 pt-2">
                                        <div className="p-2 bg-[#0f2027] text-[#c89211] rounded-full shrink-0 mt-0.5">
                                            <ArrowRight size={16} weight="bold" />
                                        </div>
                                        <div>
                                            <h3 className="text-slate-900 font-bold text-base leading-snug">Application Note</h3>
                                            <p className="text-slate-600 text-sm font-normal mt-1 leading-normal">
                                                All formal applications must be submitted through the Cannoga College online portal during the official application periods.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Secondary Liftups */}
                            <div className="grid sm:grid-cols-2 gap-6 mb-16 pt-8 border-t border-slate-200">
                                <Link href="/admissions" className="group block p-6 border border-slate-200 hover:border-black transition-all text-black no-underline">
                                    <h3 className="font-bold text-lg mb-2">Bachelor&apos;s Admissions</h3>
                                    <p className="text-sm text-slate-600 mb-4 font-normal">Explore undergraduate programmes and admission requirements.</p>
                                    <span className="flex items-center gap-1 text-[#0f2027] font-bold uppercase tracking-widest text-xs group-hover:translate-x-1 transition-transform">Read more <ArrowRight size={14} weight="bold" /></span>
                                </Link>
                                <Link href="/admissions" className="group block p-6 border border-slate-200 hover:border-black transition-all text-black no-underline">
                                    <h3 className="font-bold text-lg mb-2">Master&apos;s Admissions</h3>
                                    <p className="text-sm text-slate-600 mb-4 font-normal">Find information on graduate programs and how to apply.</p>
                                    <span className="flex items-center gap-1 text-[#0f2027] font-bold uppercase tracking-widest text-xs group-hover:translate-x-1 transition-transform">Read more <ArrowRight size={14} weight="bold" /></span>
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
