'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { ActionToolbar } from '@/components/sis/ActionToolbar';
import { DataTable } from '@/components/sis/DataTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { FilterBar } from '@/components/sis/FilterBar';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { ShieldIcon as Shield, FilterHorizontalIcon as Filter, Search01Icon as Search, ArrowRightIcon as ArrowRight } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { getSISDocuments } from '../actions';

interface DocumentRow {
  id: string;
  status: string;
  submitted_at?: string;
  course?: { title: string; degreeLevel?: string };
  user?: { first_name: string; last_name: string; email: string };
  documents?: { id: string; type: string; name: string; url: string; created_at: string }[];
}

const formatDegreeLevel = (level: string) => {
    if (!level) return '';
    return level.charAt(0) + level.slice(1).toLowerCase();
};

export default function DocumentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getSISDocuments();
        if (!result.success) throw new Error(result.error);
        setData((result.data || []) as unknown as DocumentRow[]);
      } catch (err: any) {
        setError(err.message || 'Failed to load documents');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-950/60 rounded-2xl text-center">
        <p className="text-red-300 font-medium text-sm">{error}</p>
      </div>
    );
  }

  const filtered = data.filter(d => {
    const matchesSearch = !search ||
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.user?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.user?.last_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      d.course?.title?.toLowerCase().includes(search.toLowerCase()) ||
      d.course?.degreeLevel?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'id',
      header: 'Application',
      render: (d: DocumentRow) => <span className="font-mono font-bold text-white">{d.id.slice(0, 8)}</span>,
    },
    {
      key: 'applicant',
      header: 'Applicant',
      render: (d: DocumentRow) => (
        <div>
          <div className="font-bold text-xs text-white">{d.user?.first_name} {d.user?.last_name}</div>
          <div className="text-[10px] text-slate-400 font-mono">{d.user?.email}</div>
        </div>
      ),
    },
    { key: 'program', header: 'Program', render: (d: DocumentRow) => <span className="text-xs text-neutral-300">{`${d.course?.title || '—'}${d.course?.degreeLevel ? ` ${formatDegreeLevel(d.course.degreeLevel)}` : ''}`}</span> },
    {
      key: 'documents',
      header: 'Documents',
      render: (d: DocumentRow) => d.documents ? (
        <span className="text-xs font-bold text-neutral-300">{d.documents.length} file(s)</span>
      ) : (
        <span className="text-neutral-500 text-xs">None</span>
      ),
    },
    { key: 'status', header: 'Status', render: (d: DocumentRow) => <StatusBadge status={d.status.replace('_', ' ')} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (d: DocumentRow) => (
        <Link href={`/sis/admin/documents/${d.id}`} className="text-xs font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors no-underline">Review</Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Verification"
        subtitle="Review and verify student admission documents"
      />

      <ActionToolbar
        search={<SearchBar value={search} onChange={setSearch} placeholder="Search by application #, name, email, program..." />}
        filter={
          <FilterBar
            filters={[
              { key: 'status', label: 'Status', value: statusFilter, onChange: setStatusFilter, options: [
                { value: '', label: 'All Statuses' },
                { value: 'UNDER_REVIEW', label: 'Under Review' },
                { value: 'VERIFIED', label: 'Verified' },
                { value: 'REJECTED', label: 'Rejected' },
                { value: 'DOCS_REQUIRED', label: 'Additional Info Required' },
              ]},
            ]}
          />}
      />

      <div className="bg-neutral-900 rounded-2xl overflow-hidden shadow-sm">
        <DataTable
          columns={columns}
          data={filtered}
          keyField="id"
          pagination={{ page, pageSize: 10, total: filtered.length, onPageChange: setPage }}
          emptyMessage="No documents found"
        />
      </div>
    </div>
  );
}