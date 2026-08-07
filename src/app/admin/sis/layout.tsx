'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { Link } from "@aalto-dx/react-components";
import { HugeiconsIcon } from '@hugeicons/react';
import { Layout01Icon as LayoutDashboard, UserGroupIcon as Users, File01Icon as FileText, BookOpenIcon as BookOpen, Calendar01Icon as Calendar, GraduationCapIcon as GraduationCap, CreditCardIcon as CreditCard, Shield01Icon as Shield, ArchiveIcon as Archive, Mail01Icon as Mail, BarChartIcon as BarChart, SettingsIcon as Settings, HelpCircleIcon as HelpCircle, BellIcon as Bell, ClipboardListIcon as ClipboardList, GlobeIcon as Globe, KeyIcon as Key, Activity01Icon as Activity, ArrowRightIcon as ArrowRight, Search01Icon as MagnifyingGlass, ChevronRightIcon as ChevronRight } from "@hugeicons/core-free-icons";
import { Logo } from '@/components/ui/Logo';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';

export default function AdminSISLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user: sbUser } } = await supabase.auth.getUser();

        if (sbUser) {
          setUser(sbUser);
          const { data: prof } = await supabase
            .from('profiles')
            .select('first_name, last_name, role, department, email')
            .eq('id', sbUser.id)
            .single();

          if (!prof?.role || !['ADMIN', 'REGISTRAR', 'ADMISSIONS_OFFICER', 'FINANCE_OFFICER', 'ACADEMIC_ADVISOR', 'STUDENT_SERVICES', 'INTERNATIONAL_OFFICER', 'DOCUMENT_VERIFIER'].includes(prof.role)) {
            setRedirecting(true);
            router.replace('/portal/account/admin-login');
            return;
          }
          setProfile(prof);
          return;
        }

        const savedUser = localStorage.getItem('Cannoga_user');
        if (savedUser) {
          const localProfile = JSON.parse(savedUser);
          const { data: dbProfile, error } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, role, department, email')
            .eq('email', localProfile.email)
            .in('role', ['ADMIN', 'REGISTRAR', 'ADMISSIONS_OFFICER', 'FINANCE_OFFICER', 'ACADEMIC_ADVISOR', 'STUDENT_SERVICES', 'INTERNATIONAL_OFFICER', 'DOCUMENT_VERIFIER'])
            .single();

          if (dbProfile) {
            setUser({ id: dbProfile.id, email: dbProfile.email });
            setProfile(dbProfile);
            localStorage.setItem('Cannoga_user', JSON.stringify(dbProfile));
          } else {
            throw new Error('Invalid database session');
          }
        } else {
          router.replace('/portal/account/admin-login');
        }
      } catch (error) {
        console.error("Admin SIS auth check error:", error);
        localStorage.removeItem('Cannoga_user');
        setRedirecting(true);
        router.replace('/portal/account/admin-login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, supabase]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('Cannoga_user');
    setUser(null);
    setProfile(null);
    window.dispatchEvent(new Event('storage'));
    router.replace('/portal/account/admin-login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center font-sans">
        <ProgressIndicator size={32} />
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

  const navSections = [
    {
      label: 'DASHBOARD',
      items: [
        { href: '/admin/sis', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'REGISTRAR', 'ADMISSIONS_OFFICER', 'FINANCE_OFFICER', 'ACADEMIC_ADVISOR', 'STUDENT_SERVICES', 'INTERNATIONAL_OFFICER', 'DOCUMENT_VERIFIER'] },
      ],
    },
    {
      label: 'STUDENTS',
      icon: Users,
      items: [
        { href: '/admin/sis/students', label: 'Student Search', icon: MagnifyingGlass, roles: ['ADMIN', 'REGISTRAR', 'ADMISSIONS_OFFICER', 'ACADEMIC_ADVISOR', 'STUDENT_SERVICES'] },
        { href: '/admin/sis/students/records', label: 'Student Records', icon: ClipboardList, roles: ['ADMIN', 'REGISTRAR', 'ACADEMIC_ADVISOR'] },
        { href: '/admin/sis/students/new', label: 'New Student', icon: Users, roles: ['ADMIN', 'REGISTRAR'] },
        { href: '/admin/sis/students/holds', label: 'Student Holds', icon: Shield, roles: ['ADMIN', 'REGISTRAR', 'FINANCE_OFFICER', 'STUDENT_SERVICES'] },
        { href: '/admin/sis/students/documents', label: 'Student Documents', icon: FileText, roles: ['ADMIN', 'REGISTRAR', 'DOCUMENT_VERIFIER', 'ADMISSIONS_OFFICER'] },
      ],
    },
    {
      label: 'ADMISSIONS',
      icon: FileText,
      items: [
        { href: '/admin/sis/admissions', label: 'Applications', icon: ClipboardList, roles: ['ADMIN', 'ADMISSIONS_OFFICER', 'REGISTRAR'] },
        { href: '/admin/sis/admissions/review', label: 'Application Review', icon: Activity, roles: ['ADMIN', 'ADMISSIONS_OFFICER'] },
        { href: '/admin/sis/admissions/offers', label: 'Offers', icon: Mail, roles: ['ADMIN', 'ADMISSIONS_OFFICER'] },
        { href: '/admin/sis/admissions/decisions', label: 'Admission Decisions', icon: Shield, roles: ['ADMIN', 'ADMISSIONS_OFFICER'] },
        { href: '/admin/sis/admissions/documents', label: 'Required Documents', icon: FileText, roles: ['ADMIN', 'ADMISSIONS_OFFICER', 'DOCUMENT_VERIFIER'] },
      ],
    },
    {
      label: 'ACADEMICS',
      icon: BookOpen,
      items: [
        { href: '/admin/sis/academics/schools', label: 'Schools', icon: Globe, roles: ['ADMIN', 'REGISTRAR'] },
        { href: '/admin/sis/academics/programs', label: 'Programs', icon: BookOpen, roles: ['ADMIN', 'REGISTRAR'] },
        { href: '/admin/sis/academics/courses', label: 'Courses', icon: BookOpen, roles: ['ADMIN', 'REGISTRAR'] },
        { href: '/admin/sis/academics/sections', label: 'Course Sections', icon: ClipboardList, roles: ['ADMIN', 'REGISTRAR'] },
        { href: '/admin/sis/academics/terms', label: 'Academic Terms', icon: Calendar, roles: ['ADMIN', 'REGISTRAR'] },
        { href: '/admin/sis/academics/calendar', label: 'Academic Calendar', icon: Calendar, roles: ['ADMIN', 'REGISTRAR', 'ACADEMIC_ADVISOR'] },
      ],
    },
    {
      label: 'REGISTRATION',
      icon: ClipboardList,
      items: [
        { href: '/admin/sis/registration', label: 'Registration Management', icon: LayoutDashboard, roles: ['ADMIN', 'REGISTRAR'] },
        { href: '/admin/sis/registration/enrollment', label: 'Enrollment', icon: Users, roles: ['ADMIN', 'REGISTRAR'] },
        { href: '/admin/sis/registration/add-drop', label: 'Add/Drop', icon: Activity, roles: ['ADMIN', 'REGISTRAR'] },
        { href: '/admin/sis/registration/holds', label: 'Registration Holds', icon: Shield, roles: ['ADMIN', 'REGISTRAR', 'FINANCE_OFFICER'] },
        { href: '/admin/sis/registration/rosters', label: 'Class Rosters', icon: ClipboardList, roles: ['ADMIN', 'REGISTRAR', 'ACADEMIC_ADVISOR'] },
      ],
    },
    {
      label: 'ACADEMIC RECORDS',
      icon: Archive,
      items: [
        { href: '/admin/sis/records/grades', label: 'Grades', icon: ClipboardList, roles: ['ADMIN', 'REGISTRAR', 'ACADEMIC_ADVISOR'] },
        { href: '/admin/sis/records/standing', label: 'Academic Standing', icon: Shield, roles: ['ADMIN', 'REGISTRAR', 'ACADEMIC_ADVISOR'] },
        { href: '/admin/sis/records/transcripts', label: 'Transcripts', icon: FileText, roles: ['ADMIN', 'REGISTRAR'] },
        { href: '/admin/sis/records/progress', label: 'Program Progress', icon: Activity, roles: ['ADMIN', 'REGISTRAR', 'ACADEMIC_ADVISOR'] },
        { href: '/admin/sis/records/completion', label: 'Degree Completion', icon: GraduationCap, roles: ['ADMIN', 'REGISTRAR'] },
      ],
    },
    {
      label: 'FINANCE',
      icon: CreditCard,
      items: [
        { href: '/admin/sis/finance/accounts', label: 'Student Accounts', icon: Users, roles: ['ADMIN', 'FINANCE_OFFICER'] },
        { href: '/admin/sis/finance/tuition', label: 'Tuition & Fees', icon: CreditCard, roles: ['ADMIN', 'FINANCE_OFFICER'] },
        { href: '/admin/sis/finance/invoices', label: 'Invoices', icon: FileText, roles: ['ADMIN', 'FINANCE_OFFICER'] },
        { href: '/admin/sis/finance/payments', label: 'Payments', icon: CreditCard, roles: ['ADMIN', 'FINANCE_OFFICER'] },
        { href: '/admin/sis/finance/refunds', label: 'Refunds', icon: ArrowRight, roles: ['ADMIN', 'FINANCE_OFFICER'] },
        { href: '/admin/sis/finance/receipts', label: 'Receipts', icon: FileText, roles: ['ADMIN', 'FINANCE_OFFICER'] },
      ],
    },
    {
      label: 'INTERNATIONAL',
      icon: Globe,
      items: [
        { href: '/admin/sis/international/students', label: 'International Students', icon: Users, roles: ['ADMIN', 'INTERNATIONAL_OFFICER', 'REGISTRAR'] },
        { href: '/admin/sis/international/permits', label: 'Study Permits', icon: Shield, roles: ['ADMIN', 'INTERNATIONAL_OFFICER'] },
        { href: '/admin/sis/international/support', label: 'International Support', icon: HelpCircle, roles: ['ADMIN', 'INTERNATIONAL_OFFICER', 'STUDENT_SERVICES'] },
      ],
    },
    {
      label: 'DOCUMENTS',
      icon: FileText,
      items: [
        { href: '/admin/sis/documents/verification', label: 'Document Verification', icon: Shield, roles: ['ADMIN', 'DOCUMENT_VERIFIER', 'ADMISSIONS_OFFICER'] },
        { href: '/admin/sis/documents/requests', label: 'Document Requests', icon: Mail, roles: ['ADMIN', 'DOCUMENT_VERIFIER', 'STUDENT_SERVICES'] },
        { href: '/admin/sis/documents/templates', label: 'Document Templates', icon: ClipboardList, roles: ['ADMIN', 'REGISTRAR', 'ADMISSIONS_OFFICER'] },
      ],
    },
    {
      label: 'COMMUNICATIONS',
      icon: Mail,
      items: [
        { href: '/admin/sis/communications/announcements', label: 'Announcements', icon: Bell, roles: ['ADMIN', 'REGISTRAR', 'STUDENT_SERVICES'] },
        { href: '/admin/sis/communications/notifications', label: 'Notifications', icon: Bell, roles: ['ADMIN', 'REGISTRAR', 'STUDENT_SERVICES'] },
        { href: '/admin/sis/communications/messages', label: 'Messages', icon: Mail, roles: ['ADMIN', 'REGISTRAR', 'STUDENT_SERVICES'] },
        { href: '/admin/sis/communications/templates', label: 'Email Templates', icon: ClipboardList, roles: ['ADMIN', 'REGISTRAR'] },
      ],
    },
    {
      label: 'REPORTS',
      icon: BarChart,
      items: [
        { href: '/admin/sis/reports/enrollment', label: 'Enrollment Reports', icon: Users, roles: ['ADMIN', 'REGISTRAR'] },
        { href: '/admin/sis/reports/admissions', label: 'Admissions Reports', icon: ClipboardList, roles: ['ADMIN', 'ADMISSIONS_OFFICER'] },
        { href: '/admin/sis/reports/academic', label: 'Academic Reports', icon: BookOpen, roles: ['ADMIN', 'REGISTRAR'] },
        { href: '/admin/sis/reports/financial', label: 'Financial Reports', icon: CreditCard, roles: ['ADMIN', 'FINANCE_OFFICER'] },
        { href: '/admin/sis/reports/students', label: 'Student Reports', icon: Users, roles: ['ADMIN', 'REGISTRAR', 'STUDENT_SERVICES'] },
      ],
    },
    {
      label: 'ADMINISTRATION',
      icon: Settings,
      items: [
        { href: '/admin/sis/admin/users', label: 'Users', icon: Users, roles: ['ADMIN'] },
        { href: '/admin/sis/admin/roles', label: 'Roles & Permissions', icon: Shield, roles: ['ADMIN'] },
        { href: '/admin/sis/admin/audit', label: 'Audit Logs', icon: Archive, roles: ['ADMIN'] },
        { href: '/admin/sis/admin/settings', label: 'System Settings', icon: Settings, roles: ['ADMIN'] },
      ],
    },
  ];

  const filteredSections = navSections.filter(section => 
    section.items.some(item => item.roles.includes(profile?.role || ''))
  ).map(section => ({
    ...section,
    items: section.items.filter(item => item.roles.includes(profile?.role || ''))
  }));

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      'ADMIN': 'System Administrator',
      'REGISTRAR': 'Registrar',
      'ADMISSIONS_OFFICER': 'Admissions Officer',
      'FINANCE_OFFICER': 'Finance Officer',
      'ACADEMIC_ADVISOR': 'Academic Advisor',
      'STUDENT_SERVICES': 'Student Services',
      'INTERNATIONAL_OFFICER': 'International Student Officer',
      'DOCUMENT_VERIFIER': 'Document Verification Officer',
    };
    return labels[role] || role;
  };

  const quickActions = [
    { label: 'Search Student', href: '/admin/sis/students', icon: MagnifyingGlass, roles: ['ADMIN', 'REGISTRAR', 'ADMISSIONS_OFFICER', 'ACADEMIC_ADVISOR', 'STUDENT_SERVICES'] },
    { label: 'Open Application', href: '/admin/sis/admissions', icon: FileText, roles: ['ADMIN', 'ADMISSIONS_OFFICER'] },
    { label: 'Create Student', href: '/admin/sis/students/new', icon: Users, roles: ['ADMIN', 'REGISTRAR'] },
    { label: 'Review Application', href: '/admin/sis/admissions/review', icon: Activity, roles: ['ADMIN', 'ADMISSIONS_OFFICER'] },
    { label: 'Verify Document', href: '/admin/sis/documents/verification', icon: Shield, roles: ['ADMIN', 'DOCUMENT_VERIFIER', 'ADMISSIONS_OFFICER'] },
    { label: 'Record Payment', href: '/admin/sis/finance/payments', icon: CreditCard, roles: ['ADMIN', 'FINANCE_OFFICER'] },
    { label: 'Create Program', href: '/admin/sis/academics/programs', icon: BookOpen, roles: ['ADMIN', 'REGISTRAR'] },
    { label: 'Create Course', href: '/admin/sis/academics/courses', icon: BookOpen, roles: ['ADMIN', 'REGISTRAR'] },
  ].filter(action => action.roles.includes(profile?.role || ''));

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col md:flex-row font-sans text-base" data-theme="admin-sis">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-neutral-200 z-50 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
          >
            <HugeiconsIcon icon={LayoutDashboard} size={22} />
          </button>
          <Link href="/admin/sis" className="flex items-center gap-3 shrink-0">
            <Logo className="h-8 w-auto" />
            <div className="hidden md:block">
              <div className="text-xs font-black uppercase tracking-widest text-neutral-900">Cannoga College</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">SIS Administration</div>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-xl mx-8 relative">
          <HugeiconsIcon icon={MagnifyingGlass} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search students, applications, courses..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-neutral-400 focus:outline-none font-sans"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 border border-neutral-200 bg-white px-1.5 py-0.5 rounded">⌘K</kbd>
        </div>

        <div className="flex items-center gap-1">
          <button className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors rounded" title="Quick Actions">
            <HugeiconsIcon icon={Activity} size={18} />
          </button>
          <button className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors rounded" title="Notifications">
            <HugeiconsIcon icon={Bell} size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#9c27b3] rounded-full" />
          </button>
          <button className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors rounded" title="Tasks">
            <HugeiconsIcon icon={ClipboardList} size={18} />
          </button>
          <button className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors rounded" title="Help">
            <HugeiconsIcon icon={HelpCircle} size={18} />
          </button>

          <div className="relative ml-2">
            <button className="flex items-center gap-2 p-1.5 hover:bg-neutral-100 transition-colors rounded" onClick={() => setShowSearch(!showSearch)}>
              <div className="w-7 h-7 bg-neutral-200 rounded flex items-center justify-center">
                <UserAvatar src={undefined} firstName={profile?.first_name} email={user?.email} size="sm" isLoggedIn={true} />
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-neutral-900 leading-none">{profile?.first_name} {profile?.last_name}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">{getRoleLabel(profile?.role)}</div>
              </div>
              <HugeiconsIcon icon={ChevronRight} size={12} className="text-neutral-400" />
            </button>

            <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-neutral-200 shadow-lg z-50 py-1">
              <div className="px-4 py-2 border-b border-neutral-100">
                <div className="text-sm font-bold text-neutral-900">{profile?.first_name} {profile?.last_name}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">{profile?.email}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#9c27b3] mt-1">{getRoleLabel(profile?.role)}</div>
              </div>
              <Link href="/admin/sis/admin/settings" className="block px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 no-underline">Profile Settings</Link>
              <Link href="/admin/sis/admin/settings" className="block px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 no-underline">Security</Link>
              <div className="border-t border-neutral-100 mt-1 pt-1">
                <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-neutral-50 no-underline">Sign Out</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Actions Dropdown */}
      <div className="fixed top-14 right-4 w-56 bg-white border border-neutral-200 shadow-lg z-50 hidden md:block" style={{ display: showSearch ? 'block' : 'none' }}>
        <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-900">Quick Actions</span>
        </div>
        <div className="p-2">
          {quickActions.map(action => (
            <Link key={action.label} href={action.href} className="block px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 rounded transition-colors no-underline flex items-center gap-2">
              <HugeiconsIcon icon={action.icon} size={14} className="text-neutral-500" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden pt-14">
        {/* Sidebar */}
        <aside className={`
          w-64 bg-white border-r border-neutral-200 flex-shrink-0 flex flex-col overflow-y-auto
          fixed lg:sticky top-14 bottom-0 z-40 transition-transform duration-200
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {isSidebarOpen && (
            <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
          )}
          <nav className="flex-1 py-4 px-2 space-y-1">
            {filteredSections.map(section => (
              <div key={section.label} className="mb-4">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                  {section.icon && <HugeiconsIcon icon={section.icon} size={12} className="text-neutral-400" />}
                  {section.label}
                </div>
                <ul className="space-y-0.5">
                  {section.items.map(item => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-3 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${isActive
                          ? 'bg-[#faf5ff] text-[#9c27b3] font-black'
                          : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <HugeiconsIcon icon={item.icon} size={14} className={isActive ? 'text-[#9c27b3]' : 'text-neutral-400'} />
                          <span className="truncate">{item.label}</span>
                        </div>
                      </Link>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
          <div className="p-4 border-t border-neutral-200">
            <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Institution</div>
            <div className="text-xs font-bold text-neutral-900">Cannoga College</div>
            <div className="text-[10px] text-neutral-500 mt-0.5">Ottawa, Ontario</div>
            <div className="mt-3 pt-3 border-t border-neutral-100">
              <Link href="/" className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-neutral-600 no-underline">View Website</Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}