'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { OccupancySummary, WorkOrder, HomestayHost } from '@/types/housing';

// ─── Mini icon helpers ──────────────────────────────────────────────
const I = {
    Building:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 22V12h6v10M9 6h.01M15 6h.01M9 11h.01M15 11h.01"/></svg>,
    Tool:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
    Users:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5M22 20c0-3.31-2.69-6-6-6M1 20c0-3.31 2.69-6 6-6m0-3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>,
    Home:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    DollarSign:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    AlertTriangle:()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 3 22h18a2 2 0 0 0 1.73-4z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    CheckCircle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>,
    RefreshCw:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
};

type AdminTab = 'overview' | 'roster' | 'homestay' | 'maintenance' | 'suite_requests';

interface ApplicationRow {
    id: string;
    student_id: string;
    housing_type: string;
    status: string;
    academic_year: string;
    term: string | null;
    signed_at: string | null;
    building?: { name: string; code: string } | null;
    assigned_room?: { full_room_code: string; room_number: string } | null;
    homestay_host?: { host_name: string } | null;
    meal_plan?: { title: string } | null;
}

const TABS_ADMIN: { id: AdminTab; label: string }[] = [
    { id: 'overview',       label: '📊 Overview' },
    { id: 'roster',         label: '🛏️ Bed Roster' },
    { id: 'homestay',       label: '🏡 Homestay Hosts' },
    { id: 'maintenance',    label: '🔧 Maintenance Queue' },
    { id: 'suite_requests', label: '👫 Suite-Mate Requests' },
];

const urgencyColor = (u: string) => {
    if (u === 'emergency') return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (u === 'urgent')    return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    if (u === 'standard')  return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
    return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
};

const statusColor = (s: string) => {
    if (s === 'confirmed' || s === 'resolved' || s === 'closed') return 'bg-emerald-500/20 text-emerald-400';
    if (s === 'open' || s === 'draft' || s === 'submitted')      return 'bg-amber-500/20 text-amber-400';
    return 'bg-sky-500/20 text-sky-400';
};

