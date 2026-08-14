'use client';

import { ReactNode, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
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
}

export default function SISLayout({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname() || '';

    const isAdminPath = pathname.startsWith('/sis/admin');
    const isStudentDashboard = pathname === '/sis';

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
                    .select('id, role, email, first_name, last_name, student_id')
                    .eq('id', sbUser.id)
                    .single();

                if (profError || !prof) {
                    window.location.href = '/portal/account/login';
                    return;
                }

                if (prof.role === 'ADMIN') {
                    if (!isAdminPath && !isStudentDashboard) {
                        window.location.href = '/sis/admin';
                        return;
                    }
                } else if (prof.role === 'STUDENT' || prof.role === 'APPLICANT') {
                    if (isAdminPath) {
                        window.location.href = '/portal/dashboard';
                        return;
                    }
                } else {
                    window.location.href = '/portal/account/login';
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
    }, [pathname, isAdminPath, isStudentDashboard]);

    const handleLogout = useCallback(async () => {
        try {
            const supabase = createClient();
            await supabase.auth.signOut();
            toast.success('Signed out due to inactivity');
            setTimeout(() => {
                if (typeof window !== 'undefined' && window.location.pathname.startsWith('/sis/admin')) {
                    window.location.href = '/portal/account/admin-login';
                } else {
                    window.location.href = '/portal/account/login';
                }
            }, 1000);
        } catch (error) {
            console.error('Auto-logout error:', error);
        }
    }, []);

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
                        onClick={() => window.location.href = '/portal/account/login'}
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

    const adminNavItems = [
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
        { label: 'DOCUMENTS', href: '/sis/admin/documents' },
        { label: 'PAGE CONTENTS', href: '/sis/admin/website/pages' },
        { label: 'REPORTS', href: '/sis/admin/reports' },
        { label: 'AUDIT', href: '/sis/admin/audit' },
        { label: 'NOTIFICATIONS', href: '/sis/admin/notifications' },
        { label: 'SETTINGS', href: '/sis/admin/settings' },
        { label: 'DEBBIE VOICE', href: '/sis/admin/debbie' },
        { label: 'VOICE AGENT', href: '/sis/admin/voice-agent' },
    ];

    const websiteNavItems = [
        { key: 'web-overview', label: 'WEBSITE', href: '/sis/admin/website' },
        { key: 'web-pages', label: 'Pages', href: '/sis/admin/website/pages' },
        { key: 'web-schools', label: 'Schools', href: '/sis/admin/website/schools' },
        { key: 'web-news', label: 'News', href: '/sis/admin/website/news' },
        { key: 'web-faqs', label: 'FAQs', href: '/sis/admin/website/faqs' },
        { key: 'web-tuition', label: 'Tuition', href: '/sis/admin/website/tuition' },
        { key: 'web-announcements', label: 'Announcements', href: '/sis/admin/website/announcements' },
    ];

    const navItems = profile.role === 'ADMIN' ? [...adminNavItems, ...websiteNavItems] : [];

    if (profile.role === 'ADMIN' && isAdminPath) {
        return (
            <div className="min-h-screen bg-[#0a151a] font-sans text-white flex flex-col" data-theme="sis-dark">
                <SISHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} role={profile.role} profile={profile} studentId={profile.student_id || ''} />
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