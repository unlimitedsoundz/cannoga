import Image from 'next/image';
import { Link } from "@aalto-dx/react-components";
import { CTA } from "@aalto-dx/react-modules";
import { Hero } from '@/components/layout/Hero';
import { ArrowRight, Globe, Users, GraduationCap, Heart, Briefcase } from "@phosphor-icons/react/dist/ssr";
import { Card } from '@/components/ui/Card';
import { ContentBox } from '@/components/ui/ContentBox';

export const metadata = {
    title: 'Global Alumni Network & Community — Cannoga College',
    description: 'Stay connected with fellow graduates, explore mentorship roles, join networking events, and access exclusive career services.',
    alternates: {
        canonical: 'https://cannogacollege.ca/alumni/',
    },
};

export default function AlumniPage() {
    const benefits = [
        "Invitations to alumni events, seminars, and professional forums",
        "Career development resources and networking opportunities",
        "Continued access to academic research and institutional initiatives",
        "Opportunities to mentor students and recent graduates",
        "Updates on Cannoga College programs, partnerships, and developments"
    ];

    return (
        <div className="min-h-screen bg-white font-sans leading-relaxed pb-20">
            {/* Hero Section */}
            <Hero
                title="Cannoga Alumni Network"
                body="Empowering a global network of professionals committed to sustainable impact, leadership, and innovation. Graduates become lifelong members of the Cannoga community."
                backgroundColor="#5dd089"
                tinted
                lightText={true}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Alumni' }
                ]}
                image={{
                    src: "/images/alumni-hero.png",
                    alt: "Cannoga Alumni"
                }}
                imagePosition="object-top"
            />

            <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
                <div className="space-y-20">
                    {/* Intro Content */}
                    <section id="intro">
                        <div className="max-w-none">
                            <p className="text-aalto-5 font-bold text-black leading-tight mb-8">
                                The Master’s Alumni of Cannoga College represent a growing global community of professionals who have completed advanced postgraduate studies at the institution.
                            </p>
                            <p className="text-aalto-3 text-black font-medium leading-relaxed max-w-4xl">
                                Our alumni are equipped with strong academic foundations, practical expertise, and a commitment to sustainable impact leadership and innovation. Graduates become lifelong members of the Cannoga alumni community and continue to contribute to positive change across industries and societies.
                            </p>
                        </div>
                    </section>

                    {/* Key Pillars */}
                    <section id="pillars">
                        <div className="grid md:grid-cols-2 gap-8">
                            <ContentBox
                                icon="globe"
                                title="A Global Professional Network"
                                body="Cannoga College Master’s Alumni are active across sustainability, business, technology, education, design, and public policy. This international network strengthens professional collaboration and knowledge exchange."
                            />
                            <ContentBox
                                icon="users"
                                title="Continued Connection"
                                body="At Cannoga College, graduation marks the beginning of an ongoing relationship. Master’s Alumni remain connected through academic engagement, professional initiatives, and collaborative projects."
                            />
                        </div>
                    </section>

                    {/* Benefits List */}
                    <section id="benefits">
                        <ContentBox
                            size="large"
                            icon="briefcase"
                            title="Alumni Benefits & Opportunities"
                            body={
                                <div className="text-left space-y-8">
                                    <p className="text-aalto-2 text-black/70 font-bold leading-relaxed">
                                        Master’s Alumni of Cannoga College have access to continued engagement opportunities that support lifelong growth and connection.
                                    </p>
                                    <ul className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
                                        {benefits.map((benefit, i) => (
                                            <li key={i} className="flex items-start gap-4">
                                                <ArrowRight size={20} weight="bold" className="shrink-0 text-black mt-0.5" />
                                                <span className="text-base font-bold text-black leading-tight">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            }
                        />
                    </section>

                    {/* Impact and CTA */}
                    <section id="impact">
                        <div className="space-y-12">
                            <div className="max-w-4xl">
                                <h2 className="text-aalto-5 font-bold mb-8 text-black tracking-tight">Alumni Impact and Contribution</h2>
                                <p className="text-aalto-2 text-black leading-relaxed font-bold mb-8">
                                    Cannoga College Master’s Alumni play an important role in advancing the institution’s mission and global impact. Through leadership, professional practice, research collaboration, and community engagement, alumni help shape sustainable solutions.
                                </p>
                            </div>

                <CTA
                    title="Cannoga Alumni"
                    body="Stay connected with the Cannoga alumni community. Access exclusive networking opportunities, career resources, and lifelong learning opportunities."
                    cta={{
                        label: "Alumni Portal",
                        linkComponentProps: {
                            href: "/portal",
                        },
                    }}
                />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
