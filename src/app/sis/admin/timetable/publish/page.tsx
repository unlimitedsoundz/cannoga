'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { ActionToolbar } from '@/components/sis/ActionToolbar';
import { DataTable } from '@/components/sis/DataTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { Modal } from '@/components/sis/Modal';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { ConfirmDialog } from '@/components/sis/ConfirmDialog';
import { toast } from 'sonner';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Calendar01Icon as Calendar,
  Clock01Icon as Clock,
  PlayCircleIcon as Play,
  Download01Icon as Download,
  Alert01Icon as AlertCircle,
  CheckmarkCircle01Icon as CheckCircle,
  Shield01Icon as Shield,
} from '@hugeicons/core-free-icons';
import { getVersionsForPublish, getVersionSummary, publishTimetableVersion, getPublishHistory, notifyStrandedStudents, notifyFaculty } from './actions';
import type { TimetableVersion, TimetableRun, TimetableScore } from '@/types/database';

interface VersionWithRelations extends TimetableVersion {
  run?: TimetableRun;
  score?: TimetableScore;
}

interface VersionSummary {
  version: VersionWithRelations;
  run?: TimetableRun;
  score?: TimetableScore;
  assignmentsCount: number;
  conflictsCount: number;
  hardConflicts: number;
  sectionsCount: number;
}

interface PublishHistoryItem {
  id: string;
  version_number: number;
  label: string | null;
  published_at: string;
  notes: string | null;
  publisher: { first_name: string | null; last_name: string | null; email: string } | null;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  DRAFT: { bg: 'bg-neutral-100', text: 'text-neutral-700' },
  UNDER_REVIEW: { bg: 'bg-blue-50', text: 'text-blue-700' },
  APPROVED: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  PUBLISHED: { bg: 'bg-purple-50', text: 'text-purple-700' },
  ARCHIVED: { bg: 'bg-amber-50', text: 'text-amber-700' },
};

