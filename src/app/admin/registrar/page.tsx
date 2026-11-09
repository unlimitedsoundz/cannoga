'use client';

import { createClient } from '@/utils/supabase/client';
import RegistrarClient from './RegistrarClient';
import { useState, useEffect } from 'react';
import { CircleNotch as Loader2, XCircle } from "@phosphor-icons/react";

export default function RegistrarPage() {
    const [data, setData] = useState<{
        semesters: any[];
        windows: any[];
        moduleStats: any[];
        provisionalGrades: any[];
        students: any[];
        buildings: any[];
        sessions: any[];
        auditLogs: any[];
        tuitionPayments: any[];
    }>({
        semesters: [],
        windows: [],
        moduleStats: [],
        provisionalGrades: [],
        students: [],
        buildings: [],
        sessions: [],
        auditLogs: [],
        tuitionPayments: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRegistrarData = async () => {
            const supabase = createClient();
            try {
                const [
                    { data: semesters },
                    { data: windows },
                    { data: moduleStats },
                    { data: provisionalGrades },
                    { data: students },
                    { data: buildings },
                    { data: sessions },
                    { data: auditLogs },
                    { data: tuitionPayments }
                ] = await Promise.all([
                    supabase.from('semesters').select('id, name, start_date, end_date, status').order('start_date', { ascending: false }).limit(50),
                    supabase.from('registration_windows').select('id, semester_id, status, open_at, close_at, semester:semesters(id, name)').limit(50),
                    supabase.from('modules').select(`
                        id, code, title, capacity,
                        module_enrollments(id, status, student:students(id, student_id, user:profiles(first_name, last_name)))
                    `).limit(100),
                    supabase.from('module_enrollments').select('id, student_id, module_id, semester_id, grade, grade_status, student:students(id, student_id, user:profiles(first_name, last_name)), module:modules(code, title)').eq('grade_status', 'PROVISIONAL').not('grade', 'is', null).limit(100),
                    supabase.from('students').select('id, student_id, enrollment_status, created_at, user:profiles(first_name, last_name, email), housing_assignments(status, room:housing_rooms(room_number, building:housing_buildings(name)))').order('created_at', { ascending: false }).limit(100),
                    supabase.from('housing_buildings').select('id, name, code, housing_rooms(count, status)').limit(50),
                    supabase.from('class_sessions').select('id, session_date, start_time, end_time, room, session_type, status, module:modules(code, title), semester:semesters(name)').order('day_of_week', { ascending: true }).order('start_time', { ascending: true }).limit(100),
                    supabase.from('audit_logs').select('id, action, entity_table, entity_id, actor_id, timestamp, metadata').order('timestamp', { ascending: false }).limit(20),
                    supabase.from('tuition_payments').select('id, amount, currency, status, payment_method, transaction_reference, created_at, offer:admission_offers(id, application:applications(id, user:profiles(first_name, last_name)))').order('created_at', { ascending: false }).limit(100)
                ]);

                setData({
                    semesters: semesters || [],
                    windows: windows || [],
                    moduleStats: moduleStats || [],
                    provisionalGrades: provisionalGrades || [],
                    students: students || [],
                    buildings: buildings || [],
                    sessions: sessions || [],
                    auditLogs: auditLogs || [],
                    tuitionPayments: tuitionPayments || []
                });
            } catch (error: any) {
                console.error("Error fetching registrar data:", error);
                setError(error.message || "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrarData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 min-h-[60vh]">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-20 text-center">
                <XCircle size={48} weight="bold" className="mx-auto mb-4 text-red-500 opacity-20" />
                <h2 className="text-xl font-bold text-neutral-900">Error loading data</h2>
                <p className="text-neutral-500 text-sm mt-1">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50/50 p-4 md:p-8 animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto">
                <RegistrarClient
                    semesters={data.semesters}
                    windows={data.windows}
                    moduleStats={data.moduleStats}
                    provisionalGrades={data.provisionalGrades}
                    students={data.students}
                    buildings={data.buildings}
                    sessions={data.sessions}
                    auditLogs={data.auditLogs}
                    tuitionPayments={data.tuitionPayments}
                />
            </div>
        </div>
    );
}
