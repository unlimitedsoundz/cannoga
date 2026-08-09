'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { ActionToolbar } from '@/components/sis/ActionToolbar';
import { DataTable } from '@/components/sis/DataTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { Modal } from '@/components/sis/Modal';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { ConfirmDialog } from '@/components/sis/ConfirmDialog';
import { toast } from 'sonner';
import {
  Calendar01Icon as Calendar,
  Clock01Icon as Clock,
  MapPinIcon as MapPin,
  UserIcon as User,
  Add01Icon as Plus,
  Task01Icon as Trash,
  Settings01Icon as Settings,
  PlayCircleIcon as Play,
  CancelCircleIcon as Cancel,
  Grid02Icon as Grid,
  Door01Icon as Door,
  Bookmark01Icon as Bookmark,
  Time01Icon as Time,
  SlidersHorizontalIcon as Slider,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  getSchedulingDashboard,
  generateTimetable,
  getGenerationProgress,
  publishTimetable,
  getAllSections,
} from './actions';
import { DashboardStats, GenerationResult, ProgressUpdate } from './actions';
import { TimetableVersion, CourseSection } from '@/types/database';
import Link from 'next/link';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SESSION_TYPES = ['LECTURE', 'LAB', 'SEMINAR', 'TUTORIAL', 'PRACTICAL', 'CLINICAL', 'ONLINE', 'HYBRID'];

