-- Seed course sections for modules that had enrollments but no sections
-- Without sections, students enrolled in these modules see empty timetables
INSERT INTO public.course_sections (id, code, module_id, semester_id, instructor_id, capacity, enrolled_count, status, required_room_type, delivery_mode, session_type, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'PHA 1006-A', 'de1e8c07-867e-4a09-b41f-6ae774f0169e', 'sem-2026-fall', NULL, 30, 0, 'PENDING', 'LECTURE_ROOM', 'IN_PERSON', 'LECTURE', NOW(), NOW()),
  (gen_random_uuid(), 'COM 1015-A', '37241f43-eb55-4cf8-a72f-0f9897b9f064', 'sem-2026-fall', NULL, 30, 0, 'PENDING', 'LECTURE_ROOM', 'IN_PERSON', 'LECTURE', NOW(), NOW()),
  (gen_random_uuid(), 'HOS 1001-A', '5cb46863-7c6a-4ab6-9b8e-070899d4625c', 'sem-2026-fall', NULL, 30, 0, 'PENDING', 'LECTURE_ROOM', 'IN_PERSON', 'LECTURE', NOW(), NOW()),
  (gen_random_uuid(), 'DRU 1001-A', '6df040e5-6df6-4725-b73e-771b0b00b6c6', 'sem-2026-fall', NULL, 30, 0, 'PENDING', 'LECTURE_ROOM', 'IN_PERSON', 'LECTURE', NOW(), NOW()),
  (gen_random_uuid(), 'HEA 1006-A', '6e8dc9ea-d8dd-4174-ac43-685e1257a82d', 'sem-2026-fall', NULL, 30, 0, 'PENDING', 'LECTURE_ROOM', 'IN_PERSON', 'LECTURE', NOW(), NOW()),
  (gen_random_uuid(), 'BIO 1006-A', 'e62a8c0f-48ac-423b-8a6f-601ce0c44bda', 'sem-2026-fall', NULL, 30, 0, 'PENDING', 'LECTURE_ROOM', 'IN_PERSON', 'LECTURE', NOW(), NOW()),
  (gen_random_uuid(), 'GLO 1002-A', 'f57e2efc-6a50-430f-b145-e0825f6038f4', 'sem-2026-fall', NULL, 30, 0, 'PENDING', 'LECTURE_ROOM', 'IN_PERSON', 'LECTURE', NOW(), NOW()),
  (gen_random_uuid(), 'HEA 1009-A', '02e21382-6a6e-4c1e-9eba-9bad6a906745', 'sem-2026-fall', NULL, 30, 0, 'PENDING', 'LECTURE_ROOM', 'IN_PERSON', 'LECTURE', NOW(), NOW()),
  (gen_random_uuid(), 'HEA 1011-A', '84628d68-1855-4b41-a0a9-28b77cf63e22', 'sem-2026-fall', NULL, 30, 0, 'PENDING', 'LECTURE_ROOM', 'IN_PERSON', 'LECTURE', NOW(), NOW()),
  (gen_random_uuid(), 'ENV 1004-A', '24d74602-b761-4a09-b0df-3cca4725596e', 'sem-2026-fall', NULL, 30, 0, 'PENDING', 'LECTURE_ROOM', 'IN_PERSON', 'LECTURE', NOW(), NOW()),
  (gen_random_uuid(), 'MPH 1001-A', '5075a2e9-1e2b-48d8-ac92-1c8ed2153471', 'sem-2026-fall', NULL, 30, 0, 'PENDING', 'LECTURE_ROOM', 'IN_PERSON', 'LECTURE', NOW(), NOW()),
  (gen_random_uuid(), 'INF 1007-A', '7bc1bc85-72ed-4973-885e-bf7051916ac7', 'sem-2026-fall', NULL, 30, 0, 'PENDING', 'LECTURE_ROOM', 'IN_PERSON', 'LECTURE', NOW(), NOW()),
  (gen_random_uuid(), 'PUB 1002-A', 'acaad2d6-3ba0-481b-bbfd-a4f4ec0f4c45', 'sem-2026-fall', NULL, 30, 0, 'PENDING', 'LECTURE_ROOM', 'IN_PERSON', 'LECTURE', NOW(), NOW()),
  (gen_random_uuid(), 'EPI 1001-A', '296acd0c-cfba-43d5-b78a-04f13493d471', 'sem-2026-fall', NULL, 30, 0, 'PENDING', 'LECTURE_ROOM', 'IN_PERSON', 'LECTURE', NOW(), NOW());
