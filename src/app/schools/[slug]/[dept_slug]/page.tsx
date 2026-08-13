
import { createStaticClient } from '@/lib/supabase/static';

// Revalidate every hour; admin mutations call revalidatePath() for immediate updates.
export const revalidate = 3600;
import Link from 'next/link';
import Image from 'next/image';
import { Department, School, Faculty, Course } from '@/types/database';
import { notFound } from 'next/navigation';
import { CaretLeft } from '@phosphor-icons/react/dist/ssr';
import { Breadcrumbs } from '@aalto-dx/react-modules';
import { getTuitionFeeSync } from '@/utils/tuition';


interface Props {
    params: Promise<{
        slug: string; // school slug
        dept_slug: string;
    }>;
}

export async function generateMetadata({ params }: Props) {
    const resolvedParams = await params;
    const { dept_slug } = resolvedParams;
    const supabase = createStaticClient();

    const { data: dept } = await supabase
        .from('Department')
        .select('name, description, school:School(name)')
        .eq('slug', dept_slug)
        .single();

    return {
        title: dept ? `${dept.name} — ${(Array.isArray(dept.school) ? dept.school[0] : dept.school)?.name || 'School'} | Cannoga College` : 'Department | Cannoga College',
        description: dept?.description?.substring(0, 160) || `Learn about the ${dept?.name} at Cannoga College. Research, faculty, and academic programs.`,
        alternates: {
            canonical: `https://cannogacollege.ca/schools/${resolvedParams.slug}/${dept_slug}/`,
        },
    };
}

function getEstimatedTuitionFee(schoolSlug: string, degreeLevel: string) {
    const domestic = getTuitionFeeSync(degreeLevel, undefined, true);
    const international = getTuitionFeeSync(degreeLevel, undefined, false);
    return `$${domestic.toLocaleString()} (Domestic) / $${international.toLocaleString()} (International) per year`;
}

function getCredentialName(degreeLevel: string, duration: string) {
    const lvl = (degreeLevel || '').toUpperCase();
    const dur = (duration || '').toLowerCase();
    if (lvl === 'MASTER') {
        return "Master's Degree";
    } else if (lvl === 'BACHELOR') {
        return "Bachelor's Degree";
    } else if (lvl === 'DIPLOMA') {
        if (dur.includes('3 year')) {
            return "Ontario College Advanced Diploma";
        }
        return "Ontario College Diploma";
    } else if (lvl === 'CERTIFICATE') {
        return "Ontario College Certificate";
    }
    return "College Credential";
}

