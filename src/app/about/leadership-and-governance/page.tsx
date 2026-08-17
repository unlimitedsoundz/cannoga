'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Hero } from "@/components/layout/Hero";
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SchemaLD } from '@/components/seo/SchemaLD';
import GuideSidebarLayout from "@/components/layout/StudentGuideLayout";
import { ArrowUpRight, Plus, Minus } from '@phosphor-icons/react';
import { Link } from '@/components/ui/Link';

const sections = [
    {
        header: { label: 'About Cannoga College', linkComponentProps: { href: '/about' } },
        links: [
            { label: 'Our Story', linkComponentProps: { href: '/about' } },
            { label: 'Welcome from the President', linkComponentProps: { href: '/about/welcome-from-the-president' } },
            { label: 'Leadership & Governance', linkComponentProps: { href: '/about/leadership-and-governance' } },
            { label: 'Innovation', linkComponentProps: { href: '/innovation' } },
            { label: 'News & Events', linkComponentProps: { href: '/news' } },
            { label: 'Research Hub', linkComponentProps: { href: '/research' } },
            { label: 'Careers', linkComponentProps: { href: '/careers' } },
            { label: 'Alumni', linkComponentProps: { href: '/alumni' } },
            { label: 'Contact Us', linkComponentProps: { href: '/contact' } },
        ]
    }
];

const BOARD_OF_GOVERNORS = [
    {
        name: "DR. LUKE SCHAFFNER",
        image: "/images/leadership-luke.jpg",
        objectPosition: "object-[center_20%]",
    },
    {
        name: "BLAKE HIGGELY",
        image: "/images/leadership-blake.jpg",
        objectPosition: "object-top",
    },
    {
        name: "MIKE STUYVESANT",
        image: "/images/leadership-mike.jpg",
        objectPosition: "object-[center_12%]",
    },
    {
        name: "MARGARET SINCLAIR",
        image: "/images/leadership-margaret.jpg",
        objectPosition: "object-[center_20%]",
    },
    {
        name: "CATHERINE BOUCHARD",
        image: "/images/leadership-catherine.jpg",
        objectPosition: "object-[center_25%]",
    },
];

interface AdminStaff {
    name: string;
    title: string;
    credential: string;
    email: string;
}

interface SeniorAdminGroup {
    id: string;
    title: string;
    staff: AdminStaff[];
}

