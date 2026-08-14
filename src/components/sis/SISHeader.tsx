'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Menu01Icon as Menu,
  Delete01Icon as Trash
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

function SwipeableNotificationItem({
  n,
  onMarkRead,
  onDelete,
}: {
  n: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentX = e.targetTouches[0].clientX;
    const diff = currentX - touchStart;
    if (diff > 0) {
      setSwipeOffset(Math.min(diff, 80));
    } else {
      setSwipeOffset(0);
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset > 40) {
      setIsDeleting(true);
      setTimeout(() => onDelete(n.id), 200);
    } else {
      setSwipeOffset(0);
    }
    setTouchStart(null);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    setTimeout(() => onDelete(n.id), 180);
  };

  return (
    <div
      className={`relative overflow-hidden border-b border-white/5 transition-all duration-200 ${
        isDeleting ? 'max-h-0 opacity-0 py-0 overflow-hidden' : 'max-h-32'
      }`}
    >
      <div
        className="absolute inset-y-0 left-0 bg-red-600 text-white flex items-center justify-start px-3 font-bold text-[10px] cursor-pointer z-0"
        style={{ width: `${Math.max(swipeOffset, 60)}px` }}
        onClick={handleDeleteClick}
      >
        <HugeiconsIcon icon={Trash} size={14} strokeWidth={2} />
      </div>

      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onClick={() => onMarkRead(n.id)}
        className={`relative z-10 p-2.5 cursor-pointer transition-transform flex items-start gap-2.5 border-b border-slate-100 ${
          !n.read ? 'bg-sky-50/70 hover:bg-sky-100/60' : 'bg-white hover:bg-slate-50'
        }`}
      >
        {/* Cannoga Logo Avatar */}
        <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-200 p-1 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <img src="/images/logo-cannoga.png" alt="Cannoga" className="w-full h-full object-contain brightness-0 invert" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1.5">
            <div className="text-[10px] font-bold text-slate-900 leading-tight line-clamp-1 flex-1">{n.title}</div>
            <button
              type="button"
              onClick={handleDeleteClick}
              className="text-slate-400 hover:text-red-500 p-0.5 transition-colors rounded hover:bg-slate-100 shrink-0"
              title="Swipe right or click to delete"
            >
              <HugeiconsIcon icon={Trash} size={12} strokeWidth={2} />
            </button>
          </div>

          <div className="mt-0.5">
            <div className="text-[9px] text-slate-600 mt-0.5 leading-tight line-clamp-2">{n.description}</div>
            <div className="text-[8px] font-semibold text-slate-400 mt-1">{n.time}</div>
          </div>
        </div>
      </div>
    </div>
  );
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

function formatRelativeTime(dateInput: any): string {
  if (!dateInput) return 'Just now';
  let date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    if (typeof dateInput === 'string' && dateInput.trim().length > 0) {
      return dateInput;
    }
    return 'Just now';
  }
  const now = new Date();
  const diffInSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

  if (diffInSeconds < 10) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hr${diffInHours > 1 ? 's' : ''} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + `, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

export function SISHeader({ onMenuToggle, role, profile, studentId }: SISHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [notificationsOpen]);

  const isAdmin = pathname?.startsWith('/sis/admin');

  const displayName = profile?.first_name || profile?.last_name
    ? `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim()
    : profile?.email || 'User';
  const roleLabel = profile?.role ? getRoleLabel(profile.role) : (role === 'ADMIN' ? 'Admin' : 'Student');
  const userEmail = profile?.email || 'user@example.com';

  const getDismissedIds = (): string[] => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('sis_dismissed_notifications') || '[]');
    } catch {
      return [];
    }
  };

  const addDismissedId = (id: string) => {
    if (typeof window === 'undefined') return;
    try {
      const current = getDismissedIds();
      if (!current.includes(id)) {
        localStorage.setItem('sis_dismissed_notifications', JSON.stringify([...current, id]));
      }
    } catch (e) {}
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const endpoint = isAdmin ? '/api/sis/admin/notifications' : '/api/sis/notifications';
        const res = await fetch(endpoint);
        if (res.ok) {
          const data = await res.json();
          const dismissed = getDismissedIds();
          const list = (data.notifications || [])
            .filter((n: any) => !dismissed.includes(n.id))
            .map((n: any) => ({
              id: n.id,
              title: n.title,
              description: n.message || n.description || '',
              time: formatRelativeTime(n.created_at || n.time || n.date || Date.now()),
              priority: n.priority || 'normal',
              read: n.read || false,
            }));

          // Trigger toast for newly fetched unread notification for students
          if (!isAdmin) {
            const unread = list.filter((n: any) => !n.read);
            if (unread.length > 0) {
              const latest = unread[0];
              const toastKey = `notif_toast_${latest.id}`;
              if (typeof window !== 'undefined' && !sessionStorage.getItem(toastKey)) {
                sessionStorage.setItem(toastKey, 'true');
                toast.info(`Notification: ${latest.title}`, {
                  description: latest.description,
                  duration: 6000,
                });
              }
            }
          }

          setNotifications(list);
        }
      } catch (e) {
        console.error('Error fetching header notifications:', e);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, [isAdmin]);

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

  const handleDeleteNotification = async (id: string) => {
    addDismissedId(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await fetch(`/api/sis/notifications?id=${id}`, { method: 'DELETE' });
      toast.success('Notification dismissed');
    } catch (e) {
      console.error(e);
    }
  };

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
      if (isAdmin || role === 'ADMIN' || (typeof window !== 'undefined' && window.location.pathname.startsWith('/sis/admin'))) {
        window.location.href = '/portal/account/admin-login';
      } else {
        window.location.href = '/portal/account/login';
      }
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
            <div ref={notifRef} className="flex items-center gap-2 relative">
              <button
                className="relative p-2 text-white hover:opacity-80 transition-opacity"
                title={`Notifications (${unreadCount})`}
                onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}
              >
                <HugeiconsIcon icon={Bell} size={18} strokeWidth={2} className="text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-extrabold h-3.5 min-w-[14px] px-1 rounded-full flex items-center justify-center leading-none shadow-sm border border-[#141414]">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                className="relative p-2 text-white hover:opacity-80 transition-opacity"
                title="Messages"
                onClick={() => router.push('/sis?page=student-life')}
              >
                <HugeiconsIcon icon={Envelope} size={18} strokeWidth={2} className="text-white" />
                {unreadMessageCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full" />}
              </button>
              <button className="p-2 text-white hover:opacity-80 transition-opacity" title="Help">
                <HugeiconsIcon icon={HelpCircle} size={18} strokeWidth={2} className="text-white" />
              </button>

              {/* Profile dropdown */}
              <div className="relative ml-1">
                <button
                  className="flex items-center gap-2 px-2 py-1.5 hover:opacity-80 transition-opacity cursor-pointer"
                  onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}
                >
                  <HugeiconsIcon icon={User} size={18} strokeWidth={2} className="text-white" />
                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-bold text-white leading-none">{displayName}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{roleLabel}</div>
                  </div>
                  <HugeiconsIcon icon={ChevronDown} size={12} strokeWidth={2.5} className="text-white" />
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
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-white/5">Sign Out</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notifications Panel */}
          {notificationsOpen && (
            <div className="absolute right-2 sm:right-4 top-14 w-72 sm:w-80 max-w-[calc(100vw-1rem)] bg-white border border-slate-200 shadow-2xl z-50 rounded-xl text-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 ease-out">
              {/* Connecting caret arrow pointing to Bell icon */}
              <div className="absolute -top-1.5 right-4 sm:right-6 w-3 h-3 bg-slate-50 border-t border-l border-slate-200 rotate-45 z-20"></div>
              <div className="relative z-10 overflow-hidden rounded-xl">
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-700">Notifications ({unreadCount})</span>
                {unreadCount > 0 && (
                  <button
                    onClick={async () => {
                      try {
                        for (const n of notifications.filter(x => !x.read)) {
                          fetch('/api/sis/notifications', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: n.id, read: true }),
                          }).catch(() => {});
                        }
                        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                      } catch (e) {}
                    }}
                    className="text-[8px] font-bold uppercase tracking-wider text-sky-600 hover:text-sky-700 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <SwipeableNotificationItem
                      key={n.id}
                      n={n}
                      onMarkRead={async (id) => {
                        if (!n.read) {
                          setNotifications(prev => prev.map(item => item.id === id ? { ...item, read: true } : item));
                          fetch('/api/sis/notifications', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id, read: true }),
                          }).catch(() => {});
                        }
                      }}
                      onDelete={handleDeleteNotification}
                    />
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-neutral-500 text-xs">No notifications</div>
                )}
              </div>
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
              <div className="hidden md:flex flex-col justify-center border-l border-neutral-200 pl-3 py-0.5">
                <div className="text-xs font-black uppercase tracking-wider text-neutral-900 leading-tight">Cannoga College</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 leading-none mt-0.5">Student Information System</div>
              </div>
            </Link>
          </div>
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <HeaderSearch isAdmin={false} />
          </div>
          <div ref={notifRef} className="flex items-center gap-2 relative">
            <button className="relative p-2 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors" title={`Notifications (${unreadCount})`} onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}>
              <HugeiconsIcon icon={Bell} size={18} strokeWidth={2} className="text-neutral-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-extrabold h-3.5 min-w-[14px] px-1 rounded-full flex items-center justify-center leading-none shadow-sm border border-[#141414]">
                  {unreadCount}
                </span>
              )}
            </button>
            <button className="relative p-2 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors" title="Messages" onClick={() => router.push('/sis?page=student-life')}>
              <HugeiconsIcon icon={Envelope} size={18} strokeWidth={2} className="text-neutral-700" />
              {unreadMessageCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-sky-500 text-white text-[9px] font-extrabold h-3.5 min-w-[14px] px-1 rounded-full flex items-center justify-center leading-none shadow-sm border border-[#141414]">
                  {unreadMessageCount}
                </span>
              )}
            </button>
            <button className="p-2 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors" title="Help">
              <HugeiconsIcon icon={HelpCircle} size={18} strokeWidth={2} className="text-neutral-700" />
            </button>
            <div className="relative">
              <button className="flex items-center gap-2 p-1.5 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer" onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}>
                <HugeiconsIcon icon={User} size={18} strokeWidth={2} className="text-neutral-700" />
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-neutral-900 leading-none">{displayName}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">{roleLabel}</div>
                </div>
                <HugeiconsIcon icon={ChevronDown} size={12} strokeWidth={2.5} className="text-neutral-600" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-[#1c1c1c] border border-white/10 shadow-lg z-50 py-1 text-white rounded-xl overflow-hidden">
                  <div className="px-4 py-2 border-b border-white/10">
                    <div className="text-sm font-bold text-white">{displayName}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{userEmail}</div>
                  </div>
                  <Link href="/sis/settings" className="block px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-white/5 no-underline">Settings</Link>
                  <Link href="/" className="block px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-white/5 no-underline">View Website</Link>
                  <div className="border-t border-white/10 mt-1 pt-1">
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-white/5">Sign Out</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Student Notifications Panel */}
        {notificationsOpen && (
          <div className="absolute right-2 sm:right-4 top-14 w-72 sm:w-80 max-w-[calc(100vw-1rem)] bg-[#0d1f28] border border-cyan-500/20 shadow-2xl z-50 rounded-xl overflow-hidden text-slate-100">
            <div className="px-3 py-2.5 border-b border-white/10 flex items-center justify-between bg-[#0a151a]">
              <span className="text-[11px] font-bold uppercase tracking-widest text-white">Notifications ({unreadCount})</span>
              {unreadCount > 0 && (
                <button
                  onClick={async () => {
                    try {
                      for (const n of notifications.filter(x => !x.read)) {
                        fetch('/api/sis/notifications', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id: n.id, read: true }),
                        }).catch(() => {});
                      }
                      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                    } catch (e) {}
                  }}
                  className="text-[9px] font-bold uppercase tracking-wider text-sky-400 hover:text-sky-300 transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <SwipeableNotificationItem
                    key={n.id}
                    n={n}
                    onMarkRead={async (id) => {
                      if (!n.read) {
                        setNotifications(prev => prev.map(item => item.id === id ? { ...item, read: true } : item));
                        fetch('/api/sis/notifications', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id, read: true }),
                        }).catch(() => {});
                      }
                    }}
                    onDelete={handleDeleteNotification}
                  />
                ))
              ) : (
                <div className="px-4 py-8 text-center text-neutral-500 text-sm">No notifications</div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}