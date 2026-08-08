-- =============================================
-- FIX TEXT/UUID TYPE MISMATCH IN TRIGGERS
-- students.application_id is TEXT but applications.id is UUID
-- students.id is TEXT but some triggers declare UUID variables
-- =============================================

-- 1. Fix sync_tuition_deposit_status()
CREATE OR REPLACE FUNCTION sync_tuition_deposit_status()
RETURNS TRIGGER AS $$
DECLARE
    v_student_id TEXT;
BEGIN
    IF NEW.status = 'COMPLETED' THEN
        SELECT s.id INTO v_student_id
        FROM public.students s
        JOIN public.applications a ON a.id::TEXT = s.application_id
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

-- 2. Fix sync_full_tuition_status()
CREATE OR REPLACE FUNCTION sync_full_tuition_status()
RETURNS TRIGGER AS $$
DECLARE
    v_student_id TEXT;
BEGIN
    IF NEW.status = 'COMPLETED' AND NEW.invoice_type = 'TUITION_FULL' THEN
        SELECT s.id INTO v_student_id
        FROM public.students s
        JOIN public.applications a ON a.id::TEXT = s.application_id
        JOIN public.admission_offers ao ON ao.application_id = a.id
        WHERE ao.id = NEW.offer_id
        LIMIT 1;

        IF v_student_id IS NOT NULL THEN
            UPDATE public.students
            SET full_tuition_paid = TRUE,
                full_tuition_paid_at = COALESCE(NEW.created_at, NOW()),
                tuition_deposit_paid = TRUE,
                tuition_deposit_paid_at = COALESCE(tuition_deposit_paid_at, NEW.created_at, NOW()),
                updated_at = NOW()
            WHERE id = v_student_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Fix sync_pal_status()
CREATE OR REPLACE FUNCTION sync_pal_status()
RETURNS TRIGGER AS $$
DECLARE
    v_student_id TEXT;
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
        JOIN public.applications a ON a.id::TEXT = s.application_id
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

-- 4. Fix backfill queries that compare a.id = s.application_id
-- Backfill tuition deposit status
UPDATE public.students s
SET 
    tuition_deposit_paid = TRUE,
    tuition_deposit_paid_at = (
        SELECT MIN(tp.created_at) FROM public.tuition_payments tp
        JOIN public.admission_offers ao ON ao.id = tp.offer_id
        JOIN public.applications a ON a.id::TEXT = s.application_id
        WHERE a.id = ao.application_id AND tp.status = 'COMPLETED'
    ),
    updated_at = NOW()
WHERE EXISTS (
    SELECT 1 FROM public.tuition_payments tp
    JOIN public.admission_offers ao ON ao.id = tp.offer_id
    JOIN public.applications a ON a.id::TEXT = s.application_id
    WHERE a.id = ao.application_id AND tp.status = 'COMPLETED'
);

-- Backfill full tuition status
UPDATE public.students s
SET full_tuition_paid = TRUE,
    full_tuition_paid_at = (
        SELECT MIN(tp.created_at) FROM public.tuition_payments tp
        JOIN public.admission_offers ao ON ao.id = tp.offer_id
        JOIN public.applications a ON a.id::TEXT = s.application_id
        WHERE a.id = ao.application_id AND tp.status = 'COMPLETED' AND tp.invoice_type = 'TUITION_FULL'
    ),
    updated_at = NOW()
WHERE EXISTS (
    SELECT 1 FROM public.tuition_payments tp
    JOIN public.admission_offers ao ON ao.id = tp.offer_id
    JOIN public.applications a ON a.id::TEXT = s.application_id
    WHERE a.id = ao.application_id AND tp.status = 'COMPLETED' AND tp.invoice_type = 'TUITION_FULL'
);

-- Backfill: a completed full-tuition payment also satisfies the tuition deposit
UPDATE public.students s
SET tuition_deposit_paid = TRUE,
    tuition_deposit_paid_at = COALESCE(tuition_deposit_paid_at, s.full_tuition_paid_at, NOW()),
    updated_at = NOW()
WHERE s.full_tuition_paid = TRUE;
