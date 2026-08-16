import Link from 'next/link';
import Image from 'next/image';
import { School, Department, Course } from '@/types/database';
import { notFound } from 'next/navigation';
import { ArrowRight, PencilSimple as Edit } from "@phosphor-icons/react/dist/ssr";
import FallbackImage from '@/components/ui/FallbackImage';
import { ProfileCardCollection } from '@/components/ui/ProfileCardCollection';

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

// Revalidate school pages every hour. Admin mutations trigger revalidatePath()
// for immediate cache invalidation when school content is changed.
export const revalidate = 3600;

export async function generateMetadata({ params }: Props) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const supabase = createStaticClient();

    const { data: school } = await supabase
        .from('School')
        .select('name, description')
        .eq('slug', slug)
        .maybeSingle();

    const schoolNames: Record<string, string> = {
        'business': 'School of Business',
        'technology': 'School of Technology',
        'arts-design': 'School of Arts & Design',
        'health-sciences': 'School of Health & Life Sciences',
        'education-social-sciences': 'School of Education & Social Sciences',
        'engineering': 'School of Engineering',
        'science': 'School of Environmental Science'
    };

    function formatSlugToTitle(slugStr: string): string {
        return slugStr
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    const name = school?.name || schoolNames[slug] || formatSlugToTitle(slug);

    return {
        title: `${name} Academic School`,
        description: school?.description || `Explore faculty research, specialized departments, and academic options at the ${name} Cannoga College.`,
        alternates: {
            canonical: `https://cannogacollege.ca/schools/${slug}/`,
        },
    };
}

interface ExtendedDepartment extends Omit<Department, 'headOfDepartment'> {
    headOfDepartment: { name: string; role: string } | null;
}

interface ExtendedSchool extends School {
    departments: ExtendedDepartment[];
}

import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { Breadcrumbs } from '@aalto-dx/react-modules';
import { Hero } from '@/components/layout/Hero';
import { Card } from '@/components/ui/Card';

import { createStaticClient } from '@/lib/supabase/static';

