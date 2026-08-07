-- =============================================
-- FIX MISSING STUDENT PAYMENT COLUMNS
-- Adds tuition_deposit_paid, tuition_deposit_paid_at,
-- housing_fee_paid, housing_fee_paid_at if they don't exist.
-- =============================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'students' AND column_name = 'tuition_deposit_paid') THEN
        ALTER TABLE public.students ADD COLUMN tuition_deposit_paid BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'students' AND column_name = 'tuition_deposit_paid_at') THEN
        ALTER TABLE public.students ADD COLUMN tuition_deposit_paid_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'students' AND column_name = 'housing_fee_paid') THEN
        ALTER TABLE public.students ADD COLUMN housing_fee_paid BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'students' AND column_name = 'housing_fee_paid_at') THEN
        ALTER TABLE public.students ADD COLUMN housing_fee_paid_at TIMESTAMPTZ;
    END IF;
END $$;
