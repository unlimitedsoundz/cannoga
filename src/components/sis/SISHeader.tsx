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

const ROLE_LABELS: Record<string, string> = {
  'ADMIN': 'Admin',
  'STUDENT': 'Student',
  'APPLICANT': 'Applicant',
};

function getRoleLabel(role: string | undefined | null): string {
  if (!role) return 'User';
  const upperRole = role.toUpperCase();
  if (upperRole === 'ADMIN' || upperRole === 'ADMISSIONS' || upperRole === 'REGISTRAR' || 
      upperRole === 'FINANCE_OFFICER' || upperRole === 'ACADEMIC_ADVISOR' || 
      upperRole === 'STUDENT_SERVICES' || upperRole === 'INTERNATIONAL_OFFICER' || 
      upperRole === 'DOCUMENT_VERIFIER') {
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
            <div className="relative w-full">
              <HugeiconsIcon icon={SearchIcon} size={16} strokeWidth={2.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search students, courses, applications..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-neutral-400 focus:outline-none font-sans"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 border border-neutral-200 bg-white px-1.5 py-0.5 rounded">ctrl K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="relative p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors" title={`Notifications (${unreadCount})`} onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}>
              <HugeiconsIcon icon={Bell} size={18} strokeWidth={2} />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-[#9c27b3] rounded-full" />}
            </button>
            <button className="relative p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors" title="Messages" onClick={() => router.push('/sis?page=student-life')}>
              <HugeiconsIcon icon={Envelope} size={18} strokeWidth={2} />
              {unreadMessageCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white" />}
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
                  <Link href={`/sis/${role === 'ADMIN' ? 'admin/settings' : 'settings'}`} className="block px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 no-underline">Settings</Link>
                  <Link href="/" className="block px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 no-underline">View Website</Link>
                  <div className="border-t border-neutral-100 mt-1 pt-1">
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-neutral-50">Sign Out</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {notificationsOpen && (
          <div className="absolute right-4 top-14 w-80 bg-white border border-neutral-200 shadow-lg z-50">
            <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-900">Notifications</span>
              <button className="text-[10px] font-bold uppercase tracking-wider text-[#9c27b3] hover:underline">Mark all read</button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div key={n.id} className={`px-4 py-3 border-b border-neutral-50 hover:bg-neutral-50 cursor-pointer ${!n.read ? 'bg-[#faf5ff]' : ''}`}>
                    <div className="flex items-start gap-2">
                      {!n.read && <span className="w-2 h-2 bg-[#9c27b3] rounded-full mt-1.5 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-neutral-900 truncate">{n.title}</div>
                        <div className="text-[11px] text-neutral-500 mt-0.5 line-clamp-2">{n.description}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{n.time}</span>
                          {n.priority === 'high' && <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">High</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-neutral-500">
                  No notifications
                </div>
              )}
            </div>
            <div className="px-4 py-2 border-t border-neutral-200">
              <Link href="/sis/notifications" className="block text-center text-xs font-bold uppercase tracking-wider text-[#9c27b3] hover:underline no-underline">View All Notifications</Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}