export default function PublishTimetablePage() {
  const [loading, setLoading] = useState(true);
  const [versions, setVersions] = useState<VersionWithRelations[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<VersionWithRelations | null>(null);
  const [summary, setSummary] = useState<VersionSummary | null>(null);
  const [publishHistory, setPublishHistory] = useState<PublishHistoryItem[]>([]);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [publishNotes, setPublishNotes] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState('');

  useEffect(() => {
    fetchVersions();
  }, [selectedTerm]);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const result = selectedTerm
        ? await getVersionsForPublish(selectedTerm)
        : { success: true, data: [] as VersionWithRelations[] };

      if (!result.success) throw new Error(result.error);
      setVersions(result.data || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load versions');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSummary = async (version: VersionWithRelations) => {
    try {
      setLoading(true);
      setSelectedVersion(version);
      const result = await getVersionSummary(version.id);
      if (!result.success) throw new Error(result.error);
      if (result.data) setSummary(result.data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load version summary');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedVersion) return;
    setPublishing(true);
    const result = await publishTimetableVersion(selectedVersion.id, publishNotes);
    setPublishing(false);
    if (result.success) {
      toast.success('Timetable published successfully');
      setShowPublishModal(false);
      setPublishNotes('');
      setSelectedVersion(null);
      setSummary(null);
      fetchVersions();
    } else {
      toast.error(result.error);
    }
  };

  const handleNotifyStranded = async () => {
    if (!selectedVersion) return;
    setNotifying(true);
    const result = await notifyStrandedStudents(selectedVersion.id);
    setNotifying(false);
    if (result.success) {
      toast.success(`Notified ${result.count} students`);
    } else {
      toast.error(result.error);
    }
  };

  const handleNotifyFaculty = async () => {
    if (!selectedVersion) return;
    setNotifying(true);
    const result = await notifyFaculty(selectedVersion.id);
    setNotifying(false);
    if (result.success) {
      toast.success(`Notified ${result.count} faculty members`);
    } else {
      toast.error(result.error);
    }
  };

  const handleViewHistory = async () => {
    if (!selectedTerm) {
      toast.error('Please select a term first');
      return;
    }
    const result = await getPublishHistory(selectedTerm);
    if (result.success) {
      setPublishHistory(result.data || []);
      setShowHistoryModal(true);
    } else {
      toast.error(result.error);
    }
  };

  const columns = [
    {
      key: 'version_number',
      header: 'Version',
      render: (v: VersionWithRelations) => (
        <div className="font-bold text-neutral-900">v{v.version_number}</div>
      ),
    },
    {
      key: 'label',
      header: 'Label',
      render: (v: VersionWithRelations) => v.label || '—',
    },
    {
      key: 'status',
      header: 'Status',
      render: (v: VersionWithRelations) => {
        const colors = STATUS_COLORS[v.status] || STATUS_COLORS.DRAFT;
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${colors.bg} ${colors.text}`}>
            {v.status.replace('_', ' ')}
          </span>
        );
      },
    },
    {
      key: 'published',
      header: 'Published',
      render: (v: VersionWithRelations) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${v.is_published ? 'bg-purple-50 text-purple-700' : 'bg-neutral-100 text-neutral-700'}`}>
          {v.is_published ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'score',
      header: 'Score',
      render: (v: VersionWithRelations) => {
        const score = Array.isArray(v.score) ? v.score[0] : v.score;
        return score ? (
          <span className={`font-bold ${score.overall_score >= 80 ? 'text-emerald-600' : score.overall_score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
            {score.overall_score}
          </span>
        ) : '—';
      },
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (v: VersionWithRelations) => new Date(v.created_at).toLocaleDateString('en-CA'),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (v: VersionWithRelations) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleViewSummary(v)}
            className="p-1.5 hover:bg-neutral-100 rounded text-neutral-500 hover:text-[#0a151a]"
            title="Review summary"
          >
            <HugeiconsIcon icon={Shield} size={14} strokeWidth={2.5} />
          </button>
          {v.status !== 'PUBLISHED' && (
            <button
              onClick={() => { setSelectedVersion(v); setShowPublishModal(true); }}
              className="p-1.5 hover:bg-neutral-100 rounded text-neutral-500 hover:text-emerald-600"
              title="Publish"
            >
              <HugeiconsIcon icon={Play} size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Publish Timetable"
        subtitle="Review and publish timetable versions"
        actions={
          <button
            onClick={handleViewHistory}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded text-[10px] font-black uppercase tracking-widest hover:border-neutral-400 transition-colors"
          >
            <HugeiconsIcon icon={Download} size={14} strokeWidth={2.5} />
            Publish History
          </button>
        }
      />

      <div className="bg-white border border-neutral-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Select Term</label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
            >
              <option value="">All Terms</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-end">
            <p className="text-xs text-neutral-500">Select a term to view available versions for publishing.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 overflow-hidden">
          <DataTable
            columns={columns}
            data={versions}
            keyField="id"
            emptyMessage="No timetable versions found"
          />
        </div>
      )}

      {selectedVersion && summary && (
        <div className="bg-white border border-neutral-200 p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-2">
            Version {summary.version.version_number} Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-neutral-50 border border-neutral-200">
              <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Sections Scheduled</div>
              <div className="text-2xl font-black text-neutral-900">{summary.sectionsCount}</div>
            </div>
            <div className="p-4 bg-neutral-50 border border-neutral-200">
              <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Assignments</div>
              <div className="text-2xl font-black text-neutral-900">{summary.assignmentsCount}</div>
            </div>
            <div className="p-4 bg-neutral-50 border border-neutral-200">
              <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Open Conflicts</div>
              <div className={`text-2xl font-black ${summary.hardConflicts > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {summary.conflictsCount}
                {summary.hardConflicts > 0 && <span className="text-xs ml-1">({summary.hardConflicts} HARD)</span>}
              </div>
            </div>
            <div className="p-4 bg-neutral-50 border border-neutral-200">
              <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Score</div>
              <div className={`text-2xl font-black ${summary.score ? summary.score.overall_score >= 80 ? 'text-emerald-600' : 'text-amber-600' : 'text-slate-400'}`}>
                {summary.score ? `${summary.score.overall_score}/100` : '—'}
              </div>
            </div>
          </div>

          {summary.run && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-xs">
                <span className="text-neutral-500 font-bold">Run Status:</span>
                <span className="ml-2">{summary.run.status}</span>
              </div>
              <div className="text-xs">
                <span className="text-neutral-500 font-bold">Sections:</span>
                <span className="ml-2">{summary.run.sections_count}</span>
              </div>
              <div className="text-xs">
                <span className="text-neutral-500 font-bold">Progress:</span>
                <span className="ml-2">{summary.run.progress}%</span>
              </div>
              <div className="text-xs">
                <span className="text-neutral-500 font-bold">Hard Violations:</span>
                <span className="ml-2">{summary.run.hard_violations}</span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-4 border-t border-neutral-200">
            <button
              onClick={() => setShowPublishModal(true)}
              disabled={summary.hardConflicts > 0}
              className="flex items-center gap-2 px-6 py-2 bg-[#0a151a] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <HugeiconsIcon icon={Play} size={14} strokeWidth={2.5} />
              Publish Version
            </button>
            <button
              onClick={handleNotifyStranded}
              disabled={!summary.version.is_published}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded text-[10px] font-black uppercase tracking-widest hover:border-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Notify Students
            </button>
            <button
              onClick={handleNotifyFaculty}
              disabled={!summary.version.is_published}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded text-[10px] font-black uppercase tracking-widest hover:border-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Notify Faculty
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={showPublishModal}
        onClose={() => { setShowPublishModal(false); setPublishNotes(''); }}
        title="Confirm Publish"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => { setShowPublishModal(false); setPublishNotes(''); }}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-600 hover:text-black"
            >
              Cancel
            </button>
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="px-6 py-2 bg-[#0a151a] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50"
            >
              {publishing ? 'Publishing...' : 'Publish Timetable'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-2">
              <HugeiconsIcon icon={AlertCircle} size={20} strokeWidth={2} className="text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900">Warning</p>
                <p className="text-xs text-amber-700 mt-1">Publishing will make this timetable the active version. Any previously published version will be archived. Students and faculty will be notified.</p>
              </div>
            </div>
          </div>
          {summary && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Version:</span>
                <span className="font-bold">v{summary.version.version_number}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Sections:</span>
                <span className="font-bold">{summary.sectionsCount}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Open Conflicts:</span>
                <span className={`font-bold ${summary.hardConflicts > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{summary.conflictsCount}</span>
              </div>
            </div>
          )}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Publish Notes</label>
            <textarea
              value={publishNotes}
              onChange={(e) => setPublishNotes(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
              rows={3}
              placeholder="Add any notes about this publish..."
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="Publish History"
        size="lg"
      >
        <div className="space-y-3">
          {publishHistory.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-sm">No published versions found</div>
          ) : (
            publishHistory.map((item) => (
              <div key={item.id} className="p-4 border border-neutral-200 bg-neutral-50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-neutral-900">Version {item.version_number}</span>
                      {item.label && <span className="text-xs text-neutral-500">({item.label})</span>}
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      Published on {new Date(item.published_at).toLocaleString('en-CA')}
                      {item.publisher && ` by ${item.publisher.first_name} ${item.publisher.last_name}`}
                    </div>
                    {item.notes && <div className="text-xs text-neutral-600 mt-2 italic">"{item.notes}"</div>}
                  </div>
                  <StatusBadge status="published" />
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}
