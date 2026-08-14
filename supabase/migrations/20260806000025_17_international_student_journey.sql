-- =============================================
-- INTERNATIONAL STUDENT JOURNEY STAGES
-- Study Permit, Pre-Arrival, Arrival, Check-In,
-- Orientation, Registration status tracking.
-- =============================================

-- 1. Add journey stage columns to the students table
ALTER TABLE public.students
ADD COLUMN IF NOT EXISTS study_permit_status TEXT NOT NULL DEFAULT 'not_started',
ADD COLUMN IF NOT EXISTS study_permit_notes TEXT,
ADD COLUMN IF NOT EXISTS study_permit_updated_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS pre_arrival_status TEXT NOT NULL DEFAULT 'not_started',
ADD COLUMN IF NOT EXISTS pre_arrival_notes TEXT,
ADD COLUMN IF NOT EXISTS pre_arrival_updated_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS arrival_status TEXT NOT NULL DEFAULT 'not_started',
ADD COLUMN IF NOT EXISTS arrival_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS arrival_notes TEXT,
ADD COLUMN IF NOT EXISTS arrival_updated_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS checkin_status TEXT NOT NULL DEFAULT 'not_started',
ADD COLUMN IF NOT EXISTS checkin_notes TEXT,
ADD COLUMN IF NOT EXISTS checkin_updated_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS orientation_status TEXT NOT NULL DEFAULT 'not_started',
ADD COLUMN IF NOT EXISTS orientation_scheduled_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS orientation_completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS orientation_notes TEXT,
ADD COLUMN IF NOT EXISTS orientation_updated_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS registration_status TEXT NOT NULL DEFAULT 'not_started',
ADD COLUMN IF NOT EXISTS registration_updated_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS current_stage TEXT NOT NULL DEFAULT 'application',
ADD COLUMN IF NOT EXISTS journey_updated_at TIMESTAMPTZ;

-- 2. Backfill existing students with default journey statuses
UPDATE public.students
SET 
    current_stage = CASE
        WHEN enrollment_status = 'ACTIVE' THEN 'enrolled'
        WHEN enrollment_status = 'GRADUATED' THEN 'active_student'
        ELSE 'application'
    END,
    journey_updated_at = NOW()
WHERE current_stage = 'application';

-- 3. Journey status history table for audit trail
CREATE TABLE IF NOT EXISTS public.journey_status_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
    stage TEXT NOT NULL,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.journey_status_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view journey history" ON public.journey_status_history;
CREATE POLICY "Admins can view journey history" ON public.journey_status_history
FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'ADMISSIONS'))
);

DROP POLICY IF EXISTS "System can insert journey history" ON public.journey_status_history;
CREATE POLICY "System can insert journey history" ON public.journey_status_history
FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Students can view own journey history" ON public.journey_status_history;
CREATE POLICY "Students can view own journey history" ON public.journey_status_history
FOR SELECT TO authenticated USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

-- 4. Function to log journey status changes
CREATE OR REPLACE FUNCTION log_journey_status_change()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.journey_status_history (
        student_id,
        application_id,
        stage,
        previous_status,
        new_status,
        changed_by,
        changed_at,
        reason,
        metadata
    ) VALUES (
        NEW.id,
        NEW.application_id,
        TG_TABLE_NAME,
        CASE WHEN TG_OP = 'UPDATE' THEN OLD.current_stage ELSE NULL END,
        NEW.current_stage,
        auth.uid(),
        NOW(),
        'Automatic status sync',
        jsonb_build_object(
            'table', TG_TABLE_NAME,
            'operation', TG_OP
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger to log journey changes on students table
DROP TRIGGER IF EXISTS log_journey_changes ON public.students;
CREATE TRIGGER log_journey_changes
    AFTER UPDATE OF current_stage ON public.students
    FOR EACH ROW
    WHEN (OLD.current_stage IS DISTINCT FROM NEW.current_stage)
    EXECUTE FUNCTION log_journey_status_change();
