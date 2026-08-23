'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { ActionToolbar } from '@/components/sis/ActionToolbar';
import { DataTable } from '@/components/sis/DataTable';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { SearchBar } from '@/components/sis/SearchBar';
import { FilterBar } from '@/components/sis/FilterBar';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon as Plus, FilterHorizontalIcon as Filter, Download01Icon as Download } from '@hugeicons/core-free-icons';
import Link from 'next/link';

interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  enrollment_status: string;
  start_date: string;
  program_name: string;
  status: string;
}

export default function StudentsPage() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [programFilter, setProgramFilter] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/sis/students');
        if (response.ok) {
          const data = await response.json();
          setStudents(data.students || []);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filtered = students.filter(s => {
    const matchesSearch = (s.first_name + ' ' + s.last_name).toLowerCase().includes(search.toLowerCase()) ||
      s.student_id.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || s.enrollment_status === statusFilter;
    const matchesProgram = !programFilter || s.program_name === programFilter;
    return matchesSearch && matchesStatus && matchesProgram;
  });

  const columns = [
    {
      key: 'student_id',
      header: 'Student ID',
      render: (s: Student) => <span className="font-mono font-medium text-neutral-900">{s.student_id}</span>,
    },
    {
      key: 'name',
      header: 'Student',
      render: (s: Student) => (
        <div>
          <div className="font-medium text-neutral-900">{s.first_name} {s.last_name}</div>
          <div className="text-xs text-neutral-500 font-mono">{s.email}</div>
        </div>
      ),
    },
    {
      key: 'program_name',
      header: 'Program',
    },
    {
      key: 'enrollment_status',
      header: 'Status',
      render: (s: Student) => <StatusBadge status={s.enrollment_status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (s: Student) => (
        <Link href={`/sis/students/${s.id}/`} className="text-xs font-bold uppercase tracking-wider text-[#0a151a] hover:underline no-underline">
          View
        </Link>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Student Records"
          subtitle="Manage student enrollment and academic records"
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Records"
        subtitle="Manage student enrollment and academic records"
        actions={
          <Link href="/sis/students/new/" className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors no-underline">
            <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> Add Student
          </Link>
        }
      />

      <ActionToolbar
        search={<SearchBar value={search} onChange={setSearch} placeholder="Search by name, ID, email..." />}
        filter={
          <FilterBar
            filters={[
              { key: 'status', label: 'Status', value: statusFilter, onChange: setStatusFilter, options: [
                { value: '', label: 'All Statuses' },
                { value: 'ACTIVE', label: 'Active' },
                { value: 'CONFIRMED', label: 'Confirmed' },
                { value: 'ON_LEAVE', label: 'On Leave' },
                { value: 'GRADUATED', label: 'Graduated' },
                { value: 'WITHDRAWN', label: 'Withdrawn' },
              ]},
              { key: 'program', label: 'Program', value: programFilter, onChange: setProgramFilter, options: [
                { value: '', label: 'All Programs' },
                { value: 'BSc Nursing', label: 'BSc Nursing' },
                { value: 'BBA Business Admin', label: 'BBA Business Admin' },
                {value: 'BSc Computer Science', label: 'BSc Computer Science' },
                { value: 'BA Psychology', label: 'BA Psychology' },
                { value: 'BEng Mechanical', label: 'BEng Mechanical' },
                { value: 'BSc Biology', label: 'BSc Biology' },
                { value: 'BFA Fine Arts', label: 'BFA Fine Arts' },
                { value: 'BSc Data Science', label: 'BSc Data Science' },
              ]},
            ]}
          />
        }
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
        <div className="flex items-center justify-between p-4 bg-[#0a151a] text-white rounded-xl shadow-md border border-slate-800">
          <span className="text-xs font-semibold text-slate-300">{selected.size} student{selected.size > 1 ? 's' : ''} selected</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-slate-700 text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">Export CSV</button>
            <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 rounded-lg transition-colors">Bulk Actions</button>
          </div>
        </div>
      )}
    </div>
  );
}
