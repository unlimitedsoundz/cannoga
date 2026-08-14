-- Make the semesters table consistent with the application code, which reads/writes a
-- `status` column (values: ACTIVE / UPCOMING / COMPLETED) on the registrar/admin side.
-- The live table previously only had `is_current` (boolean).
ALTER TABLE "semesters" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'UPCOMING';
UPDATE "semesters" SET "status" = CASE WHEN "is_current" THEN 'ACTIVE' ELSE 'UPCOMING' END;

-- Seed the three canonical intakes so the housing-application and registrar
-- semester selectors surface them as options.
-- Remote "semesters" columns: id (uuid), name, start_date (date),
-- end_date (date), is_current (bool), status (text), created_at.
-- Autumn 2026 / Spring 2026 are legacy terms that map onto the September 2026
-- intake, so they are reassigned to Fall 2026 and removed below.
INSERT INTO "semesters" ("name", "start_date", "end_date", "is_current", "status")
SELECT v.name, v.start_date, v.end_date, v.is_current, v.status
FROM (VALUES
    ('Fall 2026',   '2026-09-11'::date, '2027-08-31'::date, true,  'ACTIVE'),
    ('Winter 2027', '2027-01-18'::date, '2028-01-15'::date, false, 'UPCOMING'),
    ('Fall 2027',   '2027-09-11'::date, '2028-08-31'::date, false, 'UPCOMING')
) AS v(name, start_date, end_date, is_current, status)
WHERE NOT EXISTS (SELECT 1 FROM "semesters" WHERE "name" = v.name);

-- Reassign any legacy-term references onto the September 2026 intake (Fall 2026)
-- before dropping the legacy terms, so real student/housing records are preserved.
UPDATE "housing_applications" SET "semester_id" = (SELECT "id" FROM "semesters" WHERE "name" = 'Fall 2026' LIMIT 1)
WHERE "semester_id" IN (SELECT "id" FROM "semesters" WHERE "name" IN ('Spring 2026', 'Autumn 2026'));
UPDATE "module_enrollments" SET "semester_id" = (SELECT "id" FROM "semesters" WHERE "name" = 'Fall 2026' LIMIT 1)
WHERE "semester_id" IN (SELECT "id" FROM "semesters" WHERE "name" IN ('Spring 2026', 'Autumn 2026'));
UPDATE "class_sessions" SET "semester_id" = (SELECT "id" FROM "semesters" WHERE "name" = 'Fall 2026' LIMIT 1)
WHERE "semester_id" IN (SELECT "id" FROM "semesters" WHERE "name" IN ('Spring 2026', 'Autumn 2026'));
UPDATE "registration_windows" SET "semester_id" = (SELECT "id" FROM "semesters" WHERE "name" = 'Fall 2026' LIMIT 1)
WHERE "semester_id" IN (SELECT "id" FROM "semesters" WHERE "name" IN ('Spring 2026', 'Autumn 2026'));

-- Keep only the three canonical intakes.
DELETE FROM "semesters" WHERE "name" IN ('Spring 2026', 'Autumn 2026');
