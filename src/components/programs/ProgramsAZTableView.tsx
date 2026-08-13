'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
    MagnifyingGlass, 
    SquaresFour, 
    ListBullets, 
    ArrowsDownUp, 
    ArrowRight, 
    CheckCircle, 
    Briefcase, 
    GraduationCap, 
    Globe, 
    CurrencyDollar 
} from '@phosphor-icons/react';

export interface ProgramItem {
    id: string;
    name: string;
    level: 'Certificate' | 'Diploma' | 'Advanced Diploma' | 'Bachelor' | 'Master';
    school: string;
    duration: string;
    credits: number;
    coop: boolean;
    pgwp: boolean;
    tuitionDomestic: string;
    tuitionInternational: string;
    href: string;
    description: string;
}

const programsData: ProgramItem[] = [
    {
        id: 'acc-fin',
        name: 'Accounting & Business Finance',
        level: 'Diploma',
        school: 'School of Business',
        duration: '2 Years',
        credits: 60,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$1,500/yr',
        tuitionInternational: '$2,500/yr',
        href: '/admissions',
        description: 'Comprehensive financial accounting, managerial cost analysis, taxation laws, and ERP software training.'
    },
    {
        id: 'ai-ml',
        name: 'Applied Artificial Intelligence & Machine Learning',
        level: 'Bachelor',
        school: 'School of Technology',
        duration: '4 Years',
        credits: 120,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$2,500/yr',
        tuitionInternational: '$4,000/yr',
        href: '/admissions/bachelor',
        description: 'Advanced neural networks, natural language processing, computer vision, and machine learning deployment in enterprise systems.'
    },
    {
        id: 'arch-tech',
        name: 'Architectural Technology & Building Design',
        level: 'Advanced Diploma',
        school: 'School of Technology',
        duration: '3 Years',
        credits: 90,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$1,500/yr',
        tuitionInternational: '$2,500/yr',
        href: '/admissions',
        description: 'Building Information Modeling (BIM), sustainable architectural drafting, structural codes, and construction project management.'
    },
    {
        id: 'biomed',
        name: 'Biomedical Science & Biotechnology',
        level: 'Bachelor',
        school: 'School of Health & Life Sciences',
        duration: '4 Years',
        credits: 120,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$2,500/yr',
        tuitionInternational: '$4,000/yr',
        href: '/admissions/bachelor',
        description: 'Molecular biology, genetic engineering, pharmaceutical manufacturing, and bio-laboratory research methods.'
    },
    {
        id: 'mba',
        name: 'Business Administration & Executive Leadership (MBA)',
        level: 'Master',
        school: 'School of Business',
        duration: '2 Years',
        credits: 60,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$3,500/yr',
        tuitionInternational: '$6,000/yr',
        href: '/admissions/master',
        description: 'Strategic management, corporate finance, global supply chain leadership, and capstone consulting projects.'
    },
    {
        id: 'civil-eng',
        name: 'Civil & Structural Engineering Technology',
        level: 'Advanced Diploma',
        school: 'School of Technology',
        duration: '3 Years',
        credits: 90,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$1,500/yr',
        tuitionInternational: '$2,500/yr',
        href: '/admissions',
        description: 'Infrastructure design, soil mechanics, environmental hydrology, CAD structural modeling, and surveying.'
    },
    {
        id: 'cs-se',
        name: 'Computer Science & Software Engineering',
        level: 'Master',
        school: 'School of Technology',
        duration: '2 Years',
        credits: 60,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$3,500/yr',
        tuitionInternational: '$6,000/yr',
        href: '/admissions/master',
        description: 'Distributed systems, cloud computing infrastructure, algorithm optimization, and software architecture thesis.'
    },
    {
        id: 'cybersec',
        name: 'Cybersecurity Operations & Network Defense',
        level: 'Certificate',
        school: 'School of Technology',
        duration: '1 Year',
        credits: 30,
        coop: false,
        pgwp: true,
        tuitionDomestic: '$1,500/yr',
        tuitionInternational: '$2,500/yr',
        href: '/admissions',
        description: 'Ethical hacking, threat intelligence, penetration testing, network firewalls, and incident response management.'
    },
    {
        id: 'digital-mktg',
        name: 'Digital Marketing & Brand Communications',
        level: 'Diploma',
        school: 'School of Business',
        duration: '2 Years',
        credits: 60,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$1,500/yr',
        tuitionInternational: '$2,500/yr',
        href: '/admissions',
        description: 'SEO/SEM strategies, social media analytics, content creation, brand positioning, and digital ad campaign management.'
    },
    {
        id: 'ece',
        name: 'Early Childhood Education & Child Development',
        level: 'Diploma',
        school: 'School of Education & Social Sciences',
        duration: '2 Years',
        credits: 60,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$1,500/yr',
        tuitionInternational: '$2,500/yr',
        href: '/admissions',
        description: 'Child psychology, inclusive curriculum planning, early learning regulations, and supervised field placements.'
    },
    {
        id: 'env-sci',
        name: 'Environmental Science & Resource Sustainability',
        level: 'Bachelor',
        school: 'School of Science',
        duration: '4 Years',
        credits: 120,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$2,500/yr',
        tuitionInternational: '$4,000/yr',
        href: '/admissions/bachelor',
        description: 'Climate change modeling, renewable energy systems, environmental policy analysis, and ecological field research.'
    },
    {
        id: 'graphic-ux',
        name: 'Graphic Design & User Experience (UX)',
        level: 'Diploma',
        school: 'School of Arts & Design',
        duration: '2 Years',
        credits: 60,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$1,500/yr',
        tuitionInternational: '$2,500/yr',
        href: '/admissions',
        description: 'User interface design, Figma prototyping, typography, visual branding, and interactive digital portfolio development.'
    },
    {
        id: 'health-admin',
        name: 'Health Care Administration & Clinical Management',
        level: 'Master',
        school: 'School of Health & Life Sciences',
        duration: '2 Years',
        credits: 60,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$3,500/yr',
        tuitionInternational: '$6,000/yr',
        href: '/admissions/master',
        description: 'Healthcare economics, hospital operations, public health policy, biostatistics, and medical informatics leadership.'
    },
    {
        id: 'hosp-mgt',
        name: 'Hospitality & International Tourism Management',
        level: 'Diploma',
        school: 'School of Hospitality',
        duration: '2 Years',
        credits: 60,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$1,500/yr',
        tuitionInternational: '$2,500/yr',
        href: '/admissions',
        description: 'Hotel operations, international event management, culinary administration, and hospitality guest relations.'
    },
    {
        id: 'mech-eng',
        name: 'Mechanical Engineering & Autonomous Robotics',
        level: 'Bachelor',
        school: 'School of Technology',
        duration: '4 Years',
        credits: 120,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$2,500/yr',
        tuitionInternational: '$4,000/yr',
        href: '/admissions/bachelor',
        description: 'Thermodynamics, mechatronics robotics, CAD design, fluid dynamics, and manufacturing process automation.'
    },
    {
        id: 'nursing',
        name: 'Practical Nursing & Healthcare Care',
        level: 'Diploma',
        school: 'School of Health & Life Sciences',
        duration: '2 Years',
        credits: 60,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$1,500/yr',
        tuitionInternational: '$2,500/yr',
        href: '/admissions',
        description: 'Anatomy, pharmacology, clinical patient care, health assessment, and clinical hospital practicum placements.'
    },
    {
        id: 'public-policy',
        name: 'Public Policy, Governance & International Affairs',
        level: 'Master',
        school: 'School of Education & Social Sciences',
        duration: '2 Years',
        credits: 60,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$3,500/yr',
        tuitionInternational: '$6,000/yr',
        href: '/admissions/master',
        description: 'Canadian governance structures, international diplomacy, policy analysis, economic evaluation, and legislative studies.'
    },
    {
        id: 'soft-dev',
        name: 'Software Development & Full-Stack Web Technologies',
        level: 'Diploma',
        school: 'School of Technology',
        duration: '2 Years',
        credits: 60,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$1,500/yr',
        tuitionInternational: '$2,500/yr',
        href: '/admissions',
        description: 'JavaScript/TypeScript, React, Node.js, relational databases, cloud APIs, and Agile software development lifecycle.'
    }
];

