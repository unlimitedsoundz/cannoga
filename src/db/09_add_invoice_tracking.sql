-- Add invoice tracking columns to admission_offers
ALTER TABLE public.admission_offers
ADD COLUMN IF NOT EXISTS invoice_pushed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS invoice_sent_at TIMESTAMPTZ;