const SENIOR_ADMIN_DATA: SeniorAdminGroup[] = [
    {
        id: 'leadership',
        title: 'Executive Leadership',
        staff: [
            { name: "Dr. Luke Schaffner", title: "President & Chief Executive Officer", credential: "Ph.D., M.Ed.", email: "president@cannogacollege.ca" },
            { name: "Blake Higgely", title: "Vice President, Finance & Administration", credential: "CPA, MBA", email: "finance@cannogacollege.ca" },
            { name: "Mike Stuyvesant", title: "Vice President, Academic & Provost", credential: "Ph.D., M.Sc.", email: "provost@cannogacollege.ca" },
            { name: "Margaret Sinclair", title: "Vice President, External Relations & Advancement", credential: "M.A., B.Comm.", email: "advancement@cannogacollege.ca" },
            { name: "Catherine Bouchard", title: "Vice President, Student Affairs & Experience", credential: "M.Ed., B.A.", email: "studentaffairs@cannogacollege.ca" },
        ]
    },
    {
        id: 'hr',
        title: 'Human Resources & People Culture',
        staff: [
            { name: "Claire Dupont", title: "Director of Human Resources", credential: "CHRL, B.A.", email: "hr@cannogacollege.ca" },
            { name: "Samuel O'Connor", title: "Manager, Talent Acquisition & DEI", credential: "B.Comm.", email: "careers@cannogacollege.ca" },
        ]
    },
    {
        id: 'finance',
        title: 'Finance & Financial Services',
        staff: [
            { name: "Elena Rostova", title: "Director of Financial Planning & Treasury", credential: "CPA, CFA", email: "studentaccounts@cannogacollege.ca" },
            { name: "David Chen", title: "Senior Bursar & Student Accounts Lead", credential: "B.Acc.", email: "bursar@cannogacollege.ca" },
        ]
    },
    {
        id: 'it',
        title: 'Information Technology & Digital Services',
        staff: [
            { name: "Vikram Malhotra", title: "Chief Information Officer", credential: "M.Sc. CS, CISSP", email: "cio@cannogacollege.ca" },
            { name: "Alexandre Roy", title: "Lead, Enterprise Architecture & SIS", credential: "B.Sc. Eng.", email: "ithelpdesk@cannogacollege.ca" },
        ]
    },
    {
        id: 'student-services',
        title: 'Student Services & Campus Life',
        staff: [
            { name: "Ananya Patel", title: "Dean of Student Affairs", credential: "M.A., B.Ed.", email: "studentaffairs@cannogacollege.ca" },
            { name: "Marcus Vance", title: "Director of Residence & Campus Housing", credential: "B.A. Hons.", email: "housing@cannogacollege.ca" },
        ]
    },
    {
        id: 'library',
        title: 'Library & Academic Learning Commons',
        staff: [
            { name: "Judith Fraser", title: "Chief University Librarian", credential: "MLIS, M.A.", email: "library@cannogacollege.ca" },
            { name: "Tariq Mansoor", title: "Academic Research & Learning Commons Lead", credential: "M.Sc.", email: "learningcommons@cannogacollege.ca" },
        ]
    },
    {
        id: 'admissions-marketing',
        title: 'Recruitment, Admissions & Global Engagement',
        staff: [
            { name: "Nadia Benali", title: "Director of International Admissions & Registrar", credential: "M.Ed., B.A.", email: "admissions@cannogacollege.ca" },
            { name: "Gabriel Santos", title: "Associate Registrar & Student Records", credential: "B.A. Admin", email: "registrar@cannogacollege.ca" },
            { name: "Todd Banning", title: "Senior Admissions Advisor", credential: "B.A.", email: "admissions@cannogacollege.ca" },
        ]
    },
];

