import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { PalStatus, PalRecord } from '@/types/pal';
import { getInitialPalStatus } from '@/utils/pal';

export async function initializePalForStudent(studentId: string): Promise<void> {
  const adminClient = createServiceRoleClient();

  const { data: student, error: studentError } = await adminClient
    .from('students')
    .select('id, tuition_deposit_paid, pal_status, pal_required, application_id')
    .eq('id', studentId)
    .single();

  if (studentError || !student) {
    return;
  }

  if (student.pal_status && student.pal_status !== 'not_applicable') {
    return;
  }

  const { data: application, error: appError } = await adminClient
    .from('applications')
    .select('personal_info')
    .eq('id', student.application_id || '')
    .single();

  if (appError || !application) {
    return;
  }

  const personalInfo = (application as any).personal_info || {};
  const studentType = personalInfo.studentType;
  const citizenship = personalInfo.citizenship;
  const countryOfResidence = personalInfo.countryOfResidence;

  const { status, required, exemptionReason } = getInitialPalStatus(
    student.tuition_deposit_paid,
    true,
    studentType,
    citizenship,
    countryOfResidence
  );

  const updateData: any = {
    pal_status: status,
    pal_required: required,
    pal_updated_at: new Date().toISOString(),
  };

  if (exemptionReason) {
    updateData.pal_exemption_reason = exemptionReason;
  }

  if (status === PalStatus.ELIGIBLE_FOR_PROCESSING) {
    updateData.pal_requested_at = new Date().toISOString();
  }

  await adminClient
    .from('students')
    .update(updateData)
    .eq('id', studentId);
}

export async function updatePalStatus(
  studentId: string,
  newStatus: PalStatus,
  options?: {
    issuedAt?: string;
    verifiedAt?: string;
    expiresAt?: string;
    notes?: string;
  }
): Promise<boolean> {
  const adminClient = createServiceRoleClient();

  const { data: student, error: studentError } = await adminClient
    .from('students')
    .select('pal_status')
    .eq('id', studentId)
    .single();

  if (studentError || !student) {
    return false;
  }

  const currentStatus = student.pal_status as PalStatus;
  if (!canTransitionTo(currentStatus, newStatus)) {
    return false;
  }

  const updateData: any = {
    pal_status: newStatus,
    pal_updated_at: new Date().toISOString(),
  };

  if (newStatus === PalStatus.ISSUED && options?.issuedAt) {
    updateData.pal_issued_at = options.issuedAt;
  }
  if (newStatus === PalStatus.VERIFIED && options?.verifiedAt) {
    updateData.pal_verified_at = options.verifiedAt;
  }
  if (options?.expiresAt) {
    updateData.pal_expires_at = options.expiresAt;
  }
  if (options?.notes) {
    updateData.pal_notes = options.notes;
  }

  const { error } = await adminClient
    .from('students')
    .update(updateData)
    .eq('id', studentId);

  return !error;
}

function canTransitionTo(current: PalStatus, next: PalStatus): boolean {
  const allowed: Record<PalStatus, PalStatus[]> = {
    [PalStatus.NOT_APPLICABLE]: [],
    [PalStatus.PENDING_DEPOSIT]: [PalStatus.ELIGIBLE_FOR_PROCESSING, PalStatus.NOT_APPLICABLE],
    [PalStatus.ELIGIBLE_FOR_PROCESSING]: [
      PalStatus.PROCESSING,
      PalStatus.REQUESTED,
      PalStatus.REQUIRES_ACTION,
      PalStatus.NOT_ISSUED,
    ],
    [PalStatus.PROCESSING]: [
      PalStatus.REQUESTED,
      PalStatus.ISSUED,
      PalStatus.UPLOADED,
      PalStatus.VERIFIED,
      PalStatus.REQUIRES_ACTION,
      PalStatus.NOT_ISSUED,
      PalStatus.EXPIRED,
    ],
    [PalStatus.REQUESTED]: [
      PalStatus.PROCESSING,
      PalStatus.ISSUED,
      PalStatus.UPLOADED,
      PalStatus.VERIFIED,
      PalStatus.REQUIRES_ACTION,
      PalStatus.NOT_ISSUED,
      PalStatus.EXPIRED,
    ],
    [PalStatus.ISSUED]: [
      PalStatus.UPLOADED,
      PalStatus.VERIFIED,
      PalStatus.EXPIRED,
      PalStatus.REQUIRES_ACTION,
    ],
    [PalStatus.UPLOADED]: [
      PalStatus.VERIFIED,
      PalStatus.REQUIRES_ACTION,
      PalStatus.EXPIRED,
    ],
    [PalStatus.VERIFIED]: [
      PalStatus.EXPIRED,
      PalStatus.REQUIRES_ACTION,
    ],
    [PalStatus.NOT_ISSUED]: [PalStatus.ELIGIBLE_FOR_PROCESSING, PalStatus.REQUIRES_ACTION],
    [PalStatus.EXPIRED]: [PalStatus.ELIGIBLE_FOR_PROCESSING, PalStatus.REQUIRES_ACTION],
    [PalStatus.REQUIRES_ACTION]: [
      PalStatus.ELIGIBLE_FOR_PROCESSING,
      PalStatus.PROCESSING,
      PalStatus.REQUESTED,
      PalStatus.NOT_ISSUED,
    ],
  };

  return allowed[current]?.includes(next) ?? false;
}
