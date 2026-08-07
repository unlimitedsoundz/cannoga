'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { DataTable } from '@/components/sis/DataTable';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon as Plus } from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getSISAcademicProgram } from '../../../actions';

interface Program {
  id: string;
  name: string;
  school: string;
  credential: string;
  duration: string;
  status: string;
}

export default function ProgramsPage() {
  const params = useParams() as { id: string };
  const id = params.id as string;
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getSISAcademicProgram(id);
        if (!result.success) throw new Error(result.error);

        const p = result.data;
        setProgram({
          id: p.id,
          name: p.title,
          school: p.school?.name || '—',
          credential: p.degreeLevel || '—',
          duration: p.duration || '—',
          status: p.isActive ? 'active' : 'inactive',
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load program');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div></div>;
  }

  if (error) {
    return <div className="p-8 bg-red-50 border border-red-100 rounded-none text-center"><p className="text-red-600 font-medium text-sm">{error}</p></div>;
  }

  if (!program) {
    return <div className="p-8 text-center text-neutral-400">Program not found</div>;
  }

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'school', header: 'School' },
    { key: 'credential', header: 'Credential' },
    { key: 'duration', header: 'Duration' },
    { key: 'status', header: 'Status', render: (p: Program) => <StatusBadge status={p.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Program ${program.name}`}
        subtitle="Program details"
      />
      <DataTable columns={columns} data={[program]} keyField="id" emptyMessage="No program data" />
    </div>
  );
}