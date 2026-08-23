'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft, Save } from '@hugeicons/core-free-icons';
import Link from 'next/link';

export default function NewStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    router.push('/sis/admin/students/');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Student"
        subtitle="Create a new student record"
        actions={
          <Link href="/sis/admin/students/" className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-50 transition-colors no-underline">
            <HugeiconsIcon icon={ArrowLeft} size={14} strokeWidth={2.5} /> Back to Students
          </Link>
        }
      />
      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" required placeholder="First name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" required placeholder="Last name" />
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
          <Button htmlType="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button htmlType="submit" disabled={loading}>
            <HugeiconsIcon icon={Save} size={14} strokeWidth={2.5} className="mr-2" />
            {loading ? 'Creating...' : 'Create Student'}
          </Button>
        </div>
      </form>
    </div>
  );
}