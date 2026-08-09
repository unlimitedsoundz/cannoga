'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { ActionToolbar } from '@/components/sis/ActionToolbar';
import { DataTable } from '@/components/sis/DataTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { FilterBar } from '@/components/sis/FilterBar';
import { Modal } from '@/components/sis/Modal';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { ConfirmDialog } from '@/components/sis/ConfirmDialog';
import { toast } from 'sonner';
import {
  Calendar01Icon as Calendar,
  Clock01Icon as Clock,
  MapPinIcon as MapPin,
  User02Icon as User,
  Add01Icon as Plus,
  Task01Icon as Trash,
  Settings01Icon as Settings,
  PlayCircleIcon as Play,
  Door01Icon as Door,
  Search01Icon as Filter,
  CheckmarkCircle01Icon as Check,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  getSectionsByStatus,
} from '../actions';
import {
  getAllSections,
  createSection,
  updateSection,
  deleteSection,
  bulkCreateSections,
  assignInstructor,
  updateSectionRequirements,
  getSectionMeetings,
  createSectionMeeting,
  deleteSectionMeeting,
  getAvailableModules,
  getInstructors,
  getStudentGroups,
} from './actions';
import { CourseSection, Module, Profile, StudentGroup, CourseSectionMeeting } from '@/types/database';

