'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { DataTable } from '@/components/sis/DataTable';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import { CreditCardIcon as CreditCard } from '@hugeicons/core-free-icons';
import { createClient } from '@/utils/supabase/client';

export const dynamic = 'force-dynamic';

interface Payment {
  id: string;
  date: string;
  reference: string;
  method: string;
  amount: number;
  status: string;
  invoice: string;
}

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          router.replace('/portal/account/login');
          return;
        }

        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (studentError || !studentData) {
          console.log('No student record found');
          router.replace('/portal/dashboard');
          return;
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
        console.error('Error fetching payments:', e);
        router.replace('/portal/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Payments" subtitle="Loading..." />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Payments" subtitle="Your payment history" />
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
  );
}