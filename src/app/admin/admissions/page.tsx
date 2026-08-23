'use client';

import { createClient } from '@/utils/supabase/client';
import { getAdmissionsApplications } from '@/app/admin/actions';
import { Link } from "@aalto-dx/react-components";
import { useState, useEffect } from 'react';
import { User, Clock, FileText, CheckCircle, XCircle, CaretRight as ChevronRight, MagnifyingGlass as Search, CircleNotch as Loader2 } from "@phosphor-icons/react";
import { formatToDDMMYYYY } from '@/utils/date';
import { SearchField } from '@/components/ui/SearchField';

export default function AdmissionsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchApplications = async () => {
            const supabase = createClient();
            try {
                const { data: { user: currentUser } } = await supabase.auth.getUser();
                setUser(currentUser);

                // Fetch via Server Action to bypass RLS issues on client
                const result = await getAdmissionsApplications();

                if (!result.success) {
                    throw new Error(result.error);
                }

                setApplications(result.data || []);
            } catch (err: any) {
                console.error("Error fetching applications:", err);
                setError(err.message || "Failed to fetch applications");
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const filteredApplications = applications.filter(app => {
        const searchStr = searchQuery.toLowerCase();
        if (!searchStr) return true;

        return (
            app.user?.first_name?.toLowerCase().includes(searchStr) ||
            app.user?.last_name?.toLowerCase().includes(searchStr) ||
            app.user?.email?.toLowerCase().includes(searchStr) ||
            app.course?.title?.toLowerCase().includes(searchStr)
        );
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-center">
                <XCircle size={40} className="text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-red-900 uppercase">Fetch Error</h3>
                <p className="text-red-600 font-medium text-sm mt-1">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all"
                >
                    Retry Fetch
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-neutral-900 uppercase tracking-tight">Admissions Dashboard</h1>
                    <p className="text-neutral-500 text-sm font-medium">Review and process student applications across all programmes.</p>
                </div>

                <div className="flex items-center gap-3">
                <div className="w-64">
                    <SearchField
                        placeholder="Search applications..."
                        value={searchQuery}
                        onChange={(v) => setSearchQuery(v)}
                    />
                </div>
                </div>
            </div>

            {/* Application Stages Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                    { label: 'All', count: applications.length, status: null },
                    { label: 'Submitted', count: applications.filter(a => a.status === 'SUBMITTED').length, status: 'SUBMITTED' },
                    { label: 'Paid', count: applications.filter(a => a.status === 'PAYMENT_SUBMITTED').length, status: 'PAYMENT_SUBMITTED' },
                    { label: 'Enrolled', count: applications.filter(a => a.status === 'ENROLLED').length, status: 'ENROLLED' },
                    { label: 'Reviewing', count: applications.filter(a => a.status === 'UNDER_REVIEW' || a.status === 'DOCS_REQUIRED').length, status: 'UNDER_REVIEW' },
                    { label: 'Admitted', count: applications.filter(a => a.status === 'ADMITTED' || a.status === 'OFFER_ACCEPTED').length, status: 'ADMITTED' },
                    { label: 'Drafts', count: applications.filter(a => a.status === 'DRAFT').length, status: 'DRAFT' },
                ].map((stage) => (
                    <div key={stage.label} className="bg-white p-3 md:p-4 flex flex-col gap-1 border border-neutral-100">
                        <span className="text-[9px] md:text-[10px] font-semibold text-neutral-400 uppercase tracking-widest leading-none">{stage.label}</span>
                        <span className="text-xl md:text-2xl font-semibold text-neutral-900">{stage.count}</span>
                    </div>
                ))}
            </div>


            <div className="bg-white border border-neutral-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="hidden md:table-header-group bg-neutral-50/50">
                            <tr>
                                <th className="p-6 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Applicant</th>
                                <th className="p-6 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Programme</th>
                                <th className="p-6 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Status</th>
                                <th className="p-6 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Date</th>
                                <th className="p-6 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50 text-neutral-900 block md:table-row-group">
                            {filteredApplications.length > 0 ? (
                                filteredApplications.map((app) => (
                                    <tr key={app.id} className="hover:bg-neutral-50/50 transition-colors group block md:table-row p-4 md:p-0">
                                        <td className="block md:table-cell py-2 md:p-6">
                                            <div className="flex flex-col">
                                                <div className="font-semibold text-sm md:text-base uppercase tracking-tight">
                                                    {(!app.user?.first_name || app.user?.first_name === 'Applicant') && app.personal_info?.firstName
                                                        ? `${app.personal_info.firstName}${app.personal_info.middleName ? ` ${app.personal_info.middleName}` : ''} ${app.personal_info.lastName || ''}`
                                                        : `${app.user?.first_name || ''}${app.user?.middle_name ? ` ${app.user.middle_name}` : ''} ${app.user?.last_name || ''}`}
                                                </div>
                                                <div className="text-[10px] md:text-xs font-semibold text-neutral-400">
                                                    {app.user?.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="block md:table-cell py-2 md:p-6">
                                            <div className="text-[11px] md:text-sm font-semibold text-neutral-500 md:text-neutral-900 uppercase tracking-tight leading-tight">
                                                {app.course?.title}
                                            </div>
                                        </td>
                                        <td className="block md:table-cell py-2 md:p-6">
                                            <div className="flex items-center gap-2">
                                                <span className="md:hidden text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Status:</span>
                                                <StatusBadge status={app.status} />
                                            </div>
                                        </td>
                                        <td className="block md:table-cell py-2 md:p-6">
                                            <div className="flex items-center gap-2">
                                                <span className="md:hidden text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Date:</span>
                                                <span className="text-xs md:text-sm font-bold text-neutral-500">
                                                    {app.submitted_at ? formatToDDMMYYYY(app.submitted_at) : 'In Draft'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="block md:table-cell pt-4 pb-2 md:p-6 text-right">
                                            <Link
                                                href={`/admin/admissions/review/?id=${app.id}`}
                                                className="inline-flex items-center gap-2 bg-neutral-100 px-4 py-2 rounded-none text-xs text-black font-black uppercase tracking-widest hover:bg-[#0a151a] hover:text-white transition-all active:scale-95"
                                            >
                                                Review Application <ChevronRight size={14} weight="bold" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-300">
                                            <FileText size={32} weight="regular" />
                                        </div>
                                        <h3 className="font-black text-xl text-neutral-900 uppercase mb-2">No Applications Found</h3>
                                        <p className="text-neutral-500 max-w-xs mx-auto text-sm font-medium">When students submit their applications, they will appear here for review.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const variants: Record<string, string> = {
        'DRAFT': 'bg-neutral-100 text-neutral-400 border-neutral-200',
        'SUBMITTED': 'bg-blue-50 text-blue-600 border-blue-100',
        'PAYMENT_SUBMITTED': 'bg-cyan-50 text-cyan-600 border-cyan-100',
        'ENROLLED': 'bg-neutral-900 text-white border-neutral-900',
        'UNDER_REVIEW': 'bg-amber-50 text-amber-600 border-amber-100',
        'DOCS_REQUIRED': 'bg-neutral-50 text-neutral-600 border-neutral-100',
        'ADMITTED': 'bg-neutral-50 text-neutral-600 border-neutral-100',
        'OFFER_ACCEPTED': 'bg-neutral-900 text-white border-neutral-900',
        'ADMISSION_LETTER_GENERATED': 'bg-teal-50 text-teal-700 border-teal-200',
        'REJECTED': 'bg-red-50 text-red-600 border-red-100',
        'OFFER_DECLINED': 'bg-red-900 text-white border-red-900',
    };

    const labels: Record<string, string> = {
        'ADMISSION_LETTER_GENERATED': 'LETTER ISSUED',
        'PAYMENT_SUBMITTED': 'PAYMENT SENT',
        'OFFER_ACCEPTED': 'OFFER ACCEPTED',
        'OFFER_DECLINED': 'OFFER DECLINED',
        'DOCS_REQUIRED': 'DOCS NEEDED',
        'UNDER_REVIEW': 'REVIEWING',
    };

    const s = status || 'DRAFT';

    return (
        <span className={`px-2 py-1 rounded-none text-[10px] font-black uppercase tracking-tighter border ${variants[s] || variants['DRAFT']}`}>
            {labels[s] || s.replace(/_/g, ' ')}
        </span>
    );
}

