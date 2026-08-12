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

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
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
      } catch (e) {
        console.error('Error fetching invoices:', e);
        router.replace('/portal/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Invoices" subtitle="Loading..." />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Invoices" subtitle="Your outstanding and paid invoices" />
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
  );
}