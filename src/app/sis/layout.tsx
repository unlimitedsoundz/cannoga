'use client';

import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function SISLayout({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const pathname = usePathname() || '';

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const supabase = createClient();
                const { data: { user: sbUser }, error: authError } = await supabase.auth.getUser();

                if (authError || !sbUser) {
                    window.location.href = '/portal/account/login?redirectedFrom=' + encodeURIComponent(pathname);
                    return;
                }

                const { data: prof, error: profError } = await supabase
                    .from('profiles')
                    .select('id, role, email, first_name, last_name')
                    .eq('id', sbUser.id)
                    .single();

                if (profError || !prof) {
                    window.location.href = '/portal/account/login';
                    return;
                }

                if (prof.role === 'ADMIN') {
                    if (!pathname.startsWith('/sis/admin') && pathname === '/sis') {
                        window.location.href = '/sis/admin';
                        return;
                    }
                } else if (prof.role === 'STUDENT' || prof.role === 'APPLICANT') {
                    if (pathname.startsWith('/sis/admin')) {
                        window.location.href = '/portal/dashboard';
                        return;
                    }
                } else {
                    window.location.href = '/portal/account/login';
                    return;
                }

                setAuthorized(true);
                setLoading(false);
            } catch (err) {
                console.error("SIS auth check error:", err);
                setError('Failed to load profile. Please try again.');
            }
        };

        checkAuth();
    }, [pathname]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center font-sans">
                <div className="animate-spin rounded-full border-2 border-t-transparent border-neutral-900 h-8 w-8"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center font-sans flex-col items-center gap-4">
                <div className="text-center p-6">
                    <h2 className="text-xl font-bold text-neutral-900 mb-2">Authentication Error</h2>
                    <p className="text-neutral-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.href = '/portal/account/login'}
                        className="px-6 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    if (!authorized) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5] font-sans text-black" data-theme="sis">
            {children}
        </div>
    );
}