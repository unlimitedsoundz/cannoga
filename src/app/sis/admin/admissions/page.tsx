'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { ActionToolbar } from '@/components/sis/ActionToolbar';
import { DataTable } from '@/components/sis/DataTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { FilterBar } from '@/components/sis/FilterBar';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import { File01Icon as FileText } from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { getSISAdmissionsApplications } from '../actions';

interface ApplicationRow {
  id: string;
  application_number?: string;
  status: string;
  submitted_at?: string;
  personal_info?: any;
  course?: { title: string; degreeLevel?: string };
  user?: { first_name: string; last_name: string; email: string; citizenship?: string; country_of_residence?: string };
}

const formatDegreeLevel = (level: string) => {
    if (!level) return '';
    return level.charAt(0) + level.slice(1).toLowerCase();
};

export default function AdmissionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getSISAdmissionsApplications();
        if (!result.success) throw new Error(result.error);
        setData(result.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load applications');
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
        <p className="text-slate-400 font-medium text-sm">{error}</p>
      </div>
    );
  }

  const filtered = data.filter(a => {
    const matchesSearch = !search ||
      a.application_number?.toLowerCase().includes(search.toLowerCase()) ||
      a.user?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.user?.last_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.course?.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.course?.degreeLevel?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'application_number',
      header: 'Application #',
      render: (a: ApplicationRow) => <span className="font-mono text-xs text-neutral-200">{a.application_number || a.id}</span>,
    },
    {
      key: 'applicant',
      header: 'Applicant',
      render: (a: ApplicationRow) => (
        <div>
          <div className="font-bold text-xs text-neutral-200">{a.user?.first_name} {a.user?.last_name}</div>
          <div className="text-[10px] text-neutral-500 font-mono">{a.user?.email}</div>
        </div>
      ),
    },
    {
      key: 'student_type',
      header: 'Type',
      render: (a: ApplicationRow) => {
        const rawType = (a.personal_info?.studentType || '').toLowerCase();
        const rawCountry = (a.personal_info?.country || a.personal_info?.nationality || a.user?.country_of_residence || a.user?.citizenship || '').toLowerCase();
        const isDomestic = rawType === 'domestic' || (!rawType && (rawCountry === 'canada' || rawCountry === 'canadian'));
        const label = rawType === 'domestic' ? 'Domestic' : rawType === 'international' ? 'International' : (isDomestic ? 'Domestic' : 'International');
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            isDomestic
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
          }`}>
            {label}
          </span>
        );
      },
    },
    { key: 'program', header: 'Program', render: (a: ApplicationRow) => <span className="text-xs text-slate-400">{`${a.course?.title || '—'}${a.course?.degreeLevel ? ` ${formatDegreeLevel(a.course.degreeLevel)}` : ''}`}</span> },
    {
      key: 'submitted_at',
      header: 'Submitted Date',
      render: (a: ApplicationRow & { created_at?: string }) => {
        const rawDate = a.submitted_at || a.created_at;
        if (!rawDate) return <span className="text-xs text-neutral-500">In Draft</span>;
        const d = new Date(rawDate);
        return (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-neutral-200">
              {d.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">
              {d.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        );
      },
    },
    { key: 'status', header: 'Status', render: (a: ApplicationRow) => <StatusBadge status={a.status.replace('_', ' ')} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (a: ApplicationRow) => (
        <Link href={`/sis/admin/admissions/${a.id}/`} className="text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors no-underline">Review</Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admissions"
        subtitle="Review and process admissions applications"
        actions={
          <Link href="/sis/admin/admissions/new/" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-200 transition-colors no-underline">
            <HugeiconsIcon icon={FileText} size={14} strokeWidth={2.5} /> New Application
          </Link>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">Total Applications</div>
          <div className="text-2xl font-black text-white mt-1">{data.length}</div>
        </div>
        <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">Under Review</div>
          <div className="text-2xl font-black text-white mt-1">{data.filter(a => a.status === 'UNDER_REVIEW' || a.status === 'DOCS_REQUIRED').length}</div>
        </div>
        <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">Admitted</div>
          <div className="text-2xl font-black text-white mt-1">{data.filter(a => a.status === 'ADMITTED' || a.status === 'OFFER_ACCEPTED').length}</div>
        </div>
        <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">Rejected</div>
          <div className="text-2xl font-black text-slate-400 mt-1">{data.filter(a => a.status === 'REJECTED' || a.status === 'OFFER_DECLINED').length}</div>
        </div>
      </div>

      <ActionToolbar
        search={<SearchBar value={search} onChange={setSearch} placeholder="Search by application #, name, email, program..." />}
        filter={
          <FilterBar
            filters={[
              { key: 'status', label: 'Status', value: statusFilter, onChange: setStatusFilter, options: [
                { value: '', label: 'All Statuses' },
                { value: 'SUBMITTED', label: 'Submitted' },
                { value: 'UNDER_REVIEW', label: 'Under Review' },
                { value: 'DOCS_REQUIRED', label: 'Documents Required' },
                { value: 'ADMITTED', label: 'Admitted' },
                { value: 'OFFER_ACCEPTED', label: 'Offer Accepted' },
                { value: 'REJECTED', label: 'Rejected' },
                { value: 'OFFER_DECLINED', label: 'Offer Declined' },
              ]},
            ]}
          />}
      />

      <DataTable
        columns={columns}
        data={filtered}
        keyField="id"
        pagination={{ page, pageSize: 10, total: filtered.length, onPageChange: setPage }}
        emptyMessage="No applications found"
      />
    </div>
  );
}