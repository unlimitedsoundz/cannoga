'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { PageHeader } from '@/components/sis/PageHeader';

export default function AdmissionAuditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Log"
        subtitle={`Admission #${id}`}
      />
      <div className="bg-white border border-neutral-200 p-6">
        <p className="text-sm text-neutral-600">Audit log for admission {id}</p>
      </div>
    </div>
  );
}