export default async function DepartmentDetailPage({ params }: Props) {
    const resolvedParams = await params;
    const { slug, dept_slug } = resolvedParams;
    const supabase = createStaticClient();

    // 1. Fetch Department by slug
    const { data: deptData, error } = await supabase
        .from('Department')
        .select(`
        *,
        school:School!inner(slug, name, id) 
    `)
        // Inner join ensures we only get if school slug also matches (if we filtered by it)
        // But standardized way: Filter by dept_slug, verify school slug match below or in query.
        // Simplifying: Just query dept by slug.
        .eq('slug', dept_slug)
        .single();

    if (error || !deptData) {
        if (error?.code !== 'PGRST116') console.error('Error fetching dept:', error);
        notFound();
    }

    const deptRaw = deptData as any;
    const school = Array.isArray(deptRaw.school) ? deptRaw.school[0] : deptRaw.school;

    if (!school || school.slug !== slug) {
        if (!school) console.error('School data missing for dept:', dept_slug);
        else if (school.slug !== slug) console.error(`Slug mismatch: expected ${slug}, got ${school.slug}`);
        notFound();
    }

    const dept = { ...deptRaw, school } as Department & { school: School };

    // 2. Fetch Related Faculty
    const { data: faculty } = await supabase
        .from('Faculty')
        .select('*')
        .eq('departmentId', dept.id);

    // 3. Fetch Related Courses
    const { data: courses } = await supabase
        .from('Course')
        .select('*')
        .eq('departmentId', dept.id);

    // Color Mapping
    const deptColors: Record<string, string> = {
        'accounting-business-law': '#2563eb', // Blue
        'applied-physics': '#4f46e5',         // Indigo
        'automation-control': '#0891b2',      // Cyan
        'architecture': '#db2777',            // Pink
        'art-media': '#ec4899',               // Rose/Pink
        'chemical-materials': '#000000',      // Black
        'civil-environmental': '#0d9488',     // Teal
        'computer-science-digital': '#2563eb', // Blue
        'design': '#ea580c',                  // Orange
        'economics': '#4f46e5',               // Indigo
        'electrical-electronics': '#0891b2',  // Cyan
        'energy-mechanical': '#ea580c',       // Orange
        'film-tv': '#000000',                 // Black
        'finance': '#2563eb',                 // Blue
        'info-service': '#0ea5e9',            // Sky
        'management': '#4f46e5',              // Indigo
        'marketing': '#ec4899',               // Pink
        'physics-math': '#4f46e5',            // Indigo
    };

    // Fallback logic: Try exact slug, then check if slug contains key words
    let heroColor = deptColors[dept.slug] || '#171717'; // Default neutral-900

    // If no direct match, try to fuzzy match for new depts not in list
    if (!deptColors[dept.slug]) {
        if (dept.slug.includes('engineering') || dept.slug.includes('trades')) heroColor = '#0d9488'; // Teal
        else if (dept.slug.includes('science')) heroColor = '#4f46e5'; // Indigo
        else if (dept.slug.includes('arts') || dept.slug.includes('media')) heroColor = '#db2777'; // Pink
        else if (dept.slug.includes('business') || dept.slug.includes('management') || dept.slug.includes('hospitality')) heroColor = '#2563eb'; // Blue
        else if (dept.slug.includes('health') || dept.slug.includes('community')) heroColor = '#000000'; // Black
        else heroColor = '#000000'; // College Purple
    }

    return (
        <div className="min-h-screen bg-white">
            {/* 1. HERO SECTION (Plain Vibrant Background) */}
            <section style={{ backgroundColor: heroColor }} className="text-white overflow-hidden transition-colors duration-700">
                <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl relative z-10 flex flex-col justify-center">
                    <h1 className="text-3xl md:text-5xl lg:text-5xl font-black leading-[1.1] tracking-tight pt-0">
                        {dept.name}
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed mt-4">
                        {(dept.description || "Advancing knowledge and innovation through world-class research and education.").replace(/Cannoga College|Cannoga|Cannoga C\x6Fllege|SYKLI C\x6Fllege|SYKLI|College/gi, 'Cannoga College')}
                    </p>
                </div>
            </section>

            <div className="border-b border-neutral-100 bg-white">
                <div className="container mx-auto px-4 py-3">
                    <Breadcrumbs 
                        items={[
                            { icon: 'home', linkComponentProps: { href: '/' } },
                            { label: 'Schools', linkComponentProps: { href: '/schools' } },
                            { label: school.name, linkComponentProps: { href: `/schools/${slug}` } },
                            { label: dept.name }
                        ]} 
                    />
                </div>
            </div>

            {/* Back Navigation (Below Hero) */}
            <div className="container mx-auto px-4 py-6">
                <Link href={`/schools/${slug}`} className="inline-flex items-center gap-2 text-neutral-500 hover:text-black font-bold uppercase tracking-widest text-xs transition-colors">
                    <CaretLeft size={16} weight="bold" /> Back to {dept.school.name}
                </Link>
            </div>

            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content: Study Programs */}
                <div className="lg:col-span-2">
                    <section id="programs" className="scroll-mt-32">
                        <h2 className="text-3xl font-bold mb-8 text-black pb-10 pl-2">
                            Study Programs
                        </h2>
                        <div className="space-y-4">
                            {courses?.map((course) => (
                                <Link
                                    href={`/studies/${course.slug}`}
                                    key={course.id}
                                    style={{ backgroundColor: heroColor, borderColor: 'rgba(255,255,255,0.1)' }}
                                    className="block p-8 rounded-lg border hover:opacity-90 transition-opacity"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">{course.title}</h3>
                                            <p className="text-white text-sm line-clamp-2 mb-4">{(course.description || "").replace(/Cannoga College|Cannoga|Cannoga C\x6Fllege|SYKLI C\x6Fllege|SYKLI|College/gi, 'Cannoga College')}</p>

                                            {/* Program Details Grid */}
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm mt-4 pt-4 border-t border-white/10">
                                                <div>
                                                    <p className="text-white uppercase tracking-wider text-[10px] font-bold mb-1">Code</p>
                                                    <p className="font-semibold text-white">{parseInt(course.id.substring(0, 5), 16).toString().substring(0, 5).padStart(5, '0')}</p>
                                                </div>
                                                <div>
                                                    <p className="text-white uppercase tracking-wider text-[10px] font-bold mb-1">Start</p>
                                                    <p className="font-semibold text-white">Fall 2026</p>
                                                </div>
                                                <div>
                                                    <p className="text-white uppercase tracking-wider text-[10px] font-bold mb-1">Campus</p>
                                                    <p className="font-semibold text-white">Ottawa</p>
                                                </div>
                                                <div>
                                                    <p className="text-white uppercase tracking-wider text-[10px] font-bold mb-1">Length</p>
                                                    <p className="font-semibold text-white">{course.duration}</p>
                                                </div>
                                                <div>
                                                    <p className="text-white uppercase tracking-wider text-[10px] font-bold mb-1">Credential</p>
                                                    <p className="font-semibold text-white text-xs">{getCredentialName(course.degreeLevel, course.duration)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-white uppercase tracking-wider text-[10px] font-bold mb-1">Tuition (2026-2027)</p>
                                                    <p className="font-semibold text-white text-xs">{getEstimatedTuitionFee(slug, course.degreeLevel)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {(!courses || courses.length === 0) && (
                                <p className="text-neutral-500">No courses currently listed for this department.</p>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar: Faculty */}
                <aside className="lg:col-span-1">
                    <section id="faculty" className="scroll-mt-32">
                        <h2 className="text-2xl font-bold mb-6 pb-10 pl-2">
                            Faculty
                        </h2>
                        <div className="space-y-6">
                            {faculty?.map((member) => (
                                <div key={member.id} className="flex gap-4 items-start">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-neutral-900">{member.name}</h4>
                                        <p className="text-neutral-700 text-sm font-medium mb-1">{member.role}</p>
                                        <p className="text-xs text-neutral-500 line-clamp-2">{member.bio}</p>
                                        {member.email && (
                                            <a href={`mailto:${member.email}`} className="text-xs text-neutral-400 hover:text-blue-600 mt-1 block">
                                                {member.email}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {(!faculty || faculty.length === 0) && (
                                <p className="text-neutral-500">No faculty listings available.</p>
                            )}
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}
