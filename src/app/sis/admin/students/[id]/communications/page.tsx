'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { StudentHeader } from '@/components/sis/StudentHeader';

export const dynamic = 'force-dynamic';

export default function CommunicationsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Communications" subtitle="Student messages and notifications" />
      <div className="bg-white border border-neutral-200 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Recent Communications</h3>
        <p className="text-sm text-neutral-500">No recent communications.</p>
      </div>
    </div>
  );
}