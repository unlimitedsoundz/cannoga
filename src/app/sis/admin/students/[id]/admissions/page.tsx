'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { StudentHeader } from '@/components/sis/StudentHeader';
import { StatusBadge } from '@/components/sis/StatusBadge';

export const dynamic = 'force-dynamic';

export default function AdmissionsPage() {
  const { id } = useParams();
  return (
    <div className="space-y-6">
      <PageHeader title="Admissions" subtitle="Application and admissions review" />
      <div className="bg-white border border-neutral-200 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Application Status</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-neutral-500">Application Status</span><StatusBadge status="approved" /></div>
          <div className="flex justify-between"><span className="text-neutral-500">Intake</span><span className="font-medium text-neutral-900">Fall 2026</span></div>
          <div className="flex justify-between"><span className="text-neutral-500">Admission Date</span><span className="font-medium text-neutral-900">Jul 15, 2026</span></div>
        </div>
      </div>
    </div>
  );
}