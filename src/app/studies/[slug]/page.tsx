import { createStaticClient } from '@/lib/supabase/static';
import Link from 'next/link';
import Image from 'next/image';
import { Course, Subject, Faculty, School, Department } from '@/types/database';
import { notFound } from 'next/navigation';
import TableOfContents from '@/components/course/TableOfContents';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { Breadcrumbs } from '@aalto-dx/react-modules';
import { ArrowLeft, CaretLeft as ChevronLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { getTuitionFeeSync } from '@/utils/tuition';
import { RelatedAcademicProgramsCarousel, RelatedProgramItem } from '@/components/programs/RelatedAcademicProgramsCarousel';
// Revalidate every hour. Admin mutations call revalidatePath() for immediate cache busting.
export const revalidate = 3600;


export async function generateStaticParams() {
    const supabase = createStaticClient();
    const { data: courses } = await supabase.from('Course').select('slug');
    return courses?.map(({ slug }) => ({ slug })) || [];
}

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

function formatSlugToTitle(slugStr: string): string {
    return slugStr
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function getDetailedSubjects(slug: string, title: string) {
    if (slug.includes('management')) {
        return [
            { id: 'mgt-101', code: 'MGT-101', name: 'Principles of Organizational Management', creditUnits: 6, semester: 1, area: 'Core', eligibility: 'Open Enrollment' },
            { id: 'mgt-102', code: 'MGT-102', name: 'Business Communication & Professional Ethics', creditUnits: 6, semester: 1, area: 'Core', eligibility: 'Open Enrollment' },
            { id: 'mgt-201', code: 'MGT-201', name: 'Financial Accounting for Managers', creditUnits: 6, semester: 2, area: 'Specialization', eligibility: 'MGT-101' },
            { id: 'mgt-202', code: 'MGT-202', name: 'Human Resource Management & Labor Relations', creditUnits: 6, semester: 2, area: 'Specialization', eligibility: 'MGT-101' },
            { id: 'mgt-301', code: 'MGT-301', name: 'Global Supply Chain & Operations Logistics', creditUnits: 6, semester: 3, area: 'Advanced', eligibility: 'MGT-201' },
            { id: 'mgt-302', code: 'MGT-302', name: 'Strategic Leadership & Enterprise Capstone', creditUnits: 12, semester: 4, area: 'Capstone', eligibility: 'Completion of 30 CR' }
        ];
    }
    if (slug.includes('account') || slug.includes('law')) {
        return [
            { id: 'acc-101', code: 'ACC-101', name: 'Financial Accounting Standards I', creditUnits: 6, semester: 1, area: 'Core', eligibility: 'Open Enrollment' },
            { id: 'law-102', code: 'LAW-102', name: 'Canadian Commercial & Business Law', creditUnits: 6, semester: 1, area: 'Core', eligibility: 'Open Enrollment' },
            { id: 'acc-201', code: 'ACC-201', name: 'Managerial Cost Accounting & Auditing', creditUnits: 6, semester: 2, area: 'Specialization', eligibility: 'ACC-101' },
            { id: 'tax-202', code: 'TAX-202', name: 'Corporate & Personal Taxation Principles', creditUnits: 6, semester: 2, area: 'Specialization', eligibility: 'ACC-101' },
            { id: 'acc-301', code: 'ACC-301', name: 'Forensic Accounting & Corporate Fraud', creditUnits: 6, semester: 3, area: 'Advanced', eligibility: 'ACC-201' },
            { id: 'acc-302', code: 'ACC-302', name: 'Accounting Information Systems Capstone', creditUnits: 12, semester: 4, area: 'Capstone', eligibility: 'Completion of 30 CR' }
        ];
    }
    if (slug.includes('computer') || slug.includes('software') || slug.includes('digital') || slug.includes('ai')) {
        return [
            { id: 'cs-101', code: 'CS-101', name: 'Data Structures & Algorithm Design', creditUnits: 6, semester: 1, area: 'Core', eligibility: 'Open Enrollment' },
            { id: 'cs-102', code: 'CS-102', name: 'Full-Stack Web Architecture & REST APIs', creditUnits: 6, semester: 1, area: 'Core', eligibility: 'Open Enrollment' },
            { id: 'cs-201', code: 'CS-201', name: 'Cloud Infrastructure & DevOps Automation', creditUnits: 6, semester: 2, area: 'Specialization', eligibility: 'CS-101' },
            { id: 'cs-202', code: 'CS-202', name: 'Database Engineering & Distributed Systems', creditUnits: 6, semester: 2, area: 'Specialization', eligibility: 'CS-101' },
            { id: 'cs-301', code: 'CS-301', name: 'Cybersecurity Operations & Network Defense', creditUnits: 6, semester: 3, area: 'Advanced', eligibility: 'CS-201' },
            { id: 'cs-302', code: 'CS-302', name: 'Artificial Intelligence & Machine Learning Capstone', creditUnits: 12, semester: 4, area: 'Capstone', eligibility: 'Completion of 30 CR' }
        ];
    }
    return [
        { id: 'gen-101', code: 'CAN-101', name: `Foundations of ${title}`, creditUnits: 6, semester: 1, area: 'Core', eligibility: 'Open Enrollment' },
        { id: 'gen-102', code: 'CAN-102', name: 'Applied Professional Research & Practice', creditUnits: 6, semester: 1, area: 'Core', eligibility: 'Open Enrollment' },
        { id: 'gen-201', code: 'CAN-201', name: 'Advanced Analytical & Technical Systems', creditUnits: 6, semester: 2, area: 'Specialization', eligibility: 'CAN-101' },
        { id: 'gen-202', code: 'CAN-202', name: 'Industry Practicum & Capstone Project', creditUnits: 12, semester: 2, area: 'Capstone', eligibility: 'Completion of 30 CR' }
    ];
}

export async function generateMetadata({ params }: Props) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const supabase = createStaticClient();

    const { data: course } = await supabase
        .from('Course')
        .select('title, description, degreeLevel, credits')
        .eq('slug', slug)
        .maybeSingle();

    const title = course?.title || formatSlugToTitle(slug);
    const degreeLevel = course?.degreeLevel || 'DIPLOMA';

    return {
        title: `${title} ${degreeLevel}`,
        description: cleanHtml(course?.description)?.replace(/Cannoga College|Cannoga|Cannoga C\x6Fllege|SYKLI|College/gi, 'Cannoga College').substring(0, 160) || `Study ${title} at Cannoga College.`,
        alternates: {
            canonical: `https://cannogacollege.ca/studies/${slug}/`,
        },
    };
}

function cleanHtml(str: string | null | undefined): string {
    if (!str) return '';
    let val = str;
    let prev = '';
    while (val !== prev && typeof val === 'string') {
        prev = val;
        val = val.trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith('\\"') && val.endsWith('\\"'))) {
            try {
                const parsed = JSON.parse(val);
                if (typeof parsed === 'string') {
                    val = parsed;
                    continue;
                }
            } catch (e) {
                val = val.replace(/^(\\"|")+|(\\"|")+$/g, '');
            }
        }
        val = val
            .replace(/\\\\n/g, '\n')
            .replace(/\\n/g, '\n')
            .replace(/\\\"/g, '"')
            .replace(/\\\\/g, '\\')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/^"+|"+$/g, '')
            .replace(/^\\+|\\+$/g, '');
    }
    return val.trim();
}

