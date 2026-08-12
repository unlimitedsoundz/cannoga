'use client';

import { createClient } from '@/utils/supabase/client';
import { CaretLeft as ArrowLeft, CircleNotch as Loader2 } from "@phosphor-icons/react";
import { Link } from "@aalto-dx/react-components";
import DepartmentForm from '../DepartmentForm';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function DepartmentEditorContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [department, setDepartment] = useState<any>(null);
    const [schools, setSchools] = useState<any[]>([]);
    const [facultyMembers, setFacultyMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setLoading(false);
                return;
            }
            try {
                const [
                    { data: dept },
                    { data: schoolsData },
                    { data: facultyData }
                ] = await Promise.all([
                    supabase.from('Department').select('*').eq('id', id).single(),
                    supabase.from('School').select('id, name'),
                    supabase.from('Faculty').select('id, name, role').order('name', { ascending: true })
                ]);

                setDepartment(dept);
                setSchools(schoolsData || []);
                setFacultyMembers(facultyData || []);
            } catch (error) {
                console.error("Error fetching department data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, supabase]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 min-h-[60vh]">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    if (!department && id) { // Only show not found if an ID was provided but no department found
        return (
            <div className="p-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Department Not Found</h1>
                <Link href="/admin/departments" className="text-blue-600 font-bold hover:underline">
                    Back to Departments
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-24 animate-in fade-in duration-500">
            <div className="mb-8 flex items-center justify-between">
                <Link href="/admin/departments" className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors font-bold">
                    <ArrowLeft size={18} weight="bold" /> Back to Departments
                </Link>
                <h1 className="text-3xl font-bold uppercase tracking-tight text-neutral-900">Edit Department</h1>
            </div>

            <DepartmentForm
                department={department}
                schools={schools}
                facultyMembers={facultyMembers}
            />
        </div>
    );
}

export default function DepartmentEditorPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center py-20 min-h-[60vh]">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        }>
            <DepartmentEditorContent />
        </Suspense>
    );
}
