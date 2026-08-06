'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { StudentHeader } from '@/components/sis/StudentHeader';
import { StatusBadge } from '@/components/sis/StatusBadge';

export const dynamic = 'force-dynamic';

export default function RegistrationPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Class Schedule" subtitle="Student registration and class schedule" />
      <div className="bg-white border border-neutral-200 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Current Enrollment</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-neutral-50 border border-neutral-200">
            <div>
              <p className="text-sm font-medium text-neutral-900">NURS 301 - Advanced Nursing Practice</p>
              <p className="text-xs text-neutral-500">Fall 2026 • Mon/Wed/Fri 9:00 AM - 12:00 PM</p>
            </div>
            <StatusBadge status="active" />
          </div>
          <div className="flex justify-between items-center p-3 bg-neutral-50 border border-neutral-200">
            <div>
              <p className="text-sm font-medium text-neutral-900">NURS 302 - Clinical Pharmacology</p>
              <p className="text-xs text-neutral-500">Fall 2026 • Tue/Thu 1:00 PM - 4:00 PM</p>
            </div>
            <StatusBadge status="active" />
          </div>
          <div className="flex justify-between items-center p-3 bg-neutral-50 border border-neutral-200">
            <div>
              <p className="text-sm font-medium text-neutral-900">BIOL 310 - Pathophysiology</p>
              <p className="text-xs text-neutral-500">Fall 2026 • Mon/Wed 2:00 PM - 5:00 PM</p>
            </div>
            <StatusBadge status="active" />
          </div>
        </div>
      </div>
      <div className="bg-white border border-neutral-200 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Registration Status</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Status</dt><dd className="font-medium text-neutral-900 mt-1"><StatusBadge status="active" /></dd></div>
          <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Credits</dt><dd className="font-medium text-neutral-900 mt-1">12</dd></div>
          <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Term</dt><dd className="font-medium text-neutral-900 mt-1">Fall 2026</dd></div>
          <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Last Updated</dt><dd className="font-medium text-neutral-900 mt-1">Aug 4, 2026</dd></div>
        </div>
      </div>
    </div>
  );
}