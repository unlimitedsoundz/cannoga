'use client';

import { createClient } from '@/utils/supabase/client';
import { CaretLeft as ArrowLeft, FloppyDisk as Save, Book, Hash, Stack as Layers, CircleNotch as Loader2 } from "@phosphor-icons/react";
import { Link } from "@aalto-dx/react-components";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SubjectEditorContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const isNew = !id || id === 'new';
    const [subject, setSubject] = useState<any>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesRes, subjectRes] = await Promise.all([
                    supabase.from('Course').select('id, title').order('title'),
                    !isNew && id ? supabase.from('Subject').select('*').eq('id', id).single() : Promise.resolve({ data: null })
                ]);

                setCourses(coursesRes.data || []);
                if (subjectRes.data) {
                    setSubject(subjectRes.data);
                }
            } catch (error) {
                console.error("Error fetching subject data:", error);
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
        const data = {
            name: formData.get('name') as string,
            code: formData.get('code') as string,
            courseId: formData.get('courseId') as string,
            creditUnits: parseInt(formData.get('creditUnits') as string),
            semester: parseInt(formData.get('semester') as string),
        };

        try {
            if (isNew) {
                const { error } = await supabase.from('Subject').insert(data);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('Subject').update(data).eq('id', id);
                if (error) throw error;
            }
            router.push('/admin/subjects/');
            router.refresh();
        } catch (error) {
            console.error("Error saving subject:", error);
            alert("Error saving subject");
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
                <Link href="/admin/subjects/" className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors font-bold">
                    <ArrowLeft size={18} weight="bold" /> Back to Subjects
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-neutral-900 leading-tight">{isNew ? 'New Subject' : 'Edit Subject'}</h1>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden"
            >
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-sm font-bold text-neutral-600 flex items-center gap-1"><Book size={14} weight="bold" /> Subject Name</label>
                            <input
                                name="name"
                                defaultValue={subject?.name || ''}
                                required
                                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none"
                                placeholder="e.g. Introduction to Renewable Energy"
                            />
                        </div>

                        {/* Code */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-neutral-600 flex items-center gap-1"><Hash size={14} weight="bold" /> Subject Code</label>
                            <input
                                name="code"
                                defaultValue={subject?.code || ''}
                                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none"
                                placeholder="e.g. RE 101"
                            />
                        </div>

                        {/* Course Association */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-neutral-600">Associated Course</label>
                            <select
                                name="courseId"
                                defaultValue={subject?.courseId || courses?.[0]?.id}
                                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none"
                            >
                                {courses?.map(c => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                            </select>
                        </div>

                        {/* Credits */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-neutral-600">Credits</label>
                            <input
                                name="creditUnits"
                                type="number"
                                defaultValue={subject?.creditUnits !== undefined ? subject.creditUnits : 3}
                                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none"
                            />
                        </div>

                        {/* Semester */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-neutral-600 flex items-center gap-1"><Layers size={14} weight="bold" /> Semester</label>
                            <input
                                name="semester"
                                type="number"
                                min="1"
                                max="8"
                                defaultValue={subject?.semester || 1}
                                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-neutral-50 p-6 border-t border-neutral-200 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-[#0a151a] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-neutral-800 transition-colors shadow-lg disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} weight="bold" /> : <Save size={18} weight="bold" />}
                        {isNew ? 'Create Subject' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function SubjectEditorPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center py-20 min-h-[60vh]">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        }>
            <SubjectEditorContent />
        </Suspense>
    );
}

