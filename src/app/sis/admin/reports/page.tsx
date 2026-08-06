'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { getSISAdminDashboardStats } from '../actions';

export default function ReportsPage() {
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSISAdminDashboardStats();
        if (result.success) setStats(result.stats);
      } catch (e) {
        console.error('Failed to load report data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div></div>;
  }

  const s = stats;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Institutional reports and analytics"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Admissions</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-xs text-neutral-500">Total Applications</span><span className="text-sm font-bold text-neutral-900">{s?.totalApplications || 0}</span></div>
            <div className="flex justify-between"><span className="text-xs text-neutral-500">Pending Review</span><span className="text-sm font-bold text-amber-600">{s?.statusCounts?.UNDER_REVIEW || 0}</span></div>
            <div className="flex justify-between"><span className="text-xs text-neutral-500">Admitted</span><span className="text-sm font-bold text-emerald-600">{s?.statusCounts?.ADMITTED || 0}</span></div>
            <div className="flex justify-between"><span className="text-xs text-neutral-500">Rejected</span><span className="text-sm font-bold text-red-600">{s?.statusCounts?.REJECTED || 0}</span></div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Enrollment</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-xs text-neutral-500">Total Students</span><span className="text-sm font-bold text-neutral-900">{s?.totalStudents || 0}</span></div>
            <div className="flex justify-between"><span className="text-xs text-neutral-500">Active</span><span className="text-sm font-bold text-emerald-600">{s?.activeStudents || 0}</span></div>
            <div className="flex justify-between"><span className="text-xs text-neutral-500">Registered</span><span className="text-sm font-bold text-blue-600">{s?.enrollmentStatusCounts?.REGISTERED || 0}</span></div>
            <div className="flex justify-between"><span className="text-xs text-neutral-500">Dropped</span><span className="text-sm font-bold text-red-600">{s?.enrollmentStatusCounts?.DROPPED || 0}</span></div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Academics</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-xs text-neutral-500">Programs</span><span className="text-sm font-bold text-neutral-900">{s?.totalCourses || 0}</span></div>
            <div className="flex justify-between"><span className="text-xs text-neutral-500">Modules</span><span className="text-sm font-bold text-neutral-900">{s?.totalModules || 0}</span></div>
            <div className="flex justify-between"><span className="text-xs text-neutral-500">Enrollments</span><span className="text-sm font-bold text-neutral-900">{s?.totalEnrollments || 0}</span></div>
            <div className="flex justify-between"><span className="text-xs text-neutral-500">Faculty</span><span className="text-sm font-bold text-neutral-900">{s?.totalFaculty || 0}</span></div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Institution</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-xs text-neutral-500">Schools</span><span className="text-sm font-bold text-neutral-900">{s?.totalSchools || 0}</span></div>
            <div className="flex justify-between"><span className="text-xs text-neutral-500">Departments</span><span className="text-sm font-bold text-neutral-900">{s?.totalDepartments || 0}</span></div>
            <div className="flex justify-between"><span className="text-xs text-neutral-500">Audit Logs</span><span className="text-sm font-bold text-neutral-900">{s?.totalAuditLogs || 0}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}