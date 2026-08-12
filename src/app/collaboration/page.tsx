import { Link } from "@aalto-dx/react-components";
import Image from 'next/image';
import { ArrowRight, Handshake, Lightbulb, Buildings, Users } from '@phosphor-icons/react/dist/ssr';

import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SchemaLD } from '@/components/seo/SchemaLD';

export const metadata = {
    title: 'Industry Collaborations & Strategic Partnerships — Cannoga College',
    description: 'Partner with Cannoga College on commercial research, internships, knowledge transfer programs, and local innovations.',
    alternates: {
        canonical: 'https://cannogacollege.ca/collaboration/',
    },
};

export default function CollaborationPage() {
    return (
        <div className="min-h-screen bg-white text-black font-sans">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Collaboration', item: '/collaboration' }
            ]} />

            <SchemaLD data={{
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Collaboration & Partnerships at Cannoga College",
                "url": "https://cannogacollege.ca/collaboration",
                "description": "Information on industry partnerships, collaborative research, and corporate training at Cannoga College."
            }} />

            {/* HERO SECTION */}
            <section className="text-black overflow-hidden" style={{ backgroundColor: '#0EA5E9' }}>
                <div className="container mx-auto flex flex-col lg:flex-row items-center gap-2 lg:gap-16 pt-0 md:pt-12 pb-12 lg:pb-0 h-auto lg:h-[600px] lg:py-0 relative mb-0">
                    {/* Left Content */}
                    <div className="lg:w-1/2 space-y-6 relative z-10 flex flex-col justify-center h-full pt-2 lg:pt-0 px-4 md:px-0 text-left">
                        <h1 className="font-bold leading-[1.1] tracking-tight pt-2 text-black uppercase" style={{ fontSize: '40px' }}>
                            Partner with Cannoga College
                        </h1>
                        <p className="text-[21px] text-black max-w-xl leading-relaxed">
                            Join our network of global industry leaders, research institutions, and dynamic startups. Together, we bridge the gap between academic theory and market-ready solutions.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link href="#contact" className="text-lg font-bold underline underline-offset-8 decoration-black text-black inline-flex items-center gap-2">
                                Partner with Us <ArrowRight size={20} weight="bold" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="lg:w-1/2 h-full w-full relative lg:translate-y-16 z-20 flex justify-center lg:block order-first lg:order-none">
                        <div className="h-full w-full">
                            <div className="relative w-full aspect-square md:aspect-auto lg:w-full lg:h-full bg-neutral-800">
                                <Image
                                    src="/images/about/student-collab.jpg"
                                    alt="Collaboration Hero"
                                    fill
                                    priority
                                    className="object-cover object-top"
                                    sizes="100vw"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">

                {/* Why Partner with Us */}
                <section className="mb-32">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Partner with Us?</h2>
                        <p className="text-lg text-neutral-600 leading-relaxed">
                            Cannoga College offers a dynamic ecosystem where organizations can access top-tier talent, engage agile R&D capabilities, and upskill their workforce.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Talent Pipeline",
                                icon: Users,
                                desc: "Recruit from our diverse pool of highly trained, globally-minded students through internships and direct hiring.",
                                color: "bg-[#9c27b3]"
                            },
                            {
                                title: "Collaborative R&D",
                                icon: Lightbulb,
                                desc: "Leverage our state-of-the-art labs and multidisciplinary faculty to accelerate your innovation cycles.",
                                color: "bg-[#9c27b3]"
                            },
                            {
                                title: "Executive Education",
                                icon: Buildings,
                                desc: "Custom training and lifelong learning programmes designed to keep your workforce competitive.",
                                color: "bg-[#9c27b3]"
                            }
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div key={i} className="bg-neutral-50 p-10 transition-colors duration-300">
                                    <div className={`w-14 h-14 ${item.color} flex items-center justify-center mb-6 text-white`}>
                                        <Icon size={28} weight="fill" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                    <p className="text-neutral-600 leading-relaxed">{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Engagement Models (Image + Text) */}
                <section className="mb-32">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-3xl md:text-4xl font-bold leading-tight">Ways to Engage with the Cannoga Community</h2>
                            <ul className="space-y-6">
                                {[
                                    { title: "Student Enterprise Projects", desc: "Sponsor a project and have teams of students solve your real-world business challenges under faculty supervision." },
                                    { title: "Guest Lectures & Workshops", desc: "Share industry insights, build your brand presence, and inspire the next generation of professionals." },
                                    { title: "Startup Incubation", desc: "Connect with the Cannoga Entrepreneurship Hub to mentor or invest in early-stage student ventures." }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 p-6 bg-white border border-neutral-100">
                                        <div className="mt-1">
                                            <Handshake size={24} className="text-black" weight="fill" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                                            <p className="text-neutral-600">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative h-[600px] w-full overflow-hidden">
                            <Image
                                src="/images/about/student-collab.jpg"
                                alt="Students and industry partners collaborating"
                                fill
                                className="object-cover object-top"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-10">
                                <p className="text-white text-xl font-medium leading-relaxed">
                                    "Our partnership with Cannoga allows us to tap into fresh perspectives while tackling complex engineering challenges."<br />
                                    <span className="text-sm uppercase tracking-widest opacity-80 block mt-4 font-bold">— Tech Innovations Oy</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="scroll-mt-32">
                    <div className="bg-[#9c27b3] text-white p-8 md:p-16 lg:p-24 overflow-hidden relative border-t border-neutral-800">
                        {/* Decorative element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-screen filter blur-[100px] opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>

                        <div className="grid lg:grid-cols-2 gap-16 relative z-10">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-bold mb-6">Start the Conversation</h2>
                                <p className="text-lg text-neutral-400 mb-10 leading-relaxed max-w-md">
                                    Whether you’re looking to recruit, research, or train, our Corporate Relations team is ready to design a tailored partnership model that meets your strategic goals.
                                </p>
                                <div className="space-y-2">
                                    <p className="font-bold text-xl">Corporate Relations Office</p>
                                    <a href="mailto:partnerships@cannogacollege.ca" className="text-white text-lg hover:opacity-70 transition-colors underline">partnerships@cannogacollege.ca</a>
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-xl p-8 border border-white/10">
                                <form className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2">First Name</label>
                                            <input type="text" className="w-full bg-white/10 border border-white/20 p-4 text-white focus:outline-none focus:border-white transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2">Last Name</label>
                                            <input type="text" className="w-full bg-white/10 border border-white/20 p-4 text-white focus:outline-none focus:border-white transition-colors" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2">Organization</label>
                                        <input type="text" className="w-full bg-white/10 border border-white/20 p-4 text-white focus:outline-none focus:border-white transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2">Work Email</label>
                                        <input type="email" className="w-full bg-white/10 border border-white/20 p-4 text-white focus:outline-none focus:border-white transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2">Area of Interest</label>
                                        <select className="w-full bg-[#1a1a1a] border border-white/20 p-4 text-white focus:outline-none focus:border-white transition-colors appearance-none">
                                            <option>Recruitment & Talent</option>
                                            <option>Joint Research & Development</option>
                                            <option>Executive Education</option>
                                            <option>Startup Incubation or Investment</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <button type="button" className="w-full bg-white text-black font-bold uppercase tracking-widest py-5 hover:bg-neutral-200 transition-colors mt-4">
                                        Request Partnership Info
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}


