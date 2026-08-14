-- 1. Add PAYMENT_SUBMITTED to application_status enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'application_status' AND e.enumlabel = 'PAYMENT_SUBMITTED') THEN
        ALTER TYPE public.application_status ADD VALUE 'PAYMENT_SUBMITTED';
    END IF;
END $$;

-- 2. Add PENDING_VERICACATION and verified to payment_status enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'payment_status' AND e.enumlabel = 'PENDING_VERICACATION') THEN
        ALTER TYPE public.payment_status ADD VALUE 'PENDING_VERICACATION';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'payment_status' AND e.enumlabel = 'verified') THEN
        ALTER TYPE public.payment_status ADD VALUE 'verified';
    END IF;
END $$;

-- 3. Update RLS policy for applications
-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Applicants can update own DRAFT applications" ON public.applications;

-- Create a more flexible policy that allows transitions to PAYMENT_SUBMITTED
CREATE POLICY "Applicants can update own application status" ON public.applications 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (
    auth.uid() = user_id AND (
        (status = 'DRAFT' AND (status = 'DRAFT' OR status = 'SUBMITTED' OR status = 'UNDER_REVIEW')) OR
        (status = 'OFFER_ACCEPTED' AND status = 'PAYMENT_SUBMITTED') OR
        (status = 'PAYMENT_SUBMITTED' AND status = 'PAYMENT_SUBMITTED')
    )
);
