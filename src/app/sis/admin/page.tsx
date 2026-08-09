'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { ActionToolbar } from '@/components/sis/ActionToolbar';
import { DataTable } from '@/components/sis/DataTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { FilterBar } from '@/components/sis/FilterBar';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  UserGroupIcon as Users, 
  File01Icon as FileText, 
  BookOpenIcon as BookOpen, 
  CreditCardIcon as CreditCard, 
  Calendar01Icon as Calendar, 
  ChevronRightIcon as ArrowRight, 
  Add01Icon as Plus, 
  Search01Icon as SearchIcon, 
  FilterHorizontalIcon as FilterIcon, 
  Download01Icon as Download,
  Alert01Icon as AlertCircle,
  CircleCheckIcon as CheckCircle,
  ClockIcon as Clock,
  Shield01Icon as Shield,
  ActivityIcon as Activity
} from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { getSISAdminDashboardStats, getSISCourseMap } from './actions';

interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalApplications: number;
  pendingApplications: number;
  totalCourses: number;
  totalModules: number;
  totalEnrollments: number;
  totalFaculty: number;
  totalDepartments: number;
  totalSchools: number;
  totalAuditLogs: number;
  statusCounts: {
    SUBMITTED: number;
    UNDER_REVIEW: number;
    ADMITTED: number;
    REJECTED: number;
  };
  enrollmentStatusCounts: {
    REGISTERED: number;
    DROPPED: number;
    COMPLETED: number;
    FAILED: number;
  };
}

interface RecentStudent {
  id: string;
  student_id: string;
  enrollment_status: string;
  start_date: string;
  program_id: string;
  user_id: string;
  user?: { first_name: string; last_name: string; email: string }[];
  course?: { title: string; school?: { name: string }[] }[];
}

interface PendingApplication {
  id: string;
  application_number: string;
  status: string;
  course_id: string;
  user_id: string;
  submitted_at: string;
  course?: { title: string };
  user?: { first_name: string; last_name: string; email: string };
}

