-- Add internal_notes column to applications table
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS internal_notes TEXT;
