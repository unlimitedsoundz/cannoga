-- Fix timetable_assignments instructor_id foreign key
-- The scheduler assigns Faculty IDs, but the column references profiles(id)
-- Make it nullable and drop the incorrect FK

ALTER TABLE public.timetable_assignments 
  ALTER COLUMN instructor_id DROP NOT NULL;

ALTER TABLE public.timetable_assignments 
  DROP CONSTRAINT IF EXISTS timetable_assignments_instructor_id_fkey;

-- Optional: add a comment to clarify
COMMENT ON COLUMN public.timetable_assignments.instructor_id IS 'Faculty ID from Faculty table, not profiles';
