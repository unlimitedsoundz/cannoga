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
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const s = stats;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Institutional reports and analytics"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-neutral-900 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4">Admissions</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-neutral-800 rounded-xl"><span className="text-xs text-slate-800 font-medium">Total Applications</span><span className="text-sm font-black text-white">{s?.totalApplications || 0}</span></div>
            <div className="flex justify-between items-center p-3 bg-neutral-800 rounded-xl"><span className="text-xs text-slate-800 font-medium">Pending Review</span><span className="text-sm font-black text-amber-400">{s?.statusCounts?.UNDER_REVIEW || 0}</span></div>
            <div className="flex justify-between items-center p-3 bg-neutral-800 rounded-xl"><span className="text-xs text-slate-800 font-medium">Admitted</span><span className="text-sm font-black text-emerald-400">{s?.statusCounts?.ADMITTED || 0}</span></div>
            <div className="flex justify-between items-center p-3 bg-neutral-800 rounded-xl"><span className="text-xs text-slate-800 font-medium">Rejected</span><span className="text-sm font-black text-red-400">{s?.statusCounts?.REJECTED || 0}</span></div>
          </div>
        </div>

        <div className="bg-neutral-900 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4">Enrollment</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-neutral-800 rounded-xl"><span className="text-xs text-slate-800 font-medium">Total Students</span><span className="text-sm font-black text-white">{s?.totalStudents || 0}</span></div>
            <div className="flex justify-between items-center p-3 bg-neutral-800 rounded-xl"><span className="text-xs text-slate-800 font-medium">Active</span><span className="text-sm font-black text-emerald-400">{s?.activeStudents || 0}</span></div>
            <div className="flex justify-between items-center p-3 bg-neutral-800 rounded-xl"><span className="text-xs text-slate-800 font-medium">Registered</span><span className="text-sm font-black text-blue-400">{s?.enrollmentStatusCounts?.REGISTERED || 0}</span></div>
            <div className="flex justify-between items-center p-3 bg-neutral-800 rounded-xl"><span className="text-xs text-slate-800 font-medium">Dropped</span><span className="text-sm font-black text-red-400">{s?.enrollmentStatusCounts?.DROPPED || 0}</span></div>
          </div>
        </div>

        <div className="bg-neutral-900 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4">Academics</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-neutral-800 rounded-xl"><span className="text-xs text-slate-800 font-medium">Programs</span><span className="text-sm font-black text-white">{s?.totalCourses || 0}</span></div>
            <div className="flex justify-between items-center p-3 bg-neutral-800 rounded-xl"><span className="text-xs text-slate-800 font-medium">Modules</span><span className="text-sm font-black text-white">{s?.totalModules || 0}</span></div>
            <div className="flex justify-between items-center p-3 bg-neutral-800 rounded-xl"><span className="text-xs text-slate-800 font-medium">Enrollments</span><span className="text-sm font-black text-white">{s?.totalEnrollments || 0}</span></div>
            <div className="flex justify-between items-center p-3 bg-neutral-800 rounded-xl"><span className="text-xs text-slate-800 font-medium">Faculty</span><span className="text-sm font-black text-white">{s?.totalFaculty || 0}</span></div>
          </div>
        </div>

        <div className="bg-neutral-900 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4">Institution</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-neutral-800 rounded-xl"><span className="text-xs text-slate-800 font-medium">Schools</span><span className="text-sm font-black text-white">{s?.totalSchools || 0}</span></div>
            <div className="flex justify-between items-center p-3 bg-neutral-800 rounded-xl"><span className="text-xs text-slate-800 font-medium">Departments</span><span className="text-sm font-black text-white">{s?.totalDepartments || 0}</span></div>
            <div className="flex justify-between items-center p-3 bg-neutral-800 rounded-xl"><span className="text-xs text-slate-800 font-medium">Audit Logs</span><span className="text-sm font-black text-white">{s?.totalAuditLogs || 0}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}