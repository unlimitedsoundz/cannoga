'use client';

import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { SISHeader } from '@/components/sis/SISHeader';
import { SISSidebar } from '@/components/sis/SISSidebar';
import { Toaster } from 'sonner';

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
        { label: 'REGISTRATION', href: '/sis/admin/registration' },
        { label: 'DOCUMENTS', href: '/sis/admin/documents' },
        { label: 'REPORTS', href: '/sis/admin/reports' },
        { label: 'AUDIT', href: '/sis/admin/audit' },
        { label: 'NOTIFICATIONS', href: '/sis/admin/notifications' },
        { label: 'SETTINGS', href: '/sis/admin/settings' },
    ];

    const websiteNavItems = [
        { label: 'WEBSITE', href: '/sis/admin/website' },
        { label: 'Pages', href: '/sis/admin/website/pages' },
        { label: 'Schools', href: '/sis/admin/website/schools' },
        { label: 'News', href: '/sis/admin/website/news' },
        { label: 'FAQs', href: '/sis/admin/website/faqs' },
        { label: 'Tuition', href: '/sis/admin/website/tuition' },
        { label: 'Announcements', href: '/sis/admin/website/announcements' },
    ];

    const navItems = profile.role === 'ADMIN' ? [...adminNavItems, ...websiteNavItems] : [];

    if (profile.role === 'ADMIN' && isAdminPath) {
        return (
            <div className="min-h-screen bg-[#f5f5f5] font-sans text-black flex flex-col" data-theme="sis">
                <SISHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} role={profile.role} profile={profile} />
                <div className="flex flex-1 overflow-hidden">
                    <SISSidebar
                        items={navItems}
                        pathname={pathname}
                        open={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                    />
                    <main className="flex-1 overflow-y-auto">
                        <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
                <Toaster position="top-right" />
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