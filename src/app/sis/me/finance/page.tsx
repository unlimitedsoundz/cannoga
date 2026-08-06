'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { Tabs } from '@/components/sis/Tabs';
import { StudentHeader } from '@/components/sis/StudentHeader';
import { FinanceSummary } from '@/components/sis/FinanceSummary';
import { DataTable } from '@/components/sis/DataTable';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import { CreditCardIcon as CreditCard, DollarSignIcon as DollarSign, Calendar01Icon as Calendar, File01Icon as FileText, Download01Icon as Download, EyeIcon as Eye, FilterHorizontalIcon as Filter } from '@hugeicons/core-free-icons';
import { createClient } from '@/utils/supabase/client';

export const dynamic = 'force-dynamic';

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

interface Payment {
  id: string;
  date: string;
  reference: string;
  method: string;
  amount: number;
  status: string;
  invoice: string;
}

export default function MyFinancePage() {
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRecord = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          router.replace('/portal/account/login');
          return;
        }

        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select(`
            *,
            profiles(first_name, last_name, email)
          `)
          .eq('user_id', user.id)
          .single();

        if (studentError || !studentData) {
          console.log('No student record found');
          router.replace('/portal/dashboard');
          return;
        }

        setStudent(studentData);

        const { data: invoiceData, error: invoiceError } = await supabase
          .from('invoices')
          .select('*')
          .eq('student_id', studentData.id)
          .order('issued_date', { ascending: false });

        if (!invoiceError && invoiceData) {
          setInvoices(invoiceData.map((inv: any) => ({
            id: inv.id,
            invoice_number: inv.invoice_number,
            type: inv.type,
            term: inv.term,
            amount: Number(inv.amount) || 0,
            paid: Number(inv.paid) || 0,
            balance: Number(inv.balance) || 0,
            due_date: inv.due_date || '',
            status: inv.status,
            issued_date: inv.issued_date || '',
          })) as Invoice[]);
        }

        const { data: paymentData, error: paymentError } = await supabase
          .from('payments')
          .select('*')
          .eq('student_id', studentData.id)
          .order('payment_date', { ascending: false });

        if (!paymentError && paymentData) {
          setPayments(paymentData.map((pay: any) => ({
            id: pay.id,
            date: pay.payment_date ? new Date(pay.payment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
            reference: pay.transaction_reference,
            method: pay.payment_method.replace('_', ' '),
            amount: Number(pay.amount) || 0,
            status: pay.status,
            invoice: pay.invoice_id,
          })) as Payment[]);
        }
      } catch (e) {
        console.error('Error fetching student record:', e);
        router.replace('/portal/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecord();
  }, [router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Financial Account"
          subtitle="Loading..."
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
        </div>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  const studentId = student.student_id || '';
  const firstName = student.profiles?.first_name || '';
  const lastName = student.profiles?.last_name || '';
  const email = student.profiles?.email || '';
  const program = student.course?.title || '';
  const status = student.enrollment_status || '';
  
const tabs = [
    { label: 'Overview', href: '/sis/me/finance' },
    { label: 'Invoices', href: '/sis/me/finance/invoices' },
    { label: 'Payments', href: '/sis/me/finance/payments' },
    { label: 'Receipts', href: '/sis/me/finance/receipts' },
];

  // Financial summary from real data
  const totalBalance = invoices.reduce((sum, inv) => sum + (inv.balance || 0), 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + (inv.paid || 0), 0);
  const nextDueDate = invoices.length > 0 ? invoices[0].due_date : 'N/A';
  const nextDueAmount = invoices.length > 0 ? invoices[0].balance : 0;
  const lastPaymentDate = payments.length > 0 ? payments[0].date : 'N/A';
  const lastPaymentAmount = payments.length > 0 ? payments[0].amount : 0;
  const paymentStatus = totalBalance > 0 ? 'Outstanding' : 'Current';
  const holdAmount = 0;
  const refundAmount = 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Account"
        subtitle={`Student: ${studentId} • ${firstName} ${lastName}`}
      />

      <Tabs tabs={tabs} />

      <StudentHeader student={{
        id: (student as any).id || '1',
        firstName,
        lastName,
        studentId,
        email,
        program,
        school: '',
        academicLevel: '',
        startTerm: student.start_date ? new Date(student.start_date).toLocaleDateString('en-CA') : '',
        status,
        enrollmentStatus: student.enrollment_status,
        institutionalEmail: student.profiles?.email || '',
      }} />

      <FinanceSummary
        summary={{
          currentBalance: totalBalance,
          nextDueDate,
          nextDueAmount,
          lastPaymentDate,
          lastPaymentAmount,
          paymentStatus,
          holdAmount,
          refundAmount,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <HugeiconsIcon icon={FileText} size={18} strokeWidth={2} className="text-blue-600" />
              Invoices
            </h3>
            <button className="text-xs font-bold uppercase tracking-wider text-[#9c27b3] hover:underline">View All</button>
          </div>
          <DataTable
            columns={[
              { key: 'number', header: 'Invoice #', render: (i: Invoice) => <span className="font-mono font-medium text-neutral-900">{i.invoice_number}</span> },
              { key: 'type', header: 'Type' },
              { key: 'term', header: 'Term' },
              { key: 'amount', header: 'Amount', className: 'text-right', render: (i: Invoice) => <span className="font-mono text-neutral-900">${i.amount.toLocaleString()}</span> },
              { key: 'paid', header: 'Paid', className: 'text-right', render: (i: Invoice) => <span className="font-mono text-emerald-600">${i.paid.toLocaleString()}</span> },
              { key: 'balance', header: 'Balance', className: 'text-right', render: (i: Invoice) => <span className="font-mono text-red-600">${i.balance.toLocaleString()}</span> },
              { key: 'due_date', header: 'Due Date', render: (i: Invoice) => <span className="font-mono text-neutral-900">{i.due_date ? new Date(i.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span> },
              { key: 'status', header: 'Status', render: (i: Invoice) => <StatusBadge status={i.status} /> },
            ]}
            data={invoices}
            keyField="id"
            pagination={undefined}
            emptyMessage="No invoices found"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <HugeiconsIcon icon={CreditCard} size={18} strokeWidth={2} className="text-emerald-600" />
              Recent Payments
            </h3>
            <button className="text-xs font-bold uppercase tracking-wider text-[#9c27b3] hover:underline">View All</button>
          </div>
          <DataTable
            columns={[
              { key: 'date', header: 'Date' },
              { key: 'reference', header: 'Reference', render: (p: Payment) => <span className="font-mono text-xs text-neutral-600">{p.reference}</span> },
              { key: 'method', header: 'Method' },
              { key: 'amount', header: 'Amount', className: 'text-right', render: (p: Payment) => <span className="font-mono text-emerald-600">${p.amount.toLocaleString()}</span> },
              { key: 'status', header: 'Status', render: (p: Payment) => <StatusBadge status={p.status} /> },
              { key: 'invoice', header: 'Applied To', render: (p: Payment) => <span className="font-mono text-xs text-neutral-600">{p.invoice}</span> },
            ]}
            data={payments}
            keyField="id"
            pagination={undefined}
            emptyMessage="No payments found"
          />
        </div>
      </div>

      <div className="p-4 bg-neutral-50 border border-neutral-200">
        <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Payment Options</h4>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800">Make Payment</button>
          <button className="px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-100">Set Up Payment Plan</button>
          <button className="px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-100">View Tax Forms (T2202)</button>
        </div>
      </div>
    </div>
  );
}
