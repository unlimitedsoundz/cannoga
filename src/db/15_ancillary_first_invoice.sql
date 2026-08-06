-- =============================================
-- ANCASELLARY FEE: only charged on the first invoice
-- =============================================

-- Flag on the offer: once any tuition payment for this application completes,
-- ancillary fees are considered already charged and excluded from future invoices.
ALTER TABLE public.admission_offers
ADD COLUMN IF NOT EXISTS ancillary_charged BOOLEAN NOT NULL DEFAULT FALSE;

-- Snapshot on each payment record whether ancillary fees were included,
-- so receipts can reflect exactly what was paid.
ALTER TABLE public.tuition_payments
ADD COLUMN IF NOT EXISTS ancillary_included BOOLEAN NOT NULL DEFAULT FALSE;

-- Backfill: payments that completed before this change already included ancillary
UPDATE public.tuition_payments
SET ancillary_included = TRUE
WHERE status = 'COMPLETED';
