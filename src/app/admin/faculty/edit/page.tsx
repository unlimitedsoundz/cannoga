'use client';

import { createClient } from '@/utils/supabase/client';
import { CaretLeft as ArrowLeft, CircleNotch as Loader2 } from "@phosphor-icons/react";
import { Link } from "@aalto-dx/react-components";
import FacultyForm from '../FacultyForm';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function FacultyEditorContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const isNew = !id || id === 'new';
    const [facultyMember, setFacultyMember] = useState<any>(null);
    const [schools, setSchools] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: schoolsData } = await supabase.from('School').select('id, name');
                const { data: deptsData } = await supabase.from('Department').select('id, name, schoolId');

                setSchools(schoolsData || []);
                setDepartments(deptsData || []);

                if (!isNew && id) {
                    const { data: facultyData } = await supabase.from('Faculty').select('*').eq('id', id).single();
                    setFacultyMember(facultyData);
                }
            } catch (error) {
                console.error("Error fetching faculty editor data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isNew, supabase]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 min-h-[60vh]">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-12 animate-in fade-in duration-500 px-4 md:px-0">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Link href="/admin/faculty" className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors font-bold">
                    <ArrowLeft size={18} weight="bold" /> Back to Faculty
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-neutral-900 leading-tight">{isNew ? 'Create New Member' : 'Edit Faculty Member'}</h1>
            </div>

            <FacultyForm
                id={id || 'new'}
                isNew={isNew}
                facultyMember={facultyMember}
                schools={schools}
                departments={departments}
            />
        </div>
    );
}

export default function FacultyEditorPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center py-20 min-h-[60vh]">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        }>
            <FacultyEditorContent />
        </Suspense>
    );
}
