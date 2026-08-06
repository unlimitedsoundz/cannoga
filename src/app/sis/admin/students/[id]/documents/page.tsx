'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { StudentHeader } from '@/components/sis/StudentHeader';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import { File01Icon as FileText, Download01Icon as Download, EyeIcon as Eye } from '@hugeicons/core-free-icons';

export const dynamic = 'force-dynamic';

export default function DocumentsPage({ params }: { params: { id: string } }) {
  const documents = [
    { id: '1', name: 'Letter of Acceptance.pdf', type: 'pdf', uploadedAt: '2026-07-15', status: 'verified' },
    { id: '2', name: 'Passport Copy.pdf', type: 'pdf', uploadedAt: '2026-07-10', status: 'verified' },
    { id: '3', name: 'Transcripts.pdf', type: 'pdf', uploadedAt: '2026-07-08', status: 'pending' },
    { id: '4', name: 'English Proficiency Test.pdf', type: 'pdf', uploadedAt: '2026-07-05', status: 'verified' },
    { id: '5', name: 'Health Insurance.pdf', type: 'pdf', uploadedAt: '2026-07-01', status: 'verified' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Documents" subtitle="Student uploaded documents" />
      <div className="bg-white border border-neutral-200">
        <div className="p-4 border-b border-neutral-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Uploaded Files</h3>
        </div>
        <div className="divide-y divide-neutral-200">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-3">
                <HugeiconsIcon icon={FileText} size={18} strokeWidth={2} className="text-neutral-400" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">{doc.name}</p>
                  <p className="text-xs text-neutral-500">Uploaded {doc.uploadedAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={doc.status} />
                <button className="p-1.5 text-neutral-400 hover:text-neutral-600 transition-colors" title="View"><HugeiconsIcon icon={Eye} size={14} strokeWidth={2} /></button>
                <button className="p-1.5 text-neutral-400 hover:text-neutral-600 transition-colors" title="Download"><HugeiconsIcon icon={Download} size={14} strokeWidth={2} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}