'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { StudentHeader } from '@/components/sis/StudentHeader';
import { StatusBadge } from '@/components/sis/StatusBadge';

export const dynamic = 'force-dynamic';

export default function AcademicsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Academics" subtitle="Academic programs and course enrollment" />
      <div className="bg-white border border-neutral-200 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Current Enrollment</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-neutral-500">Program</span><span className="font-medium text-neutral-900">Nursing</span></div>
          <div className="flex justify-between"><span className="text-neutral-500">School</span><span className="font-medium text-neutral-900">School of Health Sciences</span></div>
          <div className="flex justify-between"><span className="text-neutral-500">Status</span><StatusBadge status="active" /></div>
        </div>
      </div>
    </div>
  );
}