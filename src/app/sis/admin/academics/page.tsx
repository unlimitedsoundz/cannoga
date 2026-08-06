'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { ActionToolbar } from '@/components/sis/ActionToolbar';
import { DataTable } from '@/components/sis/DataTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { FilterBar } from '@/components/sis/FilterBar';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { BookOpenIcon as BookOpen, FilterHorizontalIcon as Filter, Search01Icon as Search, ArrowRightIcon as ArrowRight } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { getSISAcademicPrograms, getSISAcademicModules } from '../actions';

interface ProgramRow {
  id: string;
  title: string;
  slug: string;
  degreeLevel: string;
  duration: string;
  description: string | null;
  language: string;
  school?: { name: string };
  department?: { name: string };
}

interface ModuleRow {
  id: string;
  code: string;
  title: string;
  credits: number;
  capacity: number;
  description: string | null;
  department?: { name: string };
}

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState<'programs' | 'modules'>('programs');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [programs, setPrograms] = useState<ProgramRow[]>([]);
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [progResult, modResult] = await Promise.all([
          getSISAcademicPrograms(),
          getSISAcademicModules(),
        ]);
        if (!progResult.success) throw new Error(progResult.error);
        if (!modResult.success) throw new Error(modResult.error);
        setPrograms(progResult.data || []);
        setModules(modResult.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load academic data');
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

  const filteredPrograms = programs.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const filteredModules = modules.filter(m =>
    !search || m.code.toLowerCase().includes(search.toLowerCase()) || m.title.toLowerCase().includes(search.toLowerCase())
  );

  const programColumns = [
    { key: 'slug', header: 'Code', render: (p: ProgramRow) => <span className="font-mono font-medium text-neutral-900">{p.slug}</span> },
    { key: 'title', header: 'Program', render: (p: ProgramRow) => <div className="font-medium text-neutral-900">{p.title}</div> },
    { key: 'school', header: 'School', render: (p: ProgramRow) => p.school?.name || '—' },
    { key: 'degreeLevel', header: 'Credential', render: (p: ProgramRow) => p.degreeLevel || '—' },
    { key: 'duration', header: 'Duration' },
    { key: 'language', header: 'Language' },
    {
      key: 'actions',
      header: 'Actions',
      render: (p: ProgramRow) => (
        <Link href={`/sis/admin/academics/programs/${p.id}`} className="text-xs font-bold uppercase tracking-wider text-[#9c27b3] hover:underline no-underline">Manage</Link>
      ),
    },
  ];

  const moduleColumns = [
    { key: 'code', header: 'Code', render: (m: ModuleRow) => <span className="font-mono font-medium text-neutral-900">{m.code}</span> },
    { key: 'title', header: 'Title', render: (m: ModuleRow) => <div className="font-medium text-neutral-900">{m.title}</div> },
    { key: 'credits', header: 'Credits' },
    { key: 'capacity', header: 'Capacity' },
    { key: 'department', header: 'Department', render: (m: ModuleRow) => m.department?.name || '—' },
    {
      key: 'actions',
      header: 'Actions',
      render: (m: ModuleRow) => (
        <Link href={`/sis/admin/academics/modules/${m.id}`} className="text-xs font-bold uppercase tracking-wider text-[#9c27b3] hover:underline no-underline">Manage</Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Administration"
        subtitle="Manage programs, courses, modules, and academic infrastructure"
      />

      <div className="flex gap-4 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab('programs')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'programs' ? 'border-[#9c27b3] text-[#9c27b3]' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}
        >
          Programs
        </button>
        <button
          onClick={() => setActiveTab('modules')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'modules' ? 'border-[#9c27b3] text-[#9c27b3]' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}
        >
          Modules
        </button>
      </div>

      <ActionToolbar
        search={<SearchBar value={search} onChange={setSearch} placeholder={`Search ${activeTab}...`} />}
      />

      {activeTab === 'programs' ? (
        <DataTable
          columns={programColumns}
          data={filteredPrograms}
          keyField="id"
          pagination={{ page, pageSize: 10, total: filteredPrograms.length, onPageChange: setPage }}
          emptyMessage="No programs found"
        />
      ) : (
        <DataTable
          columns={moduleColumns}
          data={filteredModules}
          keyField="id"
          pagination={{ page, pageSize: 10, total: filteredModules.length, onPageChange: setPage }}
          emptyMessage="No modules found"
        />
      )}
    </div>
  );
}