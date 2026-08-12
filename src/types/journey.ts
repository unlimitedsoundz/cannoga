export enum StudyPermitStatus {
  NOT_STARTED = 'not_started',
  PREPARING = 'preparing',
  SUBMITTED = 'submitted',
  BIOMETRICS_REQUIRED = 'biometrics_required',
  BIOMETRICS_COMPLETED = 'biometrics_completed',
  PROCESSING = 'processing',
  ADDITIONAL_INFORMATION_REQUESTED = 'additional_information_requested',
  APPROVED = 'approved',
  REFUSED = 'refused',
  WITHDRAWN = 'withdrawn',
}

export enum PreArrivalStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum ArrivalStatus {
  NOT_STARTED = 'not_started',
  ARRIVED = 'arrived',
}

export enum CheckinStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  REQUIRES_REVIEW = 'requires_review',
  COMPLETED = 'completed',
}

export enum OrientationStatus {
  NOT_STARTED = 'not_started',
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
}

export enum RegistrationStatus {
  NOT_STARTED = 'not_started',
  ELIGIBLE = 'eligible',
  REGISTRATION_OPEN = 'registration_open',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum CurrentStage {
  APPLICATION = 'application',
  APPLICATION_REVIEW = 'application_review',
  ACCEPTED = 'accepted',
  LETTER_OF_ACCEPTANCE = 'letter_of_acceptance',
  TUITION_DEPOSIT_REQUIRED = 'tuition_deposit_required',
  TUITION_DEPOSIT_PAID = 'tuition_deposit_paid',
  TUITION_DEPOSIT_VERIFIED = 'tuition_deposit_verified',
  PAL_PROCESSING = 'pal_processing',
  PAL_ISSUED = 'pal_issued',
  STUDY_PERMIT_PREPARATION = 'study_permit_preparation',
  STUDY_PERMIT_APPLICATION = 'study_permit_application',
  IRCC_PROCESSING = 'ircc_processing',
  STUDY_PERMIT_DECISION = 'study_permit_decision',
  PRE_ARRIVAL = 'pre_arrival',
  ARRIVAL_IN_CANADA = 'arrival_in_canada',
  INTERNATIONAL_STUDENT_CHECKIN = 'international_student_checkin',
  ORIENTATION = 'orientation',
  ACADEMIC_REGISTRATION = 'academic_registration',
  ENROLLED = 'enrolled',
  ACTIVE_STUDENT = 'active_student',
}

export const CURRENT_STAGE_LABELS: Record<CurrentStage, string> = {
  [CurrentStage.APPLICATION]: 'Application',
  [CurrentStage.APPLICATION_REVIEW]: 'Application Review',
  [CurrentStage.ACCEPTED]: 'Accepted',
  [CurrentStage.LETTER_OF_ACCEPTANCE]: 'Letter of Acceptance',
  [CurrentStage.TUITION_DEPOSIT_REQUIRED]: 'Tuition Deposit Required',
  [CurrentStage.TUITION_DEPOSIT_PAID]: 'Tuition Deposit Paid',
  [CurrentStage.TUITION_DEPOSIT_VERIFIED]: 'Tuition Deposit Verified',
  [CurrentStage.PAL_PROCESSING]: 'PAL Processing',
  [CurrentStage.PAL_ISSUED]: 'PAL Issued',
  [CurrentStage.STUDY_PERMIT_PREPARATION]: 'Study Permit Preparation',
  [CurrentStage.STUDY_PERMIT_APPLICATION]: 'Study Permit Application',
  [CurrentStage.IRCC_PROCESSING]: 'IRCC Processing',
  [CurrentStage.STUDY_PERMIT_DECISION]: 'Study Permit Decision',
  [CurrentStage.PRE_ARRIVAL]: 'Pre-Arrival',
  [CurrentStage.ARRIVAL_IN_CANADA]: 'Arrival in Canada',
  [CurrentStage.INTERNATIONAL_STUDENT_CHECKIN]: 'International Student Check-In',
  [CurrentStage.ORIENTATION]: 'Orientation',
  [CurrentStage.ACADEMIC_REGISTRATION]: 'Academic Registration',
  [CurrentStage.ENROLLED]: 'Enrolled',
  [CurrentStage.ACTIVE_STUDENT]: 'Active Student',
};

export const JOURNEY_STAGES = [
  { key: CurrentStage.APPLICATION, label: 'Application', group: 'application' },
  { key: CurrentStage.APPLICATION_REVIEW, label: 'Application Review', group: 'application' },
  { key: CurrentStage.ACCEPTED, label: 'Accepted', group: 'admission' },
  { key: CurrentStage.LETTER_OF_ACCEPTANCE, label: 'Letter of Acceptance', group: 'admission' },
  { key: CurrentStage.TUITION_DEPOSIT_REQUIRED, label: 'Tuition Deposit Required', group: 'financial' },
  { key: CurrentStage.TUITION_DEPOSIT_PAID, label: 'Tuition Deposit Paid', group: 'financial' },
  { key: CurrentStage.TUITION_DEPOSIT_VERIFIED, label: 'Tuition Deposit Verified', group: 'financial' },
  { key: CurrentStage.PAL_PROCESSING, label: 'PAL Processing', group: 'pal' },
  { key: CurrentStage.PAL_ISSUED, label: 'PAL Issued', group: 'pal' },
  { key: CurrentStage.STUDY_PERMIT_PREPARATION, label: 'Study Permit Preparation', group: 'immigration' },
  { key: CurrentStage.STUDY_PERMIT_APPLICATION, label: 'Study Permit Application', group: 'immigration' },
  { key: CurrentStage.IRCC_PROCESSING, label: 'IRCC Processing', group: 'immigration' },
  { key: CurrentStage.STUDY_PERMIT_DECISION, label: 'Study Permit Decision', group: 'immigration' },
  { key: CurrentStage.PRE_ARRIVAL, label: 'Pre-Arrival', group: 'arrival' },
  { key: CurrentStage.ARRIVAL_IN_CANADA, label: 'Arrival in Canada', group: 'arrival' },
  { key: CurrentStage.INTERNATIONAL_STUDENT_CHECKIN, label: 'International Student Check-In', group: 'arrival' },
  { key: CurrentStage.ORIENTATION, label: 'Orientation', group: 'academic' },
  { key: CurrentStage.ACADEMIC_REGISTRATION, label: 'Academic Registration', group: 'academic' },
  { key: CurrentStage.ENROLLED, label: 'Enrolled', group: 'academic' },
  { key: CurrentStage.ACTIVE_STUDENT, label: 'Active Student', group: 'academic' },
];
