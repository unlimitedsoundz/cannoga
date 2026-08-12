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
  Add01Icon as Plus,
  Task01Icon as Trash,
  Settings01Icon as Settings,
  SlidersHorizontalIcon as Slider,
  Grid02Icon as Grid,
  Calendar01Icon as Calendar,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  getTimetableConstraints,
  updateTimetableConstraint,
  createTimetableConstraint,
  deleteTimetableConstraint,
  getTimetablePreferences,
  updateTimetablePreference,
  createTimetablePreference,
  deleteTimetablePreference,
  getAcademicDays,
  updateAcademicDay,
  getTimeSlots,
  createTimeSlot,
  updateTimeSlot,
  deleteTimeSlot,
  getHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
} from './actions';
import { TimetableConstraint, TimetablePreference, AcademicDay, TimeSlot, Holiday } from '@/types/database';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'constraints' | 'preferences' | 'timeslots' | 'academic_days' | 'holidays'>('constraints');
  const [constraints, setConstraints] = useState<TimetableConstraint[]>([]);
  const [preferences, setPreferences] = useState<TimetablePreference[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [academicDays, setAcademicDays] = useState<AcademicDay[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<any>({});

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [cRes, pRes, tsRes, adRes, hRes] = await Promise.all([
        getTimetableConstraints(),
        getTimetablePreferences(),
        getTimeSlots(),
        getAcademicDays(),
        getHolidays(),
      ]);
      setConstraints(cRes.data);
      setPreferences(pRes.data);
      setTimeSlots(tsRes.data);
      setAcademicDays(adRes.data);
      setHolidays(hRes.data);
    } catch (e: any) {
      toast.error(e.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let result;
      if (activeTab === 'constraints') {
        result = editingItem ? await updateTimetableConstraint(editingItem.id, form) : await createTimetableConstraint(form);
      } else if (activeTab === 'preferences') {
        result = editingItem ? await updateTimetablePreference(editingItem.id, form) : await createTimetablePreference(form);
      } else if (activeTab === 'timeslots') {
        result = editingItem ? await updateTimeSlot(editingItem.id, form) : await createTimeSlot({ ...form, day_of_week: selectedDay });
      } else if (activeTab === 'holidays') {
        result = editingItem ? await updateHoliday(editingItem.id, form) : await createHoliday(form);
      }
      if (result?.success) {
        toast.success(editingItem ? 'Updated' : 'Created');
        setShowModal(false);
        setEditingItem(null);
        setForm({});
        fetchAllData();
      } else {
        toast.error(result?.error || 'Failed to save');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    let result;
    if (deleteConfirm.type === 'constraint') result = await deleteTimetableConstraint(deleteConfirm.id);
    else if (deleteConfirm.type === 'preference') result = await deleteTimetablePreference(deleteConfirm.id);
    else if (deleteConfirm.type === 'timeSlot') result = await deleteTimeSlot(deleteConfirm.id);
    else if (deleteConfirm.type === 'holiday') result = await deleteHoliday(deleteConfirm.id);
    if (result?.success) {
      toast.success('Deleted');
      setDeleteConfirm(null);
      fetchAllData();
    } else {
      toast.error(result?.error || 'Failed to delete');
    }
  };

  const openModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setForm({ ...item });
    } else {
      setEditingItem(null);
      setForm({});
    }
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Scheduling Settings" subtitle="Configure constraints, preferences, time slots, and holidays" />

      <div className="flex gap-4 border-b border-neutral-200">
        {[
          { key: 'constraints', label: 'Constraints' },
          { key: 'preferences', label: 'Preferences' },
          { key: 'timeslots', label: 'Time Slots' },
          { key: 'academic_days', label: 'Academic Days' },
          { key: 'holidays', label: 'Holidays' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab.key ? 'border-[#9c27b3] text-[#9c27b3]' : 'border-transparent text-slate-400 hover:text-neutral-600'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
        </div>
      ) : (
        <>
          {activeTab === 'constraints' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => openModal(null)} className="flex items-center gap-2 px-4 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800">
                  <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> Add Constraint
                </button>
              </div>
              <DataTable
                columns={[
                  { key: 'name', header: 'Name', render: (c: TimetableConstraint) => (
                    <div>
                      <div className="font-bold text-neutral-900">{c.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{c.constraint_type}</div>
                    </div>
                  )},
                  { key: 'weight', header: 'Weight', render: (c: TimetableConstraint) => c.weight },
                  { key: 'is_enabled', header: 'Enabled', render: (c: TimetableConstraint) => <StatusBadge status={c.is_enabled ? 'ACTIVE' : 'INACTIVE'} /> },
                  { key: 'description', header: 'Description', render: (c: TimetableConstraint) => c.description || '—' },
                  { key: 'actions', header: 'Actions', render: (c: TimetableConstraint) => (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(c)} className="p-1.5 hover:bg-neutral-100 rounded text-slate-400 hover:text-black">
                        <HugeiconsIcon icon={Settings} size={14} strokeWidth={2.5} />
                      </button>
                      <button onClick={() => setDeleteConfirm({ type: 'constraint', id: c.id })} className="p-1.5 hover:bg-neutral-100 rounded text-slate-400 hover:text-red-600">
                        <HugeiconsIcon icon={Trash} size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  )},
                ]}
                data={constraints}
                keyField="id"
                emptyMessage="No constraints found"
              />
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => openModal(null)} className="flex items-center gap-2 px-4 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800">
                  <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> Add Preference
                </button>
              </div>
              <DataTable
                columns={[
                  { key: 'name', header: 'Name', render: (p: TimetablePreference) => (
                    <div>
                      <div className="font-bold text-neutral-900">{p.name}</div>
                      {p.description && <div className="text-[10px] text-slate-400">{p.description}</div>}
                    </div>
                  )},
                  { key: 'weight', header: 'Weight', render: (p: TimetablePreference) => p.weight },
                  { key: 'is_enabled', header: 'Enabled', render: (p: TimetablePreference) => <StatusBadge status={p.is_enabled ? 'ACTIVE' : 'INACTIVE'} /> },
                  { key: 'actions', header: 'Actions', render: (p: TimetablePreference) => (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(p)} className="p-1.5 hover:bg-neutral-100 rounded text-slate-400 hover:text-black">
                        <HugeiconsIcon icon={Settings} size={14} strokeWidth={2.5} />
                      </button>
                      <button onClick={() => setDeleteConfirm({ type: 'preference', id: p.id })} className="p-1.5 hover:bg-neutral-100 rounded text-slate-400 hover:text-red-600">
                        <HugeiconsIcon icon={Trash} size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  )},
                ]}
                data={preferences}
                keyField="id"
                emptyMessage="No preferences found"
              />
            </div>
          )}

          {activeTab === 'timeslots' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <select value={selectedDay} onChange={(e) => setSelectedDay(parseInt(e.target.value))} className="px-3 py-2 border border-neutral-200 rounded text-xs font-medium text-neutral-700 bg-white">
                  {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                </select>
                <button onClick={() => openModal(null)} className="flex items-center gap-2 px-4 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800">
                  <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> Add Time Slot
                </button>
              </div>
              <DataTable
                columns={[
                  { key: 'slot_index', header: 'Slot', render: (t: TimeSlot) => `#${t.slot_index}` },
                  { key: 'start_time', header: 'Start', render: (t: TimeSlot) => t.start_time },
                  { key: 'end_time', header: 'End', render: (t: TimeSlot) => t.end_time },
                  { key: 'slot_duration', header: 'Duration', render: (t: TimeSlot) => `${t.slot_duration} min` },
                  { key: 'is_break', header: 'Break', render: (t: TimeSlot) => <StatusBadge status={t.is_break ? 'INACTIVE' : 'ACTIVE'} /> },
                  { key: 'actions', header: 'Actions', render: (t: TimeSlot) => (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(t)} className="p-1.5 hover:bg-neutral-100 rounded text-slate-400 hover:text-black">
                        <HugeiconsIcon icon={Settings} size={14} strokeWidth={2.5} />
                      </button>
                      <button onClick={() => setDeleteConfirm({ type: 'timeSlot', id: t.id })} className="p-1.5 hover:bg-neutral-100 rounded text-slate-400 hover:text-red-600">
                        <HugeiconsIcon icon={Trash} size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  )},
                ]}
                data={timeSlots.filter(ts => ts.day_of_week === selectedDay)}
                keyField="id"
                emptyMessage={`No time slots for ${DAYS[selectedDay]}`}
              />
            </div>
          )}

          {activeTab === 'academic_days' && (
            <div className="space-y-4">
              <DataTable
                columns={[
                  { key: 'name', header: 'Day', render: (d: AcademicDay) => (
                    <div>
                      <div className="font-bold text-neutral-900">{d.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{d.abbreviation}</div>
                    </div>
                  )},
                  { key: 'day_of_week', header: 'Index', render: (d: AcademicDay) => d.day_of_week },
                  { key: 'is_teaching_day', header: 'Teaching', render: (d: AcademicDay) => (
                    <button
                       onClick={() => { void updateAcademicDay(d.id, { is_teaching_day: !d.is_teaching_day }).then(r => { if (r.success) fetchAllData(); }); }}
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${d.is_teaching_day ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                    >
                      {d.is_teaching_day ? 'Yes' : 'No'}
                    </button>
                  )},
                ]}
                data={academicDays}
                keyField="id"
                emptyMessage="No academic days found"
              />
            </div>
          )}

          {activeTab === 'holidays' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => openModal(null)} className="flex items-center gap-2 px-4 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800">
                  <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> Add Holiday
                </button>
              </div>
              <DataTable
                columns={[
                  { key: 'name', header: 'Name', render: (h: Holiday) => (
                    <div>
                      <div className="font-bold text-neutral-900">{h.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{h.block_type}</div>
                    </div>
                  )},
                  { key: 'start_date', header: 'Start', render: (h: Holiday) => h.start_date },
                  { key: 'end_date', header: 'End', render: (h: Holiday) => h.end_date },
                  { key: 'affects_scheduling', header: 'Blocks', render: (h: Holiday) => <StatusBadge status={h.affects_scheduling ? 'ACTIVE' : 'INACTIVE'} /> },
                  { key: 'actions', header: 'Actions', render: (h: Holiday) => (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(h)} className="p-1.5 hover:bg-neutral-100 rounded text-slate-400 hover:text-black">
                        <HugeiconsIcon icon={Settings} size={14} strokeWidth={2.5} />
                      </button>
                      <button onClick={() => setDeleteConfirm({ type: 'holiday', id: h.id })} className="p-1.5 hover:bg-neutral-100 rounded text-slate-400 hover:text-red-600">
                        <HugeiconsIcon icon={Trash} size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  )},
                ]}
                data={holidays}
                keyField="id"
                emptyMessage="No holidays found"
              />
            </div>
          )}
        </>
      )}

      {/* Generic Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingItem(null); setForm({}); }} title={editingItem ? 'Edit' : 'New'} size="md" footer={
        <div className="flex justify-end gap-3">
          <button onClick={() => { setShowModal(false); setEditingItem(null); setForm({}); }} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-600 hover:text-black">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      }>
        <div className="space-y-4">
          {activeTab === 'constraints' && (
            <>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Name *</label>
                <input type="text" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Type</label>
                <select value={form.constraint_type || 'HARD'} onChange={(e) => setForm({ ...form, constraint_type: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm">
                  <option value="HARD">HARD</option>
                  <option value="SOFT">SOFT</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Weight</label>
                <input type="number" value={form.weight || 1} onChange={(e) => setForm({ ...form, weight: parseFloat(e.target.value) || 1 })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Enabled</label>
                <select value={form.is_enabled ? 'true' : 'false'} onChange={(e) => setForm({ ...form, is_enabled: e.target.value === 'true' })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Description</label>
                <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" rows={2} />
              </div>
            </>
          )}

          {activeTab === 'preferences' && (
            <>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Name *</label>
                <input type="text" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Weight</label>
                <input type="number" value={form.weight || 1} onChange={(e) => setForm({ ...form, weight: parseFloat(e.target.value) || 1 })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Enabled</label>
                <select value={form.is_enabled ? 'true' : 'false'} onChange={(e) => setForm({ ...form, is_enabled: e.target.value === 'true' })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Description</label>
                <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" rows={2} />
              </div>
            </>
          )}

          {activeTab === 'timeslots' && (
            <>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Slot Index</label>
                <input type="number" value={form.slot_index || 0} onChange={(e) => setForm({ ...form, slot_index: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Start Time</label>
                <input type="time" value={form.start_time || ''} onChange={(e) => setForm({ ...form, start_time: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">End Time</label>
                <input type="time" value={form.end_time || ''} onChange={(e) => setForm({ ...form, end_time: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Duration (min)</label>
                <input type="number" value={form.slot_duration || 30} onChange={(e) => setForm({ ...form, slot_duration: parseInt(e.target.value) || 30 })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Is Break</label>
                <select value={form.is_break ? 'true' : 'false'} onChange={(e) => setForm({ ...form, is_break: e.target.value === 'true' })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm">
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </>
          )}

          {activeTab === 'holidays' && (
            <>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Name *</label>
                <input type="text" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Start Date</label>
                <input type="date" value={form.start_date || ''} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">End Date</label>
                <input type="date" value={form.end_date || ''} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Block Type</label>
                <select value={form.block_type || 'HOLIDAY'} onChange={(e) => setForm({ ...form, block_type: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm">
                  {['INSTITUTION', 'SEMESTER_BREAK', 'HOLIDAY', 'EXAM_PERIOD'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Affects Scheduling</label>
                <select value={form.affects_scheduling ? 'true' : 'false'} onChange={(e) => setForm({ ...form, affects_scheduling: e.target.value === 'true' })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Confirmation"
        message={`Are you sure you want to delete this ${deleteConfirm?.type}? This action cannot be undone.`}
      />
    </div>
  );
}
