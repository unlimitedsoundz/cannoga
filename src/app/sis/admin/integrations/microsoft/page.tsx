'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/sis/PageHeader';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    CheckmarkCircle01Icon as CheckCircle,
    UserWarning02Icon as WarningIcon,
    Download01Icon as DownloadIcon,
    Loading03Icon as SpinnerIcon,
    RefreshIcon,
    BookOpen01Icon as BookIcon,
    UserGroupIcon as UsersIcon,
    Cancel01Icon as XIcon,
    ArrowRight01Icon as ArrowRightIcon,
    Clock01Icon as ClockIcon,
    Settings02Icon as SettingsIcon,
    FlashIcon,
} from '@hugeicons/core-free-icons';
import { ExternalLink, ShieldCheck as ShieldIcon, Server as ServerIcon, AlertTriangle, CheckCheck, RefreshCw } from 'lucide-react';

type StatusData = {
    configuration?: {
        tenantId: string;
        clientId: string;
        appCredentialsConfigured: boolean;
        graphConfigured: boolean;
    };
    metrics?: {
        totalStudents: number;
        linkedStudents: number;
        totalFaculty: number;
        linkedFaculty: number;
        totalSections: number;
        mappedSections: number;
        unmappedSections: number;
        syncQueuePending: number;
        syncQueueFailed: number;
        syncQueueCompleted: number;
    };
    settings?: Record<string, boolean>;
    recentFailures?: any[];
    studentsWithoutMicrosoft?: any[];
    sectionSyncStatus?: any[];
    requiredPermissions?: any[];
};

