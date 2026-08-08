'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Link } from "@aalto-dx/react-components";
import { CaretLeft as ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import TimetableClient from './TimetableClient';
import { ClassSession, Subject } from '@/types/database';

export default function TimetablePage() {
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState<(ClassSession & { subject: Subject })[]>([]);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchTimetableData = async () => {
            try {
                const { data: { user: sbUser } } = await supabase.auth.getUser();
                let currentUserId = sbUser?.id;

                if (!sbUser) {
                    const savedUser = localStorage.getItem('Cannoga_user');
                    if (savedUser) {
                        const localProfile = JSON.parse(savedUser);
                        currentUserId = localProfile.id;
                    }
                }

                if (!currentUserId) {
                    router.push('/portal/account/login');
                    return;
                }

                const { data: student } = await supabase
                    .from('students')
                    .select('id, program_id')
                    .eq('user_id', currentUserId)
                    .maybeSingle();

                if (!student) {
                    router.push('/portal/dashboard');
                    return;
                }

                const { data: subjects } = await supabase
                    .from('Subject')
                    .select('id')
                    .eq('courseId', student.program_id);

                const subjectIds = subjects?.map(s => s.id) || [];

                if (subjectIds.length > 0) {
                    const { data: sessionsData } = await supabase
                        .from('class_sessions')
                        .select(`
                            *,
                            subject:Subject(*)
                        `)
                        .in('subject_id', subjectIds)
                        .order('session_date', { ascending: true })
                        .order('start_time', { ascending: true });
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
