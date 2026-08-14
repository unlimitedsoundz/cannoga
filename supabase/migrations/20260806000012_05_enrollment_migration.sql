-- 1. Add ENROLLED to application_status ENUM
-- Note: We can't use IF NOT EXISTS with ALTER TYPE in all versions, 
-- so we use a DO block for safety.
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'application_status' AND e.enumlabel = 'ENROLLED') THEN
        ALTER TYPE public.application_status ADD VALUE 'ENROLLED';
    END IF;
END $$;

-- 2. Add enrollment date to profiles (optional but good for tracking)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS enrollment_date TIMESTAMPTZ;
