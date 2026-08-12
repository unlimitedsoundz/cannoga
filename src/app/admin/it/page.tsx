'use client';

import { createClient } from '@/utils/supabase/client';
import ITManagementClient from './ITManagementClient';
import { useState, useEffect } from 'react';
import { CircleNotch as Loader2 } from "@phosphor-icons/react";

export default function AdminITPage() {
    const [data, setData] = useState<{
        assets: any[];
        accessRecords: any[];
        students: any[];
    }>({
        assets: [],
        accessRecords: [],
        students: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchITData = async () => {
            const supabase = createClient();
            try {
                // Fetch IT assets
                const [{ data: assets }, { data: accessRecords }, { data: students }] = await Promise.all([
                    supabase.from('it_assets').select('*').order('name'),
                    supabase.from('student_it_access').select(`
                        *,
                        asset:it_assets(*),
                        student:students(
                            id,
                            student_id,
                            enrollment_status,
                            user:profiles(first_name, last_name, email)
                        )
                    `).order('created_at', { ascending: false }),
                    supabase.from('students').select('id, student_id, enrollment_status, user:profiles(first_name, last_name, email)').eq('enrollment_status', 'ACTIVE')
                ]);

                setData({
                    assets: assets || [],
                    accessRecords: accessRecords || [],
                    students: students || []
                });
            } catch (error) {
                console.error("Error fetching IT data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchITData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50/50 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <ITManagementClient
                    assets={data.assets}
                    accessRecords={data.accessRecords}
                    students={data.students}
                />
            </div>
        </div>
    );
}
