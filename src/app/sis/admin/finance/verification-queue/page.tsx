'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { toast } from 'sonner';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkSquare01Icon, Cancel01Icon, AlertCircleIcon, BankIcon } from '@hugeicons/core-free-icons';

interface QueueItem {
    id: string;
    transaction_reference: string;
    wire_tracking_ref: string | null;
    amount: number;
    local_currency: string | null;
    local_amount: number | null;
    exchange_rate_applied: number | null;
    country_code: string | null;
    student_proof_ref: string | null;
    proof_submitted_at: string | null;
    invoice_type: string | null;
    application?: {
        id: string;
        status: string;
        course?: { title: string };
        user?: { first_name: string; last_name: string; email: string };
        personal_info?: { firstName: string; lastName: string };
    };
    offer?: { id: string; tuition_fee: number };
}

export default function VerificationQueuePage() {
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [notesMap, setNotesMap] = useState<Record<string, string>>({});
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const fetchQueue = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/payments/admin/verification-queue');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setQueue(data.queue ?? []);
        } catch {
            toast.error('Failed to load verification queue');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchQueue(); }, [fetchQueue]);

    const handleAction = async (paymentId: string, action: 'approve' | 'reject') => {
        const notes = notesMap[paymentId]?.trim();
        if (!notes) {
            toast.error('Admin notes are required before approving or rejecting.');
            return;
        }
        setActionLoading(paymentId + action);
        try {
            const res = await fetch('/api/payments/admin/verify-wire', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId, action, adminNotes: notes }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error ?? 'Action failed');
            toast.success(action === 'approve' ? '✓ Payment approved & settled' : 'Payment rejected — student notified');
            fetchQueue();
        } catch (err: any) {
            toast.error(err.message ?? 'Action failed');
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (iso: string | null) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short' });
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Wire Verification Queue"
                subtitle={`${queue.length} payment${queue.length !== 1 ? 's' : ''} pending verification`}
                actions={
                    <button onClick={fetchQueue} className="px-4 py-2 text-xs font-medium border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors uppercase tracking-widest">
                        Refresh
                    </button>
                }
            />

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white" />
                </div>
            ) : queue.length === 0 ? (
                <div className="bg-neutral-900/80 border border-white/10 rounded-xl p-16 text-center shadow-sm">
                    <HugeiconsIcon icon={BankIcon} size={40} className="text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-sm">No payments pending verification.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {queue.map(item => {
                        const student = item.application?.user;
                        const personalInfo = item.application?.personal_info;
                        const displayName = personalInfo
                            ? `${personalInfo.firstName} ${personalInfo.lastName}`
                            : student ? `${student.first_name} ${student.last_name}` : 'Unknown';

                        return (
                            <div key={item.id} className="bg-neutral-900/80 border border-white/10 rounded-xl overflow-hidden shadow-sm">
                                {/* Summary Row */}
                                <div
                                    className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-sm font-semibold text-white">{item.wire_tracking_ref ?? item.transaction_reference}</span>
                                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded-full uppercase tracking-widest">Pending Verification</span>
                                        </div>
                                        <p className="text-sm text-slate-300">{displayName} · {student?.email}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{item.application?.course?.title} · Submitted {formatDate(item.proof_submitted_at)}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-xs text-slate-400 uppercase tracking-widest mb-0.5">Local Amount</p>
                                        <p className="text-lg font-bold text-white">
                                            {item.local_currency} {Number(item.local_amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                        <p className="text-xs text-slate-400">≈ CA$ {Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                    </div>
                                </div>

                                {/* Expanded Detail */}
                                {expandedId === item.id && (
                                    <div className="border-t border-white/10 p-5 space-y-5 bg-neutral-950/60">
                                        {/* Payment details grid */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Country</p>
                                                <p className="font-medium text-white">{item.country_code ?? '—'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Rate Applied</p>
                                                <p className="font-medium text-white">1 CAD = {item.exchange_rate_applied} {item.local_currency}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Invoice Type</p>
                                                <p className="font-medium text-white">{item.invoice_type?.replace(/_/g, ' ') ?? '—'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">CAD Settlement</p>
                                                <p className="font-medium text-white">CA$ {Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                            </div>
                                        </div>

                                        {/* Student Proof Reference */}
                                        <div className="bg-neutral-900 border border-white/10 rounded-xl p-4">
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Student-Submitted Bank Reference</p>
                                            <p className="font-mono text-sm text-amber-400 font-semibold">
                                                {item.student_proof_ref ?? <span className="text-red-400 italic">No reference submitted</span>}
                                            </p>
                                        </div>

                                        {/* Admin Notes */}
                                        <div>
                                            <label className="block text-xs font-medium text-slate-300 uppercase tracking-widest mb-1.5">
                                                Admin Notes <span className="text-red-400">*</span>
                                            </label>
                                            <textarea
                                                rows={3}
                                                placeholder="Required: describe your verification action or rejection reason..."
                                                value={notesMap[item.id] ?? ''}
                                                onChange={e => setNotesMap(prev => ({ ...prev, [item.id]: e.target.value }))}
                                                className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors resize-none"
                                            />
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleAction(item.id, 'approve')}
                                                disabled={!!actionLoading || !notesMap[item.id]?.trim()}
                                                className="flex-1 flex items-center justify-center gap-2 h-10 bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                            >
                                                {actionLoading === item.id + 'approve' ? (
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <HugeiconsIcon icon={CheckmarkSquare01Icon} size={16} />
                                                )}
                                                Approve & Settle
                                            </button>
                                            <button
                                                onClick={() => handleAction(item.id, 'reject')}
                                                disabled={!!actionLoading || !notesMap[item.id]?.trim()}
                                                className="flex-1 flex items-center justify-center gap-2 h-10 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                            >
                                                {actionLoading === item.id + 'reject' ? (
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <HugeiconsIcon icon={Cancel01Icon} size={16} />
                                                )}
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