interface RecentEnrollment {
  id: string;
  student_id: string;
  module_id: string;
  semester_id: string;
  status: string;
  grade: number | null;
  module?: { code: string; title: string };
  student?: { student_id: string; enrollment_status: string; user?: { first_name: string; last_name: string } };
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null as any);
  const [recentStudents, setRecentStudents] = useState<RecentStudent[]>([]);
  const [pendingApplications, setPendingApplications] = useState<PendingApplication[]>([]);
  const [recentEnrollments, setRecentEnrollments] = useState<RecentEnrollment[]>([]);
  const [courseMap, setCourseMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResult, courseResult] = await Promise.all([
          getSISAdminDashboardStats(),
          getSISCourseMap()
        ]);

        if (!statsResult.success) {
          throw new Error(statsResult.error);
        }

        setStats(statsResult.stats as any);
        setRecentStudents(statsResult.recentStudents || []);
        setPendingApplications(statsResult.pendingApplications || []);
        setRecentEnrollments((statsResult.recentEnrollments || []) as any);
        setCourseMap(courseResult.data || {});
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center font-sans">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-none text-center">
        <HugeiconsIcon icon={AlertCircle} size={40} className="text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-red-900 uppercase">Fetch Error</h3>
        <p className="text-red-600 font-medium text-sm mt-1">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-none text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const s = stats!;

  const statCards = [
    { label: 'Total Students', count: s.totalStudents, icon: Users, color: 'bg-blue-500', href: '/sis/admin/students' },
    { label: 'Active Students', count: s.activeStudents, icon: CheckCircle, color: 'bg-emerald-500', href: '/sis/admin/students' },
    { label: 'Pending Applications', count: s.pendingApplications, icon: Clock, color: 'bg-amber-500', href: '/sis/admin/applications' },
    { label: 'Total Applications', count: s.totalApplications, icon: FileText, color: 'bg-purple-500', href: '/sis/admin/applications' },
    { label: 'Courses This Term', count: s.totalCourses, icon: BookOpen, color: 'bg-teal-500', href: '/sis/courses' },
    { label: 'Total Enrollments', count: s.totalEnrollments, icon: Activity, color: 'bg-indigo-500', href: '/sis/admin/registration' },
    { label: 'Faculty', count: s.totalFaculty, icon: Shield, color: 'bg-neutral-800', href: '/sis/admin/faculty' },
    { label: 'Audit Logs', count: s.totalAuditLogs, icon: Activity, color: 'bg-neutral-500', href: '/sis/admin/audit' },
  ];

  const studentColumns = [
    {
      key: 'student_id',
      header: 'Student ID',
      render: (s: RecentStudent) => <span className="font-mono font-medium text-neutral-900">{s.student_id}</span>,
    },
    {
      key: 'name',
      header: 'Student',
      render: (s: RecentStudent) => (
        <div>
          <div className="font-medium text-neutral-900">{s.user?.[0]?.first_name} {s.user?.[0]?.last_name}</div>
          <div className="text-xs text-neutral-500 font-mono">{s.user?.[0]?.email}</div>
        </div>
      ),
    },
    { key: 'program', header: 'Program', render: (s: RecentStudent) => courseMap[s.program_id] || s.program_id || '—' },
    { key: 'status', header: 'Status', render: (s: RecentStudent) => <StatusBadge status={s.enrollment_status} /> },
    { key: 'start_date', header: 'Start Date', render: (s: RecentStudent) => s.start_date ? new Date(s.start_date).toLocaleDateString('en-CA') : '—' },
  ];

  const applicationColumns = [
    {
      key: 'application_number',
      header: 'Application #',
      render: (a: PendingApplication) => <span className="font-mono font-medium text-neutral-900">{a.application_number || a.id}</span>,
    },
    {
      key: 'name',
      header: 'Applicant',
      render: (a: PendingApplication) => (
        <div className="font-medium text-neutral-900">{a.user?.first_name} {a.user?.last_name}</div>
      ),
    },
    { key: 'course', header: 'Program', render: (a: PendingApplication) => courseMap[a.course_id] || a.course?.title || '—' },
    {
      key: 'submitted_at',
      header: 'Submitted',
      render: (a: PendingApplication) => a.submitted_at ? new Date(a.submitted_at).toLocaleDateString('en-CA') : '—',
    },
    { key: 'status', header: 'Status', render: (a: PendingApplication) => <StatusBadge status={a.status.replace('_', ' ')} /> },
  ];

  const enrollmentColumns = [
    {
      key: 'student_id',
      header: 'Student',
      render: (e: RecentEnrollment) => (
        <span className="font-mono font-medium text-neutral-900">{(e.student as any)?.student_id || e.student_id}</span>
      ),
    },
    {
      key: 'module',
      header: 'Module',
      render: (e: RecentEnrollment) => (e.module as any)?.code || e.module_id,
    },
    { key: 'title', header: 'Title', render: (e: RecentEnrollment) => (e.module as any)?.title || '—' },
    { key: 'status', header: 'Status', render: (e: RecentEnrollment) => <StatusBadge status={e.status} /> },
    { key: 'grade', header: 'Grade', render: (e: RecentEnrollment) => e.grade !== null ? e.grade.toFixed(2) : '—' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Administration Dashboard"
        subtitle="System overview and quick access to administrative functions"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <Link key={idx} href={stat.href} className="bg-white border border-neutral-200 p-6 hover:border-[#9c27b3] transition-colors no-underline group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-none ${stat.color} text-white`}>
                <HugeiconsIcon icon={stat.icon} size={24} strokeWidth={2} />
              </div>
              <HugeiconsIcon icon={ArrowRight} size={14} strokeWidth={2.5} className="text-neutral-300 group-hover:text-black transform group-hover:translate-x-1 transition-all" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-500 font-bold uppercase text-xs tracking-widest">{stat.label}</span>
              <span className="text-2xl font-black text-neutral-900">{stat.count}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <HugeiconsIcon icon={Users} size={20} strokeWidth={2} className="text-blue-500" /> Recent Enrollments
            </h2>
            <Link href="/sis/admin/students" className="text-xs font-bold text-neutral-400 hover:text-black transition-colors uppercase tracking-widest">
              View All →
            </Link>
          </div>
          <div className="bg-white border border-neutral-200 overflow-hidden">
            <DataTable
              columns={enrollmentColumns}
              data={recentEnrollments}
              keyField="id"
              pagination={undefined}
              emptyMessage="No recent enrollments"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <HugeiconsIcon icon={FileText} size={20} strokeWidth={2} className="text-amber-500" /> Pending Applications
            </h2>
            <Link href="/sis/admin/applications" className="text-xs font-bold text-neutral-400 hover:text-black transition-colors uppercase tracking-widest">
              View All →
            </Link>
          </div>
          <div className="bg-white border border-neutral-200 overflow-hidden">
            <DataTable
              columns={applicationColumns}
              data={pendingApplications}
              keyField="id"
              pagination={undefined}
              emptyMessage="No pending applications"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <HugeiconsIcon icon={Users} size={20} strokeWidth={2} className="text-blue-500" /> Recent Students
            </h2>
            <Link href="/sis/admin/students" className="text-xs font-bold text-neutral-400 hover:text-black transition-colors uppercase tracking-widest">
              View All →
            </Link>
          </div>
          <div className="bg-white border border-neutral-200 overflow-hidden">
            <DataTable
              columns={studentColumns}
              data={recentStudents}
              keyField="id"
              pagination={undefined}
              emptyMessage="No recent students"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <HugeiconsIcon icon={Activity} size={20} strokeWidth={2} className="text-purple-500" /> Application Pipeline
          </h2>
          <div className="bg-white border border-neutral-200 p-6 space-y-4">
            <div className="flex justify-between items-center p-3 bg-neutral-50">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Submitted</span>
              <span className="text-lg font-black text-neutral-900">{s.statusCounts.SUBMITTED}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-neutral-50">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Under Review</span>
              <span className="text-lg font-black text-neutral-900">{s.statusCounts.UNDER_REVIEW}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-neutral-50">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Admitted</span>
              <span className="text-lg font-black text-neutral-900">{s.statusCounts.ADMITTED}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-neutral-50">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Rejected</span>
              <span className="text-lg font-black text-neutral-900">{s.statusCounts.REJECTED}</span>
            </div>
          </div>

          <h2 className="text-lg font-bold flex items-center gap-2 pt-4">
            <HugeiconsIcon icon={BookOpen} size={20} strokeWidth={2} className="text-emerald-500" /> Enrollment Status
          </h2>
          <div className="bg-white border border-neutral-200 p-6 space-y-4">
            <div className="flex justify-between items-center p-3 bg-neutral-50">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Registered</span>
              <span className="text-lg font-black text-neutral-900">{s.enrollmentStatusCounts.REGISTERED}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-neutral-50">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Dropped</span>
              <span className="text-lg font-black text-neutral-900">{s.enrollmentStatusCounts.DROPPED}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-neutral-50">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Completed</span>
              <span className="text-lg font-black text-neutral-900">{s.enrollmentStatusCounts.COMPLETED}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-neutral-50">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Failed</span>
              <span className="text-lg font-black text-neutral-900">{s.enrollmentStatusCounts.FAILED}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/sis/admin/students" className="bg-white border border-neutral-200 p-6 hover:border-[#9c27b3] transition-colors no-underline group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-neutral-100 rounded-none">
              <HugeiconsIcon icon={Users} size={24} strokeWidth={1.5} className="text-neutral-600 group-hover:text-[#9c27b3] transition-colors" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Student Management</h3>
              <p className="text-xs text-neutral-500">View, edit, and manage student records</p>
            </div>
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#9c27b3] flex items-center gap-1">
            Manage Students
            <HugeiconsIcon icon={ArrowRight} size={12} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link href="/sis/admin/applications" className="bg-white border border-neutral-200 p-6 hover:border-[#9c27b3] transition-colors no-underline group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-neutral-100 rounded-none">
              <HugeiconsIcon icon={FileText} size={24} strokeWidth={1.5} className="text-neutral-600 group-hover:text-[#9c27b3] transition-colors" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Admissions</h3>
              <p className="text-xs text-neutral-500">Review and process applications</p>
            </div>
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#9c27b3] flex items-center gap-1">
            Manage Admissions
            <HugeiconsIcon icon={ArrowRight} size={12} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link href="/sis/courses" className="bg-white border border-neutral-200 p-6 hover:border-[#9c27b3] transition-colors no-underline group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-neutral-100 rounded-none">
              <HugeiconsIcon icon={BookOpen} size={24} strokeWidth={1.5} className="text-neutral-600 group-hover:text-[#9c27b3] transition-colors" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Course Management</h3>
              <p className="text-xs text-neutral-500">Manage courses, sections, and schedules</p>
            </div>
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#9c27b3] flex items-center gap-1">
            Manage Courses
            <HugeiconsIcon icon={ArrowRight} size={12} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}
