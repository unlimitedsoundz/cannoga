'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Link } from "@aalto-dx/react-components";
import { CaretLeft as ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import HousingDashboardClient from './HousingClient';

export default function HousingPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{
        student: any;
        application: any;
        assignment: any;
        buildings: any[];
        semesters: any[];
        invoices: any[];
    } | null>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchHousingData = async () => {
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
                    .select('*, user:profiles(*)')
                    .eq('user_id', currentUserId || '')
                    .maybeSingle();

                if (!student) {
                    router.push('/portal/dashboard');
                    return;
                }

                // Parallel fetches
                const [appRes, assignRes, buildRes, semRes, invRes] = await Promise.all([
                    supabase.from('housing_applications').select('*, deposit:housing_deposits(*)').eq('student_id', student.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
                    supabase.from('housing_assignments').select('*, room:housing_rooms(*, building:housing_buildings(*))').eq('student_id', student.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
                    supabase.from('housing_buildings').select('*').order('name'),
                    supabase.from('semesters').select('*').order('start_date'),
                    supabase.from('housing_invoices').select('*, items:housing_invoice_items(*), payments:housing_payments(*)').eq('student_id', student.id).order('created_at', { ascending: false })
                ]);

                setData({
                    student,
                    application: appRes.data,
                    assignment: assignRes.data,
                    buildings: buildRes.data || [],
                    semesters: semRes.data || [],
                    invoices: invRes.data || []
                });
            } catch (err) {
                console.error('CRITICAL: Fetching housing data failed', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHousingData();
    }, [router, supabase]);

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
            </div>
        );
    }

    if (!data) return null;

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

                <HousingDashboardClient
                    student={data.student}
                    application={data.application}
                    assignment={data.assignment}
                    buildings={data.buildings}
                    semesters={data.semesters}
                    invoices={data.invoices}
                />
            </div>
        </div>
    );
}
