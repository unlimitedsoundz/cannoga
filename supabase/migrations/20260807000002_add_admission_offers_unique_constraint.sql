-- Add unique constraint on application_id for admission_offers
-- This allows upsert operations to work correctly with ON CONFLICT
ALTER TABLE public.admission_offers
ADD CONSTRAINT IF NOT EXISTS admission_offers_application_id_key UNIQUE (application_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_admission_offers_application_id ON public.admission_offers(application_id);
