'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';

export default function AdmissionNotesPage() {
  const params = useParams() as { id: string };
  const { id } = params;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notes"
        subtitle={`Admission #${id}`}
      />
      <div className="bg-[#0f2027] border border-white/10 p-6 rounded-2xl">
        <p className="text-sm text-slate-400">Notes for admission {id}</p>
      </div>
    </div>
  );
}