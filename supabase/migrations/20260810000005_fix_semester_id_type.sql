-- Fix semester_id type mismatch
-- semesters.id is TEXT, but housing_applications and class_schedules have semester_id as UUID
-- This causes "invalid input syntax for type uuid" errors when using text semester IDs like "sem-2026-fall"

ALTER TABLE IF EXISTS public.housing_applications
  ALTER COLUMN semester_id TYPE TEXT
  USING semester_id::text;

ALTER TABLE IF EXISTS public.class_schedules
  ALTER COLUMN semester_id TYPE TEXT
  USING semester_id::text;
