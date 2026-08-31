'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
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
    CurrencyDollar,
    CaretLeft,
    CaretRight,
    CircleNotch
} from '@phosphor-icons/react';

export interface ProgramItem {
    id: string;
    code?: string;
    name: string;
    level: 'Certificate' | 'Diploma' | 'Advanced Diploma' | 'Bachelor';
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

export function getSchoolSlug(schoolName: string): string {
    const s = (schoolName || '').toLowerCase();
    if (s.includes('business')) return 'business';
    if (s.includes('tech') || s.includes('computer')) return 'technology';
    if (s.includes('art') || s.includes('design') || s.includes('film')) return 'arts-design';
    if (s.includes('health') || s.includes('biomed') || s.includes('nursing') || s.includes('kinesiology')) return 'health-sciences';
    if (s.includes('education') || s.includes('social') || s.includes('law') || s.includes('legal')) return 'education-social-sciences';
    if (s.includes('engineer')) return 'engineering';
    return 'science';
}

export function getDeptSlug(progName: string, schoolName: string): string {
    const name = (progName || '').toLowerCase();
    if (name.includes('account') || name.includes('tax') || name.includes('legal') || name.includes('paralegal')) return 'accounting-business-law';
    if (name.includes('ai') || name.includes('artificial') || name.includes('computer') || name.includes('software') || name.includes('cyber') || name.includes('data') || name.includes('web') || name.includes('cloud')) return 'computer-science-digital';
    if (name.includes('archit')) return 'architecture';
    if (name.includes('civil') || name.includes('environ') || name.includes('climate')) return 'civil-environmental';
    if (name.includes('electric') || name.includes('automation')) return 'electrical-electronics';
    if (name.includes('mechanical') || name.includes('energy')) return 'energy-mechanical';
    if (name.includes('finance') || name.includes('invest') || name.includes('banking')) return 'finance';
    if (name.includes('market') || name.includes('social media')) return 'marketing';
    if (name.includes('film') || name.includes('cinema') || name.includes('tv')) return 'film-tv';
    if (name.includes('graphic') || name.includes('design') || name.includes('ux') || name.includes('ui')) return 'design';
    if (name.includes('game') || name.includes('media') || name.includes('journal')) return 'art-media';
    if (name.includes('physic') || name.includes('math')) return 'physics-math';
    if (name.includes('economic') || name.includes('politic')) return 'economics';
    if (name.includes('info') || name.includes('service') || name.includes('infrastructure')) return 'info-service';
    return 'management';
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
        href: '/schools/business/acc-fin',
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
        level: 'Advanced Diploma',
        duration: '3 Years',
        credits: 90,
        school: 'School of Business',
        duration: '2 Years',
        credits: 60,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$3,500/yr',
        tuitionInternational: '$6,000/yr',
        href: '/admissions',
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
        level: 'Advanced Diploma',
        duration: '3 Years',
        credits: 90,
        school: 'School of Technology',
        duration: '2 Years',
        credits: 60,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$3,500/yr',
        tuitionInternational: '$6,000/yr',
        href: '/admissions',
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
        pgwp: false,
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
        level: 'Advanced Diploma',
        duration: '3 Years',
        credits: 90,
        school: 'School of Health & Life Sciences',
        duration: '2 Years',
        credits: 60,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$3,500/yr',
        tuitionInternational: '$6,000/yr',
        href: '/admissions',
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
        level: 'Advanced Diploma',
        duration: '3 Years',
        credits: 90,
        school: 'School of Education & Social Sciences',
        duration: '2 Years',
        credits: 60,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$3,500/yr',
        tuitionInternational: '$6,000/yr',
        href: '/admissions',
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
    },
    {
        id: 'anim-3d',
        name: '3D Animation & Digital Game Art',
        level: 'Advanced Diploma',
        school: 'School of Arts & Design',
        duration: '3 Years',
        credits: 90,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$1,500/yr',
        tuitionInternational: '$2,500/yr',
        href: '/admissions',
        description: 'Character rigging, Maya 3D animation, Unreal Engine environment modeling, texturing, and game asset pipelines.'
    },
    {
        id: 'biz-analytics',
        name: 'Business Analytics & Data Management',
        level: 'Certificate',
        school: 'School of Business',
        duration: '1 Year',
        credits: 30,
        coop: false,
        pgwp: false,
        tuitionDomestic: '$1,500/yr',
        tuitionInternational: '$2,500/yr',
        href: '/admissions',
        description: 'SQL queries, PowerBI reporting, Tableau dashboards, predictive business modeling, and statistical decision analysis.'
    },
    {
        id: 'cloud-comp',
        name: 'Cloud Computing & DevOps Engineering',
        level: 'Certificate',
        school: 'School of Technology',
        duration: '1 Year',
        credits: 30,
        coop: true,
        pgwp: false,
        tuitionDomestic: '$1,500/yr',
        tuitionInternational: '$2,500/yr',
        href: '/admissions',
        description: 'AWS & Azure cloud architecture, Docker containerization, Kubernetes orchestration, and CI/CD automated deployment.'
    },
    {
        id: 'data-sci',
        name: 'Data Science & Big Analytics',
        level: 'Advanced Diploma',
        duration: '3 Years',
        credits: 90,
        school: 'School of Technology',
        duration: '2 Years',
        credits: 60,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$3,500/yr',
        tuitionInternational: '$6,000/yr',
        href: '/admissions',
        description: 'Python data science stack, Hadoop Spark distributed clusters, deep learning models, and quantitative research methods.'
    },
    {
        id: 'film-media',
        name: 'Film Production & Broadcasting Arts',
        level: 'Diploma',
        school: 'School of Arts & Design',
        duration: '2 Years',
        credits: 60,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$1,500/yr',
        tuitionInternational: '$2,500/yr',
        href: '/admissions',
        description: 'Cinematography, sound engineering, DaVinci Resolve color grading, scriptwriting, and multi-camera live broadcasting.'
    },
    {
        id: 'hr-mgmt',
        name: 'Human Resource Management & Talent Acquisition',
        level: 'Certificate',
        school: 'School of Business',
        duration: '1 Year',
        credits: 30,
        coop: false,
        pgwp: false,
        tuitionDomestic: '$1,500/yr',
        tuitionInternational: '$2,500/yr',
        href: '/admissions',
        description: 'Canadian employment law, compensation structures, strategic talent acquisition, labor relations, and HR metrics.'
    },
    {
        id: 'ind-design',
        name: 'Industrial & Product Design',
        level: 'Bachelor',
        school: 'School of Arts & Design',
        duration: '4 Years',
        credits: 120,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$2,500/yr',
        tuitionInternational: '$4,000/yr',
        href: '/admissions/bachelor',
        description: 'Ergonomic physical product design, 3D printing prototyping, SolidWorks 3D modeling, and sustainable material science.'
    },
    {
        id: 'kinesiology',
        name: 'Kinesiology & Human Performance',
        level: 'Bachelor',
        school: 'School of Health & Life Sciences',
        duration: '4 Years',
        credits: 120,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$2,500/yr',
        tuitionInternational: '$4,000/yr',
        href: '/admissions/bachelor',
        description: 'Biomechanics, exercise physiology, sports injury rehabilitation, athletic training, and human movement science.'
    },
    {
        id: 'legal-studies',
        name: 'Paralegal & Legal Studies',
        level: 'Diploma',
        school: 'School of Education & Social Sciences',
        duration: '2 Years',
        credits: 60,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$1,500/yr',
        tuitionInternational: '$2,500/yr',
        href: '/admissions',
        description: 'Ontario tribunal representation, legal research, contract drafting, civil litigation, and legal ethics.'
    },
    {
        id: 'optics-phot',
        name: 'Optoelectronics & Photonics Engineering',
        level: 'Advanced Diploma',
        duration: '3 Years',
        credits: 90,
        school: 'School of Technology',
        duration: '2 Years',
        credits: 60,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$3,500/yr',
        tuitionInternational: '$6,000/yr',
        href: '/admissions',
        description: 'Laser physics, fiber optic telecom networks, optical sensor systems, and semiconductor fabrication research.'
    },
    {
        id: 'robotics-eng',
        name: 'Robotics & Mechatronics Automation',
        level: 'Advanced Diploma',
        school: 'School of Technology',
        duration: '3 Years',
        credits: 90,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$1,500/yr',
        tuitionInternational: '$2,500/yr',
        href: '/admissions',
        description: 'PLC programming, industrial robotic arms, sensor integration, pneumatic systems, and automated factory design.'
    },
    {
        id: 'urban-plan',
        name: 'Urban Planning & Smart City Development',
        level: 'Advanced Diploma',
        duration: '3 Years',
        credits: 90,
        school: 'School of Science',
        duration: '2 Years',
        credits: 60,
        coop: true,
        pgwp: true,
        tuitionDomestic: '$3,500/yr',
        tuitionInternational: '$6,000/yr',
        href: '/admissions',
        description: 'Geographic Information Systems (GIS), municipal zoning policy, transit-oriented development, and sustainable urban design.'
    },
    {
        id: 'web-cloud',
        name: 'Web Applications & Cloud Solutions',
        level: 'Certificate',
        school: 'School of Technology',
        duration: '1 Year',
        credits: 30,
        coop: false,
        pgwp: false,
        tuitionDomestic: '$1,500/yr',
        tuitionInternational: '$2,500/yr',
        href: '/admissions',
        description: 'Modern front-end frameworks, RESTful API architecture, cloud database integration, and web deployment strategies.'
    }
];

