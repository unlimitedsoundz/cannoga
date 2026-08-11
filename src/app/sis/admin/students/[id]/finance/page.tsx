'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { StudentHeader } from '@/components/sis/StudentHeader';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { CreditCardIcon as CreditCard, FileText, CheckCircle, AlertTriangle, Download, Eye } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { getDocumentUrl } from '@/utils/document';

export const dynamic = 'force-dynamic';

interface Payment {
  id: string;
  amount: number;
  status: string;
  payment_method: string;
  transaction_reference: string | null;
  created_at: string;
  invoice_type?: string;
  currency?: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  type: string;
  term: string;
  amount: number;
  paid: number;
  balance: number;
  due_date: string;
  status: string;
  issued_date: string;
}

interface Offer {
  id: string;
  tuition_fee: number;
  payment_deadline: string;
  offer_type: string;
  status: string;
  invoice_type: string | null;
  invoice_pushed: boolean;
  invoice_sent_at: string | null;
  invoice_schedule?: any;
}

interface FinanceDocument {
  id: string;
  document_type: string;
  title: string;
  status: string;
  storage_path: string | null;
  issue_date: string | null;
  metadata: any;
}

interface FinancialSummary {
  tuitionFee: number;
  ancillaryFee: number;
  totalAnnual: number;
  totalInvoiced: number;
  totalPaid: number;
  totalBalance: number;
  outstandingBalance: number;
  depositPaid: boolean;
  fullTuitionPaid: boolean;
  housingPaid: boolean;
  paymentCount: number;
  pendingPayments: number;
}

interface StudentFinancialData {
  student: any;
  offer: Offer | null;
  payments: Payment[];
  invoices: Invoice[];
  financeDocuments: FinanceDocument[];
  summary: FinancialSummary;
}

