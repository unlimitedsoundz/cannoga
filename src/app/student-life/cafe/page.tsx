
import Image from 'next/image';
import { Link } from "@aalto-dx/react-components";
import { ForkKnife as Utensils, Clock, MapPin, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Hero } from '@/components/layout/Hero';

export const metadata = {
    title: 'Campus Dining & Café Operations',
    description: 'Check menus, dietary details, student pricing, and opening hours for the Campus dining room.',
    alternates: {
        canonical: 'https://cannogacollege.ca/student-life/cafe/',
    },
};

export default function CafePage() {
    return (
        <div className="min-h-screen bg-white font-sans text-black leading-relaxed">
            <Hero
                title="Campus Cafe"
                body="A cozy sanctuary for student nourishment, artisanal coffee, and collaborative moments."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                breadcrumbs={[
                    { label: 'Student Life', href: '/student-life' },
                    { label: 'Campus Cafe' }
                ]}
                image={{
                    src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop",
                    alt: "Campus Cafe Atmosphere"
                }}
            >
                <div className="flex flex-wrap gap-4">
                    <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded-none">
                        Campus Dining & Social
                    </span>
                </div>
            </Hero>

            {/* Quick Info Bar */}
            <section className="border-b border-neutral-100 py-6 bg-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap gap-8 md:gap-16">
                        <div className="flex items-center gap-3">
                            <Clock className="text-black" size={20} weight="regular" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-black leading-none mb-1">Opening Hours</p>
                                <p className="text-sm font-bold text-black">Mon–Fri: 08:30 16:30</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Utensils className="text-black" size={20} weight="regular" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-black leading-none mb-1">Lunch Service</p>
                                <p className="text-sm font-bold text-black">Daily: 11:00 14:00</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="text-black" size={20} weight="regular" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-black leading-none mb-1">Location</p>
                                <p className="text-sm font-bold text-black">Main Campus, South Wing</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Menu Concept Section */}
            <section className="py-20 md:py-32 bg-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative aspect-[4/5] rounded-none overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop"
                                alt="Coffee and Pastries"
                                fill
                                className="object-cover object-top"
                            />
                        </div>
                        <div className="space-y-8">
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-black">
                                Curated Flavors, <br />
                                <span className="text-black opacity-40">Locally Sourced</span>
                            </h2>
                            <p className="text-lg text-black leading-relaxed font-light">
                                Our daily menu is crafted with seasonally fresh ingredients from local suppliers. We believe that good food fuels great minds, focusing on nutritious, sustainable, and hearty meals.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-4 text-black">
                                <div>
                                    <h4 className="font-black text-sm uppercase tracking-widest mb-4">Daily Brunch</h4>
                                    <p className="text-sm text-black font-light">Organic sourdough, seasonal fruits, and our signature avocado tartines.</p>
                                </div>
                                <div>
                                    <h4 className="font-black text-sm uppercase tracking-widest mb-4">Artisan Roast</h4>
                                    <p className="text-sm text-black font-light">Direct trade beans roasted locally in small batches. Expertly pulled espresso.</p>
                                </div>
                            </div>
                            <div className="pt-6">
                                <Link href="#" className="inline-flex items-center gap-4 py-4 px-8 bg-[#0a151a] text-white text-xs font-black uppercase tracking-widest hover:bg-neutral-800 transition-all rounded-none">
                                    View Weekly Menu <ArrowRight size={16} weight="bold" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Atmosphere Section */}
            <section className="py-20 bg-neutral-50 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 text-black">Your Cozy Corner on Campus</h2>
                        <p className="text-lg text-black font-light">
                            Whether you're finishing a thesis, meeting for a group project, or simply finding a moment of calm our space is designed for comfort and connection.
                        </p>
                    </div>
 
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="group relative h-[400px] overflow-hidden rounded-none cursor-pointer">
                            <Image
                                src="/images/academic-guidance.jpg"
                                alt="Silent Study"
                                fill
                                className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-[#0a151a]/40 group-hover:bg-[#0a151a]/20 transition-colors" />
                            <div className="absolute bottom-6 left-6">
                                <h4 className="text-white font-black uppercase tracking-widest text-sm">Silent Study</h4>
                            </div>
                        </div>
                        <div className="group relative h-[400px] overflow-hidden rounded-none cursor-pointer">
                            <Image
                                src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=800&auto=format&fit=crop"
                                alt="Lounge Area"
                                fill
                                className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-[#0a151a]/40 group-hover:bg-[#0a151a]/20 transition-colors" />
                            <div className="absolute bottom-6 left-6">
                                <h4 className="text-white font-black uppercase tracking-widest text-sm">Lounge Soft Seating</h4>
                            </div>
                        </div>
                        <div className="group relative h-[400px] overflow-hidden rounded-none cursor-pointer">
                            <Image
                                src="/images/hospitality-tourism.jpg"
                                alt="Summer Terrace"
                                fill
                                className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-[#0a151a]/40 group-hover:bg-[#0a151a]/20 transition-colors" />
                            <div className="absolute bottom-6 left-6">
                                <h4 className="text-white font-black uppercase tracking-widest text-sm">Summer Terrace</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Catering Section */}
            <section className="py-20 md:py-32 bg-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="bg-[#0a151a] text-white p-8 md:p-20 rounded-none relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
                            <Image
                                src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop"
                                alt="Catering Service"
                                fill
                                className="object-cover object-top opacity-50 contrast-125"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent" />
                        </div>
 
                        <div className="relative z-10 max-w-xl">
                            <div className="text-white opacity-40 mb-8 font-black uppercase tracking-widest text-xs">
                                <span>Events & Gatherings</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-8">
                                Exceptional Catering for Your Projects
                            </h2>
                            <p className="text-lg text-white opacity-70 font-light mb-10 leading-relaxed">
                                From intimate academic seminars to large-scale conferences and faculty events. We provide elegant, professional catering tailored to your specific requirements.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/contact/" className="py-4 px-10 bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-neutral-200 transition-all rounded-none text-center">
                                    Request Proposal
                                </Link>
                                <Link href="#" className="py-4 px-10 border border-white/20 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all rounded-none text-center">
                                    Catering Menu
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}