export default function LeadershipGovernancePage() {
    const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
        leadership: true,
        library: true,
        'admissions-marketing': true,
    });

    const toggleAccordion = (id: string) => {
        setOpenAccordions(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'About Cannoga College', item: '/about' },
                { name: 'Leadership & Governance', item: '/about/leadership-and-governance' }
            ]} />

            <SchemaLD data={{
                "@context": "https://schema.org",
                "@type": "AboutPage",
                "name": "Leadership and Governance | Cannoga College",
                "url": "https://cannogacollege.ca/about/leadership-and-governance/",
                "description": "Board of Governors, Senior Administration and Governance Organization of Cannoga College in Ottawa, Ontario, Canada.",
                "mainEntity": {
                    "@type": "EducationalOrganization",
                    "name": "Cannoga College",
                    "url": "https://cannogacollege.ca"
                }
            }} />

            <Hero
                title="Leadership & Governance"
                body="Meet the Board of Governors, senior administration officers, and academic leaders shaping the strategic vision and institutional excellence of Cannoga College."
                backgroundColor="#0f2027"
                tinted
                lightText={true}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'About', href: '/about' },
                    { label: 'Leadership & Governance' }
                ]}
                image={{
                    src: "/images/about-hero.png",
                    alt: "Cannoga College Ottawa Campus Administration Building"
                }}
            />

            <GuideSidebarLayout sections={sections}>
                <div className="cc-container py-8 md:py-16 space-y-20 max-w-5xl">

                    {/* Section: Leadership */}
                    <section id="leadership" className="scroll-mt-32 space-y-6">
                        <div className="pb-2">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1e3a5f] uppercase tracking-tight font-serif">
                                LEADERSHIP
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {BOARD_OF_GOVERNORS.map((gov, idx) => (
                                <div
                                    key={idx}
                                    className="group relative aspect-square w-full overflow-hidden bg-neutral-100 cursor-pointer"
                                >
                                    <Image
                                        src={gov.image}
                                        alt={gov.name}
                                        fill
                                        className={`object-cover ${gov.objectPosition || 'object-center'}`}
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                    {/* Static dark gradient for text legibility when not hovered */}
                                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-0" />

                                    {/* Wavy green panel - slides up on hover */}
                                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out pointer-events-none z-10">
                                        {/* Wave SVG sitting on top of the panel */}
                                        <svg
                                            viewBox="0 0 400 40"
                                            preserveAspectRatio="none"
                                            className="w-full h-8 text-[#1a6b4a] fill-current block -mb-px"
                                        >
                                            <path d="M0,30 C60,5 120,35 200,20 C280,5 340,35 400,20 V40 H0 Z" />
                                        </svg>
                                        <div className="bg-[#1a6b4a] px-3.5 pt-1 pb-3.5">
                                            <h3 className="font-black text-xs sm:text-sm tracking-wider uppercase leading-tight text-white drop-shadow-sm font-sans">
                                                {gov.name}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Static name (visible when not hovered) */}
                                    <div className="absolute inset-x-0 bottom-0 p-3.5 flex items-end justify-between z-10 text-white group-hover:opacity-0 transition-opacity duration-300">
                                        <h3 className="font-black text-xs sm:text-sm tracking-wider uppercase leading-tight max-w-[75%] drop-shadow-sm font-sans">
                                            {gov.name}
                                        </h3>
                                        <div className="shrink-0 mb-0.5">
                                            <ArrowUpRight size={26} weight="bold" className="text-white" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 3: Senior Administration Accordions - FAQ Style */}
                    <section id="senior-administration" className="scroll-mt-32 space-y-6">
                        <div className="pb-2">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1e3a5f] uppercase tracking-tight font-serif">
                                SENIOR ADMINISTRATION
                            </h2>
                        </div>

                        <div className="w-full space-y-0 border-b-2 border-[#0a151a]">
                            {SENIOR_ADMIN_DATA.map((dept) => {
                                const isOpen = !!openAccordions[dept.id];
                                return (
                                    <div
                                        key={dept.id}
                                        className="border-t-2 border-[#0a151a] bg-white transition-colors"
                                    >
                                        <button
                                            onClick={() => toggleAccordion(dept.id)}
                                            className="w-full flex items-center justify-between py-4 px-1 text-left hover:bg-[#0a151a]/5 transition-colors focus:outline-none group"
                                            aria-expanded={isOpen}
                                        >
                                            <span className="text-base sm:text-lg md:text-xl font-bold text-black pr-4 tracking-tight">
                                                {dept.title}
                                            </span>
                                            <div className="flex-shrink-0 bg-[#0a151a] text-white p-1.5 rounded-none">
                                                {isOpen ? (
                                                    <Minus size={16} weight="bold" />
                                                ) : (
                                                    <Plus size={16} weight="bold" />
                                                )}
                                            </div>
                                        </button>

                                        {isOpen && (
                                            <div className="pb-6 pt-1 px-1 overflow-x-auto">
                                                <table className="w-full text-left border-collapse text-base md:text-lg">
                                                    <thead>
                                                        <tr className="border-b-2 border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-xs sm:text-sm">
                                                            <th className="py-2.5 pr-4">Name</th>
                                                            <th className="py-2.5 pr-4">Title</th>
                                                            <th className="py-2.5 pr-4">Academic Credential / Status</th>
                                                            <th className="py-2.5">Contact</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {dept.staff.map((staff, sIdx) => (
                                                            <tr key={sIdx} className="hover:bg-slate-50 transition-colors">
                                                                <td className="py-3.5 pr-4 text-black font-semibold whitespace-nowrap">
                                                                    {staff.name}
                                                                </td>
                                                                <td className="py-3.5 pr-4 text-slate-700 font-normal">
                                                                    {staff.title}
                                                                </td>
                                                                <td className="py-3.5 pr-4 text-slate-600 font-mono text-sm">
                                                                    {staff.credential}
                                                                </td>
                                                                <td className="py-3.5 whitespace-nowrap">
                                                                    <a
                                                                        href={`mailto:${staff.email}`}
                                                                        className="font-bold underline text-black hover:text-[#c89211] transition-colors text-sm uppercase tracking-wider"
                                                                    >
                                                                        Email
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                </div>
            </GuideSidebarLayout>
        </div>
    );
}
