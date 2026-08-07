-- Add missing columns to tuition_payments table

ALTER TABLE public.tuition_payments
ADD COLUMN IF NOT EXISTS student_id TEXT,
ADD COLUMN IF NOT EXISTS invoice_id TEXT;

-- Add index for student_id lookups
CREATE INDEX IF NOT EXISTS idx_tuition_payments_student_id ON public.tuition_payments(student_id);

-- Add index for invoice_id lookups
CREATE INDEX IF NOT EXISTS idx_tuition_payments_invoice_id ON public.tuition_payments(invoice_id);
