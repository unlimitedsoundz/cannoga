'use client';

import { ReactNode, useState, useEffect, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { SISHeader } from '@/components/sis/SISHeader';
import { SISSidebar } from '@/components/sis/SISSidebar';
import { Toaster, toast } from 'sonner';

interface Profile {
    id: string;
    role: string;
    email: string;
    first_name: string;
    last_name: string;
    student_id?: string;
    portal_access_disabled?: boolean;
    sis_access_disabled?: boolean;
}

interface StudentAccessRecord {
    enrollment_status: string | null;
    sis_access_disabled: boolean | null;
}

export default function SISLayout({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();
    const authCacheRef = useRef<{
        sbUser: { id: string; email?: string };
        prof: Profile;
        studentRecord?: StudentAccessRecord | null;
    } | null>(null);
    const pathname = usePathname() || '';

    const isAdminPath = pathname.startsWith('/sis/admin');
    const isStudentDashboard = pathname === '/sis';

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const supabase = createClient();
                let sbUser = authCacheRef.current?.sbUser;
                let prof = authCacheRef.current?.prof;

                if (!sbUser || !prof) {
                    const { data: { user: fetchedUser }, error: authError } = await supabase.auth.getUser();

                    if (authError || !fetchedUser) {
                        router.replace('/portal/account/login?redirectedFrom=' + encodeURIComponent(pathname));
                        return;
                    }

                    const { data: fetchedProf, error: profError } = await supabase
                        .from('profiles')
                        .select('id, role, email, first_name, last_name, student_id, portal_access_disabled, sis_access_disabled')
                        .eq('id', fetchedUser.id)
                        .single();

                    if (profError || !fetchedProf) {
                        router.replace('/portal/account/login');
                        return;
                    }

                    sbUser = { id: fetchedUser.id, email: fetchedUser.email };
                    prof = fetchedProf;
                    authCacheRef.current = { sbUser, prof: fetchedProf };
                }

                if (!sbUser || !prof) return;

                const userEmail = (sbUser.email || '').toLowerCase().trim();

                if (prof.role === 'ADMIN') {
                    if (pathname.startsWith('/sis/payments')) {
                        router.replace('/sis/admin/finance');
                        return;
                    }
                    if (!isAdminPath && !isStudentDashboard) {
                        router.replace('/sis/admin');
                        return;
                    }
                } else if (prof.role === 'STUDENT' || userEmail.endsWith('@cannogacollege.ca')) {
                    if (isAdminPath) {
                        router.replace('/portal/dashboard');
                        return;
                    }

                    // SIS access follows the enrolled student record, regardless of email provider.
                    let studentRecord = authCacheRef.current?.studentRecord;
                    if (studentRecord === undefined) {
                        const { data: fetchedStudent } = await supabase
                            .from('students')
                            .select('enrollment_status, sis_access_disabled')
                            .eq('user_id', sbUser.id)
                            .maybeSingle();
                        studentRecord = fetchedStudent || null;
                        if (authCacheRef.current) {
                            authCacheRef.current.studentRecord = studentRecord;
                        }
                    }

                    if (prof.sis_access_disabled || studentRecord?.sis_access_disabled) {
                        if (!prof.portal_access_disabled) {
                            router.replace('/portal/dashboard?message=sis_access_disabled');
                        } else {
                            await supabase.auth.signOut();
                            router.replace('/portal/account/login?message=access_disabled');
                        }
                        return;
                    }

                    const isEnrolled = ['ACTIVE', 'CONFIRMED', 'ENROLLED'].includes(studentRecord?.enrollment_status || '');

                    if (!studentRecord || !isEnrolled) {
                        router.replace('/portal/dashboard');
                        return;
                    }

                    if (prof.role !== 'STUDENT') {
                        prof.role = 'STUDENT';
                        try {
                            fetch('/api/auth/link-student/', { method: 'POST' }).catch(() => {});
                        } catch {}
                    }
                } else if (prof.role === 'APPLICANT') {
                    // APPLICANTs must stay in the applicant portal until
                    // their tuition deposit is paid and admin-verified.
                    router.replace('/portal/dashboard');
                    return;
                } else {
                    router.replace('/portal/account/login');
                    return;
                }

                setProfile(prof);
                setAuthorized(true);
                setLoading(false);
            } catch (err) {
                console.error("SIS auth check error:", err);
                setError('Failed to load profile. Please try again.');
            }
        };

        checkAuth();
    }, [pathname, isAdminPath, isStudentDashboard, router]);

    const handleLogout = useCallback(async () => {
        try {
            const supabase = createClient();
            await supabase.auth.signOut();
            toast.success('Signed out due to inactivity');
            setTimeout(() => {
                if (typeof window !== 'undefined' && window.location.pathname.startsWith('/sis/admin')) {
                    router.replace('/portal/account/admin-login');
                } else {
                    router.replace('/portal/account/login');
                }
            }, 1000);
        } catch (error) {
            console.error('Auto-logout error:', error);
        }
    }, [router]);

    useEffect(() => {
        if (!authorized || !profile) return;

        const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes
        const WARNING_TIMEOUT = 14.5 * 60 * 1000; // 30 seconds before logout
        let idleTimer: NodeJS.Timeout;
        let warningTimer: NodeJS.Timeout;

        const resetTimer = () => {
            clearTimeout(idleTimer);
            clearTimeout(warningTimer);

            warningTimer = setTimeout(() => {
                toast.warning('You will be logged out in 30 seconds due to inactivity', {
                    duration: 30000,
                    action: {
                        label: 'Stay Signed In',
                        onClick: () => {
                            clearTimeout(idleTimer);
                            resetTimer();
                        },
                    },
                });
            }, WARNING_TIMEOUT);

            idleTimer = setTimeout(() => {
                handleLogout();
            }, IDLE_TIMEOUT);
        };

        const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
        activityEvents.forEach(event => {
            window.addEventListener(event, resetTimer);
        });

        resetTimer();

        return () => {
            clearTimeout(idleTimer);
            clearTimeout(warningTimer);
            activityEvents.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [authorized, profile, handleLogout]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a151a] flex items-center justify-center font-sans">
                <div className="animate-spin rounded-full border-2 border-t-transparent border-white h-8 w-8"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0a151a] flex items-center justify-center font-sans">
                <div className="text-center p-6">
                    <h2 className="text-xl font-bold text-white mb-2">Authentication Error</h2>
                    <p className="text-slate-800 mb-4">{error}</p>
                    <button
                        onClick={() => router.replace('/portal/account/login')}
                        className="px-6 py-2 bg-white text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors font-bold text-sm"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    if (!authorized || !profile) {
        return null;
    }

    const adminNavItems: { label: string; href?: string; key?: string; children?: { key: string; label: string; href: string }[] }[] = [
        { label: 'DASHBOARD', href: '/sis/admin' },
        { label: 'STUDENTS', href: '/sis/admin/students' },
        { label: 'APPLICATIONS', href: '/sis/admin/applications' },
        { label: 'ADMISSIONS', href: '/sis/admin/admissions' },
        { label: 'FACULTY', href: '/sis/admin/faculty' },
        { label: 'FINANCE', href: '/sis/admin/finance' },
        { label: 'HOUSING', href: '/sis/admin/housing' },
        { label: 'ACADEMICS', href: '/sis/admin/academics' },
        { label: 'SCHEDULING', href: '/sis/admin/scheduling' },
        { label: 'TIMETABLE', href: '/sis/admin/timetable' },
        { label: 'REGISTRATION', href: '/sis/admin/registration' },
        { label: 'MICROSOFT 365', href: '/sis/admin/integrations/microsoft' },
        { label: 'DOCUMENTS', href: '/sis/admin/documents' },
        { 
            key: 'website-cms', 
            label: 'WEBSITE CMS', 
            href: '/sis/admin/website',
            children: [
                { key: 'web-pages', label: 'Pages', href: '/sis/admin/website/pages' },
                { key: 'web-page-contents', label: 'Page Contents', href: '/sis/admin/website/page-contents' },
                { key: 'web-blog', label: 'Blog', href: '/sis/admin/blog' },
                { key: 'web-schools', label: 'Schools', href: '/sis/admin/website/schools' },
                { key: 'web-news', label: 'News', href: '/sis/admin/website/news' },
                { key: 'web-events', label: 'Events', href: '/sis/admin/website/events' },
                { key: 'web-faqs', label: 'FAQs', href: '/sis/admin/website/faqs' },
                { key: 'web-tuition', label: 'Tuition', href: '/sis/admin/website/tuition' },
                { key: 'web-announcements', label: 'Announcements', href: '/sis/admin/website/announcements' },
            ]
        },
        { label: 'EVENTS', href: '/sis/admin/website/events' },
        { label: 'REPORTS', href: '/sis/admin/reports' },
        { label: 'AUDIT', href: '/sis/admin/audit' },
        { label: 'NOTIFICATIONS', href: '/sis/admin/notifications' },
        { label: 'SETTINGS', href: '/sis/admin/settings' },
        { label: 'DEBBIE VOICE', href: '/sis/admin/debbie' },
        { label: 'VOICE AGENT', href: '/sis/admin/voice-agent' },
    ];

    const navItems = profile.role === 'ADMIN' ? adminNavItems : [];

    if (isAdminPath) {
        return (
            <div className="min-h-screen bg-[#0a151a] font-sans text-white flex flex-col" data-theme="sis-dark">
                <SISHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} role={profile.role as 'ADMIN' | 'STUDENT' | null} profile={profile} studentId={profile.student_id || ''} />
                <div className="flex flex-1 overflow-hidden">
                    <SISSidebar
                        items={navItems}
                        pathname={pathname}
                        open={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                    />
                    <main className="flex-1 overflow-y-auto no-scrollbar">
                        <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
                <Toaster position="top-right" theme="dark" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5] font-sans text-black" data-theme="sis">
            {children}
            <Toaster position="top-right" />
        </div>
    );
}
