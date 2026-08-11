'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { DataTable } from '@/components/sis/DataTable';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  UserGroupIcon as Users,
  File01Icon as FileText,
  BookOpenIcon as BookOpen,
  Calendar01Icon as Calendar,
  ChevronRightIcon as ArrowRight,
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
  statusCounts: { SUBMITTED: number; UNDER_REVIEW: number; ADMITTED: number; REJECTED: number };
  enrollmentStatusCounts: { REGISTERED: number; DROPPED: number; COMPLETED: number; FAILED: number };
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

function PipelineRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center px-4 py-3 bg-white/4 rounded-xl hover:bg-white/6 transition-colors">
      <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">{label}</span>
      <span className="text-lg font-black text-white">{value}</span>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentStudents, setRecentStudents] = useState<RecentStudent[]>([]);
  const [pendingApplications, setPendingApplications] = useState<PendingApplication[]>([]);
  const [recentEnrollments, setRecentEnrollments] = useState<RecentEnrollment[]>([]);
  const [courseMap, setCourseMap] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      try {
        const [statsResult, courseResult] = await Promise.all([
          getSISAdminDashboardStats(),
          getSISCourseMap(),
        ]);
        if (!statsResult.success) throw new Error(statsResult.error);
        setStats(statsResult.stats as any);
        setRecentStudents(statsResult.recentStudents || []);
        setPendingApplications(statsResult.pendingApplications || []);
        setRecentEnrollments((statsResult.recentEnrollments || []) as any);
        setCourseMap(courseResult.data || {});
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-white/4 rounded-2xl text-center">
        <HugeiconsIcon icon={AlertCircle} size={36} className="text-neutral-500 mx-auto mb-4" />
        <h3 className="text-base font-bold text-white uppercase tracking-wider mb-1">Fetch Error</h3>
        <p className="text-neutral-500 text-sm mb-5">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-white text-neutral-900 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const s = stats!;

  const statCards = [
    { label: 'Total Students',        count: s.totalStudents,        icon: Users,       href: '/sis/admin/students' },
    { label: 'Active Students',        count: s.activeStudents,       icon: CheckCircle, href: '/sis/admin/students' },
    { label: 'Pending Applications',   count: s.pendingApplications,  icon: Clock,       href: '/sis/admin/applications' },
    { label: 'Total Applications',     count: s.totalApplications,    icon: FileText,    href: '/sis/admin/applications' },
    { label: 'Courses This Term',      count: s.totalCourses,         icon: BookOpen,    href: '/sis/courses' },
    { label: 'Total Enrollments',      count: s.totalEnrollments,     icon: Activity,    href: '/sis/admin/registration' },
    { label: 'Faculty',                count: s.totalFaculty,         icon: Shield,      href: '/sis/admin/faculty' },
    { label: 'Audit Logs',             count: s.totalAuditLogs,       icon: Activity,    href: '/sis/admin/audit' },
  ];

  const studentColumns = [
    {
      key: 'student_id',
      header: 'Student ID',
      render: (s: RecentStudent) => (
        <span className="font-mono text-xs text-neutral-200">{s.student_id}</span>
      ),
    },
    {
      key: 'name',
      header: 'Student',
      render: (s: RecentStudent) => (
        <div>
          <div className="font-bold text-xs text-neutral-200">{s.user?.[0]?.first_name} {s.user?.[0]?.last_name}</div>
          <div className="text-[10px] text-neutral-600 font-mono">{s.user?.[0]?.email}</div>
        </div>
      ),
    },
    {
      key: 'program',
      header: 'Program',
      render: (s: RecentStudent) => (
        <span className="text-xs text-neutral-400">{courseMap[s.program_id] || s.program_id || '—'}</span>
      ),
    },
    { key: 'status', header: 'Status', render: (s: RecentStudent) => <StatusBadge status={s.enrollment_status} /> },
    {
      key: 'start_date',
      header: 'Start Date',
      render: (s: RecentStudent) => (
        <span className="text-xs text-neutral-500">{s.start_date ? new Date(s.start_date).toLocaleDateString('en-CA') : '—'}</span>
      ),
    },
  ];

  const applicationColumns = [
    {
      key: 'application_number',
      header: 'Application #',
      render: (a: PendingApplication) => (
        <span className="font-mono text-xs text-neutral-200">{a.application_number || a.id}</span>
      ),
    },
    {
      key: 'name',
      header: 'Applicant',
      render: (a: PendingApplication) => (
        <span className="font-bold text-xs text-neutral-200">{a.user?.first_name} {a.user?.last_name}</span>
      ),
    },
    {
      key: 'course',
      header: 'Program',
      render: (a: PendingApplication) => (
        <span className="text-xs text-neutral-400">{courseMap[a.course_id] || a.course?.title || '—'}</span>
      ),
    },
    {
      key: 'submitted_at',
      header: 'Submitted',
      render: (a: PendingApplication) => (
        <span className="text-xs text-neutral-500">{a.submitted_at ? new Date(a.submitted_at).toLocaleDateString('en-CA') : '—'}</span>
      ),
    },
    { key: 'status', header: 'Status', render: (a: PendingApplication) => <StatusBadge status={a.status.replace('_', ' ')} /> },
  ];

  const enrollmentColumns = [
    {
      key: 'student_id',
      header: 'Student',
      render: (e: RecentEnrollment) => (
        <span className="font-mono text-xs text-neutral-200">{(e.student as any)?.student_id || e.student_id}</span>
      ),
    },
    {
      key: 'module',
      header: 'Module',
      render: (e: RecentEnrollment) => (
        <span className="font-bold text-xs text-neutral-300">{(e.module as any)?.code || e.module_id}</span>
      ),
    },
    {
      key: 'title',
      header: 'Title',
      render: (e: RecentEnrollment) => (
        <span className="text-xs text-neutral-500">{(e.module as any)?.title || '—'}</span>
      ),
    },
    { key: 'status', header: 'Status', render: (e: RecentEnrollment) => <StatusBadge status={e.status} /> },
    {
      key: 'grade',
      header: 'Grade',
      render: (e: RecentEnrollment) => (
        <span className="font-mono text-xs text-neutral-400">{e.grade !== null ? e.grade.toFixed(2) : '—'}</span>
      ),
    },
  ];

  const quickLinks = [
    { href: '/sis/admin/students',    icon: Users,    title: 'Student Management',  desc: 'View, edit, and manage student records',       cta: 'Manage Students' },
    { href: '/sis/admin/applications',icon: FileText,  title: 'Admissions',          desc: 'Review and process applications',               cta: 'Manage Admissions' },
    { href: '/sis/courses',           icon: BookOpen,  title: 'Course Management',   desc: 'Manage courses, sections, and schedules',      cta: 'Manage Courses' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Administration Dashboard"
        subtitle="System overview and quick access to administrative functions"
      />

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <Link
            key={idx}
            href={stat.href}
            className="group bg-[#1a1a1a] rounded-2xl p-5 hover:bg-[#1f1f1f] transition-all no-underline shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center group-hover:bg-white/12 transition-colors">
                <HugeiconsIcon icon={stat.icon} size={16} className="text-neutral-400" />
              </div>
              <HugeiconsIcon icon={ArrowRight} size={13} className="text-neutral-700 group-hover:text-neutral-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="text-2xl font-black text-white mb-1">{stat.count}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* ── Tables Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <HugeiconsIcon icon={Users} size={14} className="text-neutral-600" /> Recent Enrollments
            </h2>
            <Link href="/sis/admin/students" className="text-xs font-bold text-neutral-600 hover:text-neutral-300 uppercase tracking-wider transition-colors no-underline">View All →</Link>
          </div>
          <DataTable columns={enrollmentColumns} data={recentEnrollments} keyField="id" emptyMessage="No recent enrollments" />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <HugeiconsIcon icon={FileText} size={14} className="text-neutral-600" /> Pending Applications
            </h2>
            <Link href="/sis/admin/applications" className="text-xs font-bold text-neutral-600 hover:text-neutral-300 uppercase tracking-wider transition-colors no-underline">View All →</Link>
          </div>
          <DataTable columns={applicationColumns} data={pendingApplications} keyField="id" emptyMessage="No pending applications" />
        </div>
      </div>

      {/* ── Second Tables Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <HugeiconsIcon icon={Users} size={14} className="text-neutral-600" /> Recent Students
            </h2>
            <Link href="/sis/admin/students" className="text-xs font-bold text-neutral-600 hover:text-neutral-300 uppercase tracking-wider transition-colors no-underline">View All →</Link>
          </div>
          <DataTable columns={studentColumns} data={recentStudents} keyField="id" emptyMessage="No recent students" />
        </div>

        <div className="space-y-5">
          {/* Application Pipeline */}
          <div>
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <HugeiconsIcon icon={Activity} size={14} className="text-neutral-600" /> Application Pipeline
            </h2>
            <div className="bg-[#1a1a1a] rounded-2xl p-4 space-y-2">
              <PipelineRow label="Submitted"   value={s.statusCounts.SUBMITTED} />
              <PipelineRow label="Under Review" value={s.statusCounts.UNDER_REVIEW} />
              <PipelineRow label="Admitted"    value={s.statusCounts.ADMITTED} />
              <PipelineRow label="Rejected"    value={s.statusCounts.REJECTED} />
            </div>
          </div>

          {/* Enrollment Status */}
          <div>
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <HugeiconsIcon icon={BookOpen} size={14} className="text-neutral-600" /> Enrollment Status
            </h2>
            <div className="bg-[#1a1a1a] rounded-2xl p-4 space-y-2">
              <PipelineRow label="Registered" value={s.enrollmentStatusCounts.REGISTERED} />
              <PipelineRow label="Dropped"    value={s.enrollmentStatusCounts.DROPPED} />
              <PipelineRow label="Completed"  value={s.enrollmentStatusCounts.COMPLETED} />
              <PipelineRow label="Failed"     value={s.enrollmentStatusCounts.FAILED} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Links ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickLinks.map((ql, idx) => (
          <Link
            key={idx}
            href={ql.href}
            className="group bg-[#1a1a1a] rounded-2xl p-5 hover:bg-[#1f1f1f] transition-all no-underline shadow-sm"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 bg-white/8 rounded-xl group-hover:bg-white/12 transition-colors shrink-0">
                <HugeiconsIcon icon={ql.icon} size={18} className="text-neutral-400" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">{ql.title}</h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">{ql.desc}</p>
              </div>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 group-hover:text-white flex items-center gap-1 transition-colors">
              {ql.cta}
              <HugeiconsIcon icon={ArrowRight} size={10} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
