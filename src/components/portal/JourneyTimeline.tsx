'use client';

import { CurrentStage, CURRENT_STAGE_LABELS, JOURNEY_STAGES } from '@/types/journey';
import { PalStatus, PAL_STATUS_LABELS } from '@/types/pal';
import { StudyPermitStatus } from '@/types/journey';

interface JourneyTimelineProps {
  currentStage: CurrentStage;
  palStatus?: PalStatus;
  palRequired?: boolean;
  studyPermitStatus?: StudyPermitStatus;
  arrivalStatus?: string;
  checkinStatus?: string;
  orientationStatus?: string;
  registrationStatus?: string;
  enrollmentStatus?: string;
}

export default function JourneyTimeline({
  currentStage,
  palStatus,
  palRequired,
  studyPermitStatus,
  arrivalStatus,
  checkinStatus,
  orientationStatus,
  registrationStatus,
  enrollmentStatus,
}: JourneyTimelineProps) {
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
    if (stageOrder.indexOf(stage) < stageOrder.indexOf(currentStage)) {
      return 'completed';
    }
    if (stage === currentStage) {
      return 'current';
    }
    return 'upcoming';
  };

  const getPalDisplayStatus = (): { label: string; status: 'completed' | 'current' | 'upcoming' } => {
    if (!palRequired) {
      return { label: 'PAL Not Required', status: 'completed' };
    }
    if (!palStatus) {
      return { label: 'PAL', status: 'upcoming' };
    }
    const label = PAL_STATUS_LABELS[palStatus] || palStatus;
    if (palStatus === PalStatus.VERIFIED || palStatus === PalStatus.ISSUED) {
      return { label, status: 'completed' };
    }
    if (palStatus === PalStatus.NOT_APPLICABLE) {
      return { label, status: 'completed' };
    }
    return { label, status: 'current' };
  };

  const groups = [
    { name: 'APPLICATION', stages: [CurrentStage.APPLICATION, CurrentStage.APPLICATION_REVIEW, CurrentStage.ACCEPTED] },
    { name: 'ADMISSION', stages: [CurrentStage.LETTER_OF_ACCEPTANCE] },
    { name: 'FINANCIAL', stages: [CurrentStage.TUITION_DEPOSIT_REQUIRED, CurrentStage.TUITION_DEPOSIT_PAID, CurrentStage.TUITION_DEPOSIT_VERIFIED] },
    { name: 'PAL', stages: [CurrentStage.PAL_PROCESSING, CurrentStage.PAL_ISSUED] },
    { name: 'IMMIGRATION', stages: [CurrentStage.STUDY_PERMIT_PREPARATION, CurrentStage.STUDY_PERMIT_APPLICATION, CurrentStage.IRCC_PROCESSING, CurrentStage.STUDY_PERMIT_DECISION] },
    { name: 'ARRIVAL', stages: [CurrentStage.PRE_ARRIVAL, CurrentStage.ARRIVAL_IN_CANADA, CurrentStage.INTERNATIONAL_STUDENT_CHECKIN] },
    { name: 'ACADEMIC', stages: [CurrentStage.ORIENTATION, CurrentStage.ACADEMIC_REGISTRATION, CurrentStage.ENROLLED, CurrentStage.ACTIVE_STUDENT] },
  ];

  const palDisplay = getPalDisplayStatus();

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.name} className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">{group.name}</h3>
          <div className="space-y-2">
            {group.stages.map((stage) => {
              const status = getStageStatus(stage);
              return (
                <div key={stage} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    status === 'completed' ? 'bg-green-500 border-green-500' :
                    status === 'current' ? 'border-blue-500 bg-blue-50' :
                    'border-gray-300 bg-white'
                  }`}>
                    {status === 'completed' && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {status === 'current' && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span className={`text-sm ${
                    status === 'completed' ? 'text-gray-500 line-through' :
                    status === 'current' ? 'text-blue-600 font-medium' :
                    'text-gray-400'
                  }`}>
                    {CURRENT_STAGE_LABELS[stage]}
                  </span>
                </div>
              );
            })}
            {group.name === 'PAL' && (
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  palDisplay.status === 'completed' ? 'bg-green-500 border-green-500' :
                  palDisplay.status === 'current' ? 'border-blue-500 bg-blue-50' :
                  'border-gray-300 bg-white'
                }`}>
                  {palDisplay.status === 'completed' && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {palDisplay.status === 'current' && (
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </div>
                <span className={`text-sm ${
                  palDisplay.status === 'completed' ? 'text-gray-500 line-through' :
                  palDisplay.status === 'current' ? 'text-blue-600 font-medium' :
                  'text-gray-400'
                }`}>
                  {palDisplay.label}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
