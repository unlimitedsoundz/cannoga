'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { ActionToolbar } from '@/components/sis/ActionToolbar';
import { DataTable } from '@/components/sis/DataTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { FilterBar } from '@/components/sis/FilterBar';
import { Modal } from '@/components/sis/Modal';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { toast } from 'sonner';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Alert01Icon as AlertCircle,
  CheckmarkCircle01Icon as CheckCircle,
  Clock01Icon as Clock,
  Settings01Icon as Settings,
  PlayCircleIcon as Play,
} from '@hugeicons/core-free-icons';
import { getConflicts, resolveConflict, getConflictSuggestions, bulkResolveConflicts } from './actions';
import type { TimetableConflict } from '@/types/database';

interface ConflictWithRelations extends TimetableConflict {
  assignment_a?: any;
  assignment_b?: any;
  resolver?: { first_name: string | null; last_name: string | null; email: string } | null;
}

const SEVERITY_OPTIONS = [
  { value: '', label: 'All Severities' },
  { value: 'HARD', label: 'Hard' },
  { value: 'SOFT', label: 'Soft' },
];

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'room_double_booked', label: 'Room Double Booked' },
  { value: 'instructor_double_booked', label: 'Instructor Double Booked' },
  { value: 'student_conflict', label: 'Student Conflict' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'resolved', label: 'Resolved' },
];

