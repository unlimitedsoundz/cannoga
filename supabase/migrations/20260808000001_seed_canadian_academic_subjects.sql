-- Seed subjects with Canadian academic program codes
-- Run this in Supabase SQL Editor if no subjects exist

-- Nursing subjects for Bachelor of Science in Nursing (81236fc9-a2d7-4d8c-8160-750e9dca90c8)
INSERT INTO "Subject" (id, name, creditUnits, semester, courseId) VALUES
  ('nurs-101', 'NURS 101: Introduction to Nursing Practice', 3, 1, '81236fc9-a2d7-4d8c-8160-750e9dca90c8'),
  ('nurs-102', 'NURS 102: Human Anatomy and Physiology I', 4, 1, '81236fc9-a2d7-4d8c-8160-750e9dca90c8'),
  ('nurs-103', 'NURS 103: Nursing Fundamentals', 3, 1, '81236fc9-a2d7-4d8c-8160-750e9dca90c8'),
  ('nurs-201', 'NURS 201: Human Anatomy and Physiology II', 4, 2, '81236fc9-a2d7-4d8c-8160-750e9dca90c8'),
  ('nurs-202', 'NURS 202: Microbiology for Health Sciences', 3, 2, '81236fc9-a2d7-4d8c-8160-750e9dca90c8'),
  ('nurs-203', 'NURS 203: Health Assessment', 3, 2, '81236fc9-a2d7-4d8c-8160-750e9dca90c8'),
  ('nurs-301', 'NURS 301: Advanced Nursing Practice', 3, 5, '81236fc9-a2d7-4d8c-8160-750e9dca90c8'),
  ('nurs-302', 'NURS 302: Clinical Pharmacology', 3, 5, '81236fc9-a2d7-4d8c-8160-750e9dca90c8'),
  ('nurs-303', 'NURS 303: Community Health Nursing', 3, 5, '81236fc9-a2d7-4d8c-8160-750e9dca90c8'),
  ('nurs-304', 'NURS 304: Pediatric Nursing', 4, 6, '81236fc9-a2d7-4d8c-8160-750e9dca90c8'),
  ('nurs-401', 'NURS 401: Leadership in Nursing', 3, 7, '81236fc9-a2d7-4d8c-8160-750e9dca90c8'),
  ('nurs-402', 'NURS 402: Mental Health Nursing', 3, 7, '81236fc9-a2d7-4d8c-8160-750e9dca90c8'),
  ('nurs-403', 'NURS 403: Gerontology Nursing', 3, 8, '81236fc9-a2d7-4d8c-8160-750e9dca90c8'),
  ('bioc-201', 'BIOL 201: Biochemistry Fundamentals', 3, 2, '81236fc9-a2d7-4d8c-8160-750e9dca90c8'),
  ('stat-201', 'STAT 201: Statistics for Health Sciences', 3, 3, '81236fc9-a2d7-4d8c-8160-750e9dca90c8'),
  ('ethc-200', 'ETHC 200: Healthcare Ethics', 3, 4, '81236fc9-a2d7-4d8c-8160-750e9dca90c8')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  creditUnits = EXCLUDED.creditUnits,
  semester = EXCLUDED.semester,
  updatedAt = CURRENT_TIMESTAMP;
