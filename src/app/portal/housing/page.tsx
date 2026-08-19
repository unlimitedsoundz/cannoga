'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import type {
    ResidenceBuilding, ResidenceRoom, MealPlan, HomestayHost,
    RoommateProfile, HousingApplication, WorkOrder, HousingType,
    GenderPreference, FloorTypePreference,
} from '@/types/housing';

// ─── Icons (inline SVG to avoid import issues) ───────────────────
const Icons = {
    Building:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 22V12h6v10M9 6h.01M15 6h.01M9 11h.01M15 11h.01"/></svg>,
    Bed:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M2 3v18M2 16h20v4M22 11v9M2 8h20v3M5 8V5h4v3M15 8V5h4v3"/></svg>,
    Users:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5M22 20c0-3.31-2.69-6-6-6M1 20c0-3.31 2.69-6 6-6m0-3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>,
    Utensils:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>,
    FileText:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>,
    Home:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    CheckCircle:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>,
    AlertTriangle:()=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 3 22h18a2 2 0 0 0 1.73-4z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    MapPin:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    Star:       () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    Wifi:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>,
    Tool:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
    Plus:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    X:          () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    Key:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/></svg>,
};

// ─── Format helpers ────────────────────────────────────────────────
const fmtCAD = (minor: number) => `$${(minor / 100).toLocaleString('en-CA', { minimumFractionDigits: 0 })} CAD`;
const fmtWeekly = (minor: number) => `$${(minor / 100).toLocaleString('en-CA', { minimumFractionDigits: 0 })}/week`;

