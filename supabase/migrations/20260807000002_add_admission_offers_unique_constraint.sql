-- Add unique constraint on application_id for admission_offers
-- This allows upsert operations to work correctly with ON CONFLICT
DO $$
BEGIN
    ALTER TABLE public.admission_offers
    ADD CONSTRAINT admission_offers_application_id_key UNIQUE (application_id);
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END $$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_admission_offers_application_id ON public.admission_offers(application_id);
