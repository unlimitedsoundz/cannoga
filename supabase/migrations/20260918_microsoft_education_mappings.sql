-- ==============================================================================
-- MIGRATION: Microsoft 365 Education Mappings for Cannoga SIS
-- Description: Non-destructive additions to support Microsoft Education & Teams
-- ==============================================================================

-- 1. Extend students table with Microsoft Entra Identity fields
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS microsoft_user_id TEXT,
ADD COLUMN IF NOT EXISTS microsoft_upn TEXT,
ADD COLUMN IF NOT EXISTS microsoft_tenant_id TEXT;

CREATE INDEX IF NOT EXISTS idx_students_microsoft_user_id ON public.students(microsoft_user_id);
CREATE INDEX IF NOT EXISTS idx_students_microsoft_upn ON public.students(microsoft_upn);

-- 2. Extend course_sections table with Microsoft Teams / Class Team mappings
ALTER TABLE public.course_sections 
ADD COLUMN IF NOT EXISTS microsoft_class_id TEXT,
ADD COLUMN IF NOT EXISTS microsoft_team_id TEXT,
ADD COLUMN IF NOT EXISTS microsoft_group_id TEXT;

CREATE INDEX IF NOT EXISTS idx_course_sections_microsoft_class_id ON public.course_sections(microsoft_class_id);
CREATE INDEX IF NOT EXISTS idx_course_sections_microsoft_team_id ON public.course_sections(microsoft_team_id);

-- 3. Extend profiles table with Microsoft Entra identity fields (for faculty / staff)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS microsoft_user_id TEXT,
ADD COLUMN IF NOT EXISTS microsoft_upn TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_microsoft_user_id ON public.profiles(microsoft_user_id);
