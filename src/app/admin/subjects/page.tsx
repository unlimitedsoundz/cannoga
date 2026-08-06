'use client';

import { createClient } from '@/utils/supabase/client';
import SubjectsClient from './SubjectsClient';
import { useState, useEffect } from 'react';
import { CircleNotch as Loader2 } from "@phosphor-icons/react";

export default function AdminSubjectsPage() {
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubjects = async () => {
            const supabase = createClient();
            try {
                // Fetch subjects with their associated courses
                const { data } = await supabase
                    .from('Subject')
                    .select('*, course:Course(title)')
                    .order('semester', { ascending: true });

                setSubjects(data || []);
            } catch (error) {
                console.error("Error fetching subjects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    return <SubjectsClient subjects={subjects} />;
}
