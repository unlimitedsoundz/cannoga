-- Fix stale transaction reference CAN001000002
-- Generates a new CANXXXXXXXXX reference and updates both payment and receipt documents
-- Uses a single random reference for both updates

WITH updated_payment AS (
  UPDATE public.tuition_payments
  SET transaction_reference = 'CAN' || LPAD(floor(random() * 900000000 + 100000000)::text, 9, '0')
  WHERE transaction_reference = 'CAN001000002'
  RETURNING transaction_reference AS new_txn_ref
)
UPDATE public.document_records
SET 
  title = regexp_replace(title, 'CAN001000002', updated_payment.new_txn_ref, 'g'),
  storage_path = regexp_replace(storage_path, 'CAN001000002', updated_payment.new_txn_ref, 'g'),
  metadata = jsonb_set(
    metadata,
    '{transaction_reference}',
    to_jsonb(updated_payment.new_txn_ref)
  )
FROM updated_payment
WHERE document_type = 'tuition_receipt'
  AND (
    metadata->>'transaction_reference' = 'CAN001000002'
    OR title LIKE '%CAN001000002%'
    OR storage_path LIKE '%CAN001000002%'
  )
