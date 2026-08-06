-- Add accepted_at and declined_at to admission_offers
ALTER TABLE public.admission_offers
ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS declined_at TIMESTAMPTZ;
