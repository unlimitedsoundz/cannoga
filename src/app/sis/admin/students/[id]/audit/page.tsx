'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { StudentHeader } from '@/components/sis/StudentHeader';

export const dynamic = 'force-dynamic';

export default function AuditPage() {
  const { id } = useParams();
  return (
    <div className="space-y-6">
      <PageHeader title="Audit History" subtitle="Student record change log" />
      <div className="bg-white border border-neutral-200 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Audit Log</h3>
        <p className="text-sm text-neutral-500">No audit entries found.</p>
      </div>
    </div>
  );
}