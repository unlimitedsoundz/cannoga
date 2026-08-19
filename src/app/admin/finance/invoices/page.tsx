'use client';

import { createClient } from '@/utils/supabase/client';
import { CreditCard, Envelope, FileText, CheckCircle, Clock, CircleNotch as Loader2, ShieldCheck } from "@phosphor-icons/react";
import { useState, useEffect } from 'react';
import { pushInvoice, verifyTuitionPayment, getAdminInvoiceData, getPendingPayments } from '../actions';
import { getProgramYears, ANCILLARY_FEES_TOTAL } from '@/utils/tuition';

export default function AdminInvoicesPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [customFee, setCustomFee] = useState<Record<string, number>>({});
    const [customInvoiceType, setCustomInvoiceType] = useState<Record<string, string>>({});
    const [overrideSettled, setOverrideSettled] = useState<Record<string, boolean>>({});
    const [pendingPayments, setPendingPayments] = useState<any[]>([]);
    const [verifyLoading, setVerifyLoading] = useState<string | null>(null);

    // Default global fees reference, we could fetch from DB but keeping simple for now
    // A production scenario would fetch these from tuition_rates table
    const defaultFees: Record<string, number> = {
        'CERTIFICATE': 4000,
        'DIPLOMA': 4000,
        'ADVANCED_DIPLOMA': 4000,
        'BSc': 6400,
        'BACHELOR': 6400,
        'PG_DIPLOMA': 4000,
        'MASTERS': 9600,
        'MASTER': 9600,
    };

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const data = await getAdminInvoiceData();

            const formattedApps = data?.filter((app: any) => app.offer && (Array.isArray(app.offer) ? app.offer.length > 0 : !!app.offer)).map((app: any) => {
                const offer = Array.isArray(app.offer) ? app.offer[0] : app.offer;
                const program = (Array.isArray(app.program) ? app.program[0] : app.program) as any;
                const title = (program?.title || '').toUpperCase();
                
                const nationality = app.personal_info?.nationality;
                const isDomestic = nationality ? (nationality.toLowerCase().trim() === 'canada' || nationality.toLowerCase().trim() === 'canadian' || nationality.toLowerCase().trim() === 'domestic') : false;

                let defaultFee = 4000;
                if (title.includes('CERTIFICATE') || title.includes('DIPLOMA') || title.includes('ADVANCED')) {
                    defaultFee = isDomestic ? 2400 : 4000;
                } else if (title.includes('BACHELOR') || title.includes('BSC')) {
                    defaultFee = isDomestic ? 4000 : 6400;
                } else if (title.includes('MASTER') || title.includes('MSC')) {
                    defaultFee = isDomestic ? 5600 : 9600;
                } else if (title.includes('POSTGRADUATE') || title.includes('PG')) {
                    defaultFee = isDomestic ? 5600 : 9600;
                }

                return {
                    ...app,
                    offer,
                    program, // override with single object
                    defaultFee
                };
            }) || [];

            setApplications(formattedApps);

            // Fetch wire payments awaiting verification (tuition and housing deposits).
            try {
                const pending = await getPendingPayments();
                const enriched = pending.map((p: any) => {
                    if (p.app?.user?.email) return p;
                    const matchedApp = formattedApps.find((a: any) => a.offer?.id === p.offer_id);
                    return { ...p, app: matchedApp || p.app };
                }).filter((p: any) => p.app);
                setPendingPayments(enriched);
            } catch (pendingErr: any) {
                console.error("Error fetching pending payments:", pendingErr.message || pendingErr);
            }
        } catch (error: any) {
            console.error("Error in fetchApplications:", error.message || error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleFeeChange = (appId: string, val: string) => {
        setCustomFee(prev => ({
            ...prev,
            [appId]: parseInt(val) || 0
        }));
    };

    // Compute the tuition amount that should be pre-filled for a given invoice type.
    // The stored offer tuition_fee is the annual tuition amount.
    const computeFeeForType = (app: any, type: string): number => {
        const annual = app.offer?.tuition_fee || app.defaultFee || 0;
        const years = getProgramYears(app.program?.duration, app.program?.title);
        switch (type) {
            case 'FULL_PROGRAM_TUITION':
                return Math.round(annual * years);
            case '1ST_YEAR_TUITION':
                return Math.round(annual);
            case 'TUITION_DEPOSIT':
            default:
                return 2000;
        }
    };

    const handleInvoiceTypeChange = (appId: string, val: string) => {
        const app = applications.find(a => a.id === appId);
        setCustomInvoiceType(prev => ({
            ...prev,
            [appId]: val
        }));
        // Update the tuition amount input to the type-appropriate default
        if (app) {
            setCustomFee(prev => ({
                ...prev,
                [appId]: computeFeeForType(app, val)
            }));
        }
    };

    const handlePushInvoice = async (appId: string, currentFee: number) => {
        const feeToPush = customFee[appId] !== undefined ? customFee[appId] : currentFee;
        const invoiceType = customInvoiceType[appId] || 'TUITION_DEPOSIT';
        // Ancillary fees are only charged on the first (initial) invoice
        const app = applications.find(a => a.id === appId);
        const isFirstInvoice = !app?.offer?.ancillary_charged;
        const ancillaryTotal = isFirstInvoice ? ANCILLARY_FEES_TOTAL : 0;

        if (!confirm(`Are you sure you want to push a ${invoiceType.replace(/_/g, ' ')} invoice of $${feeToPush} (tuition)${isFirstInvoice ? ` + $${ANCILLARY_FEES_TOTAL} ancillary` : ''} = $${feeToPush + ancillaryTotal} total to this student?`)) return;

        try {
            setActionLoading(appId);
            const result = await pushInvoice(appId, feeToPush, invoiceType);
            if (result.success) {
                alert("Invoice successfully pushed!");
                fetchApplications(); // Refresh list
            }
        } catch (error: any) {
            alert(`Failed to push invoice: ${error.message || 'Unknown error'}`);
        } finally {
            setActionLoading(null);
        }
    };

    const handleVerifyPayment = async (payment: any) => {
        if (!confirm(`Confirm you have received this ${payment.invoice_type?.replace(/_/g, ' ')} payment of $${payment.amount}? This will issue the receipt to the student.`)) return;

        try {
            setVerifyLoading(payment.id);
            const result = await verifyTuitionPayment(payment.id, payment.app.id);
            if (result.success) {
                alert("Payment verified. Receipt issued to student.");
                fetchApplications();
            }
        } catch (error: any) {
            alert(`Failed to verify payment: ${error.message || 'Unknown error'}`);
        } finally {
            setVerifyLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 leading-tight">Manage Invoices</h1>
                    <p className="text-neutral-500 text-sm mt-1">Review student offers and push custom tuition invoices.</p>
                </div>
            </div>

            <div className="bg-white border border-neutral-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="hidden md:table-header-group bg-neutral-50 border-b border-neutral-200">
                        <tr>
                            <th className="p-4 font-bold text-neutral-600 text-xs uppercase">Applicant</th>
                            <th className="p-4 font-bold text-neutral-600 text-xs uppercase">Program</th>
                            <th className="p-4 font-bold text-neutral-600 text-xs uppercase">Status</th>
                            <th className="p-4 font-bold text-neutral-600 text-xs uppercase">Fee ($ incl. ${ANCILLARY_FEES_TOTAL} ancillary)</th>
                            <th className="p-4 font-bold text-neutral-600 text-xs uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 block md:table-row-group">
                        {applications.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-neutral-400 text-sm">
                                    No accepted offers pending invoices found.
                                </td>
                            </tr>
                        ) : (
                            applications.map((app) => {
                                const isPushed = app.offer.invoice_pushed;
                                const isEnrolledOrPaid = ['PAYMENT_SUBMITTED', 'ENROLLED', 'ADMISSION_LETTER_GENERATED'].includes(app.status);
                                const feeValue = customFee[app.id] !== undefined ? customFee[app.id] : (app.offer.tuition_fee || app.defaultFee);

                                return (
                                    <tr key={app.id} className="hover:bg-neutral-50 transition-colors block md:table-row p-4 md:p-0">
                                        <td className="block md:table-cell py-2 md:p-4">
                                            <div className="font-bold text-neutral-900 text-sm">
                                                {app.user?.first_name} {app.user?.last_name}
                                            </div>
                                            <div className="text-xs text-neutral-500">{app.user?.email || app.personal_info?.email}</div>
                                        </td>
                                        <td className="block md:table-cell py-1 md:p-4 text-xs font-medium text-neutral-600">
                                            {app.program?.title}
                                        </td>
                                        <td className="block md:table-cell py-2 md:p-4">
                                            <div className="flex items-center gap-2">
                                                <span className="md:hidden text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Status:</span>
                                                {isEnrolledOrPaid ? (
                                                    <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-none text-[9px] font-bold uppercase flex items-center gap-1 w-fit">
                                                        <CheckCircle size={10} weight="bold" /> Paid
                                                    </span>
                                                ) : isPushed ? (
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-none text-[9px] font-bold uppercase flex items-center gap-1 w-fit">
                                                        <Envelope size={10} weight="bold" /> Sent
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-none text-[9px] font-bold uppercase flex items-center gap-1 w-fit">
                                                        <Clock size={10} weight="bold" /> Wait
                                                    </span>
                                                )}
                                                {isEnrolledOrPaid && (
                                                    <label className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-bold uppercase cursor-pointer select-none">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!overrideSettled[app.id]}
                                                            onChange={(e) => setOverrideSettled(prev => ({
                                                                ...prev,
                                                                [app.id]: e.target.checked
                                                            }))}
                                                            className="rounded border-neutral-300 text-neutral-600 focus:ring-neutral-500 h-3.5 w-3.5 border-2"
                                                        />
                                                        Always Issue
                                                    </label>
                                                )}
                                            </div>
                                        </td>
                                        <td className="block md:table-cell py-2 md:p-4">
                                            <div className="flex flex-col gap-2">
                                                <select
                                                    className="border border-neutral-300 rounded-none px-2 py-1.5 text-xs w-full disabled:opacity-50"
                                                    value={customInvoiceType[app.id] || app.offer.invoice_type || 'TUITION_DEPOSIT'}
                                                    onChange={(e) => handleInvoiceTypeChange(app.id, e.target.value)}
                                                    disabled={(isEnrolledOrPaid && !overrideSettled[app.id]) || actionLoading === app.id}
                                                >
                                                    <option value="TUITION_DEPOSIT">Deposit</option>
                                                        <option value="1ST_YEAR_TUITION">1st Year</option>
                                                    <option value="FULL_PROGRAM_TUITION">Full</option>
                                                </select>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-neutral-900">$</span>
                                                    <input
                                                        type="number"
                                                        className="border border-neutral-300 rounded-none px-2 py-1.5 w-full md:w-24 text-sm disabled:opacity-50 font-bold"
                                                        value={feeValue}
                                                        onChange={(e) => handleFeeChange(app.id, e.target.value)}
                                                        disabled={(isEnrolledOrPaid && !overrideSettled[app.id]) || actionLoading === app.id}
                                                    />
                                                </div>
                                            </div>
                                            {isPushed && app.offer.invoice_sent_at && (
                                                <div className="text-[10px] text-neutral-400 mt-1">
                                                    Sent: {new Date(app.offer.invoice_sent_at).toLocaleDateString()}
                                                </div>
                                            )}
                                        </td>
                                        <td className="block md:table-cell pt-4 pb-2 md:p-4 text-right">
                                            <button
                                                onClick={() => handlePushInvoice(app.id, feeValue)}
                                                disabled={actionLoading === app.id || (isEnrolledOrPaid && !overrideSettled[app.id])}
                                                className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-none text-xs font-bold uppercase tracking-widest transition-colors ${(isEnrolledOrPaid && !overrideSettled[app.id])
                                                        ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                                        : isPushed
                                                            ? 'bg-neutral-900 text-white hover:bg-neutral-700'
                                                            : 'bg-neutral-600 text-white hover:bg-neutral-700'
                                                    } ${actionLoading === app.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {actionLoading === app.id ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : (
                                                    <FileText size={14} weight="bold" />
                                                )}
                                                {isEnrolledOrPaid && !overrideSettled[app.id] ? 'Settled' : (isPushed ? 'Resend' : 'Push')}
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAYMENTS AWAITING VERIFICATION (subsequent invoices) */}
            <div className="mt-12">
                <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                    <ShieldCheck size={20} weight="bold" className="text-amber-500" />
                    Payments Awaiting Verification
                    {pendingPayments.length > 0 && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{pendingPayments.length}</span>
                    )}
                </h2>
                <p className="text-neutral-500 text-sm mb-4">
                    These are payments students submitted through the secure checkout for additional invoices (e.g. 2nd instalments). Verify and accept each one to issue the official receipt.
                </p>

                <div className="bg-white border border-neutral-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="hidden md:table-header-group bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                <th className="p-4 font-bold text-neutral-600 text-xs uppercase">Applicant</th>
                                <th className="p-4 font-bold text-neutral-600 text-xs uppercase">Program</th>
                                <th className="p-4 font-bold text-neutral-600 text-xs uppercase">Invoice</th>
                                <th className="p-4 font-bold text-neutral-600 text-xs uppercase">Amount</th>
                                <th className="p-4 font-bold text-neutral-600 text-xs uppercase">Ref</th>
                                <th className="p-4 font-bold text-neutral-600 text-xs uppercase text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 block md:table-row-group">
                            {pendingPayments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-neutral-400 text-sm">
                                        No payments awaiting verification.
                                    </td>
                                </tr>
                            ) : (
                                pendingPayments.map((payment: any) => (
                                    <tr key={payment.id} className="hover:bg-neutral-50 transition-colors block md:table-row p-4 md:p-0">
                                        <td className="block md:table-cell py-2 md:p-4">
                                            <div className="font-bold text-neutral-900 text-sm">
                                                {payment.app?.user?.first_name || payment.app?.personal_info?.firstName || 'Student'} {payment.app?.user?.last_name || payment.app?.personal_info?.lastName || ''}
                                            </div>
                                            <div className="text-xs text-neutral-500">{payment.app?.user?.email || payment.app?.personal_info?.email || 'N/A'}</div>
                                        </td>
                                        <td className="block md:table-cell py-1 md:p-4 text-xs font-medium text-neutral-600">
                                            {payment.app?.program?.title || (payment.category === 'HOUSING' ? 'Housing Reservation' : 'Tuition')}
                                        </td>
                                        <td className="block md:table-cell py-2 md:p-4">
                                            <span className={`px-2 py-1 ${payment.category === 'HOUSING' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'} rounded-none text-[9px] font-bold uppercase flex items-center gap-1 w-fit`}>
                                                {payment.invoice_type?.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="block md:table-cell py-1 md:p-4 text-sm font-bold text-neutral-900">
                                            $ {payment.amount?.toLocaleString()}
                                        </td>
                                        <td className="block md:table-cell py-1 md:p-4 text-xs font-mono text-neutral-500 uppercase">
                                            {payment.transaction_reference || 'N/A'}
                                        </td>
                                        <td className="block md:table-cell pt-4 pb-2 md:p-4 text-right">
                                            <button
                                                onClick={() => handleVerifyPayment(payment)}
                                                disabled={verifyLoading === payment.id}
                                                className="inline-flex items-center justify-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-none text-xs font-bold uppercase tracking-widest hover:bg-neutral-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {verifyLoading === payment.id ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : (
                                                    <ShieldCheck size={14} weight="bold" />
                                                )}
                                                {verifyLoading === payment.id ? 'Verifying...' : 'Verify & Accept'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
