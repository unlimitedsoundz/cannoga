-- Fix: Add missing course for student program_id reference
-- Run this in Supabase SQL Editor

INSERT INTO "Course" (id, title, slug, degreeLevel, duration, schoolId, description, language)
VALUES (
  '81236fc9-a2d7-4d8c-8160-750e9dca90c8',
  'Bachelor of Science in Nursing',
  'bachelor-of-science-in-nursing',
  'BACHELOR',
  '4 years',
  'health-community',
  'A comprehensive nursing program preparing students for professional healthcare practice.',
  'English'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  updatedAt = CURRENT_TIMESTAMP;
