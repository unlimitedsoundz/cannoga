'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { OfferClient } from './OfferClient';

export default function StudentOfferPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{
        admission: any;
        appStatus: string | null;
    } | null>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchOfferData = async () => {
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

                // 2. Fetch Admission record with Course details
                const { data: admission } = await supabase
                    .from('admission_offers')
                    .select('*, application:applications(*, course:Course(*, school:School(*)))')
                    .eq('application_id', (
                        await supabase
                            .from('applications')
                            .select('id')
                            .eq('user_id', currentUserId || '')
                            .order('created_at', { ascending: false })
                            .limit(1)
                            .single()
                    ).data?.id || '')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                // 3. Fetch Application status
                const { data: app } = await supabase
                    .from('applications')
                    .select('status, id')
                    .eq('user_id', currentUserId || '')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                const appStatus = app?.status || null;
                const applicationId = app?.id || null;

                // 4. Fetch Profile to get the current student_id (source of truth)
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('student_id')
                    .eq('id', currentUserId || '')
                    .single();

                // If we have a profile with a student_id, use it to update the admission's student_id
                if (profile && profile.student_id) {
                    admission.student_id = profile.student_id;
                }

                setData({ admission: { ...admission, application_status: appStatus, application_id: applicationId }, appStatus });
            } catch (err) {
                console.error('CRITICAL: Fetching offer data failed', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOfferData();
    }, [router, supabase]);

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
            </div>
        );
    }

    if (!data) return null;

    if (!data.admission) {
        if (data.appStatus === 'ADMITTED') {
            return (
                <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100 text-center max-w-sm">
                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="animate-pulse text-xl">ðŸ“</span>
                        </div>
                        <h1 className="text-xl font-black uppercase mb-2 text-blue-600">Offer Processing</h1>
                        <p className="text-neutral-500 text-xs font-bold uppercase tracking-tight">
                            Admission approved! We are generating your formal Letter of Offer.
                            Please check back shortly.
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100 text-center max-w-sm">
                    <h1 className="text-xl font-black uppercase mb-2">No Active Offer</h1>
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-tight">
                        Official offer pending. Please check your application status on the dashboard.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 p-3 md:p-6">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-black uppercase tracking-tight mb-1 leading-none">Your Admission Offer</h1>
                    <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">Formal Invitation for Enrollment</p>
                </div>

                <OfferClient admission={data.admission} />
            </div>
        </div>
    );
}
