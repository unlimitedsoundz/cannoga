-- Migration to add portal and sis access control columns to profiles and students
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "portal_access_disabled" BOOLEAN DEFAULT FALSE;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "sis_access_disabled" BOOLEAN DEFAULT FALSE;

ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "portal_access_disabled" BOOLEAN DEFAULT FALSE;
ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "sis_access_disabled" BOOLEAN DEFAULT FALSE;
