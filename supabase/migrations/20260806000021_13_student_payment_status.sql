-- =============================================
-- STUDENT PAYMENT STATUS (Tuition Deposit & Housing Fees)
-- Source of truth: tuition_payments (via admission_offers) and housing_payments
-- =============================================

-- 1. Add payment status columns to the students table
ALTER TABLE public.students
ADD COLUMN IF NOT EXISTS tuition_deposit_paid BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS tuition_deposit_paid_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS housing_fee_paid BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS housing_fee_paid_at TIMESTAMPTZ;

-- 2. Keep tuition_deposit_paid in sync when a tuition payment is completed
CREATE OR REPLACE FUNCTION sync_tuition_deposit_status()
RETURNS TRIGGER AS $$
DECLARE
    v_student_id TEXT;
BEGIN
    IF NEW.status = 'COMPLETED' THEN
        SELECT s.id INTO v_student_id
        FROM public.students s
        JOIN public.applications a ON a.id = s.application_id
        JOIN public.admission_offers ao ON ao.application_id = a.id
        WHERE ao.id = NEW.offer_id
        LIMIT 1;

        IF v_student_id IS NOT NULL THEN
            UPDATE public.students
            SET tuition_deposit_paid = TRUE,
                tuition_deposit_paid_at = COALESCE(NEW.created_at, NOW()),
                updated_at = NOW()
            WHERE id = v_student_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_tuition_payment_complete ON public.tuition_payments;
CREATE TRIGGER on_tuition_payment_complete
    AFTER INSERT OR UPDATE OF status ON public.tuition_payments
    FOR EACH ROW EXECUTE FUNCTION sync_tuition_deposit_status();

-- 3. Keep housing_fee_paid in sync when a housing payment is completed
CREATE OR REPLACE FUNCTION sync_housing_fee_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'COMPLETED' AND (OLD.status IS NULL OR OLD.status != 'COMPLETED') THEN
        UPDATE public.students
        SET housing_fee_paid = TRUE,
            housing_fee_paid_at = COALESCE(NEW.paid_at, NEW.created_at, NOW()),
            updated_at = NOW()
        WHERE id = NEW.student_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'housing_payments') THEN
        DROP TRIGGER IF EXISTS on_housing_payment_complete ON public.housing_payments;
        CREATE TRIGGER on_housing_payment_complete
            AFTER INSERT OR UPDATE OF status ON public.housing_payments
            FOR EACH ROW EXECUTE FUNCTION sync_housing_fee_status();
    END IF;
END $$;

-- 4. Backfill existing students from historical payment records
UPDATE public.students s
SET tuition_deposit_paid = TRUE,
    tuition_deposit_paid_at = (
        SELECT MIN(tp.created_at) FROM public.tuition_payments tp
        JOIN public.admission_offers ao ON ao.id = tp.offer_id
        JOIN public.applications a ON a.id = ao.application_id
        WHERE a.id = s.application_id AND tp.status = 'COMPLETED'
    ),
    updated_at = NOW()
WHERE EXISTS (
    SELECT 1 FROM public.tuition_payments tp
    JOIN public.admission_offers ao ON ao.id = tp.offer_id
    JOIN public.applications a ON a.id = ao.application_id
    WHERE a.id = s.application_id AND tp.status = 'COMPLETED'
);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'housing_payments') THEN
        UPDATE public.students s
        SET housing_fee_paid = TRUE,
            housing_fee_paid_at = (
                SELECT MIN(hp.created_at) FROM public.housing_payments hp
                WHERE hp.student_id = s.id AND hp.status = 'COMPLETED'
            ),
            updated_at = NOW()
        WHERE EXISTS (
            SELECT 1 FROM public.housing_payments hp
            WHERE hp.student_id = s.id AND hp.status = 'COMPLETED'
        );
    END IF;
END $$;