export default function StudentFinancePage() {
  const params = useParams();
  const studentId = params.id as string;
  const [data, setData] = useState<StudentFinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetch(`/api/sis/admin/students/${studentId}/finance`).then(r => r.json());
        if (!result.success) throw new Error(result.error);
        setData(result.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load financial data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studentId]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div></div>;
  }

  if (error) {
    return <div className="p-8 bg-red-50 border border-red-100 rounded-none text-center"><p className="text-red-600 font-medium text-sm">{error}</p></div>;
  }

  if (!data) {
    return <div className="p-8 bg-neutral-50 border border-neutral-200 rounded-none text-center"><p className="text-neutral-600 font-medium text-sm">No financial data available</p></div>;
  }

  const { student, offer, payments, invoices, financeDocuments, summary } = data;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-CA');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'PARTIAL': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'OUTSTANDING': return 'text-red-700 bg-red-50 border-red-200';
      case 'OVERDUE': return 'text-red-700 bg-red-50 border-red-200';
      case 'verified':
      case 'COMPLETED': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'PENDING_VERIFICATION':
      case 'PENDING': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'FAILED': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  const getDocumentLabel = (type: string) => {
    const labels: Record<string, string> = {
      pal: 'Provincial Attestation Letter (PAL)',
      loa: 'Letter of Acceptance (LOA)',
      tuition_invoice: 'Tuition Invoice',
      tuition_receipt: 'Tuition Receipt',
      enrollment_confirmation: 'Enrollment Confirmation',
      transcript: 'Transcript',
      application_document: 'Application Document',
      other: 'Document',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Account"
        subtitle={`Financial details for ${student?.user?.first_name} ${student?.user?.last_name}`}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Base Tuition</div>
          <div className="text-2xl font-black text-neutral-900 mt-1">{formatCurrency(summary.tuitionFee)}</div>
        </div>
        <div className="bg-white border border-neutral-200 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ancillary Fees</div>
          <div className="text-2xl font-black text-neutral-900 mt-1">{formatCurrency(summary.ancillaryFee)}</div>
        </div>
        <div className="bg-white border border-neutral-200 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Paid</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{formatCurrency(summary.totalPaid)}</div>
        </div>
        <div className="bg-white border border-neutral-200 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Outstanding Balance</div>
          <div className={`text-2xl font-black mt-1 ${summary.outstandingBalance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {formatCurrency(summary.outstandingBalance)}
          </div>
        </div>
      </div>

      {/* Student & Program Information */}
      <div className="bg-white border border-neutral-200 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Student & Program Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-neutral-500">Student ID</span><span className="font-medium text-neutral-900">{student?.student_id || student?.user?.student_id || '—'}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Full Name</span><span className="font-medium text-neutral-900">{student?.user?.first_name} {student?.user?.last_name}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Email</span><span className="font-medium text-neutral-900">{student?.user?.email || '—'}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Phone</span><span className="font-medium text-neutral-900">{student?.user?.phone_number || '—'}</span></div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-neutral-500">Program</span><span className="font-medium text-neutral-900">{student?.course?.title || '—'}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Degree Level</span><span className="font-medium text-neutral-900">{student?.course?.degreeLevel || '—'}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Duration</span><span className="font-medium text-neutral-900">{student?.course?.duration ? `${student?.course.duration} years` : '—'}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">School</span><span className="font-medium text-neutral-900">{student?.course?.school?.name || '—'}</span></div>
          </div>
        </div>
      </div>

      {/* Tuition Breakdown */}
      <div className="bg-white border border-neutral-200 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Tuition Breakdown</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-neutral-100 pb-2">
            <span className="text-neutral-600">Base Tuition ({student?.course?.degreeLevel || 'Program'})</span>
            <span className="font-medium text-neutral-900">{formatCurrency(summary.tuitionFee)}</span>
          </div>
          <div className="flex justify-between border-b border-neutral-100 pb-2">
            <span className="text-neutral-600">Ancillary Fees</span>
            <span className="font-medium text-neutral-900">{formatCurrency(summary.ancillaryFee)}</span>
          </div>
          <div className="flex justify-between border-b border-neutral-100 pb-2">
            <span className="text-neutral-600">Total Annual</span>
            <span className="font-medium text-neutral-900">{formatCurrency(summary.totalAnnual)}</span>
          </div>
          <div className="flex justify-between border-b border-neutral-100 pb-2">
            <span className="text-neutral-600">Total Invoiced</span>
            <span className="font-medium text-neutral-900">{formatCurrency(summary.totalInvoiced)}</span>
          </div>
          <div className="flex justify-between border-b border-neutral-100 pb-2">
            <span className="text-neutral-600">Total Paid</span>
            <span className="font-medium text-emerald-600">{formatCurrency(summary.totalPaid)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Total Balance</span>
            <span className={`font-bold ${summary.totalBalance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{formatCurrency(summary.totalBalance)}</span>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div className="bg-white border border-neutral-200 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Payment Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex justify-between p-3 bg-neutral-50 rounded">
            <span className="text-neutral-600">Tuition Deposit</span>
            {summary.depositPaid ? (
              <span className="text-emerald-600 font-bold">Paid</span>
            ) : (
              <span className="text-red-600 font-bold">Pending</span>
            )}
          </div>
          <div className="flex justify-between p-3 bg-neutral-50 rounded">
            <span className="text-neutral-600">Full Tuition</span>
            {summary.fullTuitionPaid ? (
              <span className="text-emerald-600 font-bold">Paid</span>
            ) : (
              <span className="text-amber-600 font-bold">Outstanding</span>
            )}
          </div>
          <div className="flex justify-between p-3 bg-neutral-50 rounded">
            <span className="text-neutral-600">Housing</span>
            {summary.housingPaid ? (
              <span className="text-emerald-600 font-bold">Paid</span>
            ) : (
              <span className="text-slate-400">N/A</span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
          <div className="flex justify-between p-3 bg-neutral-50 rounded">
            <span className="text-neutral-600">Verified Payments</span>
            <span className="font-medium text-neutral-900">{summary.paymentCount}</span>
          </div>
          <div className="flex justify-between p-3 bg-neutral-50 rounded">
            <span className="text-neutral-600">Pending Verification</span>
            <span className="font-medium text-neutral-900">{summary.pendingPayments}</span>
          </div>
        </div>
      </div>

      {/* Offer & Invoice Details */}
      {offer && (
        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Offer & Invoice Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-neutral-500">Offer Status</span><StatusBadge status={offer.status} /></div>
            <div className="flex justify-between"><span className="text-neutral-500">Offer Type</span><span className="font-medium text-neutral-900">{offer.offer_type?.replace(/_/g, ' ') || '—'}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Invoice Type</span><span className="font-medium text-neutral-900">{offer.invoice_type?.replace(/_/g, ' ') || '—'}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Invoice Pushed</span><span className="font-medium text-neutral-900">{offer.invoice_pushed ? 'Yes' : 'No'}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Invoice Sent</span><span className="font-medium text-neutral-900">{formatDate(offer.invoice_sent_at)}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Payment Deadline</span><span className="font-medium text-neutral-900">{formatDate(offer.payment_deadline)}</span></div>
          </div>
        </div>
      )}

      {/* Invoices */}
      {invoices.length > 0 && (
        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Invoices</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Invoice #</th>
                  <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Type</th>
                  <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Term</th>
                  <th className="text-right px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Amount</th>
                  <th className="text-right px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Paid</th>
                  <th className="text-right px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Balance</th>
                  <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Status</th>
                  <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Issued</th>
                  <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-4 py-3 font-mono text-neutral-900">{invoice.invoice_number}</td>
                    <td className="px-4 py-3 text-neutral-600">{invoice.type}</td>
                    <td className="px-4 py-3 text-neutral-600">{invoice.term}</td>
                    <td className="px-4 py-3 text-right font-medium text-neutral-900">{formatCurrency(invoice.amount)}</td>
                    <td className="px-4 py-3 text-right text-emerald-600">{formatCurrency(invoice.paid)}</td>
                    <td className="px-4 py-3 text-right font-medium text-neutral-900">{formatCurrency(invoice.balance)}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(invoice.status)}`}>{invoice.status}</span></td>
                    <td className="px-4 py-3 text-neutral-600">{formatDate(invoice.issued_date)}</td>
                    <td className="px-4 py-3 text-neutral-600">{formatDate(invoice.due_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment History */}
      {payments.length > 0 && (
        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Payment History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Date</th>
                  <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Invoice Type</th>
                  <th className="text-right px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Amount</th>
                  <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Method</th>
                  <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Reference</th>
                  <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Currency</th>
                  <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-4 py-3 text-neutral-900">{formatDate(payment.created_at)}</td>
                    <td className="px-4 py-3 text-neutral-600">{payment.invoice_type?.replace(/_/g, ' ') || '—'}</td>
                    <td className="px-4 py-3 text-right font-medium text-neutral-900">{formatCurrency(payment.amount)}</td>
                    <td className="px-4 py-3 text-neutral-600">{payment.payment_method?.replace(/_/g, ' ') || '—'}</td>
                    <td className="px-4 py-3 font-mono text-neutral-600">{payment.transaction_reference || '—'}</td>
                    <td className="px-4 py-3 text-neutral-600">{payment.currency || 'CAD'}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(payment.status)}`}>{payment.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Finance Documents */}
      {financeDocuments.length > 0 && (
        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Finance Documents</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Document</th>
                  <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Type</th>
                  <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Status</th>
                  <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Issued</th>
                  <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {financeDocuments.map((doc) => (
                  <tr key={doc.id}>
                    <td className="px-4 py-3 font-medium text-neutral-900">{doc.title}</td>
                    <td className="px-4 py-3 text-neutral-600">{getDocumentLabel(doc.document_type)}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(doc.status)}`}>{doc.status}</span></td>
                    <td className="px-4 py-3 text-neutral-600">{formatDate(doc.issue_date)}</td>
                    <td className="px-4 py-3">
                      {getDocumentUrl(doc) !== '#' && (
                        <div className="flex gap-2">
                          <a href={getDocumentUrl(doc)} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-neutral-900">
                            <HugeiconsIcon icon={Eye} size={16} strokeWidth={2.5} />
                          </a>
                          <a href={getDocumentUrl(doc)} download className="text-neutral-600 hover:text-neutral-900">
                            <HugeiconsIcon icon={Download} size={16} strokeWidth={2.5} />
                          </a>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
