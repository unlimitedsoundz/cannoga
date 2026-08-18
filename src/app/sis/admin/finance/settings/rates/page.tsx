'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { toast } from 'sonner';
import type { InstitutionalExchangeRate } from '@/types/payments';

export default function ExchangeRatesPage() {
    const [rates, setRates] = useState<InstitutionalExchangeRate[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editMap, setEditMap] = useState<Record<string, { rate: string; lockHours: string; notes: string }>>({});
    const [saving, setSaving] = useState<string | null>(null);

    const fetchRates = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/payments/rates');
            const data = await res.json();
            setRates(data.rates ?? []);
        } catch { toast.error('Failed to load rates'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchRates(); }, []);

    const startEdit = (rate: InstitutionalExchangeRate) => {
        setEditingId(rate.id);
        setEditMap(prev => ({
            ...prev,
            [rate.id]: {
                rate: String(rate.rate_multiplier),
                lockHours: String(rate.lock_duration_hours),
                notes: rate.notes ?? '',
            }
        }));
    };

    const handleSave = async (rate: InstitutionalExchangeRate) => {
        const edit = editMap[rate.id];
        if (!edit || !edit.rate) { toast.error('Rate is required'); return; }
        setSaving(rate.id);
        try {
            const res = await fetch('/api/payments/rates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: rate.id,
                    to_currency: rate.to_currency,
                    rate_multiplier: Number(edit.rate),
                    lock_duration_hours: Number(edit.lockHours) || 48,
                    notes: edit.notes,
                    is_active: rate.is_active,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            toast.success(`${rate.to_currency} rate updated`);
            setEditingId(null);
            fetchRates();
        } catch (err: any) {
            toast.error(err.message ?? 'Save failed');
        } finally { setSaving(null); }
    };

    const formatUpdated = (iso: string) => new Date(iso).toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short' });

    return (
        <div className="space-y-6">
            <PageHeader
                title="Exchange Rates"
                subtitle="Institutional CAD → local currency rates (admin-managed, locked per period)"
            />

            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white" />
                </div>
            ) : (
                <div className="bg-neutral-900/80 border border-white/10 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-950/60 border-b border-white/10">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Pair</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Rate (1 CAD =)</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Lock Period</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Last Updated</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Notes</th>
                                <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {rates.map(rate => {
                                const isEditing = editingId === rate.id;
                                const edit = editMap[rate.id];
                                return (
                                    <tr key={rate.id} className={`hover:bg-white/5 transition-colors ${!rate.is_active ? 'opacity-40' : ''}`}>
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-xs font-semibold text-amber-400 bg-neutral-800 border border-white/5 px-2 py-0.5 rounded">
                                                CAD → {rate.to_currency}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    step="0.000001"
                                                    value={edit?.rate ?? ''}
                                                    onChange={e => setEditMap(prev => ({ ...prev, [rate.id]: { ...prev[rate.id], rate: e.target.value } }))}
                                                    className="w-32 px-2 py-1 bg-neutral-800 border border-white/10 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono"
                                                />
                                            ) : (
                                                <span className="font-mono font-bold text-white">{rate.rate_multiplier}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        type="number"
                                                        value={edit?.lockHours ?? ''}
                                                        onChange={e => setEditMap(prev => ({ ...prev, [rate.id]: { ...prev[rate.id], lockHours: e.target.value } }))}
                                                        className="w-20 px-2 py-1 bg-neutral-800 border border-white/10 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                                                    />
                                                    <span className="text-xs text-slate-400">hrs</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-300">{rate.lock_duration_hours}h</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-500">{formatUpdated(rate.updated_at)}</td>
                                        <td className="px-4 py-3 text-xs text-slate-400 max-w-[200px] truncate">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={edit?.notes ?? ''}
                                                    onChange={e => setEditMap(prev => ({ ...prev, [rate.id]: { ...prev[rate.id], notes: e.target.value } }))}
                                                    className="w-full px-2 py-1 bg-neutral-800 border border-white/10 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                                                />
                                            ) : (
                                                rate.notes ?? '—'
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {isEditing ? (
                                                    <>
                                                        <button onClick={() => handleSave(rate)} disabled={saving === rate.id} className="text-xs font-bold text-neutral-900 bg-amber-400 hover:bg-amber-300 px-3 py-1 rounded cursor-pointer disabled:opacity-50">
                                                            {saving === rate.id ? 'Saving...' : 'Save'}
                                                        </button>
                                                        <button onClick={() => setEditingId(null)} className="text-xs text-slate-400 hover:text-white px-2 py-1 cursor-pointer">Cancel</button>
                                                    </>
                                                ) : (
                                                    <button onClick={() => startEdit(rate)} className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer">Edit Rate</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="bg-neutral-900/80 border border-white/10 rounded-xl p-4 text-xs text-slate-400 shadow-sm leading-relaxed">
                <strong className="text-amber-400">Institutional FX Policy:</strong> Rates are locked per transaction period upon student checkout initialization. Once reference CANXXXXXXXXX is generated, the locked rate applies for the full duration.
            </div>
        </div>
    );
}