// ─── Status Badge ─────────────────────────────────────────────────
function RoomStatusBadge({ status }: { status: string }) {
    const cfg: Record<string, { bg: string; text: string; label: string }> = {
        AVAILABLE:   { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Available' },
        OCCUPIED:    { bg: 'bg-rose-500/20',    text: 'text-rose-400',    label: 'Occupied' },
        MAINTENANCE: { bg: 'bg-amber-500/20',   text: 'text-amber-400',   label: 'Maintenance' },
        reserved:    { bg: 'bg-sky-500/20',     text: 'text-sky-400',     label: 'Reserved' },
    };
    const c = cfg[status] ?? { bg: 'bg-slate-500/20', text: 'text-slate-400', label: status };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${c.bg} ${c.text}`}>
            {c.label}
        </span>
    );
}

// ─── Compatibility Ring ───────────────────────────────────────────
function CompatibilityRing({ score }: { score: number }) {
    const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
    const r = 20; const circ = 2 * Math.PI * r;
    const dash = (score / 100) * circ;
    return (
        <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r={r} fill="none" stroke="#ffffff10" strokeWidth="4" />
                <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="4"
                    strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
            </svg>
            <span className="text-xs font-black" style={{ color }}>{score}%</span>
        </div>
    );
}

// ─── Tab definitions ──────────────────────────────────────────────
const TABS = [
    { id: 'residence', label: 'Residence Halls', icon: Icons.Building },
    { id: 'preferences', label: 'Preferences', icon: Icons.Users },
    { id: 'meals', label: 'Meal Plans', icon: Icons.Utensils },
    { id: 'contract', label: 'Agreement & Deposit', icon: Icons.FileText },
    { id: 'hub', label: 'Resident Hub', icon: Icons.Home },
] as const;
type TabId = typeof TABS[number]['id'];

// ─── DIETARY OPTIONS ─────────────────────────────────────────────
const DIETARY_OPTIONS = ['Vegan', 'Vegetarian', 'Halal', 'Kosher', 'Gluten-Free', 'Nut Allergy', 'Dairy-Free', 'Other'];

// ─── MAIN PAGE ────────────────────────────────────────────────────
export default function HousingPortalPage() {
    const supabase = createClient();
    const [activeTab, setActiveTab]         = useState<TabId>('residence');
    const [buildings, setBuildings]         = useState<ResidenceBuilding[]>([]);
    const [selectedBuilding, setSelectedBuilding] = useState<ResidenceBuilding | null>(null);
    const [rooms, setRooms]                 = useState<ResidenceRoom[]>([]);
    const [selectedRoom, setSelectedRoom]   = useState<ResidenceRoom | null>(null);
    const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
    const [homestayHosts, setHomestayHosts] = useState<HomestayHost[]>([]);
    const [selectedHost, setSelectedHost]   = useState<HomestayHost | null>(null);
    const [housingType, setHousingType]     = useState<HousingType>('on_campus');
    const [mealPlans, setMealPlans]         = useState<MealPlan[]>([]);
    const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null);
    const [myProfile, setMyProfile]         = useState<Partial<RoommateProfile>>({});
    const [matches, setMatches]             = useState<RoommateProfile[]>([]);
    const [workOrders, setWorkOrders]       = useState<WorkOrder[]>([]);
    const [application, setApplication]     = useState<HousingApplication | null>(null);
    const [loading, setLoading]             = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [reserving, setReserving]         = useState(false);
    const [signing, setSigning]             = useState(false);
    const [showWOModal, setShowWOModal]     = useState(false);
    const [signatureName, setSignatureName] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [toast, setToast]                 = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [friendIds, setFriendIds]         = useState<string[]>(['', '', '']);
    const [woForm, setWoForm]               = useState({ category: 'other', urgency: 'standard', description: '' });

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    // ── Load initial data ──────────────────────────────────────────
    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                const [buildingsRes, mealRes, homestayRes] = await Promise.all([
                    fetch('/api/housing/buildings'),
                    fetch('/api/housing/rooms?buildingId=PLACEHOLDER').catch(() => null),
                    fetch('/api/housing/homestay'),
                ]);

                const bData = await buildingsRes.json();
                if (bData.buildings) setBuildings(bData.buildings);

                const hData = await homestayRes.json();
                if (hData.hosts) setHomestayHosts(hData.hosts);

                // Fetch meal plans directly from Supabase
                const { data: plans } = await supabase.from('residence_meal_plans').select('*').eq('is_active', true);
                if (plans) setMealPlans(plans as MealPlan[]);

                // Fetch own profile
                const profileRes = await fetch('/api/housing/roommate-profile');
                const pData = await profileRes.json();
                if (pData.profile) setMyProfile(pData.profile);

                // Fetch own work orders
                const woRes = await fetch('/api/housing/work-orders');
                const woData = await woRes.json();
                if (woData.orders) setWorkOrders(woData.orders);

                // Fetch current housing application
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: app } = await supabase
                        .from('housing_applications')
                        .select('*, building:building_id(*), assigned_room:assigned_room_id(*), meal_plan:selected_meal_plan_id(*), homestay_host:homestay_host_id(*)')
                        .eq('student_id', user.id)
                        .eq('academic_year', '2026/2027')
                        .maybeSingle();
                    if (app) setApplication(app as HousingApplication);
                }
            } catch (e) {
                console.error('Housing init error', e);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    // ── Load rooms when building selected ─────────────────────────
    const loadRooms = useCallback(async (building: ResidenceBuilding, floor?: number) => {
        setSelectedBuilding(building);
        setSelectedRoom(null);
        const url = `/api/housing/rooms?buildingId=${building.id}${floor ? `&floor=${floor}` : ''}`;
        const res = await fetch(url);
        const data = await res.json();
        setRooms(data.rooms ?? []);
        if (!floor && data.byFloor) {
            const firstFloor = Object.keys(data.byFloor).sort()[0];
            setSelectedFloor(firstFloor ? parseInt(firstFloor) : null);
        }
    }, []);

    // ── Load matches ───────────────────────────────────────────────
    const loadMatches = useCallback(async () => {
        const res = await fetch('/api/housing/roommate-matches');
        const data = await res.json();
        setMatches(data.matches ?? []);
    }, []);

    // ── Reserve room / homestay ────────────────────────────────────
    const handleReserve = async () => {
        if (housingType === 'on_campus' && !selectedRoom) { showToast('Please select a bed first', 'error'); return; }
        if (housingType === 'homestay' && !selectedHost) { showToast('Please select a homestay host first', 'error'); return; }
        setReserving(true);
        try {
            const res = await fetch('/api/housing/reserve-room', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roomId:         selectedRoom?.id,
                    term:           'fall_winter',
                    academicYear:   '2026/2027',
                    housingType,
                    homestayHostId: selectedHost?.id,
                }),
            });
            const data = await res.json();
            if (!res.ok) { showToast(data.error ?? 'Failed to reserve', 'error'); return; }
            setApplication(data.application);
            showToast(housingType === 'homestay' ? `Homestay application submitted with ${selectedHost!.host_name}!` : `${selectedRoom!.full_room_code} reserved! Proceed to sign your contract.`);
            setActiveTab('contract');
        } finally { setReserving(false); }
    };

    // ── Save lifestyle profile ─────────────────────────────────────
    const handleSaveProfile = async () => {
        if (!myProfile.sleep_schedule || !myProfile.study_habits || !myProfile.cleanliness_rating || !myProfile.guest_preference) {
            showToast('Please fill all required preference fields', 'error'); return;
        }
        setSavingProfile(true);
        try {
            const res = await fetch('/api/housing/roommate-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...myProfile,
                    requested_friend_student_ids: friendIds.filter(Boolean),
                }),
            });
            const data = await res.json();
            if (!res.ok) { showToast(data.error ?? 'Failed to save', 'error'); return; }
            setMyProfile(data.profile);
            showToast('Preferences saved! Finding your matches...');
            await loadMatches();
        } finally { setSavingProfile(false); }
    };

    // ── Sign contract ──────────────────────────────────────────────
    const handleSignContract = async () => {
        if (!signatureName.trim() || !agreedToTerms) { showToast('Please enter your full name and agree to the terms', 'error'); return; }
        if (!application) { showToast('No active housing application found', 'error'); return; }
        setSigning(true);
        try {
            const res = await fetch('/api/housing/sign-contract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    applicationId:    application.id,
                    signatureName:    signatureName.trim(),
                    mealPlanId:       selectedMealPlan?.id ?? null,
                    moveInDate:       '2026-09-02',
                    moveOutDate:      '2027-04-30',
                }),
            });
            const data = await res.json();
            if (!res.ok) { showToast(data.error ?? 'Failed to sign', 'error'); return; }
            setApplication(data.application);
            showToast('Contract signed! Your $500 deposit invoice has been generated.');
        } finally { setSigning(false); }
    };

    // ── Submit work order ──────────────────────────────────────────
    const handleSubmitWO = async () => {
        if (!woForm.description || woForm.description.trim().length < 10) { showToast('Please provide a more detailed description', 'error'); return; }
        try {
            const res = await fetch('/api/housing/work-orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...woForm,
                    roomId: application?.assigned_room_id,
                }),
            });
            const data = await res.json();
            if (!res.ok) { showToast(data.error ?? 'Failed to submit', 'error'); return; }
            setWorkOrders(prev => [data.order, ...prev]);
            setWoForm({ category: 'other', urgency: 'standard', description: '' });
            setShowWOModal(false);
            showToast(`Work order ${data.ticketNumber} submitted successfully`);
        } catch (e) { showToast('Error submitting work order', 'error'); }
    };

    const floors = selectedBuilding
        ? [...new Set(rooms.map(r => r.floor_number ?? 1))].sort()
        : [];

    const displayedRooms = selectedFloor
        ? rooms.filter(r => (r.floor_number ?? 1) === selectedFloor)
        : rooms;

    // ─────────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#0a0f1a] text-slate-100 font-sans">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-[9999] px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold animate-bounce-in flex items-center gap-2.5 ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                    {toast.type === 'success' ? <Icons.CheckCircle /> : <Icons.AlertTriangle />}
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-[#0f1f35] via-[#0d2240] to-[#0f1f35] border-b border-white/5 px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg">
                            <Icons.Building />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">Student Housing & Residence Life</h1>
                            <p className="text-slate-400 text-sm">2026/2027 Academic Year · Cannoga College</p>
                        </div>
                    </div>
                    {application && (
                        <div className="mt-4 px-4 py-2.5 bg-sky-600/10 border border-sky-500/20 rounded-xl text-xs text-sky-300 flex items-center gap-2">
                            <Icons.CheckCircle />
                            <span>
                                {application.housing_type === 'homestay'
                                    ? `Homestay application active · Status: ${application.status.replace('_', ' ')}`
                                    : `${(application.assigned_room as any)?.full_room_code ?? 'Room selected'} · Status: ${application.status.replace('_', ' ')}`}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex gap-1 border-b border-white/5 overflow-x-auto scrollbar-hide pt-2">
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${
                                    activeTab === tab.id
                                        ? 'border-sky-500 text-sky-400'
                                        : 'border-transparent text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                <Icon />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div className="py-8">
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <div className="animate-spin w-10 h-10 border-2 border-sky-500/20 border-t-sky-500 rounded-full" />
                        </div>
                    ) : (
                        <>
                            {/* ── TAB 1: RESIDENCE HALLS ── */}
                            {activeTab === 'residence' && (
                                <div className="space-y-8">
                                    {/* Housing type selector */}
                                    <div className="flex gap-3">
                                        {(['on_campus', 'homestay'] as HousingType[]).map(t => (
                                            <button key={t} onClick={() => { setHousingType(t); setSelectedBuilding(null); setSelectedRoom(null); setSelectedHost(null); }}
                                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border transition-all ${housingType === t ? 'bg-sky-600 border-sky-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                                                {t === 'on_campus' ? 'On-Campus Residence' : 'Homestay (Host Family)'}
                                            </button>
                                        ))}
                                    </div>

                                    {housingType === 'on_campus' ? (
                                        <>
                                            {/* Building cards */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {buildings.filter(b => b.code !== null).map(b => (
                                                    <button key={b.id} onClick={() => loadRooms(b)}
                                                        className={`text-left p-5 rounded-2xl border transition-all ${selectedBuilding?.id === b.id ? 'bg-sky-900/30 border-sky-500' : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'}`}>
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div>
                                                                <h3 className="font-bold text-base">{b.name}</h3>
                                                                <p className="text-slate-400 text-xs mt-0.5">{b.campus_location}</p>
                                                            </div>
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${(b.available_beds ?? 0) > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                                                {b.available_beds ?? '?'} beds open
                                                            </span>
                                                        </div>
                                                        {b.description && <p className="text-slate-500 text-xs leading-relaxed mb-3 line-clamp-2">{b.description}</p>}
                                                        <div className="flex flex-wrap gap-1">
                                                            {(b.services ?? []).slice(0, 4).map(s => (
                                                                <span key={s} className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-slate-400">{s}</span>
                                                            ))}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Floor plan / bed picker */}
                                            {selectedBuilding && (
                                                <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="font-bold text-base">{selectedBuilding.name} — Bed Picker</h3>
                                                        <div className="flex gap-2">
                                                            {floors.map(f => (
                                                                <button key={f} onClick={() => { setSelectedFloor(f); }}
                                                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${selectedFloor === f ? 'bg-sky-600 text-white' : 'bg-white/10 text-slate-400 hover:bg-white/15'}`}>
                                                                    Floor {f}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Legend */}
                                                    <div className="flex gap-4 mb-4">
                                                        {[['AVAILABLE','bg-emerald-500/20 border-emerald-500/50 text-emerald-400'],['OCCUPIED','bg-rose-500/20 border-rose-500/30 text-rose-400'],['MAINTENANCE','bg-amber-500/20 border-amber-500/30 text-amber-400']].map(([s,c]) => (
                                                            <div key={s} className="flex items-center gap-1.5">
                                                                <div className={`w-3 h-3 rounded border ${c}`} />
                                                                <span className="text-xs text-slate-500">{s.charAt(0) + s.slice(1).toLowerCase()}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Room grid */}
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                                        {displayedRooms.map(room => {
                                                            const isSelected = selectedRoom?.id === room.id;
                                                            const isAvail = room.status === 'AVAILABLE';
                                                            return (
                                                                <button
                                                                    key={room.id}
                                                                    disabled={!isAvail}
                                                                    onClick={() => isAvail && setSelectedRoom(isSelected ? null : room)}
                                                                    className={`p-3 rounded-xl border text-left transition-all ${
                                                                        isSelected ? 'bg-sky-600/30 border-sky-500 shadow-lg shadow-sky-500/20'
                                                                        : room.status === 'AVAILABLE' ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20 cursor-pointer'
                                                                        : room.status === 'MAINTENANCE' ? 'bg-amber-500/10 border-amber-500/20 opacity-60 cursor-not-allowed'
                                                                        : 'bg-rose-500/10 border-rose-500/20 opacity-50 cursor-not-allowed'
                                                                    }`}
                                                                >
                                                                    <div className="text-xs font-black">{room.bed_identifier ? `${room.suite_number}-${room.bed_identifier}` : room.room_number}</div>
                                                                    <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{room.window_orientation}</div>
                                                                    {room.price_per_term_minor && (
                                                                        <div className="text-[10px] font-bold text-sky-400 mt-1">{fmtCAD(room.price_per_term_minor)}/term</div>
                                                                    )}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Selection summary */}
                                                    {selectedRoom && (
                                                        <div className="mt-5 p-4 bg-sky-900/30 border border-sky-500/30 rounded-xl flex items-center justify-between">
                                                            <div>
                                                                <div className="font-bold text-sm">{selectedRoom.full_room_code ?? selectedRoom.room_number}</div>
                                                                <div className="text-xs text-slate-400 mt-0.5">{selectedRoom.room_type_label ?? selectedRoom.room_type} · {selectedRoom.window_orientation}</div>
                                                                {selectedRoom.price_per_term_minor && (
                                                                    <div className="text-sm font-black text-sky-300 mt-1">{fmtCAD(selectedRoom.price_per_term_minor)}/term</div>
                                                                )}
                                                            </div>
                                                            <button onClick={handleReserve} disabled={reserving}
                                                                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 rounded-xl text-sm font-bold transition-all">
                                                                {reserving ? 'Reserving...' : 'Reserve This Bed →'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        /* HOMESTAY LISTINGS */
                                        <div className="space-y-4">
                                            <p className="text-slate-400 text-sm">Host families vetted and approved by Cannoga College International Student Services.</p>
                                            {homestayHosts.map(host => (
                                                <div key={host.id} onClick={() => setSelectedHost(selectedHost?.id === host.id ? null : host)}
                                                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedHost?.id === host.id ? 'bg-sky-900/30 border-sky-500' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                                                    <div className="flex items-start justify-between flex-wrap gap-3">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                                <h3 className="font-bold text-base">{host.host_name}</h3>
                                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${host.gender_policy === 'any' ? 'bg-purple-500/20 text-purple-300' : host.gender_policy === 'female_only' ? 'bg-pink-500/20 text-pink-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                                                    {host.gender_policy === 'any' ? 'Co-Ed Welcome' : host.gender_policy === 'female_only' ? 'Female Students Only' : 'Male Students Only'}
                                                                </span>
                                                                {host.has_quiet_study_room && (
                                                                     <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300">Quiet Study Room</span>
                                                                )}
                                                                {(host.spots_available ?? 0) > 0 ? (
                                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">{host.spots_available} spot{host.spots_available !== 1 ? 's' : ''} available</span>
                                                                ) : (
                                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400">Full</span>
                                                                )}
                                                            </div>
                                                            <p className="text-slate-400 text-xs leading-relaxed mb-3">{host.host_family_description}</p>
                                                            <div className="flex flex-wrap gap-2 text-[11px]">
                                                                <span className="flex items-center gap-1 text-slate-500"><Icons.MapPin />{host.address_city} · {host.distance_to_campus_km} km to campus</span>
                                                                {host.languages_spoken.map(l => (
                                                                    <span key={l} className="px-2 py-0.5 bg-white/5 rounded text-slate-400">{l}</span>
                                                                ))}
                                                                {host.dietary_accommodations.map(d => (
                                                                    <span key={d} className="px-2 py-0.5 bg-green-500/10 text-green-400 rounded">{d.charAt(0).toUpperCase() + d.slice(1)} ✓</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <div className="text-xl font-black text-sky-300">{fmtWeekly(host.price_per_week_minor)}</div>
                                                            <div className="text-xs text-slate-500">All-inclusive</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {selectedHost && (
                                                <div className="p-4 bg-sky-900/30 border border-sky-500/30 rounded-xl flex items-center justify-between">
                                                    <div>
                                                        <div className="font-bold text-sm">{selectedHost.host_name} selected</div>
                                                        <div className="text-xs text-slate-400 mt-0.5">{selectedHost.address_city} · {fmtWeekly(selectedHost.price_per_week_minor)}</div>
                                                    </div>
                                                    <button onClick={handleReserve} disabled={reserving || (selectedHost.spots_available ?? 0) === 0}
                                                        className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 rounded-xl text-sm font-bold transition-all">
                                                        {reserving ? 'Applying...' : 'Apply for Homestay →'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── TAB 2: PREFERENCES & ROOMMATE MATCHING ── */}
                            {activeTab === 'preferences' && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Questionnaire */}
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-lg font-black mb-1">Lifestyle & Preferences</h2>
                                            <p className="text-slate-400 text-sm">This helps us find you the best roommate and room matches.</p>
                                        </div>

                                        {/* Sleep schedule */}
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Sleep Schedule</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[['early', 'Early Bird'],['moderate', 'Moderate'],['night', 'Night Owl']].map(([v, l]) => (
                                                    <button key={v} onClick={() => setMyProfile(p => ({ ...p, sleep_schedule: v as any }))}
                                                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${myProfile.sleep_schedule === v ? 'bg-sky-600 border-sky-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                                                        {l}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Study habits */}
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Study Habits</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[['silent','Silent'],['music','Background Music'],['social','Social / Group']].map(([v, l]) => (
                                                    <button key={v} onClick={() => setMyProfile(p => ({ ...p, study_habits: v as any }))}
                                                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${myProfile.study_habits === v ? 'bg-sky-600 border-sky-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                                                        {l}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Cleanliness */}
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                                Cleanliness — {myProfile.cleanliness_rating ?? 3}/5
                                            </label>
                                            <input type="range" min={1} max={5} step={1}
                                                value={myProfile.cleanliness_rating ?? 3}
                                                onChange={e => setMyProfile(p => ({ ...p, cleanliness_rating: parseInt(e.target.value) as any }))}
                                                className="w-full accent-sky-500" />
                                            <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                                                <span>Relaxed</span><span>Very Tidy</span>
                                            </div>
                                        </div>

                                        {/* Guest preference */}
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Guest Policy</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[['rarely','Rarely'],['advance_notice','Advance Notice'],['frequent','Frequently']].map(([v, l]) => (
                                                    <button key={v} onClick={() => setMyProfile(p => ({ ...p, guest_preference: v as any }))}
                                                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${myProfile.guest_preference === v ? 'bg-sky-600 border-sky-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                                                        {l}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Gender / Floor preference */}
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Gender / Floor Preference</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[['any','Any'],['same_gender','Same-Gender Floor'],['co_ed','Co-Ed Floor']].map(([v, l]) => (
                                                    <button key={v} onClick={() => setMyProfile(p => ({ ...p, gender_preference: v as GenderPreference }))}
                                                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${myProfile.gender_preference === v ? 'bg-sky-600 border-sky-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                                                        {l}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Floor type */}
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Floor Environment</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[['quiet_study','Quiet Study'],['social','Social'],['any','No Preference']].map(([v, l]) => (
                                                    <button key={v} onClick={() => setMyProfile(p => ({ ...p, floor_type_preference: v as FloorTypePreference }))}
                                                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${myProfile.floor_type_preference === v ? 'bg-sky-600 border-sky-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                                                        {l}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Dietary needs */}
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Dietary Needs (select all that apply)</label>
                                            <div className="flex flex-wrap gap-2">
                                                {DIETARY_OPTIONS.map(opt => {
                                                    const key = opt.toLowerCase().replace(' ', '_');
                                                    const isSelected = (myProfile.dietary_needs ?? []).includes(key);
                                                    return (
                                                        <button key={key}
                                                            onClick={() => setMyProfile(p => ({
                                                                ...p,
                                                                dietary_needs: isSelected
                                                                    ? (p.dietary_needs ?? []).filter(d => d !== key)
                                                                    : [...(p.dietary_needs ?? []), key],
                                                            }))}
                                                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${isSelected ? 'bg-green-600 border-green-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                                                            {opt}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Friend / suite-mate requests */}
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Request Specific Suite-Mates</label>
                                            <p className="text-slate-500 text-xs mb-2">Enter up to 3 Student IDs. Both students must list each other for confirmation.</p>
                                            <div className="space-y-2">
                                                {friendIds.map((fid, idx) => (
                                                    <input key={idx} type="text" placeholder={`Student ID #${idx + 1} (e.g. CC-2026-0001)`}
                                                        value={fid}
                                                        onChange={e => setFriendIds(prev => prev.map((p, i) => i === idx ? e.target.value : p))}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition" />
                                                ))}
                                            </div>
                                        </div>

                                        <button onClick={handleSaveProfile} disabled={savingProfile}
                                            className="w-full py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 rounded-xl font-bold text-sm transition-all">
                                            {savingProfile ? 'Saving...' : 'Save Preferences & Find Matches'}
                                        </button>
                                    </div>

                                    {/* Matches */}
                                    <div>
                                        <h2 className="text-lg font-black mb-1">Roommate Matches</h2>
                                        <p className="text-slate-400 text-sm mb-4">Based on your lifestyle profile compatibility.</p>
                                        {matches.length === 0 ? (
                                            <div className="text-center py-12 text-slate-500 text-sm bg-white/3 rounded-2xl border border-white/5">
                                                <Icons.Users />
                                                <p className="mt-2">Save your preferences to see matches</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {matches.map(m => (
                                                    <div key={m.student_id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                                        <CompatibilityRing score={m.compatibility_score ?? 0} />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-bold text-sm">{m.display_name ?? `Student ···${m.student_id.slice(-4)}`}</div>
                                                            <div className="text-xs text-slate-500 mt-0.5">
                                                                {m.sleep_schedule} · {m.study_habits} · Cleanliness {m.cleanliness_rating}/5
                                                            </div>
                                                            <div className="text-xs text-slate-500">
                                                                {m.gender_preference !== 'any' && `${m.gender_preference.replace('_', ' ')} floor`}
                                                                {m.floor_type_preference !== 'any' && ` · ${m.floor_type_preference.replace('_', ' ')} environment`}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => setFriendIds(prev => { const copy = [...prev]; const empty = copy.findIndex(f => !f); if (empty !== -1) copy[empty] = m.student_id; return copy; })}
                                                            className="px-3 py-1.5 bg-sky-600/20 border border-sky-500/30 rounded-lg text-xs font-bold text-sky-400 hover:bg-sky-600/30 transition">
                                                            Request
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ── TAB 3: MEAL PLANS ── */}
                            {activeTab === 'meals' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-lg font-black mb-1">Campus Meal Plans</h2>
                                        <p className="text-slate-400 text-sm">Meal plans are added to your housing contract. Select the best option for you.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        {mealPlans.map((plan, idx) => {
                                            const colors = ['from-sky-600 to-blue-700', 'from-violet-600 to-purple-700', 'from-emerald-600 to-teal-700'];
                                            const isSelected = selectedMealPlan?.id === plan.id;
                                            return (
                                                <div key={plan.id} className={`relative rounded-2xl border overflow-hidden transition-all ${isSelected ? 'border-sky-500 shadow-lg shadow-sky-500/20' : 'border-white/10'}`}>
                                                    <div className={`bg-gradient-to-br ${colors[idx % 3]} p-5`}>
                                                        {idx === 0 && <div className="absolute top-3 right-3 px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-bold">Best Value</div>}
                                                        <h3 className="font-black text-base leading-tight">{plan.title}</h3>
                                                        <div className="text-2xl font-black mt-2">{fmtCAD(plan.price_per_term_minor)}<span className="text-sm font-normal opacity-70">/term</span></div>
                                                        {plan.flex_dollars_minor > 0 && (
                                                            <div className="text-xs opacity-80 mt-1">+ {fmtCAD(plan.flex_dollars_minor)} Flex Dollars</div>
                                                        )}
                                                    </div>
                                                    <div className="p-4 bg-white/5">
                                                        <p className="text-slate-400 text-xs leading-relaxed mb-4">{plan.description}</p>
                                                        {plan.meals_per_week && <div className="text-xs text-slate-500 mb-3">{plan.meals_per_week} meals/week</div>}
                                                        <button onClick={() => setSelectedMealPlan(isSelected ? null : plan)}
                                                            className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${isSelected ? 'bg-sky-600' : 'bg-white/10 hover:bg-white/15'}`}>
                                                            {isSelected ? '✓ Selected' : 'Add to Contract'}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs">
                                        <strong>Note:</strong> The Unlimited 7-Day plan is recommended for Maple Hall and Laurentian Suites residents. The Declining Balance Plan is ideal for Pacific Townhouse and Homestay students who have kitchen access.
                                    </div>
                                </div>
                            )}

                            {/* ── TAB 4: OCCUPANCY AGREEMENT & DEPOSIT ── */}
                            {activeTab === 'contract' && (
                                <div className="max-w-3xl space-y-8">
                                    <div>
                                        <h2 className="text-lg font-black mb-1">Residence Occupancy Agreement</h2>
                                        <p className="text-slate-400 text-sm">Read the full agreement below, then sign electronically to proceed with your $500 CAD security deposit.</p>
                                    </div>

                                    {!application ? (
                                        <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-300 text-sm">
                                            <Icons.AlertTriangle />
                                            <p className="mt-2">No housing selection found. Please complete <strong>Tab 1</strong> to select a room or homestay first.</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Contract text */}
                                            <div className="bg-white/3 border border-white/10 rounded-2xl p-6 max-h-64 overflow-y-auto text-xs text-slate-400 leading-relaxed space-y-3">
                                                <p className="font-bold text-slate-200 text-sm">CANNOGA COLLEGE — RESIDENCE OCCUPANCY LICENSE & COMMUNITY STANDARDS AGREEMENT</p>
                                                <p>This agreement is entered into between Cannoga College ("the College") and the undersigned student ("the Resident") for the academic year 2026/2027. This license grants the Resident the right to occupy the assigned residence space on a non-exclusive basis, subject to the terms and conditions outlined herein.</p>
                                                <p><strong className="text-slate-300">1. TERM OF OCCUPANCY:</strong> The occupancy period commences September 2, 2026 and concludes April 30, 2027. Early move-out does not entitle the Resident to a refund of housing fees.</p>
                                                <p><strong className="text-slate-300">2. HOUSING FEES & DEPOSIT:</strong> A non-refundable $500.00 CAD Housing Security Deposit is required within 7 days of signing this agreement to confirm the reservation. Full housing fees are due no later than August 1, 2026. Failure to pay by the due date may result in cancellation of the housing assignment.</p>
                                                <p><strong className="text-slate-300">3. COMMUNITY STANDARDS:</strong> Residents agree to respect quiet hours (11:00 PM – 7:00 AM), maintain cleanliness in shared spaces, and adhere to the Cannoga College Code of Conduct. Noise complaints, substance violations, or damage to property may result in immediate removal from residence.</p>
                                                <p><strong className="text-slate-300">4. GUEST POLICY:</strong> Overnight guests are permitted for a maximum of 3 consecutive nights and 10 nights per semester. All guests must be registered through the Resident Hub. The Resident is fully responsible for the conduct of their guests.</p>
                                                <p><strong className="text-slate-300">5. PROPERTY CARE:</strong> The Resident accepts the room in its current condition as documented in the Move-In Inspection Checklist. Any damage beyond normal wear and tear will be charged to the Resident's account.</p>
                                                <p><strong className="text-slate-300">6. TERMINATION:</strong> The College reserves the right to terminate this license agreement in the event of a violation of community standards, non-payment of fees, or other conduct detrimental to the residence community.</p>
                                                <p><strong className="text-slate-300">7. LIABILITY:</strong> Cannoga College is not responsible for loss or damage to Resident's personal property. Students are encouraged to obtain tenant's insurance.</p>
                                                <p className="text-slate-500">By signing below, the Resident confirms they have read, understood, and agreed to all terms of this Residence Occupancy License & Community Standards Agreement.</p>
                                            </div>

                                            {/* Application summary */}
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="p-3 bg-white/5 rounded-xl">
                                                    <div className="text-xs text-slate-500 mb-1">Housing Type</div>
                                                    <div className="font-bold">{application.housing_type === 'homestay' ? 'Homestay' : 'On-Campus'}</div>
                                                </div>
                                                <div className="p-3 bg-white/5 rounded-xl">
                                                    <div className="text-xs text-slate-500 mb-1">Placement</div>
                                                    <div className="font-bold">{(application.assigned_room as any)?.full_room_code ?? (application.homestay_host as any)?.host_name ?? '—'}</div>
                                                </div>
                                                <div className="p-3 bg-white/5 rounded-xl">
                                                    <div className="text-xs text-slate-500 mb-1">Meal Plan</div>
                                                    <div className="font-bold">{selectedMealPlan?.title ?? 'None selected'}</div>
                                                </div>
                                                <div className="p-3 bg-white/5 rounded-xl">
                                                    <div className="text-xs text-slate-500 mb-1">Security Deposit</div>
                                                    <div className="font-black text-sky-400">$500.00 CAD</div>
                                                </div>
                                            </div>

                                            {/* Signature */}
                                            {application.status !== 'contract_signed' && application.status !== 'deposit_paid' && application.status !== 'confirmed' ? (
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Full Legal Name (as it appears on government ID)</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter your full legal name..."
                                                            value={signatureName}
                                                            onChange={e => setSignatureName(e.target.value)}
                                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition font-medium"
                                                        />
                                                    </div>
                                                    <label className="flex items-start gap-3 cursor-pointer">
                                                        <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} className="mt-0.5 accent-sky-500" />
                                                        <span className="text-sm text-slate-400">I have read and agree to the Residence Occupancy License & Community Standards Agreement. I understand that a $500 CAD deposit is required to confirm my housing placement.</span>
                                                    </label>
                                                    <button onClick={handleSignContract} disabled={signing || !signatureName || !agreedToTerms}
                                                        className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 rounded-xl font-black text-sm transition-all">
                                                        {signing ? 'Signing contract...' : 'Sign Contract & Generate $500 Deposit Invoice'}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                                                    <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                                                        <Icons.CheckCircle /> Contract Signed
                                                    </div>
                                                    <p className="text-slate-400 text-sm">Signed by <strong className="text-slate-200">{application.signature_name}</strong> on {application.signed_at ? new Date(application.signed_at).toLocaleString('en-CA') : '—'}.</p>
                                                    <p className="text-slate-400 text-sm mt-2">Your $500 CAD deposit invoice has been generated. Please proceed to your <a href="/portal/payments" className="text-sky-400 underline">Payments Portal</a> to complete payment via Wire Transfer, Interac, or other available methods.</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}

                            {/* ── TAB 5: RESIDENT HUB ── */}
                            {activeTab === 'hub' && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-lg font-black mb-1">Resident Hub</h2>
                                        <p className="text-slate-400 text-sm">Your residence services, maintenance, and guest management.</p>
                                    </div>

                                    {!application || !['contract_signed','deposit_paid','confirmed'].includes(application.status) ? (
                                        <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-300 text-sm">
                                            Complete your housing application and sign the occupancy agreement to access Resident Hub features.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Room assignment card */}
                                            <div className="p-5 bg-gradient-to-br from-sky-900/40 to-blue-900/30 border border-sky-500/20 rounded-2xl">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Icons.Key />
                                                    <h3 className="font-bold">Your Placement</h3>
                                                </div>
                                                {application.housing_type === 'homestay' ? (
                                                    <div className="space-y-2">
                                                        <div><span className="text-xs text-slate-400">Host Family</span><div className="font-bold">{(application.homestay_host as any)?.host_name ?? '—'}</div></div>
                                                        <div><span className="text-xs text-slate-400">Address</span><div className="font-bold">{(application.homestay_host as any)?.address_city ?? '—'}</div></div>
                                                        <div><span className="text-xs text-slate-400">Move-In Date</span><div className="font-bold">{application.move_in_date ?? '—'}</div></div>
                                                        <div className="pt-2"><span className="text-xs text-slate-400">Contact Residence Life for host family contact details.</span></div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <div><span className="text-xs text-slate-400">Room Code</span><div className="font-bold text-lg">{(application.assigned_room as any)?.full_room_code ?? '—'}</div></div>
                                                        <div><span className="text-xs text-slate-400">Building</span><div className="font-bold">{(application.building as any)?.name ?? '—'}</div></div>
                                                        <div><span className="text-xs text-slate-400">Move-In Date</span><div className="font-bold">{application.move_in_date ?? '—'}</div></div>
                                                        <div className="mt-3 px-3 py-2 bg-black/30 rounded-lg font-mono text-xs text-sky-400">
                                                            Digital Keycard: CANNOGA-{application.id.slice(0,8).toUpperCase()}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Work Orders — on-campus only */}
                                            {application.housing_type === 'on_campus' && (
                                                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <Icons.Tool />
                                                            <h3 className="font-bold">Maintenance Requests</h3>
                                                        </div>
                                                        <button onClick={() => setShowWOModal(true)}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-sky-600 rounded-lg text-xs font-bold transition hover:bg-sky-500">
                                                            <Icons.Plus /> New Request
                                                        </button>
                                                    </div>
                                                    {workOrders.length === 0 ? (
                                                        <div className="text-center py-8 text-slate-500 text-xs">No maintenance requests yet</div>
                                                    ) : (
                                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                                            {workOrders.map(wo => (
                                                                <div key={wo.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg text-xs">
                                                                    <div>
                                                                        <div className="font-bold font-mono">{wo.ticket_number}</div>
                                                                        <div className="text-slate-500 mt-0.5 capitalize">{wo.category.replace('_', ' ')} · {wo.urgency}</div>
                                                                    </div>
                                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${wo.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : wo.status === 'open' ? 'bg-amber-500/20 text-amber-400' : 'bg-sky-500/20 text-sky-400'}`}>
                                                                        {wo.status.replace('_', ' ')}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Move-in checklist */}
                                            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                                                <h3 className="font-bold mb-3">Move-In Inspection Checklist</h3>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['Desk','Mattress','Closet','Window','Smoke Detector','Heating'].map(item => (
                                                        <div key={item} className="flex items-center gap-2 text-xs">
                                                            <span className="text-emerald-400">✓</span>
                                                            <span className="text-slate-400">{item}</span>
                                                            <span className="ml-auto text-slate-600">Good</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-3 text-xs text-slate-500">Report any discrepancies within 24 hours of move-in via Maintenance Request.</div>
                                            </div>

                                            {/* Guest pass registration */}
                                            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                                                <h3 className="font-bold mb-3">Guest Pass Registration</h3>
                                                <p className="text-xs text-slate-400 mb-4">Register overnight guests (max 3 consecutive nights, 10/semester).</p>
                                                <div className="space-y-2">
                                                    <input type="text" placeholder="Guest Full Name" className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs placeholder:text-slate-600 focus:outline-none focus:border-sky-500" />
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <input type="date" className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500" />
                                                        <input type="date" className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500" />
                                                    </div>
                                                    <button className="w-full py-2 bg-sky-600/20 border border-sky-500/30 rounded-lg text-xs font-bold text-sky-400 hover:bg-sky-600/30 transition">Register Guest</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Work Order Modal */}
            {showWOModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowWOModal(false)} />
                    <div className="relative bg-[#0d1f2e] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-black text-base">New Maintenance Request</h3>
                            <button onClick={() => setShowWOModal(false)} className="p-1 hover:text-red-400 transition"><Icons.X /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
                                <select value={woForm.category} onChange={e => setWoForm(p => ({ ...p, category: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-500">
                                    <option value="heating_ac">Heating / AC</option>
                                    <option value="plumbing">Plumbing</option>
                                    <option value="electrical">Electrical</option>
                                    <option value="furniture_locks">Furniture / Locks</option>
                                    <option value="internet">Internet / WiFi</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Urgency</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[['low','Low'],['standard','Standard'],['urgent','Urgent'],['emergency','Emergency']].map(([v,l]) => (
                                        <button key={v} onClick={() => setWoForm(p => ({ ...p, urgency: v }))}
                                            className={`py-2 rounded-lg text-xs font-bold border transition ${woForm.urgency === v
                                                ? v === 'emergency' ? 'bg-red-600 border-red-500'
                                                : v === 'urgent' ? 'bg-amber-600 border-amber-500'
                                                : 'bg-sky-600 border-sky-500'
                                                : 'bg-white/5 border-white/10'}`}>
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                                <textarea value={woForm.description} onChange={e => setWoForm(p => ({ ...p, description: e.target.value }))}
                                    placeholder="Please describe the issue in detail..."
                                    rows={4}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm placeholder:text-slate-600 focus:outline-none focus:border-sky-500 resize-none" />
                            </div>
                            <button onClick={handleSubmitWO}
                                className="w-full py-3 bg-sky-600 hover:bg-sky-500 rounded-xl font-bold text-sm transition-all">
                                Submit Work Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
