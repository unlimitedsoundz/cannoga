-- Migration: Update existing transaction_reference values to new CANXXXXXXXXX format
-- Only updates records that do not already match the CAN + 9 digits pattern

UPDATE public.tuition_payments
SET transaction_reference = 'CAN' || LPAD(floor(random() * 1000000000)::text, 9, '0')
WHERE transaction_reference !~ '^CAN[0-9]{9}$';
