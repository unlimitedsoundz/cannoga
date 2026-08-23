'use client';

import { createClient } from '@/utils/supabase/client';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { CaretLeft as ArrowLeft, FloppyDisk as Save, CircleNotch as Loader2 } from "@phosphor-icons/react";
import { Link } from "@aalto-dx/react-components";
import { useState, useEffect, Suspense } from 'react';

function ResearchProjectEditorContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const isNew = id === 'new';
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchProject = async () => {
            if (!id || isNew) {
                setLoading(false);
                return;
            }
            try {
                const { data, error } = await supabase.from('ResearchProject').select('*').eq('id', id).single();
                if (error || !data) {
                    console.error("Project not found");
                    return;
                }
                setProject(data);
            } catch (error) {
                console.error("Error fetching project:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id, isNew]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        const formData = new FormData(e.currentTarget);

        const data = {
            title: formData.get('title') as string,
            slug: formData.get('slug') as string,
            leadResearcher: formData.get('leadResearcher') as string,
            fundingSource: formData.get('fundingSource') as string,
            description: formData.get('description') as string,
            content: formData.get('content') as string,
            imageUrl: formData.get('imageUrl') as string,
        };

        try {
            if (isNew) {
                const { error } = await supabase.from('ResearchProject').insert(data);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('ResearchProject').update(data).eq('id', id);
                if (error) throw error;
            }
            router.push('/admin/research/projects/');
            router.refresh();
        } catch (error) {
            console.error("Error saving project:", error);
            alert("Error saving project");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 min-h-[60vh]">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    if (!isNew && !project && id) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold mb-4 text-neutral-900">Project Not Found</h2>
                <Link href="/admin/research/projects/" className="text-neutral-500 hover:text-black font-bold uppercase tracking-widest text-xs">
                    Back to Projects
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500 px-4 md:px-0">
            <Link href="/admin/research/projects/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-6 transition-colors font-bold">
                <ArrowLeft size={18} weight="bold" /> Back to Projects
            </Link>

            <h1 className="text-2xl md:text-3xl font-bold mb-8 uppercase tracking-tight text-neutral-900 leading-tight">
                {isNew ? 'New Research Project' : `Edit: ${project?.title}`}
            </h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-neutral-200 space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Project Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            defaultValue={project?.title || ''}
                            className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black focus:border-[#0a151a] outline-none transition-all font-bold"
                            placeholder="e.g. Carbon Neutral Construction 2030"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Slug (URL)</label>
                        <input
                            type="text"
                            name="slug"
                            required
                            defaultValue={project?.slug || ''}
                            className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black focus:border-[#0a151a] outline-none transition-all font-mono text-sm"
                            placeholder="e.g. carbon-neutral-2030"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Lead Researcher</label>
                        <input
                            type="text"
                            name="leadResearcher"
                            defaultValue={project?.leadResearcher || ''}
                            className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black focus:border-[#0a151a] outline-none transition-all font-bold"
                            placeholder="e.g. Dr. Sarah Mitchell"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Funding Source</label>
                        <input
                            type="text"
                            name="fundingSource"
                            defaultValue={project?.fundingSource || ''}
                            className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black focus:border-[#0a151a] outline-none transition-all font-bold"
                            placeholder="e.g. EU Horizon"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Short Description</label>
                    <textarea
                        name="description"
                        required
                        className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black focus:border-[#0a151a] outline-none transition-all h-24 font-bold"
                        defaultValue={project?.description || ''}
                        placeholder="Brief summary shown on the listing page..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Full Content</label>
                    <textarea
                        name="content"
                        className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black focus:border-[#0a151a] outline-none transition-all h-64 font-mono text-sm"
                        defaultValue={project?.content || ''}
                        placeholder="Markdown content or HTML..."
                    />
                    <p className="text-[10px] uppercase font-black text-neutral-400 tracking-widest mt-2">HTML or Markdown supported.</p>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Cover Image Link (URL)</label>
                    {project?.imageUrl && (
                        <div className="w-full max-w-[200px] aspect-video relative rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                            <img src={project.imageUrl} alt="Current" className="w-full h-full object-cover object-top" />
                        </div>
                    )}
                    <input
                        type="text"
                        name="imageUrl"
                        defaultValue={project?.imageUrl || ''}
                        className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black focus:border-[#0a151a] outline-none transition-all font-mono text-xs"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div className="pt-8 border-t border-neutral-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full md:w-auto bg-neutral-900 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors shadow-xl disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} weight="bold" /> : <Save size={18} weight="bold" />}
                        {isNew ? 'Create Project' : 'Update Project'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function ResearchProjectEditor() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        }>
            <ResearchProjectEditorContent />
        </Suspense>
    );
}


