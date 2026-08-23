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
          router.replace('/portal/account/login/');
          return;
        }

        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (studentError || !studentData) {
          console.log('No student record found');
          router.replace('/portal/dashboard/');
          return;
        }

        let tuitionPayments: any[] = [];
        try {
            const { data: studentApp } = await supabase
                .from('students')
                .select('application_id')
                .eq('id', studentData.id)
                .single();

            if (studentApp?.application_id) {
                const { data: offerData } = await supabase
                    .from('admission_offers')
                    .select('id')
                    .eq('application_id', studentApp.application_id);

                const offerIds = (offerData || []).map((o: any) => o.id);
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
          })) as Payment[]);
        }
      } catch (e) {
        console.error('Error fetching payments:', e);
        router.replace('/portal/dashboard/');
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