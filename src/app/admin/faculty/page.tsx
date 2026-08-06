'use client';

import { createClient } from '@/utils/supabase/client';
import FacultyClient from './FacultyClient';
import { useState, useEffect } from 'react';
import { CircleNotch as Loader2 } from "@phosphor-icons/react";

export default function AdminFacultyPage() {
    const [faculty, setFaculty] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFaculty = async () => {
            const supabase = createClient();
            try {
                const { data } = await supabase
                    .from('Faculty')
                    .select('*, school:School(name), department:Department!departmentId(name)')
                    .order('name', { ascending: true });

                setFaculty(data || []);
            } catch (error) {
                console.error("Error fetching faculty:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFaculty();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    return <FacultyClient faculty={faculty} />;
}
