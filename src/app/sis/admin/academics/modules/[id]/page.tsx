'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { DataTable } from '@/components/sis/DataTable';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon as Plus } from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { getSISAcademicModule } from '../../../actions';

interface Module {
  id: string;
  code: string;
  title: string;
  credits: number;
  school: string;
  status: string;
}

export default function ModulesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getSISAcademicModule(id);
        if (!result.success) throw new Error(result.error);

        const m = result.data;
        setModule({
          id: m.id,
          code: m.code,
          title: m.title,
          credits: m.credits || 0,
          school: m.school?.name || '—',
          status: m.isActive ? 'active' : 'inactive',
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load module');
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

  if (!module) {
    return <div className="p-8 text-center text-neutral-400">Module not found</div>;
  }

  const columns = [
    { key: 'code', header: 'Code' },
    { key: 'title', header: 'Title' },
    { key: 'credits', header: 'Credits' },
    { key: 'school', header: 'School' },
    { key: 'status', header: 'Status', render: (m: Module) => <StatusBadge status={m.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Module ${module.code}`}
        subtitle="Module details"
      />
      <DataTable columns={columns} data={[module]} keyField="id" emptyMessage="No module data" />
    </div>
  );
}