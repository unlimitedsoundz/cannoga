'use client';

import { CurrentStage, CURRENT_STAGE_LABELS } from '@/types/journey';
import { PalStatus, PAL_STATUS_LABELS } from '@/types/pal';
import { StudyPermitStatus } from '@/types/journey';

interface CurrentStageCardProps {
  currentStage: CurrentStage;
  palStatus?: PalStatus;
  palRequired?: boolean;
  studyPermitStatus?: StudyPermitStatus;
  arrivalStatus?: string;
  checkinStatus?: string;
  orientationStatus?: string;
  registrationStatus?: string;
  enrollmentStatus?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export default function CurrentStageCard({
  currentStage,
  palStatus,
  palRequired,
  studyPermitStatus,
  arrivalStatus,
  checkinStatus,
  orientationStatus,
  registrationStatus,
  enrollmentStatus,
  onAction,
  actionLabel,
}: CurrentStageCardProps) {
  const getStageDescription = (stage: CurrentStage): string => {
    switch (stage) {
      case CurrentStage.APPLICATION:
        return 'Complete and submit your application.';
      case CurrentStage.APPLICATION_REVIEW:
        return 'Your application has been received and is currently under review.';
      case CurrentStage.ACCEPTED:
        return 'Your application has been accepted.';
      case CurrentStage.LETTER_OF_ACCEPTANCE:
        return 'Your Letter of Acceptance has been issued.';
      case CurrentStage.TUITION_DEPOSIT_REQUIRED:
        return 'Complete the required tuition deposit to proceed.';
      case CurrentStage.TUITION_DEPOSIT_PAID:
        return 'Your tuition deposit has been received.';
      case CurrentStage.TUITION_DEPOSIT_VERIFIED:
        return 'Your tuition deposit has been verified. Your PAL process is now available where applicable.';
      case CurrentStage.PAL_PROCESSING:
        return 'Your PAL is being processed where applicable. Please monitor your student portal for updates.';
      case CurrentStage.PAL_ISSUED:
        return 'Your PAL has been issued. You may now proceed with your study permit application.';
      case CurrentStage.STUDY_PERMIT_PREPARATION:
        return 'Prepare your study permit application. Follow current Government of Canada instructions.';
      case CurrentStage.STUDY_PERMIT_APPLICATION:
        return 'Submit your study permit application to IRCC.';
      case CurrentStage.IRCC_PROCESSING:
        return 'Your study permit application is being processed by IRCC.';
      case CurrentStage.STUDY_PERMIT_DECISION:
        return 'Awaiting your study permit decision from IRCC.';
      case CurrentStage.PRE_ARRIVAL:
        return 'Complete your pre-arrival checklist before coming to Canada.';
      case CurrentStage.ARRIVAL_IN_CANADA:
        return 'Confirm your arrival in Canada.';
      case CurrentStage.INTERNATIONAL_STUDENT_CHECKIN:
        return 'Complete your international student check-in process.';
      case CurrentStage.ORIENTATION:
        return 'Attend your scheduled orientation session.';
      case CurrentStage.ACADEMIC_REGISTRATION:
        return 'Complete your academic registration for the upcoming term.';
      case CurrentStage.ENROLLED:
        return 'You have been enrolled at Cannoga College.';
      case CurrentStage.ACTIVE_STUDENT:
        return 'You are an active student at Cannoga College.';
      default:
        return '';
    }
  };

  const getSubStatus = (): string => {
    if (currentStage === CurrentStage.PAL_PROCESSING && palRequired && palStatus) {
      return `PAL Status: ${PAL_STATUS_LABELS[palStatus] || palStatus}`;
    }
    if (currentStage === CurrentStage.STUDY_PERMIT_APPLICATION && studyPermitStatus) {
      return `Study Permit Status: ${studyPermitStatus.replace(/_/g, ' ')}`;
    }
    if (currentStage === CurrentStage.ARRIVAL_IN_CANADA && arrivalStatus) {
      return `Arrival Status: ${arrivalStatus.replace(/_/g, ' ')}`;
    }
    if (currentStage === CurrentStage.INTERNATIONAL_STUDENT_CHECKIN && checkinStatus) {
      return `Check-In Status: ${checkinStatus.replace(/_/g, ' ')}`;
    }
    if (currentStage === CurrentStage.ORIENTATION && orientationStatus) {
      return `Orientation Status: ${orientationStatus.replace(/_/g, ' ')}`;
    }
    if (currentStage === CurrentStage.ACADEMIC_REGISTRATION && registrationStatus) {
      return `Registration Status: ${registrationStatus.replace(/_/g, ' ')}`;
    }
    return '';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Your Current Stage</h2>
          <p className="text-2xl font-bold text-gray-900">{CURRENT_STAGE_LABELS[currentStage]}</p>
          <p className="text-sm text-gray-600 max-w-xl">{getStageDescription(currentStage)}</p>
          {getSubStatus() && (
            <p className="text-xs text-gray-500 mt-2">{getSubStatus()}</p>
          )}
        </div>
        {onAction && actionLabel && (
          <button
            onClick={onAction}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
