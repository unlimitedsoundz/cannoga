'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Link } from "@aalto-dx/react-components";
import { CaretLeft as ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import TimetableClient from './TimetableClient';
import { TimetableAssignment, Module, Room } from '@/types/database';

interface SessionRow extends TimetableAssignment {
  module: { code: string; title: string; credits: number } | null;
  room: Room | null;
  instructor: { first_name: string; last_name: string } | null;
  section: { session_type: string; delivery_mode: string } | null;
}

export default function TimetablePage() {
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState<SessionRow[]>([]);
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
                    .select('id, current_semester_id')
                    .eq('user_id', currentUserId)
                    .maybeSingle();

                if (!student) {
                    router.push('/portal/dashboard');
                    return;
                }

                const { data: enrollments } = await supabase
                    .from('module_enrollments')
                    .select('module_id, semester_id')
                    .eq('student_id', student.id)
                    .eq('status', 'REGISTERED');

                const moduleIds = enrollments?.map((e: { module_id: string }) => e.module_id) || [];
                const semesterIds = [...new Set(enrollments?.map((e: { semester_id: string }) => e.semester_id) || [])];

                if (moduleIds.length === 0 || semesterIds.length === 0) {
                    setSessions([]);
                    setLoading(false);
                    return;
                }

                const { data: sections } = await supabase
                    .from('course_sections')
                    .select('id')
                    .eq('semester_id', semesterIds[0])
                    .in('module_id', moduleIds);

                const sectionIds = sections?.map((s: { id: string }) => s.id) || [];
                if (sectionIds.length === 0) {
                    setSessions([]);
                    setLoading(false);
                    return;
                }

                const { data: versions } = await supabase
                    .from('timetable_versions')
                    .select('id')
                    .eq('semester_id', semesterIds[0])
                    .eq('status', 'PUBLISHED')
                    .order('version_number', { ascending: false })
                    .limit(1);

                if (!versions || versions.length === 0) {
                    setSessions([]);
                    setLoading(false);
                    return;
                }

                const { data: assignments } = await supabase
                    .from('timetable_assignments')
                    .select(`
                        *,
                        section:course_sections(session_type, delivery_mode),
                        module:modules(id, code, title, credits),
                        room:rooms(id, name, building, room_number),
                        instructor:profiles!timetable_assignments_instructor_id_fkey(first_name, last_name)
                    `)
                    .eq('version_id', versions[0].id)
                    .in('section_id', sectionIds)
                    .order('day_of_week', { ascending: true })
                    .order('start_time', { ascending: true });

                setSessions(assignments || []);
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
