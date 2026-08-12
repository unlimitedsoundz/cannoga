'use server';

import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { CurrentStage, StudyPermitStatus, PreArrivalStatus, ArrivalStatus, CheckinStatus, OrientationStatus, RegistrationStatus } from '@/types/journey';
import { PalStatus } from '@/types/pal';
import { updateStudentCurrentStage, updateStudyPermitStatus, updatePreArrivalStatus, recordArrival, updateCheckinStatus, updateOrientationStatus, updateRegistrationStatus, getJourneyStatusHistory } from '@/utils/journey';
import { updatePalStatus } from '@/utils/pal-status';

export async function adminUpdateCurrentStage(studentId: string, stage: CurrentStage, reason?: string) {
  return updateStudentCurrentStage(studentId, stage, reason);
}

export async function adminUpdatePalStatus(studentId: string, status: PalStatus, options?: { issuedAt?: string; verifiedAt?: string; expiresAt?: string; notes?: string }) {
  return updatePalStatus(studentId, status, options);
}

export async function adminUpdateStudyPermitStatus(studentId: string, status: StudyPermitStatus, notes?: string) {
  return updateStudyPermitStatus(studentId, status, notes);
}

export async function adminUpdatePreArrivalStatus(studentId: string, status: PreArrivalStatus, notes?: string) {
  return updatePreArrivalStatus(studentId, status, notes);
}

export async function adminRecordArrival(studentId: string, arrivalDate?: string) {
  return recordArrival(studentId, arrivalDate);
}

export async function adminUpdateCheckinStatus(studentId: string, status: CheckinStatus, notes?: string) {
  return updateCheckinStatus(studentId, status, notes);
}

export async function adminUpdateOrientationStatus(studentId: string, status: OrientationStatus, notes?: string) {
  return updateOrientationStatus(studentId, status, notes);
}

export async function adminUpdateRegistrationStatus(studentId: string, status: RegistrationStatus) {
  return updateRegistrationStatus(studentId, status);
}

export async function adminGetJourneyHistory(studentId: string) {
  return getJourneyStatusHistory(studentId);
}
