import { Link } from '@/components/ui/Link';
import Image from 'next/image';
import { EnvelopeSimple, Phone, MapPin, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { InteractiveCampusMap } from '@/components/campus/InteractiveCampusMap';

export const metadata = {
    title: 'Admissions Contact Directory & Inquiry Desk',
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
                    <div className="max-w-4xl mx-auto">
                            
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

                            {/* Interactive Campus Map */}
                            <div className="mb-16">
                                <InteractiveCampusMap />
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
                                     <div>
                                         <h3 className="text-slate-900 font-bold text-base leading-snug">Email</h3>
                                         <a href="mailto:admissions@cannogacollege.ca" className="text-[#0f2027] font-bold underline hover:text-[#c89211] transition-colors text-sm mt-1 block">
                                             admissions@cannogacollege.ca
                                         </a>
                                         <p className="text-slate-600 text-sm font-normal mt-1 leading-normal">
                                             Local residents
                                         </p>
                                     </div>

                                     {/* Talk to Cannoga */}
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
                                     </div>

                                     {/* WhatsApp */}
                                     <div className="space-y-2">
                                         <div>
                                             <h3 className="text-slate-900 font-bold text-base leading-snug">WhatsApp</h3>
                                             <div className="mt-1 space-y-1">
                                                 <p className="text-xs font-bold uppercase tracking-wider text-slate-500">WhatsApp only</p>
                                                 <a
                                                     href="https://wa.me/17822063309"
                                                     target="_blank"
                                                     rel="noopener noreferrer"
                                                     className="text-[#0f2027] font-bold underline hover:text-[#c89211] transition-colors text-sm block"
                                                 >
                                                     WhatsApp: +1 (782) 206-3309
                                                 </a>
                                             </div>
                                         </div>
                                     </div>

                                     {/* Where to reach us */}
                                     <div>
                                         <h3 className="text-slate-900 font-bold text-base leading-snug">Where to reach us</h3>
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 text-sm text-slate-700">
                                             <div>
                                                 <h4 className="font-bold text-slate-900 text-sm">Campus Address</h4>
                                                 <p className="leading-relaxed mt-0.5">
                                                     Cannoga College Ottawa campus<br />
                                                     81 Montreal Rd,<br />
                                                     K1L 6E8 Ottawa, Ontario, Canada
                                                 </p>
                                             </div>
                                             <div>
                                                 <h4 className="font-bold text-slate-900 text-sm">Mailing Address</h4>
                                                 <p className="leading-relaxed mt-0.5">
                                                     Cannoga College Ottawa campus<br />
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
            </main>
        </div>
    );
}
