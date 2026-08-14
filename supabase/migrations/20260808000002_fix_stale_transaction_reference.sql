-- Fix stale transaction reference CAN001000002
-- Generates a new CANXXXXXXXXX reference and updates both payment and receipt documents

DO $$
DECLARE
  new_txn_ref TEXT;
BEGIN
  new_txn_ref := 'CAN' || LPAD(floor(random() * 900000000 + 100000000)::text, 9, '0');

  UPDATE public.tuition_payments
  SET transaction_reference = new_txn_ref
  WHERE transaction_reference = 'CAN001000002';

  UPDATE public.document_records
  SET 
    title = regexp_replace(title, 'CAN001000002', new_txn_ref, 'g'),
    storage_path = regexp_replace(storage_path, 'CAN001000002', new_txn_ref, 'g'),
    metadata = jsonb_set(
      COALESCE(metadata, '{}'),
      '{transaction_reference}',
      to_jsonb(new_txn_ref)
    )
  WHERE document_type = 'tuition_receipt'
    AND (
      metadata->>'transaction_reference' = 'CAN001000002'
      OR title LIKE '%CAN001000002%'
      OR storage_path LIKE '%CAN001000002%'
    );

  RAISE NOTICE 'Updated CAN001000002 to %', new_txn_ref;
END $$;
