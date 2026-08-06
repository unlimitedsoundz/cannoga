'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { DataTable } from '@/components/sis/DataTable';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon as Plus } from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { getSISFaculty } from '../actions';

interface FacultyRow {
  id: string;
  name: string;
  role: string;
  email: string | null;
  school: { name: string } | null;
  department: { name: string } | null;
  createdAt: string;
}

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<FacultyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const result = await getSISFaculty();
        if (!result.success) throw new Error(result.error);
        setFaculty(result.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load faculty');
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  const columns = [
    { key: 'name', header: 'Name', render: (f: FacultyRow) => <span className="font-medium text-neutral-900">{f.name}</span> },
    { key: 'role', header: 'Role' },
    { key: 'department', header: 'Department', render: (f: FacultyRow) => f.department?.name || '—' },
    { key: 'school', header: 'School', render: (f: FacultyRow) => f.school?.name || '—' },
    { key: 'email', header: 'Email', render: (f: FacultyRow) => <span className="font-mono text-sm text-neutral-600">{f.email || '—'}</span> },
    { key: 'createdAt', header: 'Hire Date', render: (f: FacultyRow) => f.createdAt ? new Date(f.createdAt).toLocaleDateString('en-CA') : '—' },
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
        title="Faculty"
        subtitle="Manage faculty members"
        actions={
          <Link href="/sis/admin/faculty/new" className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors no-underline">
            <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> Add Faculty
          </Link>
        }
      />
      <DataTable columns={columns} data={faculty} keyField="id" emptyMessage="No faculty members found" />
    </div>
  );
}