export default function AdminMicrosoftIntegrationPage() {
    const [loading, setLoading] = useState(true);
    const [statusData, setStatusData] = useState<StatusData | null>(null);
    const [downloading, setDownloading] = useState<string | null>(null);
    const [syncing, setSyncing] = useState(false);
    const [syncingAll, setSyncingAll] = useState(false);
    const [retrying, setRetrying] = useState(false);
    const [savingSettings, setSavingSettings] = useState(false);
    const [settings, setSettings] = useState<Record<string, boolean>>({});
    const [activeTab, setActiveTab] = useState<'overview' | 'sections' | 'queue' | 'settings'>('overview');

    const fetchStatus = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/sis/admin/integrations/microsoft/status');
            if (res.ok) {
                const data = await res.json();
                setStatusData(data);
                setSettings(data.settings || {});
            }
        } catch (err) {
            console.error('Failed to load status', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchStatus(); }, [fetchStatus]);

    const handleDownload = (fileType: string) => {
        setDownloading(fileType);
        window.location.href = `/api/sis/admin/integrations/microsoft/export-sds?file=${fileType}`;
        setTimeout(() => setDownloading(null), 2000);
    };

    const handleProcessQueue = async () => {
        setSyncing(true);
        try {
            const res = await fetch('/api/sis/admin/integrations/microsoft/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ batchSize: 20 }),
            });
            const data = await res.json();
            if (data.ok) {
                await fetchStatus();
                alert(`Processed ${data.processed} items. ${data.errors?.length ? `Errors: ${data.errors.length}` : 'No errors.'}`);
            }
        } catch (err) {
            alert('Failed to process queue');
        } finally {
            setSyncing(false);
        }
    };

    const handleSyncAll = async () => {
        if (!confirm('Queue sync for all active enrollments, sections, and faculty assignments? This will not call Microsoft immediately — use "Process Queue" to execute.')) return;
        setSyncingAll(true);
        try {
            const res = await fetch('/api/sis/admin/integrations/microsoft/sync-all', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ syncSections: true, syncEnrollments: true, syncFaculty: true }),
            });
            const data = await res.json();
            await fetchStatus();
            alert(data.message || `Queued ${data.queued} operations.`);
        } catch (err) {
            alert('Failed to queue sync');
        } finally {
            setSyncingAll(false);
        }
    };

    const handleRetryFailed = async () => {
        setRetrying(true);
        try {
            const res = await fetch('/api/sis/admin/integrations/microsoft/sync/retry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });
            const data = await res.json();
            await fetchStatus();
            alert(`Reset ${data.reset} failed items to retry.`);
        } catch (err) {
            alert('Failed to reset items');
        } finally {
            setRetrying(false);
        }
    };

    const handleSaveSettings = async () => {
        setSavingSettings(true);
        try {
            const res = await fetch('/api/sis/admin/integrations/microsoft/status', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            if (res.ok) {
                await fetchStatus();
            }
        } catch (err) {
            alert('Failed to save settings');
        } finally {
            setSavingSettings(false);
        }
    };

    const adminConsentUrl = `https://login.microsoftonline.com/${statusData?.configuration?.tenantId || '559051ae-ebf4-496a-8dbb-128aac57d721'}/adminconsent?client_id=${statusData?.configuration?.clientId || '5548838a-7cd2-4be6-9f5d-116f8e8a200f'}`;

    const SETTING_LABELS: Record<string, { label: string; description: string; risk: 'safe' | 'moderate' | 'caution' }> = {
        ms_auto_class_creation:     { label: 'Automatic Class Creation', description: 'Provision Microsoft Education Class when a course section is created', risk: 'moderate' },
        ms_auto_enrollment_sync:    { label: 'Automatic Enrollment Sync', description: 'Queue student roster addition when enrolled; removal when dropped', risk: 'moderate' },
        ms_auto_faculty_sync:       { label: 'Automatic Faculty Sync', description: 'Map instructors to Microsoft class as teacher when assigned', risk: 'safe' },
        ms_auto_classwork_sync:     { label: 'Automatic Classwork Sync', description: 'Sync Cannoga course content units to Microsoft Classwork', risk: 'safe' },
        ms_auto_assignment_sync:    { label: 'Automatic Assignment Sync', description: 'Sync Cannoga assignments to Microsoft Education', risk: 'moderate' },
        ms_auto_publish_classwork:  { label: 'Auto-Publish Classwork', description: 'Automatically publish classwork modules in Microsoft (keep OFF until content is finalized)', risk: 'caution' },
        ms_auto_publish_assignments:{ label: 'Auto-Publish Assignments', description: 'Automatically publish assignments in Microsoft (keep OFF to review before publishing)', risk: 'caution' },
    };

    const getSyncStatusBadge = (status: string) => {
        const map: Record<string, { bg: string; color: string; label: string }> = {
            SYNCED:   { bg: '#064e3b', color: '#a7f3d0', label: '✓ Synced' },
            PENDING:  { bg: '#1e3a5f', color: '#93c5fd', label: '⏳ Pending' },
            UNSYNCED: { bg: '#1c1917', color: '#a8a29e', label: '— Unsynced' },
            ERROR:    { bg: '#450a0a', color: '#fca5a5', label: '✕ Error' },
            ARCHIVED: { bg: '#1c1917', color: '#a8a29e', label: 'Archived' },
        };
        const s = map[status] || map.UNSYNCED;
        return (
            <span style={{
                background: s.bg, color: s.color,
                padding: '2px 8px', borderRadius: 999,
                fontSize: 10, fontWeight: 700,
            }}>{s.label}</span>
        );
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Microsoft 365 Education Integration"
                subtitle="Manage class provisioning, roster sync, classwork, assignments, and School Data Sync"
                actions={
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSyncAll}
                            disabled={syncingAll}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-700 text-white text-xs font-bold rounded-lg hover:bg-sky-600 transition disabled:opacity-50"
                        >
                            {syncingAll ? <HugeiconsIcon icon={SpinnerIcon} size={14} className="animate-spin" /> : <HugeiconsIcon icon={FlashIcon} size={14} />}
                            Queue Full Sync
                        </button>
                        <button
                            onClick={handleProcessQueue}
                            disabled={syncing}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition disabled:opacity-50"
                        >
                            {syncing ? <HugeiconsIcon icon={SpinnerIcon} size={14} className="animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
                            Process Queue
                        </button>
                        <button
                            onClick={fetchStatus}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-800 text-white text-xs font-bold rounded-lg hover:bg-neutral-700 transition"
                        >
                            <HugeiconsIcon icon={RefreshIcon} size={14} />
                            Refresh
                        </button>
                    </div>
                }
            />

            {/* App credentials warning */}
            {!statusData?.configuration?.appCredentialsConfigured && !loading && (
                <div className="bg-amber-950/60 border border-amber-500/40 rounded-xl p-4 text-amber-200 text-sm">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-400 flex-shrink-0" />
                        <div>
                            <p className="font-bold text-amber-300 mb-1">Server-Side Provisioning Not Configured</p>
                            <p className="text-xs leading-relaxed">
                                <code className="font-mono bg-amber-900/40 px-1 rounded">AZURE_CLIENT_ID</code> and <code className="font-mono bg-amber-900/40 px-1 rounded">AZURE_CLIENT_SECRET</code> are not set.
                                Student delegated login works, but server-side class provisioning, roster sync, and assignment creation require these credentials.
                                Add them to your environment and grant admin consent below.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Metrics Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                    { label: 'Tenant', value: 'Connected', sub: 'cannogacollege.ca', color: 'text-emerald-400' },
                    { label: 'Students Linked', value: `${statusData?.metrics?.linkedStudents ?? '—'}`, sub: `/ ${statusData?.metrics?.totalStudents ?? '—'} enrolled`, color: 'text-white' },
                    { label: 'Faculty Linked', value: `${statusData?.metrics?.linkedFaculty ?? '—'}`, sub: `/ ${statusData?.metrics?.totalFaculty ?? '—'} total`, color: 'text-white' },
                    { label: 'Classes Mapped', value: `${statusData?.metrics?.mappedSections ?? '—'}`, sub: `/ ${statusData?.metrics?.totalSections ?? '—'} sections`, color: 'text-white' },
                    { label: 'Queue Pending', value: `${statusData?.metrics?.syncQueuePending ?? '—'}`, sub: 'awaiting processing', color: (statusData?.metrics?.syncQueuePending || 0) > 0 ? 'text-amber-400' : 'text-white' },
                    { label: 'Queue Failed', value: `${statusData?.metrics?.syncQueueFailed ?? '—'}`, sub: 'need retry', color: (statusData?.metrics?.syncQueueFailed || 0) > 0 ? 'text-red-400' : 'text-emerald-400' },
                ].map((m) => (
                    <div key={m.label} className="bg-[#0f172a] border border-white/10 rounded-xl p-4 text-white">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{m.label}</span>
                        <div className={`mt-1.5 text-xl font-extrabold ${m.color}`}>{m.value}</div>
                        <p className="mt-0.5 text-[10px] text-slate-400">{m.sub}</p>
                    </div>
                ))}
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 bg-[#0f172a] border border-white/10 rounded-xl p-1 w-fit">
                {(['overview', 'sections', 'queue', 'settings'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-xs font-bold rounded-lg capitalize transition ${
                            activeTab === tab
                                ? 'bg-white/10 text-white'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* TAB: OVERVIEW                                                    */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* SDS Export */}
                    <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6 text-white space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
                            <div>
                                <h2 className="text-base font-bold flex items-center gap-2">
                                    <ServerIcon className="w-4 h-4 text-sky-400" />
                                    School Data Sync (SDS) / OneRoster Export
                                </h2>
                                <p className="text-xs text-slate-400 mt-1">
                                    Export OneRoster 1.1-compatible CSVs from Cannoga SIS to provision Class Teams and assign rosters via Microsoft SDS.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                            {[
                                { type: 'users', label: 'users.csv', desc: 'Students & Faculty' },
                                { type: 'orgs', label: 'orgs.csv', desc: 'School Org Info' },
                                { type: 'courses', label: 'courses.csv', desc: 'Course Catalog' },
                                { type: 'classes', label: 'classes.csv', desc: 'Course Sections' },
                                { type: 'enrollments', label: 'enrollments.csv', desc: 'Roster Mappings' },
                                { type: 'academicSessions', label: 'academicSessions.csv', desc: 'Terms & Dates' },
                            ].map((item) => (
                                <button
                                    key={item.type}
                                    onClick={() => handleDownload(item.type)}
                                    disabled={downloading === item.type}
                                    className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-center transition cursor-pointer disabled:opacity-50"
                                >
                                    <HugeiconsIcon icon={DownloadIcon} size={16} className="text-sky-400 mb-1.5" />
                                    <span className="text-xs font-bold text-white">{item.label}</span>
                                    <span className="text-[10px] text-slate-400">{item.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Students without Microsoft identity */}
                    {(statusData?.studentsWithoutMicrosoft?.length || 0) > 0 && (
                        <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6 text-white space-y-4">
                            <h2 className="text-base font-bold flex items-center gap-2">
                                <HugeiconsIcon icon={WarningIcon} size={16} className="text-amber-400" />
                                Students Missing Microsoft Identity ({statusData?.studentsWithoutMicrosoft?.length})
                            </h2>
                            <p className="text-xs text-slate-400">
                                These students have no linked Microsoft Entra account. They will be skipped during roster sync until their <code className="font-mono bg-white/10 px-1 rounded">microsoft_user_id</code> is populated (via SDS or manual link).
                            </p>
                            <div className="divide-y divide-white/5">
                                {statusData?.studentsWithoutMicrosoft?.map((s: any) => (
                                    <div key={s.id} className="py-2 flex items-center justify-between text-xs">
                                        <span className="font-mono text-slate-300">{s.student_id}</span>
                                        <span className="text-slate-400">{s.institutional_email}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Permissions Table */}
                    <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6 text-white space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
                            <div>
                                <h2 className="text-base font-bold flex items-center gap-2">
                                    <ShieldIcon className="w-4 h-4 text-emerald-400" />
                                    Microsoft Graph API Permissions
                                </h2>
                                <p className="text-xs text-slate-400 mt-1">
                                    Application-level permissions require admin consent. Delegated permissions work with student PKCE login.
                                </p>
                            </div>
                            <a
                                href={adminConsentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition"
                            >
                                Grant Tenant Admin Consent
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider">
                                        <th className="py-2.5 font-bold">Scope</th>
                                        <th className="py-2.5 font-bold">Type</th>
                                        <th className="py-2.5 font-bold">Purpose</th>
                                        <th className="py-2.5 font-bold text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {(statusData?.requiredPermissions || []).map((perm: any) => (
                                        <tr key={perm.name}>
                                            <td className="py-2.5 font-mono text-white font-bold">{perm.name}</td>
                                            <td className="py-2.5">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    perm.appLevel
                                                        ? 'bg-purple-900/60 text-purple-300'
                                                        : 'bg-sky-900/60 text-sky-300'
                                                }`}>
                                                    {perm.type}
                                                </span>
                                            </td>
                                            <td className="py-2.5 text-slate-300">{perm.purpose}</td>
                                            <td className="py-2.5 text-right">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    perm.status === 'Active'
                                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                        : perm.status === 'Required'
                                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                                        : perm.status === 'Not Configured'
                                                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                                        : 'bg-white/10 text-slate-300 border border-white/10'
                                                }`}>
                                                    {perm.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Architecture Governance */}
                    <div className="bg-[#0f172a] border border-white/10 rounded-xl p-5 text-white">
                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                            System of Record — Architectural Rule
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Cannoga SIS is the authoritative database for student records, enrollments, tuition billing, and official transcripts.
                            Microsoft 365 Education serves as the collaboration layer. Grades in Teams are formative and sync to official registrar final grades only through verified registrar review periods.
                            Microsoft membership is <strong className="text-slate-200">never</strong> used as proof of Cannoga enrollment.
                        </p>
                    </div>
                </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* TAB: SECTIONS                                                    */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'sections' && (
                <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6 text-white space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
                        <div>
                            <h2 className="text-base font-bold">Course Section → Microsoft Class Mapping</h2>
                            <p className="text-xs text-slate-400 mt-1">
                                Each active Cannoga course section maps to one Microsoft Education Class. Use &quot;Queue Full Sync&quot; to provision unmapped sections.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                                    <th className="py-2.5 font-bold">Section</th>
                                    <th className="py-2.5 font-bold">Module</th>
                                    <th className="py-2.5 font-bold">Semester</th>
                                    <th className="py-2.5 font-bold">MS Class ID</th>
                                    <th className="py-2.5 font-bold">Sync Status</th>
                                    <th className="py-2.5 font-bold">Last Synced</th>
                                    <th className="py-2.5 font-bold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {(statusData?.sectionSyncStatus || []).map((s: any) => {
                                    const mod = s.modules as any;
                                    const sem = s.semesters as any;
                                    return (
                                        <tr key={s.id}>
                                            <td className="py-2.5 font-mono text-white">{s.code}</td>
                                            <td className="py-2.5 text-slate-300">{mod?.code} — {mod?.title}</td>
                                            <td className="py-2.5 text-slate-400">{sem?.name}</td>
                                            <td className="py-2.5 font-mono text-[10px] text-slate-400 max-w-[120px] truncate">
                                                {s.microsoft_class_id ? s.microsoft_class_id.slice(0, 12) + '…' : <span className="text-amber-500">Not mapped</span>}
                                            </td>
                                            <td className="py-2.5">{getSyncStatusBadge(s.microsoft_sync_status)}</td>
                                            <td className="py-2.5 text-slate-500 text-[10px]">
                                                {s.microsoft_last_synced_at
                                                    ? new Date(s.microsoft_last_synced_at).toLocaleDateString()
                                                    : '—'}
                                            </td>
                                            <td className="py-2.5 text-right">
                                                <button
                                                    onClick={async () => {
                                                        await fetch('/api/sis/admin/integrations/microsoft/provision-class', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ sectionId: s.id }),
                                                        });
                                                        await fetchStatus();
                                                    }}
                                                    className="text-[10px] font-bold text-sky-400 hover:text-sky-300 transition"
                                                >
                                                    {s.microsoft_class_id ? 'Re-sync' : 'Provision'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {(statusData?.sectionSyncStatus || []).length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                                            No course sections found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* TAB: QUEUE                                                       */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'queue' && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleRetryFailed}
                            disabled={retrying}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-700 text-white text-xs font-bold rounded-lg hover:bg-amber-600 transition disabled:opacity-50"
                        >
                            {retrying ? <HugeiconsIcon icon={SpinnerIcon} size={14} className="animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                            Retry All Failed
                        </button>
                    </div>

                    {/* Queue stats cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: 'Pending', value: statusData?.metrics?.syncQueuePending, color: 'text-amber-400' },
                            { label: 'Failed', value: statusData?.metrics?.syncQueueFailed, color: 'text-red-400' },
                            { label: 'Completed', value: statusData?.metrics?.syncQueueCompleted, color: 'text-emerald-400' },
                        ].map((m) => (
                            <div key={m.label} className="bg-[#0f172a] border border-white/10 rounded-xl p-4 text-white">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{m.label}</span>
                                <div className={`mt-2 text-2xl font-extrabold ${m.color}`}>{m.value ?? '—'}</div>
                            </div>
                        ))}
                    </div>

                    {/* Recent failures */}
                    <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6 text-white space-y-4">
                        <h2 className="text-base font-bold flex items-center gap-2">
                            <HugeiconsIcon icon={WarningIcon} size={16} className="text-red-400" />
                            Recent Failed Operations
                        </h2>
                        {(statusData?.recentFailures?.length || 0) === 0 ? (
                            <p className="text-xs text-slate-500">No failed operations. System is healthy.</p>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {(statusData?.recentFailures || []).map((item: any) => (
                                    <div key={item.id} className="py-3">
                                        <div className="flex items-start justify-between gap-4 flex-wrap">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-bold font-mono bg-white/10 px-2 py-0.5 rounded">
                                                        {item.entity_type}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-sky-400">{item.action}</span>
                                                    <span className="text-[10px] text-slate-500">
                                                        Attempts: {item.attempts}
                                                    </span>
                                                </div>
                                                <p className="text-xs font-mono text-slate-400 truncate max-w-sm">{item.entity_id}</p>
                                                {item.last_error && (
                                                    <p className="text-xs text-red-400 mt-1 leading-relaxed">{item.last_error}</p>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-slate-500">
                                                {new Date(item.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* TAB: SETTINGS                                                    */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'settings' && (
                <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6 text-white space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                            <h2 className="text-base font-bold flex items-center gap-2">
                                <HugeiconsIcon icon={SettingsIcon} size={16} className="text-sky-400" />
                                Auto-Sync Settings
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">
                                Control which Cannoga events automatically trigger Microsoft 365 sync operations.
                                All defaults are OFF to prevent unintended changes.
                            </p>
                        </div>
                        <button
                            onClick={handleSaveSettings}
                            disabled={savingSettings}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition disabled:opacity-50"
                        >
                            {savingSettings ? <HugeiconsIcon icon={SpinnerIcon} size={14} className="animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
                            Save Settings
                        </button>
                    </div>

                    <div className="space-y-3">
                        {Object.entries(SETTING_LABELS).map(([key, meta]) => (
                            <div key={key} className="flex items-center justify-between gap-4 p-4 bg-white/5 rounded-lg">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-sm font-bold text-white">{meta.label}</span>
                                        {meta.risk === 'caution' && (
                                            <span className="text-[10px] font-bold text-amber-300 bg-amber-900/40 px-2 py-0.5 rounded-full">Caution</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400">{meta.description}</p>
                                </div>
                                <button
                                    onClick={() => setSettings(prev => ({ ...prev, [key]: !prev[key] }))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                                        settings[key] ? 'bg-emerald-600' : 'bg-white/10'
                                    }`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        settings[key] ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
