import React from 'react';
import { StatusBadge } from './StatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  BookOpenIcon, 
  CircleCheckIcon, 
  ClockIcon, 
  Alert01Icon 
} from '@hugeicons/core-free-icons';

const BookOpen = ({ size = 18, strokeWidth = 2, className = '' }: { size?: number | string; strokeWidth?: number; className?: string }) => (
  <HugeiconsIcon icon={BookOpenIcon} size={size} strokeWidth={strokeWidth} className={className} />
);
const CheckCircle = ({ size = 18, strokeWidth = 2, className = '' }: { size?: number | string; strokeWidth?: number; className?: string }) => (
  <HugeiconsIcon icon={CircleCheckIcon} size={size} strokeWidth={strokeWidth} className={className} />
);
const Clock = ({ size = 18, strokeWidth = 2, className = '' }: { size?: number | string; strokeWidth?: number; className?: string }) => (
  <HugeiconsIcon icon={ClockIcon} size={size} strokeWidth={strokeWidth} className={className} />
);
const AlertTriangle = ({ size = 18, strokeWidth = 2, className = '' }: { size?: number | string; strokeWidth?: number; className?: string }) => (
  <HugeiconsIcon icon={Alert01Icon} size={size} strokeWidth={strokeWidth} className={className} />
);

interface AcademicSummaryProps {
  summary: {
    currentProgram: string;
    academicStanding: string;
    creditsCompleted: number;
    creditsRequired: number;
    termGpa?: number;
    cumulativeGpa?: number;
    registrationStatus: string;
    currentCourses: number;
    upcomingDeadline?: string;
    academicLevel?: string;
    holds?: Array<{ type: string; description: string; office: string }>;
  };
}

export function AcademicSummary({ summary }: AcademicSummaryProps) {
  const progress = summary.creditsRequired > 0 
    ? Math.round((summary.creditsCompleted / summary.creditsRequired) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white border border-neutral-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={18} strokeWidth={2} className="text-[#9c27b3]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Current Program</span>
        </div>
        <div className="font-bold text-neutral-900">{summary.currentProgram}</div>
        <div className="text-xs text-neutral-500 mt-1">{summary.academicLevel || ''}</div>
      </div>

      <div className="bg-white border border-neutral-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle size={18} strokeWidth={2} className="text-emerald-600" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Academic Standing</span>
        </div>
        <div className="font-bold text-neutral-900">
          <StatusBadge status={summary.academicStanding} size="sm" />
        </div>
      </div>

      <div className="bg-white border border-neutral-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={18} strokeWidth={2} className="text-blue-600" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Credits</span>
        </div>
        <div className="font-bold text-neutral-900">{summary.creditsCompleted} / {summary.creditsRequired}</div>
        <div className="mt-2 h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#9c27b3]" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-xs text-neutral-500 mt-1">{progress}% complete</div>
      </div>

      <div className="bg-white border border-neutral-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={18} strokeWidth={2} className="text-amber-600" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">GPA</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          {summary.termGpa !== undefined && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Term</div>
              <div className="font-bold text-neutral-900">{summary.termGpa.toFixed(2)}</div>
            </div>
          )}
          {summary.cumulativeGpa !== undefined && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Cumulative</div>
              <div className="font-bold text-neutral-900">{summary.cumulativeGpa.toFixed(2)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}