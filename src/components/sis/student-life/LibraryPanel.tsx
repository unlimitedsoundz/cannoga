'use client';

import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Book02Icon as Book,
    LibraryIcon as Library,
    Search01Icon as Search,
    Clock01Icon as Clock,
    XCircle as XCircle,
    CheckmarkCircle01Icon as CheckCircle,
    UserWarning02Icon as Warning,
} from '@hugeicons/core-free-icons';
import { toast } from 'sonner';
import { addLibraryHold, cancelLibraryHold, getLibraryHolds } from '@/app/sis/student-life-actions';

interface LibraryHold {
    id: string;
    book_title: string;
    author: string;
    isbn: string;
    hold_date: string;
    expiry_date: string;
    status: string;
}

interface LibraryPanelProps {
    holds: LibraryHold[];
    onBack: () => void;
    studentId: string;
}

export default function LibraryPanel({ holds, onBack, studentId }: LibraryPanelProps) {
    const [localHolds, setLocalHolds] = useState<LibraryHold[]>(holds);
    const [showForm, setShowForm] = useState(false);
    const [cancelling, setCancelling] = useState<string | null>(null);
    const [form, setForm] = useState({ bookTitle: '', author: '', isbn: '', expiryDate: '' });

    React.useEffect(() => {
        setLocalHolds(holds);
    }, [holds]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await addLibraryHold({
                studentId,
                bookTitle: form.bookTitle,
                author: form.author,
                isbn: form.isbn || undefined,
                expiryDate: form.expiryDate || undefined,
            });
            if (result.success) {
                toast.success('Book hold added successfully');
                setForm({ bookTitle: '', author: '', isbn: '', expiryDate: '' });
                setShowForm(false);
                const refreshed = await getLibraryHolds(studentId);
                if (refreshed.success) setLocalHolds(refreshed.data);
            } else {
                toast.error(result.error || 'Failed to add hold');
            }
        } catch (e) {
            toast.error('Failed to add hold');
        }
    };

    const handleCancel = async (id: string) => {
        setCancelling(id);
        try {
            const result = await cancelLibraryHold(id);
            if (result.success) {
                toast.success('Hold cancelled');
                setLocalHolds(prev => prev.map(h => h.id === id ? { ...h, status: 'cancelled' } : h));
            } else {
                toast.error(result.error || 'Failed to cancel hold');
            }
        } finally {
            setCancelling(null);
        }
    };

    const activeHolds = localHolds.filter(h => h.status === 'active');
    const cancelledHolds = localHolds.filter(h => h.status === 'cancelled');

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const isExpired = (dateStr: string) => {
        if (!dateStr) return false;
        return new Date(dateStr) < new Date();
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <button type="button" onClick={onBack} className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1">
                    <HugeiconsIcon icon={XCircle} size={14} strokeWidth={2} /> Back to Student Life
                </button>
                <button type="button" onClick={() => setShowForm(!showForm)} className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded flex items-center gap-1.5">
                    <HugeiconsIcon icon={Library} size={14} strokeWidth={2} /> New Hold
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-6">
                    <h4 className="font-bold text-slate-900 text-sm mb-4">Place a Book Hold</h4>
                    <form onSubmit={handleAdd} className="space-y-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Book Title</label>
                            <input
                                type="text"
                                value={form.bookTitle}
                                onChange={e => setForm({ ...form, bookTitle: e.target.value })}
                                className="w-full border border-slate-300 rounded p-2 text-xs"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Author</label>
                            <input
                                type="text"
                                value={form.author}
                                onChange={e => setForm({ ...form, author: e.target.value })}
                                className="w-full border border-slate-300 rounded p-2 text-xs"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">ISBN (Optional)</label>
                                <input
                                    type="text"
                                    value={form.isbn}
                                    onChange={e => setForm({ ...form, isbn: e.target.value })}
                                    className="w-full border border-slate-300 rounded p-2 text-xs"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Hold Until (Optional)</label>
                                <input
                                    type="date"
                                    value={form.expiryDate}
                                    onChange={e => setForm({ ...form, expiryDate: e.target.value })}
                                    className="w-full border border-slate-300 rounded p-2 text-xs"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setShowForm(false)} className="text-xs font-medium px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50">Cancel</button>
                            <button type="submit" className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded">Place Hold</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-6">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <HugeiconsIcon icon={Library} size={18} strokeWidth={2} className="text-slate-700" />
                        <h4 className="font-bold text-slate-900 text-sm">Library Account</h4>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">{activeHolds.length} active holds</span>
                </div>

                <div className="divide-y divide-slate-100">
                    {activeHolds.length === 0 ? (
                        <div className="p-8 text-center text-xs text-slate-500">No active library holds.</div>
                    ) : (
                        activeHolds.map(hold => {
                            const expired = isExpired(hold.expiry_date);
                            return (
                                <div key={hold.id} className="p-4 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="shrink-0 pt-0.5">
                                            <HugeiconsIcon icon={Book} size={14} strokeWidth={2} className="text-slate-600" />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-900 text-xs">{hold.book_title}</h5>
                                            <p className="text-[11px] text-slate-500">by {hold.author}</p>
                                            {hold.isbn && <p className="text-[10px] text-slate-400">ISBN: {hold.isbn}</p>}
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                                    <HugeiconsIcon icon={Clock} size={12} strokeWidth={2} /> Placed: {formatDate(hold.hold_date)}
                                                </span>
                                                {hold.expiry_date && (
                                                    <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                                                        Expires: {formatDate(hold.expiry_date)}
                                                        {expired && <HugeiconsIcon icon={Warning} size={12} strokeWidth={2} />}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleCancel(hold.id)}
                                        disabled={cancelling === hold.id}
                                        className="text-[11px] font-medium px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 self-start md:self-center"
                                    >
                                        {cancelling === hold.id ? 'Cancelling...' : 'Cancel Hold'}
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {cancelledHolds.length > 0 && (
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100">
                        <h4 className="font-bold text-slate-900 text-sm">Cancelled Holds</h4>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {cancelledHolds.map(hold => (
                            <div key={hold.id} className="p-4 opacity-60">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h5 className="font-medium text-slate-700 text-xs">{hold.book_title}</h5>
                                        <p className="text-[11px] text-slate-500">by {hold.author}</p>
                                    </div>
                                    <span className="text-[10px] text-slate-500">Cancelled</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
