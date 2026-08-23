'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { DataTable } from '@/components/sis/DataTable';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import { File01Icon as FileText, Download01Icon as Download } from '@hugeicons/core-free-icons';
import { createClient } from '@/utils/supabase/client';

export const dynamic = 'force-dynamic';

interface Receipt {
  id: string;
  receipt_number: string;
  payment_id: string;
  amount: number;
  issued_date: string;
  status: string;
}

export default function ReceiptsPage() {
  const router = useRouter();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipts = async () => {
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

        const { data: receiptData, error: receiptError } = await supabase
          .from('receipts')
          .select('*')
          .eq('student_id', studentData.id)
          .order('issued_date', { ascending: false });

        if (!receiptError && receiptData) {
          setReceipts(receiptData.map((r: any) => ({
            id: r.id,
            receipt_number: r.receipt_number,
            payment_id: r.payment_id,
            amount: Number(r.amount) || 0,
            issued_date: r.issued_date || '',
            status: r.status,
          })) as Receipt[]);
        }
      } catch (e) {
        console.error('Error fetching receipts:', e);
        router.replace('/portal/dashboard/');
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, [router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Receipts" subtitle="Loading..." />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Receipts" subtitle="Your payment receipts" />
      <DataTable
        columns={[
          { key: 'receipt_number', header: 'Receipt #', render: (r: Receipt) => <span className="font-mono font-medium text-neutral-900">{r.receipt_number}</span> },
          { key: 'payment_id', header: 'Payment ID', render: (r: Receipt) => <span className="font-mono text-xs text-neutral-600">{r.payment_id}</span> },
          { key: 'amount', header: 'Amount', className: 'text-right', render: (r: Receipt) => <span className="font-mono text-neutral-900">${r.amount.toLocaleString()}</span> },
          { key: 'issued_date', header: 'Issued Date', render: (r: Receipt) => <span className="font-mono text-neutral-900">{r.issued_date ? new Date(r.issued_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span> },
          { key: 'status', header: 'Status', render: (r: Receipt) => <StatusBadge status={r.status} /> },
        ]}
        data={receipts}
        keyField="id"
        pagination={undefined}
        emptyMessage="No receipts found"
      />
    </div>
  );
}