export default function ConflictsPage() {
  const [loading, setLoading] = useState(true);
  const [conflicts, setConflicts] = useState<ConflictWithRelations[]>([]);
  const [versionId, setVersionId] = useState('');
  const [filters, setFilters] = useState({ severity: '', conflict_type: '', status: '' });
  const [selectedConflict, setSelectedConflict] = useState<ConflictWithRelations | null>(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [resolution, setResolution] = useState('');
  const [resolving, setResolving] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkResolving, setBulkResolving] = useState(false);

  useEffect(() => {
    if (versionId) {
      fetchConflicts();
    }
  }, [versionId, filters]);

  const fetchConflicts = async () => {
    try {
      setLoading(true);
      const result = await getConflicts(versionId, filters);
      if (!result.success) throw new Error(result.error);
      setConflicts(result.data || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load conflicts');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (conflict: ConflictWithRelations) => {
    setSelectedConflict(conflict);
    setShowDetailModal(true);
    const suggestionsResult = await getConflictSuggestions(conflict.id);
    if (suggestionsResult.success) {
      setSuggestions(suggestionsResult.data || []);
    }
  };

  const handleResolve = async () => {
    if (!selectedConflict || !resolution) {
      toast.error('Please provide a resolution');
      return;
    }
    setResolving(true);
    const result = await resolveConflict(selectedConflict.id, resolution, 'current-user');
    setResolving(false);
    if (result.success) {
      toast.success('Conflict resolved');
      setShowResolveModal(false);
      setResolution('');
      setSelectedConflict(null);
      fetchConflicts();
    } else {
      toast.error(result.error);
    }
  };

  const handleBulkResolve = async () => {
    if (selectedIds.size === 0) {
      toast.error('Select conflicts to resolve');
      return;
    }
    setBulkResolving(true);
    const result = await bulkResolveConflicts(Array.from(selectedIds), 'Bulk resolved', 'current-user');
    setBulkResolving(false);
    if (result.success) {
      toast.success(`${selectedIds.size} conflicts resolved`);
      setSelectedIds(new Set());
      fetchConflicts();
    } else {
      toast.error(result.error);
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === conflicts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(conflicts.map(c => c.id)));
    }
  };

  const columns = [
    {
      key: 'severity',
      header: '',
      render: (c: ConflictWithRelations) => (
        <input
          type="checkbox"
          checked={selectedIds.has(c.id)}
          onChange={() => toggleSelect(c.id)}
          className="w-4 h-4 text-[#0a151a] border-neutral-300 rounded focus:ring-[#0a151a]"
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      key: 'severity',
      header: 'Severity',
      render: (c: ConflictWithRelations) => {
        const colors = c.severity === 'HARD'
          ? 'bg-red-50 text-red-700'
          : 'bg-amber-50 text-amber-700';
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${colors}`}>
            {c.severity}
          </span>
        );
      },
    },
    {
      key: 'conflict_type',
      header: 'Type',
      render: (c: ConflictWithRelations) => (
        <span className="text-xs font-medium text-neutral-700 capitalize">
          {c.conflict_type.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (c: ConflictWithRelations) => (
        <div className="text-xs text-neutral-600 line-clamp-2">{c.description}</div>
      ),
    },
    {
      key: 'assignment_a',
      header: 'Assignment A',
      render: (c: ConflictWithRelations) => {
        const a = c.assignment_a || {};
        const section = Array.isArray(a.section) ? a.section[0] : a.section;
        const module = section?.module ? (Array.isArray(section.module) ? section.module[0] : section.module) : null;
        return (
          <div className="text-xs">
            <div className="font-medium text-neutral-900">{module?.title || module?.code || '—'}</div>
            <div className="text-neutral-500">{section?.code || '—'} • {a.start_time || '—'}-{a.end_time || '—'}</div>
          </div>
        );
      },
    },
    {
      key: 'assignment_b',
      header: 'Assignment B',
      render: (c: ConflictWithRelations) => {
        const b = c.assignment_b || {};
        const section = Array.isArray(b.section) ? b.section[0] : b.section;
        const module = section?.module ? (Array.isArray(section.module) ? section.module[0] : section.module) : null;
        return (
          <div className="text-xs">
            <div className="font-medium text-neutral-900">{module?.title || module?.code || '—'}</div>
            <div className="text-neutral-500">{section?.code || '—'} • {b.start_time || '—'}-{b.end_time || '—'}</div>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (c: ConflictWithRelations) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${c.resolution ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
          {c.resolution ? 'Resolved' : 'Open'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (c: ConflictWithRelations) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleViewDetail(c)}
            className="p-1.5 hover:bg-neutral-100 rounded text-neutral-500 hover:text-[#0a151a]"
            title="View details"
          >
            <HugeiconsIcon icon={AlertCircle} size={14} strokeWidth={2.5} />
          </button>
          {!c.resolution && (
            <button
              onClick={() => { setSelectedConflict(c); setShowResolveModal(true); }}
              className="p-1.5 hover:bg-neutral-100 rounded text-neutral-500 hover:text-emerald-600"
              title="Resolve"
            >
              <HugeiconsIcon icon={CheckCircle} size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Timetable Conflicts"
        subtitle="Review and resolve scheduling conflicts"
        actions={
          selectedIds.size > 0 && (
            <button
              onClick={handleBulkResolve}
              disabled={bulkResolving}
              className="flex items-center gap-2 px-4 py-2 bg-[#0a151a] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 transition-all"
            >
              <HugeiconsIcon icon={Play} size={14} strokeWidth={2.5} />
              Resolve Selected ({selectedIds.size})
            </button>
          )
        }
      />

      <div className="bg-white border border-neutral-200 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Version ID</label>
            <input
              type="text"
              value={versionId}
              onChange={(e) => setVersionId(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
              placeholder="Enter version ID"
            />
          </div>
        </div>

        {versionId && (
          <FilterBar
            filters={[
              {
                key: 'severity',
                label: 'Severity',
                options: SEVERITY_OPTIONS,
                value: filters.severity,
                onChange: (v) => setFilters({ ...filters, severity: v }),
              },
              {
                key: 'conflict_type',
                label: 'Type',
                options: TYPE_OPTIONS,
                value: filters.conflict_type,
                onChange: (v) => setFilters({ ...filters, conflict_type: v }),
              },
              {
                key: 'status',
                label: 'Status',
                options: STATUS_OPTIONS,
                value: filters.status,
                onChange: (v) => setFilters({ ...filters, status: v }),
              },
            ]}
            onClearAll={() => setFilters({ severity: '', conflict_type: '', status: '' })}
          />
        )}
      </div>

      {versionId && (
        <div className="bg-white border border-neutral-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={conflicts}
              keyField="id"
              emptyMessage="No conflicts found"
              selection={{
                selected: selectedIds,
                onChange: setSelectedIds,
              }}
            />
          )}
        </div>
      )}

      <Modal
        isOpen={showDetailModal}
        onClose={() => { setShowDetailModal(false); setSelectedConflict(null); setSuggestions([]); }}
        title="Conflict Details"
        size="lg"
        footer={
          selectedConflict && !selectedConflict.resolution ? (
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setShowDetailModal(false); setShowResolveModal(true); }}
                className="px-6 py-2 bg-[#0a151a] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800"
              >
                Resolve Conflict
              </button>
            </div>
          ) : undefined
        }
      >
        {selectedConflict && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${selectedConflict.severity === 'HARD' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                {selectedConflict.severity}
              </span>
              <span className="text-xs font-medium text-neutral-700 capitalize">{selectedConflict.conflict_type.replace(/_/g, ' ')}</span>
            </div>

            <div className="p-4 bg-neutral-50 border border-neutral-200">
              <p className="text-sm text-neutral-700">{selectedConflict.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-neutral-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Assignment A</h4>
                {selectedConflict.assignment_a && (
                  <div className="space-y-1 text-xs">
                    <div className="font-medium text-neutral-900">
                      {(Array.isArray(selectedConflict.assignment_a.section) ? selectedConflict.assignment_a.section[0] : selectedConflict.assignment_a.section)?.module?.title || '—'}
                    </div>
                    <div className="text-neutral-500">
                      Section: {(Array.isArray(selectedConflict.assignment_a.section) ? selectedConflict.assignment_a.section[0] : selectedConflict.assignment_a.section)?.code || '—'}
                    </div>
                    <div className="text-neutral-500">
                      Time: {selectedConflict.assignment_a.start_time} - {selectedConflict.assignment_a.end_time}
                    </div>
                    <div className="text-neutral-500">
                      Room: {selectedConflict.assignment_a.room_id || '—'}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border border-neutral-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Assignment B</h4>
                {selectedConflict.assignment_b && (
                  <div className="space-y-1 text-xs">
                    <div className="font-medium text-neutral-900">
                      {(Array.isArray(selectedConflict.assignment_b.section) ? selectedConflict.assignment_b.section[0] : selectedConflict.assignment_b.section)?.module?.title || '—'}
                    </div>
                    <div className="text-neutral-500">
                      Section: {(Array.isArray(selectedConflict.assignment_b.section) ? selectedConflict.assignment_b.section[0] : selectedConflict.assignment_b.section)?.code || '—'}
                    </div>
                    <div className="text-neutral-500">
                      Time: {selectedConflict.assignment_b.start_time} - {selectedConflict.assignment_b.end_time}
                    </div>
                    <div className="text-neutral-500">
                      Room: {selectedConflict.assignment_b.room_id || '—'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {suggestions.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Suggested Resolutions</h4>
                <ul className="space-y-2">
                  {suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 text-xs text-blue-800">
                      <span className="font-bold">{idx + 1}.</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedConflict.resolution && (
              <div className="p-4 bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <HugeiconsIcon icon={CheckCircle} size={16} strokeWidth={2.5} className="text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-900">Resolved</span>
                </div>
                <p className="text-xs text-emerald-700">{selectedConflict.resolution}</p>
                <p className="text-xs text-emerald-600 mt-1">
                  {selectedConflict.resolved_at && `Resolved on ${new Date(selectedConflict.resolved_at).toLocaleString('en-CA')}`}
                  {selectedConflict.resolver && ` by ${selectedConflict.resolver.first_name} ${selectedConflict.resolver.last_name}`}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showResolveModal}
        onClose={() => { setShowResolveModal(false); setResolution(''); }}
        title="Resolve Conflict"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => { setShowResolveModal(false); setResolution(''); }}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-600 hover:text-black"
            >
              Cancel
            </button>
            <button
              onClick={handleResolve}
              disabled={resolving}
              className="px-6 py-2 bg-[#0a151a] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50"
            >
              {resolving ? 'Resolving...' : 'Resolve'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            Describe how this conflict was resolved. This will be recorded in the conflict history.
          </p>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Resolution *</label>
            <textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
              rows={4}
              placeholder="Describe the resolution..."
            />
          </div>
          {suggestions.length > 0 && (
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Quick Suggestions</label>
              <div className="space-y-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setResolution(suggestion)}
                    className="w-full text-left p-2 bg-neutral-50 border border-neutral-200 hover:border-[#0a151a] text-xs text-neutral-700 hover:text-[#0a151a] transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
