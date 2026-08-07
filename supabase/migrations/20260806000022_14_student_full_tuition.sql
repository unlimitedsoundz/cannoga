-- =============================================
-- STUDENT FULL TUITION PAID STATUS
-- Source of truth: tuition_payments with invoice_type = 'TUITION_FULL'
-- =============================================

-- 1. Add full tuition paid columns to the students table
ALTER TABLE public.students
ADD COLUMN IF NOT EXISTS full_tuition_paid BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS full_tuition_paid_at TIMESTAMPTZ;

-- 2. Keep full_tuition_paid in sync when a full-tuition payment is completed
CREATE OR REPLACE FUNCTION sync_full_tuition_status()
RETURNS TRIGGER AS $$
DECLARE
    v_student_id TEXT;
BEGIN
    IF NEW.status = 'COMPLETED' AND NEW.invoice_type = 'TUITION_FULL' THEN
        SELECT s.id INTO v_student_id
        FROM public.students s
        JOIN public.applications a ON a.id = s.application_id
        JOIN public.admission_offers ao ON ao.application_id = a.id
        WHERE ao.id = NEW.offer_id
        LIMIT 1;

        IF v_student_id IS NOT NULL THEN
            UPDATE public.students
            SET full_tuition_paid = TRUE,
                full_tuition_paid_at = COALESCE(NEW.created_at, NOW()),
                -- Paying the full tuition also satisfies the tuition deposit
                tuition_deposit_paid = TRUE,
                tuition_deposit_paid_at = COALESCE(tuition_deposit_paid_at, NEW.created_at, NOW()),
                updated_at = NOW()
            WHERE id = v_student_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_full_tuition_payment_complete ON public.tuition_payments;
CREATE TRIGGER on_full_tuition_payment_complete
    AFTER INSERT OR UPDATE OF status ON public.tuition_payments
    FOR EACH ROW EXECUTE FUNCTION sync_full_tuition_status();

-- 3. Backfill existing students with a completed full-tuition payment
UPDATE public.students s
SET full_tuition_paid = TRUE,
    full_tuition_paid_at = (
        SELECT MIN(tp.created_at) FROM public.tuition_payments tp
        JOIN public.admission_offers ao ON ao.id = tp.offer_id
        JOIN public.applications a ON a.id = ao.application_id
        WHERE a.id = s.application_id AND tp.status = 'COMPLETED' AND tp.invoice_type = 'TUITION_FULL'
    ),
    updated_at = NOW()
    WHERE EXISTS (
        SELECT 1 FROM public.tuition_payments tp
        JOIN public.admission_offers ao ON ao.id = tp.offer_id
        JOIN public.applications a ON a.id = ao.application_id
        WHERE a.id = s.application_id AND tp.status = 'COMPLETED' AND tp.invoice_type = 'TUITION_FULL'
    );

-- 4. Backfill: a completed full-tuition payment also satisfies the tuition deposit
UPDATE public.students s
SET tuition_deposit_paid = TRUE,
    tuition_deposit_paid_at = COALESCE(tuition_deposit_paid_at, s.full_tuition_paid_at, NOW()),
    updated_at = NOW()
WHERE s.full_tuition_paid = TRUE;


