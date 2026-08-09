-- =============================================
-- FIX INSTRUCTOR REFERENCES TO USE FACULTY TABLE
-- =============================================

-- Drop policy that depends on instructor_id column
DROP POLICY IF EXISTS "Instructors manage own availability" ON public.instructor_availability;

-- Drop existing FK constraints that reference profiles
ALTER TABLE public.course_sections DROP CONSTRAINT IF EXISTS course_sections_instructor_id_fkey;
ALTER TABLE public.course_section_meetings DROP CONSTRAINT IF EXISTS course_section_meetings_instructor_id_fkey;
ALTER TABLE public.instructor_availability DROP CONSTRAINT IF EXISTS instructor_availability_instructor_id_fkey;

-- Change instructor_id columns to TEXT to match Faculty.id type
ALTER TABLE public.course_sections ALTER COLUMN instructor_id TYPE TEXT USING instructor_id::text;
ALTER TABLE public.course_section_meetings ALTER COLUMN instructor_id TYPE TEXT USING instructor_id::text;
ALTER TABLE public.instructor_availability ALTER COLUMN instructor_id TYPE TEXT USING instructor_id::text;

-- Add new FK constraints referencing Faculty
ALTER TABLE public.course_sections ADD CONSTRAINT course_sections_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public."Faculty"(id) ON DELETE SET NULL;
ALTER TABLE public.course_section_meetings ADD CONSTRAINT course_section_meetings_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public."Faculty"(id) ON DELETE SET NULL;
ALTER TABLE public.instructor_availability ADD CONSTRAINT instructor_availability_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public."Faculty"(id) ON DELETE CASCADE;

-- Recreate the policy
CREATE POLICY "Instructors manage own availability" ON public.instructor_availability FOR ALL USING (
  auth.uid()::text = instructor_id
);
