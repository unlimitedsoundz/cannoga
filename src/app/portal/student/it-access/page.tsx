'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Link } from "@aalto-dx/react-components";
import { CaretLeft as ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import ItAccessClient from './ItAccessClient';

export default function ItAccessPage() {
    const [loading, setLoading] = useState(true);
    const [access, setAccess] = useState<any[]>([]);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchItAccessData = async () => {
            // Check for required env vars
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
                console.error("CRITICAL: Supabase environment variables are missing!");
                setLoading(false);
                return;
            }

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
                    .select('id, student_id')
                    .eq('user_id', currentUserId || '')
                    .single();

                if (!student) {
                    router.push('/portal/dashboard');
                    return;
                }

                // 2. Fetch IT Access
                const { data: accessData, error } = await supabase
                    .from('student_it_access')
                    .select(`
                        *,
                        asset:it_assets(*)
                    `)
                    .eq('student_id', student.id)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Error fetching IT access:', error.message, error.details);
                    // On static site, RLS might block if session isn't synced correctly
                    if (error.code === '42501') {
                        console.warn('RLS Policy violation: Ensure user is properly authenticated in Supabase.');
                    }
                }
                setAccess(accessData || []);
            } catch (err) {
                console.error('CRITICAL: Fetching IT access data failed', err);
            } finally {
                setLoading(false);
            }
        };

        fetchItAccessData();
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

                <ItAccessClient access={access} />
            </div>
        </div>
    );
}
