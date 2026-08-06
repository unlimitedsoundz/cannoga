'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { DataTable } from '@/components/sis/DataTable';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon as Plus } from '@hugeicons/core-free-icons';
import Link from 'next/link';

interface HousingRow {
  id: string;
  student_id: string;
  building: string;
  room: string;
  status: string;
  move_in_date: string;
}

export default function HousingPage() {
  const housingData: HousingRow[] = [];

  const columns = [
    { key: 'student_id', header: 'Student ID', render: (r: HousingRow) => <span className="font-mono text-sm">{r.student_id}</span> },
    { key: 'building', header: 'Building' },
    { key: 'room', header: 'Room' },
    { key: 'move_in_date', header: 'Move-In Date' },
    { key: 'status', header: 'Status', render: (r: HousingRow) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Housing"
        subtitle="Manage student housing assignments"
        actions={
          <Link href="/sis/admin/housing/new" className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors no-underline">
            <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> New Assignment
          </Link>
        }
      />
      <DataTable columns={columns} data={housingData} keyField="id" emptyMessage="No housing assignments found" />
    </div>
  );
}