'use client';

import { useState, useEffect } from 'react';
import { getSystemSetting, updateSystemSetting } from '../actions';
import { 
    Gear, 
    CreditCard, 
    CheckCircle, 
    CircleNotch,
    XCircle,
    Info
} from "@phosphor-icons/react";

export default function FinanceSettingsPage() {
    const [ngnEnabled, setNgnEnabled] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        async function loadSettings() {
            try {
                const val = await getSystemSetting('ngn_payment_enabled');
                setNgnEnabled(val === 'true');
            } catch (error: any) {
                console.error("Failed to load settings:", error.message || error);
            } finally {
                setLoading(false);
            }
        }
        loadSettings();
    }, []);

    const handleToggle = async () => {
        if (ngnEnabled === null || updating) return;
        
        setUpdating(true);
        setMessage(null);
        const newValue = !ngnEnabled;
        
        try {
            await updateSystemSetting('ngn_payment_enabled', newValue.toString());
            setNgnEnabled(newValue);
            setMessage({ type: 'success', text: `NGN Payment ${newValue ? 'enabled' : 'disabled'} successfully.` });
        } catch (error) {
            setMessage({ type: 'error', text: "Failed to update setting. Please try again." });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <CircleNotch className="animate-spin text-neutral-400" size={32} weight="bold" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-neutral-900 tracking-tight flex items-center gap-3">
                    <Gear size={32} weight="fill" className="text-neutral-400" />
                    Finance Settings
                </h1>
                <p className="text-neutral-500 mt-2">Manage global payment rails and financial configurations.</p>
            </div>

            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 ${
                    message.type === 'success' ? 'bg-neutral-50 text-neutral-700 border border-neutral-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                    {message.type === 'success' ? <CheckCircle size={20} weight="bold" /> : <XCircle size={20} weight="bold" />}
                    <span className="text-sm font-bold uppercase tracking-wide">{message.text}</span>
                </div>
            )}

            <div className="grid gap-6">
                <div className="bg-card border border-neutral-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                                    <CreditCard size={24} className="text-[#147BD1]" />
                                    Online Naira (NGN) Payment
                                </h3>
                                <p className="text-neutral-500 text-sm max-w-lg">
                                    Toggle the availability of local Naira bank transfers for students paying from Nigeria. When disabled, students will only see international options (USD, CAD, GBP).
                                </p>
                            </div>
                            
                            <button
                                onClick={handleToggle}
                                disabled={updating}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#147BD1] focus:ring-offset-2 ${
                                    ngnEnabled ? 'bg-[#147BD1]' : 'bg-neutral-200'
                                }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                                        ngnEnabled ? 'translate-x-7' : 'translate-x-1'
                                    }`}
                                />
                                {updating && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <CircleNotch className="animate-spin text-white/50" size={16} weight="bold" />
                                    </div>
                                )}
                            </button>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3">
                            <Info size={20} className="text-blue-600 shrink-0" weight="bold" />
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-blue-900 uppercase tracking-wide">Deployment Note</p>
                                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                                    Changes take effect immediately on the student portal. Students who are currently in the middle of a checkout process may need to refresh their page to see the update.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
