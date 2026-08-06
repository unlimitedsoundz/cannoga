'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon as Plus, ArrowRightIcon as ArrowRight } from '@hugeicons/core-free-icons';
import Link from 'next/link';

export default function NewStudentPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    program: '',
    intake: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New student:', formData);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Student"
        subtitle="Create a new student record in the system"
      />

      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              className="mt-1 w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              className="mt-1 w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="mt-1 w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="mt-1 w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Program</label>
            <input
              type="text"
              value={formData.program}
              onChange={e => setFormData(prev => ({ ...prev, program: e.target.value }))}
              className="mt-1 w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Intake</label>
            <input
              type="text"
              value={formData.intake}
              onChange={e => setFormData(prev => ({ ...prev, intake: e.target.value }))}
              className="mt-1 w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans"
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
          <button type="submit" className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors">Create Student</button>
          <Link href="/sis/admin/students" className="px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors no-underline">Cancel</Link>
        </div>
      </form>
    </div>
  );
}