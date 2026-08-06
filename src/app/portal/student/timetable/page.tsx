'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Link } from "@aalto-dx/react-components";
import { CaretLeft as ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import TimetableClient from './TimetableClient';

export default function TimetablePage() {
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState<any[]>([]);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchTimetableData = async () => {
            try {
                // 1. Primary Auth Check (Supabase)
                const { data: { user: sbUser } } = await supabase.auth.getUser();
                let currentUserEmail = sbUser?.email;
                let currentUserId = sbUser?.id;

                // 2. Secondary Auth Check (LocalStorage Fallback)
                if (!sbUser) {
                    const savedUser = localStorage.getItem('Cannoga_user');
                    if (savedUser) {
                        const localProfile = JSON.parse(savedUser);
                        currentUserEmail = localProfile.email;
                        currentUserId = localProfile.id;
                    }
                }

                if (!currentUserEmail) {
                    router.push('/portal/account/login');
                    return;
                }

                const { data: student } = await supabase
                    .from('students')
                    .select('id')
                    .eq('user_id', currentUserId || '')
                    .maybeSingle();

                if (!student) {
                    router.push('/portal/dashboard');
                    return;
                }

                // 2. Fetch Sessions for modules the student is registered for
                const { data: enrollments } = await supabase
                    .from('module_enrollments')
                    .select('module_id')
                    .eq('student_id', student.id)
                    .eq('status', 'REGISTERED');

                const moduleIds = enrollments?.map(e => e.module_id) || [];

                if (moduleIds.length > 0) {
                    const { data: sessionsData } = await supabase
                        .from('class_sessions')
                        .select(`
                            *,
                            module:modules(*)
                        `)
                        .in('module_id', moduleIds);
                    setSessions(sessionsData || []);
                }
            } catch (err) {
                console.error('CRITICAL: Fetching timetable data failed', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTimetableData();
    }, [router, supabase]);

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50/50 p-2 md:p-6 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="mb-4">
                    <Link
                        href="/portal/student"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-black transition-colors"
                    >
                        <ArrowLeft size={14} /> Back to Dashboard
                    </Link>
                </div>

                <TimetableClient sessions={sessions} />
            </div>
        </div>
    );
}
