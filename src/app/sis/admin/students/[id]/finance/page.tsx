'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { StudentHeader } from '@/components/sis/StudentHeader';
import { StatusBadge } from '@/components/sis/StatusBadge';

export const dynamic = 'force-dynamic';

export default function StudentFinancePage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Financial Account" subtitle="Student financial details" />
      <div className="bg-white border border-neutral-200 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Account Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-neutral-500">Current Balance</span><span className="font-medium text-neutral-900">$0.00</span></div>
          <div className="flex justify-between"><span className="text-neutral-500">Payment Status</span><StatusBadge status="paid" /></div>
          <div className="flex justify-between"><span className="text-neutral-500">Next Due Date</span><span className="font-medium text-neutral-900">N/A</span></div>
        </div>
      </div>
    </div>
  );
}