const SESSION_TYPES = ['LECTURE', 'LAB', 'SEMINAR', 'TUTORIAL', 'PRACTICAL', 'CLINICAL', 'ONLINE', 'HYBRID'];
const DELIVERY_MODES = ['IN_PERSON', 'ONLINE', 'HYBRID', 'SYNC_ONLINE'];
const ROOM_TYPES = ['LECTURE_ROOM', 'LAB', 'COMPUTER_LAB', 'SCIENCE_LAB', 'SEMINAR_ROOM', 'AUDITORIUM', 'CLINICAL_LAB', 'SPECIALIZED_ROOM', 'ONLINE'];
const SECTION_STATUSES = ['DRAFT', 'PENDING', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED', 'CANCELLED'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function SectionsPage() {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<any[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [instructors, setInstructors] = useState<Profile[]>([]);
  const [studentGroups, setStudentGroups] = useState<StudentGroup[]>([]);
  const [meetings, setMeetings] = useState<CourseSectionMeeting[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [termId, setTermId] = useState('');
  const [terms, setTerms] = useState<any[]>([]);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [bulkCount, setBulkCount] = useState(1);

  const [sectionForm, setSectionForm] = useState({
    code: '', module_id: '', instructor_id: '', capacity: 30, session_type: 'LECTURE',
    delivery_mode: 'IN_PERSON', required_room_type: '', required_features: [],
    duration_minutes: 60, meetings_per_week: 1, consecutive_sessions: false,
    max_daily_sessions: null, preferred_days: [], blocked_days: [],
    preferred_times: [], blocked_times: [], student_group_id: '', notes: '', status: 'DRAFT',
  });

  const [meetingForm, setMeetingForm] = useState({
    meeting_index: 0, day_of_week: 1, start_time: '09:00', end_time: '10:00',
    duration_minutes: 60, room_id: '', instructor_id: '', is_fixed: false,
  });

  useEffect(() => {
    fetchTerms();
  }, []);

  useEffect(() => {
    if (termId) {
      fetchSections();
      fetchModules();
      fetchInstructors();
      fetchStudentGroups();
    }
  }, [termId, statusFilter, search]);

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

  const fetchSections = async () => {
    try {
      setLoading(true);
      const result = await getAllSections(termId, { status: statusFilter || undefined, search: search || undefined });
      if (result.success) {
        setSections(result.data);
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to load sections');
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    const result = await getAvailableModules(termId);
    setModules(result.data);
  };

  const fetchInstructors = async () => {
    const result = await getInstructors();
    setInstructors(result.data);
  };

  const fetchStudentGroups = async () => {
    const result = await getStudentGroups();
    setStudentGroups(result.data);
  };

  const fetchMeetings = async (sectionId: string) => {
    const result = await getSectionMeetings(sectionId);
    setMeetings(result.data);
  };

  const handleSaveSection = async () => {
    if (!sectionForm.code || !sectionForm.module_id) {
      toast.error('Code and module are required');
      return;
    }
    setSaving(true);
    const result = editingSection
      ? await updateSection(editingSection.id, sectionForm)
      : await createSection({ ...sectionForm, semester_id: termId });
    setSaving(false);
    if (result.success) {
      toast.success(editingSection ? 'Section updated' : 'Section created');
      setShowSectionModal(false);
      setEditingSection(null);
      resetSectionForm();
      fetchSections();
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteSection = async () => {
    if (!deleteConfirm) return;
    const result = await deleteSection(deleteConfirm.id);
    if (result.success) {
      toast.success('Section deleted');
      setDeleteConfirm(null);
      fetchSections();
    } else {
      toast.error(result.error);
    }
  };

  const handleBulkCreate = async () => {
    if (selectedModules.length === 0) {
      toast.error('Select at least one module');
      return;
    }
    setSaving(true);
    const result = await bulkCreateSections(termId, selectedModules, bulkCount);
    setSaving(false);
    if (result.success) {
      toast.success(`Created ${result.count} sections`);
      setShowBulkModal(false);
      setSelectedModules([]);
      setBulkCount(1);
      fetchSections();
    } else {
      toast.error(result.error);
    }
  };

  const handleAssignInstructor = async (sectionId: string, instructorId: string) => {
    const result = await assignInstructor(sectionId, instructorId || null);
    if (result.success) {
      toast.success('Instructor assigned');
      fetchSections();
    } else {
      toast.error(result.error);
    }
  };

  const handleSaveMeeting = async () => {
    if (!selectedSectionId || !meetingForm.day_of_week || !meetingForm.start_time || !meetingForm.end_time) {
      toast.error('Day, start time, and end time are required');
      return;
    }
    setSaving(true);
    const result = await createSectionMeeting({ ...meetingForm, section_id: selectedSectionId });
    setSaving(false);
    if (result.success) {
      toast.success('Meeting created');
      setMeetingForm({ ...meetingForm, meeting_index: meetings.length });
      fetchMeetings(selectedSectionId);
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    const result = await deleteSectionMeeting(id);
    if (result.success) {
      toast.success('Meeting deleted');
      if (selectedSectionId) fetchMeetings(selectedSectionId);
    } else {
      toast.error(result.error);
    }
  };

  const openSectionModal = (section?: any) => {
    if (section) {
      setEditingSection(section);
      setSectionForm({
        code: section.code,
        module_id: section.module_id,
        instructor_id: section.instructor_id || '',
        capacity: section.capacity,
        session_type: section.session_type,
        delivery_mode: section.delivery_mode,
        required_room_type: section.required_room_type || '',
        required_features: section.required_features || [],
        duration_minutes: section.duration_minutes,
        meetings_per_week: section.meetings_per_week,
        consecutive_sessions: section.consecutive_sessions,
        max_daily_sessions: section.max_daily_sessions,
        preferred_days: section.preferred_days || [],
        blocked_days: section.blocked_days || [],
        preferred_times: section.preferred_times || [],
        blocked_times: section.blocked_times || [],
        student_group_id: section.student_group_id || '',
        notes: section.notes || '',
        status: section.status,
      });
    } else {
      setEditingSection(null);
      resetSectionForm();
    }
    setShowSectionModal(true);
  };

  const openMeetingsPanel = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    fetchMeetings(sectionId);
  };

  const resetSectionForm = () => {
    setSectionForm({ code: '', module_id: '', instructor_id: '', capacity: 30, session_type: 'LECTURE', delivery_mode: 'IN_PERSON', required_room_type: '', required_features: [], duration_minutes: 60, meetings_per_week: 1, consecutive_sessions: false, max_daily_sessions: null, preferred_days: [], blocked_days: [], preferred_times: [], blocked_times: [], student_group_id: '', notes: '', status: 'DRAFT' });
  };

  const columns = [
    { key: 'code', header: 'Section', render: (s: any) => (
      <div>
        <div className="font-bold text-neutral-900">{s.code}</div>
        <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{s.module?.code} - {s.module?.title}</div>
      </div>
    )},
    { key: 'instructor', header: 'Instructor', render: (s: any) => (
      <div className="flex items-center gap-2">
        <select
          value={s.instructor_id || ''}
          onChange={(e) => { e.stopPropagation(); handleAssignInstructor(s.id, e.target.value); }}
          onClick={(e) => e.stopPropagation()}
          className="px-2 py-1 border border-neutral-200 rounded text-xs font-medium text-neutral-700 bg-white"
        >
          <option value="">Unassigned</option>
          {instructors.map((i: any) => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
      </div>
    )},
    { key: 'type', header: 'Type', render: (s: any) => <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-neutral-100 text-neutral-700">{s.session_type}</span> },
    { key: 'delivery', header: 'Delivery', render: (s: any) => s.delivery_mode },
    { key: 'room_type', header: 'Room Req', render: (s: any) => s.required_room_type || '—' },
    { key: 'capacity', header: 'Capacity', render: (s: any) => `${s.capacity} (${s.enrolled_count})` },
    { key: 'meetings', header: 'Meetings', render: (s: any) => `${s.meetings_per_week}/wk` },
    { key: 'duration', header: 'Duration', render: (s: any) => `${s.duration_minutes} min` },
    { key: 'group', header: 'Group', render: (s: any) => s.student_group?.name || '—' },
    { key: 'status', header: 'Status', render: (s: any) => <StatusBadge status={s.status} /> },
    { key: 'actions', header: 'Actions', render: (s: any) => (
      <div className="flex justify-end gap-2">
        <button onClick={(e) => { e.stopPropagation(); openMeetingsPanel(s.id); }} className="p-1.5 hover:bg-neutral-100 rounded text-neutral-400 hover:text-black" title="Manage meetings">
          <HugeiconsIcon icon={Calendar} size={14} strokeWidth={2.5} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); openSectionModal(s); }} className="p-1.5 hover:bg-neutral-100 rounded text-neutral-400 hover:text-black">
          <HugeiconsIcon icon={Settings} size={14} strokeWidth={2.5} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ type: 'section', id: s.id }); }} className="p-1.5 hover:bg-neutral-100 rounded text-neutral-400 hover:text-red-600">
          <HugeiconsIcon icon={Trash} size={14} strokeWidth={2.5} />
        </button>
      </div>
    )},
  ];

  const meetingColumns = [
    { key: 'meeting_index', header: 'Meeting', render: (m: CourseSectionMeeting) => `#${m.meeting_index + 1}` },
    { key: 'day', header: 'Day', render: (m: CourseSectionMeeting) => DAYS[m.day_of_week] },
    { key: 'time', header: 'Time', render: (m: CourseSectionMeeting) => `${m.start_time} - ${m.end_time}` },
    { key: 'duration', header: 'Duration', render: (m: CourseSectionMeeting) => `${m.duration_minutes} min` },
    { key: 'room', header: 'Room', render: (m: CourseSectionMeeting) => m.room_id || 'Unassigned' },
    { key: 'instructor', header: 'Instructor', render: (m: CourseSectionMeeting) => m.instructor_id || 'Unassigned' },
    { key: 'fixed', header: 'Fixed', render: (m: CourseSectionMeeting) => m.is_fixed ? <StatusBadge status="ACTIVE" /> : <StatusBadge status="INACTIVE" /> },
    { key: 'actions', header: 'Actions', render: (m: CourseSectionMeeting) => (
      <div className="flex justify-end">
        <button onClick={() => handleDeleteMeeting(m.id)} className="p-1.5 hover:bg-neutral-100 rounded text-neutral-400 hover:text-red-600">
          <HugeiconsIcon icon={Trash} size={14} strokeWidth={2.5} />
        </button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Sections"
        subtitle="Manage course sections, instructors, and requirements"
        actions={
          <div className="flex items-center gap-2">
            <button onClick={() => setShowBulkModal(true)} className="flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 rounded text-[10px] font-black uppercase tracking-widest hover:border-neutral-300">
              <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> Bulk Create
            </button>
            <button onClick={() => openSectionModal()} className="flex items-center gap-2 px-4 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800">
              <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> Add Section
            </button>
          </div>
        }
      />

      <div className="flex items-center gap-3">
        <select
          value={termId}
          onChange={(e) => setTermId(e.target.value)}
          className="px-3 py-2 border border-neutral-200 rounded text-xs font-medium text-neutral-700 bg-white"
        >
          <option value="">Select term</option>
          {terms.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-neutral-200 rounded text-xs font-medium text-neutral-700 bg-white"
        >
          <option value="">All Statuses</option>
          {SECTION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <ActionToolbar
        search={
          <SearchBar value={search} onChange={setSearch} placeholder="Search sections..." />
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={sections} keyField="id" emptyMessage="No sections found" />
      )}

      {/* Section Modal */}
      <Modal isOpen={showSectionModal} onClose={() => { setShowSectionModal(false); setEditingSection(null); resetSectionForm(); }} title={editingSection ? 'Edit Section' : 'New Section'} size="lg" footer={
        <div className="flex justify-end gap-3">
          <button onClick={() => { setShowSectionModal(false); setEditingSection(null); resetSectionForm(); }} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-600 hover:text-black">Cancel</button>
          <button onClick={handleSaveSection} disabled={saving} className="px-6 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Section'}
          </button>
        </div>
      }>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Section Code *</label>
            <input type="text" value={sectionForm.code} onChange={(e) => setSectionForm({ ...sectionForm, code: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" placeholder="e.g. CS101-A" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Module *</label>
            <select value={sectionForm.module_id} onChange={(e) => setSectionForm({ ...sectionForm, module_id: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm">
              <option value="">Select module</option>
              {modules.map((m: any) => <option key={m.id} value={m.id}>{m.code} - {m.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Instructor</label>
            <select value={sectionForm.instructor_id} onChange={(e) => setSectionForm({ ...sectionForm, instructor_id: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm">
              <option value="">Unassigned</option>
              {instructors.map((i: any) => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Capacity</label>
            <input type="number" value={sectionForm.capacity} onChange={(e) => setSectionForm({ ...sectionForm, capacity: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Session Type</label>
            <select value={sectionForm.session_type} onChange={(e) => setSectionForm({ ...sectionForm, session_type: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm">
              {SESSION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Delivery Mode</label>
            <select value={sectionForm.delivery_mode} onChange={(e) => setSectionForm({ ...sectionForm, delivery_mode: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm">
              {DELIVERY_MODES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Required Room Type</label>
            <select value={sectionForm.required_room_type} onChange={(e) => setSectionForm({ ...sectionForm, required_room_type: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm">
              <option value="">Any</option>
              {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Student Group</label>
            <select value={sectionForm.student_group_id} onChange={(e) => setSectionForm({ ...sectionForm, student_group_id: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm">
              <option value="">None</option>
              {studentGroups.map((g: any) => <option key={g.id} value={g.id}>{g.name} ({g.code})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Duration (min)</label>
            <input type="number" value={sectionForm.duration_minutes} onChange={(e) => setSectionForm({ ...sectionForm, duration_minutes: parseInt(e.target.value) || 60 })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Meetings per Week</label>
            <input type="number" value={sectionForm.meetings_per_week} onChange={(e) => setSectionForm({ ...sectionForm, meetings_per_week: parseInt(e.target.value) || 1 })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Status</label>
            <select value={sectionForm.status} onChange={(e) => setSectionForm({ ...sectionForm, status: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm">
              {SECTION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Notes</label>
            <textarea value={sectionForm.notes} onChange={(e) => setSectionForm({ ...sectionForm, notes: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" rows={2} />
          </div>
        </div>
      </Modal>

      {/* Bulk Create Modal */}
      <Modal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} title="Bulk Create Sections" size="md" footer={
        <div className="flex justify-end gap-3">
          <button onClick={() => setShowBulkModal(false)} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-600 hover:text-black">Cancel</button>
          <button onClick={handleBulkCreate} disabled={saving} className="px-6 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50">
            {saving ? 'Creating...' : 'Create Sections'}
          </button>
        </div>
      }>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Select Modules</label>
            <div className="max-h-48 overflow-y-auto border border-neutral-200">
              {modules.map((m: any) => (
                <label key={m.id} className="flex items-center gap-2 px-3 py-2 border-b border-neutral-100 last:border-0 cursor-pointer hover:bg-neutral-50">
                  <input type="checkbox" checked={selectedModules.includes(m.id)} onChange={(e) => {
                    setSelectedModules(e.target.checked ? [...selectedModules, m.id] : selectedModules.filter(id => id !== m.id));
                  }} className="w-4 h-4 text-[#9c27b3] border-neutral-300 rounded focus:ring-[#9c27b3]" />
                  <span className="text-sm font-medium text-neutral-900">{m.code} - {m.title}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Sections per Module</label>
            <input type="number" value={bulkCount} onChange={(e) => setBulkCount(parseInt(e.target.value) || 1)} min={1} max={10} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
          </div>
        </div>
      </Modal>

      {/* Meetings Modal */}
      <Modal isOpen={!!selectedSectionId} onClose={() => { setSelectedSectionId(null); setMeetings([]); }} title="Section Meetings" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Meeting Index</label>
              <input type="number" value={meetingForm.meeting_index} onChange={(e) => setMeetingForm({ ...meetingForm, meeting_index: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Day</label>
              <select value={meetingForm.day_of_week} onChange={(e) => setMeetingForm({ ...meetingForm, day_of_week: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm">
                {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Start Time</label>
              <input type="time" value={meetingForm.start_time} onChange={(e) => setMeetingForm({ ...meetingForm, start_time: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">End Time</label>
              <input type="time" value={meetingForm.end_time} onChange={(e) => setMeetingForm({ ...meetingForm, end_time: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Duration (min)</label>
              <input type="number" value={meetingForm.duration_minutes} onChange={(e) => setMeetingForm({ ...meetingForm, duration_minutes: parseInt(e.target.value) || 60 })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Fixed</label>
              <select value={meetingForm.is_fixed ? 'true' : 'false'} onChange={(e) => setMeetingForm({ ...meetingForm, is_fixed: e.target.value === 'true' })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>
          <button onClick={handleSaveMeeting} disabled={saving} className="w-full py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50">
            {saving ? 'Adding...' : 'Add Meeting'}
          </button>
        </div>

        <div className="mt-6">
          <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-700 mb-3">Existing Meetings</h4>
          <DataTable columns={meetingColumns} data={meetings} keyField="id" emptyMessage="No meetings yet" />
        </div>
      </Modal>
    </div>
  );
}
