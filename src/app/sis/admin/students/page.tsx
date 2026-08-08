'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { ActionToolbar } from '@/components/sis/ActionToolbar';
import { DataTable } from '@/components/sis/DataTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { FilterBar } from '@/components/sis/FilterBar';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { Add01Icon as Plus, FilterHorizontalIcon as Filter, Download01Icon as Download, UserAdd01Icon as UserPlus } from '@hugeicons/core-free-icons';
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-none text-center">
        <p className="text-red-600 font-medium text-sm">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-none text-xs font-bold uppercase tracking-widest">Retry</button>
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
      render: (s: StudentRow) => <span className="font-mono font-medium text-neutral-900">{s.student_id}</span>,
    },
    {
      key: 'name',
      header: 'Student',
      render: (s: StudentRow) => (
        <div>
          <div className="font-medium text-neutral-900">{s.first_name} {s.last_name}</div>
          <div className="text-xs text-neutral-500 font-mono">{s.email}</div>
        </div>
      ),
    },
    { key: 'program', header: 'Program' },
    { key: 'school', header: 'School' },
    { key: 'status', header: 'Status', render: (s: StudentRow) => <StatusBadge status={s.status} /> },
    { key: 'enrollment_status', header: 'Enrollment', render: (s: StudentRow) => <StatusBadge status={s.enrollment_status} /> },
    { key: 'advisor', header: 'Advisor' },
    {
      key: 'hold',
      header: 'Hold',
      render: (s: StudentRow) => s.hold ? (
        <span className="px-2 py-1 bg-red-50 text-red-700 rounded-none text-[10px] font-bold uppercase">Yes</span>
      ) : (
        <span className="text-neutral-400 text-[10px]">No</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (s: StudentRow) => (
        <Link href={`/sis/admin/students/${s.id}`} className="text-xs font-bold uppercase tracking-wider text-[#9c27b3] hover:underline no-underline">
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
          <Link href="/sis/admin/students/new" className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors no-underline">
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
        <div className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200">
          <span className="text-sm font-medium text-neutral-700">{selected.size} selected</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-neutral-200 text-neutral-700 hover:bg-neutral-100">Export</button>
            <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-red-600 text-white hover:bg-red-700">Bulk Action</button>
          </div>
        </div>
      )}
    </div>
  );
}
