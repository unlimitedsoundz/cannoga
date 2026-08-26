'use client';

import { Link } from "@aalto-dx/react-components";
import { usePathname } from 'next/navigation';
import { SignOut as LogOut, Layout, User, List as Menu, X, House as Home } from "@phosphor-icons/react";
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';

import { Logo } from '@/components/ui/Logo';
import { UserAvatar } from '@/components/ui/UserAvatar';

export default function PortalHeader() {
    const pathname = usePathname();
    const router = useRouter();

    const publicPaths = ['/portal/account/login', '/portal/account/register', '/portal/account/admin-login', '/portal/account/reset-password'];
    const normalizedPath = pathname ? pathname.replace(/\/$/, '').toLowerCase() : '';
    const isPublicPath = publicPaths.includes(normalizedPath);

    const supabase = useMemo(() => isPublicPath ? null : createClient(), [isPublicPath]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
    const [firstName, setFirstName] = useState<string | undefined>(undefined);
    const [lastName, setLastName] = useState<string | undefined>(undefined);
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
    const [studentId, setStudentId] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(isPublicPath ? false : true);

    const isAccountPage = pathname.startsWith('/portal/account');
    const isLoggedIn = !!userEmail;

    useEffect(() => {
        if (!supabase) return;

        const fetchUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setUserEmail(user.email);

                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('student_id, first_name, last_name')
                        .eq('id', user.id)
                        .single();

                    if (profile) {
                        setFirstName(profile.first_name);
                        setLastName(profile.last_name);
                        setStudentId(profile.student_id);
                    }
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [supabase]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < 10) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 64) {
                setIsVisible(false);
            } else if (currentScrollY < lastScrollY) {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const handleSignOut = async () => {
        if (supabase) {
            await supabase.auth.signOut();
        }
        localStorage.removeItem('Cannoga_user');

        setUserEmail(undefined);
        setFirstName(undefined);
        setLastName(undefined);
        setAvatarUrl(undefined);
        setStudentId(undefined);

        router.push('/portal/account/login/');
        router.refresh();
        window.dispatchEvent(new Event('storage'));
    };

    const navItems = [
        { name: 'Dashboard', href: '/portal/dashboard', icon: Layout },
        { name: 'My Profile', href: '/portal/account', icon: User },
    ];

    const mobileNavItems = [
        { name: 'Dashboard', href: '/portal/dashboard', icon: Home },
        { name: 'My Profile', href: '/portal/account', icon: User },
    ];

    const fullName = [firstName, lastName].filter(Boolean).join(' ');

    return (
        <>
            <header className={`bg-white sticky top-0 z-50 transition-transform duration-300 ${isVisible || mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Logo className="h-12 md:h-14" />

                        <nav className="hidden md:flex items-center gap-1">
                            {isLoggedIn && navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`px-3 py-1 rounded text-[13px] font-semibold transition-colors ${isActive
                                            ? 'bg-[#0a151a] text-white'
                                            : 'text-black hover:opacity-70 hover:bg-[#0a151a]/5'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-black hover:opacity-70 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={24} weight="regular" /> : <Menu size={24} weight="regular" />}
                        </button>

                        {isAccountPage && isLoggedIn && (
                            <button
                                onClick={handleSignOut}
                                className="hidden md:block px-2 py-1 text-black hover:opacity-50 text-[13px] font-semibold transition-all cursor-pointer"
                            >
                                Log Out
                            </button>
                        )}

                        {isLoggedIn && (
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="hidden sm:flex flex-col items-end">
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[13px] font-black text-black leading-none">{fullName || userEmail?.split('@')[0]}</span>
                                        {studentId && (
                                            <span className="text-[11px] font-semibold text-black border border-[#0a151a] px-1.5 py-0.5 rounded-sm leading-none">
                                                ID: {studentId}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <UserAvatar src={avatarUrl} firstName={firstName} email={userEmail} size="sm" isLoggedIn={isLoggedIn} />
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div
                className={`md:hidden fixed inset-0 bg-[#0a151a]/50 z-[100] transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setMobileMenuOpen(false)}
            >
                <div
                    className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            {isLoggedIn && <UserAvatar src={avatarUrl} firstName={firstName} email={userEmail} size="md" isLoggedIn={isLoggedIn} />}
                            <div>
                                <h3 className="text-[15px] font-black text-black">Menu</h3>
                            </div>
                        </div>
                        {userEmail && (
                            <div className="space-y-1">
                                <span className="text-[11px] font-semibold text-black/40 leading-none">Signed in as</span>
                                <p className="text-[13px] font-black text-black leading-tight">{fullName || userEmail}</p>
                                {studentId && (
                                    <span className="inline-block text-[11px] font-semibold text-black border border-[#0a151a] px-1.5 py-0.5 rounded-sm mt-1">
                                        ID: {studentId}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <nav className="p-4 space-y-1">
                        {isLoggedIn && mobileNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-neutral-100 text-black'
                                        : 'text-black hover:bg-neutral-50 hover:opacity-70'
                                        }`}
                                >
                                    <Icon size={18} weight="regular" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        {isAccountPage && isLoggedIn && (
                            <button
                                onClick={() => {
                                    handleSignOut();
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 text-white rounded-lg text-sm font-semibold hover:bg-[#0a151a] transition-colors cursor-pointer"
                            >
                                <LogOut size={16} weight="regular" />
                                Log Out
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
