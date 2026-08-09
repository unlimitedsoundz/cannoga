'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { ActionToolbar } from '@/components/sis/ActionToolbar';
import { DataTable } from '@/components/sis/DataTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { toast } from 'sonner';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Add01Icon as Plus,
  CancelCircleIcon as Minus,
  Settings01Icon as Settings,
  ArrowRight01Icon as ArrowRight,
} from '@hugeicons/core-free-icons';
import { compareVersions } from './actions';
import type { ComparisonResult } from './actions';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function CompareTimetablePage() {
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [versionA, setVersionA] = useState('');
  const [versionB, setVersionB] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'additions' | 'removals' | 'changes'>('all');

  const handleCompare = async () => {
    if (!versionA || !versionB) {
      toast.error('Please enter both version IDs');
      return;
    }
    if (versionA === versionB) {
      toast.error('Please select different versions');
      return;
    }

    setLoading(true);
    const result = await compareVersions(versionA, versionB);
    setLoading(false);
    if (result.success && result.data) {
      setComparison(result.data);
    } else {
      toast.error(result.error || 'Failed to compare versions');
    }
  };

  const getFilteredData = () => {
    if (!comparison) return [];
    switch (activeTab) {
      case 'additions':
        return comparison.additions;
      case 'removals':
        return comparison.removals;
      case 'changes':
        return comparison.changes;
      default:
        return [
          ...comparison.additions.map((a: any) => ({ ...a, action: 'added' })),
          ...comparison.removals.map((r: any) => ({ ...r, action: 'removed' })),
          ...comparison.changes.map((c: any) => ({ ...c, action: 'changed' })),
        ];
    }
  };

  const columns = [
    {
      key: 'action',
      header: '',
      render: (row: any) => {
        const icon = row.action === 'added' ? Plus : row.action === 'removed' ? Minus : Settings;
        const color = row.action === 'added' ? 'text-emerald-600' : row.action === 'removed' ? 'text-red-600' : 'text-amber-600';
        const label = row.action === 'added' ? 'Added' : row.action === 'removed' ? 'Removed' : 'Changed';
        return (
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={icon} size={14} strokeWidth={2.5} className={color} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{label}</span>
          </div>
        );
      },
    },
    {
      key: 'section',
      header: 'Section',
      render: (row: any) => {
        const section = row.section || row.after?.section || row.before?.section || {};
        const code = Array.isArray(section) ? section[0]?.code : section?.code;
        return <span className="font-mono font-medium text-neutral-900">{code || row.section_id || '—'}</span>;
      },
    },
    {
      key: 'day',
      header: 'Day',
      render: (row: any) => {
        const dayOfWeek = row.day_of_week ?? row.before?.day_of_week ?? row.after?.day_of_week;
        return <span className="text-xs text-neutral-700">{DAYS[dayOfWeek] || '—'}</span>;
      },
    },
    {
      key: 'time',
      header: 'Time',
      render: (row: any) => {
        const start = row.start_time ?? row.before?.start_time ?? row.after?.start_time;
        const end = row.end_time ?? row.before?.end_time ?? row.after?.end_time;
        return <span className="text-xs text-neutral-700">{start || '—'} - {end || '—'}</span>;
      },
    },
    {
      key: 'room',
      header: 'Room',
      render: (row: any) => {
        const roomId = row.room_id ?? row.before?.room_id ?? row.after?.room_id;
        return <span className="text-xs text-neutral-700">{roomId || '—'}</span>;
      },
    },
    {
      key: 'instructor',
      header: 'Instructor',
      render: (row: any) => {
        const instructorId = row.instructor_id ?? row.before?.instructor_id ?? row.after?.instructor_id;
        return <span className="text-xs text-neutral-700">{instructorId || 'TBD'}</span>;
      },
    },
    {
      key: 'changes',
      header: 'Changes',
      render: (row: any) => {
        if (row.changedFields && row.changedFields.length > 0) {
          return (
            <div className="flex flex-wrap gap-1">
              {row.changedFields.map((field: string) => (
                <span key={field} className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider rounded">
                  {field}
                </span>
              ))}
            </div>
          );
        }
        return <span className="text-xs text-neutral-500">—</span>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compare Versions"
        subtitle="Side-by-side comparison of timetable versions"
      />

      <div className="bg-white border border-neutral-200 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Version A ID</label>
            <input
              type="text"
              value={versionA}
              onChange={(e) => setVersionA(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
              placeholder="Enter version A ID"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Version B ID</label>
            <input
              type="text"
              value={versionB}
              onChange={(e) => setVersionB(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
              placeholder="Enter version B ID"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleCompare}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 transition-all w-full justify-center"
            >
              <HugeiconsIcon icon={ArrowRight} size={14} strokeWidth={2.5} />
              {loading ? 'Comparing...' : 'Compare'}
            </button>
          </div>
        </div>
      </div>

      {comparison && (
        <>
          <div className="bg-white border border-neutral-200 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Comparison Results</h3>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-lg font-black text-emerald-600">{comparison.summary.added}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Added</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-black text-red-600">{comparison.summary.removed}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Removed</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-black text-amber-600">{comparison.summary.modified}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Modified</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-black text-neutral-600">{comparison.summary.unchanged}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Unchanged</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 border-b border-neutral-200">
              {[
                { key: 'all', label: 'All Changes', count: comparison.additions.length + comparison.removals.length + comparison.changes.length },
                { key: 'additions', label: 'Additions', count: comparison.additions.length },
                { key: 'removals', label: 'Removals', count: comparison.removals.length },
                { key: 'changes', label: 'Changes', count: comparison.changes.length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab.key ? 'border-[#9c27b3] text-[#9c27b3]' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-neutral-200 overflow-hidden">
            <DataTable
              columns={columns}
              data={getFilteredData()}
              keyField="section_id"
              emptyMessage="No differences found"
            />
          </div>
        </>
      )}

      {!comparison && !loading && (
        <div className="bg-white border border-neutral-200 p-12 text-center">
          <div className="text-neutral-400 mb-2">
            <HugeiconsIcon icon={ArrowRight} size={40} strokeWidth={1.5} className="mx-auto" />
          </div>
          <p className="text-sm text-neutral-500">Enter two version IDs and click Compare to see differences</p>
        </div>
      )}
    </div>
  );
}
