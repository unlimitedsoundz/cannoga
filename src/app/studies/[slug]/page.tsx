import { createStaticClient } from '@/lib/supabase/static';
import Link from 'next/link';
import Image from 'next/image';
import { Course, Subject, Faculty, School, Department } from '@/types/database';
import { notFound } from 'next/navigation';
import TableOfContents from '@/components/course/TableOfContents';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { Breadcrumbs } from '@aalto-dx/react-modules';
import { ArrowLeft, CaretLeft as ChevronLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
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

export async function generateMetadata({ params }: Props) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const supabase = createStaticClient();

    const { data: course } = await supabase
        .from('Course')
        .select('title, description, degreeLevel, credits')
        .eq('slug', slug)
        .single();

    if (!course) {
        return {
            title: 'Course Not Found',
        };
    }

    return {
        title: `${course.title} — ${course.degreeLevel} | Cannoga College`,
        description: cleanHtml(course.description)?.replace(/Cannoga College|Cannoga|Cannoga C\x6Fllege|SYKLI|College/gi, 'Cannoga College').substring(0, 160) || `Study ${course.title} (${course.degreeLevel}, ${course.credits} Credits) at Cannoga College.`,
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
    const { data: course, error } = await supabase
        .from('Course')
        .select(`
      *,
      school:School(*),
      department:Department(*),
      subjects:Subject(*)
    `)
        .eq('slug', slug)
        .single();

    if (error || !course) {
        if (error?.code !== 'PGRST116') { // not found error
            console.error('Error fetching course:', error);
        }
        notFound();
    }

    // Fetch faculty separately since they are linked to Department, not Course directly in our current schema partial
    // (Schema check: Faculty has departmentId. Course has departmentId.)
    let relatedFaculty: Faculty[] = [];
    if (course.departmentId) {
        const { data: facultyData } = await supabase
            .from('Faculty')
            .select('*')
            .eq('departmentId', course.departmentId)
            .limit(3);
        if (facultyData) relatedFaculty = facultyData;
    }

    const c = course as Course & { subjects: Subject[], school: School, department: Department };

    // Resolve the correct school slug for department back-links
    let deptSchoolSlug = c.school?.slug;
    if (c.department?.schoolId) {
        const { data: deptSchool } = await supabase
            .from('School')
            .select('slug')
            .eq('id', c.department.schoolId)
            .single();
        if (deptSchool?.slug) deptSchoolSlug = deptSchool.slug;
    }
    const cleanedSections = (c.sections || []).map((section: any) => ({
        ...section,
        id: cleanHtml(section.id),
        title: cleanHtml(section.title),
        content: cleanHtml(section.content)
    }));

    const schoolStyleMap: Record<string, { bg: string, text: string, accent: string }> = {
        'business': { bg: 'bg-[#9c27b3]', text: 'text-white', accent: 'text-white' },
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
        name: course.title,
        description: course.description?.replace(/Cannoga College|Cannoga|Cannoga C\x6Fllege|SYKLI|College/gi, 'Cannoga College'),
        provider: {
            '@type': 'EducationalOrganization',
            name: 'Cannoga College',
            sameAs: 'https://cannogacollege.ca'
        },
        educationalCredentialAwarded: course.degreeLevel,
        hasCourseInstance: {
            '@type': 'CourseInstance',
            courseMode: 'Blended',
            courseWorkload: `P${course.credits}M` // ISO 8601 duration format approximation
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 pb-20">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Studies', item: '/studies' },
                { name: c.title, item: `/studies/${c.slug}` }
            ]} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Header Section */}
            <div className={`${style.bg} ${style.text} relative overflow-hidden text-balance`}>
                {!isLight && <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]" />}
                {isLight && <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.05),transparent)]" />}                <div className="container mx-auto px-4 pt-32 pb-12 md:pt-48 relative z-10">
                    <div className="flex flex-wrap gap-4 mb-4 text-sm font-bold">
                        <span className={`${isLight ? 'bg-neutral-100' : 'bg-white/10'} px-3 py-1 rounded-none uppercase tracking-widest`}>{c.degreeLevel}</span>
                        <span className={`${isLight ? 'bg-[#9c27b3] text-white' : 'bg-white text-black'} px-3 py-1 rounded-none uppercase tracking-widest`}>{c.school?.name}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 max-w-4xl pt-8 leading-tight">{c.title}</h1>
                    <div className={`flex flex-wrap gap-8 md:gap-16 ${isLight ? 'text-black' : 'text-white'}`}>
                        <div className="flex flex-col gap-1">
                            <p className={`text-xs uppercase tracking-[0.2em] font-bold ${isLight ? 'text-black/50' : 'text-white'}`}>Duration</p>
                            <p className="text-lg font-bold">{c.duration}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className={`text-xs uppercase tracking-[0.2em] font-bold ${isLight ? 'text-black/50' : 'text-white'}`}>Language</p>
                            <p className="text-lg font-bold">{c.language}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className={`text-xs uppercase tracking-[0.2em] font-bold ${isLight ? 'text-black/50' : 'text-white'}`}>Canadian Credits</p>
                            <p className="text-lg font-bold">{c.credits || c.subjects?.reduce((acc: number, s: any) => acc + (s.creditUnits || 0), 0) || 0}</p>
                        </div>
                    </div>
                </div>
            </div>


            <div className="border-b border-neutral-100 bg-white">
                <div className="container mx-auto px-4 py-3">
                    <Breadcrumbs
                        items={[
                            { icon: 'home', linkComponentProps: { href: '/' } },
                            { label: 'Studies', linkComponentProps: { href: '/studies' } },
                            { label: c.title }
                        ]}
                    />
                </div>
            </div>

            {/* Back Navigation */}
            <div className="container mx-auto px-4 py-8">
                    <Link
                        href={c.department ? `/schools/${deptSchoolSlug}/${c.department.slug}` : '/studies'}
                        className="text-black hover:opacity-70 text-sm font-bold tracking-widest uppercase inline-flex items-center gap-3 transition-opacity"
                    >
                        <ChevronLeft size={20} weight="bold" className="align-middle" /> {c.department ? `Back to ${c.department.name}` : 'Back to Programs'}
                    </Link>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Sidebar (TOC + Requirements) - First on mobile */}
                <div className="lg:order-2 space-y-8">
                    {cleanedSections.length > 0 ? (
                        <TableOfContents sections={cleanedSections} />
                    ) : (
                        <div className="bg-white p-8 lg:sticky lg:top-24 border border-[#9c27b3] shadow-none">
                            {/* Default Sidebar Content */}
                            <h3 className="text-xl font-bold mb-8 uppercase tracking-widest">Entry Requirements</h3>
                            <div className="space-y-6 text-base text-black mb-10">
                                <div className="flex gap-4 items-center">
                                    <ArrowRight size={20} className="shrink-0 align-middle" />
                                    <p className="leading-relaxed">{c.entryRequirements}</p>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <ArrowRight size={20} className="shrink-0 align-middle" />
                                    <p className="leading-relaxed">Minimum Grade: <span className="font-bold underline">{c.minimumGrade || 'N/A'}</span></p>
                                </div>
                            </div>

                            <Link
                                href={`/portal/apply?program=${course.slug}`}
                                className="block w-full bg-[#9c27b3] text-white text-center py-5 font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                            >
                                Apply Now
                            </Link>
                        </div>
                    )}

                </div>

                {/* Main Content - Second on mobile, first on desktop */}
                <div className="lg:col-span-2 lg:order-1 space-y-8">
                    {cleanedSections.length > 0 ? (
                        /* Dynamic Sections Rendering */
                        <div className="space-y-16">
                            {cleanedSections.map((section: any) => (
                                <section key={section.id} id={section.id} className="scroll-mt-32">
                                    <h2 className="text-3xl font-bold mb-8 text-black pb-10 border-b-2 border-[#9c27b3] uppercase tracking-widest">{section.title}</h2>
                                    <div
                                        className="prose prose-lg text-black max-w-none prose-headings:font-bold prose-a:text-black hover:prose-a:opacity-70 transition-opacity prose-arrows"
                                        dangerouslySetInnerHTML={{ __html: section.content.replace(/Cannoga College|Cannoga|Cannoga C\x6Fllege|SYKLI|College/gi, 'Cannoga College') }}
                                    />
                                </section>
                            ))}
                        </div>
                    ) : (
                        /* Default Rendering */
                        <>
                            <section>
                                <h2 className="text-3xl font-bold mb-8 text-black pb-10 border-b-2 border-[#9c27b3] uppercase tracking-widest">Program Overview</h2>
                                <div className="prose prose-lg text-black max-w-none leading-relaxed prose-arrows">
                                    <p>{c.description?.replace(/Cannoga College|Cannoga|Cannoga C\x6Fllege|SYKLI|College/gi, 'Cannoga College')}</p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-3xl font-bold mb-10 text-black pb-10 border-b-2 border-[#9c27b3] uppercase tracking-widest">Curriculum</h2>
                                <div className="overflow-x-auto -mx-4 md:mx-0">
                                    <table className="w-full text-left text-base border-collapse">
                                        <thead className="bg-[#9c27b3] text-white uppercase tracking-[0.2em] font-bold">
                                            <tr>
                                                {c.subjects?.[0]?.code && <th className="p-5 border-r border-white/20">Code</th>}
                                                {c.subjects?.[0]?.area && <th className="p-5 border-r border-white/20">Area</th>}
                                                <th className="p-5 border-r border-white/20">Subject Name</th>
                                                <th className="p-5 border-r border-white/20">Credits</th>
                                                {c.subjects?.[0]?.eligibility && <th className="p-5">Eligibility</th>}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-black/10">
                                            {c.subjects?.sort((a: any, b: any) => (a.code || a.name || "").localeCompare(b.code || b.name || "")).map((subject: any) => (
                                                <tr key={subject.id} className="hover:bg-neutral-100 transition-colors bg-white">
                                                    {subject.code && <td className="p-5 text-black border-r border-[#9c27b3]/10 font-medium">{subject.code}</td>}
                                                    {subject.area && <td className="p-5 font-bold border-r border-[#9c27b3]/10 uppercase text-sm tracking-widest">{subject.area}</td>}
                                                    <td className="p-5 border-r border-[#9c27b3]/10">
                                                        <div className="font-bold text-black text-lg">{subject.name}</div>
                                                        {subject.semester && !subject.area && <div className="text-xs text-black/50 font-bold uppercase tracking-widest mt-1">Semester {subject.semester}</div>}
                                                    </td>
                                                    <td className="p-5 border-r border-[#9c27b3]/10 font-bold">{subject.creditUnits}</td>
                                                    {subject.eligibility && <td className="p-5 text-black font-medium">{subject.eligibility}</td>}
                                                </tr>
                                            ))}
                                            {(!c.subjects || c.subjects.length === 0) && (
                                                <tr>
                                                    <td colSpan={5} className="p-12 text-center text-black font-bold uppercase tracking-widest">No subjects listed yet.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-3xl font-bold mb-8 text-black pb-10 border-b-2 border-[#9c27b3] uppercase tracking-widest">Career Prospects</h2>
                                <div className="bg-white p-10 border-l-4 border-[#9c27b3] border-y border-r border-[#9c27b3]/10">
                                    <p className="text-black font-bold uppercase tracking-widest mb-4">Potential Roles:</p>
                                    <p className="text-black text-lg leading-relaxed">{c.careerPaths?.replace(/Cannoga College|Cannoga|Cannoga C\x6Fllege|SYKLI|College/gi, 'Cannoga College')}</p>
                                </div>
                            </section>
                        </>
                    )}

                    {relatedFaculty.length > 0 && (
                        <section>
                            <h2 className="text-3xl font-bold mb-8 text-black pb-10 border-b-2 border-[#9c27b3] uppercase tracking-widest">Program Faculty</h2>
                            <div className="bg-white p-8 border border-[#9c27b3]">
                                <div className="space-y-6">
                                    {relatedFaculty.map(f => (
                                        <div key={f.id} className="flex flex-col gap-1">
                                            <p className="font-bold text-black text-base leading-tight">{f.name}</p>
                                            <p className="text-sm text-black/60 font-medium uppercase tracking-wider">{f.role}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
