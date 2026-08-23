'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/sis/PageHeader';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { ArrowLeftIcon as ArrowLeft, UserIcon as User, BookOpenIcon as BookOpen, CalendarIcon as Calendar, HashIcon as Hash } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { getSISRegistrationById } from '../../actions';

interface RegistrationDetail {
  id: string;
  student_id: string;
  module_id: string;
  semester_id: string;
  status: string;
  grade: number | null;
  grade_status: string;
  created_at: string;
  updated_at: string;
  module?: { code: string; title: string; credits: number; description?: string };
  semester?: { name: string; start_date: string; end_date: string };
  student?: {
    student_id: string;
    enrollment_status: string;
    user?: { first_name: string; last_name: string; email: string };
  };
}

export default function RegistrationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [data, setData] = useState<RegistrationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getSISRegistrationById(id);
        if (!result.success) throw new Error(result.error);
        setData(result.data as RegistrationDetail);
      } catch (err: any) {
        setError(err.message || 'Failed to load registration');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div></div>;
  }

  if (error || !data) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-none text-center">
        <p className="text-red-600 font-medium text-sm">{error || 'Registration not found'}</p>
        <Link href="/sis/admin/registration/" className="mt-4 inline-block text-xs font-bold uppercase tracking-wider text-[#0a151a] hover:underline no-underline">Back to Registrations</Link>
      </div>
    );
  }

  const studentName = data.student?.user ? `${data.student.user.first_name} ${data.student.user.last_name}` : 'Unknown';
  const moduleTitle = data.module?.title || 'Unknown Module';
  const moduleCode = data.module?.code || '—';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Registration Detail"
        subtitle={`Module enrollment record`}
      />

      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-300">
          <HugeiconsIcon icon={ArrowLeft} size={18} strokeWidth={2} />
        </button>
        <Link href="/sis/admin/registration/" className="text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white no-underline">
          Back to Registrations
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Module Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-neutral-800 rounded text-neutral-300">
                  <HugeiconsIcon icon={BookOpen} size={18} strokeWidth={2} />
                </div>
                <div>
                  <div className="font-bold text-white">{moduleTitle}</div>
                  <div className="text-sm text-neutral-400 font-mono">{moduleCode}</div>
                  {data.module?.description && <div className="text-sm text-neutral-300 mt-1">{data.module.description}</div>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Credits</div>
                  <div className="text-sm font-bold text-white">{data.module?.credits || '—'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Semester</div>
                  <div className="text-sm font-bold text-white">{data.semester?.name || '—'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Enrollment Status</h3>
            <div className="flex items-center gap-4">
              <StatusBadge status={data.status} />
              <span className="text-sm text-neutral-300">Grade Status: <span className="font-bold text-white">{data.grade_status || '—'}</span></span>
            </div>
            {data.grade !== null && (
              <div className="mt-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Grade</div>
                <div className="text-2xl font-black text-white">{data.grade.toFixed(2)}</div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Student</h3>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neutral-800 rounded text-neutral-300">
                <HugeiconsIcon icon={User} size={18} strokeWidth={2} />
              </div>
              <div>
                <div className="font-bold text-white">{studentName}</div>
                <div className="text-sm text-neutral-400 font-mono">{data.student?.student_id}</div>
                {data.student?.user?.email && <div className="text-xs text-neutral-400">{data.student.user.email}</div>}
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Record Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Hash} size={14} strokeWidth={2} className="text-slate-400" />
                <span className="text-xs text-neutral-400 font-mono">{data.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Calendar} size={14} strokeWidth={2} className="text-slate-400" />
                <span className="text-xs text-neutral-300">Created: {new Date(data.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Calendar} size={14} strokeWidth={2} className="text-slate-400" />
                <span className="text-xs text-neutral-300">Updated: {new Date(data.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
