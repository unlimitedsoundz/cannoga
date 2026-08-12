'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { StudentHeader } from '@/components/sis/StudentHeader';
import { StatusBadge } from '@/components/sis/StatusBadge';

export const dynamic = 'force-dynamic';

export default function GradesPage() {
  const { id } = useParams();
  return (
    <div className="space-y-6">
      <PageHeader title="Grades" subtitle="Student grade summary" />
      <div className="bg-white border border-neutral-200 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Grade Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-neutral-500">Current GPA</span><span className="font-medium text-neutral-900">3.64</span></div>
          <div className="flex justify-between"><span className="text-neutral-500">Term GPA</span><span className="font-medium text-neutral-900">3.64</span></div>
          <div className="flex justify-between"><span className="text-neutral-500">Credits Completed</span><span className="font-medium text-neutral-900">11</span></div>
        </div>
      </div>
    </div>
  );
}