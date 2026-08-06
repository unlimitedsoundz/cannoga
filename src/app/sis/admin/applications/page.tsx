'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { DataTable } from '@/components/sis/DataTable';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon as Plus } from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { getSISAdmissionsApplications } from '../actions';

interface ApplicationRow {
  id: string;
  application_number?: string;
  status: string;
  submitted_at?: string;
  course?: { title: string; degreeLevel?: string };
  user?: { first_name: string; last_name: string; email: string };
}

const formatDegreeLevel = (level: string) => {
    if (!level) return '';
    return level.charAt(0) + level.slice(1).toLowerCase();
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSISAdmissionsApplications();
        if (!result.success) throw new Error(result.error);
        setApplications(result.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { key: 'application_number', header: 'Application #', render: (a: ApplicationRow) => <span className="font-mono text-sm">{a.application_number || a.id.slice(0, 8)}</span> },
    { key: 'user', header: 'Student', render: (a: ApplicationRow) => a.user ? `${a.user.first_name} ${a.user.last_name}` : '—' },
    { key: 'course', header: 'Program', render: (a: ApplicationRow) => `${a.course?.title || '—'}${a.course?.degreeLevel ? ` — ${formatDegreeLevel(a.course.degreeLevel)}` : ''}` },
    { key: 'status', header: 'Status', render: (a: ApplicationRow) => <StatusBadge status={a.status} /> },
    { key: 'submitted_at', header: 'Submitted', render: (a: ApplicationRow) => a.submitted_at ? new Date(a.submitted_at).toLocaleDateString('en-CA') : '—' },
    { key: 'id', header: 'Actions', render: (a: ApplicationRow) => <Link href={`/sis/admin/admissions/${a.id}`} className="text-xs font-bold text-[#9c27b3] hover:underline">View</Link> },
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div></div>;
  }

  if (error) {
    return <div className="p-8 bg-red-50 border border-red-100 rounded-none text-center"><p className="text-red-600 font-medium text-sm">{error}</p></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        subtitle="Manage student applications"
        actions={
          <Link href="/sis/admin/admissions/new" className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors no-underline">
            <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> New Application
          </Link>
        }
      />
      <DataTable columns={columns} data={applications} keyField="id" emptyMessage="No applications found" />
    </div>
  );
}