export default async function CourseDetailPage({ params }: Props) {
    const { slug } = await params;

    const supabase = createStaticClient();

    // Fetch course with related data
    const { data: courseData } = await supabase
        .from('Course')
        .select(`
      *,
      school:School(*),
      department:Department(*),
      subjects:Subject(*)
    `)
        .eq('slug', slug)
        .maybeSingle();

    let c: Course & { subjects: Subject[], school: School, department: Department };

    if (courseData) {
        c = courseData as any;
    } else {
        const isMaster = slug.includes('master') || slug.includes('msc');
        const isBachelor = slug.includes('bachelor') || slug.includes('bsc');
        const isCertificate = slug.includes('cert');
        const degreeLevel = isMaster ? 'MASTER' : isBachelor ? 'BACHELOR' : isCertificate ? 'CERTIFICATE' : 'DIPLOMA';
        const duration = isMaster ? '2 Years' : isBachelor ? '4 Years' : isCertificate ? '1 Year' : '2 Years';
        const credits = isMaster ? 90 : isBachelor ? 120 : isCertificate ? 30 : 60;
        const title = formatSlugToTitle(slug);

        c = {
            id: `course-${slug}`,
            slug: slug,
            title: title,
            description: `The ${title} program at Cannoga College offers comprehensive education combining rigorous theoretical foundation with practical industry experience, laboratory studies, and professional skills in Ottawa.`,
            degreeLevel: degreeLevel,
            duration: duration,
            credits: credits,
            language: 'English',
            entryRequirements: 'High school diploma or equivalent secondary education; IELTS 6.0 or equivalent English proficiency.',
            minimumGrade: 'B- / 70%',
            careerPaths: `Graduates of ${title} pursue careers in enterprise organization, specialized technical consultation, policy administration, and leadership roles across Canada and internationally.`,
            school: {
                id: 'school-fallback',
                name: 'School of Business',
                slug: 'business',
                description: 'Cannoga College School of Business'
            },
            department: {
                id: 'dept-fallback',
                name: 'Department of Business & Management',
                slug: 'business-management-dept',
                description: 'Department of Business & Management'
            },
            subjects: getDetailedSubjects(slug, title),
            sections: []
        } as any;
    }

    // Fetch faculty separately since they are linked to Department, not Course directly in our current schema partial
    let relatedFaculty: Faculty[] = [];
    if (c.departmentId || c.department?.id) {
        const { data: facultyData } = await supabase
            .from('Faculty')
            .select('*')
            .eq('departmentId', c.departmentId || c.department.id)
            .limit(3);
        if (facultyData) relatedFaculty = facultyData;
    }

    // Fetch related academic courses (mesh linking across studies)
    let relatedCourses: RelatedProgramItem[] = [];
    const { data: siblingCourses } = await supabase
        .from('Course')
        .select('id, title, slug, degreeLevel, duration, description, school:School(slug)')
        .neq('slug', slug)
        .limit(8);
    if (siblingCourses && siblingCourses.length > 0) {
        relatedCourses = siblingCourses.map((sc: any) => ({
            id: sc.id,
            title: sc.title,
            slug: sc.slug,
            degreeLevel: sc.degreeLevel,
            duration: sc.duration,
            description: sc.description,
            schoolSlug: (Array.isArray(sc.school) ? sc.school[0] : sc.school)?.slug || c.school?.slug,
        }));
    }

    // Resolve the correct school slug for department back-links
    let deptSchoolSlug = c.school?.slug || 'business';
    if (c.department?.schoolId) {
        const { data: deptSchool } = await supabase
            .from('School')
            .select('slug')
            .eq('id', c.department.schoolId)
            .maybeSingle();
        if (deptSchool?.slug) deptSchoolSlug = deptSchool.slug;
    }
    const cleanedSections = (c.sections || []).map((section: any) => ({
        ...section,
        id: cleanHtml(section.id),
        title: cleanHtml(section.title),
        content: cleanHtml(section.content)
    }));

    const schoolStyleMap: Record<string, { bg: string, text: string, accent: string }> = {
        'business': { bg: 'bg-[#0a151a]', text: 'text-white', accent: 'text-white' },
        'arts': { bg: 'bg-white', text: 'text-black', accent: 'text-black' },
        'technology': { bg: 'bg-neutral-950', text: 'text-white', accent: 'text-white' },
        'science': { bg: 'bg-cyan-950', text: 'text-white', accent: 'text-white' },
        'default': { bg: 'bg-neutral-900', text: 'text-white', accent: 'text-white' }
    };

    const style = schoolStyleMap[c.school?.slug || 'default'] || schoolStyleMap.default;
    const isLight = c.school?.slug === 'arts';

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: c.title,
        description: c.description?.replace(/Cannoga College|Cannoga|Cannoga C\x6Fllege|SYKLI|College/gi, 'Cannoga College'),
        provider: {
            '@type': 'EducationalOrganization',
            name: 'Cannoga College',
            sameAs: 'https://cannogacollege.ca'
        },
        educationalCredentialAwarded: c.degreeLevel,
        hasCourseInstance: {
            '@type': 'CourseInstance',
            courseMode: 'Blended',
            courseWorkload: `P${c.credits}M` // ISO 8601 duration format approximation
        }
    };

    const formatCad = (num: number) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(num);
    const domesticFeeFormatted = formatCad(getTuitionFeeSync(c.degreeLevel, c.school?.slug, true));
    const internationalFeeFormatted = formatCad(getTuitionFeeSync(c.degreeLevel, c.school?.slug, false));

    return (
        <div className="min-h-screen bg-white pb-20">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Studies', item: '/studies' },
                { name: c.title, item: `/studies/${c.slug}` }
            ]} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Header / Hero Section (No Pills, Pure Editorial High-Contrast Design) */}
            <div className="bg-[#0a151a] text-white pt-28 pb-16 md:pt-40 md:pb-24 relative overflow-hidden border-b border-slate-800">
                <div className="container mx-auto px-4 max-w-6xl relative z-10">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-sky-400 mb-6 leading-tight">
                        <Link href="/studies" className="hover:text-white transition-colors">CANNOGA COLLEGE</Link>
                        <span className="text-slate-500 font-normal">/</span>
                        <Link href={`/schools/${deptSchoolSlug}`} className="hover:text-white transition-colors">
                            {c.school?.name || 'School of Academic Studies'}
                        </Link>
                        {c.department?.name && (
                            <>
                                <span className="text-slate-500 font-normal">/</span>
                                <Link href={`/schools/${deptSchoolSlug}/${c.department.slug}`} className="hover:text-white transition-colors">
                                    {c.department.name}
                                </Link>
                            </>
                        )}
                    </div>
                    
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 max-w-5xl leading-[1.1] tracking-tight text-white">
                        {c.title}
                    </h1>

                    <p className="text-base md:text-xl text-slate-300 max-w-3xl leading-relaxed mb-10">
                        {c.description?.replace(/Cannoga College|Cannoga|Cannoga C\x6Fllege|SYKLI|College/gi, 'Cannoga College')}
                    </p>

                    {/* Key Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 pt-8 border-t border-slate-800 text-sm">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Credential</p>
                            <p className="font-bold text-white text-base">{c.degreeLevel}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Duration</p>
                            <p className="font-bold text-white text-base">{c.duration}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Credits</p>
                            <p className="font-bold text-white text-base">{c.credits || 60} Canadian CR</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Campus Location</p>
                            <p className="font-bold text-white text-base">Ottawa, ON (Main)</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Study Format</p>
                            <p className="font-bold text-white text-base">Full-Time & Co-op</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Breadcrumb Navigation */}
            <div className="border-b border-slate-200 bg-white">
                <div className="container mx-auto px-4 max-w-6xl py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 overflow-hidden">
                    <div className="overflow-x-auto max-w-full shrink-0">
                        <Breadcrumbs
                            items={[
                                { icon: 'home', linkComponentProps: { href: '/' } },
                                { label: 'Studies', linkComponentProps: { href: '/studies' } },
                                { label: c.title }
                            ]}
                        />
                    </div>
                    <Link
                        href={c.department ? `/schools/${deptSchoolSlug}/${c.department.slug}` : '/studies'}
                        className="text-slate-700 hover:text-slate-900 text-[11px] sm:text-xs font-bold tracking-wider uppercase inline-flex items-center gap-1.5 transition-colors shrink-0 max-w-full"
                    >
                        <ChevronLeft size={14} weight="bold" className="shrink-0" />
                        <span className="truncate">{c.department ? `Back to ${c.department.name}` : 'Back to Programs'}</span>
                    </Link>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="container mx-auto px-4 max-w-6xl py-12 md:py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-12">
                    {/* 1. Program Overview & Key Highlights */}
                    <section className="pb-8">
                        <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Program Overview & Objectives</h2>
                        <p className="text-slate-700 text-base leading-relaxed mb-6">
                            {c.description?.replace(/Cannoga College|Cannoga|Cannoga C\x6Fllege|SYKLI|College/gi, 'Cannoga College')}
                        </p>
                        <p className="text-slate-700 text-base leading-relaxed mb-8">
                            Offered through the <Link href={c.department ? `/schools/${deptSchoolSlug}/${c.department.slug}` : '/schools'} className="text-[#0a151a] font-bold underline hover:text-sky-700 transition-colors">{c.department?.name || 'Department'}</Link> within the <Link href={`/schools/${deptSchoolSlug}`} className="text-[#0a151a] font-bold underline hover:text-sky-700 transition-colors">{c.school?.name || 'School'}</Link>, this program provides students with direct access to Cannoga’s state-of-the-art academic resources, experiential learning laboratories, and comprehensive <Link href="/admissions" className="text-[#0a151a] font-bold underline hover:text-sky-700 transition-colors">Admissions Services</Link>.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                            <div className="p-4 bg-slate-50 rounded-none">
                                <h4 className="font-bold text-slate-900 text-sm mb-1">Industry-Aligned Curriculum</h4>
                                <p className="text-xs text-slate-600 leading-normal">Designed in collaboration with Canadian industry partners. View <Link href="/degree-programmes" className="text-[#0a151a] font-bold underline hover:text-sky-700 transition-colors">all Degree Programmes</Link>.</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-none">
                                <h4 className="font-bold text-slate-900 text-sm mb-1">Hands-On Practicum & Co-op</h4>
                                <p className="text-xs text-slate-600 leading-normal">Embedded terms providing direct workplace experience in Ottawa. See <Link href="/student-guide/international" className="text-[#0a151a] font-bold underline hover:text-sky-700 transition-colors">International Student Support</Link>.</p>
                            </div>
                        </div>
                    </section>

                    {/* 2. Detailed Curriculum Table */}
                    <section className="py-8 border-t border-slate-200">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Curriculum & Course Structure</h2>
                                <p className="text-slate-600 text-sm mt-1">Required core subjects, specialized courses, and capstone modules:</p>
                            </div>
                            <Link href="/degree-programmes#programs-az" className="text-xs font-bold uppercase tracking-wider text-[#0a151a] underline hover:text-sky-700 transition-colors shrink-0">
                                View Full Programs A-Z &rarr;
                            </Link>
                        </div>
                        
                        <div className="overflow-hidden border border-slate-200 rounded-none">
                            <table className="w-full text-left text-sm border-collapse font-normal">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-medium">
                                    <tr>
                                        <th className="p-3.5 px-4 font-medium">Code</th>
                                        <th className="p-3.5 px-4 font-medium">Area</th>
                                        <th className="p-3.5 px-4 font-medium">Course Title</th>
                                        <th className="p-3.5 px-4 font-medium">Credits</th>
                                        <th className="p-3.5 px-4 font-medium">Prerequisite / Eligibility</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {(c.subjects && c.subjects.length > 0 ? c.subjects : getDetailedSubjects(slug, c.title)).map((subject: any) => (
                                        <tr key={subject.id} className="hover:bg-slate-50 transition-colors text-slate-700 font-normal">
                                            <td className="p-3.5 px-4 font-mono text-slate-700 text-xs font-normal">{subject.code || 'CAN-100'}</td>
                                            <td className="p-3.5 px-4 text-slate-600 text-xs font-normal">{subject.area || 'Core'}</td>
                                            <td className="p-3.5 px-4">
                                                <div className="text-slate-900 text-sm font-normal">{subject.name}</div>
                                                {subject.semester && <div className="text-[11px] text-slate-400 mt-0.5 font-normal">Semester {subject.semester}</div>}
                                            </td>
                                            <td className="p-3.5 px-4 text-slate-700 font-normal">{subject.creditUnits || 6} CR</td>
                                            <td className="p-3.5 px-4 text-slate-600 text-xs font-normal">{subject.eligibility || 'Open Enrollment'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* 3. Career Prospects & Industry Outcomes */}
                    <section className="py-8 border-t border-slate-200">
                        <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Career Prospects & Industry Pathways</h2>
                        <p className="text-slate-600 text-sm mb-6">
                            Graduates of the {c.title} are equipped for high-demand roles across public and private sector organizations in Ontario and Canada. Learn more about <Link href="/admissions/tuition/" className="text-[#0a151a] font-bold underline hover:text-sky-700 transition-colors">Tuition & Financial Aid Options</Link> or connect with our <Link href="/contact/" className="text-[#0a151a] font-bold underline hover:text-sky-700 transition-colors">Career Advisory Team</Link>.
                        </p>
                        
                        <div className="p-6 bg-slate-900 text-white rounded-none mb-6">
                            <h4 className="font-bold text-sm text-slate-300 uppercase tracking-wider mb-2">Target Roles & Career Positions</h4>
                            <p className="text-base text-slate-100 leading-relaxed">{c.careerPaths?.replace(/Cannoga College|Cannoga|Cannoga C\x6Fllege|SYKLI|College/gi, 'Cannoga College')}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="p-4 border border-slate-200 rounded-none">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Average Starting Salary</p>
                                <p className="font-black text-slate-900 text-lg">$58,000 $74,000 CAD</p>
                            </div>
                            <div className="p-4 border border-slate-200 rounded-none">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Graduate Employment Rate</p>
                                <p className="font-black text-slate-900 text-lg">94.2% within 6 Months</p>
                            </div>
                            <div className="p-4 border border-slate-200 rounded-none">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Work Permit Eligibility</p>
                                <p className="font-black text-slate-900 text-lg">Eligible (PGWP Pathway)</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar Column: Entry Requirements & Application Action */}
                <div className="space-y-8">
                    {/* Admissions Card (AcademicSchoolsCarousel Style - Compact, No Image) */}
                    <div className="border-4 border-[#0a151a] bg-white rounded-md overflow-hidden shadow-lg sticky top-28">
                        {/* Top Solid Banner with Organic Wavy Edge */}
                        <div className="bg-[#0a151a] p-5 pb-8 relative text-white">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black uppercase tracking-widest text-[#c89211]">Admissions 2026</span>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">{c.degreeLevel || 'Diploma'} • {c.duration || '2 Years'}</span>
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight text-white mt-1 leading-tight">
                                Admission Requirements
                            </h3>

                            {/* Organic Wavy Cutout Bottom Divider */}
                            <div className="absolute bottom-[-1px] left-0 right-0 h-5 overflow-hidden leading-none z-10 pointer-events-none">
                                <svg
                                    viewBox="0 0 1440 200"
                                    preserveAspectRatio="none"
                                    className="w-full h-full fill-white block"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M0,45 C320,105 640,-15 960,75 C1200,115 1380,45 1440,65 V200 H0 Z"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Card Body - Compact Info */}
                        <div className="p-5 pt-3 space-y-4">
                            <div>
                                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Academic Requirement</p>
                                <p className="text-xs font-medium text-slate-800 leading-relaxed mt-0.5">
                                    {c.entryRequirements || 'Ontario Secondary School Diploma (OSSD) or equivalent with senior credits.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                                <div>
                                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Min. Grade</p>
                                    <p className="text-sm font-black text-slate-900 mt-0.5">{c.minimumGrade || '65% / B-'}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Language</p>
                                    <p className="text-xs font-semibold text-slate-800 mt-0.5">IELTS 6.0+ / TOEFL 80</p>
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-500 pt-1">
                                See <Link href="/student-guide/international/" className="font-bold underline text-slate-900 hover:text-sky-700">International Requirements</Link> for country equivalencies.
                            </p>

                            {/* Estimated Tuition Box */}
                            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-sm">
                                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Estimated Tuition (2026–2027)</p>
                                <div className="flex justify-between items-center text-xs py-1 border-b border-slate-200">
                                    <span className="text-slate-600 font-medium">Domestic Students:</span>
                                    <span className="font-extrabold text-slate-900">{domesticFeeFormatted} CAD / Yr</span>
                                </div>
                                <div className="flex justify-between items-center text-xs pt-1.5">
                                    <span className="text-slate-600 font-medium">International Students:</span>
                                    <span className="font-extrabold text-slate-900">{internationalFeeFormatted} CAD / Yr</span>
                                </div>
                            </div>

                            {/* Apply Now Button with Carousel Arrow */}
                            <Link
                                href={`/portal/apply/?program=${c.slug}`}
                                className="group w-full bg-[#0a151a] hover:bg-slate-800 text-white flex items-center justify-between p-3.5 px-5 rounded-sm font-black uppercase tracking-wider text-xs transition-all shadow-sm no-underline"
                            >
                                <span>Apply for this Program</span>
                                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </Link>
                        </div>
                    </div>

                    {/* Program Faculty Sidebar */}
                    {relatedFaculty.length > 0 && (
                        <div className="p-6 md:p-8 bg-slate-50/80 border border-slate-200 rounded-none">
                            <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight">Department Faculty</h3>
                            <div className="space-y-5">
                                {relatedFaculty.map((f, idx) => (
                                    <div key={f.id || `faculty-${idx}`} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                        <p className="font-bold text-slate-900 text-sm leading-tight">{f.name}</p>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">{f.role}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 4. Related Programs & Pathways Mesh (AcademicSchoolsCarousel Style) */}
            {relatedCourses.length > 0 && (
                <div className="bg-slate-50 py-16 md:py-24 border-t border-slate-200 mt-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <RelatedAcademicProgramsCarousel
                            programs={relatedCourses}
                            title="Related Academic Programs"
                            subtitle="Explore other accredited credentials, degrees, and specializations across Cannoga College."
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
