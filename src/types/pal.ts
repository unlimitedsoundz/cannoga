export enum PalStatus {
  NOT_APPLICABLE = 'not_applicable',
  PENDING_DEPOSIT = 'pending_deposit',
  ELIGIBLE_FOR_PROCESSING = 'eligible_for_processing',
  PROCESSING = 'processing',
  REQUESTED = 'requested',
  ISSUED = 'issued',
  UPLOADED = 'uploaded',
  VERIFIED = 'verified',
  NOT_ISSUED = 'not_issued',
  EXPIRED = 'expired',
  REQUIRES_ACTION = 'requires_action',
}

export interface PalRecord {
  status: PalStatus;
  required: boolean;
  exemptionReason?: string;
  requestedAt?: string;
  issuedAt?: string;
  verifiedAt?: string;
  expiresAt?: string;
  notes?: string;
}

export const PAL_STATUS_LABELS: Record<PalStatus, string> = {
  [PalStatus.NOT_APPLICABLE]: 'Not Applicable',
  [PalStatus.PENDING_DEPOSIT]: 'Pending Deposit',
  [PalStatus.ELIGIBLE_FOR_PROCESSING]: 'Eligible for Processing',
  [PalStatus.PROCESSING]: 'Processing',
  [PalStatus.REQUESTED]: 'Requested',
  [PalStatus.ISSUED]: 'Issued',
  [PalStatus.UPLOADED]: 'Uploaded',
  [PalStatus.VERIFIED]: 'Verified',
  [PalStatus.NOT_ISSUED]: 'Not Issued',
  [PalStatus.EXPIRED]: 'Expired',
  [PalStatus.REQUIRES_ACTION]: 'Requires Action',
};
