'use client';

import { CurrentStage, CURRENT_STAGE_LABELS, JOURNEY_STAGES } from '@/types/journey';
import { PalStatus, PAL_STATUS_LABELS } from '@/types/pal';

interface AdminJourneyTimelineProps {
  student: {
    id: string;
    first_name: string;
    last_name: string;
    student_id: string;
    email: string;
    current_stage: CurrentStage;
    pal_status?: PalStatus;
    pal_required?: boolean;
    study_permit_status?: string;
    arrival_status?: string;
    checkin_status?: string;
    orientation_status?: string;
    registration_status?: string;
    enrollment_status?: string;
  };
}

export default function AdminJourneyTimeline({ student }: AdminJourneyTimelineProps) {
  const stageOrder = [
    CurrentStage.APPLICATION,
    CurrentStage.APPLICATION_REVIEW,
    CurrentStage.ACCEPTED,
    CurrentStage.LETTER_OF_ACCEPTANCE,
    CurrentStage.TUITION_DEPOSIT_REQUIRED,
    CurrentStage.TUITION_DEPOSIT_PAID,
    CurrentStage.TUITION_DEPOSIT_VERIFIED,
    CurrentStage.PAL_PROCESSING,
    CurrentStage.PAL_ISSUED,
    CurrentStage.STUDY_PERMIT_PREPARATION,
    CurrentStage.STUDY_PERMIT_APPLICATION,
    CurrentStage.IRCC_PROCESSING,
    CurrentStage.STUDY_PERMIT_DECISION,
    CurrentStage.PRE_ARRIVAL,
    CurrentStage.ARRIVAL_IN_CANADA,
    CurrentStage.INTERNATIONAL_STUDENT_CHECKIN,
    CurrentStage.ORIENTATION,
    CurrentStage.ACADEMIC_REGISTRATION,
    CurrentStage.ENROLLED,
    CurrentStage.ACTIVE_STUDENT,
  ];

  const getStageStatus = (stage: CurrentStage): 'completed' | 'current' | 'upcoming' => {
    if (stageOrder.indexOf(stage) < stageOrder.indexOf(student.current_stage)) {
      return 'completed';
    }
    if (stage === student.current_stage) {
      return 'current';
    }
    return 'upcoming';
  };

  const getPalDisplayStatus = (): { label: string; status: 'completed' | 'current' | 'upcoming' } => {
    if (!student.pal_required) {
      return { label: 'PAL Not Required', status: 'completed' };
    }
    if (!student.pal_status) {
      return { label: 'PAL', status: 'upcoming' };
    }
    const label = PAL_STATUS_LABELS[student.pal_status] || student.pal_status;
    if (student.pal_status === PalStatus.VERIFIED || student.pal_status === PalStatus.ISSUED) {
      return { label, status: 'completed' };
    }
    if (student.pal_status === PalStatus.NOT_APPLICABLE) {
      return { label, status: 'completed' };
    }
    return { label, status: 'current' };
  };

  const palDisplay = getPalDisplayStatus();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {student.first_name} {student.last_name}
        </h3>
        <p className="text-sm text-gray-500">
          {student.student_id} | {student.email}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-xs text-gray-500 uppercase">Current Stage</p>
          <p className="text-sm font-medium text-gray-900">{CURRENT_STAGE_LABELS[student.current_stage]}</p>
        </div>
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-xs text-gray-500 uppercase">Enrollment Status</p>
          <p className="text-sm font-medium text-gray-900">{student.enrollment_status || 'N/A'}</p>
        </div>
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-xs text-gray-500 uppercase">PAL Status</p>
          <p className="text-sm font-medium text-gray-900">{palDisplay.label}</p>
        </div>
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-xs text-gray-500 uppercase">Study Permit</p>
          <p className="text-sm font-medium text-gray-900">{student.study_permit_status?.replace(/_/g, ' ') || 'N/A'}</p>
        </div>
      </div>

      <div className="space-y-4">
        {JOURNEY_STAGES.map((stage) => {
          const status = getStageStatus(stage.key);
          return (
            <div key={stage.key} className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                status === 'completed' ? 'bg-green-500 border-green-500' :
                status === 'current' ? 'border-blue-500 bg-blue-50' :
                'border-gray-300 bg-white'
              }`}>
                {status === 'completed' && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {status === 'current' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
              </div>
              <span className={`text-sm ${
                status === 'completed' ? 'text-gray-500 line-through' :
                status === 'current' ? 'text-blue-600 font-medium' :
                'text-gray-400'
              }`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
