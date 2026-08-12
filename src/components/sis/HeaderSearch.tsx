'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon as SearchIcon,
  UserIcon as User,
  BookOpenIcon as BookOpen,
  Calendar01Icon as Calendar,
  CreditCardIcon as CreditCard,
  File01Icon as FileText,
  Clock01Icon as Clock,
  CheckmarkCircle01Icon as CheckCircle,
  SparklesIcon as Sparkles,
  MapPinIcon as MapPin,
  BellIcon as Bell,
  Settings01Icon as Settings,
  Shield01Icon as Shield,
  CircleIcon as XCircle,
} from '@hugeicons/core-free-icons';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  category: 'Pages' | 'Students' | 'Courses';
  url?: string;
  pageId?: string;
  icon?: any;
}

interface HeaderSearchProps {
  isAdmin?: boolean;
  placeholder?: string;
  onNavigatePage?: (pageId: any) => void;
}

const ADMIN_PAGES: SearchResultItem[] = [
  { id: 'admin-dashboard', title: 'Dashboard', subtitle: 'SIS Admin Overview & Stats', category: 'Pages', url: '/sis/admin', icon: Calendar },
  { id: 'admin-students', title: 'Students Directory', subtitle: 'Manage student records & profiles', category: 'Pages', url: '/sis/admin/students', icon: User },
  { id: 'admin-applications', title: 'Applications', subtitle: 'Review incoming student applications', category: 'Pages', url: '/sis/admin/applications', icon: FileText },
  { id: 'admin-admissions', title: 'Admissions Desk', subtitle: 'Manage PAL, LOA & offer letters', category: 'Pages', url: '/sis/admin/admissions', icon: Shield },
  { id: 'admin-faculty', title: 'Faculty & Instructors', subtitle: 'Professor directory & teaching assignments', category: 'Pages', url: '/sis/admin/faculty', icon: User },
  { id: 'admin-finance', title: 'Finance & Tuition Ledger', subtitle: 'Invoices, payments, and account ledgers', category: 'Pages', url: '/sis/admin/finance', icon: CreditCard },
  { id: 'admin-housing', title: 'Housing & Residence', subtitle: 'Campus residence & room assignments', category: 'Pages', url: '/sis/admin/housing', icon: MapPin },
  { id: 'admin-academics', title: 'Academics & Curriculums', subtitle: 'Programs, majors, and subject catalogs', category: 'Pages', url: '/sis/admin/academics', icon: BookOpen },
  { id: 'admin-scheduling', title: 'Course Scheduling', subtitle: 'Session & room allocation planner', category: 'Pages', url: '/sis/admin/scheduling', icon: Calendar },
  { id: 'admin-timetable', title: 'Timetable Manager', subtitle: 'Campus timetable schedules', category: 'Pages', url: '/sis/admin/timetable', icon: Clock },
  { id: 'admin-registration', title: 'Registration Desk', subtitle: 'Manage course enrollments & waitlists', category: 'Pages', url: '/sis/admin/registration', icon: CheckCircle },
  { id: 'admin-documents', title: 'Document Vault', subtitle: 'Issued receipts, PALs, and transcripts', category: 'Pages', url: '/sis/admin/documents', icon: FileText },
  { id: 'admin-reports', title: 'Reports & Analytics', subtitle: 'Institutional enrollment & financial reports', category: 'Pages', url: '/sis/admin/reports', icon: FileText },
  { id: 'admin-audit', title: 'Audit Logs', subtitle: 'Security & administrative activity logs', category: 'Pages', url: '/sis/admin/audit', icon: Shield },
  { id: 'admin-notifications', title: 'System Notifications', subtitle: 'Campus broadcast alerts & announcements', category: 'Pages', url: '/sis/admin/notifications', icon: Bell },
  { id: 'admin-settings', title: 'System Settings', subtitle: 'College configurations & portal controls', category: 'Pages', url: '/sis/admin/settings', icon: Settings },
  { id: 'admin-debbie', title: 'Debbie Voice Agent', subtitle: 'AI assistant & automated voice tools', category: 'Pages', url: '/sis/admin/debbie', icon: Sparkles },
];

