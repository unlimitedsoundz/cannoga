import { PalStatus, PalRecord } from '@/types/pal';

export function isPalRequired(
  studentType?: string,
  citizenship?: string,
  countryOfResidence?: string
): boolean {
  if (studentType === 'domestic') {
    return false;
  }

  if (!studentType || studentType !== 'international') {
    return true;
  }

  return true;
}

export function getExemptionReason(
  studentType?: string,
  citizenship?: string,
  countryOfResidence?: string
): string | undefined {
  if (studentType === 'domestic') {
    return 'Student is domestic; PAL not required.';
  }

  if (citizenship === 'Canada' || countryOfResidence === 'Canada') {
    return 'Student is a Canadian citizen or permanent resident; PAL not required.';
  }

  return undefined;
}

export function getInitialPalStatus(
  tuitionDepositPaid: boolean,
  tuitionDepositVerified: boolean,
  studentType?: string,
  citizenship?: string,
  countryOfResidence?: string
): { status: PalStatus; required: boolean; exemptionReason?: string } {
  const required = isPalRequired(studentType, citizenship, countryOfResidence);

  if (!required) {
    return {
      status: PalStatus.NOT_APPLICABLE,
      required: false,
      exemptionReason: getExemptionReason(studentType, citizenship, countryOfResidence),
    };
  }

  if (!tuitionDepositPaid) {
    return {
      status: PalStatus.PENDING_DEPOSIT,
      required: true,
    };
  }

  if (tuitionDepositPaid && !tuitionDepositVerified) {
    return {
      status: PalStatus.PENDING_DEPOSIT,
      required: true,
    };
  }

  return {
    status: PalStatus.ELIGIBLE_FOR_PROCESSING,
    required: true,
  };
}

export function buildPalRecord(
  tuitionDepositPaid: boolean,
  tuitionDepositVerified: boolean,
  studentType?: string,
  citizenship?: string,
  countryOfResidence?: string
): PalRecord {
  const { status, required, exemptionReason } = getInitialPalStatus(
    tuitionDepositPaid,
    tuitionDepositVerified,
    studentType,
    citizenship,
    countryOfResidence
  );

  const now = new Date().toISOString();

  return {
    status,
    required,
    exemptionReason,
    requestedAt: status === PalStatus.ELIGIBLE_FOR_PROCESSING ? now : undefined,
    notes: exemptionReason,
  };
}

export function canTransitionTo(
  current: PalStatus,
  next: PalStatus
): boolean {
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
