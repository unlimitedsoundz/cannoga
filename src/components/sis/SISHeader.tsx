'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { Toaster, toast } from 'sonner';
import { 
  Search01Icon as SearchIcon, 
  BellIcon as Bell, 
  Mail01Icon as Envelope, 
  HelpCircleIcon as HelpCircle, 
  UserIcon as User, 
  ChevronDownIcon as ChevronDown, 
  Menu01Icon as Menu 
} from '@hugeicons/core-free-icons';
import { getUnreadMessageCount } from '@/app/sis/student-life-actions';
import { HeaderSearch } from './HeaderSearch';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  priority: 'normal' | 'high';
  read: boolean;
}

interface SISHeaderProps {
  onMenuToggle: () => void;
  role?: 'ADMIN' | 'STUDENT' | null;
  profile?: {
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    role?: string | null;
    student_id?: string | null;
  };
  studentId?: string;
}

function getRoleLabel(role: string | undefined | null): string {
  if (!role) return 'User';
  const upperRole = role.toUpperCase();
  if (
    upperRole === 'ADMIN' || upperRole === 'ADMISSIONS' || upperRole === 'REGISTRAR' ||
    upperRole === 'FINANCE_OFFICER' || upperRole === 'ACADEMIC_ADVISOR' ||
    upperRole === 'STUDENT_SERVICES' || upperRole === 'INTERNATIONAL_OFFICER' ||
    upperRole === 'DOCUMENT_VERIFIER'
  ) {
    return 'Admin';
  }
  return 'Student';
}

