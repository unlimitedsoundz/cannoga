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
        .single();

    if (!school) {
        return {
            title: 'School Not Found',
        };
    }

    return {
        title: `${school.name} — Academic School | Cannoga College`,
        description: `Explore faculty research, specialized departments, and academic options at the ${school.name} — Cannoga College.`,
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
    const { data: schoolData, error } = await supabase
        .from('School')
        .select(`
      *,
      departments:Department(*, headOfDepartment:Faculty!headofdepartmentid(name, role))
    `)
        .eq('slug', slug)
        .single();

    if (error || !schoolData) {
        if (error?.code !== 'PGRST116') console.error('Error fetching school:', error);
        notFound();
    }

    const school = schoolData as unknown as ExtendedSchool;

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

                {/* Featured Programs */}
                {courses && courses.length > 0 && (
                    <section>
                        <div className="flex justify-between items-end mb-10">
                            <h2 className="text-aalto-5 font-bold text-black flex items-center gap-3">
                                Featured Programs
                            </h2>
                            <Link href={`/studies?school=${school.id}`} className="text-aalto-2 font-bold border-b border-[#9c27b3] pb-1 hover:text-neutral-600 transition-colors hidden md:block">
                                View All Programs
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {courses.map(course => (
                                <Link href={`/studies/${course.slug}`} key={course.id} className="block group">
                                    <div className="bg-neutral-100 h-40 rounded-lg mb-4 overflow-hidden relative">
                                        <FallbackImage
                                            src={course.imageUrl || school.imageUrl || '/images/placeholders/design.png'}
                                            fallbackSrc={school.imageUrl || '/images/placeholders/design.png'}
                                            fill
                                            className="object-cover object-top"
                                            alt={`Study ${course.title} at Cannoga College`}
                                            sizes="(max-width: 768px) 100vw, 25vw"
                                        />
                                        <span className="absolute top-2 right-2 bg-white/90 text-xs font-bold px-2 py-1 rounded text-neutral-800 z-10">
                                            {course.degreeLevel === "MASTER" ? "MSc" : course.degreeLevel === "BACHELOR" ? "BSc" : course.degreeLevel === "DIPLOMA" ? "Dip" : "Cert"}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-blue-700 transition-colors">{course.title}</h3>
                                    <p className="text-sm text-neutral-500">{course.duration}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}


                {/* Meet our people */}
                <section className="mb-20">
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
                            tilesPerRow={2}
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
                        <div className="bg-[#9c27b3] text-white p-12">
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
                        <div className="bg-[#9c27b3] text-white p-12">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p4 text-white tracking-tight">Leadership & Administration</h2>
                            <div className="space-y-8">
                                <div>
                                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#f3e600] mb-2">Dean of the School</p>
                                    <p className="text-2xl font-bold">{faculty?.find(f => f.role === 'Professor')?.name || 'To be appointed'}</p>
                                    <p className="text-neutral-400 text-sm">Dean, {school.name}</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
                                    <div>
                                        <p className="text-neutral-500 mb-2">Administrative</p>
                                        <ul className="space-y-1 text-neutral-300">
                                            {faculty?.filter(f => f.role === 'Professor').slice(1, 4).map((p) => (
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
                                    <div className="bg-neutral-100 p-10 border border-[#9c27b3]">
                                        <p className="font-bold text-lg">Cannoga College – Ottawa campus</p>
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
            <section className="bg-[#9c27b3] text-white py-12">
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
