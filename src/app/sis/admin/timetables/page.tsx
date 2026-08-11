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
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { ClassSchedule, ClassSession } from '@/types/database';
import {
    getSISTimetables,
    saveTimetableSchedule,
    deleteTimetableSchedule,
    saveTimetableSession,
    deleteTimetableSession,
    autoGenerateSessions,
    getTimetableLookups,
} from '../timetable-actions';

interface ScheduleRow extends ClassSchedule {
  subject?: { name: string; code: string };
  semester?: { name: string };
  course?: { title: string; slug: string };
  instructor?: { first_name: string; last_name: string; email: string };
}

interface SessionRow extends ClassSession {
  subject?: { name: string; code: string };
  semester?: { name: string };
  course?: { title: string; slug: string };
  instructor?: { first_name: string; last_name: string; email: string };
  schedule?: { day_of_week: number; start_time: string; end_time: string; recurrence_pattern: string };
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SESSION_TYPES = ['Lecture', 'Lab', 'Tutorial', 'Seminar', 'Online'];
const RECURRENCE_PATTERNS = ['weekly', 'biweekly', 'once'];

export default function TimetablesPage() {
  const [activeTab, setActiveTab] = useState<'schedules' | 'sessions'>('schedules');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState<ScheduleRow[]>([]);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [lookups, setLookups] = useState<any>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ClassSchedule | null>(null);
  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);
  const [semesterFilter, setSemesterFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [saving, setSaving] = useState(false);

  const [scheduleForm, setScheduleForm] = useState({
    subject_id: '',
    semester_id: '',
    course_id: '',
    instructor_id: '',
    day_of_week: 1,
    start_time: '09:00',
    end_time: '10:30',
    room: '',
    building: '',
    session_type: 'Lecture',
    recurrence_pattern: 'weekly',
    start_date: '',
    end_date: '',
    notes: '',
    is_active: true,
  });

  const [sessionForm, setSessionForm] = useState({
    schedule_id: '',
    subject_id: '',
    semester_id: '',
    course_id: '',
    instructor_id: '',
    session_date: '',
    start_time: '09:00',
    end_time: '10:30',
    room: '',
    building: '',
    session_type: 'Lecture',
    status: 'scheduled',
    cancellation_reason: '',
    substitute_instructor_id: '',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, [semesterFilter, subjectFilter, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (semesterFilter) filters.semesterId = semesterFilter;
      if (subjectFilter) filters.subjectId = subjectFilter;
      
      const [timetablesResult, lookupsResult] = await Promise.all([
        getSISTimetables(filters),
        getTimetableLookups(),
      ]);

      if (!timetablesResult.success) throw new Error(timetablesResult.error);
      if (!lookupsResult.success) throw new Error(lookupsResult.error);

      setSchedules(timetablesResult.data?.schedules || []);
      setSessions(timetablesResult.data?.sessions || []);
      setLookups(lookupsResult.data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load timetable data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSchedule = async () => {
    if (!scheduleForm.subject_id || !scheduleForm.semester_id) {
      toast.error('Subject and semester are required');
      return;
    }
    setSaving(true);
    const result = await saveTimetableSchedule(scheduleForm, editingSchedule?.id);
    setSaving(false);
    if (result.success) {
      toast.success(editingSchedule ? 'Schedule updated' : 'Schedule created');
      setShowScheduleModal(false);
      setEditingSchedule(null);
      resetScheduleForm();
      fetchData();
    } else {
      toast.error(result.error);
    }
  };

  const handleSaveSession = async () => {
    if (!sessionForm.subject_id || !sessionForm.semester_id || !sessionForm.session_date) {
      toast.error('Subject, semester, and date are required');
      return;
    }
    setSaving(true);
    const result = await saveTimetableSession(sessionForm, editingSession?.id);
    setSaving(false);
    if (result.success) {
      toast.success(editingSession ? 'Session updated' : 'Session created');
      setShowSessionModal(false);
      setEditingSession(null);
      resetSessionForm();
      fetchData();
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm('Delete this schedule? This will also delete all associated sessions.')) return;
    const result = await deleteTimetableSchedule(id);
    if (result.success) {
      toast.success('Schedule deleted');
      fetchData();
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (!confirm('Delete this session?')) return;
    const result = await deleteTimetableSession(id);
    if (result.success) {
      toast.success('Session deleted');
      fetchData();
    } else {
      toast.error(result.error);
    }
  };

  const handleAutoGenerate = async (scheduleId: string) => {
    const result = await autoGenerateSessions(scheduleId);
    if (result.success) {
      toast.success(`Generated ${result.count} sessions`);
      fetchData();
    } else {
      toast.error(result.error);
    }
  };

  const resetScheduleForm = () => {
    setScheduleForm({
      subject_id: '',
      semester_id: '',
      course_id: '',
      instructor_id: '',
      day_of_week: 1,
      start_time: '09:00',
      end_time: '10:30',
      room: '',
      building: '',
      session_type: 'Lecture',
      recurrence_pattern: 'weekly',
      start_date: '',
      end_date: '',
      notes: '',
      is_active: true,
    });
  };

  const resetSessionForm = () => {
    setSessionForm({
      schedule_id: '',
      subject_id: '',
      semester_id: '',
      course_id: '',
      instructor_id: '',
      session_date: '',
      start_time: '09:00',
      end_time: '10:30',
      room: '',
      building: '',
      session_type: 'Lecture',
      status: 'scheduled',
      cancellation_reason: '',
      substitute_instructor_id: '',
      notes: '',
    });
  };

  const openScheduleModal = (schedule?: ScheduleRow) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setScheduleForm({
        subject_id: schedule.subject_id,
        semester_id: schedule.semester_id,
        course_id: schedule.course_id || '',
        instructor_id: schedule.instructor_id || '',
        day_of_week: schedule.day_of_week,
        start_time: schedule.start_time.slice(0, 5),
        end_time: schedule.end_time.slice(0, 5),
        room: schedule.room || '',
        building: schedule.building || '',
        session_type: schedule.session_type,
        recurrence_pattern: schedule.recurrence_pattern,
        start_date: schedule.start_date || '',
        end_date: schedule.end_date || '',
        notes: schedule.notes || '',
        is_active: schedule.is_active,
      });
    } else {
      setEditingSchedule(null);
      resetScheduleForm();
    }
    setShowScheduleModal(true);
  };

  const openSessionModal = (session?: SessionRow) => {
    if (session) {
      setEditingSession(session);
      setSessionForm({
        schedule_id: session.schedule_id || '',
        subject_id: session.subject_id,
        semester_id: session.semester_id,
        course_id: session.course_id || '',
        instructor_id: session.instructor_id || '',
        session_date: session.session_date,
        start_time: session.start_time.slice(0, 5),
        end_time: session.end_time.slice(0, 5),
        room: session.room || '',
        building: session.building || '',
        session_type: session.session_type,
        status: session.status,
        cancellation_reason: session.cancellation_reason || '',
        substitute_instructor_id: session.substitute_instructor_id || '',
        notes: session.notes || '',
      });
    } else {
      setEditingSession(null);
      resetSessionForm();
    }
    setShowSessionModal(true);
  };

  const filteredSchedules = schedules.filter(s => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      s.subject?.name?.toLowerCase().includes(searchLower) ||
      s.subject?.code?.toLowerCase().includes(searchLower) ||
      s.course?.title?.toLowerCase().includes(searchLower) ||
      s.room?.toLowerCase().includes(searchLower) ||
      s.building?.toLowerCase().includes(searchLower) ||
      (s.instructor?.first_name + ' ' + s.instructor?.last_name).toLowerCase().includes(searchLower)
    );
  });

  const filteredSessions = sessions.filter(s => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      s.subject?.name?.toLowerCase().includes(searchLower) ||
      s.subject?.code?.toLowerCase().includes(searchLower) ||
      s.room?.toLowerCase().includes(searchLower) ||
      s.building?.toLowerCase().includes(searchLower) ||
      (s.instructor?.first_name + ' ' + s.instructor?.last_name).toLowerCase().includes(searchLower) ||
      s.session_date.includes(search)
    );
  });

