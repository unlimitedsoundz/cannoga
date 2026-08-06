
import { Link } from "@aalto-dx/react-components";
import Image from 'next/image';
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
    title: 'Available Programs & Studies Directory — Cannoga College',
    description: 'Browse all study fields and formats, from degrees to executive training options, offered at Cannoga College.',
    alternates: {
        canonical: 'https://cannogacollege.ca/studies/',
    },
};

import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { Hero } from '@/components/layout/Hero';
import { Card } from '@/components/ui/Card';

export default function StudiesPage() {
    return (
        <div className="min-h-screen bg-white">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Studies', item: '/studies' }
            ]} />
            {/* Hero */}
            <Hero
                title="Study at Cannoga College"
                body="From undergraduate degrees to executive education, we offer diverse paths for learners at every stage of their journey."
                backgroundColor="#392d56"
                tinted
                lightText={true}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Studies' }
                ]}
            >
                <div className="flex flex-wrap gap-4">
                    <Link href="/admissions" className="text-aalto-3 font-bold underline underline-offset-8 decoration-white text-white inline-flex items-center gap-2" noHover>
                        Apply Now <ArrowRight size={20} weight="bold" />
                    </Link>
                    <Link href="#programmes" className="text-aalto-3 font-bold underline underline-offset-8 decoration-white text-white inline-flex items-center gap-2" noHover>
                        Explore Programmes <ArrowRight size={20} weight="bold" />
                    </Link>
                </div>
            </Hero>

            <div id="programmes" className="container mx-auto py-12 md:py-32">
                <div className="grid md:grid-cols-2 gap-4 md:gap-12">
                    {/* Bachelor's */}
                    <div className="group relative bg-[#9c27b3] overflow-hidden aspect-[4/3] md:aspect-auto md:min-h-[500px]">
                        <div className="absolute inset-0">
                            <Image
                                src="/images/1d68041835324a83583595071e6eb95c.jpg"
                                alt="Bachelor's"
                                fill
                                className="object-cover object-top transition-transform duration-1000 group-hover:scale-105 opacity-60"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#9c27b3] via-[#9c27b3]/20 to-transparent" />
                        </div>
                        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-white">
                            <h2 className="text-aalto-4 font-bold mb-aalto-p2 uppercase tracking-aalto-3">Bachelor's Degrees</h2>
                            <p className="text-aalto-2 text-white mb-8 max-w-md leading-aalto-2">
                                Build a strong foundation in sustainability, business, design, or technology. Our undergraduate programmes combine theory with real-world practice.
                            </p>
                             <Link href="/admissions/bachelor" className="inline-flex items-center gap-3 font-bold uppercase tracking-aalto-3 hover:gap-5 transition-all text-aalto-1 text-white">
                                 View Bachelor's Programmes <ArrowRight size={20} weight="bold" className="align-middle" />
                             </Link>
                        </div>
                    </div>

                    {/* Master's */}
                    <div className="group relative bg-[#9c27b3] overflow-hidden aspect-[4/3] md:aspect-auto md:min-h-[500px]">
                        <div className="absolute inset-0">
                            <Image
                                src="/images/1775945541604-019d7e99-907d-7ab4-82ed-0977a1243bc3.png"
                                alt="Master's"
                                fill
                                className="object-cover object-top transition-transform duration-1000 group-hover:scale-105 opacity-60"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#9c27b3] via-[#9c27b3]/20 to-transparent" />
                        </div>
                        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-white">
                            <h2 className="text-aalto-4 font-bold mb-aalto-p2 uppercase tracking-aalto-3">Master's Degrees</h2>
                            <p className="text-aalto-2 text-white mb-8 max-w-md leading-aalto-2">
                                Deepen your expertise and lead the change. Our graduate programmes are designed for professionals and ambitious researchers.
                            </p>
                             <Link href="/admissions/master" className="inline-flex items-center gap-3 font-bold uppercase tracking-aalto-3 hover:gap-5 transition-all text-aalto-1 text-white">
                                 View Master's Programmes <ArrowRight size={20} weight="bold" className="align-middle" />
                             </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-24">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500 mb-3">Credential Types</p>
                        <h2 className="text-aalto-5 font-bold uppercase tracking-aalto-3">Explore by academic level</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: "Certificate Programs", desc: "Short, career-focused pathways for practical skill-building and fast entry into the workforce.", link: "/degree-programmes#certificates" },
                            { title: "Diploma Programs", desc: "Two-year applied study options with strong industry relevance and project-based learning.", link: "/degree-programmes#diplomas" },
                            { title: "Bachelor's Degrees", desc: "Three-year undergraduate study with a strong foundation in theory, practice and professional readiness.", link: "/degree-programmes#bachelor" },
                            { title: "Master's Degrees", desc: "Advanced postgraduate study for leadership, research and specialist professional roles.", link: "/degree-programmes#master" }
                        ].map((item, i) => (
                            <Card 
                                key={i}
                                title={item.title}
                                body={item.desc}
                                cta={{
                                    label: "Learn more",
                                    linkComponentProps: {
                                        href: item.link
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Additional Study Options */}
                <div className="mt-32">
                    <h2 className="text-aalto-5 font-bold mb-16 text-center uppercase tracking-aalto-3">More Ways to Learn</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Lifelong Learning", desc: "Short courses and professional development modules.", link: "/admissions#lifelong" },
                            { title: "Open University", desc: "Flexible studies open to everyone, regardless of background.", link: "/admissions#online-opportunities" },
                            { title: "Summer School", desc: "Intensive summer courses in Ottawa.", link: "/admissions#summer" }
                        ].map((item, i) => (
                            <Card 
                                key={i}
                                title={item.title}
                                body={item.desc}
                                cta={{
                                    label: "Learn more",
                                    linkComponentProps: {
                                        href: item.link
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

