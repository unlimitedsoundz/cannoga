'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';

export default function AdmissionDocumentsPage() {
  const params = useParams() as { id: string };
  const { id } = params;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        subtitle={`Admission #${id}`}
      />
      <div className="bg-white border border-neutral-200 p-6">
        <p className="text-sm text-neutral-600">Documents for admission {id}</p>
      </div>
    </div>
  );
}