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
  invoice_type?: string;
}

export default function MyFinancePage() {
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tuitionFee, setTuitionFee] = useState<number>(0);
  const [paymentDeadline, setPaymentDeadline] = useState<string>('');
  const [admissionOffer, setAdmissionOffer] = useState<any>(null);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRecord = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          router.replace('/portal/account/login/');
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
          router.replace('/portal/dashboard/');
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

        let tuitionPayments: any[] = [];
        let fetchedTuitionFee = 0;
        let fetchedPaymentDeadline = '';
        try {
            const { data: studentApp } = await supabase
                .from('students')
                .select('application_id')
                .eq('id', studentData.id)
                .single();

            if (studentApp?.application_id) {
                const { data: offerData } = await supabase
                    .from('admission_offers')
                    .select('id, tuition_fee, payment_deadline, invoice_pushed')
                    .eq('application_id', studentApp.application_id)
                    .maybeSingle();

                if (offerData) {
                    fetchedTuitionFee = Number(offerData.tuition_fee || 0);
                    fetchedPaymentDeadline = offerData.payment_deadline || '';
                    setAdmissionOffer(offerData);
                }

                const offerIds = offerData ? [offerData.id] : [];
                if (offerIds.length > 0) {
                    const { data: tpData } = await supabase
                        .from('tuition_payments')
                        .select('*')
                        .in('offer_id', offerIds)
                        .order('created_at', { ascending: false });

                    tuitionPayments = tpData || [];
                }
            }
        } catch (paymentErr) {
            console.error('Error fetching tuition payments:', paymentErr);
        }

        if (tuitionPayments.length > 0) {
          setPayments(tuitionPayments.map((pay: any) => ({
            id: pay.id,
            date: pay.created_at ? new Date(pay.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
            reference: pay.transaction_reference || '',
            method: pay.payment_method?.replace('_', ' ') || '',
            amount: Number(pay.amount) || 0,
            status: pay.status || '',
            invoice: pay.offer_id || '',
            invoice_type: pay.invoice_type,
          })) as Payment[]);
        }
        setTuitionFee(fetchedTuitionFee);
        setPaymentDeadline(fetchedPaymentDeadline);
      } catch (e) {
        console.error('Error fetching student record:', e);
        router.replace('/portal/dashboard/');
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
  const totalPaidFromPayments = payments
    .filter((p: any) => p.status === 'COMPLETED' || p.status === 'verified')
    .reduce((sum: number, p: any) => sum + Number(p.amount), 0);

  let totalBalance = invoices.reduce((sum, inv) => sum + (inv.balance || 0), 0);

  if (invoices.length === 0 && tuitionFee > 0) {
    totalBalance = Math.max(0, tuitionFee - totalPaidFromPayments);
  }

  const totalPaid = invoices.reduce((sum, inv) => sum + (inv.paid || 0), 0);
  const nextDueDate = invoices.length > 0 ? invoices[0].due_date : (paymentDeadline || 'N/A');
  const nextDueAmount = invoices.length > 0 ? invoices[0].balance : totalBalance;
  const lastPaymentDate = payments.length > 0 ? payments[0].date : 'N/A';
  const lastPaymentAmount = payments.length > 0 ? payments[0].amount : 0;
  const paymentStatus = totalBalance > 0 ? 'Outstanding' : 'Current';
  const holdAmount = 0;
  const refundAmount = 0;

  const [showNoInvoiceModal, setShowNoInvoiceModal] = useState(false);

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

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-neutral-900 flex items-center gap-2">
              <HugeiconsIcon icon={FileText} size={18} strokeWidth={2} className="text-blue-600" />
              Institutional Invoices
            </h3>
            <button onClick={() => router.push('/sis/payments/')} className="text-xs font-bold uppercase tracking-wider text-[#0a151a] hover:underline">View All &rarr;</button>
          </div>
          <DataTable
            columns={[
              { key: 'invoice_number', header: 'Invoice #', render: (i: any) => <span className="font-mono text-sm font-semibold text-neutral-900">{i.invoice_number}</span> },
              { key: 'description', header: 'Description / Purpose', render: (i: any) => (
                <div>
                  <span className="font-medium text-neutral-900 text-sm">{i.description || i.type || 'Program Tuition'}</span>
                  {i.due_date && <p className="text-[11px] text-neutral-400">Due: {new Date(i.due_date).toLocaleDateString('en-CA')}</p>}
                </div>
              )},
              { key: 'amount', header: 'Total', className: 'text-right', render: (i: any) => <span className="font-mono text-sm text-neutral-900">${(i.total || i.amount || 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })} CAD</span> },
              { key: 'paid', header: 'Paid', className: 'text-right', render: (i: any) => <span className="font-mono text-sm text-emerald-600 font-medium">${(i.paid || 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })} CAD</span> },
              { key: 'balance', header: 'Balance', className: 'text-right', render: (i: any) => <span className="font-mono text-sm text-red-600">${(i.balance || 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })} CAD</span> },
              { key: 'status', header: 'Status', render: (i: any) => (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  i.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {i.status || (i.balance <= 0 ? 'PAID' : 'ISSUED')}
                </span>
              )},
              { key: 'action', header: 'Action', render: (i: any) => {
                if ((i.balance || 0) <= 0) {
                  return <span className="text-xs font-bold text-emerald-700">✓ Settled</span>;
                }
                return (
                  <button
                    onClick={() => {
                      if (student?.application_id) {
                        router.push(`/portal/application/payment/?id=${student.application_id}`);
                      } else {
                        router.push('/portal/dashboard/');
                      }
                    }}
                    className="px-3 py-1.5 bg-[#147BD1] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#1a3399] transition cursor-pointer"
                  >
                    Pay Now
                  </button>
                );
              }},
            ]}
            data={invoices}
            keyField="id"
            pagination={undefined}
            emptyMessage="No institutional invoices found"
          />
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-neutral-900 flex items-center gap-2">
              <HugeiconsIcon icon={CreditCard} size={18} strokeWidth={2} className="text-emerald-600" />
              Official Payment Receipts (Verified Documents)
            </h3>
            <button onClick={() => router.push('/sis/payments/')} className="text-xs font-bold uppercase tracking-wider text-[#0a151a] hover:underline">View All &rarr;</button>
          </div>
          <DataTable
            columns={[
              { key: 'receipt_number', header: 'Receipt #', render: (p: any) => <span className="font-mono text-sm font-semibold text-neutral-900">{`REC-2026-${(p.reference || p.transaction_reference || p.id).replace(/[^0-9]/g, '').slice(0, 6) || p.id.slice(0, 6)}`}</span> },
              { key: 'reference', header: 'Payment Reference', render: (p: any) => <span className="font-mono text-xs text-neutral-700">{p.reference || p.transaction_reference || 'N/A'}</span> },
              { key: 'channel', header: 'Country & Channel', render: (p: any) => <span className="text-sm font-medium text-neutral-800">{p.country_code ? `Bank Wire (${p.country_code})` : (p.method || 'Direct Bank Wire')}</span> },
              { key: 'amount', header: 'Amount', className: 'text-right', render: (p: any) => (
                <div>
                  <span className="font-mono text-sm font-semibold text-neutral-900">${(Number(p.amount) || 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })} CAD</span>
                  {p.local_amount && p.local_currency && (
                    <p className="text-[11px] font-mono text-neutral-500">
                      ({p.local_currency} {Number(p.local_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })})
                    </p>
                  )}
                </div>
              )},
              { key: 'date', header: 'Issued At', render: (p: any) => p.date ? new Date(p.date).toLocaleDateString('en-CA') : 'N/A' },
              { key: 'document', header: 'Document', render: (p: any) => (
                <button
                  onClick={() => {
                    if (student?.application_id) {
                      router.push(`/portal/application/receipt/?id=${student.application_id}&paymentId=${p.id}`);
                    } else {
                      router.push(`/api/portal/receipt/pdf?paymentId=${p.id}`);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#147BD1] hover:underline"
                >
                  <HugeiconsIcon icon={FileText} size={14} />
                  View Receipt
                </button>
              )},
            ]}
            data={payments}
            keyField="id"
            pagination={undefined}
            emptyMessage="No verified payment receipts found"
          />
        </div>
      </div>

      <div className="p-4 bg-neutral-50 border border-neutral-200">
        <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Payment Options</h4>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => {
              if (admissionOffer?.invoice_pushed && student?.application_id) {
                window.location.href = `/portal/application/payment?id=${student.application_id}`;
              } else {
                setShowNoInvoiceModal(true);
              }
            }}
            className="px-4 py-2 bg-[#0a151a] text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition cursor-pointer"
          >
            Make Payment
          </button>
          <button className="px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-100">Set Up Payment Plan</button>
          <button className="px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-100">View Tax Forms (T2202)</button>
        </div>
      </div>

      {showNoInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 max-w-md w-full rounded-2xl shadow-xl text-center">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 border border-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <HugeiconsIcon icon={FileText} size={24} strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">No Payment Invoice Available Yet</h3>
            <p className="text-sm text-neutral-600 leading-relaxed mb-6">
              Your payment invoice has not been prepared or issued by the finance department yet. Please check back later or contact the Student Financial Services office.
            </p>
            <button
              onClick={() => setShowNoInvoiceModal(false)}
              className="w-full py-2.5 bg-[#0a151a] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-800 transition"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
