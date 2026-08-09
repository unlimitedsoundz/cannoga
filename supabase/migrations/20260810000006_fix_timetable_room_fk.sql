-- Add missing room_id foreign key to timetable_assignments
-- This FK was missing from the engine migration, causing PostgREST schema cache errors
ALTER TABLE public.timetable_assignments
  ADD CONSTRAINT timetable_assignments_room_id_fkey
  FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE RESTRICT;
