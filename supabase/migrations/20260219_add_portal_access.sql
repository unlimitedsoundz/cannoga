-- Add portal_access_disabled column to profiles table
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "portal_access_disabled" BOOLEAN DEFAULT FALSE;
