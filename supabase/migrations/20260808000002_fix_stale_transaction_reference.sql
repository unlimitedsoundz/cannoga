-- Fix stale transaction reference CAN001000002
-- This updates the tuition_payments record and refreshes the receipt document record

DO $$
DECLARE
  target_payment RECORD;
  new_txn_ref TEXT;
BEGIN
  -- Find the payment with the old transaction reference
  SELECT * INTO target_payment
  FROM public.tuition_payments
  WHERE transaction_reference = 'CAN001000002'
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE NOTICE 'No payment found with transaction_reference = CAN001000002';
    RETURN;
  END IF;

  -- Set new transaction reference to the payment UUID to avoid stale references
  new_txn_ref := 'TXN-' || substr(target_payment.id::text, 1, 8);

  -- Update the payment record
  UPDATE public.tuition_payments
  SET transaction_reference = new_txn_ref,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = target_payment.id;

  -- Update document_records metadata and title for the receipt
  UPDATE public.document_records
  SET title = 'Tuition Receipt - ' || new_txn_ref,
      metadata = jsonb_set(
        COALESCE(metadata, '{}'),
        '{transaction_reference}',
        to_jsonb(new_txn_ref)
      ),
      updated_at = CURRENT_TIMESTAMP
  WHERE student_id IN (
    SELECT id FROM public.students WHERE user_id = (
      SELECT user_id FROM public.applications WHERE id = (
        SELECT application_id FROM public.admission_offers WHERE id = target_payment.offer_id
      )
    )
  )
  AND document_type = 'tuition_receipt';

  RAISE NOTICE 'Updated transaction_reference to % for payment %', new_txn_ref, target_payment.id;
END $$;
