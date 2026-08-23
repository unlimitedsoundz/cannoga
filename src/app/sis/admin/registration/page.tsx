'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { ActionToolbar } from '@/components/sis/ActionToolbar';
import { DataTable } from '@/components/sis/DataTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { FilterBar } from '@/components/sis/FilterBar';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { ClipboardListIcon as ClipboardList, FilterHorizontalIcon as Filter, Search01Icon as Search, ArrowRightIcon as ArrowRight } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { getSISRegistrations } from '../actions';

interface RegistrationRow {
  id: string;
  student_id: string;
  module_id: string;
  semester_id: string;
  status: string;
  grade: number | null;
  grade_status: string;
  module?: { code: string; title: string };
  semester?: { name: string };
  student?: { student_id: string; user_id: string };
  user?: { first_name: string; last_name: string };
}

export default function RegistrationPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<RegistrationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getSISRegistrations();
        if (!result.success) throw new Error(result.error);
        setData(result.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load registration data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div></div>;
  }

  if (error) {
    return <div className="p-8 bg-red-50 border border-red-100 rounded-none text-center"><p className="text-red-600 font-medium text-sm">{error}</p></div>;
  }

  const filtered = data.filter(r => {
    const matchesSearch = !search ||
      r.student?.student_id?.toLowerCase().includes(search.toLowerCase()) ||
      r.user?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.user?.last_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.module?.code?.toLowerCase().includes(search.toLowerCase()) ||
      r.module?.title?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'student_id',
      header: 'Student',
      render: (r: RegistrationRow) => (
        <div>
          <div className="font-medium text-white">{r.user?.first_name} {r.user?.last_name}</div>
          <div className="text-xs text-neutral-400 font-mono">{r.student?.student_id}</div>
        </div>
      ),
    },
    { key: 'module_code', header: 'Module', render: (r: RegistrationRow) => <span className="font-mono text-white">{r.module?.code}</span> },
    { key: 'title', header: 'Title', render: (r: RegistrationRow) => <span className="text-white">{r.module?.title || '—'}</span> },
    { key: 'semester', header: 'Semester', render: (r: RegistrationRow) => <span className="text-white">{r.semester?.name || '—'}</span> },
    { key: 'status', header: 'Status', render: (r: RegistrationRow) => <StatusBadge status={r.status} /> },
    { key: 'grade', header: 'Grade', render: (r: RegistrationRow) => <span className="text-white">{r.grade !== null ? r.grade.toFixed(2) : '—'}</span> },
    {
      key: 'actions',
      header: 'Actions',
      render: (r: RegistrationRow) => (
        <Link href={`/sis/admin/registration/${r.id}/`} className="text-xs font-bold uppercase tracking-wider text-white hover:text-purple-300 hover:underline no-underline">View</Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Registration Administration"
        subtitle="Manage course registrations, enrollments, and class rosters"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Registrations</div>
          <div className="text-2xl font-black text-white mt-1">{data.length}</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Registered</div>
          <div className="text-2xl font-black text-blue-400 mt-1">{data.filter(r => r.status === 'REGISTERED').length}</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{data.filter(r => r.status === 'COMPLETED').length}</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Dropped</div>
          <div className="text-2xl font-black text-red-400 mt-1">{data.filter(r => r.status === 'DROPPED').length}</div>
        </div>
      </div>

      <ActionToolbar
        search={<SearchBar value={search} onChange={setSearch} placeholder="Search by student ID, name, module code..." />}
        filter={
          <FilterBar
                        filters={[
              { key: 'status', label: 'Status', value: statusFilter, onChange: setStatusFilter, options: [
                { value: '', label: 'All Statuses' },
                { value: 'REGISTERED', label: 'Registered' },
                { value: 'DROPPED', label: 'Dropped' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'FAILED', label: 'Failed' },
              ]},
            ]}
          />}
      />

      <DataTable
        columns={columns}
        data={filtered}
        keyField="id"
        pagination={{ page, pageSize: 10, total: filtered.length, onPageChange: setPage }}
        emptyMessage="No registrations found"
      />
    </div>
  );
}