export default function AdminHousingPage() {
    const supabase = createClient();
    const [activeTab, setActiveTab]   = useState<AdminTab>('overview');
    const [summary, setSummary]       = useState<OccupancySummary | null>(null);
    const [applications, setApplications] = useState<ApplicationRow[]>([]);
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [homestayHosts, setHomestayHosts] = useState<HomestayHost[]>([]);
    const [roommateProfiles, setRoommateProfiles] = useState<any[]>([]);
    const [loading, setLoading]       = useState(true);
    const [filter, setFilter]         = useState({ housing: 'all', status: 'all', urgency: 'all' });
    const [updatingWO, setUpdatingWO] = useState<string | null>(null);
    const [woEditForm, setWoEditForm] = useState<{ tech: string; notes: string }>({ tech: '', notes: '' });
    const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);
    const [toast, setToast]           = useState<string | null>(null);
    const [showHostModal, setShowHostModal] = useState(false);
    const [savingHost, setSavingHost] = useState(false);
    const [editingHost, setEditingHost] = useState<any>({
        id: '',
        host_name: '',
        host_family_description: '',
        address_city: 'Ottawa',
        distance_to_campus_km: 5.0,
        languages_spoken: ['English'],
        dietary_accommodations: [],
        max_students: 2,
        current_students: 0,
        price_per_week_minor: 35000,
        gender_policy: 'any',
        has_quiet_study_room: true,
        is_active: true,
    });

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

    const load = useCallback(async () => {
        setLoading(true);
        try {
            // Occupancy
            const occRes = await fetch('/api/housing/admin/occupancy');
            if (occRes.ok) { const d = await occRes.json(); setSummary(d.summary); }

            // Applications
            const { data: apps } = await supabase
                .from('housing_applications')
                .select('*, building:building_id(name, code), assigned_room:assigned_room_id(full_room_code, room_number), homestay_host:homestay_host_id(host_name), meal_plan:selected_meal_plan_id(title)')
                .order('created_at', { ascending: false })
                .limit(200);
            if (apps) setApplications(apps as ApplicationRow[]);

            // Work orders
            const woRes = await fetch('/api/housing/admin/work-orders');
            if (woRes.ok) { const d = await woRes.json(); setWorkOrders(d.orders ?? []); }

            // Homestay hosts
            const { data: hosts } = await supabase.from('homestay_hosts').select('*').order('distance_to_campus_km');
            if (hosts) setHomestayHosts(hosts as HomestayHost[]);

            // Roommate profiles with friend requests
            const { data: profiles } = await supabase
                .from('housing_roommate_profiles')
                .select('student_id, requested_friend_student_ids, gender_preference, floor_type_preference, dietary_needs')
                .not('requested_friend_student_ids', 'eq', '{}');
            if (profiles) setRoommateProfiles(profiles);

        } catch (e) { console.error('[Admin Housing] load error:', e); }
        finally { setLoading(false); }
    }, [supabase]);

    useEffect(() => { load(); }, [load]);

    const handleUpdateWO = async (orderId: string, status: string) => {
        setUpdatingWO(orderId);
        try {
            const res = await fetch('/api/housing/admin/work-orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status, assignedTechnician: woEditForm.tech, resolutionNotes: woEditForm.notes }),
            });
            if (res.ok) {
                const d = await res.json();
                setWorkOrders(prev => prev.map(w => w.id === orderId ? d.order : w));
                setSelectedWO(null);
                showToast(`Work order updated to "${status}"`);
            }
        } finally { setUpdatingWO(null); }
    };

    const handleSaveHost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingHost.host_name || !editingHost.address_city) {
            showToast('Host name and address city are required.');
            return;
        }
        setSavingHost(true);
        try {
            const res = await fetch('/api/housing/admin/homestay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingHost),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to save host');

            showToast(data.message || 'Homestay host saved successfully!');
            setShowHostModal(false);
            // Refresh list
            const refreshRes = await fetch('/api/housing/admin/homestay');
            if (refreshRes.ok) {
                const refreshed = await refreshRes.json();
                setHomestayHosts(refreshed.hosts || []);
            }
        } catch (err: any) {
            console.error('Save host error:', err);
            showToast(err.message || 'Failed to save homestay host.');
        } finally {
            setSavingHost(false);
        }
    };

    const filteredApps = applications.filter(a => {
        if (filter.housing !== 'all' && a.housing_type !== filter.housing) return false;
        if (filter.status  !== 'all' && a.status  !== filter.status)  return false;
        return true;
    });

    const filteredWOs = workOrders.filter(w => {
        if (filter.urgency !== 'all' && w.urgency !== filter.urgency) return false;
        if (filter.status  !== 'all' && w.status  !== filter.status)  return false;
        return true;
    });

    return (
        <div className="space-y-6">
            {/* Toast */}
            {toast && (
                <div className="fixed top-4 right-4 z-[9999] px-5 py-3 bg-emerald-600 rounded-xl shadow-2xl text-sm font-bold flex items-center gap-2">
                    <I.CheckCircle />{toast}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-black text-white tracking-tight">Housing & Residence Operations</h1>
                    <p className="text-slate-400 text-sm mt-0.5">2026/2027 Academic Year · Admin Control Centre</p>
                </div>
                <button onClick={load} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition">
                    <I.RefreshCw /> Refresh
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-white/5 overflow-x-auto">
                {TABS_ADMIN.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all ${activeTab === tab.id ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin w-8 h-8 border-2 border-sky-500/20 border-t-sky-500 rounded-full" />
                </div>
            ) : (
                <>
                    {/* ── OVERVIEW ── */}
                    {activeTab === 'overview' && summary && (
                        <div className="space-y-6">
                            {/* Metric cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'On-Campus Beds',    value: summary.total_beds,           sub: `${summary.available_beds} available`,       icon: <I.Building />, color: 'from-sky-600/20 to-blue-600/10' },
                                    { label: 'Occupancy Rate',    value: `${summary.occupancy_rate}%`, sub: `${summary.occupied_beds} / ${summary.total_beds} occupied`, icon: <I.Users />,   color: 'from-emerald-600/20 to-teal-600/10' },
                                    { label: 'Homestay Placed',   value: summary.homestay_placements,  sub: 'Active placements',                         icon: <I.Home />,    color: 'from-violet-600/20 to-purple-600/10' },
                                    { label: 'Deposits Collected',value: `$${summary.deposits_collected.toLocaleString('en-CA', { minimumFractionDigits: 0 })}`, sub: 'CAD housing deposits', icon: <I.DollarSign />, color: 'from-amber-600/20 to-orange-600/10' },
                                    { label: 'Open Work Orders',  value: summary.open_work_orders,     sub: `${summary.urgent_work_orders} urgent`,      icon: <I.Tool />,    color: 'from-rose-600/20 to-red-600/10' },
                                    { label: 'Maintenance Hold',  value: summary.maintenance_beds,     sub: 'Beds offline',                              icon: <I.AlertTriangle />, color: 'from-amber-600/20 to-yellow-600/10' },
                                    { label: 'Pending Apps',      value: summary.pending_applications, sub: 'Awaiting assignment',                       icon: <I.Users />,   color: 'from-indigo-600/20 to-blue-600/10' },
                                ].map(m => (
                                    <div key={m.label} className={`p-4 rounded-2xl bg-gradient-to-br ${m.color} border border-white/5`}>
                                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">{m.icon}{m.label}</div>
                                        <div className="text-2xl font-black text-white">{m.value}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{m.sub}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Per-building breakdown */}
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Building Breakdown</h2>
                                <div className="grid gap-3">
                                    {summary.buildings.map(b => {
                                        const pct = b.total_beds > 0 ? Math.round((b.occupied / b.total_beds) * 100) : 0;
                                        return (
                                            <div key={b.id} className="p-4 bg-white/3 border border-white/5 rounded-xl">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="font-bold text-sm text-white">{b.name}</div>
                                                    <div className="flex gap-3 text-xs text-slate-400">
                                                        <span className="text-emerald-400">{b.available} avail</span>
                                                        <span className="text-rose-400">{b.occupied} occ</span>
                                                        {b.maintenance > 0 && <span className="text-amber-400">{b.maintenance} maint</span>}
                                                    </div>
                                                </div>
                                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                                </div>
                                                <div className="text-[10px] text-slate-500 mt-1">{pct}% occupied</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── BED ROSTER ── */}
                    {activeTab === 'roster' && (
                        <div className="space-y-4">
                            {/* Filters */}
                            <div className="flex flex-wrap gap-2">
                                <select value={filter.housing} onChange={e => setFilter(p => ({ ...p, housing: e.target.value }))}
                                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none">
                                    <option value="all">All Housing Types</option>
                                    <option value="on_campus">On-Campus</option>
                                    <option value="homestay">Homestay</option>
                                </select>
                                <select value={filter.status} onChange={e => setFilter(p => ({ ...p, status: e.target.value }))}
                                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none">
                                    <option value="all">All Statuses</option>
                                    <option value="room_selected">Room Selected</option>
                                    <option value="contract_signed">Contract Signed</option>
                                    <option value="deposit_paid">Deposit Paid</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <div className="ml-auto text-xs text-slate-500 self-center">{filteredApps.length} record{filteredApps.length !== 1 ? 's' : ''}</div>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-white/5">
                                <table className="w-full text-xs">
                                    <thead className="bg-white/5 border-b border-white/5">
                                        <tr>
                                            {['Student ID','Type','Placement','Meal Plan','Term','Status','Signed'].map(h => (
                                                <th key={h} className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredApps.length === 0 ? (
                                            <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">No records found</td></tr>
                                        ) : filteredApps.map(a => (
                                            <tr key={a.id} className="hover:bg-white/3 transition">
                                                <td className="px-3 py-2.5 font-mono text-slate-400">{a.student_id.slice(0, 12)}…</td>
                                                <td className="px-3 py-2.5">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${a.housing_type === 'homestay' ? 'bg-violet-500/20 text-violet-300' : 'bg-sky-500/20 text-sky-300'}`}>
                                                        {a.housing_type === 'homestay' ? '🏡 Homestay' : '🏫 On-Campus'}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2.5 font-bold text-white">
                                                    {a.housing_type === 'homestay'
                                                        ? (a.homestay_host?.host_name ?? '—')
                                                        : (a.assigned_room?.full_room_code ?? (a.building ? `${a.building.code} (unassigned)` : '—'))}
                                                </td>
                                                <td className="px-3 py-2.5 text-slate-400">{a.meal_plan?.title ? a.meal_plan.title.split(' ').slice(0, 2).join(' ') + '...' : '—'}</td>
                                                <td className="px-3 py-2.5 text-slate-500">{a.term?.replace('_', ' ') ?? '—'}</td>
                                                <td className="px-3 py-2.5">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColor(a.status)}`}>
                                                        {a.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2.5 text-slate-500">
                                                    {a.signed_at ? new Date(a.signed_at).toLocaleDateString('en-CA') : '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ── HOMESTAY HOSTS ── */}
                    {activeTab === 'homestay' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Active Homestay Hosts ({homestayHosts.length})</h2>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingHost({
                                            id: '',
                                            host_name: '',
                                            host_family_description: '',
                                            address_city: 'Ottawa',
                                            distance_to_campus_km: 4.5,
                                            languages_spoken: ['English'],
                                            dietary_accommodations: ['Halal', 'Vegetarian'],
                                            max_students: 2,
                                            current_students: 0,
                                            price_per_week_minor: 35000,
                                            gender_policy: 'any',
                                            has_quiet_study_room: true,
                                            is_active: true,
                                        });
                                        setShowHostModal(true);
                                    }}
                                    className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 rounded-lg text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                                >
                                    <span>+ Add New Host</span>
                                </button>
                            </div>

                            <div className="grid gap-4">
                                {homestayHosts.map(h => (
                                    <div key={h.id} className="p-5 bg-white/3 border border-white/5 rounded-2xl hover:border-white/15 transition-all">
                                        <div className="flex items-start justify-between flex-wrap gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 flex-wrap mb-1">
                                                    <span className="font-bold text-white text-base">{h.host_name}</span>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${h.gender_policy === 'any' ? 'bg-purple-500/20 text-purple-300' : h.gender_policy === 'female_only' ? 'bg-pink-500/20 text-pink-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                                        {h.gender_policy === 'any' ? 'Co-Ed' : h.gender_policy === 'female_only' ? 'Female Only' : 'Male Only'}
                                                    </span>
                                                    {h.has_quiet_study_room && <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-bold">📚 Quiet Study</span>}
                                                    {!h.is_active && <span className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded-full text-[10px] font-bold">Inactive</span>}
                                                </div>
                                                <p className="text-slate-400 text-xs mb-2 leading-relaxed line-clamp-2">{h.host_family_description}</p>
                                                <div className="flex flex-wrap gap-2 text-[11px]">
                                                    <span className="text-slate-500">📍 {h.address_city} · {h.distance_to_campus_km} km</span>
                                                    {h.dietary_accommodations.map(d => (
                                                        <span key={d} className="px-2 py-0.5 bg-green-500/10 text-green-400 rounded">{d.charAt(0).toUpperCase() + d.slice(1)} ✓</span>
                                                    ))}
                                                    {h.languages_spoken.map(l => (
                                                        <span key={l} className="px-2 py-0.5 bg-white/5 text-slate-400 rounded">{l}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0 space-y-1.5">
                                                <div className="text-lg font-black text-sky-300">${(h.price_per_week_minor / 100).toLocaleString()}/wk</div>
                                                <div className="text-xs text-slate-400">Capacity: {h.current_students ?? 0} / {h.max_students}</div>
                                                <div className={`text-xs font-bold ${(h.max_students - (h.current_students ?? 0)) > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {(h.max_students - (h.current_students ?? 0)) > 0
                                                        ? `${h.max_students - (h.current_students ?? 0)} spot${h.max_students - (h.current_students ?? 0) !== 1 ? 's' : ''} open`
                                                        : 'Full'}
                                                </div>
                                                <div className="flex items-center justify-end gap-2 pt-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingHost({
                                                                ...h,
                                                                languages_spoken: h.languages_spoken || ['English'],
                                                                dietary_accommodations: h.dietary_accommodations || [],
                                                            });
                                                            setShowHostModal(true);
                                                        }}
                                                        className="px-2.5 py-1 bg-sky-600/20 border border-sky-500/30 rounded-lg text-[11px] font-bold text-sky-300 hover:bg-sky-600/30 transition cursor-pointer"
                                                    >
                                                        Edit Details
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={async () => {
                                                            if (!confirm(`Are you sure you want to remove host "${h.host_name}"?`)) return;
                                                            try {
                                                                const res = await fetch(`/api/housing/admin/homestay?id=${h.id}`, { method: 'DELETE' });
                                                                if (res.ok) {
                                                                    setHomestayHosts(prev => prev.filter(x => x.id !== h.id));
                                                                    showToast(`Host "${h.host_name}" deleted.`);
                                                                } else {
                                                                    showToast('Failed to delete host.');
                                                                }
                                                            } catch (err) {
                                                                showToast('Error deleting host.');
                                                            }
                                                        }}
                                                        className="px-2.5 py-1 bg-red-600/20 border border-red-500/30 rounded-lg text-[11px] font-bold text-red-300 hover:bg-red-600/30 transition cursor-pointer"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── MAINTENANCE QUEUE ── */}
                    {activeTab === 'maintenance' && (
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2 items-center">
                                <select value={filter.urgency} onChange={e => setFilter(p => ({ ...p, urgency: e.target.value }))}
                                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none">
                                    <option value="all">All Urgencies</option>
                                    <option value="emergency">Emergency</option>
                                    <option value="urgent">Urgent</option>
                                    <option value="standard">Standard</option>
                                    <option value="low">Low</option>
                                </select>
                                <select value={filter.status} onChange={e => setFilter(p => ({ ...p, status: e.target.value }))}
                                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none">
                                    <option value="all">All Statuses</option>
                                    <option value="open">Open</option>
                                    <option value="assigned">Assigned</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                                <div className="ml-auto text-xs text-slate-500">{filteredWOs.length} ticket{filteredWOs.length !== 1 ? 's' : ''}</div>
                            </div>

                            <div className="space-y-3">
                                {filteredWOs.length === 0 ? (
                                    <div className="text-center py-12 text-slate-500 text-sm bg-white/3 rounded-2xl border border-white/5">No work orders match the selected filters.</div>
                                ) : filteredWOs.map(wo => (
                                    <div key={wo.id} className="p-4 bg-white/3 border border-white/5 rounded-xl">
                                        <div className="flex items-start justify-between gap-4 flex-wrap">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <span className="font-mono text-xs font-black text-white">{wo.ticket_number}</span>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${urgencyColor(wo.urgency)}`}>{wo.urgency.toUpperCase()}</span>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColor(wo.status)}`}>{wo.status.replace('_', ' ')}</span>
                                                </div>
                                                <div className="text-xs text-slate-400 capitalize mb-1">{wo.category.replace('_', ' ')} — {(wo.room as any)?.full_room_code ?? 'Unknown Room'}</div>
                                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{wo.description}</p>
                                                {wo.assigned_technician && <div className="text-xs text-sky-400 mt-1">Assigned: {wo.assigned_technician}</div>}
                                            </div>
                                            <div className="flex flex-col gap-1.5 shrink-0">
                                                <div className="text-[10px] text-slate-600">{new Date(wo.created_at).toLocaleDateString('en-CA')}</div>
                                                {wo.status !== 'resolved' && wo.status !== 'closed' && (
                                                    <button onClick={() => { setSelectedWO(wo); setWoEditForm({ tech: wo.assigned_technician ?? '', notes: '' }); }}
                                                        className="px-3 py-1 bg-sky-600/20 border border-sky-500/30 rounded-lg text-[10px] font-bold text-sky-400 hover:bg-sky-600/30 transition">
                                                        Update
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Inline update panel */}
                                        {selectedWO?.id === wo.id && (
                                            <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                                                <input type="text" placeholder="Assign technician name" value={woEditForm.tech}
                                                    onChange={e => setWoEditForm(p => ({ ...p, tech: e.target.value }))}
                                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs placeholder:text-slate-600 focus:outline-none focus:border-sky-500" />
                                                <input type="text" placeholder="Resolution notes (optional)" value={woEditForm.notes}
                                                    onChange={e => setWoEditForm(p => ({ ...p, notes: e.target.value }))}
                                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs placeholder:text-slate-600 focus:outline-none focus:border-sky-500" />
                                                <div className="flex gap-2">
                                                    {[['assigned','Assign'],['in_progress','In Progress'],['resolved','Mark Resolved'],['closed','Close']].map(([s, l]) => (
                                                        <button key={s} disabled={updatingWO === wo.id}
                                                            onClick={() => handleUpdateWO(wo.id, s)}
                                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition ${s === 'resolved' || s === 'closed' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-sky-600 hover:bg-sky-500'} disabled:opacity-50`}>
                                                            {updatingWO === wo.id ? '...' : l}
                                                        </button>
                                                    ))}
                                                    <button onClick={() => setSelectedWO(null)} className="px-3 py-1.5 bg-white/5 rounded-lg text-[10px] font-bold text-slate-400 hover:bg-white/10">Cancel</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── SUITE-MATE REQUESTS ── */}
                    {activeTab === 'suite_requests' && (
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">Suite-Mate Friend Requests</h2>
                                <p className="text-slate-500 text-xs">Students who have requested specific friends as suite-mates. Both must list each other to confirm.</p>
                            </div>

                            {roommateProfiles.length === 0 ? (
                                <div className="text-center py-12 text-slate-500 text-sm bg-white/3 rounded-2xl border border-white/5">No suite-mate requests submitted yet.</div>
                            ) : (
                                <div className="space-y-3">
                                    {roommateProfiles.map(p => {
                                        const mutuals = roommateProfiles.filter(other =>
                                            other.student_id !== p.student_id &&
                                            (other.requested_friend_student_ids ?? []).includes(p.student_id)
                                        );
                                        return (
                                            <div key={p.student_id} className="p-4 bg-white/3 border border-white/5 rounded-xl">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <div className="font-mono text-xs text-slate-300 mb-1">{p.student_id.slice(0,20)}…</div>
                                                        <div className="text-xs text-slate-500 mb-2">
                                                            Requesting: {(p.requested_friend_student_ids ?? []).map((id: string) => id.slice(0,12) + '…').join(', ')}
                                                        </div>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.gender_preference !== 'any' ? 'bg-sky-500/20 text-sky-300' : 'bg-white/5 text-slate-400'}`}>
                                                                {p.gender_preference !== 'any' ? p.gender_preference.replace('_', ' ') : 'Any gender'}
                                                            </span>
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.floor_type_preference !== 'any' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/5 text-slate-400'}`}>
                                                                {p.floor_type_preference !== 'any' ? p.floor_type_preference.replace('_', ' ') + ' floor' : 'Any floor type'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {mutuals.length > 0 ? (
                                                            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold">
                                                                ✓ {mutuals.length} Mutual Match{mutuals.length !== 1 ? 'es' : ''}
                                                            </span>
                                                        ) : (
                                                            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-[10px] font-bold">
                                                                ⏳ Pending
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* ── ADD / EDIT HOMESTAY HOST MODAL ── */}
            {showHostModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowHostModal(false)} />
                    <div className="relative bg-[#0d1f2e] border border-white/15 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl z-10 text-slate-200">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                            <div>
                                <h3 className="font-extrabold text-lg text-white">
                                    {editingHost.id ? `Edit Host: ${editingHost.host_name}` : 'Add New Homestay Host'}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">Configure host family profile, policies, pricing, and dietary support.</p>
                            </div>
                            <button onClick={() => setShowHostModal(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSaveHost} className="space-y-4 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">Host Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={editingHost.host_name || ''}
                                        onChange={e => setEditingHost({ ...editingHost, host_name: e.target.value })}
                                        placeholder="e.g. The Morrison Family"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">Address / City *</label>
                                    <input
                                        type="text"
                                        required
                                        value={editingHost.address_city || ''}
                                        onChange={e => setEditingHost({ ...editingHost, address_city: e.target.value })}
                                        placeholder="e.g. Ottawa"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">Host Family Description & Amenities</label>
                                <textarea
                                    rows={3}
                                    value={editingHost.host_family_description || ''}
                                    onChange={e => setEditingHost({ ...editingHost, host_family_description: e.target.value })}
                                    placeholder="Describe the family, home environment, room setup, meals provided..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">Distance to Campus (km)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        value={editingHost.distance_to_campus_km ?? 3.5}
                                        onChange={e => setEditingHost({ ...editingHost, distance_to_campus_km: parseFloat(e.target.value) || 0 })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">Price Per Week (CAD $)</label>
                                    <input
                                        type="number"
                                        step="5"
                                        min="50"
                                        value={Math.round((editingHost.price_per_week_minor || 35000) / 100)}
                                        onChange={e => setEditingHost({ ...editingHost, price_per_week_minor: (parseInt(e.target.value, 10) || 350) * 100 })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">Gender Policy</label>
                                    <select
                                        value={editingHost.gender_policy || 'any'}
                                        onChange={e => setEditingHost({ ...editingHost, gender_policy: e.target.value })}
                                        className="w-full bg-[#0a151a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                                    >
                                        <option value="any">Co-Ed (Any Gender)</option>
                                        <option value="female_only">Female Students Only</option>
                                        <option value="male_only">Male Students Only</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">Max Student Capacity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={editingHost.max_students ?? 2}
                                        onChange={e => setEditingHost({ ...editingHost, max_students: parseInt(e.target.value, 10) || 1 })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">Currently Placed Students</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max={editingHost.max_students ?? 10}
                                        value={editingHost.current_students ?? 0}
                                        onChange={e => setEditingHost({ ...editingHost, current_students: parseInt(e.target.value, 10) || 0 })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">Languages Spoken (comma separated)</label>
                                <input
                                    type="text"
                                    value={Array.isArray(editingHost.languages_spoken) ? editingHost.languages_spoken.join(', ') : (editingHost.languages_spoken || '')}
                                    onChange={e => setEditingHost({ ...editingHost, languages_spoken: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                    placeholder="e.g. English, French, Spanish"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                                />
                            </div>

                            <div>
                                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1.5">Dietary Accommodations (select / toggle)</label>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {['Halal', 'Vegetarian', 'Vegan', 'Kosher', 'Gluten-Free', 'Nut Allergy Safe', 'Dairy-Free'].map(diet => {
                                        const key = diet.toLowerCase().replace('-', '_').replace(' ', '_');
                                        const isSelected = (editingHost.dietary_accommodations || []).map((x: string) => x.toLowerCase().replace('-', '_').replace(' ', '_')).includes(key);
                                        return (
                                            <button
                                                key={diet}
                                                type="button"
                                                onClick={() => {
                                                    const cur: string[] = editingHost.dietary_accommodations || [];
                                                    if (isSelected) {
                                                        setEditingHost({
                                                            ...editingHost,
                                                            dietary_accommodations: cur.filter(x => x.toLowerCase().replace('-', '_').replace(' ', '_') !== key),
                                                        });
                                                    } else {
                                                        setEditingHost({
                                                            ...editingHost,
                                                            dietary_accommodations: [...cur, key],
                                                        });
                                                    }
                                                }}
                                                className={`px-3 py-1.5 rounded-lg font-bold transition text-xs cursor-pointer ${isSelected ? 'bg-green-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                                            >
                                                {diet} {isSelected ? '✓' : '+'}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center gap-6 pt-2 pb-2">
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={!!editingHost.has_quiet_study_room}
                                        onChange={e => setEditingHost({ ...editingHost, has_quiet_study_room: e.target.checked })}
                                        className="w-4 h-4 accent-sky-500 rounded"
                                    />
                                    <span className="font-semibold text-slate-300">Dedicated Quiet Study Room</span>
                                </label>
                                <label className="flex items-center gap-2.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editingHost.is_active !== false}
                                        onChange={e => setEditingHost({ ...editingHost, is_active: e.target.checked })}
                                        className="w-4 h-4 accent-sky-500 rounded"
                                    />
                                    <span className="font-semibold text-slate-300">Host Listing is Active</span>
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setShowHostModal(false)}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-slate-300 text-xs transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingHost}
                                    className="px-6 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 rounded-xl font-bold text-white text-xs transition cursor-pointer shadow-md"
                                >
                                    {savingHost ? 'Saving...' : (editingHost.id ? 'Update Host' : 'Create Host')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}