export function ProgramsAZTableView() {
    const [search, setSearch] = useState('');
    const [selectedLevel, setSelectedLevel] = useState<string>('All');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [sortAsc, setSortAsc] = useState<boolean>(true);

    const levels = ['All', 'Certificate', 'Diploma', 'Advanced Diploma', 'Bachelor', 'Master'];

    const filteredPrograms = useMemo(() => {
        return programsData
            .filter(p => {
                const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                                      p.school.toLowerCase().includes(search.toLowerCase()) ||
                                      p.description.toLowerCase().includes(search.toLowerCase());
                const matchesLevel = selectedLevel === 'All' || p.level === selectedLevel;
                return matchesSearch && matchesLevel;
            })
            .sort((a, b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    }, [search, selectedLevel, sortAsc]);

    return (
        <div className="space-y-8">
            {/* Header Controls Bar */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-black flex items-center gap-2">
                            <GraduationCap size={24} className="text-[#0a151a]" />
                            Programs Directory (A-Z)
                        </h3>
                        <p className="text-xs text-neutral-500 font-medium mt-1">
                            Browse all accredited degrees, diplomas, and certificates offered at Cannoga College in Ottawa.
                        </p>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center gap-2 bg-neutral-100 p-1.5 rounded-xl self-start md:self-auto">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                                viewMode === 'table' ? 'bg-[#0a151a] text-white shadow-sm' : 'text-neutral-600 hover:text-black'
                            }`}
                        >
                            <ListBullets size={16} weight="bold" />
                            Table View
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                                viewMode === 'grid' ? 'bg-[#0a151a] text-white shadow-sm' : 'text-neutral-600 hover:text-black'
                            }`}
                        >
                            <SquaresFour size={16} weight="bold" />
                            Grid View
                        </button>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-4 border-t border-neutral-100">
                    {/* Search Input */}
                    <div className="md:col-span-5 relative">
                        <MagnifyingGlass size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search programs by title, school, or keyword..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs md:text-sm font-medium focus:outline-none focus:border-[#0a151a] focus:bg-white transition-all text-black"
                        />
                    </div>

                    {/* Level Filter Pills */}
                    <div className="md:col-span-5 flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                        {levels.map(lvl => (
                            <button
                                key={lvl}
                                onClick={() => setSelectedLevel(lvl)}
                                className={`px-3 py-1.5 text-[11px] font-bold rounded-lg whitespace-nowrap transition-all ${
                                    selectedLevel === lvl 
                                        ? 'bg-[#0a151a] text-white' 
                                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black'
                                }`}
                            >
                                {lvl}
                            </button>
                        ))}
                    </div>

                    {/* Sort Order Button */}
                    <div className="md:col-span-2 flex justify-end">
                        <button
                            onClick={() => setSortAsc(!sortAsc)}
                            className="flex items-center gap-2 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold rounded-xl transition-all w-full justify-center"
                        >
                            <ArrowsDownUp size={14} weight="bold" />
                            <span>Sort {sortAsc ? 'A-Z' : 'Z-A'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Count Bar */}
            <div className="flex items-center justify-between text-xs font-bold text-neutral-500 px-2">
                <span>Showing {filteredPrograms.length} Academic Programs</span>
                <span>Ottawa Campus • PGWP Approved</span>
            </div>

            {/* Table View Mode */}
            {viewMode === 'table' ? (
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-[#0a151a] text-white text-[11px] font-bold uppercase tracking-wider">
                                    <th className="py-4 px-6">Program Name & Overview</th>
                                    <th className="py-4 px-4">Credential Level</th>
                                    <th className="py-4 px-4">School</th>
                                    <th className="py-4 px-4">Duration</th>
                                    <th className="py-4 px-4 text-center">PGWP & Co-op</th>
                                    <th className="py-4 px-4">Tuition (Dom / Intl)</th>
                                    <th className="py-4 px-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 text-xs text-neutral-700">
                                {filteredPrograms.map((p, idx) => (
                                    <tr 
                                        key={p.id} 
                                        className={`hover:bg-neutral-50/80 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/30'}`}
                                    >
                                        <td className="py-5 px-6 max-w-xs">
                                            <span className="font-bold text-sm text-black block mb-1 hover:text-[#0a151a]">
                                                {p.name}
                                            </span>
                                            <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed font-normal">
                                                {p.description}
                                            </p>
                                        </td>
                                        <td className="py-5 px-4 font-semibold text-black">
                                            <span className="inline-block bg-neutral-100 text-neutral-900 border border-neutral-200 px-2.5 py-1 rounded-md text-[11px] font-bold">
                                                {p.level}
                                            </span>
                                        </td>
                                        <td className="py-5 px-4 font-medium text-neutral-600">
                                            {p.school}
                                        </td>
                                        <td className="py-5 px-4 font-bold text-black whitespace-nowrap">
                                            {p.duration}
                                            <span className="block text-[10px] font-medium text-neutral-400">({p.credits} Credits)</span>
                                        </td>
                                        <td className="py-5 px-4 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                {p.pgwp && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                                                        <CheckCircle size={12} weight="fill" className="text-emerald-600" />
                                                        PGWP
                                                    </span>
                                                )}
                                                {p.coop && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full">
                                                        <Briefcase size={12} weight="fill" className="text-blue-600" />
                                                        Co-op
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-5 px-4 font-semibold text-black whitespace-nowrap">
                                            <span className="text-black font-bold block">{p.tuitionDomestic}</span>
                                            <span className="text-neutral-500 text-[10px] block font-normal">{p.tuitionInternational} intl</span>
                                        </td>
                                        <td className="py-5 px-6 text-right whitespace-nowrap">
                                            <Link 
                                                href={p.href}
                                                className="inline-flex items-center gap-1.5 bg-[#0a151a] hover:bg-neutral-800 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm no-underline"
                                            >
                                                Apply <ArrowRight size={12} weight="bold" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Grid View Mode */
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPrograms.map(p => (
                        <div 
                            key={p.id}
                            className="bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md hover:border-neutral-300 p-6 flex flex-col justify-between transition-all"
                        >
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <span className="bg-[#0a151a] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                                        {p.level}
                                    </span>
                                    <span className="text-xs font-bold text-neutral-500">
                                        {p.duration} ({p.credits} cr)
                                    </span>
                                </div>
                                <h4 className="font-bold text-base text-black mb-2 leading-snug">
                                    {p.name}
                                </h4>
                                <p className="text-xs text-neutral-500 font-medium mb-4 line-clamp-3 leading-relaxed">
                                    {p.description}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-neutral-100 space-y-4">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-neutral-500 font-medium">{p.school}</span>
                                    <span className="font-bold text-black">{p.tuitionDomestic}</span>
                                </div>
                                <div className="flex items-center justify-between gap-2 pt-1">
                                    <div className="flex items-center gap-1.5">
                                        {p.pgwp && (
                                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                                                PGWP
                                            </span>
                                        )}
                                        {p.coop && (
                                            <span className="text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-md">
                                                Co-op
                                            </span>
                                        )}
                                    </div>
                                    <Link 
                                        href={p.href}
                                        className="inline-flex items-center gap-1 text-xs font-bold text-[#0a151a] hover:underline"
                                    >
                                        Apply Details <ArrowRight size={12} weight="bold" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
