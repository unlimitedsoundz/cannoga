'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { Link } from "@aalto-dx/react-components";
import { SquaresFour as LayoutDashboard, BookOpen, Newspaper, Calendar, GraduationCap, Users, Buildings as SchoolIcon, FileText, House as Home, Cpu, Microscope, SignOut as LogOut, CreditCard as InvoiceIcon, Question as HelpCircle, X, Gear } from "@phosphor-icons/react";
import { Logo } from '@/components/ui/Logo';
import { UserAvatar } from '@/components/ui/UserAvatar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [redirecting, setRedirecting] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // 1. Try real Supabase Auth
                const { data: { user: sbUser } } = await supabase.auth.getUser();

                if (sbUser) {
                    setUser(sbUser);
                    const { data: prof } = await supabase
                        .from('profiles')
                        .select('first_name, middle_name, role')
                        .eq('id', sbUser.id)
                        .single();

                    if (prof?.role !== 'ADMIN') {
                        setRedirecting(true);
                        router.replace('/portal/account/admin-login');
                        return;
                    }
                    setProfile(prof);
                    return;
                }

                // 2. Database-Validated Session (Primary for Static Export)
                const savedUser = localStorage.getItem('Cannoga_user');
                if (savedUser) {
                    const localProfile = JSON.parse(savedUser);

                    // Verify against DATABASE on every load - NO SIMULATION
                    const { data: dbProfile, error } = await supabase
                        .from('profiles')
                        .select('id, first_name, middle_name, role, email')
                        .eq('email', localProfile.email)
                        .eq('role', 'ADMIN')
                        .single();

                    if (dbProfile) {
                        setUser({ id: dbProfile.id, email: dbProfile.email });
                        setProfile(dbProfile);
                        // Refresh local cache with latest DB data
                        localStorage.setItem('Cannoga_user', JSON.stringify(dbProfile));
                    } else {
                        throw new Error('Invalid database session');
                    }
                } else {
                    router.replace('/portal/account/admin-login');
                }
            } catch (error) {
                console.error("Admin auth check error:", error);
                localStorage.removeItem('Cannoga_user');
                setRedirecting(true);
                router.replace('/portal/account/admin-login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router, supabase]);

    // Close sidebar on navigation
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('Cannoga_user');

        // Clear local state
        setUser(null);
        setProfile(null);

        window.dispatchEvent(new Event('storage'));
        router.replace('/portal/account/admin-login');
        router.refresh();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-100 flex items-center justify-center font-open-sans">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center text-center px-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mb-4"></div>
                <p className="text-neutral-700 font-semibold">Redirecting to admin login...</p>
                <p className="text-sm text-neutral-500 mt-2">If you are not redirected automatically, open <code className="bg-white px-2 py-1 rounded-md">/portal/account/admin-login</code>.</p>
            </div>
        );
    }

    const navItems = [
        { href: '/sis/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/sis/admin/admissions', label: 'Admissions', icon: FileText },
        { href: '/sis/admin/page-content', label: 'Page Content', icon: FileText },
        { href: '/sis/admin/courses', label: 'Courses', icon: BookOpen },
        { href: '/sis/admin/subjects', label: 'Subjects', icon: GraduationCap },
        { href: '/sis/admin/housing', label: 'Housing Manager', icon: Home },
        { href: '/sis/admin/it', label: 'IT Asset Management', icon: Cpu },
        { href: '/sis/admin/news', label: 'News', icon: Newspaper },
        { href: '/sis/admin/events', label: 'Events', icon: Calendar },
        { href: '/sis/admin/blog', label: 'Blog', icon: BookOpen },
        { href: '/sis/admin/faqs', label: 'FAQ Management', icon: HelpCircle },
        { href: '/sis/admin/students', label: 'Students', icon: Users },
        { href: '/sis/admin/research/projects', label: 'Research Projects', icon: Microscope },
        { href: '/sis/admin/departments', label: 'Departments', icon: SchoolIcon },
        { href: '/sis/admin/faculty', label: 'Faculty Editor', icon: Users },
        { href: '/sis/admin/registrar', label: 'Registrar', icon: FileText },
        { href: '/sis/admin/finance/invoices', label: 'Finance & Invoices', icon: InvoiceIcon },
        { href: '/sis/admin/finance/settings', label: 'Finance Settings', icon: Gear },
    ];

    return (
        <div className="min-h-screen bg-neutral-100 flex flex-col md:flex-row font-sans text-base" data-theme="admin">
            {/* Mobile Header */}
            <header className="md:hidden bg-neutral-900 p-4 flex items-center justify-between sticky top-0 z-50">
                <Logo className="text-white h-12" />
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="text-white p-2 hover:bg-neutral-800 rounded-lg transition-all active:scale-95"
                >
                    {isSidebarOpen ? (
                        <X size={24} weight="bold" />
                    ) : (
                        <LayoutDashboard size={24} weight="bold" />
                    )}
                </button>
            </header>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-[#9c27b3]/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-64 bg-neutral-900 text-white flex-shrink-0 flex flex-col 
                fixed md:sticky top-0 h-screen z-40 transition-transform duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-8 hidden md:block">
                    <Logo className="text-white h-16" />
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-white/10 text-white'
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <item.icon size={18} weight={isActive ? "bold" : "regular"} />
                                <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
                            </Link>
                        );
                    })}
                    <div className="pt-6 pb-2">
                        <Link href="/" className="block px-4 py-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                            VIEW WEBSITE
                        </Link>
                    </div>
                </nav>

                <div className="p-6 bg-[#9c27b3]/20">
                    <div className="flex items-center gap-3 mb-4">
                        <UserAvatar src={undefined} firstName={profile?.first_name} email={user.email} size="sm" isLoggedIn={true} />
                        <div className="overflow-hidden">
                            <p className="text-sm font-black truncate text-white">{profile?.first_name || user.email?.split('@')[0]}</p>
                            <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest leading-none mt-1">Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-[10px] text-red-400 hover:text-red-300 font-bold uppercase tracking-widest w-full px-1 py-2 rounded transition-colors"
                    >
                        <LogOut size={14} weight="bold" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-10 overflow-y-auto w-full max-w-[100vw]">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

