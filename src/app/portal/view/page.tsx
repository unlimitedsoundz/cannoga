'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function PortalViewPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const redirect = async () => {
            try {
                if (id) {
                    router.replace(`/portal/application/view?id=${id}`);
                    return;
                }

                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    router.replace('/portal/account/login');
                    return;
                }

                const { data: application } = await supabase
                    .from('applications')
                    .select('id')
                    .eq('user_id', user.id)
                    .single();

                if (application) {
                    router.replace(`/portal/application/view?id=${application.id}`);
                } else {
                    router.replace('/portal/apply');
                }
            } catch (err) {
                console.error('Redirect error:', err);
                router.replace('/portal/dashboard');
            } finally {
                setLoading(false);
            }
        };

        redirect();
    }, [id, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    return null;
}
