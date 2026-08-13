'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { Tabs } from '@/components/sis/Tabs';
import { StudentHeader } from '@/components/sis/StudentHeader';
import { FinanceSummary } from '@/components/sis/FinanceSummary';
import { DataTable } from '@/components/sis/DataTable';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { CreditCardIcon as CreditCard, DollarSignIcon as DollarSign, Calendar01Icon as Calendar, File01Icon as FileText, Download01Icon as Download, EyeIcon as Eye, Filter as FilterIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const mockInvoices = [
  { id: '1', number: 'INV-2026-001', type: 'Tuition', term: 'Fall 2026', amount: 7100.00, paid: 2000.00, balance: 5100.00, dueDate: 'Dec 1, 2026', status: 'Partial', issuedDate: 'Aug 1, 2026' },
  { id: '2', number: 'INV-2026-002', type: 'Lab Fees', term: 'Fall 2026', amount: 700.00, paid: 0, balance: 700.00, dueDate: 'Oct 15, 2026', status: 'Outstanding', issuedDate: 'Aug 1, 2026' },
  { id: '3', number: 'INV-2025-045', type: 'Tuition', term: 'Winter 2026', amount: 7100.00, paid: 7100.00, balance: 0, dueDate: 'Jan 15, 2026', status: 'Paid', issuedDate: 'Dec 1, 2025' },
  { id: '4', number: 'INV-2025-012', type: 'Tuition', term: 'Fall 2025', amount: 7100.00, paid: 7100.00, balance: 0, dueDate: 'Sep 15, 2025', status: 'Paid', issuedDate: 'Aug 1, 2025' },
];

const mockPayments = [
  { id: '1', date: 'Aug 15, 2026', reference: 'TXN-2026-0815-001', method: 'Credit Card', amount: 2000.00, status: 'Completed', invoice: 'INV-2026-001' },
  { id: '2', date: 'Aug 1, 2026', reference: 'TXN-2026-0801-001', method: 'Bank Transfer', amount: 2550.00, status: 'Completed', invoice: 'INV-2026-001' },
  { id: '3', date: 'Jan 10, 2026', reference: 'TXN-2026-0110-001', method: 'Credit Card', amount: 3550.00, status: 'Completed', invoice: 'INV-2025-045' },
  { id: '4', date: 'Dec 15, 2025', reference: 'TXN-2025-1215-001', method: 'Bank Transfer', amount: 3550.00, status: 'Completed', invoice: 'INV-2025-045' },
  { id: '5', date: 'Sep 10, 2025', reference: 'TXN-2025-0910-001', method: 'Credit Card', amount: 3550.00, status: 'Completed', invoice: 'INV-2025-012' },
  { id: '6', date: 'Aug 15, 2025', reference: 'TXN-2025-0815-001', method: 'Bank Transfer', amount: 3550.00, status: 'Completed', invoice: 'INV-2025-012' },
];

const tabs = [
  { label: 'Account Summary', href: '/sis/students/1/finance' },
  { label: 'Invoices', href: '/sis/students/1/finance/invoices' },
  { label: 'Payments', href: '/sis/students/1/finance/payments' },
  { label: 'Receipts', href: '/sis/students/1/finance/receipts' },
];

export default function FinancePage() {
  const params = useParams();
  const studentId = params.id as string;
  const [page, setPage] = React.useState(1);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Account"
        subtitle={`Student: CC10231 • Sarah Mitchell`}
      />

      <Tabs tabs={tabs} />

      <StudentHeader student={{
        id: '1',
        firstName: 'Sarah',
        lastName: 'Mitchell',
        studentId: 'CC10231',
        email: 's.mitchell@cannogacollege.ca',
        program: 'Bachelor of Science in Nursing',
        school: 'School of Health and Community Services',
        academicLevel: 'Undergraduate',
        startTerm: 'Fall 2024',
        status: 'Active',
        enrollmentStatus: 'Enrolled',
        institutionalEmail: 's.mitchell@student.cannogacollege.ca',
      }} />

      <FinanceSummary
        summary={{
          currentBalance: 1775.00,
          nextDueDate: 'Dec 1, 2026',
          nextDueAmount: 1425.00,
          lastPaymentDate: 'Aug 15, 2026',
          lastPaymentAmount: 1425.00,
          paymentStatus: 'Outstanding',
          holdAmount: 0,
          refundAmount: 0,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <HugeiconsIcon icon={FileText} size={18} strokeWidth={2} className="text-blue-600" />
              Invoices
            </h3>
            <button className="text-xs font-bold uppercase tracking-wider text-[#0a151a] hover:underline">View All</button>
          </div>
          <DataTable
            columns={[
              { key: 'number', header: 'Invoice #', render: (i: typeof mockInvoices[0]) => <span className="font-mono font-medium text-neutral-900">{i.number}</span> },
              { key: 'type', header: 'Type' },
              { key: 'term', header: 'Term' },
              { key: 'amount', header: 'Amount', className: 'text-right', render: (i: typeof mockInvoices[0]) => <span className="font-mono text-neutral-900">${i.amount.toLocaleString()}</span> },
              { key: 'paid', header: 'Paid', className: 'text-right', render: (i: typeof mockInvoices[0]) => <span className="font-mono text-emerald-600">${i.paid.toLocaleString()}</span> },
              { key: 'balance', header: 'Balance', className: 'text-right', render: (i: typeof mockInvoices[0]) => <span className="font-mono text-red-600">${i.balance.toLocaleString()}</span> },
              { key: 'dueDate', header: 'Due Date' },
              { key: 'status', header: 'Status', render: (i: typeof mockInvoices[0]) => <StatusBadge status={i.status} /> },
            ]}
            data={mockInvoices}
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
            <button className="text-xs font-bold uppercase tracking-wider text-[#0a151a] hover:underline">View All</button>
          </div>
          <DataTable
            columns={[
              { key: 'date', header: 'Date' },
              { key: 'reference', header: 'Reference', render: (p: typeof mockPayments[0]) => <span className="font-mono text-xs text-neutral-600">{p.reference}</span> },
              { key: 'method', header: 'Method' },
              { key: 'amount', header: 'Amount', className: 'text-right', render: (p: typeof mockPayments[0]) => <span className="font-mono text-emerald-600">${p.amount.toLocaleString()}</span> },
              { key: 'status', header: 'Status', render: (p: typeof mockPayments[0]) => <StatusBadge status={p.status} /> },
              { key: 'invoice', header: 'Applied To', render: (p: typeof mockPayments[0]) => <span className="font-mono text-xs text-neutral-600">{p.invoice}</span> },
            ]}
            data={mockPayments}
            keyField="id"
            pagination={undefined}
            emptyMessage="No payments found"
          />
        </div>
      </div>

      <div className="p-4 bg-neutral-50 border border-neutral-200">
        <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">Payment Options</h4>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => window.location.href = '/portal/application/payment'}
            className="px-4 py-2 bg-[#0a151a] text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition"
          >
            Make Payment
          </button>
          <button className="px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-100">Set Up Payment Plan</button>
          <button className="px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-100">View Tax Forms (T2202)</button>
        </div>
      </div>
    </div>
  );
}