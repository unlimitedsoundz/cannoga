'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { StudentHeader } from '@/components/sis/StudentHeader';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { CreditCardIcon as CreditCard, FileText, CheckCircle, AlertTriangle } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export const dynamic = 'force-dynamic';

interface Payment {
  id: string;
  amount: number;
  status: string;
  payment_method: string;
  transaction_reference: string | null;
  created_at: string;
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
}

interface FinancialSummary {
  tuitionFee: number;
  totalPaid: number;
  outstandingBalance: number;
  depositPaid: boolean;
  fullTuitionPaid: boolean;
  housingPaid: boolean;
}

interface StudentFinancialData {
  student: any;
  offer: Offer | null;
  payments: Payment[];
  invoices: Payment[];
  summary: FinancialSummary;
}

export default function StudentFinancePage({ params }: { params: { id: string } }) {
  const studentId = params.id;
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

  const { student, offer, payments, summary } = data;

  return (
    <div className="space-y-6">
      <PageHeader title="Financial Account" subtitle={`Financial details for ${student?.user?.first_name} ${student?.user?.last_name}`} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Tuition</div>
          <div className="text-2xl font-black text-neutral-900 mt-1">${Number(summary.tuitionFee).toLocaleString()}</div>
        </div>
        <div className="bg-white border border-neutral-200 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Paid</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">${Number(summary.totalPaid).toLocaleString()}</div>
        </div>
        <div className="bg-white border border-neutral-200 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Outstanding Balance</div>
          <div className={`text-2xl font-black mt-1 ${summary.outstandingBalance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            ${Number(summary.outstandingBalance).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Account Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-neutral-500">Student ID</span><span className="font-medium text-neutral-900">{student?.student_id || 'â€”'}</span></div>
          <div className="flex justify-between"><span className="text-neutral-500">Program</span><span className="font-medium text-neutral-900">{student?.course?.title || 'â€”'}</span></div>
          <div className="flex justify-between"><span className="text-neutral-500">Tuition Deposit</span>{summary.depositPaid ? <span className="text-emerald-600 font-bold">Paid</span> : <span className="text-red-600 font-bold">Pending</span>}</div>
          <div className="flex justify-between"><span className="text-neutral-500">Full Tuition</span>{summary.fullTuitionPaid ? <span className="text-emerald-600 font-bold">Paid</span> : <span className="text-amber-600 font-bold">Outstanding</span>}</div>
          <div className="flex justify-between"><span className="text-neutral-500">Housing</span>{summary.housingPaid ? <span className="text-emerald-600 font-bold">Paid</span> : <span className="text-neutral-400">N/A</span>}</div>
          {offer && (
            <>
              <div className="flex justify-between"><span className="text-neutral-500">Offer Status</span><StatusBadge status={offer.status} /></div>
              <div className="flex justify-between"><span className="text-neutral-500">Payment Deadline</span><span className="font-medium text-neutral-900">{offer.payment_deadline ? new Date(offer.payment_deadline).toLocaleDateString('en-CA') : 'â€”'}</span></div>
            </>
          )}
        </div>
      </div>

      {payments.length > 0 && (
        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Payment History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Date</th>
                  <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Amount</th>
                  <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Method</th>
                  <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Reference</th>
                  <th className="text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-4 py-3 text-neutral-900">{new Date(payment.created_at).toLocaleDateString('en-CA')}</td>
                    <td className="px-4 py-3 font-medium text-neutral-900">${Number(payment.amount).toLocaleString()}</td>
                    <td className="px-4 py-3 text-neutral-600">{payment.payment_method || 'â€”'}</td>
                    <td className="px-4 py-3 font-mono text-neutral-600">{payment.transaction_reference || 'â€”'}</td>
                    <td className="px-4 py-3"><StatusBadge status={payment.status} /></td>
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

