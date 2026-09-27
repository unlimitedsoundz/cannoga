-- =============================================
-- FIX OPERATOR DOES NOT EXIST: TEXT = UUID
-- students.id is TEXT, but sync_pal_status was declaring v_student_id as UUID.
-- This caused `UPDATE public.students ... WHERE id = v_student_id` to fail
-- with `operator does not exist: text = uuid` on tuition payment completion.
-- =============================================

CREATE OR REPLACE FUNCTION public.sync_pal_status()
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
