'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { PageHeader } from '@/components/sis/PageHeader';

export default function AdmissionNotesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notes"
        subtitle={`Admission #${id}`}
      />
      <div className="bg-white border border-neutral-200 p-6">
        <p className="text-sm text-neutral-600">Notes for admission {id}</p>
      </div>
    </div>
  );
}