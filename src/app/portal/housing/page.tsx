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
    const [studentInfo, setStudentInfo]     = useState<{ name: string; id: string } | null>(null);

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

                // Fetch current housing application & user details
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const studentNum = user.user_metadata?.student_id || user.id.slice(0, 8).toUpperCase();
                    const studentName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Student';
                    setStudentInfo({ name: studentName, id: `CC-2026-${studentNum}` });

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
    // RENDER
    // ─────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-[9999] px-5 py-3 rounded-xl shadow-xl text-sm font-semibold animate-bounce-in flex items-center gap-2.5 ${toast.type === 'success' ? 'bg-slate-900 text-white' : 'bg-rose-600 text-white'}`}>
                    {toast.type === 'success' ? <Icons.CheckCircle /> : <Icons.AlertTriangle />}
                    {toast.msg}
                </div>
            )}

            {/* Top Navigation Bar with Logo */}
            <div className="bg-white border-b border-slate-200 px-4 lg:px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <a href="/sis" title="Return to Student Information System" className="hover:opacity-80 transition-opacity">
                            <img
                                src="/images/logo-cannoga.png"
                                alt="Cannoga College"
                                className="h-9 w-auto object-contain"
                            />
                        </a>
                        <div className="h-6 w-px bg-slate-200 hidden sm:block" />
                        <span className="text-xs font-bold text-slate-800 hidden sm:inline">Student Housing & Residence Portal</span>
                    </div>

                    <a href="/sis" className="text-xs font-bold text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-lg">
                        <span>←</span> Back to SIS
                    </a>
                </div>
            </div>

            {/* SIS Dashboard-Style Hero Banner */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 pb-2">
                <div className="relative rounded-2xl overflow-hidden bg-[#0a151a] text-white min-h-[220px] sm:min-h-[260px] flex items-end p-6 sm:p-8 shadow-sm">
                    <img
                        src="/images/home-carousel-3.png"
                        alt="Cannoga College campus residence"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a151a] via-[#0a151a]/60 to-transparent" />
                    
                    <div className="relative z-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                                Your Home in Ontario
                            </h1>
                            <p className="text-slate-200 text-xs sm:text-sm mt-2 leading-relaxed">
                                All residences include all-inclusive utilities (hydro, heating, high-speed Wi-Fi), 24/7 keycard security, on-duty Residence Life Dons (RAs), study spaces, and laundry facilities.
                            </p>
                            
                            {/* Key Housing Highlights */}
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-xs sm:text-sm font-bold text-white">
                                <span className="flex items-center gap-1.5 text-emerald-300">
                                    <span>✓</span> 5-Min Walk to Lecture Halls
                                </span>
                                <span className="flex items-center gap-1.5 text-emerald-300">
                                    <span>✓</span> Snow-Free Tunnel Access
                                </span>
                                <span className="flex items-center gap-1.5 text-emerald-300">
                                    <span>✓</span> All Utilities Included
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 bg-[#0a151a]/90 backdrop-blur-md p-3.5 rounded-xl border border-white/10 self-start md:self-auto shadow-lg shrink-0">
                            <div>
                                <p className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">Student ID</p>
                                <p className="text-xs font-bold text-white">{studentInfo?.id ?? 'CC-2026-STUDENT'}</p>
                            </div>
                            <div className="h-7 w-px bg-white/20" />
                            <div>
                                <p className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">Housing Status</p>
                                <p className="text-xs font-bold text-white capitalize">
                                    {application ? application.status.replace('_', ' ') : 'Not Applied'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <div className="flex gap-1 border-b border-slate-200 overflow-x-auto scrollbar-hide pt-2">
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${
                                    activeTab === tab.id
                                        ? 'border-slate-900 text-slate-900'
                                        : 'border-transparent text-slate-400 hover:text-slate-700'
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
                            <div className="animate-spin w-10 h-10 border-2 border-slate-200 border-t-slate-800 rounded-full" />
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
                                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${housingType === t ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                                {t === 'on_campus' ? 'On-Campus Residence' : 'Homestay (Host Family)'}
                                            </button>
                                        ))}
                                    </div>

                                    {housingType === 'on_campus' ? (
                                        <>
                                            {/* Vibrant Academic-Style Building Cards */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {buildings.filter(b => b.code !== null).map((b, idx) => {
                                                    const PALETTES = [
                                                        { bg: 'bg-[#4f46e5]', border: 'border-[#4f46e5]', wave: '#3730a3', text: 'text-indigo-100', badge: 'bg-[#3730a3]' },
                                                        { bg: 'bg-[#059669]', border: 'border-[#059669]', wave: '#064e3b', text: 'text-emerald-100', badge: 'bg-[#064e3b]' },
                                                        { bg: 'bg-[#ea580c]', border: 'border-[#ea580c]', wave: '#7c2d12', text: 'text-orange-100', badge: 'bg-[#7c2d12]' },
                                                        { bg: 'bg-[#0284c7]', border: 'border-[#0284c7]', wave: '#075985', text: 'text-sky-100', badge: 'bg-[#075985]' },
                                                        { bg: 'bg-[#7c3aed]', border: 'border-[#7c3aed]', wave: '#4c1d95', text: 'text-purple-100', badge: 'bg-[#4c1d95]' },
                                                    ];
                                                    const palette = PALETTES[idx % PALETTES.length];
                                                    const isSelected = selectedBuilding?.id === b.id;

                                                    // Default vibrant photo fallback if none uploaded
                                                    const defaultImage = idx === 0 
                                                        ? '/images/studies-hero.jpg' 
                                                        : idx === 1 
                                                        ? '/images/technology.jpg' 
                                                        : '/images/school-of-science-hero.jpg';
                                                    const buildingImage = b.image_url || defaultImage;

                                                    return (
                                                        <div key={b.id} className="flex flex-col">
                                                            <button
                                                                onClick={() => loadRooms(b)}
                                                                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl ${palette.bg} ${palette.border} border-4 transition-all duration-200 group overflow-hidden shadow-md flex flex-col justify-between ${isSelected ? 'ring-4 ring-slate-900 ring-offset-2' : ''}`}
                                                            >
                                                                {/* Top Image with Organic Wavy Cutout */}
                                                                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-black/20">
                                                                    <img
                                                                        src={buildingImage}
                                                                        alt={b.name}
                                                                        className="w-full h-full object-cover"
                                                                    />

                                                                    {/* Bed status pill badge top right */}
                                                                    <div className="absolute top-3 right-3 z-20">
                                                                        <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wide text-white shadow-md backdrop-blur-md ${palette.badge}`}>
                                                                            {b.available_beds ?? 0} BEDS OPEN
                                                                        </span>
                                                                    </div>

                                                                    {/* Location tag top left */}
                                                                    <div className="absolute top-3 left-3 z-20">
                                                                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white bg-black/50 backdrop-blur-md">
                                                                            {b.campus_location}
                                                                        </span>
                                                                    </div>

                                                                    {/* Organic Wavy Bottom Edge */}
                                                                    <div className="absolute bottom-[-10px] left-0 right-0 h-14 overflow-hidden leading-none z-10 pointer-events-none">
                                                                        <svg
                                                                            viewBox="0 0 1440 200"
                                                                            preserveAspectRatio="none"
                                                                            className="w-full h-full fill-current block"
                                                                            style={{ color: palette.wave }}
                                                                        >
                                                                            <path
                                                                                fill="currentColor"
                                                                                d="M0,45 C320,105 640,-15 960,75 C1200,115 1380,45 1440,65 V200 H0 Z"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                </div>

                                                                {/* Bottom Solid Vibrant Content */}
                                                                <div className="pt-5 pb-2 px-2 sm:px-3 text-white flex-1 flex flex-col justify-between">
                                                                    <div>
                                                                        <div className="flex items-start justify-between gap-3">
                                                                            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight flex-1 text-white">
                                                                                {b.name}
                                                                            </h3>
                                                                            {/* Action Arrow */}
                                                                            <div className="shrink-0 p-2 rounded-full bg-white/20 text-white">
                                                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-5 h-5">
                                                                                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                                                                                </svg>
                                                                            </div>
                                                                        </div>

                                                                        {b.description && (
                                                                            <p className={`text-xs leading-relaxed mt-2 line-clamp-2 ${palette.text} opacity-90`}>
                                                                                {b.description}
                                                                            </p>
                                                                        )}
                                                                    </div>

                                                                    {/* Amenities Pill Tags */}
                                                                    <div className="flex flex-wrap gap-1.5 pt-4 mt-auto">
                                                                        {(b.services ?? []).slice(0, 4).map(s => (
                                                                            <span key={s} className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/20 text-white backdrop-blur-sm">
                                                                                {s}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Floor plan / bed picker */}
                                            {selectedBuilding && (
                                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="font-bold text-base text-slate-900">{selectedBuilding.name} — Bed Picker</h3>
                                                        <div className="flex gap-2">
                                                            {floors.map(f => (
                                                                <button key={f} onClick={() => { setSelectedFloor(f); }}
                                                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${selectedFloor === f ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                                                    Floor {f}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Legend */}
                                                    <div className="flex gap-4 mb-4">
                                                        {[['AVAILABLE','bg-slate-900 text-white','Available'],['OCCUPIED','bg-slate-200 text-slate-400','Occupied'],['MAINTENANCE','bg-slate-300 text-slate-600','Maintenance']].map(([s,c,label]) => (
                                                            <div key={s} className="flex items-center gap-1.5">
                                                                <div className={`w-3 h-3 rounded-full ${c}`} />
                                                                <span className="text-xs text-slate-500">{label}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Room grid */}
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                                                        {displayedRooms.map(room => {
                                                            const isSelected = selectedRoom?.id === room.id;
                                                            const isAvail = room.status === 'AVAILABLE';
                                                            return (
                                                                <button
                                                                    key={room.id}
                                                                    disabled={!isAvail}
                                                                    onClick={() => isAvail && setSelectedRoom(isSelected ? null : room)}
                                                                    className={`p-3.5 rounded-xl text-left transition-all ${
                                                                        isSelected ? 'bg-slate-900 text-white shadow-md'
                                                                        : room.status === 'AVAILABLE' ? 'bg-slate-50 hover:bg-slate-100 cursor-pointer text-slate-800'
                                                                        : room.status === 'MAINTENANCE' ? 'bg-slate-100 opacity-60 cursor-not-allowed text-slate-400'
                                                                        : 'bg-slate-100 opacity-40 cursor-not-allowed text-slate-400'
                                                                    }`}
                                                                >
                                                                    <div className="text-xs font-black">{room.bed_identifier ? `${room.suite_number}-${room.bed_identifier}` : room.room_number}</div>
                                                                    <div className={`text-[10px] mt-0.5 leading-tight ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>{room.window_orientation}</div>
                                                                    {room.price_per_term_minor && (
                                                                        <div className={`text-[11px] font-bold mt-1.5 ${isSelected ? 'text-white' : 'text-slate-900'}`}>{fmtCAD(room.price_per_term_minor)}/term</div>
                                                                    )}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Selection summary */}
                                                    {selectedRoom && (
                                                        <div className="mt-5 p-4 bg-slate-50 rounded-xl flex items-center justify-between">
                                                            <div>
                                                                <div className="font-bold text-sm text-slate-900">{selectedRoom.full_room_code ?? selectedRoom.room_number}</div>
                                                                <div className="text-xs text-slate-500 mt-0.5">{selectedRoom.room_type_label ?? selectedRoom.room_type} · {selectedRoom.window_orientation}</div>
                                                                {selectedRoom.price_per_term_minor && (
                                                                    <div className="text-sm font-black text-slate-900 mt-1">{fmtCAD(selectedRoom.price_per_term_minor)}/term</div>
                                                                )}
                                                            </div>
                                                            <button onClick={handleReserve} disabled={reserving}
                                                                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl text-sm font-bold text-white transition-all">
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
                                            <p className="text-slate-500 text-sm">Host families vetted and approved by Cannoga College International Student Services.</p>
                                            {homestayHosts.map((host, idx) => {
                                                const hostPhoto = host.photo_url || host.host_photo_url || '/images/health-community.jpg';
                                                const PALETTES = [
                                                    { bg: 'bg-[#ec4899]', border: 'border-[#ec4899]', wave: '#831843', badge: 'bg-[#831843]' },
                                                    { bg: 'bg-[#06b6d4]', border: 'border-[#06b6d4]', wave: '#164e63', badge: 'bg-[#164e63]' },
                                                    { bg: 'bg-[#f97316]', border: 'border-[#f97316]', wave: '#7c2d12', badge: 'bg-[#7c2d12]' },
                                                    { bg: 'bg-[#8b5cf6]', border: 'border-[#8b5cf6]', wave: '#4c1d95', badge: 'bg-[#4c1d95]' },
                                                ];
                                                const palette = PALETTES[idx % PALETTES.length];
                                                const isSelected = selectedHost?.id === host.id;

                                                return (
                                                    <div
                                                        key={host.id}
                                                        onClick={() => setSelectedHost(selectedHost?.id === host.id ? null : host)}
                                                        className={`p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col md:flex-row gap-5 ${palette.bg} ${palette.border} border-4 text-white shadow-md overflow-hidden ${isSelected ? 'ring-4 ring-slate-900 ring-offset-2' : ''}`}
                                                    >
                                                        {/* Host Photo with Wavy Cutout */}
                                                        <div className="w-full md:w-56 h-48 shrink-0 rounded-xl overflow-hidden bg-black/20 relative">
                                                            <img
                                                                src={hostPhoto}
                                                                alt={host.host_name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <div className="absolute top-2.5 right-2.5 z-20">
                                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white shadow-md backdrop-blur-md ${palette.badge}`}>
                                                                    {(host.spots_available ?? 0) > 0 ? `${host.spots_available} OPEN` : 'FULL'}
                                                                </span>
                                                            </div>

                                                            {/* Organic Wavy Bottom Edge */}
                                                            <div className="absolute bottom-[-10px] left-0 right-0 h-12 overflow-hidden leading-none z-10 pointer-events-none">
                                                                <svg
                                                                    viewBox="0 0 1440 200"
                                                                    preserveAspectRatio="none"
                                                                    className="w-full h-full fill-current block"
                                                                    style={{ color: palette.wave }}
                                                                >
                                                                    <path
                                                                        fill="currentColor"
                                                                        d="M0,45 C320,105 640,-15 960,75 C1200,115 1380,45 1440,65 V200 H0 Z"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 flex flex-col justify-between">
                                                            <div>
                                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                                    <div>
                                                                        <h3 className="font-black text-xl sm:text-2xl uppercase tracking-tight text-white">{host.host_name}</h3>
                                                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-black/20 text-white backdrop-blur-sm">
                                                                                {host.gender_policy === 'any' ? 'Co-Ed Welcome' : host.gender_policy === 'female_only' ? 'Female Only' : 'Male Only'}
                                                                            </span>
                                                                            {host.has_quiet_study_room && (
                                                                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-black/20 text-white backdrop-blur-sm">Quiet Study Room</span>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <div className="shrink-0 p-2 rounded-full bg-white/20 text-white">
                                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-5 h-5">
                                                                            <path d="M7 17L17 7M17 7H7M17 7V17" />
                                                                        </svg>
                                                                    </div>
                                                                </div>

                                                                <p className="text-white/90 text-xs leading-relaxed mb-3 line-clamp-2">{host.host_family_description}</p>
                                                                <div className="flex flex-wrap gap-1.5 text-[11px] mb-3">
                                                                    <span className="flex items-center gap-1 text-white bg-black/20 px-2 py-0.5 rounded-md font-bold text-[10px]"><Icons.MapPin />{host.address_city} · {host.distance_to_campus_km} km to campus</span>
                                                                    {host.languages_spoken.map(l => (
                                                                        <span key={l} className="px-2 py-0.5 bg-black/20 rounded-md text-[10px] font-bold text-white">{l}</span>
                                                                    ))}
                                                                    {host.dietary_accommodations.map(d => (
                                                                        <span key={d} className="px-2 py-0.5 bg-black/20 text-white rounded-md text-[10px] font-bold">{d.charAt(0).toUpperCase() + d.slice(1)}</span>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between pt-3 border-t border-white/20 mt-auto">
                                                                <div className="text-xs text-white/80">All-inclusive meal & utilities</div>
                                                                <div className="text-xl font-black text-white">{fmtWeekly(host.price_per_week_minor)}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {selectedHost && (
                                                <div className="p-4 bg-slate-100 rounded-xl flex items-center justify-between">
                                                    <div>
                                                        <div className="font-bold text-sm text-slate-900">{selectedHost.host_name} selected</div>
                                                        <div className="text-xs text-slate-500 mt-0.5">{selectedHost.address_city} · {fmtWeekly(selectedHost.price_per_week_minor)}</div>
                                                    </div>
                                                    <button onClick={handleReserve} disabled={reserving || (selectedHost.spots_available ?? 0) === 0}
                                                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl text-sm font-bold text-white transition-all">
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
                                     <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm">
                                         <div>
                                             <h2 className="text-lg font-black mb-1 text-slate-900">Lifestyle & Preferences</h2>
                                             <p className="text-slate-500 text-sm">This helps us find you the best roommate and room matches.</p>
                                         </div>

                                         {/* Sleep schedule */}
                                         <div>
                                             <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Sleep Schedule</label>
                                             <div className="grid grid-cols-3 gap-2">
                                                 {[['early', 'Early Bird'],['moderate', 'Moderate'],['night', 'Night Owl']].map(([v, l]) => (
                                                     <button key={v} onClick={() => setMyProfile(p => ({ ...p, sleep_schedule: v as any }))}
                                                         className={`py-2.5 rounded-xl text-xs font-bold transition-all ${myProfile.sleep_schedule === v ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                                         {l}
                                                     </button>
                                                 ))}
                                             </div>
                                         </div>

                                         {/* Study habits */}
                                         <div>
                                             <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Study Habits</label>
                                             <div className="grid grid-cols-3 gap-2">
                                                 {[['silent','Silent'],['music','Background Music'],['social','Social / Group']].map(([v, l]) => (
                                                     <button key={v} onClick={() => setMyProfile(p => ({ ...p, study_habits: v as any }))}
                                                         className={`py-2.5 rounded-xl text-xs font-bold transition-all ${myProfile.study_habits === v ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                                         {l}
                                                     </button>
                                                 ))}
                                             </div>
                                         </div>

                                         {/* Cleanliness */}
                                         <div>
                                             <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                                 Cleanliness — {myProfile.cleanliness_rating ?? 3}/5
                                             </label>
                                             <input type="range" min={1} max={5} step={1}
                                                 value={myProfile.cleanliness_rating ?? 3}
                                                 onChange={e => setMyProfile(p => ({ ...p, cleanliness_rating: parseInt(e.target.value) as any }))}
                                                 className="w-full accent-slate-900" />
                                             <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                                 <span>Relaxed</span><span>Very Tidy</span>
                                             </div>
                                         </div>

                                         {/* Guest preference */}
                                         <div>
                                             <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Guest Policy</label>
                                             <div className="grid grid-cols-3 gap-2">
                                                 {[['rarely','Rarely'],['advance_notice','Advance Notice'],['frequent','Frequently']].map(([v, l]) => (
                                                     <button key={v} onClick={() => setMyProfile(p => ({ ...p, guest_preference: v as any }))}
                                                         className={`py-2.5 rounded-xl text-xs font-bold transition-all ${myProfile.guest_preference === v ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                                         {l}
                                                     </button>
                                                 ))}
                                             </div>
                                         </div>

                                         {/* Gender / Floor preference */}
                                         <div>
                                             <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Gender / Floor Preference</label>
                                             <div className="grid grid-cols-3 gap-2">
                                                 {[['any','Any'],['same_gender','Same-Gender Floor'],['co_ed','Co-Ed Floor']].map(([v, l]) => (
                                                     <button key={v} onClick={() => setMyProfile(p => ({ ...p, gender_preference: v as GenderPreference }))}
                                                         className={`py-2.5 rounded-xl text-xs font-bold transition-all ${myProfile.gender_preference === v ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                                         {l}
                                                     </button>
                                                 ))}
                                             </div>
                                         </div>

                                         {/* Floor type */}
                                         <div>
                                             <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Floor Environment</label>
                                             <div className="grid grid-cols-3 gap-2">
                                                 {[['quiet_study','Quiet Study'],['social','Social'],['any','No Preference']].map(([v, l]) => (
                                                     <button key={v} onClick={() => setMyProfile(p => ({ ...p, floor_type_preference: v as FloorTypePreference }))}
                                                         className={`py-2.5 rounded-xl text-xs font-bold transition-all ${myProfile.floor_type_preference === v ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                                         {l}
                                                     </button>
                                                 ))}
                                             </div>
                                         </div>

                                         {/* Dietary needs */}
                                         <div>
                                             <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Dietary Needs (select all that apply)</label>
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
                                                             className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${isSelected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                                             {opt}
                                                         </button>
                                                     );
                                                 })}
                                             </div>
                                         </div>

                                         {/* Friend / suite-mate requests */}
                                         <div>
                                             <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Request Specific Suite-Mates</label>
                                             <p className="text-slate-400 text-xs mb-2">Enter up to 3 Student IDs. Both students must list each other for confirmation.</p>
                                             <div className="space-y-2">
                                                 {friendIds.map((fid, idx) => (
                                                     <input key={idx} type="text" placeholder={`Student ID #${idx + 1} (e.g. CC-2026-0001)`}
                                                         value={fid}
                                                         onChange={e => setFriendIds(prev => prev.map((p, i) => i === idx ? e.target.value : p))}
                                                         className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm placeholder:text-slate-400 text-slate-800 focus:outline-none focus:border-slate-800 transition" />
                                                 ))}
                                             </div>
                                         </div>

                                         <button onClick={handleSaveProfile} disabled={savingProfile}
                                             className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl font-bold text-sm text-white transition-all">
                                             {savingProfile ? 'Saving...' : 'Save Preferences & Find Matches'}
                                         </button>
                                     </div>

                                     {/* Matches */}
                                     <div className="bg-white p-6 rounded-2xl shadow-sm">
                                         <h2 className="text-lg font-black mb-1 text-slate-900">Roommate Matches</h2>
                                         <p className="text-slate-500 text-sm mb-4">Based on your lifestyle profile compatibility.</p>
                                         {matches.length === 0 ? (
                                             <div className="text-center py-12 text-slate-400 text-sm bg-slate-50 rounded-2xl">
                                                 <Icons.Users />
                                                 <p className="mt-2">Save your preferences to see matches</p>
                                             </div>
                                         ) : (
                                             <div className="space-y-3">
                                                 {matches.map(m => (
                                                     <div key={m.student_id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                                         <CompatibilityRing score={m.compatibility_score ?? 0} />
                                                         <div className="flex-1 min-w-0">
                                                             <div className="font-bold text-sm text-slate-900">{m.display_name ?? `Student ···${m.student_id.slice(-4)}`}</div>
                                                             <div className="text-xs text-slate-500 mt-0.5">
                                                                 {m.sleep_schedule} · {m.study_habits} · Cleanliness {m.cleanliness_rating}/5
                                                             </div>
                                                             <div className="text-xs text-slate-400">
                                                                 {m.gender_preference !== 'any' && `${m.gender_preference.replace('_', ' ')} floor`}
                                                                 {m.floor_type_preference !== 'any' && ` · ${m.floor_type_preference.replace('_', ' ')} environment`}
                                                             </div>
                                                         </div>
                                                         <button
                                                             onClick={() => setFriendIds(prev => { const copy = [...prev]; const empty = copy.findIndex(f => !f); if (empty !== -1) copy[empty] = m.student_id; return copy; })}
                                                             className="px-3.5 py-1.5 bg-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-300 transition">
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
                                        <h2 className="text-lg font-black mb-1 text-slate-900">Campus Meal Plans</h2>
                                        <p className="text-slate-500 text-sm">Meal plans are added directly to your housing contract. Select the best dining option for your semester.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {mealPlans.map((plan, idx) => {
                                            const PALETTES = [
                                                { bg: 'bg-[#6366f1]', border: 'border-[#6366f1]', wave: '#4f46e5', badge: 'bg-[#4f46e5]' }, // Electric Indigo
                                                { bg: 'bg-[#ec4899]', border: 'border-[#ec4899]', wave: '#db2777', badge: 'bg-[#db2777]' }, // Vibrant Hot Pink
                                                { bg: 'bg-[#10b981]', border: 'border-[#10b981]', wave: '#059669', badge: 'bg-[#059669]' }, // Electric Emerald
                                                { bg: 'bg-[#f97316]', border: 'border-[#f97316]', wave: '#ea580c', badge: 'bg-[#ea580c]' }, // Vibrant Orange
                                            ];
                                            const palette = PALETTES[idx % PALETTES.length];
                                            const isSelected = selectedMealPlan?.id === plan.id;

                                            return (
                                                <div
                                                    key={plan.id}
                                                    onClick={() => setSelectedMealPlan(isSelected ? null : plan)}
                                                    className={`p-6 sm:p-7 rounded-2xl ${palette.bg} ${palette.border} border-4 text-white shadow-md transition-all duration-200 relative overflow-hidden cursor-pointer flex flex-col justify-between min-h-[300px] ${isSelected ? 'ring-4 ring-slate-900 ring-offset-2' : ''}`}
                                                >
                                                    {/* Organic Wavy Cutout Bottom Edge */}
                                                    <div className="absolute bottom-[-10px] left-0 right-0 h-14 overflow-hidden leading-none pointer-events-none z-10">
                                                        <svg
                                                            viewBox="0 0 1440 200"
                                                            preserveAspectRatio="none"
                                                            className="w-full h-full fill-current block"
                                                            style={{ color: palette.wave }}
                                                        >
                                                            <path
                                                                fill="currentColor"
                                                                d="M0,45 C320,105 640,-15 960,75 C1200,115 1380,45 1440,65 V200 H0 Z"
                                                            />
                                                        </svg>
                                                    </div>

                                                    {/* Card Content Header */}
                                                    <div className="relative z-20">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                {idx === 0 && (
                                                                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white mb-2 backdrop-blur-sm">
                                                                        MOST POPULAR
                                                                    </span>
                                                                )}
                                                                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-[1.05] text-white">
                                                                    {plan.title}
                                                                </h3>
                                                            </div>
                                                            <div
                                                                className={`shrink-0 p-2.5 rounded-full transition-colors ${isSelected ? 'bg-white text-slate-900 shadow-md' : 'bg-white/20 text-white'}`}
                                                            >
                                                                {isSelected ? (
                                                                    <Icons.CheckCircle />
                                                                ) : (
                                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-5 h-5">
                                                                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="text-2xl sm:text-3xl font-black mt-3 text-white">
                                                            {fmtCAD(plan.price_per_term_minor)}
                                                            <span className="text-xs font-normal opacity-80"> /term</span>
                                                        </div>

                                                        {plan.flex_dollars_minor > 0 && (
                                                            <div className="text-xs font-bold text-white/90 mt-0.5">
                                                                + {fmtCAD(plan.flex_dollars_minor)} Flex Dining Dollars
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Card Bottom Description & Action */}
                                                    <div className="relative z-20 pt-6 mt-auto">
                                                        <p className="text-xs sm:text-sm font-medium text-white/95 leading-relaxed mb-4">
                                                            {plan.description}
                                                        </p>

                                                        <div className="flex items-center justify-between pt-2 border-t border-white/20">
                                                            <div className="text-xs font-bold text-white/80">
                                                                {plan.meals_per_week ? `${plan.meals_per_week} meals/week` : 'Declining balance'}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedMealPlan(isSelected ? null : plan);
                                                                }}
                                                                className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${isSelected ? 'bg-white text-slate-900 shadow-md' : 'bg-black/25 text-white hover:bg-black/40'}`}
                                                            >
                                                                {isSelected ? '✓ In Contract' : '+ Add Plan'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="p-4 bg-slate-100 rounded-xl text-slate-700 text-xs leading-relaxed">
                                        <strong>Note:</strong> The Unlimited 7-Day plan is recommended for Maple Hall and Laurentian Suites residents. The Declining Balance Plan is ideal for Pacific Townhouse and Homestay students who have kitchen access.
                                    </div>
                                </div>
                            )}

                            {/* ── TAB 4: OCCUPANCY AGREEMENT & DEPOSIT ── */}
                            {activeTab === 'contract' && (
                                <div className="max-w-3xl space-y-6 bg-white p-6 rounded-2xl shadow-sm">
                                    <div>
                                        <h2 className="text-lg font-black mb-1 text-slate-900">Residence Occupancy Agreement</h2>
                                        <p className="text-slate-500 text-sm">Read the full agreement below, then sign electronically to proceed with your $500 CAD security deposit.</p>
                                    </div>

                                    {!application ? (
                                        <div className="p-6 bg-slate-100 rounded-2xl text-slate-700 text-sm">
                                            <p>No housing selection found. Please complete <strong>Tab 1</strong> to select a room or homestay first.</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Contract text */}
                                            <div className="bg-slate-50 rounded-2xl p-6 max-h-64 overflow-y-auto text-xs text-slate-600 leading-relaxed space-y-3">
                                                <p className="font-bold text-slate-900 text-sm">CANNOGA COLLEGE — RESIDENCE OCCUPANCY LICENSE & COMMUNITY STANDARDS AGREEMENT</p>
                                                <p>This agreement is entered into between Cannoga College ("the College") and the undersigned student ("the Resident") for the academic year 2026/2027. This license grants the Resident the right to occupy the assigned residence space on a non-exclusive basis, subject to the terms and conditions outlined herein.</p>
                                                <p><strong className="text-slate-800">1. TERM OF OCCUPANCY:</strong> The occupancy period commences September 2, 2026 and concludes April 30, 2027. Early move-out does not entitle the Resident to a refund of housing fees.</p>
                                                <p><strong className="text-slate-800">2. HOUSING FEES & DEPOSIT:</strong> A non-refundable $500.00 CAD Housing Security Deposit is required within 7 days of signing this agreement to confirm the reservation. Full housing fees are due no later than August 1, 2026. Failure to pay by the due date may result in cancellation of the housing assignment.</p>
                                                <p><strong className="text-slate-800">3. COMMUNITY STANDARDS:</strong> Residents agree to respect quiet hours (11:00 PM – 7:00 AM), maintain cleanliness in shared spaces, and adhere to the Cannoga College Code of Conduct. Noise complaints, substance violations, or damage to property may result in immediate removal from residence.</p>
                                                <p><strong className="text-slate-800">4. GUEST POLICY:</strong> Overnight guests are permitted for a maximum of 3 consecutive nights and 10 nights per semester. All guests must be registered through the Resident Hub. The Resident is fully responsible for the conduct of their guests.</p>
                                                <p><strong className="text-slate-800">5. PROPERTY CARE:</strong> The Resident accepts the room in its current condition as documented in the Move-In Inspection Checklist. Any damage beyond normal wear and tear will be charged to the Resident's account.</p>
                                                <p><strong className="text-slate-800">6. TERMINATION:</strong> The College reserves the right to terminate this license agreement in the event of a violation of community standards, non-payment of fees, or other conduct detrimental to the residence community.</p>
                                                <p><strong className="text-slate-800">7. LIABILITY:</strong> Cannoga College is not responsible for loss or damage to Resident's personal property. Students are encouraged to obtain tenant's insurance.</p>
                                                <p className="text-slate-500">By signing below, the Resident confirms they have read, understood, and agreed to all terms of this Residence Occupancy License & Community Standards Agreement.</p>
                                            </div>

                                            {/* Application summary */}
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="p-4 bg-slate-50 rounded-xl">
                                                    <div className="text-xs text-slate-500 mb-1">Housing Type</div>
                                                    <div className="font-bold text-slate-900">{application.housing_type === 'homestay' ? 'Homestay' : 'On-Campus'}</div>
                                                </div>
                                                <div className="p-4 bg-slate-50 rounded-xl">
                                                    <div className="text-xs text-slate-500 mb-1">Placement</div>
                                                    <div className="font-bold text-slate-900">{(application.assigned_room as any)?.full_room_code ?? (application.homestay_host as any)?.host_name ?? '—'}</div>
                                                </div>
                                                <div className="p-4 bg-slate-50 rounded-xl">
                                                    <div className="text-xs text-slate-500 mb-1">Meal Plan</div>
                                                    <div className="font-bold text-slate-900">{selectedMealPlan?.title ?? 'None selected'}</div>
                                                </div>
                                                <div className="p-4 bg-slate-50 rounded-xl">
                                                    <div className="text-xs text-slate-500 mb-1">Security Deposit</div>
                                                    <div className="font-black text-slate-900">$500.00 CAD</div>
                                                </div>
                                            </div>

                                            {/* Signature */}
                                            {application.status !== 'contract_signed' && application.status !== 'deposit_paid' && application.status !== 'confirmed' ? (
                                                <div className="space-y-4 pt-2">
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Full Legal Name (as it appears on government ID)</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter your full legal name..."
                                                            value={signatureName}
                                                            onChange={e => setSignatureName(e.target.value)}
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm placeholder:text-slate-400 text-slate-900 focus:outline-none focus:border-slate-800 transition font-medium"
                                                        />
                                                    </div>
                                                    <label className="flex items-start gap-3 cursor-pointer">
                                                        <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} className="mt-0.5 accent-slate-900" />
                                                        <span className="text-sm text-slate-600">I have read and agree to the Residence Occupancy License & Community Standards Agreement. I understand that a $500 CAD deposit is required to confirm my housing placement.</span>
                                                    </label>
                                                    <button onClick={handleSignContract} disabled={signing || !signatureName || !agreedToTerms}
                                                        className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded-xl font-black text-sm text-white transition-all">
                                                        {signing ? 'Signing contract...' : 'Sign Contract & Generate $500 Deposit Invoice'}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="p-5 bg-slate-100 rounded-2xl">
                                                    <div className="flex items-center gap-2 text-slate-900 font-bold mb-2">
                                                        <Icons.CheckCircle /> Contract Signed
                                                    </div>
                                                    <p className="text-slate-600 text-sm">Signed by <strong className="text-slate-900">{application.signature_name}</strong> on {application.signed_at ? new Date(application.signed_at).toLocaleString('en-CA') : '—'}.</p>
                                                    <p className="text-slate-600 text-sm mt-2">Your $500 CAD deposit invoice has been generated. Please proceed to your <a href="/portal/payments" className="text-slate-900 underline font-semibold">Payments Portal</a> to complete payment via Wire Transfer, Interac, or other available methods.</p>
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
                                        <h2 className="text-lg font-black mb-1 text-slate-900">Resident Hub</h2>
                                        <p className="text-slate-500 text-sm">Your residence services, maintenance, and guest management.</p>
                                    </div>

                                    {!application || !['contract_signed','deposit_paid','confirmed'].includes(application.status) ? (
                                        <div className="p-6 bg-slate-100 rounded-2xl text-slate-700 text-sm">
                                            Complete your housing application and sign the occupancy agreement to access Resident Hub features.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Room assignment card */}
                                            <div className="p-6 bg-white rounded-2xl shadow-sm">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Icons.Key />
                                                    <h3 className="font-bold text-slate-900">Your Placement</h3>
                                                </div>
                                                {application.housing_type === 'homestay' ? (
                                                    <div className="space-y-2">
                                                        <div><span className="text-xs text-slate-500">Host Family</span><div className="font-bold text-slate-900">{(application.homestay_host as any)?.host_name ?? '—'}</div></div>
                                                        <div><span className="text-xs text-slate-500">Address</span><div className="font-bold text-slate-900">{(application.homestay_host as any)?.address_city ?? '—'}</div></div>
                                                        <div><span className="text-xs text-slate-500">Move-In Date</span><div className="font-bold text-slate-900">{application.move_in_date ?? '—'}</div></div>
                                                        <div className="pt-2"><span className="text-xs text-slate-400">Contact Residence Life for host family contact details.</span></div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <div><span className="text-xs text-slate-500">Room Code</span><div className="font-bold text-lg text-slate-900">{(application.assigned_room as any)?.full_room_code ?? '—'}</div></div>
                                                        <div><span className="text-xs text-slate-500">Building</span><div className="font-bold text-slate-900">{(application.building as any)?.name ?? '—'}</div></div>
                                                        <div><span className="text-xs text-slate-500">Move-In Date</span><div className="font-bold text-slate-900">{application.move_in_date ?? '—'}</div></div>
                                                        <div className="mt-3 px-3 py-2 bg-slate-100 rounded-lg font-mono text-xs text-slate-800">
                                                            Digital Keycard: CANNOGA-{application.id.slice(0,8).toUpperCase()}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Work Orders — on-campus only */}
                                            {application.housing_type === 'on_campus' && (
                                                <div className="p-6 bg-white rounded-2xl shadow-sm">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <Icons.Tool />
                                                            <h3 className="font-bold text-slate-900">Maintenance Requests</h3>
                                                        </div>
                                                        <button onClick={() => setShowWOModal(true)}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 rounded-lg text-xs font-bold text-white transition hover:bg-slate-800">
                                                            <Icons.Plus /> New Request
                                                        </button>
                                                    </div>
                                                    {workOrders.length === 0 ? (
                                                        <div className="text-center py-8 text-slate-400 text-xs">No maintenance requests yet</div>
                                                    ) : (
                                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                                            {workOrders.map(wo => (
                                                                <div key={wo.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-xs">
                                                                    <div>
                                                                        <div className="font-bold font-mono text-slate-900">{wo.ticket_number}</div>
                                                                        <div className="text-slate-500 mt-0.5 capitalize">{wo.category.replace('_', ' ')} · {wo.urgency}</div>
                                                                    </div>
                                                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200 text-slate-700">
                                                                        {wo.status.replace('_', ' ')}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Move-in checklist */}
                                            <div className="p-6 bg-white rounded-2xl shadow-sm">
                                                <h3 className="font-bold mb-3 text-slate-900">Move-In Inspection Checklist</h3>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['Desk','Mattress','Closet','Window','Smoke Detector','Heating'].map(item => (
                                                        <div key={item} className="flex items-center gap-2 text-xs">
                                                            <span className="text-slate-900">✓</span>
                                                            <span className="text-slate-600">{item}</span>
                                                            <span className="ml-auto text-slate-400">Good</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-3 text-xs text-slate-400">Report any discrepancies within 24 hours of move-in via Maintenance Request.</div>
                                            </div>

                                            {/* Guest pass registration */}
                                            <div className="p-6 bg-white rounded-2xl shadow-sm">
                                                <h3 className="font-bold mb-3 text-slate-900">Guest Pass Registration</h3>
                                                <p className="text-xs text-slate-500 mb-4">Register overnight guests (max 3 consecutive nights, 10/semester).</p>
                                                <div className="space-y-2">
                                                    <input type="text" placeholder="Guest Full Name" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs placeholder:text-slate-400 text-slate-800 focus:outline-none focus:border-slate-800" />
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <input type="date" className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-800" />
                                                        <input type="date" className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-800" />
                                                    </div>
                                                    <button className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition">Register Guest</button>
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
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowWOModal(false)} />
                    <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-black text-base text-slate-900">New Maintenance Request</h3>
                            <button onClick={() => setShowWOModal(false)} className="p-1 hover:text-slate-600 transition"><Icons.X /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                                <select value={woForm.category} onChange={e => setWoForm(p => ({ ...p, category: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-slate-800">
                                    <option value="heating_ac">Heating / AC</option>
                                    <option value="plumbing">Plumbing</option>
                                    <option value="electrical">Electrical</option>
                                    <option value="furniture_locks">Furniture / Locks</option>
                                    <option value="internet">Internet / WiFi</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Urgency</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[['low','Low'],['standard','Standard'],['urgent','Urgent'],['emergency','Emergency']].map(([v,l]) => (
                                        <button key={v} onClick={() => setWoForm(p => ({ ...p, urgency: v }))}
                                            className={`py-2 rounded-lg text-xs font-bold transition ${woForm.urgency === v
                                                ? 'bg-slate-900 text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                                <textarea value={woForm.description} onChange={e => setWoForm(p => ({ ...p, description: e.target.value }))}
                                    placeholder="Please describe the issue in detail..."
                                    rows={4}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm placeholder:text-slate-400 text-slate-800 focus:outline-none focus:border-slate-800 resize-none" />
                            </div>
                            <button onClick={handleSubmitWO}
                                className="w-full py-3 bg-slate-900 hover:bg-slate-800 rounded-xl font-bold text-sm text-white transition-all">
                                Submit Work Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
