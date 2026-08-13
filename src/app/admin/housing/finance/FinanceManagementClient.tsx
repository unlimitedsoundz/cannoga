'use client';

import React, { useState } from 'react';
import {
    CurrencyEur as DollarSign,
    FileText,
    CreditCard,
    TrendUp,
    CheckCircle,
    XCircle,
    Clock,
    WarningCircle as AlertCircle,
    MagnifyingGlass as Search,
    Funnel as Filter,
    ArrowRight
} from "@phosphor-icons/react/dist/ssr";
import { formatToDDMMYYYY } from '@/utils/date';
import { SearchField } from '@/components/ui/SearchField';

import {
    batchGenerateInvoices,
    reconcilePayment,
    generateHousingInvoice,
    searchStudents,
    verifyHousingPaymentManually
} from '@/services/payment';

interface FinanceManagementClientProps {
    initialInvoices: any[];
    initialPayments: any[];
    students: any[];
}

export default function FinanceManagementClient({
    initialInvoices,
    initialPayments,
    students
}: FinanceManagementClientProps) {
    const [invoices, setInvoices] = useState(initialInvoices);
    const [payments, setPayments] = useState(initialPayments);
    const [selectedTab, setSelectedTab] = useState<'invoices' | 'payments'>('invoices');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [loading, setLoading] = useState(false);
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [batchMonth, setBatchMonth] = useState(new Date().getMonth() + 1);
    const [batchYear, setBatchYear] = useState(new Date().getFullYear());

    // Manual Verification State
    const [showManualVerifyModal, setShowManualVerifyModal] = useState(false);
    const [verifyInvoiceId, setVerifyInvoiceId] = useState<string | null>(null);
    const [verifyAmount, setVerifyAmount] = useState('');
    const [verifyMethod, setVerifyMethod] = useState('BANK_TRANSFER');

    // New Invoice State
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [invoiceStudentId, setInvoiceStudentId] = useState('');
    const [invoiceAmount, setInvoiceAmount] = useState('');
    const [invoiceDescription, setInvoiceDescription] = useState('');
    const [invoiceType, setInvoiceType] = useState('HOUSING_DEPOSIT');
    const [studentSearch, setStudentSearch] = useState('');
    const [studentResults, setStudentResults] = useState(students);
    const [studentApplications, setStudentApplications] = useState<any[]>([]);
    const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

    const stats = {
        totalRevenue: payments
            .filter(p => p.status === 'COMPLETED')
            .reduce((sum, p) => sum + Number(p.amount), 0),
        pendingInvoices: invoices.filter(i => i.status === 'PENDING').length,
        totalInvoiced: invoices.reduce((sum, i) => sum + Number(i.total_amount), 0),
        completionRate: invoices.length > 0
            ? Math.round((invoices.filter(i => i.status === 'PAID').length / invoices.length) * 100)
            : 0
    };

    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch =
            inv.reference_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${inv.student?.user?.first_name} ${inv.student?.user?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || inv.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const filteredPayments = payments.filter(pay => {
        const matchesSearch =
            pay.paygowire_transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${pay.student?.user?.first_name} ${pay.student?.user?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || pay.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleBatchGenerate = async () => {
        setLoading(true);
        try {
            const result = await batchGenerateInvoices(batchMonth, batchYear);
            if (result.success) {
                alert(`Successfully generated ${result.count} invoices.`);
                setShowBatchModal(false);
                // Refresh could be done via window.location.reload() or re-fetching
                window.location.reload();
            }
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReconcile = async (paymentId: string) => {
        if (!confirm('Are you sure you want to manually reconcile this payment?')) return;
        setLoading(true);
        try {
            const result = await reconcilePayment(paymentId);
            if (result.success) {
                alert('Payment reconciled successfully.');
                window.location.reload();
            }
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID':
            case 'COMPLETED':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'PENDING_VERIFICATION':
                return 'bg-blue-100 text-blue-700 border-blue-200 ring-2 ring-blue-500 ring-opacity-20';
            case 'PENDING':
            case 'PROCESSING':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'FAILED':
            case 'CANCELLED':
            case 'OVERDUE':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-neutral-100 text-neutral-700 border-neutral-200';
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter mb-1">Finance Console</h1>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                        Housing Payments & Invoice Management
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowInvoiceModal(true)}
                        className="px-4 py-2 border-2 border-[#0a151a] text-black rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-50 transition-all"
                    >
                        New Individual Invoice
                    </button>
                    <button
                        onClick={() => setShowBatchModal(true)}
                        className="px-4 py-2 bg-[#0a151a] text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all"
                    >
                        Generate Batch Invoices
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border-2 border-[#0a151a] p-6 rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                    <div className="flex justify-between items-start mb-2">
                        <TrendUp size={20} weight="bold" className="text-neutral-400" />
                        <span className="text-[8px] font-black uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+12% vs last mo</span>
                    </div>
                    <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Total Revenue</p>
                    <p className="text-2xl font-black">${stats.totalRevenue.toLocaleString()}</p>
                </div>

                <div className="bg-white border-2 border-[#0a151a] p-6 rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                    <Clock size={20} weight="bold" className="text-amber-500 mb-2" />
                    <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Pending Invoices</p>
                    <p className="text-2xl font-black">{stats.pendingInvoices}</p>
                </div>

                <div className="bg-white border-2 border-[#0a151a] p-6 rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                    <FileText size={20} weight="bold" className="text-neutral-400 mb-2" />
                    <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Total Invoiced</p>
                    <p className="text-2xl font-black">${stats.totalInvoiced.toLocaleString()}</p>
                </div>

                <div className="bg-white border-2 border-[#0a151a] p-6 rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                    <CheckCircle size={20} weight="bold" className="text-neutral-400 mb-2" />
                    <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Collection Rate</p>
                    <p className="text-2xl font-black">{stats.completionRate}%</p>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white border-2 border-[#0a151a] p-4 rounded-sm flex flex-col md:flex-row gap-4">
                <SearchField
                    placeholder="Search by student or reference..."
                    value={searchTerm}
                    onChange={(v) => setSearchTerm(v)}
                />
                <div className="flex gap-2">
                    <select
                        className="px-4 py-2 border-2 border-neutral-100 focus:border-[#0a151a] outline-none transition-all text-[10px] font-black uppercase tracking-widest bg-white"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="PAID">Paid</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="OVERDUE">Overdue</option>
                    </select>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b-2 border-neutral-200">
                <div className="flex gap-8">
                    <button
                        onClick={() => setSelectedTab('invoices')}
                        className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${selectedTab === 'invoices' ? 'text-black' : 'text-neutral-400 hover:text-neutral-600'
                            }`}
                    >
                        Invoices
                        {selectedTab === 'invoices' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#0a151a]" />}
                    </button>
                    <button
                        onClick={() => setSelectedTab('payments')}
                        className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${selectedTab === 'payments' ? 'text-black' : 'text-neutral-400 hover:text-neutral-600'
                            }`}
                    >
                        Payments
                        {selectedTab === 'payments' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#0a151a]" />}
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b-2 border-[#0a151a]">
                            <th className="text-left py-4 px-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">Reference / ID</th>
                            <th className="text-left py-4 px-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">Student</th>
                            <th className="text-left py-4 px-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">Amount</th>
                            <th className="text-left py-4 px-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">Status</th>
                            <th className="text-left py-4 px-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">Date</th>
                            <th className="text-right py-4 px-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedTab === 'invoices' ? (
                            filteredInvoices.map((inv) => (
                                <tr key={inv.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                                    <td className="py-4 px-2">
                                        <p className="font-black text-sm">{inv.reference_number}</p>
                                    </td>
                                    <td className="py-4 px-2">
                                        <p className="font-bold text-sm">{inv.student?.user?.first_name} {inv.student?.user?.last_name}</p>
                                        <p className="text-[8px] font-bold text-neutral-400 uppercase">ID: {inv.student?.id}</p>
                                    </td>
                                    <td className="py-4 px-2">
                                        <p className="font-black">${Number(inv.total_amount).toLocaleString()}</p>
                                    </td>
                                    <td className="py-4 px-2">
                                        <span className={`px-2 py-1 border-2 rounded-sm text-[8px] font-black uppercase ${getStatusColor(inv.status)}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-2 text-[10px] font-bold text-neutral-500 uppercase">
                                        {formatToDDMMYYYY(inv.created_at)}
                                    </td>
                                    <td className="py-4 px-2 text-right">
                                        <div className="flex justify-end gap-2">
                                            {inv.status !== 'PAID' && (
                                                <button
                                                    onClick={() => {
                                                        setVerifyInvoiceId(inv.id);
                                                        setVerifyAmount((inv.total_amount - (inv.paid_amount || 0)).toString());
                                                        setShowManualVerifyModal(true);
                                                    }}
                                                    title="Mark as Paid (Manual)"
                                                    className="p-2 border border-neutral-200 rounded-sm hover:border-green-500 hover:text-green-600 transition-all text-green-600"
                                                >
                                                    <DollarSign size={14} weight="bold" />
                                                </button>
                                            )}
                                            <button className="p-2 border border-neutral-200 rounded-sm hover:border-[#0a151a] transition-all">
                                                <AlertCircle size={14} weight="bold" />
                                            </button>
                                            <button className="p-2 border border-neutral-200 rounded-sm hover:border-[#0a151a] transition-all">
                                                <ArrowRight size={14} weight="bold" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            filteredPayments.map((pay) => (
                                <tr key={pay.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                                    <td className="py-4 px-2">
                                        <p className="font-black text-sm truncate max-w-[120px]">{pay.paygowire_transaction_id || pay.id.slice(0, 8)}</p>
                                        <p className="text-[8px] font-bold text-neutral-400 uppercase">{pay.invoice?.reference_number}</p>
                                    </td>
                                    <td className="py-4 px-2">
                                        <p className="font-bold text-sm">{pay.student?.user?.first_name} {pay.student?.user?.last_name}</p>
                                        <p className="text-[8px] font-bold text-neutral-400 uppercase">Method: {pay.payment_method}</p>
                                    </td>
                                    <td className="py-4 px-2">
                                        <p className="font-black">${Number(pay.amount).toLocaleString()}</p>
                                    </td>
                                    <td className="py-4 px-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 border-2 rounded-sm text-[8px] font-black uppercase ${getStatusColor(pay.status)}`}>
                                                {pay.status}
                                            </span>
                                            {pay.verified && (
                                                <span title="Verified by Admin">
                                                    <CheckCircle size={14} weight="fill" className="text-green-500" />
                                                </span>
                                            )}
                                        </div>
                                        {pay.metadata?.proof_path && (
                                            <a
                                                href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/housing_payments/${pay.metadata.proof_path}`}
                                                target="_blank"
                                                className="text-[8px] font-black text-blue-600 hover:underline flex items-center gap-1 mt-1"
                                            >
                                                <FileText size={10} /> View Proof
                                            </a>
                                        )}
                                    </td>
                                    <td className="py-4 px-2 text-[10px] font-bold text-neutral-500 uppercase">
                                        {formatToDDMMYYYY(pay.created_at)}
                                    </td>
                                    <td className="py-4 px-2 text-right">
                                        <div className="flex justify-end gap-2">
                                            {(pay.status === 'PENDING_VERIFICATION' || pay.status === 'PENDING') && (
                                                <button
                                                    onClick={() => handleReconcile(pay.id)}
                                                    disabled={loading}
                                                    title="Verify & Reconcile"
                                                    className="p-2 border-2 border-green-500 text-green-600 rounded-sm hover:bg-green-50 transition-all disabled:opacity-50"
                                                >
                                                    <CheckCircle size={14} weight="bold" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {(selectedTab === 'invoices' ? filteredInvoices : filteredPayments).length === 0 && (
                <div className="py-20 text-center bg-white border-2 border-dashed border-neutral-200 rounded-sm">
                    <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">No records found matching your filters.</p>
                </div>
            )}

            {/* Batch Modal */}
            {showBatchModal && (
                <div className="fixed inset-0 bg-[#0a151a]/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white border-4 border-[#0a151a] p-8 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-xl font-black uppercase mb-4">Batch Invoice Generation</h2>
                        <p className="text-sm text-neutral-600 mb-6 font-bold uppercase tracking-tight">
                            Select the month and year to generate rent invoices for all active housing assignments.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Month</label>
                                <select
                                    className="w-full px-2 py-1 border-2 border-[#0a151a] font-bold outline-none"
                                    value={batchMonth}
                                    onChange={(e) => setBatchMonth(Number(e.target.value))}
                                >
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2026, i))}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Year</label>
                                <select
                                    className="w-full px-2 py-1 border-2 border-[#0a151a] font-bold outline-none"
                                    value={batchYear}
                                    onChange={(e) => setBatchYear(Number(e.target.value))}
                                >
                                    <option value={2026}>2026</option>
                                    <option value={2027}>2027</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowBatchModal(false)}
                                className="flex-1 py-3 border-2 border-[#0a151a] text-[10px] font-black uppercase tracking-widest hover:bg-neutral-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBatchGenerate}
                                disabled={loading}
                                className="flex-1 py-3 bg-[#0a151a] text-white text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Generating...' : 'Run Batch'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Individual Invoice Modal */}
            {showInvoiceModal && (
                <div className="fixed inset-0 bg-[#0a151a]/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white border-4 border-[#0a151a] p-8 max-w-lg w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-xl font-black uppercase mb-4">Create Individual Invoice</h2>
                        <p className="text-sm text-neutral-600 mb-6 font-bold uppercase tracking-tight">
                            Generate a custom invoice for a specific student.
                        </p>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Select Student</label>
                                <div className="relative">
                                <SearchField
                                    placeholder="Search by name or ID..."
                                    value={studentSearch}
                                    onChange={async (v) => {
                                        setStudentSearch(v);
                                        if (v.length > 2) {
                                            const res = await searchStudents(v);
                                            setStudentResults(res);
                                        } else if (v.length === 0) {
                                            setStudentResults(students);
                                        }
                                    }}
                                />
                                    {studentSearch && invoiceStudentId === '' && (
                                        <div className="bg-white border-2 border-[#0a151a] max-h-40 overflow-y-auto mb-4">
                                            {studentResults.map(s => (
                                                <button
                                                    key={s.id}
                                                    type="button"
                                                    onClick={async () => {
                                                        setInvoiceStudentId(s.id);
                                                        setStudentSearch(`${s.user?.first_name} ${s.user?.last_name}`);
                                                        setStudentResults([]);
                                                        
                                                        // Fetch applications for this student
                                                        const { createClient } = await import('@/utils/supabase/client');
                                                        const supabase = createClient();
                                                        const { data: apps } = await supabase
                                                            .from('housing_applications')
                                                            .select('*, semester:semesters(name)')
                                                            .eq('student_id', s.id)
                                                            .order('created_at', { ascending: false });
                                                        
                                                        setStudentApplications(apps || []);
                                                        if (apps && apps.length > 0) {
                                                            setSelectedApplicationId(apps[0].id);
                                                        }
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-xs font-bold uppercase hover:bg-neutral-50 ${invoiceStudentId === s.id ? 'bg-neutral-100' : ''}`}
                                                >
                                                    {s.user?.first_name} {s.user?.last_name} ({s.student_id})
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {invoiceStudentId && (
                                        <button
                                            onClick={() => {
                                                setInvoiceStudentId('');
                                                setStudentSearch('');
                                                setStudentResults(students);
                                                setStudentApplications([]);
                                                setSelectedApplicationId(null);
                                            }}
                                            className="text-[8px] font-bold text-red-500 uppercase tracking-widest mt-1 hover:underline"
                                        >
                                            Change Student
                                        </button>
                                    )}
                                </div>
                                {invoiceStudentId && studentApplications.length > 0 && (
                                    <div className="mt-4">
                                        <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Link to Application</label>
                                        <select
                                            className="w-full px-4 py-3 border-2 border-[#0a151a] font-bold outline-none bg-white text-xs font-bold uppercase"
                                            value={selectedApplicationId || ''}
                                            onChange={(e) => setSelectedApplicationId(e.target.value)}
                                        >
                                            <option value="">Do Not Link</option>
                                            {studentApplications.map(app => (
                                                <option key={app.id} value={app.id}>
                                                    {app.semester?.name} - {app.status} ({new Date(app.created_at).toLocaleDateString()})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Amount ($)</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 border-2 border-[#0a151a] font-bold outline-none"
                                        placeholder="0.00"
                                        value={invoiceAmount}
                                        onChange={(e) => setInvoiceAmount(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Type</label>
                                    <select
                                        className="w-full px-4 py-3 border-2 border-[#0a151a] font-bold outline-none bg-white"
                                        value={invoiceType}
                                        onChange={(e) => setInvoiceType(e.target.value)}
                                    >
                                        <option value="HOUSING_DEPOSIT">Deposit</option>
                                        <option value="MONTHLY_RENT">Monthly Rent</option>
                                        <option value="UTILITIES">Utilities</option>
                                        <option value="CLEANING_FEE">Cleaning Fee</option>
                                        <option value="LATE_FEE">Late Fee</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Description</label>
                                <textarea
                                    className="w-full px-4 py-3 border-2 border-[#0a151a] font-bold outline-none"
                                    rows={2}
                                    placeholder="e.g., Security Deposit for Block A"
                                    value={invoiceDescription}
                                    onChange={(e) => setInvoiceDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setShowInvoiceModal(false);
                                    setInvoiceStudentId('');
                                    setStudentSearch('');
                                    setInvoiceAmount('');
                                    setInvoiceDescription('');
                                }}
                                className="flex-1 py-3 border-2 border-[#0a151a] text-[10px] font-black uppercase tracking-widest hover:bg-neutral-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    if (!invoiceStudentId || !invoiceAmount || !invoiceDescription) {
                                        alert('Please fill all fields');
                                        return;
                                    }
                                    setLoading(true);
                                    try {
                                        await generateHousingInvoice(invoiceStudentId, selectedApplicationId, [
                                            {
                                                description: invoiceDescription,
                                                type: invoiceType,
                                                amount: Number(invoiceAmount)
                                            }
                                        ]);
                                        alert('Invoice generated successfully');
                                        window.location.reload();
                                    } catch (err: any) {
                                        alert(err.message);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                disabled={loading}
                                className="flex-1 py-3 bg-[#0a151a] text-white text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Generating...' : 'Create Invoice'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Manual Verification Modal */}
            {showManualVerifyModal && (
                <div className="fixed inset-0 bg-[#0a151a]/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white border-4 border-[#0a151a] p-8 max-w-sm w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-xl font-black uppercase mb-4">Manual Payment Verification</h2>
                        <p className="text-sm text-neutral-600 mb-6 font-bold uppercase tracking-tight">
                            Confirm receipt of payment outside the system (e.g., Cash, Bank Transfer).
                        </p>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Amount Received ($)</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 border-2 border-[#0a151a] font-bold outline-none"
                                    value={verifyAmount}
                                    onChange={(e) => setVerifyAmount(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Payment Method</label>
                                <select
                                    className="w-full px-4 py-3 border-2 border-[#0a151a] font-bold outline-none bg-white"
                                    value={verifyMethod}
                                    onChange={(e) => setVerifyMethod(e.target.value)}
                                >
                                    <option value="BANK_TRANSFER">Bank Transfer</option>
                                    <option value="CASH">Cash</option>
                                    <option value="CHECK">Check</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setShowManualVerifyModal(false);
                                    setVerifyInvoiceId(null);
                                    setVerifyAmount('');
                                }}
                                className="flex-1 py-3 border-2 border-[#0a151a] text-[10px] font-black uppercase tracking-widest hover:bg-neutral-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    if (!verifyInvoiceId || !verifyAmount) return;
                                    setLoading(true);
                                    try {
                                        await verifyHousingPaymentManually(
                                            verifyInvoiceId,
                                            Number(verifyAmount),
                                            verifyMethod as any,
                                            'Manual verification by admin'
                                        );
                                        alert('Payment verified & recorded successfully');
                                        window.location.reload();
                                    } catch (err: any) {
                                        alert(err.message);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                disabled={loading}
                                className="flex-1 py-3 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Verifying...' : 'Confirm Payment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

