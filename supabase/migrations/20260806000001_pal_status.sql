-- =============================================
-- PAL STATUS TRACKING
-- Provincial Attestation Letter status stored
-- independently from tuition/payment status.
-- =============================================

-- 1. Add PAL columns to the students table
ALTER TABLE public.students
ADD COLUMN IF NOT EXISTS pal_status TEXT NOT NULL DEFAULT 'not_applicable',
ADD COLUMN IF NOT EXISTS pal_required BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS pal_exemption_reason TEXT,
ADD COLUMN IF NOT EXISTS pal_requested_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS pal_issued_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS pal_verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS pal_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS pal_notes TEXT,
ADD COLUMN IF NOT EXISTS pal_updated_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS tuition_deposit_paid BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Backfill: evaluate existing students and set initial PAL status
-- based on their application personal_info studentType and payment status.
UPDATE public.students s
SET 
    pal_required = TRUE,
    pal_status = 'pending_deposit',
    tuition_deposit_paid = FALSE,
    pal_requested_at = COALESCE(s.pal_requested_at, NOW()),
    pal_updated_at = NOW()
WHERE EXISTS (
    SELECT 1 FROM public.applications a
    WHERE a.id = s.application_id
    AND (a.personal_info->>'studentType') IS DISTINCT FROM 'domestic'
)
AND s.pal_status = 'not_applicable';

UPDATE public.students s
SET 
    pal_required = FALSE,
    pal_status = 'not_applicable',
    pal_exemption_reason = 'Student is domestic; PAL not required.',
    pal_updated_at = NOW()
WHERE EXISTS (
    SELECT 1 FROM public.applications a
    WHERE a.id = s.application_id
    AND (a.personal_info->>'studentType') = 'domestic'
)
AND s.pal_status = 'not_applicable';

-- 3. Trigger: automatically update PAL status when a tuition payment
-- is verified or completed, ensuring the stage unlocks immediately after
-- the institution verifies the required tuition deposit.
CREATE OR REPLACE FUNCTION sync_pal_status()
RETURNS TRIGGER AS $$
DECLARE
    v_student_id UUID;
    v_app_personal_info JSONB;
    v_student_type TEXT;
    v_citizenship TEXT;
    v_country_of_residence TEXT;
    v_tuition_deposit_paid BOOLEAN;
    v_pal_required BOOLEAN;
    v_exemption_reason TEXT;
    v_new_status TEXT;
BEGIN
    IF NEW.status IN ('COMPLETED', 'verified') AND (OLD.status IS NULL OR OLD.status NOT IN ('COMPLETED', 'verified')) THEN
        SELECT s.id, s.tuition_deposit_paid, a.personal_info
        INTO v_student_id, v_tuition_deposit_paid, v_app_personal_info
        FROM public.students s
        JOIN public.applications a ON a.id = s.application_id
        JOIN public.admission_offers ao ON ao.application_id = a.id
        WHERE ao.id = NEW.offer_id
        LIMIT 1;

        IF v_student_id IS NOT NULL THEN
            v_student_type := v_app_personal_info->>'studentType';
            v_citizenship := NULL;
            v_country_of_residence := NULL;

            IF v_student_type = 'domestic' THEN
                v_pal_required := FALSE;
                v_exemption_reason := 'Student is domestic; PAL not required.';
                v_new_status := 'not_applicable';
            ELSE
                v_pal_required := TRUE;
                v_exemption_reason := NULL;
                IF v_tuition_deposit_paid THEN
                    v_new_status := 'eligible_for_processing';
                ELSE
                    v_new_status := 'pending_deposit';
                END IF;
            END IF;

            UPDATE public.students
            SET 
                pal_required = v_pal_required,
                pal_status = v_new_status,
                pal_exemption_reason = v_exemption_reason,
                pal_updated_at = NOW()
            WHERE id = v_student_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_tuition_payment_verified ON public.tuition_payments;
CREATE TRIGGER on_tuition_payment_verified
    AFTER INSERT OR UPDATE OF status ON public.tuition_payments
    FOR EACH ROW EXECUTE FUNCTION sync_pal_status();
