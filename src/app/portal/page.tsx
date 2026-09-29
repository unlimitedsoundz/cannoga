'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PortalIndexPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.replace('/portal/account/login/');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role, portal_access_disabled, sis_access_disabled')
                .eq('id', user.id)
                .single();

            if (profile?.portal_access_disabled) {
                await supabase.auth.signOut();
                router.replace('/portal/account/login?message=access_disabled');
                return;
            }

            if (profile?.role === 'ADMIN') {
                router.replace('/sis/admin/');
                return;
            }

            if (profile?.role === 'STUDENT' && !profile?.sis_access_disabled) {
                // Only allow SIS access once tuition deposit is confirmed and SIS access is active
                const { data: studentRecord } = await supabase
                    .from('students')
                    .select('tuition_deposit_paid, enrollment_status, sis_access_disabled')
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (!studentRecord?.sis_access_disabled) {
                    const depositVerified =
                        studentRecord?.tuition_deposit_paid === true &&
                        (studentRecord?.enrollment_status === 'ACTIVE' ||
                            studentRecord?.enrollment_status === 'CONFIRMED');

                    if (depositVerified) {
                        router.replace('/sis/');
                        return;
                    }
                }
            }

            // APPLICANT, unverified STUDENT, and all other roles stay in the portal
            router.replace('/portal/dashboard/');
        };

        checkAuth();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900" />
            </div>
        );
    }

    return null;
}