export function SISHeader({ onMenuToggle, role, profile, studentId }: SISHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  const isAdmin = pathname?.startsWith('/sis/admin');

  const displayName = profile?.first_name || profile?.last_name
    ? `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim()
    : profile?.email || 'User';
  const roleLabel = profile?.role ? getRoleLabel(profile.role) : (role === 'ADMIN' ? 'Admin' : 'Student');
  const userEmail = profile?.email || 'user@example.com';

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const sid = studentId || profile?.student_id;
      if (!sid) return;
      try {
        const result = await getUnreadMessageCount(sid);
        if (result.success) {
          setUnreadMessageCount(result.count || 0);
        }
      } catch (e) {
        console.error('Error fetching unread message count:', e);
      }
    };
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [studentId, profile?.student_id]);

  const handleLogout = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (typeof window !== 'undefined' && supabaseUrl && supabaseAnonKey) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      await supabase.auth.signOut();
    }
    toast.success('Signed out successfully');
    setTimeout(() => {
      router.push('/portal/account/login');
    }, 1000);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (isAdmin) {
    // ── DARK ADMIN HEADER ──
    return (
      <>
        <Toaster position="top-right" theme="dark" />
        <header className="bg-[#141414] border-b border-white/10 sticky top-0 z-30">
          <div className="flex items-center justify-between h-14 px-4 lg:px-6">
            {/* Left: menu + logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-white/10 transition-colors"
              >
                <HugeiconsIcon icon={Menu} size={20} strokeWidth={2} />
              </button>
              <Link href="/sis/admin" className="flex items-center gap-3 shrink-0 no-underline">
                <img src="/images/logo-cannoga.png" alt="Cannoga College" className="h-8 w-auto object-contain brightness-0 invert" />
                <div className="hidden md:block">
                  <div className="text-xs font-black uppercase tracking-widest text-white">Cannoga College</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Student Information System</div>
                </div>
              </Link>
            </div>

            {/* Centre: search */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <HeaderSearch isAdmin={true} />
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-1">
              <button
                className="relative p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title={`Notifications (${unreadCount})`}
                onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}
              >
                <HugeiconsIcon icon={Bell} size={18} strokeWidth={2} />
                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full" />}
              </button>
              <button
                className="relative p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Messages"
                onClick={() => router.push('/sis?page=student-life')}
              >
                <HugeiconsIcon icon={Envelope} size={18} strokeWidth={2} />
                {unreadMessageCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full" />}
              </button>
              <button className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Help">
                <HugeiconsIcon icon={HelpCircle} size={18} strokeWidth={2} />
              </button>

              {/* Profile dropdown */}
              <div className="relative ml-1">
                <button
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/10 transition-colors rounded-lg"
                  onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}
                >
                  <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center">
                    <HugeiconsIcon icon={User} size={14} strokeWidth={2.5} className="text-neutral-300" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-bold text-white leading-none">{displayName}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">{roleLabel}</div>
                  </div>
                  <HugeiconsIcon icon={ChevronDown} size={12} strokeWidth={2.5} className="text-neutral-500" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#1c1c1c] border border-white/10 shadow-2xl z-50 py-1 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/10">
                      <div className="text-sm font-bold text-white">{displayName}</div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mt-0.5">{userEmail}</div>
                    </div>
                    <Link href="/sis/admin/settings" className="block px-4 py-2 text-xs font-bold text-neutral-300 hover:text-white hover:bg-white/5 no-underline transition-colors">Settings</Link>
                    <Link href="/" className="block px-4 py-2 text-xs font-bold text-neutral-300 hover:text-white hover:bg-white/5 no-underline transition-colors">View Website</Link>
                    <div className="border-t border-white/10 mt-1 pt-1">
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors">Sign Out</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notifications Panel */}
          {notificationsOpen && (
            <div className="absolute right-4 top-14 w-80 bg-[#1c1c1c] border border-white/10 shadow-2xl z-50 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-white">Notifications</span>
                <button className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors">Mark all read</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n.id} className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${!n.read ? 'bg-white/5' : ''}`}>
                      <div className="flex items-start gap-2">
                        {!n.read && <span className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white truncate">{n.title}</div>
                          <div className="text-[11px] text-neutral-500 mt-0.5 line-clamp-2">{n.description}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">{n.time}</span>
                            {n.priority === 'high' && <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">High</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-neutral-500 text-sm">No notifications</div>
                )}
              </div>
              <div className="px-4 py-2.5 border-t border-white/10">
                <Link href="/sis/notifications" className="block text-center text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors no-underline">View All Notifications</Link>
              </div>
            </div>
          )}
        </header>
      </>
    );
  }

  // ── LIGHT STUDENT HEADER (unchanged) ──
  return (
    <>
      <Toaster position="top-right" />
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-30">
        <div className="flex items-center justify-between h-14 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button onClick={onMenuToggle} className="lg:hidden p-1 text-neutral-600 hover:text-black">
              <HugeiconsIcon icon={Menu} size={22} strokeWidth={2} />
            </button>
            <Link href="/sis" className="flex items-center gap-3 shrink-0">
              <img src="/images/logo-cannoga.png" alt="Cannoga College" className="h-8 w-auto object-contain" />
              <div className="hidden md:block">
                <div className="text-xs font-black uppercase tracking-widest text-neutral-900">Cannoga College</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Student Information System</div>
              </div>
            </Link>
          </div>
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <HeaderSearch isAdmin={false} />
          </div>
          <div className="flex items-center gap-1">
            <button className="relative p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors" title={`Notifications (${unreadCount})`} onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}>
              <HugeiconsIcon icon={Bell} size={18} strokeWidth={2} />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-neutral-900 rounded-full" />}
            </button>
            <button className="relative p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors" title="Messages" onClick={() => router.push('/sis?page=student-life')}>
              <HugeiconsIcon icon={Envelope} size={18} strokeWidth={2} />
              {unreadMessageCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-neutral-900 rounded-full border-2 border-white" />}
            </button>
            <button className="p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors" title="Help">
              <HugeiconsIcon icon={HelpCircle} size={18} strokeWidth={2} />
            </button>
            <div className="relative">
              <button className="flex items-center gap-2 p-1.5 hover:bg-neutral-100 transition-colors rounded" onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}>
                <div className="w-7 h-7 bg-neutral-200 rounded flex items-center justify-center">
                  <HugeiconsIcon icon={User} size={14} strokeWidth={2.5} className="text-neutral-600" />
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-neutral-900 leading-none">{displayName}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">{roleLabel}</div>
                </div>
                <HugeiconsIcon icon={ChevronDown} size={12} strokeWidth={2.5} className="text-neutral-400" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-neutral-200 shadow-lg z-50 py-1">
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <div className="text-sm font-bold text-neutral-900">{displayName}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">{userEmail}</div>
                  </div>
                  <Link href="/sis/settings" className="block px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 no-underline">Settings</Link>
                  <Link href="/" className="block px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 no-underline">View Website</Link>
                  <div className="border-t border-neutral-100 mt-1 pt-1">
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-neutral-50">Sign Out</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}