const STUDENT_PAGES: SearchResultItem[] = [
  { id: 'student-dashboard', title: 'Student Dashboard', subtitle: 'Overview, today schedule & news', category: 'Pages', pageId: 'dashboard', icon: Calendar },
  { id: 'student-academics', title: 'Enrolled Courses & Progress', subtitle: 'Degree progress & active modules', category: 'Pages', pageId: 'academics', icon: BookOpen },
  { id: 'student-timetable', title: 'My Timetable', subtitle: 'Weekly class schedule & locations', category: 'Pages', pageId: 'timetable', icon: Clock },
  { id: 'student-registration', title: 'Course Registration', subtitle: 'Browse catalog & register for courses', category: 'Pages', pageId: 'registration', icon: CheckCircle },
  { id: 'student-financials', title: 'Financial Aid & Payments', subtitle: 'Account summary, ledger & payments', category: 'Pages', pageId: 'financials', icon: CreditCard },
  { id: 'student-grades', title: 'Transcripts & Grades', subtitle: 'Academic history & GPA report', category: 'Pages', pageId: 'grades', icon: FileText },
  { id: 'student-holds', title: 'Holds & Tasks', subtitle: 'Active holds & pending requirements', category: 'Pages', pageId: 'holds', icon: Bell },
  { id: 'student-news', title: 'Campus News Feed', subtitle: 'Latest college announcements', category: 'Pages', pageId: 'news', icon: Bell },
  { id: 'student-directory', title: 'Faculty & Campus Directory', subtitle: 'Find professors & office contacts', category: 'Pages', pageId: 'directory', icon: User },
  { id: 'student-life', title: 'Student Life & Support', subtitle: 'Clubs, messaging & wellness resources', category: 'Pages', pageId: 'student-life', icon: Sparkles },
  { id: 'student-profile', title: 'My Profile & Settings', subtitle: 'Contact info & student ID details', category: 'Pages', pageId: 'profile', icon: User },
];

