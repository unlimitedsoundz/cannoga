
import { Link } from '@/components/ui/Link';
import Image from 'next/image';
import { CaretRight, Envelope, Phone, MapPin, ShareNetwork, ArrowRight } from "@phosphor-icons/react/dist/ssr";
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
                                <h2 className="text-xs uppercase tracking-widest text-black mb-8 px-4">Admission Services</h2>
                                <ul className="space-y-1">
                                    <li>
                                         <Link href="/admissions" className="block py-2 px-4 text-black hover:opacity-70 transition-opacity">
                                             Study at Cannoga
                                         </Link>
                                    </li>
                                    <li>
                                        <Link href="/schools" className="block py-2 px-4 text-black hover:opacity-70 transition-opacity">
                                            Degree programmes
                                        </Link>
                                    </li>
                                    <li>
                                        <div>
                                            <Link href="/admissions" className="flex items-center justify-between py-2 px-4 text-black">
                                                How to apply
                                                <CaretRight size={14} className="rotate-90" />
                                            </Link>
                                            <ul className="mt-1 space-y-1">
                                                <li>
                                                    <Link href="/admissions/contact-information/" className="block py-2 px-8 text-black">
                                                        Contact Admission Services
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li>
                                        <Link href="/admissions" className="block py-2 px-4 text-black hover:opacity-70 transition-opacity">
                                            Events for applicants
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="https://ourblogs.cannogacollege.ca" target="_blank" className="block py-2 px-4 text-black hover:opacity-70 transition-opacity">
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
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-6 leading-tight">
                                    Contact Information for Cannoga College Admission Services
                                </h1>
                                <p className="text-xl text-black leading-relaxed max-w-3xl">
                                    You can contact Cannoga College Admission Services by email or by phone during our customer service hours. If your inquiry concerns a specific study programme, please include the name of the programme in the subject line of your message.
                                </p>
                            </div>

                            {/* Hero Image */}
                            <div className="mb-16">
                                <div className="rounded-2xl overflow-hidden aspect-[21/9] shadow-2xl relative group mb-4">
                                    <Image 
                                        src="/images/Cannoga College Campus MAp.png" 
                                        alt="Cannoga College Campus Map" 
                                        width={1600}
                                        height={900}
                                        className="w-full h-full object-cover object-top"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                                </div>
                                <div className="text-[11px] text-black font-medium px-1">
                                    Photo: Cannoga College Campus, Ottawa
                                </div>
                            </div>

                            {/* Actions / Buttons */}
                            <div className="bg-neutral-50 rounded-2xl p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="text-center md:text-left">
                                    <h2 className="text-2xl font-bold mb-2">Admission Services</h2>
                                    <p className="text-black font-medium">Explore our comprehensive application instructions and deadlines.</p>
                                </div>
                                <Link href="/admissions" className="underline bg-[#9c27b3] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm whitespace-nowrap hover:bg-neutral-800 transition-all shadow-xl shadow-black/10">Application Instructions</Link>
                            </div>

                            {/* Contact Details Grid */}
                            <div className="grid md:grid-cols-2 gap-12 mb-16">
                                
                                {/* Left: Ask about applying */}
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-6">Ask about applying</h2>
                                        <div className="space-y-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold uppercase tracking-widest text-black mb-1">Email</span>
                                                 <a href="mailto:admissions@cannogacollege.ca" className="text-black font-semibold text-lg hover:underline underline-offset-4">admissions@cannogacollege.ca</a>
                                            </div>
                                            <div className="flex flex-col gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold uppercase tracking-widest text-black mb-1">Ottawa, Ontario, Canada resident enquiries</span>
                                                    <a href="tel:+3580942721884" className="inline-flex items-center gap-2 text-black font-semibold text-base underline underline-offset-4 hover:opacity-80 transition-opacity">
                                                        <Phone size={18} weight="fill" />
                                                         Talk to Cannoga
                                                    </a>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold uppercase tracking-widest text-black mb-1">Admissions office International students only</span>
                                                    <a href="tel:+15026865522" className="inline-flex items-center gap-2 text-black font-semibold text-base underline underline-offset-4 hover:opacity-80 transition-opacity">
                                                        <Phone size={18} weight="fill" />
                                                        Talk to Admissions
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl p-6 shadow-sm">
                                        <h3 className="font-bold mb-4 uppercase tracking-widest text-xs">Telephone service hours (UTC +2):</h3>
                                         <ul className="space-y-2 text-sm text-black font-medium">
                                            <li className="flex justify-between items-center gap-4"><div className="flex items-center gap-2"><ArrowRight size={16} weight="bold" className="text-black" /><span>Mon</span></div> <span>12:30 pm – 2:00 pm</span></li>
                                            <li className="flex justify-between items-center gap-4"><div className="flex items-center gap-2"><ArrowRight size={16} weight="bold" className="text-black" /><span>Tue</span></div> <span>9:30 am – 11:00 am</span></li>
                                            <li className="flex justify-between items-center gap-4"><div className="flex items-center gap-2"><ArrowRight size={16} weight="bold" className="text-black" /><span>Wed</span></div> <span>9:30 am – 11:00 am</span></li>
                                            <li className="flex justify-between items-center gap-4"><div className="flex items-center gap-2"><ArrowRight size={16} weight="bold" className="text-black" /><span>Thu</span></div> <span>9:30 am – 11:00 am</span></li>
                                            <li className="flex justify-between items-center gap-4 font-bold text-black"><div className="flex items-center gap-2"><ArrowRight size={16} weight="bold" className="text-black" /><span>Fri</span></div> <span>Closed</span></li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Right: Address Info */}
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-6">Where to reach us</h2>
                                        <div className="space-y-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold uppercase tracking-widest text-black mb-2">Campus Address</span>
                                                <p className="text-black leading-relaxed pl-4">
                                                    Cannoga College – Ottawa campus<br />
                                                    81 Montreal Rd,<br />
                                                    K1L 6E8 Ottawa, Ontario, Canada
                                                </p>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold uppercase tracking-widest text-black mb-2">Mailing Address</span>
                                                <p className="text-black leading-relaxed pl-4">
                                                    Cannoga College – Ottawa campus<br />
                                                    81 Montreal Rd,<br />
                                                    K1L 6E8 Ottawa, Ontario, Canada
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#9c27b3] rounded-xl p-6 text-white text-center">
                                        <p className="text-xs font-bold uppercase tracking-widest mb-4 text-white/60">Application Note</p>
                                        <p className="text-sm leading-relaxed">
                                            All formal applications must be submitted through the Cannoga College online portal during the official application periods.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Secondary Liftups */}
                            <div className="grid sm:grid-cols-2 gap-6 mb-16">
                                <Link href="/admissions/bachelor" className="group block bg-neutral-100 rounded-xl p-6 pb-2 transition-all hover:bg-neutral-200 text-black">
                                    <h3 className="font-bold text-lg mb-2">Bachelor's Admissions</h3>
                                    <p className="text-sm text-black mb-4 font-medium">Explore undergraduate programmes and admission requirements.</p>
                                    <span className="flex items-center gap-1 text-black font-bold uppercase tracking-widest text-[10px] group-hover:translate-x-1 inline-block transition-transform">Read more <ArrowRight size={12} weight="bold" /></span>
                                </Link>
                                <Link href="/admissions/master" className="group block bg-neutral-100 rounded-xl p-6 pb-2 transition-all hover:bg-neutral-200 text-black">
                                    <h3 className="font-bold text-lg mb-2">Master's Admissions</h3>
                                    <p className="text-sm text-black mb-4 font-medium">Find information on graduate programs and how to apply.</p>
                                    <span className="flex items-center gap-1 text-black font-bold uppercase tracking-widest text-[10px] group-hover:translate-x-1 inline-block transition-transform">Read more <ArrowRight size={12} weight="bold" /></span>
                                </Link>
                            </div>

                            {/* Bottom Metadata */}
                            <div className="pt-8 flex items-center justify-between">
                                <div className="text-[10px] uppercase font-bold tracking-widest text-black">
                                    Updated: 17.04.2026 | Published: 04.09.2024
                                </div>
                                <div className="flex items-center gap-4 text-black">
                                    <span className="text-[10px] uppercase font-bold tracking-widest">Share</span>
                                    <div className="flex gap-2">
                                        <ShareNetwork size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}


