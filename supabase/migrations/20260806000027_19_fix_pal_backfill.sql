-- =============================================
-- FIX PAL BACKFILL DATA
-- Corrects pal_status and pal_required for existing
-- students after the initial migration backfill bug.
-- =============================================

-- 1. Fix international students who should be eligible_for_processing
UPDATE public.students s
SET 
    pal_required = TRUE,
    pal_status = 'eligible_for_processing',
    pal_requested_at = COALESCE(s.pal_requested_at, NOW()),
    pal_updated_at = NOW()
WHERE EXISTS (
    SELECT 1 FROM public.applications a
    WHERE a.id = s.application_id
    AND (a.personal_info->>'studentType') IS DISTINCT FROM 'domestic'
)
AND s.tuition_deposit_paid = TRUE
AND s.pal_status = 'pending_deposit';

-- 2. Fix international students who should remain pending_deposit
UPDATE public.students s
SET 
    pal_required = TRUE,
    pal_status = 'pending_deposit',
    pal_updated_at = NOW()
WHERE EXISTS (
    SELECT 1 FROM public.applications a
    WHERE a.id = s.application_id
    AND (a.personal_info->>'studentType') IS DISTINCT FROM 'domestic'
)
AND s.tuition_deposit_paid != TRUE
AND s.pal_status = 'pending_deposit';

-- 3. Fix domestic students
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
AND s.pal_status != 'not_applicable';
