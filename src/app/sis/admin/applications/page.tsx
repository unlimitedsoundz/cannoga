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
    { key: 'application_number', header: 'Application #', render: (a: ApplicationRow) => <span className="font-mono text-xs text-neutral-200">{a.application_number || a.id.slice(0, 8)}</span> },
    { key: 'user', header: 'Student', render: (a: ApplicationRow) => <span className="font-bold text-xs text-neutral-200">{a.user ? `${a.user.first_name} ${a.user.last_name}` : '—'}</span> },
    { key: 'course', header: 'Program', render: (a: ApplicationRow) => <span className="text-xs text-slate-400">{`${a.course?.title || '—'}${a.course?.degreeLevel ? ` ${formatDegreeLevel(a.course.degreeLevel)}` : ''}`}</span> },
    { key: 'status', header: 'Status', render: (a: ApplicationRow) => <StatusBadge status={a.status} /> },
    { key: 'submitted_at', header: 'Submitted', render: (a: ApplicationRow) => <span className="text-xs text-neutral-500">{a.submitted_at ? new Date(a.submitted_at).toLocaleDateString('en-CA') : '—'}</span> },
    { key: 'id', header: 'Actions', render: (a: ApplicationRow) => <Link href={`/sis/admin/admissions/${a.id}/`} className="text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors no-underline">View</Link> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-white/4 border border-white/10 rounded-2xl text-center">
        <p className="text-slate-400 font-medium text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        subtitle="Manage student applications"
        actions={
          <Link href="/sis/admin/admissions/new/" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-200 transition-colors no-underline">
            <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> New Application
          </Link>
        }
      />
      <DataTable columns={columns} data={applications} keyField="id" emptyMessage="No applications found" />
    </div>
  );
}
