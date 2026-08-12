'use client';

import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { StatusBadge } from './StatusBadge';
import { 
  UserIcon as User, 
  Calendar01Icon as Calendar, 
  GraduationCapIcon as GraduationCap, 
  MapPinIcon as MapPin, 
  SmartPhone01Icon as Phone, 
  Mail01Icon as Envelope, 
  Shield01Icon as ShieldCheck 
} from '@hugeicons/core-free-icons';

interface StudentHeaderProps {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    preferredName?: string;
    studentId: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    program: string;
    school: string;
    academicLevel: string;
    startTerm: string;
    status: string;
    enrollmentStatus: string;
    institutionalEmail?: string;
    creditsCompleted?: number;
    creditsRemaining?: number;
  };
  actions?: React.ReactNode;
}

export function StudentHeader({ student, actions }: StudentHeaderProps) {
  const fullName = [student.firstName, student.middleName, student.lastName].filter(Boolean).join(' ');
  const displayName = student.preferredName || fullName;

  return (
    <div className="bg-white border border-neutral-200 p-4 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-xl font-black text-neutral-900">{displayName}</h1>
            {student.preferredName && (
              <span className="text-xs text-neutral-500">Legal: {fullName}</span>
            )}
            <StatusBadge status={student.status} size="md" />
          </div>
          <div className="text-sm font-mono text-neutral-500">Student ID: {student.studentId}</div>
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={GraduationCap} size={16} strokeWidth={2.5} className="text-neutral-400" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Program</div>
            <div className="font-medium text-neutral-900">{student.program}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={ShieldCheck} size={16} strokeWidth={2.5} className="text-neutral-400" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">School</div>
            <div className="font-medium text-neutral-900">{student.school}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Calendar} size={16} strokeWidth={2.5} className="text-neutral-400" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Start Term</div>
            <div className="font-medium text-neutral-900">{student.startTerm}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={GraduationCap} size={16} strokeWidth={2.5} className="text-neutral-400" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Academic Level</div>
            <div className="font-medium text-neutral-900">{student.academicLevel}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Envelope} size={16} strokeWidth={2.5} className="text-neutral-400" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Email</div>
            <div className="font-medium text-neutral-900 font-mono text-xs">{student.email}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Phone} size={16} strokeWidth={2.5} className="text-neutral-400" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Phone</div>
            <div className="font-medium text-neutral-900">{student.phone || '—'}</div>
          </div>
        </div>
      </div>

      {student.institutionalEmail && (
        <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center gap-2 text-sm">
          <HugeiconsIcon icon={Envelope} size={16} strokeWidth={2.5} className="text-neutral-400" />
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Institutional Email</div>
          <div className="font-medium text-neutral-900 font-mono text-xs">{student.institutionalEmail}</div>
        </div>
      )}
    </div>
  );
}