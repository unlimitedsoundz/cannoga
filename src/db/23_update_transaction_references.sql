-- Migration: Update existing transaction_reference values to new CANXXXXXXXXX format
-- Generates random 9-digit references for old records (prefixes other than CAN)

UPDATE public.tuition_payments
SET transaction_reference = 'CAN' || LPAD(floor(random() * 900000000 + 100000000)::text, 9, '0')
WHERE transaction_reference IS NULL
   OR transaction_reference !~ '^CAN[0-9]{9}$';
