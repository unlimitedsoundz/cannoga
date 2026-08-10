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
  Door01Icon as Door,
  Add01Icon as Plus,
  Task01Icon as Trash,
  Settings01Icon as Settings,
  Search01Icon as Filter,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomFeatures,
  createRoomFeature,
  updateRoomFeature,
  deleteRoomFeature,
  getRoomFeatureAssignments,
  assignRoomFeature,
  removeRoomFeatureAssignment,
  getRoomAvailability,
  createRoomAvailability,
  updateRoomAvailability,
  deleteRoomAvailability,
} from './actions';
import { Room, RoomFeature, RoomFeatureAssignment, RoomAvailability } from '@/types/database';

const ROOM_TYPES = ['LECTURE_ROOM', 'LAB', 'COMPUTER_LAB', 'SCIENCE_LAB', 'SEMINAR_ROOM', 'AUDITORIUM', 'CLINICAL_LAB', 'SPECIALIZED_ROOM', 'ONLINE'];
const BLOCK_TYPES = ['MAINTENANCE', 'BLOCKED', 'EVENT', 'RESERVATION'];

export default function RoomsPage() {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [features, setFeatures] = useState<RoomFeature[]>([]);
  const [assignments, setAssignments] = useState<RoomFeatureAssignment[]>([]);
  const [availability, setAvailability] = useState<RoomAvailability[]>([]);
  const [buildings, setBuildings] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showFeatureAssignModal, setShowFeatureAssignModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editingFeature, setEditingFeature] = useState<RoomFeature | null>(null);
  const [editingAvailability, setEditingAvailability] = useState<RoomAvailability | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [viewTab, setViewTab] = useState<'rooms' | 'features' | 'availability'>('rooms');

  const [roomForm, setRoomForm] = useState<{
    name: string; building: string; floor: string; room_number: string; capacity: number;
    room_type: string; campus: string; accessibility: boolean;
    equipment: string[]; status: string; notes: string;
  }>({
    name: '', building: '', floor: '', room_number: '', capacity: 30,
    room_type: 'LECTURE_ROOM', campus: 'MAIN', accessibility: false,
    equipment: [], status: 'ACTIVE', notes: '',
  });

  const [featureForm, setFeatureForm] = useState({ name: '', description: '', category: 'GENERAL' });

  const [availabilityForm, setAvailabilityForm] = useState({
    room_id: '', block_type: 'MAINTENANCE', start_datetime: '', end_datetime: '', reason: '',
  });

  useEffect(() => {
    fetchData();
  }, [buildingFilter, typeFilter, statusFilter, search]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsRes, featuresRes] = await Promise.all([
        getRooms({ search, building: buildingFilter, roomType: typeFilter, status: statusFilter }),
        getRoomFeatures(),
      ]);
      setRooms(roomsRes.data);
      setFeatures(featuresRes.data);
      setBuildings([...new Set(roomsRes.data.map(r => r.building))]);
    } catch (e: any) {
      toast.error(e.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async (roomId: string) => {
    const res = await getRoomAvailability(roomId);
    setAvailability(res.data);
  };

  const fetchAssignments = async (roomId: string) => {
    const res = await getRoomFeatureAssignments(roomId);
    setAssignments(res.data);
  };

  const handleSaveRoom = async () => {
    if (!roomForm.name || !roomForm.building || !roomForm.room_number) {
      toast.error('Name, building, and room number are required');
      return;
    }
    setSaving(true);
    const result = editingRoom ? await updateRoom(editingRoom.id, roomForm) : await createRoom(roomForm);
    setSaving(false);
    if (result.success) {
      toast.success(editingRoom ? 'Room updated' : 'Room created');
      setShowRoomModal(false);
      setEditingRoom(null);
      resetRoomForm();
      fetchData();
    } else {
      toast.error(result.error);
    }
  };

  const handleSaveFeature = async () => {
    if (!featureForm.name) {
      toast.error('Feature name is required');
      return;
    }
    setSaving(true);
    const result = editingFeature ? await updateRoomFeature(editingFeature.id, featureForm) : await createRoomFeature(featureForm);
    setSaving(false);
    if (result.success) {
      toast.success(editingFeature ? 'Feature updated' : 'Feature created');
      setShowFeatureModal(false);
      setEditingFeature(null);
      resetFeatureForm();
      fetchData();
    } else {
      toast.error(result.error);
    }
  };

  const handleSaveAvailability = async () => {
    if (!availabilityForm.room_id || !availabilityForm.start_datetime || !availabilityForm.end_datetime) {
      toast.error('Room and dates are required');
      return;
    }
    setSaving(true);
    const result = editingAvailability
      ? await updateRoomAvailability(editingAvailability.id, availabilityForm)
      : await createRoomAvailability(availabilityForm);
    setSaving(false);
    if (result.success) {
      toast.success(editingAvailability ? 'Availability updated' : 'Availability created');
      setShowAvailabilityModal(false);
      setEditingAvailability(null);
      resetAvailabilityForm();
      if (selectedRoomId) fetchAvailability(selectedRoomId);
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    let result;
    if (deleteConfirm.type === 'room') result = await deleteRoom(deleteConfirm.id);
    else if (deleteConfirm.type === 'feature') result = await deleteRoomFeature(deleteConfirm.id);
    else if (deleteConfirm.type === 'availability') result = await deleteRoomAvailability(deleteConfirm.id);
    if (result?.success) {
      toast.success('Deleted');
      setDeleteConfirm(null);
      if (deleteConfirm.type === 'availability' && selectedRoomId) fetchAvailability(selectedRoomId);
      else fetchData();
    } else {
      toast.error(result?.error || 'Failed to delete');
    }
  };

  const handleAssignFeature = async () => {
    if (!selectedRoomId) return;
    const featureName = prompt('Enter feature name to assign:');
    if (!featureName) return;
    const feature = features.find(f => f.name.toLowerCase() === featureName.toLowerCase());
    if (!feature) {
      toast.error('Feature not found');
      return;
    }
    const result = await assignRoomFeature(selectedRoomId, feature.id);
    if (result.success) {
      toast.success('Feature assigned');
      fetchAssignments(selectedRoomId);
    } else {
      toast.error(result.error);
    }
  };

  const openRoomModal = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setRoomForm({
        name: room.name, building: room.building, floor: room.floor || '', room_number: room.room_number,
        capacity: room.capacity, room_type: room.room_type, campus: room.campus, accessibility: room.accessibility,
        equipment: Array.isArray(room.equipment) ? room.equipment : [], status: room.status, notes: room.notes || '',
      });
    } else {
      setEditingRoom(null);
      resetRoomForm();
    }
    setShowRoomModal(true);
  };

  const openFeatureModal = (feature?: RoomFeature) => {
    if (feature) {
      setEditingFeature(feature);
      setFeatureForm({ name: feature.name, description: feature.description || '', category: feature.category });
    } else {
      setEditingFeature(null);
      resetFeatureForm();
    }
    setShowFeatureModal(true);
  };

  const openAvailabilityModal = (av?: RoomAvailability) => {
    if (av) {
      setEditingAvailability(av);
      setAvailabilityForm({
        room_id: av.room_id, block_type: av.block_type,
        start_datetime: av.start_datetime.slice(0, 16), end_datetime: av.end_datetime.slice(0, 16), reason: av.reason || '',
      });
    } else {
      setEditingAvailability(null);
      setAvailabilityForm({ room_id: selectedRoomId || '', block_type: 'MAINTENANCE', start_datetime: '', end_datetime: '', reason: '' });
    }
    setShowAvailabilityModal(true);
  };

  const openRoomManagement = (room: Room) => {
    setSelectedRoomId(room.id);
    setViewTab('features');
    fetchAvailability(room.id);
    fetchAssignments(room.id);
  };

  const resetRoomForm = () => {
    setRoomForm({ name: '', building: '', floor: '', room_number: '', capacity: 30, room_type: 'LECTURE_ROOM', campus: 'MAIN', accessibility: false, equipment: [], status: 'ACTIVE', notes: '' });
  };

  const resetFeatureForm = () => {
    setFeatureForm({ name: '', description: '', category: 'GENERAL' });
  };

  const resetAvailabilityForm = () => {
    setAvailabilityForm({ room_id: '', block_type: 'MAINTENANCE', start_datetime: '', end_datetime: '', reason: '' });
  };

  const roomColumns = [
    { key: 'name', header: 'Room', render: (r: Room) => (
      <div>
        <div className="font-bold text-neutral-900">{r.name}</div>
        <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{r.building} - {r.room_number}</div>
      </div>
    )},
    { key: 'floor', header: 'Floor', render: (r: Room) => r.floor || '—' },
    { key: 'type', header: 'Type', render: (r: Room) => <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-neutral-100 text-neutral-700">{r.room_type}</span> },
    { key: 'capacity', header: 'Capacity', render: (r: Room) => r.capacity },
    { key: 'campus', header: 'Campus', render: (r: Room) => r.campus },
    { key: 'accessibility', header: 'Accessible', render: (r: Room) => r.accessibility ? <StatusBadge status="ACTIVE" /> : <StatusBadge status="INACTIVE" /> },
    { key: 'status', header: 'Status', render: (r: Room) => <StatusBadge status={r.status} /> },
    { key: 'actions', header: 'Actions', render: (r: Room) => (
      <div className="flex justify-end gap-2">
        <button onClick={() => openRoomManagement(r)} className="p-1.5 hover:bg-neutral-100 rounded text-neutral-400 hover:text-black" title="Manage features & availability">
          <HugeiconsIcon icon={Door} size={14} strokeWidth={2.5} />
        </button>
        <button onClick={() => openRoomModal(r)} className="p-1.5 hover:bg-neutral-100 rounded text-neutral-400 hover:text-black">
          <HugeiconsIcon icon={Settings} size={14} strokeWidth={2.5} />
        </button>
        <button onClick={() => setDeleteConfirm({ type: 'room', id: r.id })} className="p-1.5 hover:bg-neutral-100 rounded text-neutral-400 hover:text-red-600">
          <HugeiconsIcon icon={Trash} size={14} strokeWidth={2.5} />
        </button>
      </div>
    )},
  ];

  const featureColumns = [
    { key: 'name', header: 'Feature', render: (f: RoomFeature) => (
      <div>
        <div className="font-bold text-neutral-900">{f.name}</div>
        <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{f.category}</div>
      </div>
    )},
    { key: 'description', header: 'Description', render: (f: RoomFeature) => f.description || '—' },
    { key: 'actions', header: 'Actions', render: (f: RoomFeature) => (
      <div className="flex justify-end gap-2">
        <button onClick={() => openFeatureModal(f)} className="p-1.5 hover:bg-neutral-100 rounded text-neutral-400 hover:text-black">
          <HugeiconsIcon icon={Settings} size={14} strokeWidth={2.5} />
        </button>
        <button onClick={() => setDeleteConfirm({ type: 'feature', id: f.id })} className="p-1.5 hover:bg-neutral-100 rounded text-neutral-400 hover:text-red-600">
          <HugeiconsIcon icon={Trash} size={14} strokeWidth={2.5} />
        </button>
      </div>
    )},
  ];

  const availabilityColumns = [
    { key: 'room', header: 'Room', render: (a: RoomAvailability) => {
      const room = rooms.find(r => r.id === a.room_id);
      return room ? `${room.name} (${room.building})` : '—';
    }},
    { key: 'block_type', header: 'Type', render: (a: RoomAvailability) => <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-neutral-100 text-neutral-700">{a.block_type}</span> },
    { key: 'start_datetime', header: 'Start', render: (a: RoomAvailability) => new Date(a.start_datetime).toLocaleString() },
    { key: 'end_datetime', header: 'End', render: (a: RoomAvailability) => new Date(a.end_datetime).toLocaleString() },
    { key: 'reason', header: 'Reason', render: (a: RoomAvailability) => a.reason || '—' },
    { key: 'actions', header: 'Actions', render: (a: RoomAvailability) => (
      <div className="flex justify-end gap-2">
        <button onClick={() => openAvailabilityModal(a)} className="p-1.5 hover:bg-neutral-100 rounded text-neutral-400 hover:text-black">
          <HugeiconsIcon icon={Settings} size={14} strokeWidth={2.5} />
        </button>
        <button onClick={() => setDeleteConfirm({ type: 'availability', id: a.id })} className="p-1.5 hover:bg-neutral-100 rounded text-neutral-400 hover:text-red-600">
          <HugeiconsIcon icon={Trash} size={14} strokeWidth={2.5} />
        </button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Room Management"
        subtitle="Configure rooms, features, and availability"
        actions={
          <div className="flex items-center gap-2">
            {viewTab === 'rooms' && (
              <button onClick={() => openRoomModal()} className="flex items-center gap-2 px-4 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800">
                <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> Add Room
              </button>
            )}
            {viewTab === 'features' && (
              <button onClick={() => openFeatureModal()} className="flex items-center gap-2 px-4 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800">
                <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> Add Feature
              </button>
            )}
            {viewTab === 'availability' && (
              <button onClick={() => openAvailabilityModal()} disabled={!selectedRoomId} className="flex items-center gap-2 px-4 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50">
                <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> Add Block
              </button>
            )}
          </div>
        }
      />

      <div className="flex gap-4 border-b border-neutral-200">
        {['rooms', 'features', 'availability'].map(tab => (
          <button key={tab} onClick={() => setViewTab(tab as any)} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${viewTab === tab ? 'border-[#9c27b3] text-[#9c27b3]' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <ActionToolbar
        search={
          <div className="flex flex-wrap items-center gap-3">
            <SearchBar value={search} onChange={setSearch} placeholder={`Search ${viewTab}...`} />
            {viewTab === 'rooms' && (
              <>
                <select value={buildingFilter} onChange={(e) => setBuildingFilter(e.target.value)} className="px-3 py-2 border border-neutral-200 rounded text-xs font-medium text-neutral-700 bg-white">
                  <option value="">All Buildings</option>
                  {buildings.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 border border-neutral-200 rounded text-xs font-medium text-neutral-700 bg-white">
                  <option value="">All Types</option>
                  {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-neutral-200 rounded text-xs font-medium text-neutral-700 bg-white">
                  <option value="">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="RETIRED">Retired</option>
                </select>
              </>
            )}
          </div>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
        </div>
      ) : (
        <>
          {viewTab === 'rooms' && (
            <DataTable columns={roomColumns} data={rooms} keyField="id" emptyMessage="No rooms found" />
          )}
          {viewTab === 'features' && (
            <DataTable columns={featureColumns} data={features} keyField="id" emptyMessage="No features found" />
          )}
          {viewTab === 'availability' && (
            <DataTable columns={availabilityColumns} data={availability} keyField="id" emptyMessage={selectedRoomId ? 'No availability blocks for this room' : 'Select a room to view availability'} />
          )}
        </>
      )}

      {/* Room Modal */}
      <Modal isOpen={showRoomModal} onClose={() => { setShowRoomModal(false); setEditingRoom(null); resetRoomForm(); }} title={editingRoom ? 'Edit Room' : 'New Room'} size="lg" footer={
        <div className="flex justify-end gap-3">
          <button onClick={() => { setShowRoomModal(false); setEditingRoom(null); resetRoomForm(); }} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-600 hover:text-black">Cancel</button>
          <button onClick={handleSaveRoom} disabled={saving} className="px-6 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Room'}
          </button>
        </div>
      }>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Name *</label>
            <input type="text" value={roomForm.name} onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Building *</label>
            <input type="text" value={roomForm.building} onChange={(e) => setRoomForm({ ...roomForm, building: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Room Number *</label>
            <input type="text" value={roomForm.room_number} onChange={(e) => setRoomForm({ ...roomForm, room_number: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Floor</label>
            <input type="text" value={roomForm.floor} onChange={(e) => setRoomForm({ ...roomForm, floor: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Capacity</label>
            <input type="number" value={roomForm.capacity} onChange={(e) => setRoomForm({ ...roomForm, capacity: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Room Type</label>
            <select value={roomForm.room_type} onChange={(e) => setRoomForm({ ...roomForm, room_type: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm">
              {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Campus</label>
            <input type="text" value={roomForm.campus} onChange={(e) => setRoomForm({ ...roomForm, campus: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Status</label>
            <select value={roomForm.status} onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm">
              <option value="ACTIVE">Active</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="RETIRED">Retired</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Notes</label>
            <textarea value={roomForm.notes} onChange={(e) => setRoomForm({ ...roomForm, notes: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" rows={2} />
          </div>
        </div>
      </Modal>

      {/* Feature Modal */}
      <Modal isOpen={showFeatureModal} onClose={() => { setShowFeatureModal(false); setEditingFeature(null); resetFeatureForm(); }} title={editingFeature ? 'Edit Feature' : 'New Feature'} size="md" footer={
        <div className="flex justify-end gap-3">
          <button onClick={() => { setShowFeatureModal(false); setEditingFeature(null); resetFeatureForm(); }} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-600 hover:text-black">Cancel</button>
          <button onClick={handleSaveFeature} disabled={saving} className="px-6 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Feature'}
          </button>
        </div>
      }>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Name *</label>
            <input type="text" value={featureForm.name} onChange={(e) => setFeatureForm({ ...featureForm, name: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Description</label>
            <textarea value={featureForm.description} onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" rows={2} />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Category</label>
            <select value={featureForm.category} onChange={(e) => setFeatureForm({ ...featureForm, category: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm">
              {['GENERAL', 'AV', 'COMPUTING', 'SCIENCE', 'MEDICAL', 'ACCESSIBILITY'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      {/* Availability Modal */}
      <Modal isOpen={showAvailabilityModal} onClose={() => { setShowAvailabilityModal(false); setEditingAvailability(null); resetAvailabilityForm(); }} title={editingAvailability ? 'Edit Availability Block' : 'New Availability Block'} size="md" footer={
        <div className="flex justify-end gap-3">
          <button onClick={() => { setShowAvailabilityModal(false); setEditingAvailability(null); resetAvailabilityForm(); }} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-600 hover:text-black">Cancel</button>
          <button onClick={handleSaveAvailability} disabled={saving} className="px-6 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Block'}
          </button>
        </div>
      }>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Room</label>
            <select value={availabilityForm.room_id} onChange={(e) => setAvailabilityForm({ ...availabilityForm, room_id: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm">
              <option value="">Select room</option>
              {rooms.map(r => <option key={r.id} value={r.id}>{r.name} ({r.building})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Block Type</label>
            <select value={availabilityForm.block_type} onChange={(e) => setAvailabilityForm({ ...availabilityForm, block_type: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm">
              {BLOCK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Start Date/Time</label>
            <input type="datetime-local" value={availabilityForm.start_datetime} onChange={(e) => setAvailabilityForm({ ...availabilityForm, start_datetime: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">End Date/Time</label>
            <input type="datetime-local" value={availabilityForm.end_datetime} onChange={(e) => setAvailabilityForm({ ...availabilityForm, end_datetime: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Reason</label>
            <input type="text" value={availabilityForm.reason} onChange={(e) => setAvailabilityForm({ ...availabilityForm, reason: e.target.value })} className="w-full px-3 py-2 border border-neutral-200 rounded text-sm" />
          </div>
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
