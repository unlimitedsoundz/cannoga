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
  User02Icon as User,
  Add01Icon as Plus,
  Task01Icon as Trash,
  Settings01Icon as Settings,
  Calendar01Icon as Calendar,
  Clock01Icon as Clock,
  Grid02Icon as Grid,
  Download01Icon as Download,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  getInstructorAvailability,
  getInstructorAvailabilityWeek,
  createInstructorAvailability,
  updateInstructorAvailability,
  deleteInstructorAvailability,
  bulkSetAvailability,
} from './actions';
import { InstructorAvailability, Profile } from '@/types/database';

const AVAILABILITY_TYPES = ['AVAILABLE', 'UNAVAILABLE', 'PREFERRED'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = Array.from({ length: 19 }, (_, i) => {
  const hour = 8 + Math.floor(i / 2);
  const min = (i % 2) * 30;
  return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
});

export default function AvailabilityPage() {
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [instructorFilter, setInstructorFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingAvailability, setEditingAvailability] = useState<InstructorAvailability | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const [form, setForm] = useState({
    instructor_id: '', day_of_week: 1, start_time: '09:00', end_time: '10:00',
    availability_type: 'AVAILABLE', effective_date: '', expiry_date: '', notes: '',
  });

  const [bulkForm, setBulkForm] = useState({
    instructor_id: '', effective_date: '', expiry_date: '',
    slots: {} as Record<string, string>,
  });

  useEffect(() => {
    fetchInstructors();
    fetchData();
  }, [instructorFilter, typeFilter, search]);

  const fetchInstructors = async () => {
    try {
      const res = await fetch('/api/profiles?role=FACULTY');
      const data = await res.json();
      if (data.success) setInstructors(data.data || []);
    } catch (e: any) {
      console.error('Failed to load instructors', e);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getInstructorAvailability({
        instructorId: instructorFilter || undefined,
        fromDate: new Date().toISOString().split('T')[0],
      });
      if (result.success) {
        setAvailability(result.data.filter((a: any) => {
          if (typeFilter && a.availability_type !== typeFilter) return false;
          if (search) {
            const instructor = instructors.find(i => i.id === a.instructor_id);
            const name = instructor ? `${instructor.first_name} ${instructor.last_name}`.toLowerCase() : '';
            return name.includes(search.toLowerCase()) || a.notes?.toLowerCase().includes(search.toLowerCase());
          }
          return true;
        }));
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.instructor_id || !form.start_time || !form.end_time) {
      toast.error('Instructor and times are required');
      return;
    }
    setSaving(true);
    const result = editingAvailability
      ? await updateInstructorAvailability(editingAvailability.id, form)
      : await createInstructorAvailability(form);
    setSaving(false);
    if (result.success) {
      toast.success(editingAvailability ? 'Availability updated' : 'Availability created');
      setShowModal(false);
      setEditingAvailability(null);
      resetForm();
      fetchData();
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    const result = await deleteInstructorAvailability(deleteConfirm);
    if (result.success) {
      toast.success('Availability deleted');
      setDeleteConfirm(null);
      fetchData();
    } else {
      toast.error(result.error);
    }
  };

  const handleBulkSet = async () => {
    if (!bulkForm.instructor_id) {
      toast.error('Select an instructor');
      return;
    }
    const entries = Object.entries(bulkForm.slots)
      .filter(([_, type]) => type !== '')
      .map(([key, type]) => {
        const [day, time] = key.split('-');
        const timeIndex = TIME_SLOTS.indexOf(time);
        return {
          day_of_week: parseInt(day),
          start_time: time,
          end_time: TIME_SLOTS[timeIndex + 1] || '17:00',
          availability_type: type,
          effective_date: bulkForm.effective_date,
          expiry_date: bulkForm.expiry_date || null,
        };
      });

    if (entries.length === 0) {
      toast.error('Set at least one time slot');
      return;
    }

    setSaving(true);
    const result = await bulkSetAvailability(bulkForm.instructor_id, entries);
    setSaving(false);
    if (result.success) {
      toast.success(`Set ${result.count} availability entries`);
      setShowBulkModal(false);
      setBulkForm({ instructor_id: '', effective_date: '', expiry_date: '', slots: {} });
      fetchData();
    } else {
      toast.error(result.error);
    }
  };

  const openModal = (item?: InstructorAvailability) => {
    if (item) {
      setEditingAvailability(item);
      setForm({
        instructor_id: item.instructor_id,
        day_of_week: item.day_of_week,
        start_time: item.start_time.slice(0, 5),
        end_time: item.end_time.slice(0, 5),
        availability_type: item.availability_type,
        effective_date: item.effective_date,
        expiry_date: item.expiry_date || '',
        notes: item.notes || '',
      });
    } else {
      setEditingAvailability(null);
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({ instructor_id: '', day_of_week: 1, start_time: '09:00', end_time: '10:00', availability_type: 'AVAILABLE', effective_date: '', expiry_date: '', notes: '' });
  };

  const getInstructorName = (instructorId: string) => {
    const instructor = instructors.find(i => i.id === instructorId);
    return instructor ? `${instructor.first_name} ${instructor.last_name}` : 'Unknown';
  };

  const columns = [
    { key: 'instructor', header: 'Instructor', render: (a: any) => (
      <div className="flex items-center gap-2">
        <HugeiconsIcon icon={User} size={12} strokeWidth={2.5} />
        <span className="font-medium">{getInstructorName(a.instructor_id)}</span>
      </div>
    )},
    { key: 'day', header: 'Day', render: (a: any) => DAYS[a.day_of_week] },
    { key: 'time', header: 'Time', render: (a: any) => (
      <div className="flex items-center gap-1 text-neutral-600">
        <HugeiconsIcon icon={Clock} size={12} strokeWidth={2.5} />
        {a.start_time.slice(0, 5)} - {a.end_time.slice(0, 5)}
      </div>
    )},
    { key: 'type', header: 'Type', render: (a: any) => {
      const colors: any = { AVAILABLE: 'bg-green-50 text-green-700', UNAVAILABLE: 'bg-red-50 text-red-700', PREFERRED: 'bg-blue-50 text-blue-700' };
      return <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${colors[a.availability_type] || 'bg-neutral-100 text-neutral-700'}`}>{a.availability_type}</span>;
    }},
    { key: 'effective', header: 'Effective', render: (a: any) => (
      <div className="text-xs">
        <div>{a.effective_date}</div>
        {a.expiry_date && <div className="text-neutral-400">to {a.expiry_date}</div>}
      </div>
    )},
    { key: 'notes', header: 'Notes', render: (a: any) => a.notes || '—' },
    { key: 'actions', header: 'Actions', render: (a: any) => (
      <div className="flex justify-end gap-2">
        <button onClick={() => openModal(a)} className="p-1.5 hover:bg-neutral-100 rounded text-neutral-400 hover:text-black">
          <HugeiconsIcon icon={Settings} size={14} strokeWidth={2.5} />
        </button>
        <button onClick={() => setDeleteConfirm(a.id)} className="p-1.5 hover:bg-neutral-100 rounded text-neutral-400 hover:text-red-600">
          <HugeiconsIcon icon={Trash} size={14} strokeWidth={2.5} />
        </button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Instructor Availability"
        subtitle="Manage instructor time preferences and availability"
        actions={
          <div className="flex items-center gap-2">
            <button onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')} className="flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 rounded text-[10px] font-black uppercase tracking-widest hover:border-neutral-300">
              <HugeiconsIcon icon={Grid} size={14} strokeWidth={2.5} /> {viewMode === 'list' ? 'Grid View' : 'List View'}
            </button>
            <button onClick={() => setShowBulkModal(true)} className="flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 rounded text-[10px] font-black uppercase tracking-widest hover:border-neutral-300">
              <HugeiconsIcon icon={Download} size={14} strokeWidth={2.5} /> Bulk Import
            </button>
            <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800">
              <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> Add Availability
            </button>
          </div>
        }
      />

      <ActionToolbar
        search={
          <div className="flex flex-wrap items-center gap-3">
            <SearchBar value={search} onChange={setSearch} placeholder="Search availability..." />
            <select value={instructorFilter} onChange={(e) => setInstructorFilter(e.target.value)} className="px-3 py-2 border border-neutral-200 rounded text-xs font-medium text-neutral-700 bg-white">
              <option value="">All Instructors</option>
              {instructors.map((i: any) => <option key={i.id} value={i.id}>{i.first_name} {i.last_name}</option>)}
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 border border-neutral-200 rounded text-xs font-medium text-neutral-700 bg-white">
              <option value="">All Types</option>
              {AVAILABILITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={availability} keyField="id" emptyMessage="No availability entries found" />
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingAvailability(null); resetForm(); }} title={editingAvailability ? 'Edit Availability' : 'New Availability'} size="md" footer={
        <div className="flex justify-end gap-3">
          <button onClick={() => { setShowModal(false); setEditingAvailability(null); resetForm(); }} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-600 hover:text-black">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      }>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Instructor *</label>
            <select value={form.instructor_id} onChange={(e) => setForm({ ...form, instructor_id: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm">
              <option value="">Select instructor</option>
              {instructors.map((i: any) => <option key={i.id} value={i.id}>{i.first_name} {i.last_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Day</label>
            <select value={form.day_of_week} onChange={(e) => setForm({ ...form, day_of_week: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm">
              {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Start Time</label>
            <input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">End Time</label>
            <input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Type</label>
            <select value={form.availability_type} onChange={(e) => setForm({ ...form, availability_type: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm">
              {AVAILABILITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Effective Date</label>
            <input type="date" value={form.effective_date} onChange={(e) => setForm({ ...form, effective_date: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Expiry Date</label>
            <input type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Notes</label>
            <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
          </div>
        </div>
      </Modal>

      {/* Bulk Import Modal */}
      <Modal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} title="Bulk Set Availability" size="xl" footer={
        <div className="flex justify-end gap-3">
          <button onClick={() => setShowBulkModal(false)} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-600 hover:text-black">Cancel</button>
          <button onClick={handleBulkSet} disabled={saving} className="px-6 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50">
            {saving ? 'Saving...' : 'Apply'}
          </button>
        </div>
      }>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Instructor *</label>
              <select value={bulkForm.instructor_id} onChange={(e) => setBulkForm({ ...bulkForm, instructor_id: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm">
                <option value="">Select instructor</option>
                {instructors.map((i: any) => <option key={i.id} value={i.id}>{i.first_name} {i.last_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Effective Date</label>
              <input type="date" value={bulkForm.effective_date} onChange={(e) => setBulkForm({ ...bulkForm, effective_date: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Expiry Date</label>
              <input type="date" value={bulkForm.expiry_date} onChange={(e) => setBulkForm({ ...bulkForm, expiry_date: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border border-neutral-200 text-xs">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="p-2 text-left font-bold uppercase tracking-widest text-neutral-600">Time</th>
                  {DAYS.slice(1, 6).map(d => (
                    <th key={d} className="p-2 text-center font-bold uppercase tracking-widest text-neutral-600">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.filter((_, i) => i % 2 === 0).map((time, i) => (
                  <tr key={time} className="border-t border-neutral-100">
                    <td className="p-2 font-medium text-neutral-700">{time}</td>
                    {[1, 2, 3, 4, 5].map(day => (
                      <td key={day} className="p-2 text-center">
                        <select
                          value={bulkForm.slots[`${day}-${time}`] || ''}
                          onChange={(e) => setBulkForm({
                            ...bulkForm,
                            slots: { ...bulkForm.slots, [`${day}-${time}`]: e.target.value },
                          })}
                          className="w-full px-1 py-1 border border-neutral-200 rounded text-[10px] font-medium"
                        >
                          <option value="">—</option>
                          {AVAILABILITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Confirmation"
        message="Are you sure you want to delete this availability entry? This action cannot be undone."
      />
    </div>
  );
}
