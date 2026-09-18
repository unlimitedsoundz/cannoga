'use client';

import React, { useState, useEffect } from 'react';
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
} from '@hugeicons/core-free-icons';
import { ExternalLink, ShieldCheck as ShieldIcon, Server as ServerIcon } from 'lucide-react';

export default function AdminMicrosoftIntegrationPage() {
    const [loading, setLoading] = useState(true);
    const [statusData, setStatusData] = useState<any>(null);
    const [downloading, setDownloading] = useState<string | null>(null);

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/sis/admin/integrations/microsoft/status');
            if (res.ok) {
                const data = await res.json();
                setStatusData(data);
            }
        } catch (err) {
            console.error('Failed to load status', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handleDownload = (fileType: string) => {
        setDownloading(fileType);
        window.location.href = `/api/sis/admin/integrations/microsoft/export-sds?file=${fileType}`;
        setTimeout(() => setDownloading(null), 2000);
    };

    const adminConsentUrl = `https://login.microsoftonline.com/${statusData?.configuration?.tenantId || '559051ae-ebf4-496a-8dbb-128aac57d721'}/adminconsent?client_id=${statusData?.configuration?.clientId || '5548838a-7cd2-4be6-9f5d-116f8e8a200f'}`;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Microsoft 365 Education & School Data Sync"
                subtitle="Manage tenant synchronization, SDS roster exports, and Microsoft Graph integrations"
                actions={
                    <button
                        onClick={fetchStatus}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-800 text-white text-xs font-bold rounded-lg hover:bg-neutral-700 transition"
                    >
                        <HugeiconsIcon icon={RefreshIcon} size={14} />
                        Refresh Status
                    </button>
                }
            />

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0f172a] border border-white/10 rounded-xl p-5 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tenant Status</span>
                    <div className="mt-2 flex items-center gap-2">
                        <HugeiconsIcon icon={CheckCircle} size={20} className="text-emerald-400" />
                        <span className="text-lg font-bold">Connected</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400 font-mono truncate">
                        cannogacollege.ca
                    </p>
                </div>

                <div className="bg-[#0f172a] border border-white/10 rounded-xl p-5 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Students Linked</span>
                    <div className="mt-2 flex items-center justify-between">
                        <span className="text-2xl font-extrabold text-white">
                            {statusData?.metrics?.linkedStudents ?? '—'}
                        </span>
                        <span className="text-xs text-slate-400">
                            / {statusData?.metrics?.totalStudents ?? '—'} enrolled
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-emerald-400">
                        Authentication Active
                    </p>
                </div>

                <div className="bg-[#0f172a] border border-white/10 rounded-xl p-5 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Faculty Linked</span>
                    <div className="mt-2 flex items-center justify-between">
                        <span className="text-2xl font-extrabold text-white">
                            {statusData?.metrics?.linkedFaculty ?? '—'}
                        </span>
                        <span className="text-xs text-slate-400">
                            / {statusData?.metrics?.totalFaculty ?? '—'} members
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                        Class Teams Coordinators
                    </p>
                </div>

                <div className="bg-[#0f172a] border border-white/10 rounded-xl p-5 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Course Sections</span>
                    <div className="mt-2 flex items-center justify-between">
                        <span className="text-2xl font-extrabold text-white">
                            {statusData?.metrics?.totalSections ?? '—'}
                        </span>
                        <span className="text-xs text-slate-400">Active Sections</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                        SDS Sync Enabled
                    </p>
                </div>
            </div>

            {/* School Data Sync (SDS) Export Center */}
            <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6 text-white space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
                    <div>
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                            <ServerIcon className="w-4 h-4 text-sky-400" />
                            Microsoft School Data Sync (SDS) Export
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Export standard SDS v2 compliant CSVs to provision Class Teams and assign student rosters.
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
                            className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-center transition cursor-pointer"
                        >
                            <HugeiconsIcon icon={DownloadIcon} size={16} className="text-sky-400 mb-1.5" />
                            <span className="text-xs font-bold text-white">{item.label}</span>
                            <span className="text-[10px] text-slate-400">{item.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Permissions & Tenant Admin Consent */}
            <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6 text-white space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
                    <div>
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                            <ShieldIcon className="w-4 h-4 text-emerald-400" />
                            Microsoft Graph API Permissions
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Least-privilege delegated scopes configured in Microsoft Entra for the Cannoga SIS Connector.
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
                                <th className="py-2.5 font-bold">Scope Name</th>
                                <th className="py-2.5 font-bold">Type</th>
                                <th className="py-2.5 font-bold">Purpose</th>
                                <th className="py-2.5 font-bold text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {(statusData?.requiredPermissions || []).map((perm: any) => (
                                <tr key={perm.name}>
                                    <td className="py-2.5 font-mono text-white font-bold">{perm.name}</td>
                                    <td className="py-2.5 text-slate-400">{perm.type}</td>
                                    <td className="py-2.5 text-slate-300">{perm.purpose}</td>
                                    <td className="py-2.5 text-right">
                                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-bold">
                                            {perm.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Architecture Governance Card */}
            <div className="bg-[#0f172a] border border-white/10 rounded-xl p-5 text-white">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    System of Record Architectural Rule
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                    Cannoga SIS is the authoritative database for student records, enrollments, tuition billing, and official transcripts. Microsoft 365 Education serves as the collaboration layer for Teams classes, video lectures, and coursework. Grades in Teams are formative and sync to official registrar final grades only through verified registrar review periods.
                </p>
            </div>
        </div>
    );
}