export function ProgramsAZTableView() {
    const [allPrograms, setAllPrograms] = useState<ProgramItem[]>(() => 
        programsData.map((p, idx) => {
            const schSlug = getSchoolSlug(p.school);
            const deptSlug = getDeptSlug(p.name, p.school);
            const domesticTuition = p.level === 'Advanced Diploma' ? '$5,600/yr' : p.level === 'Bachelor' ? '$4,000/yr' : '$2,400/yr';
            const intlTuition = p.level === 'Advanced Diploma' ? '$9,600/yr' : p.level === 'Bachelor' ? '$6,400/yr' : '$4,000/yr';
            return {
                ...p,
                code: `CAN-${100 + idx * 5}`,
                tuitionDomestic: domesticTuition,
                tuitionInternational: intlTuition,
                href: `/schools/${schSlug}/${deptSlug}`
            };
        })
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [search, setSearch] = useState('');
    const [selectedLevel, setSelectedLevel] = useState<string>('All');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [sortAsc, setSortAsc] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);

    const levels = ['All', 'Certificate', 'Diploma', 'Advanced Diploma', 'Bachelor'];

    // Fetch dynamic programs from Supabase Course table
    useEffect(() => {
        let isMounted = true;
        async function fetchDatabasePrograms() {
            try {
                const supabase = createClient();
                const { data: dbData, error } = await supabase
                    .from('Course')
                    .select('id, code, title, degreeLevel, duration, credits, slug, description, schoolId, School(name, slug)');

                if (!error && dbData && dbData.length > 0 && isMounted) {
                    const dbMapped: ProgramItem[] = dbData.map((item: any) => {
                        const schoolName = item.School?.name || 'School of Academic Studies';
                        const levelFormatted = item.degreeLevel ? (
                            item.degreeLevel === 'BACHELOR' ? 'Bachelor' :
                            (item.degreeLevel === 'MASTER' || item.degreeLevel === 'ADVANCED_DIPLOMA') ? 'Advanced Diploma' :
                            item.degreeLevel === 'CERTIFICATE' ? 'Certificate' : 'Diploma'
                        ) : 'Diploma';

                        const domesticTuition = levelFormatted === 'Advanced Diploma' ? '$5,600/yr' : levelFormatted === 'Bachelor' ? '$4,000/yr' : '$2,400/yr';
                        const intlTuition = levelFormatted === 'Advanced Diploma' ? '$9,600/yr' : levelFormatted === 'Bachelor' ? '$6,400/yr' : '$4,000/yr';

                        const isPgwpEligible = levelFormatted === 'Advanced Diploma' || levelFormatted === 'Bachelor' || levelFormatted === 'Diploma';

                        return {
                            id: item.id,
                            code: item.code || 'CAN-100',
                            name: item.title,
                            level: levelFormatted as any,
                            school: schoolName,
                            duration: item.duration || '2 Years',
                            credits: Number(item.credits) || (levelFormatted === 'Bachelor' ? 120 : levelFormatted === 'Advanced Diploma' ? 90 : 60),
                            coop: true,
                            pgwp: isPgwpEligible,
                            tuitionDomestic: domesticTuition,
                            tuitionInternational: intlTuition,
                            href: `/studies/${item.slug}`,
                            description: item.description || `${item.title} program at Cannoga College.`
                        };
                    });

                    setAllPrograms(dbMapped);
                }
            } catch (err) {
                console.log('Supabase Course table query info:', err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        fetchDatabasePrograms();
        return () => { isMounted = false; };
    }, []);

    const filteredPrograms = useMemo(() => {
        return allPrograms
            .filter(p => {
                const progCode = p.code || 'CAN-100';
                const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                                      progCode.toLowerCase().includes(search.toLowerCase()) ||
                                      p.school.toLowerCase().includes(search.toLowerCase()) ||
                                      p.description.toLowerCase().includes(search.toLowerCase());
                const matchesLevel = selectedLevel === 'All' || p.level === selectedLevel;
                return matchesSearch && matchesLevel;
            })
            .sort((a, b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    }, [allPrograms, search, selectedLevel, sortAsc]);

    // Calculate pagination slices
    const totalPages = Math.max(1, Math.ceil(filteredPrograms.length / itemsPerPage));
    const validCurrentPage = Math.min(currentPage, totalPages);

    const paginatedPrograms = useMemo(() => {
        const start = (validCurrentPage - 1) * itemsPerPage;
        return filteredPrograms.slice(start, start + itemsPerPage);
    }, [filteredPrograms, validCurrentPage, itemsPerPage]);

    const startItem = filteredPrograms.length > 0 ? (validCurrentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = Math.min(validCurrentPage * itemsPerPage, filteredPrograms.length);

    const handleSearchChange = (val: string) => {
        setSearch(val);
        setCurrentPage(1);
    };

    const handleLevelChange = (lvl: string) => {
        setSelectedLevel(lvl);
        setCurrentPage(1);
    };

    const handleSortChange = () => {
        setSortAsc(!sortAsc);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-8">
            {/* Header Controls Bar */}
            <div className="bg-white p-4 sm:p-6 rounded-none border border-neutral-200 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg sm:text-xl font-black text-black tracking-tight">
                            Programs Directory (A-Z)
                        </h3>
                        <p className="text-xs text-neutral-500 font-medium mt-1">
                            Browse all accredited degrees, diplomas, and certificates offered at Cannoga College in Ottawa.
                        </p>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-none self-start sm:self-auto shrink-0">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-none transition-all ${
                                viewMode === 'table' ? 'bg-[#0a151a] text-white shadow-sm' : 'text-neutral-600 hover:text-black'
                            }`}
                        >
                            <ListBullets size={15} weight="bold" />
                            Table View
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-none transition-all ${
                                viewMode === 'grid' ? 'bg-[#0a151a] text-white shadow-sm' : 'text-neutral-600 hover:text-black'
                            }`}
                        >
                            <SquaresFour size={15} weight="bold" />
                            Grid View
                        </button>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center pt-4 border-t border-neutral-100">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <MagnifyingGlass size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search programs by title, school, or keyword..."
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-none text-xs md:text-sm font-medium focus:outline-none focus:border-[#0a151a] focus:bg-white transition-all text-black"
                        />
                    </div>

                    {/* Level Filter Pills (Responsive scroll/wrap) */}
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full no-scrollbar shrink-0">
                        {levels.map(lvl => (
                            <button
                                key={lvl}
                                onClick={() => handleLevelChange(lvl)}
                                className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider rounded-none whitespace-nowrap transition-all border ${
                                    selectedLevel === lvl 
                                        ? 'bg-[#0a151a] text-white border-[#0a151a]' 
                                        : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100 hover:text-black'
                                }`}
                            >
                                {lvl}
                            </button>
                        ))}
                    </div>

                    {/* Sort Order Button */}
                    <button
                        onClick={handleSortChange}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-black text-xs font-bold rounded-none transition-all shrink-0"
                    >
                        <ArrowsDownUp size={14} weight="bold" />
                        <span>Sort {sortAsc ? 'A-Z' : 'Z-A'}</span>
                    </button>
                </div>
            </div>

            {/* Results Count Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-bold text-neutral-500 px-2 gap-2">
                <span>Showing {startItem}-{endItem} of {filteredPrograms.length} Academic Programs</span>
                <div className="flex items-center gap-2">
                    <span>Show per page:</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="bg-white border border-neutral-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-900"
                    >
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                    </select>
                </div>
            </div>

            {/* Table View Mode */}
            {viewMode === 'table' ? (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
                        <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Itemized Academic Program Directory</h3>
                        <span className="text-xs font-bold text-slate-500">Page {validCurrentPage} of {totalPages}</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm text-slate-600 border-collapse min-w-[950px]">
                            <thead className="bg-slate-50 text-slate-700 text-xs uppercase border-b border-slate-200">
                                <tr>
                                    <th className="p-3.5 font-extrabold w-32">Program Code</th>
                                    <th className="p-3.5 font-extrabold">Program Name</th>
                                    <th className="p-3.5 font-extrabold">Credential Level</th>
                                    <th className="p-3.5 font-extrabold">School</th>
                                    <th className="p-3.5 font-extrabold">Duration</th>
                                    <th className="p-3.5 font-extrabold text-center">PGWP & Co-op</th>
                                    <th className="p-3.5 font-extrabold text-right">Tuition</th>
                                    <th className="p-3.5 font-extrabold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paginatedPrograms.map((p) => (
                                    <tr 
                                        key={p.id} 
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="p-3.5 font-mono font-normal text-slate-900 text-xs whitespace-nowrap">
                                            {p.code}
                                        </td>
                                        <td className="p-3.5">
                                            <Link 
                                                href={p.href}
                                                className="font-normal text-slate-900 text-sm block hover:text-[#0a151a] hover:underline transition-colors no-underline"
                                            >
                                                {p.name}
                                            </Link>
                                        </td>
                                        <td className="p-3.5 font-normal text-slate-900 whitespace-nowrap text-xs">
                                            {p.level}
                                        </td>
                                        <td className="p-3.5 text-slate-600 font-normal">
                                            {p.school}
                                        </td>
                                        <td className="p-3.5 font-normal text-slate-900 whitespace-nowrap">
                                            {p.duration}
                                            <span className="block text-xs font-normal text-slate-400">({p.credits} Credits)</span>
                                        </td>
                                        <td className="p-3.5 text-center">
                                            <div className="flex flex-col items-center gap-0.5 text-xs font-normal text-slate-700 whitespace-nowrap">
                                                {p.pgwp ? (
                                                    <span className="text-emerald-700 font-semibold">PGWP Eligible</span>
                                                ) : (
                                                    <span className="text-slate-400">Not PGWP Eligible</span>
                                                )}
                                                {p.coop && <span className="text-slate-500 text-[11px]">Co-op Available</span>}
                                            </div>
                                        </td>
                                        <td className="p-3.5 text-right font-mono font-normal text-slate-900 whitespace-nowrap">
                                            <span className="text-slate-900 block">{p.tuitionDomestic}</span>
                                            <span className="text-slate-400 text-xs block font-normal font-sans">{p.tuitionInternational} intl</span>
                                        </td>
                                        <td className="p-3.5 text-right whitespace-nowrap">
                                            <Link 
                                                href={p.href}
                                                className="inline-block text-xs font-bold px-3.5 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition shadow-sm no-underline"
                                            >
                                                View Course
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedPrograms.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="p-8 text-center text-slate-500 font-medium">No academic programs found matching your search.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Grid View Mode */
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedPrograms.map(p => (
                        <div 
                            key={p.id}
                            className="bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md hover:border-neutral-300 p-6 flex flex-col justify-between transition-all"
                        >
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <span className="font-mono text-xs font-bold text-slate-900">
                                        {p.code}
                                    </span>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                        {p.level}
                                    </span>
                                </div>
                                <h4 className="font-bold text-base text-black mb-2 leading-snug">
                                    <Link 
                                        href={p.href}
                                        className="hover:text-[#0a151a] hover:underline transition-colors text-black no-underline block"
                                    >
                                        {p.name}
                                    </Link>
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
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                                        {p.pgwp && <span>PGWP</span>}
                                        {p.pgwp && p.coop && <span>•</span>}
                                        {p.coop && <span>Co-op</span>}
                                    </div>
                                    <Link 
                                        href={p.href}
                                        className="inline-flex items-center gap-1 text-xs font-bold text-[#0a151a] hover:underline"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Interactive Pagination Navigation Controls Bar */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-200">
                    <div className="text-xs font-semibold text-slate-500 hidden sm:block">
                        Page <span className="font-bold text-slate-900">{validCurrentPage}</span> of <span className="font-bold text-slate-900">{totalPages}</span>
                    </div>

                    {/* Mobile Only Pagination Controls Layout */}
                    <div className="flex sm:hidden items-center justify-between gap-2.5 w-full">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={validCurrentPage === 1}
                            className="flex-1 inline-flex items-center justify-center gap-1 py-2.5 px-3 text-xs font-bold bg-white border border-neutral-200 rounded-xl text-slate-800 active:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            <CaretLeft size={16} weight="bold" />
                            <span>Previous</span>
                        </button>

                        <div className="px-3.5 py-2.5 text-xs font-black text-[#0a151a] bg-neutral-100 border border-neutral-200 rounded-xl whitespace-nowrap shrink-0 shadow-inner">
                            {validCurrentPage} / {totalPages}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={validCurrentPage === totalPages}
                            className="flex-1 inline-flex items-center justify-center gap-1 py-2.5 px-3 text-xs font-bold bg-white border border-neutral-200 rounded-xl text-slate-800 active:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            <span>Next</span>
                            <CaretRight size={16} weight="bold" />
                        </button>
                    </div>

                    {/* Desktop Only Pagination Controls Layout */}
                    <div className="hidden sm:flex items-center gap-1.5">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={validCurrentPage === 1}
                            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold bg-white border border-neutral-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            <CaretLeft size={14} weight="bold" />
                            <span>Previous</span>
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                                    validCurrentPage === pageNum
                                        ? 'bg-[#0a151a] text-white shadow-sm'
                                        : 'bg-white text-slate-700 border border-neutral-200 hover:bg-slate-50 hover:border-slate-300'
                                }`}
                            >
                                {pageNum}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={validCurrentPage === totalPages}
                            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold bg-white border border-neutral-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            <span>Next</span>
                            <CaretRight size={14} weight="bold" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
