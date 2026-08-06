'use client';

import { ReactNode, useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import PortalHeader from '@/components/portal/PortalHeader';
import { ProgressIndicator } from "@aalto-dx/react-components";

export default function PortalLayout({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();
    const pathname = usePathname() || '';

    // Public paths that don't require authentication
    const publicPaths = [
        '/portal/account/login',
        '/portal/account/register',
        '/portal/account/admin-login',
        '/portal/account/reset-password'
    ];

    // Normalize path for matching (handle trailing slashes and normalize to lower case)
    const normalizedPath = pathname ? pathname.replace(/\/$/, '').toLowerCase() : '';
    const isPublicPath = publicPaths.includes(normalizedPath);

    console.log('[PortalLayout] Path check:', { pathname, normalizedPath, isPublicPath });

    const supabase = useMemo(() => isPublicPath ? null : createClient(), [isPublicPath]);

    useEffect(() => {
        const checkAuth = async () => {
            // Normalize path for matching (handle trailing slashes and normalize to lower case)
            const normalizedPath = pathname ? pathname.replace(/\/$/, '').toLowerCase() : '';
            const isPublicPath = publicPaths.includes(normalizedPath);

            console.log('[PortalLayout] Auth Check Check:', { pathname, normalizedPath, isPublicPath });

            console.log('Portal Auth Check:', { pathname, normalizedPath, isPublicPath });

            if (isPublicPath) {
                // Skip auth checks for public paths
                console.log('Public path detected, skipping auth');
                setAuthorized(false);
                setLoading(false);
                return;
            }

            if (!supabase) {
                console.log('No supabase client for non-public path');
                setLoading(false);
                return;
            }

            try {
                // 1. Check real Supabase Auth
                const { data: { user: sbUser }, error: userError } = await supabase.auth.getUser();

                console.log('[PortalLayout] Supabase User Check:', {
                    hasUser: !!sbUser,
                    userId: sbUser?.id,
                    email: sbUser?.email,
                    error: userError
                });

                if (sbUser) {
                    // Even if we have a Supabase user, we verify the profile exists in DB
                    const { data: prof, error: profError } = await supabase
                        .from('profiles')
                        .select('id, role')
                        .eq('id', sbUser.id)
                        .single();

                    console.log('[PortalLayout] Profile Check:', {
                        hasProfile: !!prof,
                        role: prof?.role,
                        error: profError
                    });

                    if (prof) {
                        setAuthorized(true);
                        setLoading(false);
                        return;
                    }
                }

                // 2. Database-Validated Session
                // We now allow the Middleware to handle the primary protection.
                // We keep the state update to show content when ready.

                if (!isPublicPath && !sbUser) {
                    // Only log warning, let middleware handle full redirects if simulated
                    console.log('[PortalLayout] No session detected in Client Layout (Middleware should have caught this?)');
                    // We can opt to NOT redirect here immediately to let the server action/middleware do its job
                    // But if we truly have no user, we shouldn't show content.
                    setLoading(false); // Stop loading, show nothing or allow access if middleware allows
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error("Portal auth check error:", error);
                if (!isPublicPath) {
                    router.push('/portal/account/login');
                } else {
                    setLoading(false);
                }
            }
        };

        checkAuth();
    }, [pathname, router, supabase]);

    if (loading && !authorized) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center font-open-sans">
                <ProgressIndicator size={32} />
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-white flex flex-col font-sans text-base`} data-theme="portal">
            <PortalHeader />
            <main className="flex-1 pt-16 container mx-auto px-4 py-8 md:py-12">
                {children}
            </main>
            <footer className="bg-[#9c27b3] text-white py-12 mt-auto">
                <div className="container mx-auto px-4 text-center text-[10px] font-medium uppercase tracking-widest text-white">
                    &copy; {new Date().getFullYear()} Cannoga College Portal. Secure Admissions Environment.
                    <span className="mx-2 text-white/40">|</span>
                    <a href="/student-handbook" className="text-white hover:text-white transition-colors">Student Handbook</a>
                    <span className="mx-2 text-white/40">|</span>
                    <a href="/code-of-conduct" className="text-white hover:text-white transition-colors">Code of Conduct</a>
                    <span className="mx-2 text-white/40">|</span>
                    <a href="/refund-withdrawal-policy/" className="text-white hover:text-white transition-colors">Refund Policy</a>
                </div>
            </footer>
        </div>
    );
}

