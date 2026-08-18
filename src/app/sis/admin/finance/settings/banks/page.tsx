'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { toast } from 'sonner';
import type { InstitutionalBankAccount } from '@/types/payments';

const emptyForm = (): Partial<InstitutionalBankAccount> => ({
    country_code: '', country_name: '', country_flag: '', currency: '', currency_symbol: '',
    bank_name: '', account_name: '', account_number: '', account_type: '',
    routing_or_sort_code: '', swift_bic: '', iban: '',
    transfer_instructions: '', processing_time: '2-5 business days',
    is_active: true, display_order: 0,
});

export default function BankAccountsPage() {
    const [banks, setBanks] = useState<InstitutionalBankAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<Partial<InstitutionalBankAccount>>(emptyForm());
    const [saving, setSaving] = useState(false);

    const fetchBanks = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/payments/countries');
            const data = await res.json();
            setBanks(data.countries ?? []);
        } catch { toast.error('Failed to load bank accounts'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchBanks(); }, []);

    const openCreate = () => { setForm(emptyForm()); setShowModal(true); };
    const openEdit = (b: InstitutionalBankAccount) => { setForm({ ...b }); setShowModal(true); };

    const setField = (field: keyof InstitutionalBankAccount, value: any) =>
        setForm(prev => ({ ...prev, [field]: value }));

    const handleSave = async () => {
        if (!form.country_code || !form.bank_name || !form.account_number || !form.currency) {
            toast.error('Country code, bank name, account number and currency are required'); return;
        }
        setSaving(true);
        try {
            const res = await fetch('/api/payments/countries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            toast.success(form.id ? 'Bank account updated' : 'Bank account created');
            setShowModal(false);
            fetchBanks();
        } catch (err: any) {
            toast.error(err.message ?? 'Save failed');
        } finally { setSaving(false); }
    };

    const fields: { label: string; key: keyof InstitutionalBankAccount; required?: boolean; placeholder?: string }[] = [
        { label: 'Country Code *', key: 'country_code', required: true, placeholder: 'e.g. NG' },
        { label: 'Country Name *', key: 'country_name', required: true, placeholder: 'e.g. Nigeria' },
        { label: 'Flag Emoji', key: 'country_flag', placeholder: '🇳🇬' },
        { label: 'Currency *', key: 'currency', required: true, placeholder: 'NGN' },
        { label: 'Currency Symbol', key: 'currency_symbol', placeholder: '₦' },
        { label: 'Bank Name *', key: 'bank_name', required: true, placeholder: 'Zenith Bank PLC' },
        { label: 'Account Name', key: 'account_name', placeholder: 'CANNOGA COLLEGE EDUCATIONAL SERVICES' },
        { label: 'Account Number *', key: 'account_number', required: true, placeholder: '1013456789' },
        { label: 'Account Type', key: 'account_type', placeholder: 'Corporate NUBAN' },
        { label: 'Routing / Sort Code', key: 'routing_or_sort_code', placeholder: '20-32-18' },
        { label: 'SWIFT / BIC', key: 'swift_bic', placeholder: 'BARCGB22' },
        { label: 'IBAN', key: 'iban', placeholder: 'GB81BARC20321830103996' },
        { label: 'Processing Time', key: 'processing_time', placeholder: '1-2 hours' },
        { label: 'Display Order', key: 'display_order', placeholder: '1' },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Institutional Bank Accounts"
                subtitle="Manage country-specific bank account details shown to students during payment"
                actions={
                    <button onClick={openCreate} className="px-4 py-2 text-xs font-medium bg-neutral-900 text-white rounded-lg hover:bg-neutral-700 transition-colors uppercase tracking-widest">
                        + Add Country Account
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
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Country</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Bank</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Account #</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Currency</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Processing</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {banks.map(b => (
                                <tr key={b.id} className={`hover:bg-white/5 ${!b.is_active ? 'opacity-40' : ''}`}>
                                    <td className="px-4 py-3 font-medium text-white">{b.country_flag} {b.country_name}</td>
                                    <td className="px-4 py-3 text-slate-300 text-xs">{b.bank_name}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-amber-400">{b.account_number}</td>
                                    <td className="px-4 py-3">
                                        <span className="font-mono text-xs bg-neutral-800 text-slate-300 px-2 py-0.5 rounded border border-white/5">{b.currency}</span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-400">{b.processing_time}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                            b.is_active ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-neutral-800 text-slate-500'
                                        }`}>
                                            {b.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => openEdit(b)} className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setShowModal(false)}>
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl p-6 space-y-4 my-4 text-white" onClick={e => e.stopPropagation()}>
                        <h2 className="text-lg font-bold text-white">{form.id ? 'Edit' : 'New'} Bank Account</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {fields.map(({ label, key, placeholder }) => (
                                <div key={key} className={key === 'transfer_instructions' ? 'col-span-2' : ''}>
                                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-widest">{label}</label>
                                    <input
                                        type={key === 'display_order' ? 'number' : 'text'}
                                        value={(form as any)[key] ?? ''}
                                        onChange={e => setField(key, key === 'display_order' ? Number(e.target.value) : e.target.value)}
                                        placeholder={placeholder}
                                        className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                                    />
                                </div>
                            ))}
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-widest">Transfer Instructions</label>
                                <textarea rows={3} value={form.transfer_instructions ?? ''} onChange={e => setField('transfer_instructions', e.target.value)} className="w-full px-3 py-2 bg-neutral-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none" />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer col-span-2">
                                <input type="checkbox" checked={form.is_active ?? true} onChange={e => setField('is_active', e.target.checked)} className="rounded accent-amber-400" />
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