export default function SchedulingPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [termId, setTermId] = useState('');
  const [terms, setTerms] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressUpdate | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [unscheduled, setUnscheduled] = useState<CourseSection[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTerms();
  }, []);

  useEffect(() => {
    if (termId) {
      fetchDashboard();
    }
  }, [termId]);

  const fetchTerms = async () => {
    try {
      const res = await fetch('/api/semesters');
      const data = await res.json();
      if (data.success) {
        setTerms(data.data || []);
        const current = (data.data || []).find((t: any) => t.isCurrent || t.isActive);
        if (current) setTermId(current.id);
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to load terms');
    }
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await getSchedulingDashboard(termId);
      setStats(data);
    } catch (e: any) {
      toast.error(e.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setShowGenerateModal(false);
    setGenerating(true);
    const result = await generateTimetable(termId);
    if (result.success && result.runId) {
      setRunId(result.runId);
      setShowProgressModal(true);
      pollProgress(result.runId);
    } else {
      toast.error(result.error || 'Failed to start generation');
      setGenerating(false);
    }
  };

  const pollProgress = async (rid: string) => {
    const interval = setInterval(async () => {
      try {
        const update = await getGenerationProgress(rid);
        setProgress(update);
        if (['COMPLETED', 'PARTIAL', 'FAILED', 'CANCELLED'].includes(update.status)) {
          clearInterval(interval);
          setGenerating(false);
          setShowProgressModal(false);
          if (update.status === 'COMPLETED' || update.status === 'PARTIAL') {
            setResult({ success: true, runId: rid });
            fetchResults(rid);
          } else {
            toast.error(update.errorMessage || `Generation ${update.status.toLowerCase()}`);
            setResult({ success: false, runId: rid, error: update.errorMessage || `Generation ${update.status.toLowerCase()}` });
          }
        }
      } catch (e: any) {
        clearInterval(interval);
        setGenerating(false);
        setShowProgressModal(false);
        toast.error(e.message || 'Progress polling failed');
      }
    }, 2000);
  };

  const fetchResults = async (rid: string) => {
    try {
      const data = await getAllSections(termId);
      setUnscheduled(data.filter(s => s.status === 'DRAFT' || s.status === 'PENDING'));
    } catch (e: any) {
      console.error('fetchResults Error:', e);
    }
  };

  const handlePublish = async (versionId: string) => {
    try {
      await publishTimetable(versionId);
      toast.success('Timetable published successfully');
      fetchDashboard();
    } catch (e: any) {
      toast.error(e.message || 'Failed to publish');
    }
  };

  const statCards = [
    { label: 'Total Sections', value: stats?.totalSections || 0, icon: Bookmark, color: 'bg-blue-50 text-blue-700' },
    { label: 'Scheduled', value: stats?.scheduledSections || 0, icon: Calendar, color: 'bg-green-50 text-green-700' },
    { label: 'Unscheduled', value: stats?.unscheduledSections || 0, icon: Cancel, color: 'bg-red-50 text-red-700' },
    { label: 'Rooms', value: stats?.totalRooms || 0, icon: Door, color: 'bg-purple-50 text-purple-700' },
    { label: 'Faculty', value: stats?.totalFaculty || 0, icon: User, color: 'bg-orange-50 text-orange-700' },
    { label: 'Students', value: stats?.totalStudents || 0, icon: User, color: 'bg-teal-50 text-teal-700' },
    { label: 'Conflicts', value: stats?.totalConflicts || 0, icon: Settings, color: 'bg-red-50 text-red-700' },
    { label: 'Optimization Score', value: stats?.optimizationScore != null ? `${stats.optimizationScore}%` : 'N/A', icon: Slider, color: 'bg-neutral-100 text-neutral-700' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Timetable Scheduling"
        subtitle="Automated scheduling engine and configuration"
        actions={
          <div className="flex items-center gap-3">
            <select
              value={termId}
              onChange={(e) => setTermId(e.target.value)}
              className="px-3 py-2 border border-neutral-200 rounded text-xs font-medium text-neutral-700 bg-white"
            >
              <option value="">Select term</option>
              {terms.map((t: any) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <button
              onClick={() => setShowGenerateModal(true)}
              disabled={!termId || generating}
              className="flex items-center gap-2 px-4 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 transition-all"
            >
              <HugeiconsIcon icon={Play} size={14} strokeWidth={2.5} />
              Generate Timetable
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
        </div>
      ) : !termId ? (
        <div className="text-center py-20 text-neutral-400 text-sm">Select a term to view scheduling data</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((card) => (
              <div key={card.label} className="border border-neutral-200 p-4">
                <div className={`inline-flex p-2 rounded ${card.color} mb-3`}>
                  <HugeiconsIcon icon={card.icon} size={16} strokeWidth={2} />
                </div>
                <div className="text-2xl font-black text-neutral-900">{card.value}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mt-1">{card.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/sis/admin/scheduling/rooms" className="border border-neutral-200 p-6 hover:border-neutral-300 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-neutral-100 text-neutral-700">
                  <HugeiconsIcon icon={Door} size={20} strokeWidth={2} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider">Rooms</h3>
              </div>
              <p className="text-xs text-neutral-500">Manage rooms, features, and availability blocks</p>
            </Link>

            <Link href="/sis/admin/scheduling/sections" className="border border-neutral-200 p-6 hover:border-neutral-300 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-neutral-100 text-neutral-700">
                  <HugeiconsIcon icon={Bookmark} size={20} strokeWidth={2} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider">Sections</h3>
              </div>
              <p className="text-xs text-neutral-500">Create and configure course sections and requirements</p>
            </Link>

            <Link href="/sis/admin/scheduling/availability" className="border border-neutral-200 p-6 hover:border-neutral-300 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-neutral-100 text-neutral-700">
                  <HugeiconsIcon icon={Calendar} size={20} strokeWidth={2} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider">Availability</h3>
              </div>
              <p className="text-xs text-neutral-500">Manage instructor availability and time preferences</p>
            </Link>

            <Link href="/sis/admin/scheduling/settings" className="border border-neutral-200 p-6 hover:border-neutral-300 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-neutral-100 text-neutral-700">
                  <HugeiconsIcon icon={Settings} size={20} strokeWidth={2} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider">Settings</h3>
              </div>
              <p className="text-xs text-neutral-500">Configure constraints, preferences, time slots, and holidays</p>
            </Link>
          </div>

          {stats?.latestVersion && (
            <div className="border border-neutral-200 p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Latest Version</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-neutral-900">
                    Version {(stats.latestVersion as any)?.version_number} - {(stats.latestVersion as any)?.label || 'Untitled'}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    Status: <StatusBadge status={(stats.latestVersion as any)?.status || 'DRAFT'} />
                  </div>
                </div>
                {(stats.latestVersion as any)?.status === 'APPROVED' && !(stats.latestVersion as any)?.is_published && (
                  <button
                    onClick={() => handlePublish((stats.latestVersion as TimetableVersion)!.id)}
                    className="px-4 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800"
                  >
                    Publish
                  </button>
                )}
              </div>
            </div>
          )}

          {unscheduled.length > 0 && (
            <div className="border border-neutral-200 p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Unscheduled Sections</h3>
              <div className="space-y-2">
                {unscheduled.slice(0, 10).map((section) => (
                  <div key={section.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                    <div>
                      <div className="text-sm font-medium text-neutral-900">{section.code}</div>
                      <div className="text-xs text-neutral-500">Status: {(section as any).status}</div>
                    </div>
                    <StatusBadge status={(section as any).status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Generate Modal */}
      <Modal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        title="Generate Timetable"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowGenerateModal(false)} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-600 hover:text-black">Cancel</button>
            <button onClick={handleGenerate} disabled={generating} className="px-6 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50">
              {generating ? 'Starting...' : 'Start Generation'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">This will run the constraint-based scheduling engine for the selected term. This process may take several minutes.</p>
          <div className="border border-neutral-200 p-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-700 mb-2">What happens:</h4>
            <ul className="text-xs text-neutral-600 space-y-1 list-disc list-inside">
              <li>Analyzes all sections, rooms, and instructor availability</li>
              <li>Applies hard constraints (no double bookings, room types, etc.)</li>
              <li>Optimizes soft preferences (gaps, building changes, utilization)</li>
              <li>Creates assignments for each section meeting</li>
              <li>Generates conflict report</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Progress Modal */}
      <Modal
        isOpen={showProgressModal}
        onClose={() => {}}
        title="Generating Timetable..."
        size="md"
        footer={
          progress && ['COMPLETED', 'PARTIAL', 'FAILED', 'CANCELLED'].includes(progress.status) ? (
            <button onClick={() => { setShowProgressModal(false); setShowResultsModal(true); }} className="px-6 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800">
              View Results
            </button>
          ) : null
        }
      >
        <div className="space-y-4">
          <div className="w-full bg-neutral-200 h-2">
            <div className="bg-[#9c27b3] h-2 transition-all duration-500" style={{ width: `${progress?.progress || 0}%` }} />
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-neutral-900">{progress?.currentStage || 'Initializing'}</div>
            <div className="text-xs text-neutral-500 mt-1">{progress?.progress || 0}% complete</div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="border border-neutral-200 p-2">
              <div className="text-neutral-500">Courses</div>
              <div className="font-bold">{progress?.coursesCount || 0}</div>
            </div>
            <div className="border border-neutral-200 p-2">
              <div className="text-neutral-500">Sections</div>
              <div className="font-bold">{progress?.sectionsCount || 0}</div>
            </div>
            <div className="border border-neutral-200 p-2">
              <div className="text-neutral-500">Assignments</div>
              <div className="font-bold">{progress?.assignmentsCount || 0}</div>
            </div>
            <div className="border border-neutral-200 p-2">
              <div className="text-neutral-500">Hard Violations</div>
              <div className="font-bold text-red-600">{progress?.hardViolations || 0}</div>
            </div>
          </div>
          {progress?.softScore != null && (
            <div className="text-center">
              <div className="text-sm text-neutral-600">Optimization Score</div>
              <div className="text-2xl font-black text-[#9c27b3]">{progress.softScore.toFixed(1)}%</div>
            </div>
          )}
        </div>
      </Modal>

      {/* Results Modal */}
      <Modal
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        title="Generation Results"
        size="xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="border border-neutral-200 p-4 text-center">
              <div className="text-2xl font-black text-neutral-900">{progress?.sectionsCount || 0}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Sections Scheduled</div>
            </div>
            <div className="border border-neutral-200 p-4 text-center">
              <div className="text-2xl font-black text-red-600">{progress?.hardViolations || 0}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Hard Violations</div>
            </div>
            <div className="border border-neutral-200 p-4 text-center">
              <div className="text-2xl font-black text-[#9c27b3]">{progress?.softScore ? progress.softScore.toFixed(1) : 'N/A'}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Score</div>
            </div>
          </div>

          {result && !result.success && (
            <div className="border border-red-200 bg-red-50 p-4">
              <div className="text-sm font-bold text-red-800">Generation Failed</div>
              <div className="text-xs text-red-600 mt-1">{result.error}</div>
            </div>
          )}

          {unscheduled.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-700 mb-3">Unscheduled Sections</h4>
              <div className="max-h-64 overflow-y-auto border border-neutral-200">
                {unscheduled.map((section) => (
                  <div key={section.id} className="flex items-center justify-between py-2 px-3 border-b border-neutral-100 last:border-0">
                    <div className="text-sm font-medium text-neutral-900">{section.code}</div>
                    <StatusBadge status={(section as any).status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
