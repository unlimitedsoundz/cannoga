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
import { getSISStudents } from '../actions';

interface StudentRow {
  id: string;
  student_id: string;
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
        <p className="text-slate-800 font-medium text-sm">{error}</p>
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
    { key: 'program', header: 'Program', render: (s: StudentRow) => <span className="text-xs text-slate-800">{s.program || '—'}</span> },
    { key: 'school', header: 'School', render: (s: StudentRow) => <span className="text-xs text-slate-800">{s.school || '—'}</span> },
    { key: 'status', header: 'Status', render: (s: StudentRow) => <StatusBadge status={s.status} /> },
    { key: 'enrollment_status', header: 'Enrollment', render: (s: StudentRow) => <StatusBadge status={s.enrollment_status} /> },
    { key: 'advisor', header: 'Advisor', render: (s: StudentRow) => <span className="text-xs text-slate-800">{s.advisor || '—'}</span> },
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
        <Link href={`/sis/admin/students/${s.id}`} className="text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors no-underline">
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
          <Link href="/sis/admin/students/new" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-200 transition-colors no-underline">
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
