-- Migration: Update existing transaction_reference values to new CANXXXXXXXXX format
-- Only updates records that do not already match the CAN + 9 digits pattern

WITH numbered AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY created_at) AS rn,
    transaction_reference
  FROM public.tuition_payments
  WHERE transaction_reference !~ '^CAN[0-9]{9}$'
)
UPDATE public.tuition_payments t
SET transaction_reference = 'CAN' || LPAD(floor(random() * 1000000000)::text, 9, '0')
FROM numbered n
WHERE t.id = n.id;
