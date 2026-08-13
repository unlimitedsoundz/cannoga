'use client';

import { createClient } from '@/utils/supabase/client';
import { Link } from "@aalto-dx/react-components";
import { Plus, PencilSimple as Pencil, Trash, Microscope, CircleNotch as Loader2 } from "@phosphor-icons/react";
import { useState, useEffect } from 'react';

export default function ResearchProjectsAdmin() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchProjects = async () => {
        try {
            const { data } = await supabase
                .from('ResearchProject')
                .select('*')
                .order('createdAt', { ascending: false });
            setProjects(data || []);
        } catch (error) {
            console.error("Error fetching research projects:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const { error } = await supabase.from('ResearchProject').delete().eq('id', id);
            if (error) throw error;
            setProjects(projects.filter(p => p.id !== id));
        } catch (error: any) {
            alert("Error deleting project: " + error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3 uppercase tracking-tight">
                        <Microscope size={32} weight="bold" className="text-black" />
                        Research Projects
                    </h1>
                    <p className="text-neutral-500 font-medium text-sm">Manage research projects and publications</p>
                </div>
                <Link href="/admin/research/projects/editor?id=new" className="bg-neutral-900 text-white px-4 py-2 rounded-none font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all uppercase tracking-widest text-xs">
                    <Plus size={18} weight="bold" /> New Project
                </Link>
            </div>

            <div className="bg-white border border-neutral-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="hidden md:table-header-group bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                <th className="p-4 font-bold text-[10px] text-neutral-400 uppercase tracking-widest">Title</th>
                                <th className="p-4 font-bold text-[10px] text-neutral-400 uppercase tracking-widest">Slug</th>
                                <th className="p-4 font-bold text-[10px] text-neutral-400 uppercase tracking-widest">Funding</th>
                                <th className="p-4 font-bold text-[10px] text-neutral-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 block md:table-row-group">
                            {projects.map((project) => (
                                <tr key={project.id} className="hover:bg-neutral-50 group transition-colors block md:table-row p-4 md:p-0">
                                    <td className="block md:table-cell py-1 md:p-4 font-bold text-neutral-900 text-sm uppercase tracking-tight">{project.title}</td>
                                    <td className="block md:table-cell py-1 md:p-4 text-[10px] font-mono text-neutral-400 md:text-neutral-500">{project.slug}</td>
                                    <td className="block md:table-cell py-2 md:p-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="md:hidden text-[10px] font-bold text-neutral-400 uppercase">Funding:</span>
                                            <span className="bg-[#0a151a] text-white px-2 py-0.5 rounded-none text-[9px] font-bold uppercase tracking-tight">
                                                {project.fundingSource || 'N/A'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="block md:table-cell pt-4 md:p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/admin/research/projects/editor?id=${project.id}`} className="p-2 border border-neutral-200 rounded-none hover:bg-neutral-50" title="Edit">
                                                <Pencil size={18} weight="bold" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="p-2 border border-neutral-200 rounded-none hover:bg-red-50 text-red-600"
                                                title="Delete"
                                            >
                                                <Trash size={18} weight="bold" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {projects.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-20 text-center text-neutral-400">
                                        <Microscope size={48} weight="regular" className="mx-auto mb-4 opacity-10" />
                                        <p className="font-bold uppercase tracking-widest text-[10px]">No research projects found.</p>
                                        <Link href="/admin/research/projects/editor?id=new" className="text-amber-600 hover:underline mt-2 inline-block text-xs font-bold">
                                            Create one now →
                                        </Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