  const scheduleColumns = [
    {
      key: 'subject',
      header: 'Subject',
      render: (s: ScheduleRow) => (
        <div>
          <div className="font-bold text-neutral-900">{s.subject?.name || '—'}</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.subject?.code || '—'}</div>
        </div>
      ),
    },
    {
      key: 'course',
      header: 'Course',
      render: (s: ScheduleRow) => s.course?.title || '—',
    },
    {
      key: 'semester',
      header: 'Semester',
      render: (s: ScheduleRow) => s.semester?.name || '—',
    },
    {
      key: 'day_time',
      header: 'Day & Time',
      render: (s: ScheduleRow) => (
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Clock} size={12} strokeWidth={2.5} />
            <span className="font-medium">{DAYS[s.day_of_week]}</span>
          <span className="text-slate-400">{s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}</span>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (s: ScheduleRow) => (
          <div className="flex items-center gap-1 text-neutral-600">
            <HugeiconsIcon icon={MapPin} size={12} strokeWidth={2} />
            <span className="text-xs">{s.room}{s.building ? `, ${s.building}` : ''}</span>
          </div>
      ),
    },
    {
      key: 'instructor',
      header: 'Instructor',
      render: (s: ScheduleRow) => s.instructor ? `${s.instructor.first_name} ${s.instructor.last_name}` : 'TBD',
    },
    {
      key: 'type',
      header: 'Type',
      render: (s: ScheduleRow) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-neutral-100 text-neutral-700">
          {s.session_type}
        </span>
      ),
    },
    {
      key: 'recurrence',
      header: 'Recurrence',
      render: (s: ScheduleRow) => (
        <span className="text-xs font-medium text-neutral-500 capitalize">{s.recurrence_pattern}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (s: ScheduleRow) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${s.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {s.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (s: ScheduleRow) => (
        <div className="flex justify-end gap-2">
            <button
              onClick={() => handleAutoGenerate(s.id)}
              className="p-1.5 hover:bg-neutral-100 rounded text-neutral-500 hover:text-green-600"
              title="Auto-generate sessions"
            >
              <HugeiconsIcon icon={Play} size={14} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => openScheduleModal(s)}
              className="p-1.5 hover:bg-neutral-100 rounded text-slate-400 hover:text-black"
            >
              <HugeiconsIcon icon={Settings} size={14} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => handleDeleteSchedule(s.id)}
              className="p-1.5 hover:bg-neutral-100 rounded text-slate-400 hover:text-red-600"
            >
              <HugeiconsIcon icon={Trash} size={14} strokeWidth={2.5} />
            </button>
        </div>
      ),
    },
  ];

  const sessionColumns = [
    {
      key: 'date',
      header: 'Date',
      render: (s: SessionRow) => (
        <div className="font-medium text-neutral-900">{s.session_date}</div>
      ),
    },
    {
      key: 'subject',
      header: 'Subject',
      render: (s: SessionRow) => (
        <div>
          <div className="font-bold text-neutral-900">{s.subject?.name || '—'}</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.subject?.code || '—'}</div>
        </div>
      ),
    },
    {
      key: 'time',
      header: 'Time',
      render: (s: SessionRow) => (
        <div className="flex items-center gap-2 text-neutral-600 font-medium">
          <HugeiconsIcon icon={Clock} size={12} strokeWidth={2.5} />
          {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (s: SessionRow) => (
          <div className="flex items-center gap-1 text-neutral-600">
            <HugeiconsIcon icon={MapPin} size={12} strokeWidth={2} />
            <span className="text-xs">{s.room}{s.building ? `, ${s.building}` : ''}</span>
          </div>
      ),
    },
    {
      key: 'instructor',
      header: 'Instructor',
      render: (s: SessionRow) => s.instructor ? `${s.instructor.first_name} ${s.instructor.last_name}` : 'TBD',
    },
    {
      key: 'type',
      header: 'Type',
      render: (s: SessionRow) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-neutral-100 text-neutral-700">
          {s.session_type}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (s: SessionRow) => {
        const colors: any = {
          scheduled: 'bg-blue-50 text-blue-700',
          completed: 'bg-green-50 text-green-700',
          cancelled: 'bg-red-50 text-red-700',
          rescheduled: 'bg-yellow-50 text-yellow-700',
        };
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${colors[s.status] || 'bg-neutral-100 text-neutral-700'}`}>
            {s.status}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (s: SessionRow) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => openSessionModal(s)}
            className="p-1.5 hover:bg-neutral-100 rounded text-slate-400 hover:text-black"
          >
            <HugeiconsIcon icon={Settings} size={14} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => handleDeleteSession(s.id)}
            className="p-1.5 hover:bg-neutral-100 rounded text-slate-400 hover:text-red-600"
          >
            <HugeiconsIcon icon={Trash} size={14} strokeWidth={2.5} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Timetable Management"
        subtitle="Manage class schedules and sessions"
      />

      <div className="flex gap-4 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab('schedules')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'schedules' ? 'border-[#9c27b3] text-[#9c27b3]' : 'border-transparent text-slate-400 hover:text-neutral-600'}`}
        >
          Class Schedules
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'sessions' ? 'border-[#9c27b3] text-[#9c27b3]' : 'border-transparent text-slate-400 hover:text-neutral-600'}`}
        >
          Class Sessions
        </button>
      </div>

      <ActionToolbar
        search={
          <div className="flex flex-wrap items-center gap-3">
            <SearchBar value={search} onChange={setSearch} placeholder={`Search ${activeTab}...`} />
            {lookups && (
              <>
                <select
                  value={semesterFilter}
                  onChange={(e) => setSemesterFilter(e.target.value)}
                  className="px-3 py-2 border border-neutral-200 rounded text-xs font-medium text-neutral-700 bg-white"
                >
                  <option value="">All Semesters</option>
                  {lookups.semesters.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="px-3 py-2 border border-neutral-200 rounded text-xs font-medium text-neutral-700 bg-white"
                >
                  <option value="">All Subjects</option>
                  {lookups.subjects.map((sub: any) => (
                    <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                  ))}
                </select>
              </>
            )}
            <button
              onClick={() => activeTab === 'schedules' ? openScheduleModal() : openSessionModal()}
              className="flex items-center gap-2 px-4 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all"
            >
              <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} />
              {activeTab === 'schedules' ? 'Add Schedule' : 'Add Session'}
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
        </div>
      ) : (
        <>
          {activeTab === 'schedules' ? (
            <DataTable
              columns={scheduleColumns}
              data={filteredSchedules}
              keyField="id"
              emptyMessage="No class schedules found"
            />
          ) : (
            <DataTable
              columns={sessionColumns}
              data={filteredSessions}
              keyField="id"
              emptyMessage="No class sessions found"
            />
          )}
        </>
      )}

      {/* Schedule Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => { setShowScheduleModal(false); setEditingSchedule(null); resetScheduleForm(); }}
        title={editingSchedule ? 'Edit Schedule' : 'New Schedule'}
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => { setShowScheduleModal(false); setEditingSchedule(null); resetScheduleForm(); }}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-600 hover:text-black"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSchedule}
              disabled={saving}
              className="px-6 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Schedule'}
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Subject *</label>
            <select
              value={scheduleForm.subject_id}
              onChange={(e) => setScheduleForm({ ...scheduleForm, subject_id: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
            >
              <option value="">Select subject</option>
              {lookups?.subjects.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Semester *</label>
            <select
              value={scheduleForm.semester_id}
              onChange={(e) => setScheduleForm({ ...scheduleForm, semester_id: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
            >
              <option value="">Select semester</option>
              {lookups?.semesters.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Course</label>
            <select
              value={scheduleForm.course_id}
              onChange={(e) => setScheduleForm({ ...scheduleForm, course_id: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
            >
              <option value="">Select course</option>
              {lookups?.courses.map((c: any) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Instructor</label>
            <select
              value={scheduleForm.instructor_id}
              onChange={(e) => setScheduleForm({ ...scheduleForm, instructor_id: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
            >
              <option value="">Select instructor</option>
              {lookups?.instructors.map((i: any) => (
                <option key={i.id} value={i.id}>{i.first_name} {i.last_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Day of Week</label>
            <select
              value={scheduleForm.day_of_week}
              onChange={(e) => setScheduleForm({ ...scheduleForm, day_of_week: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
            >
              {DAYS.map((d, i) => (
                <option key={i} value={i}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Session Type</label>
            <select
              value={scheduleForm.session_type}
              onChange={(e) => setScheduleForm({ ...scheduleForm, session_type: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
            >
              {SESSION_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Start Time</label>
            <input
              type="time"
              value={scheduleForm.start_time}
              onChange={(e) => setScheduleForm({ ...scheduleForm, start_time: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">End Time</label>
            <input
              type="time"
              value={scheduleForm.end_time}
              onChange={(e) => setScheduleForm({ ...scheduleForm, end_time: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Room</label>
            <input
              type="text"
              value={scheduleForm.room}
              onChange={(e) => setScheduleForm({ ...scheduleForm, room: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
              placeholder="e.g. Room 101"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Building</label>
            <input
              type="text"
              value={scheduleForm.building}
              onChange={(e) => setScheduleForm({ ...scheduleForm, building: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
              placeholder="e.g. Main Building"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Recurrence</label>
            <select
              value={scheduleForm.recurrence_pattern}
              onChange={(e) => setScheduleForm({ ...scheduleForm, recurrence_pattern: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
            >
              {RECURRENCE_PATTERNS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Active</label>
            <select
              value={scheduleForm.is_active ? 'true' : 'false'}
              onChange={(e) => setScheduleForm({ ...scheduleForm, is_active: e.target.value === 'true' })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Notes</label>
            <textarea
              value={scheduleForm.notes}
              onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
              rows={2}
            />
          </div>
        </div>
      </Modal>

      {/* Session Modal */}
      <Modal
        isOpen={showSessionModal}
        onClose={() => { setShowSessionModal(false); setEditingSession(null); resetSessionForm(); }}
        title={editingSession ? 'Edit Session' : 'New Session'}
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => { setShowSessionModal(false); setEditingSession(null); resetSessionForm(); }}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-600 hover:text-black"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSession}
              disabled={saving}
              className="px-6 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Session'}
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Subject *</label>
            <select
              value={sessionForm.subject_id}
              onChange={(e) => setSessionForm({ ...sessionForm, subject_id: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
            >
              <option value="">Select subject</option>
              {lookups?.subjects.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Semester *</label>
            <select
              value={sessionForm.semester_id}
              onChange={(e) => setSessionForm({ ...sessionForm, semester_id: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
            >
              <option value="">Select semester</option>
              {lookups?.semesters.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Date *</label>
            <input
              type="date"
              value={sessionForm.session_date}
              onChange={(e) => setSessionForm({ ...sessionForm, session_date: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Course</label>
            <select
              value={sessionForm.course_id}
              onChange={(e) => setSessionForm({ ...sessionForm, course_id: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
            >
              <option value="">Select course</option>
              {lookups?.courses.map((c: any) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Instructor</label>
            <select
              value={sessionForm.instructor_id}
              onChange={(e) => setSessionForm({ ...sessionForm, instructor_id: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
            >
              <option value="">Select instructor</option>
              {lookups?.instructors.map((i: any) => (
                <option key={i.id} value={i.id}>{i.first_name} {i.last_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Session Type</label>
            <select
              value={sessionForm.session_type}
              onChange={(e) => setSessionForm({ ...sessionForm, session_type: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
            >
              {SESSION_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Start Time</label>
            <input
              type="time"
              value={sessionForm.start_time}
              onChange={(e) => setSessionForm({ ...sessionForm, start_time: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">End Time</label>
            <input
              type="time"
              value={sessionForm.end_time}
              onChange={(e) => setSessionForm({ ...sessionForm, end_time: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Room</label>
            <input
              type="text"
              value={sessionForm.room}
              onChange={(e) => setSessionForm({ ...sessionForm, room: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Building</label>
            <input
              type="text"
              value={sessionForm.building}
              onChange={(e) => setSessionForm({ ...sessionForm, building: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Status</label>
            <select
              value={sessionForm.status}
              onChange={(e) => setSessionForm({ ...sessionForm, status: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rescheduled">Rescheduled</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Substitute Instructor</label>
            <select
              value={sessionForm.substitute_instructor_id}
              onChange={(e) => setSessionForm({ ...sessionForm, substitute_instructor_id: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
            >
              <option value="">None</option>
              {lookups?.instructors.map((i: any) => (
                <option key={i.id} value={i.id}>{i.first_name} {i.last_name}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Cancellation Reason</label>
            <input
              type="text"
              value={sessionForm.cancellation_reason}
              onChange={(e) => setSessionForm({ ...sessionForm, cancellation_reason: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
              placeholder="Required if status is cancelled"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Notes</label>
            <textarea
              value={sessionForm.notes}
              onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
              rows={2}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
