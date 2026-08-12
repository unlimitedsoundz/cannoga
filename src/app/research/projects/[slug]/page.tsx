import { createStaticClient } from '@/lib/supabase/static';

// Revalidate every hour; admin mutations call revalidatePath() for immediate updates.
export const revalidate = 3600;
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CaretLeft, ArrowRight, Calendar, User } from "@phosphor-icons/react/dist/ssr";
import { Metadata } from 'next';


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const supabase = createStaticClient();
    const { data: project } = await supabase.from('ResearchProject').select('title, description').eq('slug', slug).single();

    if (!project) return { title: 'Project Not Found' };

    return {
        title: `${project.title} — Research Initiative | Cannoga College`,
        description: `Explore the findings and objectives of our research project: ${project.title}. ${project.description || ''}`,
        alternates: {
            canonical: `https://cannogacollege.ca/research/projects/${slug}/`,
        },
    };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = createStaticClient();
    const { data: project } = await supabase
        .from('ResearchProject')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!project) notFound();

    return (
        <article className="min-h-screen bg-white">
            {/* 1. HERO SECTION (Split Style) */}
            <section className="text-black overflow-hidden" style={{ backgroundColor: '#F5F5F5' }}>
                <div className="container mx-auto flex flex-col lg:flex-row items-center gap-2 lg:gap-16 pt-0 md:pt-12 pb-12 lg:pb-0 h-auto lg:h-[600px] lg:py-0 relative mb-0">
                    {/* Left Content */}
                    <div className="lg:w-1/2 space-y-6 relative z-10 flex flex-col justify-center h-full pt-2 lg:pt-0 px-4 md:px-0">
                        <div className="mb-2">
                            <span className="bg-white border border-neutral-200 text-neutral-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1">
                                {project.fundingSource || 'Internal Project'}
                            </span>
                        </div>

                        <h1 className="font-bold leading-[1.1] tracking-tight pt-2 text-black" style={{ fontSize: '40px' }}>
                            {project.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-neutral-600 pt-4">
                            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                                <span className="text-black">{project.leadResearcher}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="pt-8">
                             <Link href="/research/projects" className="inline-flex items-center gap-2 text-black font-bold uppercase tracking-widest text-xs hover:opacity-50 transition-all group">
                                <CaretLeft size={16} weight="bold" className="group-hover:-translate-x-1 transition-transform" /> Back to Projects
                            </Link>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="lg:w-1/2 h-full w-full relative lg:translate-y-16 z-20 flex justify-center lg:block order-first lg:order-none">
                        <div className="h-full w-full">
                            <div className="relative w-full aspect-square md:aspect-auto lg:w-full lg:h-full bg-neutral-200">
                                {project.imageUrl ? (
                                    <Image
                                        src={project.imageUrl}
                                        alt={project.title}
                                        fill
                                        priority
                                        className="object-cover object-top"
                                        sizes="100vw"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                        <span className="text-xs uppercase font-bold tracking-widest">No Project Image</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8 md:py-24">
                <div className="max-w-4xl mx-auto">
                    {/* Main Content */}
                    <div className="prose prose-lg max-w-none text-neutral-800">
                        <div className="whitespace-pre-wrap leading-relaxed text-lg">
                            {project.content}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
