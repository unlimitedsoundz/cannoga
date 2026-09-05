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
                .select('role')
                .eq('id', user.id)
                .single();

            if (profile?.role === 'ADMIN') {
                router.replace('/sis/admin/');
                return;
            }

            if (profile?.role === 'STUDENT') {
                // Only allow SIS access once tuition deposit is confirmed
                const { data: studentRecord } = await supabase
                    .from('students')
                    .select('tuition_deposit_paid, enrollment_status')
                    .eq('user_id', user.id)
                    .maybeSingle();

                const depositVerified =
                    studentRecord?.tuition_deposit_paid === true &&
                    (studentRecord?.enrollment_status === 'ACTIVE' ||
                        studentRecord?.enrollment_status === 'CONFIRMED');

                if (depositVerified) {
                    router.replace('/sis/');
                    return;
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