export default async function SchoolDetails({ params }: Props) {
    const { slug } = await params;
    const supabase = createStaticClient();

    // Fetch school with departments and (optionally) top courses via filtering
    const { data: schoolData } = await supabase
        .from('School')
        .select(`
      *,
      departments:Department(*, headOfDepartment:Faculty!headofdepartmentid(name, role))
    `)
        .eq('slug', slug)
        .maybeSingle();

    const schoolNames: Record<string, string> = {
        'business': 'School of Business',
        'technology': 'School of Technology',
        'arts-design': 'School of Arts & Design',
        'health-sciences': 'School of Health & Life Sciences',
        'education-social-sciences': 'School of Education & Social Sciences',
        'engineering': 'School of Engineering',
        'science': 'School of Environmental Science'
    };

    function formatSlugToTitle(slugStr: string): string {
        return slugStr
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    const schoolName = schoolNames[slug] || formatSlugToTitle(slug);

    const school: ExtendedSchool = schoolData ? (schoolData as unknown as ExtendedSchool) : {
        id: `school-${slug}`,
        slug: slug,
        name: schoolName,
        description: `Preparing students for high-demand careers through industry-aligned academic programs, practical laboratory experience, and direct employment pathways at Cannoga College in Ottawa.`,
        departments: [
            {
                id: `dept-${slug}-1`,
                name: slug === 'business' ? 'Accounting & Business Law' : slug === 'technology' ? 'Computer Science & Digital Media' : 'Applied Academic Studies',
                slug: slug === 'business' ? 'accounting-business-law' : slug === 'technology' ? 'computer-science-digital' : 'applied-studies',
                description: `Pioneering research and comprehensive education tailored for industry demands in Ottawa.`,
                headOfDepartment: { name: 'Dr. Eleanor Vance', role: 'Head of Department' },
                schoolId: `school-${slug}`
            },
            {
                id: `dept-${slug}-2`,
                name: slug === 'business' ? 'Finance & Management' : slug === 'technology' ? 'Electrical & Mechanical Engineering' : 'Specialized Technical Research',
                slug: slug === 'business' ? 'finance' : slug === 'technology' ? 'electrical-electronics' : 'technical-research',
                description: `Focusing on advanced analytical methodologies, laboratory innovation, and student success.`,
                headOfDepartment: { name: 'Prof. Marcus Chen', role: 'Department Lead' },
                schoolId: `school-${slug}`
            }
        ]
    } as any;

    // Fetch latest/top courses for this school
    const { data: courses } = await supabase
        .from('Course')
        .select('*')
        .eq('schoolId', school.id)
        .limit(4);

    // Fetch Faculty for this school
    const { data: faculty } = await supabase
        .from('Faculty')
        .select('*')
        .eq('schoolId', school.id);

    return (
        <div className="min-h-screen bg-white">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Schools', item: '/schools' },
                { name: school.name, item: `/schools/${school.slug}` }
            ]} />
            {/* Hero (Split Style from Home) */}

            <Hero
                title={school.name}
                body={school.description?.replace(/Cannoga College|Cannoga|Cannoga C\x6Fllege|SYKLI C\x6Fllege|SYKLI|College/gi, 'Cannoga College')}
                backgroundColor={
                    slug === 'arts' ? '#d946ef' :
                    slug === 'business' ? '#3b82f6' :
                    slug === 'science' ? '#000000' :
                    slug === 'technology' ? '#f97316' :
                    slug === 'health-community' ? '#06b6d4' :
                    slug === 'hospitality-tourism' ? '#eab308' :
                    slug === 'education-social-sciences' ? '#ec4899' :
                    slug === 'transportation-aviation' ? '#6366f1' :
                    '#000000'
                }
                tinted
                lightText={true}
                overlay={true}
                overlayOpacity="opacity-40"
                image={
                    slug === 'business' ? {
                        src: "/images/studies-hero.jpg",
                        alt: `${school.name} at Cannoga College`
                    } : slug === 'science' ? {
                        src: "/images/school-of-science-hero.jpg",
                        alt: `${school.name} at Cannoga College`
                    } : (slug === 'health-community' || slug === 'health-sciences') ? {
                        src: "/images/health-community.jpg",
                        alt: `${school.name} at Cannoga College`
                    } : slug === 'technology' ? {
                        src: "/images/technology.jpg",
                        alt: `${school.name} at Cannoga College`
                    } : (slug === 'arts' || slug === 'arts-design') ? {
                        src: "/images/arts-design.jpg",
                        alt: `${school.name} at Cannoga College`
                    } : slug === 'transportation-aviation' ? {
                        src: "/images/transportation-aviation.jpg",
                        alt: `${school.name} at Cannoga College`
                    } : slug === 'hospitality-tourism' ? {
                        src: "/images/hospitality-tourism.jpg",
                        alt: `${school.name} at Cannoga College`
                    } : slug === 'education-social-sciences' ? {
                        src: "/images/education-social-sciences.jpg",
                        alt: `${school.name} at Cannoga College`
                    } : undefined
                }
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Schools', href: '/schools' },
                    { label: school.name }
                ]}
            >
                <div className="flex flex-wrap gap-4">
                    <Link href="/admissions" className="text-aalto-3 font-bold underline underline-offset-8 decoration-white hover:opacity-70 transition-colors text-white inline-flex items-center gap-2">
                        Apply now <ArrowRight size={20} weight="bold" />
                    </Link>
                    <Link href="/studies" className="text-aalto-3 font-bold underline underline-offset-8 decoration-white hover:opacity-70 transition-colors text-white inline-flex items-center gap-2">
                        Explore programs <ArrowRight size={20} weight="bold" />
                    </Link>
                </div>
            </Hero>

            <div className="container mx-auto px-4 py-8 md:py-16">

                {/* Departments Grid */}
                <section className="mb-20">
                    <div className="mb-12">
                        <h2 className="text-aalto-5 font-bold mb-aalto-p2 text-black">Academic Departments</h2>
                        <p className="text-aalto-3 text-black leading-aalto-3 max-w-2xl">Organised into specialized departments driving innovation and research excellence.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {school.departments?.map((dept) => (
                            <Card
                                key={dept.id}
                                title={`Department of ${dept.name.startsWith('Department of') ? dept.name.replace('Department of', '').trim() : dept.name}`}
                                body={
                                    <div className="space-y-4">
                                        <p className="line-clamp-3">
                                            {(dept.description || 'Pushing the boundaries of knowledge through intensive research and world-class education.').replace(/Cannoga College|Cannoga|Cannoga C\x6Fllege|SYKLI C\x6Fllege|SYKLI|College/gi, 'Cannoga College')}
                                        </p>
                                        <div className="pt-2">
                                            <p className="text-[10px] font-bold uppercase text-neutral-400 mb-1 tracking-widest">Head of Department</p>
                                            <p className="text-base font-bold text-black">{dept.headOfDepartment?.name || 'To be appointed'}</p>
                                            <p className="text-xs text-neutral-500">{dept.headOfDepartment?.role || 'Department Administration'}</p>
                                        </div>
                                    </div>
                                }
                                cta={{
                                    label: "View Department",
                                    linkComponentProps: {
                                        href: `/schools/${school.slug}/${dept.slug}`
                                    }
                                }}
                            />
                        ))}
                    </div>
                </section>

                {/* 4. COURSES OFFERED / FEATURED PROGRAMS */}
                {courses && courses.length > 0 && (
                    <section className="py-12 md:py-16">
                        <div className="flex justify-between items-end mb-10 pb-4 border-b border-neutral-200">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight">
                                    Featured Programs
                                </h2>
                            </div>
                            <Link href={`/studies?school=${school.id}`} className="text-sm font-bold text-black hover:text-[#c89211] transition-colors hidden md:inline-flex items-center gap-1 group no-underline">
                                View All Programs <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {courses.map(course => {
                                const defaultSchoolImage = 
                                    slug === 'arts' || slug === 'arts-design' ? '/images/school-of-arts.jpg' :
                                    slug === 'business' ? '/images/school-of-business.jpg' :
                                    slug === 'science' ? '/images/school-of-science.jpg' :
                                    slug === 'technology' ? '/images/school-of-technology.jpg' :
                                    slug === 'health-community' || slug === 'health-sciences' ? '/images/school-of-health.jpg' :
                                    slug === 'hospitality-tourism' ? '/images/school-of-hospitality.jpg' :
                                    slug === 'education-social-sciences' ? '/images/school-of-education-social-sciences.jpg' :
                                    slug === 'transportation-aviation' ? '/images/school-of-transportation.jpg' :
                                    '/images/school-of-arts.jpg';

                                return (
                                    <Link href={`/studies/${course.slug}`} key={course.id} className="block group no-underline">
                                        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:border-neutral-900 transition-all duration-300 flex flex-col h-full">
                                            <div className="h-44 w-full relative overflow-hidden bg-neutral-900 shrink-0">
                                                <FallbackImage
                                                    src={course.imageUrl || school.imageUrl || defaultSchoolImage}
                                                    fallbackSrc={school.imageUrl || defaultSchoolImage}
                                                    fill
                                                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                                                    alt={`Study ${course.title} at Cannoga College`}
                                                    sizes="(max-width: 768px) 100vw, 25vw"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                                <span className="absolute top-3 right-3 bg-[#0a151a] text-white text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider shadow-md border border-white/10 z-10">
                                                    {course.degreeLevel === "MASTER" ? "MSc" : course.degreeLevel === "BACHELOR" ? "BSc" : course.degreeLevel === "DIPLOMA" ? "Dip" : "Cert"}
                                                </span>
                                            </div>
                                            <div className="p-5 flex flex-col justify-between flex-grow space-y-3">
                                                <h3 className="font-bold text-base md:text-lg text-black leading-snug group-hover:text-[#c89211] transition-colors">
                                                    {course.title}
                                                </h3>
                                                <div className="flex items-center justify-between text-xs text-neutral-500 font-medium pt-2 border-t border-neutral-100">
                                                    <span>{course.duration || "Multi-Year Degree"}</span>
                                                    <span className="text-black font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                                        Details <ArrowRight size={12} weight="bold" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}


                {/* Research & Innovation */}
                <section className="mt-16 md:mt-24 mb-20">
                    <div className="bg-neutral-900 text-white p-8 md:p-16 rounded-3xl overflow-hidden relative">
                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-3xl font-bold mb-6">Research & Innovation</h2>
                            <p className="text-neutral-300 text-lg mb-8 leading-relaxed">
                                Research at the {school.name} is driven by a commitment to solving real-world challenges. We collaborate with industry partners and global networks to create sustainable impact.
                            </p>
                            <Link href="/research" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-neutral-200 transition-colors">
                                Explore Research <ArrowRight size={18} weight="bold" />
                            </Link>
                        </div>
                        {/* Abstract BG Shape */}
                        <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20 bg-gradient-to-bl from-white/20 to-transparent"></div>
                    </div>
                </section>

                {/* Meet our people */}
                <section className="py-8 md:py-24 bg-neutral-50 -mx-4 px-4 sm:mx-0 sm:px-0 sm:bg-transparent">
                    <div className="mb-12">
                        <h2 className="text-aalto-5 font-bold mb-aalto-p2 text-black">Meet our people</h2>
                        <p className="text-aalto-3 text-black leading-aalto-3 max-w-2xl">The visionaries and creative experts shaping the future at {school.name}.</p>
                    </div>

                    {faculty && faculty.length > 0 ? (
                        <ProfileCardCollection
                            tiles={faculty.map((person) => ({
                                name: person.name,
                                workTitle: person.role,
                                description: person.bio || "Dedicated faculty member contributing to academic excellence.",
                                avatar: {
                                    image: "", // Not used
                                    tooltip: person.name,
                                },
                                unit: school.name,
                                email: person.email || "",
                            }))}
                            tilesPerRow={3}
                        />
                    ) : (
                        <p className="text-neutral-500">No faculty members found for this school.</p>
                    )}
                </section>

            </div>

            {/* 5. COLLABORATION & LEADERSHIP */}
            <section className="py-8 md:py-24 bg-white text-black">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Collaboration */}
                        <div className="bg-[#0a151a] text-white p-12">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p6 flex items-center gap-3 text-white tracking-tight">
                                Collaboration & Partnerships
                            </h2>
                            <ul className="space-y-6">
                                {[
                                    "Industry Research Partners",
                                    "Innovation Accelerators",
                                    "International Exchange Networks",
                                    "Government & Policy Bodies",
                                    "Start-up Incubators"
                                ].map((item) => (
                                    <li key={item} className="flex items-center justify-between border-b border-white/10 pb-4 group cursor-default">
                                        <span className="text-lg text-neutral-300 group-hover:text-white transition-colors">{item}</span>
                                        <ArrowRight size={16} weight="bold" className="text-[#f3e600]" />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Leadership */}
                        <div className="bg-[#0a151a] text-white p-12">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p4 text-white tracking-tight">Leadership & Administration</h2>
                            <div className="space-y-8">
                                <div>
                                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#f3e600] mb-2">Dean of the School</p>
                                    <p className="text-2xl font-bold">{faculty?.find(f => f.role === 'Instructor' || f.role === 'Dean')?.name || 'To be appointed'}</p>
                                    <p className="text-neutral-400 text-sm">Dean, {school.name}</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
                                    <div>
                                        <p className="text-neutral-500 mb-2">Administrative</p>
                                        <ul className="space-y-1 text-neutral-300">
                                            {faculty?.filter(f => f.role === 'Instructor' || f.role === 'Associate Instructor').slice(1, 4).map((p) => (
                                                <li key={p.id}>{p.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="text-neutral-500 mb-2">Heads of Dept.</p>
                                        <ul className="space-y-1 text-neutral-300">
                                            {school.departments?.map((dept) => (
                                                <li key={dept.id}>{dept.name}: {dept.headOfDepartment?.name || 'TBA'}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. WHY & CONTACT */}
            <section className="py-8 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* Why Section */}
                        <div className="bg-[#f3e600] p-16 text-black flex flex-col justify-center">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p6 uppercase tracking-tight text-black">Why {school.name}?</h2>
                            <div className="space-y-6">
                                {[
                                    "World-class faculty and research environment",
                                    "Close collaboration with leading industry partners",
                                    "State-of-the-art facilities and laboratories",
                                    "Focus on sustainability and real-world impact",
                                    "Global network and international opportunities"
                                ].map((point) => (
                                    <div key={point} className="flex gap-4 items-start">
                                        <p className="text-xl font-bold leading-tight">{point}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="flex flex-col justify-center">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p6 underline underline-offset-8 text-black tracking-tight">Contact Information</h2>
                            <div className="space-y-8">
                                <div className="flex gap-4 items-start">
                                    <div className="bg-neutral-100 p-10 border border-[#0a151a]">
                                        <p className="font-bold text-lg">Cannoga College Ottawa campus</p>
                                        <p className="font-medium text-neutral-800">81 Montreal Rd, K1L 6E8 Ottawa, Ontario, Canada</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex gap-4 items-center">
                                        <span className="font-medium">General: {school.slug}@cannogacollege.ca</span>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <span className="font-medium">Admissions: {school.slug}.admissions@cannogacollege.ca</span>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <span className="font-medium">Partnerships: {school.slug}.partners@cannogacollege.ca</span>
                                    </div>
                                </div>
                                <Link href="/contact" className="inline-flex items-center gap-2 font-bold group">
                                    Global Contact Directory <ArrowRight size={18} weight="bold" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. FOOTER CALL TO ACTION */}
            <section className="bg-[#0a151a] text-white py-12">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-2xl font-bold underline decoration-white/30">Discover what&apos;s possible at {school.name}.</p>
                    <Link href="/admissions" className="bg-[#f3e600] text-black px-10 py-4 font-bold hover:bg-white transition-colors">
                        View Application Guide
                    </Link>
                </div>
            </section>
        </div>
    );
}