export function HeaderSearch({ isAdmin = false, placeholder, onNavigatePage }: HeaderSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchedStudents, setFetchedStudents] = useState<SearchResultItem[]>([]);
  const [fetchedCourses, setFetchedCourses] = useState<SearchResultItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live API Search for students & courses when query >= 2 chars
  useEffect(() => {
    if (query.trim().length < 2) {
      setFetchedStudents([]);
      setFetchedCourses([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const q = encodeURIComponent(query.trim());
        const fetches: Promise<any>[] = [
          fetch(`/api/sis/courses?search=${q}`).then(r => r.json()).catch(() => ({ courses: [] })),
        ];

        if (isAdmin) {
          fetches.push(
            fetch(`/api/sis/students?search=${q}`).then(r => r.json()).catch(() => ({ students: [] }))
          );
        }

        const [courseRes, studentRes] = await Promise.all(fetches);

        if (!isMounted) return;

        if (courseRes?.courses) {
          const coursesList: SearchResultItem[] = courseRes.courses.slice(0, 5).map((c: any) => ({
            id: `course-${c.id}`,
            title: `${c.code || ''} ${c.title || c.code}`,
            subtitle: `${c.subject || 'Subject'} • ${c.credits || 3} ECTS • ${c.term || 'Fall 2026'}`,
            badge: c.status || 'Open',
            category: 'Courses',
            url: isAdmin ? `/sis/admin/academics` : undefined,
            pageId: !isAdmin ? 'registration' : undefined,
            icon: BookOpen,
          }));
          setFetchedCourses(coursesList);
        }

        if (studentRes?.students) {
          const sQuery = query.toLowerCase();
          const filtered = studentRes.students.filter((s: any) =>
            s.student_id?.toLowerCase().includes(sQuery) ||
            s.first_name?.toLowerCase().includes(sQuery) ||
            s.last_name?.toLowerCase().includes(sQuery) ||
            s.email?.toLowerCase().includes(sQuery)
          );
          const studentList: SearchResultItem[] = filtered.slice(0, 5).map((s: any) => ({
            id: `student-${s.id}`,
            title: `${s.first_name || ''} ${s.last_name || ''}`.trim() || s.student_id,
            subtitle: `ID: ${s.student_id} • ${s.email || 'No email'}`,
            badge: s.enrollment_status || 'ACTIVE',
            category: 'Students',
            url: `/sis/admin/students`,
            icon: User,
          }));
          setFetchedStudents(studentList);
        }
      } catch (err) {
        console.error('Header search error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query, isAdmin]);

  // Filter local pages
  const pageSource = isAdmin ? ADMIN_PAGES : STUDENT_PAGES;
  const filteredPages = query.trim()
    ? pageSource.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(query.toLowerCase()))
      )
    : pageSource.slice(0, 5);

  const handleSelectItem = (item: SearchResultItem) => {
    setIsOpen(false);
    setQuery('');
    if (item.url) {
      router.push(item.url);
    } else if (item.pageId && onNavigatePage) {
      onNavigatePage(item.pageId);
    } else if (!isAdmin && item.category === 'Courses') {
      if (onNavigatePage) onNavigatePage('registration');
    }
  };

  const hasResults = filteredPages.length > 0 || fetchedStudents.length > 0 || fetchedCourses.length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder || (isAdmin ? "Search students, courses, portal pages..." : "Search courses, documents, pages...")}
          className={
            isAdmin
              ? "w-full pl-9 pr-14 py-2 text-xs sm:text-sm border border-white/10 bg-white/5 text-white placeholder-neutral-400 focus:bg-white/10 focus:border-white/20 focus:outline-none rounded-lg font-sans transition-colors"
              : "w-full pl-9 pr-14 py-2 text-xs sm:text-sm border border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-slate-800/90 rounded-lg font-sans transition-colors shadow-inner"
          }
        />
        <HugeiconsIcon
          icon={SearchIcon}
          size={16}
          strokeWidth={2.5}
          className={isAdmin ? "absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" : "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"}
        />

        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className={isAdmin ? "text-neutral-400 hover:text-white p-1" : "text-slate-400 hover:text-slate-200 p-1"}
            >
              <HugeiconsIcon icon={XCircle} size={14} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {/* Floating Dropdown Results */}
      {isOpen && (
        <div
          className={
            isAdmin
              ? "absolute left-0 right-0 top-full mt-2 bg-[#1c1c1c] border border-white/15 rounded-xl shadow-2xl z-50 max-h-[420px] overflow-y-auto divide-y divide-white/10"
              : "absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-[420px] overflow-y-auto divide-y divide-slate-800 text-slate-200"
          }
        >
          {loading && (
            <div className="p-3 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-current"></div>
              <span>Searching directory & course records...</span>
            </div>
          )}

          {!hasResults && !loading && (
            <div className="p-6 text-center text-xs text-neutral-400">
              No matching pages, students, or courses found for &quot;<strong className="text-white">{query}</strong>&quot;
            </div>
          )}

          {/* Quick Pages */}
          {filteredPages.length > 0 && (
            <div className="p-2">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                {query ? 'Matched Navigation Pages' : 'Quick Shortcuts'}
              </div>
              {filteredPages.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={
                    isAdmin
                      ? "flex items-center justify-between p-2.5 rounded-lg hover:bg-white/10 cursor-pointer transition"
                      : "flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800 cursor-pointer transition"
                  }
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="text-xs font-bold text-white truncate">{item.title}</div>
                    {item.subtitle && <div className="text-[10px] text-neutral-400 truncate mt-0.5">{item.subtitle}</div>}
                  </div>
                  <span className="text-[10px] font-semibold text-neutral-400 bg-white/5 px-2 py-0.5 rounded shrink-0">
                    {isAdmin ? 'Jump to' : 'Open'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Fetched Students (Admin only) */}
          {fetchedStudents.length > 0 && (
            <div className="p-2">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Students ({fetchedStudents.length})
              </div>
              {fetchedStudents.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={
                    isAdmin
                      ? "flex items-center justify-between p-2.5 rounded-lg hover:bg-white/10 cursor-pointer transition"
                      : "flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800 cursor-pointer transition"
                  }
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="text-xs font-bold text-white truncate">{item.title}</div>
                    <div className="text-[10px] text-neutral-400 truncate mt-0.5">{item.subtitle}</div>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded shrink-0">
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Fetched Courses */}
          {fetchedCourses.length > 0 && (
            <div className="p-2">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Courses & Subjects ({fetchedCourses.length})
              </div>
              {fetchedCourses.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={
                    isAdmin
                      ? "flex items-center justify-between p-2.5 rounded-lg hover:bg-white/10 cursor-pointer transition"
                      : "flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800 cursor-pointer transition"
                  }
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="text-xs font-bold text-white truncate">{item.title}</div>
                    <div className="text-[10px] text-neutral-400 truncate mt-0.5">{item.subtitle}</div>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-700 text-slate-300 px-2 py-0.5 rounded shrink-0">
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
