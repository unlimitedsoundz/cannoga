'use client';

import { createClient } from '@/utils/supabase/client';
import CoursesClient from './CoursesClient';
import { useState, useEffect } from 'react';
import { CircleNotch as Loader2 } from "@phosphor-icons/react";

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            const supabase = createClient();
            try {
                const { data } = await supabase
                    .from('Course')
                    .select('*, school:School(name)')
                    .order('createdAt', { ascending: false });

                setCourses(data || []);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    return <CoursesClient courses={courses} />;
}
