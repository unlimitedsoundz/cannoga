'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { ActionToolbar } from '@/components/sis/ActionToolbar';
import { DataTable } from '@/components/sis/DataTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { FilterBar } from '@/components/sis/FilterBar';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { UserAdd01Icon as UserPlus } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { getSISStudents, toggleStudentPortalAccessAction, toggleStudentSISAccessAction } from '../actions';
import { toast } from 'sonner';

interface StudentRow {
  id: string;
  student_id: string;
  user_id?: string;
  portal_access_disabled?: boolean;
  sis_access_disabled?: boolean;
  first_name: string;
  last_name: string;
  email: string;
  program: string;
  school: string;
  status: string;
  enrollment_status: string;
  advisor: string;
  hold: boolean;
  course?: { title: string; school?: { name: string }[] };
}

export default function AdminStudentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [data, setData] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getSISStudents();
        if (!result.success) throw new Error(result.error);
        setData(result.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTogglePortal = async (student: StudentRow, disabled: boolean) => {
    try {
      setTogglingId(`${student.id}-portal`);
      const res = await toggleStudentPortalAccessAction(student.id, disabled);
      if (!res.success) throw new Error(res.error);
      setData(prev => prev.map(s => s.id === student.id ? { ...s, portal_access_disabled: disabled } : s));
      toast.success(disabled ? `Portal access disabled for ${student.first_name}` : `Portal access enabled for ${student.first_name}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update portal access');
    } finally {
      setTogglingId(null);
    }
  };

  const handleToggleSIS = async (student: StudentRow, disabled: boolean) => {
    try {
      setTogglingId(`${student.id}-sis`);
      const res = await toggleStudentSISAccessAction(student.id, disabled);
      if (!res.success) throw new Error(res.error);
      setData(prev => prev.map(s => s.id === student.id ? { ...s, sis_access_disabled: disabled } : s));
      toast.success(disabled ? `SIS access disabled for ${student.first_name}` : `SIS access enabled for ${student.first_name}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update SIS access');
    } finally {
      setTogglingId(null);
    }
  };

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
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-white text-neutral-900 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors">Retry</button>
      </div>
    );
  }

  const filtered = data.filter(s => {
    const matchesSearch = !search ||
      s.first_name.toLowerCase().includes(search.toLowerCase()) ||
      s.last_name.toLowerCase().includes(search.toLowerCase()) ||
      s.student_id.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.program.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || s.status === statusFilter;
    const matchesSchool = !schoolFilter || s.school === schoolFilter;
    return matchesSearch && matchesStatus && matchesSchool;
  });

  const columns = [
    {
      key: 'student_id',
      header: 'Student ID',
      render: (s: StudentRow) => <span className="font-mono text-xs text-neutral-200">{s.student_id}</span>,
    },
    {
      key: 'name',
      header: 'Student',
      render: (s: StudentRow) => (
        <div>
          <div className="font-bold text-xs text-neutral-200">{s.first_name} {s.last_name}</div>
          <div className="text-[10px] text-neutral-500 font-mono">{s.email}</div>
        </div>
      ),
    },
    { key: 'program', header: 'Program', render: (s: StudentRow) => <span className="text-xs text-slate-400">{s.program || '—'}</span> },
    { key: 'school', header: 'School', render: (s: StudentRow) => <span className="text-xs text-slate-400">{s.school || '—'}</span> },
    { key: 'status', header: 'Status', render: (s: StudentRow) => <StatusBadge status={s.status} /> },
    { key: 'enrollment_status', header: 'Enrollment', render: (s: StudentRow) => <StatusBadge status={s.enrollment_status} /> },
    {
      key: 'access',
      header: 'Access Control',
      render: (s: StudentRow) => (
        <div className="flex flex-col gap-1.5 min-w-[130px]" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between gap-1 text-[11px]">
            <span className="text-slate-400 font-mono text-[10px]">Portal:</span>
            <button
              type="button"
              disabled={togglingId === `${s.id}-portal`}
              onClick={() => handleTogglePortal(s, !s.portal_access_disabled)}
              title={s.portal_access_disabled ? 'Click to enable portal access' : 'Click to disable portal access'}
              className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all ${
                s.portal_access_disabled
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
              } ${togglingId === `${s.id}-portal` ? 'opacity-50 cursor-wait' : ''}`}
            >
              {togglingId === `${s.id}-portal` ? '...' : (s.portal_access_disabled ? 'Disabled' : 'Enabled')}
            </button>
          </div>
          <div className="flex items-center justify-between gap-1 text-[11px]">
            <span className="text-slate-400 font-mono text-[10px]">SIS:</span>
            <button
              type="button"
              disabled={togglingId === `${s.id}-sis`}
              onClick={() => handleToggleSIS(s, !s.sis_access_disabled)}
              title={s.sis_access_disabled ? 'Click to enable SIS access' : 'Click to disable SIS access'}
              className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all ${
                s.sis_access_disabled
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
              } ${togglingId === `${s.id}-sis` ? 'opacity-50 cursor-wait' : ''}`}
            >
              {togglingId === `${s.id}-sis` ? '...' : (s.sis_access_disabled ? 'Disabled' : 'Enabled')}
            </button>
          </div>
        </div>
      ),
    },
    {
      key: 'hold',
      header: 'Hold',
      render: (s: StudentRow) => s.hold ? (
        <span className="px-2 py-0.5 bg-white/10 text-white border border-white/20 rounded-md text-[10px] font-bold uppercase">Yes</span>
      ) : (
        <span className="text-neutral-600 text-[10px]">No</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (s: StudentRow) => (
        <Link href={`/sis/admin/students/${s.id}/`} className="text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors no-underline">
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Administration"
        subtitle="Manage all student records, enrollment, and academic standing"
        actions={
          <Link href="/sis/admin/students/new/" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-200 transition-colors no-underline">
            <HugeiconsIcon icon={UserPlus} size={14} strokeWidth={2.5} /> New Student
          </Link>
        }
      />

      <ActionToolbar
        search={<SearchBar value={search} onChange={setSearch} placeholder="Search by name, ID, email, program..." />}
        filter={
          <FilterBar
            filters={[
              { key: 'status', label: 'Status', value: statusFilter, onChange: setStatusFilter, options: [
                { value: '', label: 'All Statuses' },
                { value: 'ACTIVE', label: 'Active' },
                { value: 'ON_LEAVE', label: 'On Leave' },
                { value: 'PROBATION', label: 'Probation' },
                { value: 'GRADUATED', label: 'Graduated' },
                { value: 'WITHDRAWN', label: 'Withdrawn' },
              ]},
              { key: 'school', label: 'School', value: schoolFilter, onChange: setSchoolFilter, options: [
                { value: '', label: 'All Schools' },
                { value: 'Health', label: 'Health & Community Services' },
                { value: 'Business', label: 'Business' },
                { value: 'Technology', label: 'Technology' },
                { value: 'Arts', label: 'Arts & Design' },
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Science', label: 'Science' },
              ]},
            ]}
          />}
      />

      <DataTable
        columns={columns}
        data={filtered}
        keyField="id"
        selection={{ selected, onChange: setSelected }}
        pagination={{
          page,
          pageSize: 10,
          total: filtered.length,
          onPageChange: setPage,
        }}
        emptyMessage="No students found"
      />

      {selected.size > 0 && (
        <div className="flex items-center justify-between p-4 bg-[#1a1a1a] border border-white/8 rounded-2xl">
          <span className="text-sm font-medium text-neutral-300">{selected.size} selected</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-white/10 text-neutral-300 hover:text-white rounded-lg transition-colors">Export</button>
            <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors">Bulk Action</button>
          </div>
        </div>
      )}
    </div>
  );
}
