'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { toast } from 'sonner';
import type { PaymentPurpose } from '@/types/payments';

const emptyForm = (): Partial<PaymentPurpose> => ({
    code: '', title: '', description: '', default_amount_cad: undefined, is_active: true, display_order: 0
});

export default function PaymentPurposesPage() {
    const [purposes, setPurposes] = useState<PaymentPurpose[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<Partial<PaymentPurpose>>(emptyForm());
    const [saving, setSaving] = useState(false);

    const fetchPurposes = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/payments/purposes');
            const data = await res.json();
            setPurposes(data.purposes ?? []);
        } catch { toast.error('Failed to load purposes'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchPurposes(); }, []);

    const openCreate = () => { setForm(emptyForm()); setShowModal(true); };
    const openEdit = (p: PaymentPurpose) => { setForm({ ...p }); setShowModal(true); };

    const handleSave = async () => {
        if (!form.code?.trim() || !form.title?.trim()) {
            toast.error('Code and Title are required'); return;
        }
        setSaving(true);
        try {
            const res = await fetch('/api/payments/purposes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            toast.success(form.id ? 'Purpose updated' : 'Purpose created');
            setShowModal(false);
            fetchPurposes();
        } catch (err: any) {
            toast.error(err.message ?? 'Save failed');
        } finally { setSaving(false); }
    };

    const toggleActive = async (p: PaymentPurpose) => {
        try {
            const res = await fetch('/api/payments/purposes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...p, is_active: !p.is_active }),
            });
            if (!res.ok) throw new Error();
            toast.success(`${p.title} ${!p.is_active ? 'activated' : 'deactivated'}`);
            fetchPurposes();
        } catch { toast.error('Toggle failed'); }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Payment Purposes"
                subtitle="Manage available payment purposes shown to students"
                actions={
                    <button onClick={openCreate} className="px-4 py-2 text-xs font-medium bg-neutral-900 text-white rounded-lg hover:bg-neutral-700 transition-colors uppercase tracking-widest">
                        + Add Purpose
                    </button>
                }
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
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Code</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Title</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Default (CAD)</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Order</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {purposes.map(p => (
                                <tr key={p.id} className={`hover:bg-white/5 transition-colors ${!p.is_active ? 'opacity-40' : ''}`}>
                                    <td className="px-4 py-3 font-mono text-xs text-amber-400">{p.code}</td>
                                    <td className="px-4 py-3 font-medium text-white">{p.title}</td>
                                    <td className="px-4 py-3 text-slate-300 font-mono">{p.default_amount_cad ? `$${p.default_amount_cad}` : '—'}</td>
                                    <td className="px-4 py-3 text-slate-400">{p.display_order}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                            p.is_active ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-neutral-800 text-slate-500'
                                        }`}>
                                            {p.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button onClick={() => openEdit(p)} className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer">Edit</button>
                                            <button onClick={() => toggleActive(p)} className="text-xs text-slate-400 hover:text-white font-medium cursor-pointer">
                                                {p.is_active ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4 text-white" onClick={e => e.stopPropagation()}>
                        <h2 className="text-lg font-bold text-white">{form.id ? 'Edit' : 'New'} Payment Purpose</h2>
                        <div className="space-y-3">
                            {[
                                { label: 'Code *', field: 'code', placeholder: 'e.g. tuition_deposit' },
                                { label: 'Title *', field: 'title', placeholder: 'e.g. Tuition Deposit' },
                                { label: 'Default Amount (CAD)', field: 'default_amount_cad', placeholder: '2000', type: 'number' },
                                { label: 'Display Order', field: 'display_order', placeholder: '0', type: 'number' },
                            ].map(({ label, field, placeholder, type }) => (
                                <div key={field}>
                                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-widest">{label}</label>
                                    <input
                                        type={type ?? 'text'}
                                        value={(form as any)[field] ?? ''}
                                        onChange={e => setForm(prev => ({ ...prev, [field]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                                        placeholder={placeholder}
                                        className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-widest">Description</label>
                                <textarea rows={2} value={form.description ?? ''} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none" />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.is_active ?? true} onChange={e => setForm(prev => ({ ...prev, is_active: e.target.checked }))} className="rounded accent-amber-400" />
                                <span className="text-sm text-slate-300">Active (visible to students)</span>
                            </label>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-400 border border-white/10 rounded-xl hover:bg-white/5 cursor-pointer">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-bold text-neutral-900 bg-amber-400 rounded-xl hover:bg-amber-300 disabled:opacity-50 transition-colors cursor-pointer">
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
