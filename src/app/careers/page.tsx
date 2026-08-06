'use client';

import React from 'react';
import Image from 'next/image';
import { Link } from "@aalto-dx/react-components";
import { Leaf, ArrowRight, Briefcase, Globe, GraduationCap } from '@phosphor-icons/react';
import { CTA } from "@aalto-dx/react-modules";
import { Hero } from '@/components/layout/Hero';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SchemaLD } from '@/components/seo/SchemaLD';
import { Card } from '@/components/ui/Card';
import { ContentBox } from '@/components/ui/ContentBox';
import { Highlight } from '@/components/ui/Highlight';

const positions = [
    {
        title: 'University Lecturer, Engineering & Sustainability',
        type: 'Full-time',
        location: 'Ottawa campus',
        description: 'Leading research and teaching in a multi-disciplinary environment spanning engineering, science, and technology.'
    },
    {
        title: 'Admissions Coordinator',
        type: 'Part-time',
        location: 'Remote / Ottawa',
        description: 'Supporting international students through their application journey at Cannoga College.'
    },
    {
        title: 'IT Support Specialist',
        type: 'Full-time',
        location: 'Ottawa campus',
        description: 'Managing campus infrastructure and supporting our digital learning environment.'
    }
];

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-white text-black font-sans pb-20">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Careers', item: '/careers' }
            ]} />

            <SchemaLD data={{
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Careers at Cannoga College",
                "description": "Explore job opportunities at Cannoga College in Ottawa.",
                "url": "https://cannogacollege.ca/careers"
            }} />

            {positions.map((pos, index) => (
                <SchemaLD key={`schema-${index}`} data={{
                    "@context": "https://schema.org",
                    "@type": "JobPosting",
                    "title": pos.title,
                    "description": pos.description,
                    "datePosted": "2026-02-22",
                    "validThrough": "2026-12-31",
                    "employmentType": pos.type === "Full-time" ? "FULL_TIME" : "PART_TIME",
                    "hiringOrganization": {
                        "@type": "UniversityOrUniversity",
                        "name": "Cannoga College",
                        "sameAs": "https://cannogacollege.ca",
                        "logo": "https://cannogacollege.ca/images/logo-cannoga.png"
                    },
                    "jobLocation": {
                        "@type": "Place",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "81 Montreal Rd",
                            "addressLocality": "Ottawa",
                            "postalCode": "K1L 6E8",
                            "addressCountry": "CA"
                        }
                    }
                }} />
            ))}

            {/* Hero Section */}
            <Hero
                title={<>Work at <br className="hidden md:block" /> Cannoga College</>}
                body="Shape the future of higher education in Ottawa, Ontario, Canada. We're looking for innovators, educators, and leaders to join our world-class faculty and staff."
                backgroundColor="#5dd089"
                tinted
                lightText={true}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Careers' }
                ]}
                image={{
                    src: "/images/careers-hero.png",
                    alt: "Work at Cannoga College"
                }}
            >
                <div className="flex flex-wrap gap-6">
                    <Link href="mailto:careers@cannogacollege.ca" className="text-aalto-3 font-bold underline underline-offset-8 decoration-white text-white inline-flex items-center gap-2" noHover>
                        Send your CV <ArrowRight size={20} weight="bold" />
                    </Link>
                </div>
            </Hero>

            <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
                <div className="space-y-20">
                    {/* Culture Section */}
                    <section id="culture">
                        <ContentBox
                            size="large"
                            icon="briefcase"
                            title="Institutional Culture"
                            body={
                                <div className="space-y-8 text-left">
                                    <p className="text-aalto-2 text-black leading-relaxed font-medium">
                                        Cannoga College is a dynamic and career-focused higher education institution located in Ottawa, Ontario, Canada's capital city.
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="font-bold text-lg mb-2 flex items-center gap-2 uppercase tracking-widest text-xs">
                                                <GraduationCap size={24} weight="bold" /> Multi-Disciplinary
                                            </h4>
                                            <p className="text-sm text-neutral-600 font-bold">A higher education institution focused on arts, science, business, and engineering.</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-2 flex items-center gap-2 uppercase tracking-widest text-xs">
                                                <Globe size={24} weight="bold" /> International Focus
                                            </h4>
                                            <p className="text-sm text-neutral-600 font-bold">A diverse community of students and faculty from over 40 countries.</p>
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </section>

                    {/* Quote Banner */}
                    <section>
                        <Highlight 
                            body="Working here means being part of a team that doesn't just teach the future; we build it. Every day is an opportunity to innovate."
                            source="Dr. Luke Schriffer, Rector"
                            alignment="right"
                        />
                    </section>

                    {/* Job Postings */}
                    <section id="positions">
                        <h2 className="text-aalto-5 font-bold mb-10 text-black tracking-tight">Open Positions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {positions.map((pos, index) => (
                                <Card
                                    key={index}
                                    title={pos.title}
                                    body={pos.description}
                                    cta={{ label: "Apply now", linkComponentProps: { href: "mailto:careers@cannogacollege.ca" } }}
                                />
                            ))}
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section>
                            <CTA
                                title="Ready to apply?"
                                body="If you don't see a position that fits your profile but believe you'd be a great addition to the team, send us an open application."
                                cta={{
                                    label: "Send your CV",
                                    linkComponentProps: {
                                        href: "mailto:careers@cannogacollege.ca",
                                    },
                                }}
                            />
                    </section>
                </div>
            </div>
        </div>
    );
}

