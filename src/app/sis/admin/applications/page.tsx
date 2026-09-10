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
import { Add01Icon as Plus } from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { getSISAdmissionsApplications } from '../actions';

interface ApplicationRow {
  id: string;
  application_number?: string;
  status: string;
  submitted_at?: string;
  created_at?: string;
  personal_info?: any;
  course?: { title: string; degreeLevel?: string };
  user?: { first_name: string; last_name: string; email: string; citizenship?: string; country_of_residence?: string };
}

const formatDegreeLevel = (level: string) => {
  if (!level) return '';
  return level.charAt(0) + level.slice(1).toLowerCase();
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getSISAdmissionsApplications();
        if (!result.success) throw new Error(result.error);
        setApplications(result.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = applications.filter(a => {
    const query = search.toLowerCase().trim();
    const matchesSearch = !query ||
      a.application_number?.toLowerCase().includes(query) ||
      a.id?.toLowerCase().includes(query) ||
      a.user?.first_name?.toLowerCase().includes(query) ||
      a.user?.last_name?.toLowerCase().includes(query) ||
      `${a.user?.first_name || ''} ${a.user?.last_name || ''}`.toLowerCase().includes(query) ||
      a.user?.email?.toLowerCase().includes(query) ||
      a.course?.title?.toLowerCase().includes(query) ||
      a.course?.degreeLevel?.toLowerCase().includes(query);

    const matchesStatus = !statusFilter || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'application_number',
      header: 'Application #',
      render: (a: ApplicationRow) => (
        <span className="font-mono text-xs text-neutral-200">
          {a.application_number || a.id.slice(0, 8)}
        </span>
      ),
    },
    {
      key: 'user',
      header: 'Student',
      render: (a: ApplicationRow) => (
        <div>
          <div className="font-bold text-xs text-neutral-200">
            {a.user ? `${a.user.first_name} ${a.user.last_name}` : '—'}
          </div>
          {a.user?.email && (
            <div className="text-[10px] text-neutral-500 font-mono">
              {a.user.email}
            </div>
          )}
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
    {
      key: 'course',
      header: 'Program',
      render: (a: ApplicationRow) => (
        <span className="text-xs text-slate-400">
          {`${a.course?.title || '—'}${a.course?.degreeLevel ? ` ${formatDegreeLevel(a.course.degreeLevel)}` : ''}`}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (a: ApplicationRow) => <StatusBadge status={a.status} />,
    },
    {
      key: 'submitted_at',
      header: 'Date',
      render: (a: ApplicationRow) => {
        const rawDate = a.submitted_at || a.created_at;
        if (!rawDate) return <span className="text-xs text-neutral-500">In Draft</span>;
        const isDraft = a.status === 'DRAFT' || !a.submitted_at;
        const d = new Date(rawDate);
        return (
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-neutral-200">
              {d.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">
              {d.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' })}
              {isDraft ? ' (Created)' : ' (Submitted)'}
            </span>
          </div>
        );
      },
    },
    {
      key: 'id',
      header: 'Actions',
      render: (a: ApplicationRow) => (
        <Link
          href={`/sis/admin/admissions/${a.id}/`}
          className="text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors no-underline"
        >
          View
        </Link>
      ),
    },
  ];

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        subtitle="Manage student applications"
        actions={
          <Link
            href="/portal/apply/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-200 transition-colors no-underline"
          >
            <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> New Application
          </Link>
        }
      />

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">Total Applications</div>
          <div className="text-2xl font-black text-white mt-1">{applications.length}</div>
        </div>
        <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">Draft / New</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {applications.filter(a => a.status === 'DRAFT').length}
          </div>
        </div>
        <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">Under Review</div>
          <div className="text-2xl font-black text-sky-400 mt-1">
            {applications.filter(a => a.status === 'UNDER_REVIEW' || a.status === 'DOCS_REQUIRED' || a.status === 'SUBMITTED').length}
          </div>
        </div>
        <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">Admitted / Offers</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {applications.filter(a => a.status === 'ADMITTED' || a.status === 'OFFER_ACCEPTED').length}
          </div>
        </div>
        <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">Enrolled</div>
          <div className="text-2xl font-black text-purple-400 mt-1">
            {applications.filter(a => a.status === 'ENROLLED').length}
          </div>
        </div>
      </div>

      <ActionToolbar
        search={
          <SearchBar
            value={search}
            onChange={(val) => { setSearch(val); setPage(1); }}
            placeholder="Search by application #, name, email, program..."
          />
        }
        filter={
          <FilterBar
            filters={[
              {
                key: 'status',
                label: 'Status',
                value: statusFilter,
                onChange: (val) => { setStatusFilter(val); setPage(1); },
                options: [
                  { value: '', label: 'All Statuses' },
                  { value: 'DRAFT', label: 'Draft / New' },
                  { value: 'SUBMITTED', label: 'Submitted' },
                  { value: 'UNDER_REVIEW', label: 'Under Review' },
                  { value: 'DOCS_REQUIRED', label: 'Documents Required' },
                  { value: 'ADMITTED', label: 'Admitted' },
                  { value: 'OFFER_ACCEPTED', label: 'Offer Accepted' },
                  { value: 'ENROLLED', label: 'Enrolled' },
                  { value: 'REJECTED', label: 'Rejected' },
                  { value: 'OFFER_DECLINED', label: 'Offer Declined' },
                ],
              },
            ]}
          />
        }
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
