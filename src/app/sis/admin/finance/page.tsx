'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { ActionToolbar } from '@/components/sis/ActionToolbar';
import { DataTable } from '@/components/sis/DataTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { FilterBar } from '@/components/sis/FilterBar';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { toast } from 'sonner';
import { CreditCardIcon as CreditCard, ArrowRightIcon as ArrowRight, FilterHorizontalIcon as Filter, Search01Icon as Search, BankIcon, Exchange01Icon, ListViewIcon, Settings01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { getSISFinanceAccounts, getSISCourseMap, verifySISTuitionPayment } from '../actions';

interface FinanceRow {
  id: string;
  student_id: string;
  enrollment_status: string;
  program_id: string;
  tuition_deposit_paid: boolean;
  tuition_deposit_paid_at: string | null;
  full_tuition_paid: boolean;
  full_tuition_paid_at: string | null;
  housing_fee_paid: boolean;
  housing_fee_paid_at: string | null;
  account_type: 'student' | 'application';
  user?: { first_name: string; last_name: string; email: string }[];
  course?: { title: string; school?: { name: string }[]; degreeLevel?: string; duration?: string }[];
  offer?: { id: string; tuition_fee: number; payment_deadline: string; offer_type: string; status: string; invoice_type?: string; invoice_pushed?: boolean; invoice_sent_at?: string }[];
  payments?: {
    id: string;
    amount: number;
    status: string;
    transaction_reference?: string;
    payment_method?: string;
    created_at: string;
  }[];
}

export default function FinancePage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<FinanceRow[]>([]);
  const [courseMap, setCourseMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifyLoading, setVerifyLoading] = useState<string | null>(null);

  const handleVerifyPayment = async (paymentId: string, applicationId: string) => {
    setVerifyLoading(paymentId);
    try {
      const result = await verifySISTuitionPayment(paymentId, applicationId);
      if (result.success) {
        toast.success('Payment verified successfully');
        window.location.reload();
      } else {
        toast.error(result.error || 'Failed to verify payment');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to verify payment');
    } finally {
      setVerifyLoading(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [financeResult, courseResult] = await Promise.all([
          getSISFinanceAccounts(),
          getSISCourseMap()
        ]);
        if (!financeResult.success) throw new Error(financeResult.error);
        setData(financeResult.data || []);
        setCourseMap(courseResult.data || {});
      } catch (err: any) {
        setError(err.message || 'Failed to load finance data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div></div>;
  }

  if (error) {
    return <div className="p-8 bg-red-50 border border-red-100 rounded-none text-center"><p className="text-red-600 font-medium text-sm">{error}</p></div>;
  }

  const filtered = data.filter(s => {
    const matchesSearch = !search ||
      s.student_id?.toLowerCase().includes(search.toLowerCase()) ||
      s.user?.[0]?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.user?.[0]?.last_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.user?.[0]?.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.program_id?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || s.enrollment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'student_id',
      header: 'Student ID',
      render: (s: FinanceRow) => <span className="font-mono font-medium text-neutral-900">{s.student_id}</span>,
    },
    {
      key: 'name',
      header: 'Student',
      render: (s: FinanceRow) => (
        <div>
          <div className="font-medium text-neutral-900">{s.user?.[0]?.first_name} {s.user?.[0]?.last_name}</div>
          <div className="text-xs text-neutral-500 font-mono">{s.user?.[0]?.email}</div>
        </div>
      ),
    },
    { key: 'program', header: 'Program', render: (s: FinanceRow) => courseMap[s.program_id] || s.course?.[0]?.title || '—' },
    {
      key: 'tuition_deposit',
      header: 'Deposit',
      render: (s: FinanceRow) => s.tuition_deposit_paid ? (
        <span className="text-emerald-600 text-xs font-bold uppercase">Paid</span>
      ) : (
        <span className="text-red-600 text-xs font-bold uppercase">Pending</span>
      ),
    },
    {
      key: 'full_tuition',
      header: 'Full Tuition',
      render: (s: FinanceRow) => s.full_tuition_paid ? (
        <span className="text-emerald-600 text-xs font-bold uppercase">Paid</span>
      ) : (
        <span className="text-amber-600 text-xs font-bold uppercase">Outstanding</span>
      ),
    },
    {
      key: 'housing',
      header: 'Housing',
      render: (s: FinanceRow) => s.housing_fee_paid ? (
        <span className="text-emerald-600 text-xs font-bold uppercase">Paid</span>
      ) : (
        <span className="text-slate-400 text-xs">N/A</span>
      ),
    },
    {
      key: 'enrollment_status',
      header: 'Status',
      render: (s: FinanceRow) => <StatusBadge status={s.enrollment_status} />,
    },
    {
      key: 'payment',
      header: 'Payment',
      render: (s: FinanceRow) => {
        if (s.account_type === 'student' || !s.payments || s.payments.length === 0) {
          return <span className="text-slate-400 text-xs">N/A</span>;
        }
        const latestPayment = s.payments[0];
        return (
          <div>
            <p className="text-sm font-bold text-black">${Number(latestPayment.amount).toLocaleString()}</p>
            <p className={`text-xs font-bold uppercase ${latestPayment.status === 'COMPLETED' || latestPayment.status === 'verified' ? 'text-emerald-600' : 'text-amber-600'}`}>
              {latestPayment.status?.replace(/_/g, ' ') || 'Pending'}
            </p>
            {latestPayment.transaction_reference && (
              <p className="text-[10px] text-neutral-500 font-mono">{latestPayment.transaction_reference}</p>
            )}
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (s: FinanceRow) => {
        if (s.account_type === 'student') {
          return (
            <Link href={`/sis/admin/students/${s.id}/finance`} className="text-xs font-bold uppercase tracking-wider text-[#0a151a] hover:underline no-underline">
              View Financials
            </Link>
          );
        }
        const pendingPayment = s.payments?.find((p: any) => p.status === 'PENDING_VERIFICATION' || p.status === 'verified');
        return (
          <div className="flex flex-col gap-2">
            <Link href={`/sis/admin/admissions/${s.id}`} className="text-xs font-bold uppercase tracking-wider text-[#0a151a] hover:underline no-underline">
              View Application
            </Link>
            {pendingPayment && (
              <button
                onClick={() => handleVerifyPayment(pendingPayment.id, s.id)}
                disabled={verifyLoading === pendingPayment.id}
                className="text-xs font-bold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 px-2 py-1 rounded-sm disabled:opacity-50"
              >
                {verifyLoading === pendingPayment.id ? 'Verifying...' : 'Verify & Accept'}
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance Administration"
        subtitle="Manage student accounts, tuition, invoices, and payments"
      />

      {/* Finance Settings & Tools Nav */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { href: '/sis/admin/finance/verification-queue', icon: CreditCard, label: 'Wire Verification Queue', desc: 'Review & approve pending wire transfers', badge: 'Pending', badgeColor: 'amber' },
          { href: '/sis/admin/finance/settings/purposes', icon: ListViewIcon, label: 'Payment Purposes', desc: 'Manage available payment types for students', badge: null, badgeColor: '' },
          { href: '/sis/admin/finance/settings/banks', icon: BankIcon, label: 'Bank Accounts', desc: 'Institutional accounts per country', badge: null, badgeColor: '' },
          { href: '/sis/admin/finance/settings/rates', icon: Exchange01Icon, label: 'Exchange Rates', desc: 'Manage CAD → local currency rates', badge: null, badgeColor: '' },
        ].map(({ href, icon, label, desc, badge, badgeColor }) => (
          <Link
            key={href}
            href={href}
            className="flex items-start gap-3 bg-neutral-900/80 border border-white/10 rounded-xl p-4 hover:border-white/20 hover:bg-neutral-800/80 transition-all no-underline group shadow-sm"
          >
            <div className="w-8 h-8 bg-neutral-800 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-neutral-700 transition-colors border border-white/5">
              <HugeiconsIcon icon={icon} size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white group-hover:text-amber-400 transition-colors">{label}</span>
                {badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{desc}</p>
            </div>
            <HugeiconsIcon icon={ArrowRight} size={12} className="text-slate-500 group-hover:text-white transition-colors shrink-0 mt-1" />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-neutral-900/80 border border-white/10 rounded-xl p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Accounts</div>
          <div className="text-2xl font-black text-white mt-1">{data.length}</div>
        </div>
        <div className="bg-neutral-900/80 border border-white/10 rounded-xl p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Deposit Paid</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{data.filter(s => s.tuition_deposit_paid).length}</div>
        </div>
        <div className="bg-neutral-900/80 border border-white/10 rounded-xl p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Tuition Paid</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{data.filter(s => s.full_tuition_paid).length}</div>
        </div>
        <div className="bg-neutral-900/80 border border-white/10 rounded-xl p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Outstanding</div>
          <div className="text-2xl font-black text-red-400 mt-1">{data.filter(s => !s.full_tuition_paid || s.account_type === 'application').length}</div>
        </div>
      </div>


      <ActionToolbar
        search={<SearchBar value={search} onChange={setSearch} placeholder="Search by student ID, name, email, program..." />}
        filter={
          <FilterBar
                        filters={[
              { key: 'status', label: 'Status', value: statusFilter, onChange: setStatusFilter, options: [
                { value: '', label: 'All Statuses' },
                { value: 'ACTIVE', label: 'Active' },
                { value: 'ON_LEAVE', label: 'On Leave' },
                { value: 'PROBATION', label: 'Probation' },
                { value: 'GRADUATED', label: 'Graduated' },
                { value: 'WITHDRAWN', label: 'Withdrawn' },
                { value: 'OFFER_ACCEPTED', label: 'Offer Accepted' },
                { value: 'PAYMENT_SUBMITTED', label: 'Payment Submitted' },
              ]},
            ]}
          />}
      />

      <DataTable
        columns={columns}
        data={filtered}
        keyField="id"
        pagination={{ page, pageSize: 10, total: filtered.length, onPageChange: setPage }}
        emptyMessage="No student accounts found"
      />
    </div>
  );
}