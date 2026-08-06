'use client';

import { createClient } from '@/utils/supabase/client';
import { CaretLeft as ArrowLeft, FloppyDisk as Save, CircleNotch as Loader2 } from "@phosphor-icons/react";
import { Link } from "@aalto-dx/react-components";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function CourseEditorContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const isNew = !id || id === 'new';
    const router = useRouter();

    const [course, setCourse] = useState<any>(null);
    const [schools, setSchools] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    { data: schoolsData },
                    { data: deptsData }
                ] = await Promise.all([
                    supabase.from('School').select('id, name'),
                    supabase.from('Department').select('id, name, schoolId')
                ]);

                setSchools(schoolsData || []);
                setDepartments(deptsData || []);

                if (!isNew && id) {
                    const { data } = await supabase.from('Course').select('*').eq('id', id).single();
                    setCourse(data);
                }
            } catch (error) {
                console.error("Error fetching course data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isNew, supabase]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            if (isNew) {
                const { error } = await supabase.from('Course').insert([data]);
                if (error) throw error;
                alert("Course created successfully");
            } else {
                const { error } = await supabase.from('Course').update(data).eq('id', id);
                if (error) throw error;
                alert("Course updated successfully");
            }
            router.push('/admin/courses');
            router.refresh();
        } catch (error: any) {
            alert("Error saving course: " + error.message);
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

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500 px-4 md:px-0">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Link href="/admin/courses" className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors font-bold">
                    <ArrowLeft size={18} weight="bold" /> Back to Courses
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">{isNew ? 'Create New Course' : 'Edit Course'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden">
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Course Title</label>
                            <input
                                name="title"
                                defaultValue={course?.title || ''}
                                required
                                className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black outline-none font-bold text-sm"
                                placeholder="e.g. BSc in Accounting & Finance"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">URL Slug</label>
                            <input
                                name="slug"
                                defaultValue={course?.slug || ''}
                                required
                                className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black outline-none font-bold text-sm"
                                placeholder="e.g. bsc-accounting-finance"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Degree Level</label>
                            <select
                                name="degreeLevel"
                                defaultValue={course?.degreeLevel || 'BACHELOR'}
                                className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl outline-none font-bold text-sm"
                            >
                                <option value="BACHELOR">Bachelor's Degree</option>
                                <option value="MASTER">Master's Degree</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Credits</label>
                            <input
                                name="credits"
                                type="number"
                                defaultValue={course?.credits || 180}
                                className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl outline-none font-bold text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">School</label>
                            <select
                                name="schoolId"
                                defaultValue={course?.schoolId || schools?.[0]?.id}
                                className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl outline-none font-bold text-sm"
                            >
                                {schools?.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Duration</label>
                            <input
                                name="duration"
                                defaultValue={course?.duration || '3 years'}
                                className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl outline-none font-bold text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Program Type</label>
                            <select
                                name="programType"
                                defaultValue={course?.programType || 'Full-time'}
                                className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl outline-none font-bold text-sm"
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Distance Learning">Distance Learning</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Study Mode (Detail)</label>
                            <input
                                name="studyMode"
                                defaultValue={course?.studyMode || 'On-Campus'}
                                className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl outline-none font-bold text-sm"
                                placeholder="e.g. On-Campus, Hybrid"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Description</label>
                        <textarea
                            name="description"
                            defaultValue={course?.description || ''}
                            rows={4}
                            className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl outline-none resize-none font-medium text-sm leading-relaxed"
                        />
                    </div>
                </div>

                <div className="bg-neutral-50 p-6 border-t border-neutral-200 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-[#9c27b3] text-white px-8 py-3.5 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-200 disabled:opacity-50"
                    >
                        <Save size={18} weight="bold" /> {saving ? 'Saving...' : (isNew ? 'Create Course' : 'Save Changes')}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function CourseEditorPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center py-20 min-h-[60vh]">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        }>
            <CourseEditorContent />
        </Suspense>
    );
}

