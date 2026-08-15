
import { createStaticClient } from '@/lib/supabase/static';
import { Link } from "@aalto-dx/react-components";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
    title: 'Active Scientific & Collaborative Projects Cannoga College',
    description: 'Discover current and historical research projects across technology, arts, sciences, and sustainability at Cannoga.',
    alternates: {
        canonical: 'https://cannogacollege.ca/research/projects/',
    },
};

export default async function ProjectsPage() {
    const supabase = createStaticClient();
    const { data: projects } = await supabase
        .from('ResearchProject')
        .select('*')
        .order('createdAt', { ascending: false });

    return (
        <div className="min-h-screen bg-neutral-50 pt-32 pb-16 md:py-24">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8 text-neutral-900 pt-8">Research Projects</h1>
                <p className="text-neutral-600 mb-12 max-w-2xl text-lg">
                    Discover our ongoing initiatives driving innovation in sustainability, technology, and urban development.
                </p>
                <div className="grid gap-8">
                    {projects?.map((project) => (
                        <div key={project.id} className="bg-neutral-100 p-8 rounded-xl border-none transition-all text-black hover:bg-neutral-200/50">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="bg-white text-neutral-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                                            {project.fundingSource || 'Internal'}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-black mb-2">
                                        <Link href={`/research/projects/${project.slug}`} className="hover:underline transition-colors text-black">
                                            {project.title}
                                        </Link>
                                    </h2>
                                </div>
                                <div className="flex-shrink-0 w-full md:w-48 h-32 md:h-auto rounded-lg overflow-hidden bg-neutral-200 relative">
                                    {project.imageUrl ? (
                                        <img
                                            src={project.imageUrl}
                                            alt={project.title}
                                            className="w-full h-full object-cover object-top"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-neutral-300 text-neutral-500">
                                            <span className="text-xs uppercase font-bold tracking-widest text-neutral-400">No Image</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <p className="text-neutral-600 mb-8 max-w-4xl text-lg leading-relaxed">{project.description}</p>

                            <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
                                <div className="flex items-center gap-2 text-sm text-neutral-500">
                                    <span className="font-bold text-neutral-800">Lead:</span>
                                    <span>{project.leadResearcher}</span>
                                </div>
                                <Link href={`/research/projects/${project.slug}`} className="text-black font-bold flex items-center gap-2 hover:gap-3 transition-all">
                                    Read Project Details <ArrowRight size={18} weight="bold" />
                                </Link>
                            </div>
                        </div>
                    ))}

                    {(!projects || projects.length === 0) && (
                        <div className="text-center py-20 text-neutral-500">
                            No active research projects at the moment.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

