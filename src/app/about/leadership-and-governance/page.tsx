'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Hero } from "@/components/layout/Hero";
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SchemaLD } from '@/components/seo/SchemaLD';
import GuideSidebarLayout from "@/components/layout/StudentGuideLayout";
import { ArrowUpRight, CaretDown, CaretUp, EnvelopeSimple, Phone, Users, ShieldCheck, TreeStructure } from '@phosphor-icons/react';
import { Link } from '@/components/ui/Link';

const sections = [
    {
        header: { label: 'About Cannoga College', linkComponentProps: { href: '/about' } },
        links: [
            { label: 'Our Story', linkComponentProps: { href: '/about' } },
            { label: 'Welcome from the President', linkComponentProps: { href: '/about/welcome-from-the-president' } },
            { label: 'Leadership & Governance', linkComponentProps: { href: '/about/leadership-and-governance' } },
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
        name: "DR. ATAMAN AVDAN",
        image: "/images/president-luke-schaffner.jpg",
    },
    {
        name: "DR. DAVE MCHARDY",
        image: "/images/collins-huang.jpg",
    },
    {
        name: "STEPHANE DESEAU",
        image: "/images/chinaza-kamisiyochukwu.jpg",
    },
    {
        name: "RACHEL MOENS",
        image: "/images/student-story-2.jpg",
    },
    {
        name: "JANINA M. KON",
        image: "/images/student-story-4.jpg",
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
            { name: "Dr. Karen Veltman", title: "Vice President, Academic & Provost", credential: "Ph.D., M.Sc.", email: "provost@cannogacollege.ca" },
            { name: "Marc Tremblay", title: "Vice President, Finance & Administration", credential: "CPA, MBA", email: "finance@cannogacollege.ca" },
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
                                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                    {/* Bottom dark gradient overlay for text legibility */}
                                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

                                    {/* Bottom text and diagonal arrow */}
                                    <div className="absolute inset-x-0 bottom-0 p-3.5 flex items-end justify-between z-10 text-white">
                                        <h3 className="font-black text-xs sm:text-sm tracking-wider uppercase leading-tight max-w-[75%] drop-shadow-sm font-sans">
                                            {gov.name}
                                        </h3>
                                        <div className="shrink-0 mb-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                                            <ArrowUpRight size={26} weight="bold" className="text-white" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 3: Senior Administration Accordions */}
                    <section id="senior-administration" className="scroll-mt-32 space-y-6">
                        <div className="border-b-2 border-[#0a151a] pb-4">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0a151a] uppercase tracking-tight">
                                SENIOR ADMINISTRATION
                            </h2>
                        </div>

                        <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
                            {SENIOR_ADMIN_DATA.map((dept) => {
                                const isOpen = !!openAccordions[dept.id];
                                return (
                                    <div key={dept.id} className="py-2">
                                        <button
                                            onClick={() => toggleAccordion(dept.id)}
                                            className="w-full flex items-center justify-between py-4 text-left font-bold text-lg md:text-xl text-[#0a151a] hover:text-[#c89211] transition-colors focus:outline-none"
                                            aria-expanded={isOpen}
                                        >
                                            <span className="flex items-center gap-3">
                                                <span className="text-xs font-mono font-normal text-slate-500">
                                                    {isOpen ? '—' : '+'}
                                                </span>
                                                {dept.title}
                                            </span>
                                            {isOpen ? (
                                                <CaretUp size={18} weight="bold" />
                                            ) : (
                                                <CaretDown size={18} weight="bold" />
                                            )}
                                        </button>

                                        {isOpen && (
                                            <div className="pb-6 pt-2 pl-6 overflow-x-auto">
                                                <table className="w-full text-left border-collapse text-xs md:text-sm">
                                                    <thead>
                                                        <tr className="border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider text-[11px]">
                                                            <th className="py-2 pr-4">Name</th>
                                                            <th className="py-2 pr-4">Title</th>
                                                            <th className="py-2 pr-4">Academic Credential / Status</th>
                                                            <th className="py-2">Contact</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-neutral-100">
                                                        {dept.staff.map((staff, sIdx) => (
                                                            <tr key={sIdx} className="hover:bg-neutral-50/80 transition-colors">
                                                                <td className="py-3.5 pr-4 font-bold text-[#0a151a] whitespace-nowrap">
                                                                    {staff.name}
                                                                </td>
                                                                <td className="py-3.5 pr-4 text-neutral-700 font-medium">
                                                                    {staff.title}
                                                                </td>
                                                                <td className="py-3.5 pr-4 text-neutral-500 font-mono text-xs">
                                                                    {staff.credential}
                                                                </td>
                                                                <td className="py-3.5 whitespace-nowrap">
                                                                    <a
                                                                        href={`mailto:${staff.email}`}
                                                                        className="font-bold underline text-[#0a151a] hover:text-[#c89211] transition-colors inline-flex items-center gap-1.5"
                                                                    >
                                                                        <EnvelopeSimple size={14} weight="bold" /> Email
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

                    {/* Section 4: Organization Chart */}
                    <section id="org-chart" className="scroll-mt-32 space-y-8">
                        <div className="border-b-2 border-[#0a151a] pb-4">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0a151a] uppercase tracking-tight">
                                ORGANIZATION CHART
                            </h2>
                        </div>

                        <div className="bg-[#0f2027] text-white p-6 sm:p-10 rounded-xl border border-[#1e3a47] shadow-xl">
                            {/* Top Tier: Board */}
                            <div className="flex flex-col items-center">
                                <div className="bg-white text-[#0f2027] px-8 py-4 rounded-md shadow-md font-black text-lg md:text-xl uppercase tracking-tight border-2 border-[#c89211] text-center">
                                    Board of Governors
                                </div>
                                <div className="w-0.5 h-8 bg-[#c89211]"></div>
                                <div className="w-3/4 max-w-2xl h-0.5 bg-[#c89211]"></div>
                            </div>

                            {/* Middle Tier: Branches */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                                {/* Internal Governors */}
                                <div className="bg-[#18313c] p-5 rounded-lg border border-[#2b4c5c] space-y-4">
                                    <div className="flex items-center justify-between border-b border-[#2b4c5c] pb-2">
                                        <h3 className="font-bold text-sm uppercase tracking-wider text-amber-400">
                                            Internal Governor(s)
                                        </h3>
                                        <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-mono">Academic</span>
                                    </div>
                                    <ul className="space-y-2.5 text-xs text-slate-200">
                                        <li className="p-2.5 bg-[#0f2027] rounded border border-slate-700 flex justify-between items-center">
                                            <span>Dr. Luke Schaffner</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">President</span>
                                        </li>
                                        <li className="p-2.5 bg-[#0f2027] rounded border border-slate-700 flex justify-between items-center">
                                            <span>Rachel Woods</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">Faculty</span>
                                        </li>
                                        <li className="p-2.5 bg-[#0f2027] rounded border border-slate-700 flex justify-between items-center">
                                            <span>Lauren Silva</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">Student</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* External Governors */}
                                <div className="bg-[#18313c] p-5 rounded-lg border border-[#2b4c5c] space-y-4">
                                    <div className="flex items-center justify-between border-b border-[#2b4c5c] pb-2">
                                        <h3 className="font-bold text-sm uppercase tracking-wider text-emerald-400">
                                            External Governor(s)
                                        </h3>
                                        <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded font-mono">Industry</span>
                                    </div>
                                    <ul className="space-y-2.5 text-xs text-slate-200">
                                        <li className="p-2.5 bg-[#0f2027] rounded border border-slate-700 flex justify-between items-center">
                                            <span>Dr. Eric Remedi</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">Chair</span>
                                        </li>
                                        <li className="p-2.5 bg-[#0f2027] rounded border border-slate-700 flex justify-between items-center">
                                            <span>Stephane Dubois</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">Vice-Chair</span>
                                        </li>
                                        <li className="p-2.5 bg-[#0f2027] rounded border border-slate-700 flex justify-between items-center">
                                            <span>Elena Rostova</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">Finance</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Board Advisors & Officers */}
                                <div className="bg-[#18313c] p-5 rounded-lg border border-[#2b4c5c] space-y-4">
                                    <div className="flex items-center justify-between border-b border-[#2b4c5c] pb-2">
                                        <h3 className="font-bold text-sm uppercase tracking-wider text-sky-400">
                                            Board Advisor(s)
                                        </h3>
                                        <span className="text-[10px] bg-sky-400/20 text-sky-300 px-2 py-0.5 rounded font-mono">Operations</span>
                                    </div>
                                    <ul className="space-y-2.5 text-xs text-slate-200">
                                        <li className="p-2.5 bg-[#0f2027] rounded border border-slate-700 flex justify-between items-center">
                                            <span>Dr. Karen Veltman</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">Provost</span>
                                        </li>
                                        <li className="p-2.5 bg-[#0f2027] rounded border border-slate-700 flex justify-between items-center">
                                            <span>Marc Tremblay</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">VP Admin</span>
                                        </li>
                                        <li className="p-2.5 bg-[#0f2027] rounded border border-slate-700 flex justify-between items-center">
                                            <span>Nadia Benali</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">Registrar</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </GuideSidebarLayout>
        </div>
    );
}
