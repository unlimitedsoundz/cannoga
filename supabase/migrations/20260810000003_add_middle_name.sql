-- Add middle_name to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS middle_name TEXT;

-- Add middleName to personal_info JSON structure (no DB change needed, but we document it)
-- Applications.personal_info is a JSONB column, so we just need to update the code to include it.
