-- =============================================
-- TIMETABLE ENGINE DATA SEEDING
-- Populates new timetable tables from existing SIS data
-- =============================================

-- =============================================
-- 1. SEED ROOMS
-- =============================================

INSERT INTO public.rooms (id, name, building, floor, room_number, capacity, room_type, campus, accessibility, equipment, status, notes)
VALUES
  ('r001-1111-1111-1111', 'Lecture Hall A', 'Main Building', '1', '101', 120, 'LECTURE_ROOM', 'MAIN', true, '{"projector": true, "smart_board": true, "audio_visual": true}', 'ACTIVE', 'Large lecture hall'),
  ('r002-1111-1111-1111', 'Lecture Hall B', 'Main Building', '1', '102', 120, 'LECTURE_ROOM', 'MAIN', true, '{"projector": true, "smart_board": true, "audio_visual": true}', 'ACTIVE', 'Large lecture hall'),
  ('r003-1111-1111-1111', 'Seminar Room 1', 'Main Building', '2', '201', 30, 'SEMINAR_ROOM', 'MAIN', true, '{"projector": true}', 'ACTIVE', 'Seminar room'),
  ('r004-1111-1111-1111', 'Seminar Room 2', 'Main Building', '2', '202', 30, 'SEMINAR_ROOM', 'MAIN', true, '{"projector": true}', 'ACTIVE', 'Seminar room'),
  ('r005-1111-1111-1111', 'Computer Lab 1', 'Technology Building', '1', '101', 40, 'COMPUTER_LAB', 'MAIN', true, '{"computers": true, "projector": true}', 'ACTIVE', 'Computer lab with 40 workstations'),
  ('r006-1111-1111-1111', 'Computer Lab 2', 'Technology Building', '1', '102', 40, 'COMPUTER_LAB', 'MAIN', true, '{"computers": true, "projector": true}', 'ACTIVE', 'Computer lab with 40 workstations'),
  ('r007-1111-1111-1111', 'Science Lab 1', 'Science Building', '1', '101', 35, 'SCIENCE_LAB', 'MAIN', true, '{"science_lab": true, "projector": true}', 'ACTIVE', 'General science lab'),
  ('r008-1111-1111-1111', 'Science Lab 2', 'Science Building', '1', '102', 35, 'SCIENCE_LAB', 'MAIN', true, '{"science_lab": true, "projector": true}', 'ACTIVE', 'General science lab'),
  ('r009-1111-1111-1111', 'Clinical Lab 1', 'Health Sciences Building', '1', '101', 25, 'CLINICAL_LAB', 'MAIN', true, '{"nursing_equipment": true, "specialized_equipment": true}', 'ACTIVE', 'Nursing clinical lab'),
  ('r010-1111-1111-1111', 'Clinical Lab 2', 'Health Sciences Building', '1', '102', 25, 'CLINICAL_LAB', 'MAIN', true, '{"nursing_equipment": true, "specialized_equipment": true}', 'ACTIVE', 'Nursing clinical lab'),
  ('r011-1111-1111-1111', 'Auditorium', 'Main Building', '1', 'Auditorium', 200, 'AUDITORIUM', 'MAIN', true, '{"projector": true, "audio_visual": true, "wheelchair_access": true}', 'ACTIVE', 'Main auditorium'),
  ('r012-1111-1111-1111', 'Online Room A', 'Virtual', null, 'ONLINE-1', 50, 'ONLINE', 'ONLINE', true, '{}', 'ACTIVE', 'Virtual classroom'),
  ('r013-1111-1111-1111', 'Lecture Hall C', 'Main Building', '2', '203', 80, 'LECTURE_ROOM', 'MAIN', true, '{"projector": true}', 'ACTIVE', 'Medium lecture hall'),
  ('r014-1111-1111-1111', 'Lab 3', 'Science Building', '2', '201', 30, 'LAB', 'MAIN', true, '{"science_lab": true}', 'ACTIVE', 'Science lab'),
  ('r015-1111-1111-1111', 'Tutorial Room 1', 'Main Building', '3', '301', 20, 'SEMINAR_ROOM', 'MAIN', true, '{}', 'ACTIVE', 'Small tutorial room')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  building = EXCLUDED.building,
  capacity = EXCLUDED.capacity,
  room_type = EXCLUDED.room_type,
  status = EXCLUDED.status;

-- =============================================
-- 2. SEED ROOM FEATURES
-- =============================================

INSERT INTO public.room_features (id, name, description, category) VALUES
  ('f001-1111-1111-1111', 'projector', 'Video projector', 'AV'),
  ('f002-1111-1111-1111', 'smart_board', 'Interactive smart board', 'AV'),
  ('f003-1111-1111-1111', 'computers', 'Desktop computers', 'COMPUTING'),
  ('f004-1111-1111-1111', 'science_lab', 'Science lab equipment', 'SCIENCE'),
  ('f005-1111-1111-1111', 'nursing_equipment', 'Nursing clinical equipment', 'MEDICAL'),
  ('f006-1111-1111-1111', 'audio_visual', 'Audio visual system', 'AV'),
  ('f007-1111-1111-1111', 'wheelchair_access', 'Wheelchair accessible', 'ACCESSIBILITY'),
  ('f008-1111-1111-1111', 'specialized_equipment', 'Specialized equipment', 'GENERAL')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, category = EXCLUDED.category;

-- =============================================
-- 3. SEED ROOM FEATURE ASSIGNMENTS
-- =============================================

INSERT INTO public.room_feature_assignments (room_id, feature_id, notes)
SELECT 
  r.id, f.id, 'Standard equipment'
FROM public.rooms r
JOIN public.room_features f ON 
  (r.room_type = 'LECTURE_ROOM' AND f.name IN ('projector', 'smart_board', 'audio_visual'))
  OR (r.room_type = 'COMPUTER_LAB' AND f.name IN ('computers', 'projector'))
  OR (r.room_type = 'SCIENCE_LAB' AND f.name IN ('science_lab', 'projector'))
  OR (r.room_type = 'CLINICAL_LAB' AND f.name IN ('nursing_equipment', 'specialized_equipment'))
  OR (r.room_type = 'AUDITORIUM' AND f.name IN ('projector', 'audio_visual', 'wheelchair_access'))
  OR (r.room_type = 'ONLINE' AND f.name IN ('projector'))
WHERE r.status = 'ACTIVE'
ON CONFLICT (room_id, feature_id) DO NOTHING;

-- =============================================
-- 4. SEED ACADEMIC DAYS (already in migration, but ensure)
-- =============================================

INSERT INTO public.academic_days (day_of_week, name, abbreviation, is_teaching_day) VALUES
  (0, 'Sunday', 'Sun', false),
  (1, 'Monday', 'Mon', true),
  (2, 'Tuesday', 'Tue', true),
  (3, 'Wednesday', 'Wed', true),
  (4, 'Thursday', 'Thu', true),
  (5, 'Friday', 'Fri', true),
  (6, 'Saturday', 'Sat', false)
ON CONFLICT (day_of_week) DO UPDATE SET name = EXCLUDED.name, abbreviation = EXCLUDED.abbreviation;

-- =============================================
-- 5. SEED TIME SLOTS
-- =============================================

INSERT INTO public.time_slots (slot_index, day_of_week, start_time, end_time, slot_duration, is_break)
SELECT
  slot_idx,
  day_of_week,
  make_time(8 + (slot_idx / 2), (slot_idx % 2) * 30, 0),
  make_time(8 + ((slot_idx + 1) / 2), ((slot_idx + 1) % 2) * 30, 0),
  30,
  false
FROM generate_series(0, 17) AS slot_idx
CROSS JOIN (SELECT DISTINCT day_of_week FROM public.academic_days WHERE is_teaching_day = true) AS days
ON CONFLICT (day_of_week, slot_index) DO UPDATE SET start_time = EXCLUDED.start_time, end_time = EXCLUDED.end_time;

-- =============================================
-- 6. SEED HOLIDAYS (Canadian academic year 2026-2027)
-- =============================================

INSERT INTO public.holidays (name, start_date, end_date, block_type, affects_scheduling) VALUES
  ('Labour Day', '2026-09-07', '2026-09-07', 'HOLIDAY', true),
  ('Thanksgiving', '2026-10-12', '2026-10-12', 'HOLIDAY', true),
  ('Reading Week', '2026-11-02', '2026-11-06', 'SEMESTER_BREAK', true),
  ('Remembrance Day', '2026-11-11', '2026-11-11', 'HOLIDAY', true),
  ('Christmas Break', '2026-12-18', '2027-01-03', 'HOLIDAY', true),
  ('Family Day', '2027-02-15', '2027-02-15', 'HOLIDAY', true),
  ('Reading Week Winter', '2027-02-22', '2027-02-26', 'SEMESTER_BREAK', true),
  ('Good Friday', '2027-04-02', '2027-04-02', 'HOLIDAY', true),
  ('Easter Monday', '2027-04-05', '2027-04-05', 'HOLIDAY', true),
  ('Victoria Day', '2027-05-24', '2027-05-24', 'HOLIDAY', true),
  ('Canada Day', '2027-07-01', '2027-07-01', 'HOLIDAY', true),
  ('Civic Holiday', '2027-08-02', '2027-08-02', 'HOLIDAY', true)
ON CONFLICT (name) DO UPDATE SET start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date;

-- =============================================
-- 7. SEED COURSE SECTIONS FROM EXISTING MODULES
-- =============================================

-- Create sections for each module in the active semester (Fall 2026)
-- We create 1-3 sections per module depending on expected enrollment

INSERT INTO public.course_sections (id, code, module_id, semester_id, instructor_id, capacity, enrolled_count, session_type, delivery_mode, required_room_type, required_features, duration_minutes, meetings_per_week, consecutive_sessions, max_daily_sessions, preferred_days, blocked_days, preferred_times, blocked_times, student_group_id, department_id, notes, status)
SELECT
  gen_random_uuid(),
  m.code || '-' || ch('A' + (row_number() OVER (PARTITION BY m.id ORDER BY random()) - 1) % 3),
  m.id,
  s.id,
  p.id,
  30 + (random() * 20)::int,
  20 + (random() * 15)::int,
  CASE 
    WHEN m.code ILIKE 'lab%' OR m.code ILIKE '%lab' THEN 'LAB'
    WHEN m.code ILIKE 'clin%' OR m.code ILIKE '%clinical%' THEN 'CLINICAL'
    WHEN m.code ILIKE 'sem%' OR m.code ILIKE '%seminar%' THEN 'SEMINAR'
    ELSE 'LECTURE'
  END,
  'IN_PERSON',
  CASE 
    WHEN m.code ILIKE 'lab%' OR m.code ILIKE '%lab' THEN 'LAB'
    WHEN m.code ILIKE 'clin%' OR m.code ILIKE '%clinical%' THEN 'CLINICAL_LAB'
    WHEN m.code ILIKE 'comp%' OR m.code ILIKE '%computer%' THEN 'COMPUTER_LAB'
    ELSE 'LECTURE_ROOM'
  END,
  CASE 
    WHEN m.code ILIKE 'lab%' OR m.code ILIKE '%lab' THEN '["science_lab"]'
    WHEN m.code ILIKE 'clin%' OR m.code ILIKE '%clinical%' THEN '["nursing_equipment", "specialized_equipment"]'
    WHEN m.code ILIKE 'comp%' OR m.code ILIKE '%computer%' THEN '["computers"]'
    ELSE '[]'
  END,
  60 + (random() * 60)::int,
  CASE 
    WHEN m.code ILIKE 'lab%' OR m.code ILIKE '%lab' THEN 2
    WHEN m.code ILIKE 'clin%' OR m.code ILIKE '%clinical%' THEN 2
    ELSE 1
  END,
  false,
  3,
  '{}',
  '{}',
  '{}',
  '{}',
  null,
  d.id,
  'Auto-generated section',
  'PENDING'
FROM modules m
JOIN semesters s ON s.name = 'Fall 2026' AND s.status = 'ACTIVE'
JOIN "Department" d ON d.id = m.department_id
LEFT JOIN profiles p ON p.role = 'INSTRUCTOR' AND p.department_id = d.id
WHERE EXISTS (SELECT 1 FROM profiles WHERE role = 'INSTRUCTOR')
LIMIT 100;

-- =============================================
-- 8. SEED COURSE SECTION MEETINGS
-- =============================================

INSERT INTO public.course_section_meetings (id, section_id, meeting_index, day_of_week, start_time, end_time, duration_minutes, room_id, instructor_id, is_fixed)
SELECT
  gen_random_uuid(),
  cs.id,
  generate_series(0, (cs.meetings_per_week - 1)),
  (1 + (random() * 4)::int),
  make_time(8 + (random() * 8)::int, (random() * 2 = 0)::int * 30, 0),
  make_time(8 + (random() * 8)::int + 1, (random() * 2 = 0)::int * 30, 0),
  cs.duration_minutes,
  CASE WHEN cs.delivery_mode = 'ONLINE' THEN 'r012-1111-1111-1111' ELSE 'r001-1111-1111-1111' END,
  cs.instructor_id,
  false
FROM course_sections cs
WHERE cs.status = 'PENDING'
  AND cs.semester_id = (SELECT id FROM semesters WHERE name = 'Fall 2026' LIMIT 1);

-- =============================================
-- 9. SEED STUDENT GROUPS
-- =============================================

INSERT INTO public.student_groups (id, name, code, description, program_id, department_id, cohort_year, semester, total_students, is_active)
SELECT
  gen_random_uuid(),
  c.title || ' - Year ' || y.year,
  c.code || '-Y' || y.year,
  'Cohort for ' || c.title || ' Year ' || y.year,
  c.id,
  d.id,
  y.year,
  1,
  30,
  true
FROM "Course" c
JOIN "Department" d ON d.id = c.departmentId
CROSS JOIN (VALUES (1), (2), (3), (4)) AS y(year)
WHERE NOT EXISTS (
  SELECT 1 FROM public.student_groups sg 
  WHERE sg.program_id = c.id AND sg.cohort_year = y.year
);

-- =============================================
-- 10. SEED COHORT MEMBERS
-- =============================================

INSERT INTO public.cohort_members (group_id, student_id)
SELECT sg.id, s.id
FROM public.student_groups sg
JOIN "Course" c ON c.id = sg.program_id
JOIN students s ON s.enrollment_status = 'ACTIVE'
WHERE s.program_id = c.id
  AND NOT EXISTS (
    SELECT 1 FROM public.cohort_members cm 
    WHERE cm.group_id = sg.id AND cm.student_id = s.id
  )
LIMIT 200;

-- =============================================
-- 11. SEED INSTRUCTOR AVAILABILITY
-- =============================================

INSERT INTO public.instructor_availability (instructor_id, day_of_week, start_time, end_time, availability_type, effective_date, expiry_date, notes)
SELECT
  p.id,
  d.day_of_week,
  make_time(9, 0, 0),
  make_time(17, 0, 0),
  'AVAILABLE',
  (SELECT start_date FROM semesters WHERE name = 'Fall 2026' LIMIT 1),
  (SELECT end_date FROM semesters WHERE name = 'Fall 2026' LIMIT 1),
  'Default availability'
FROM profiles p
JOIN academic_days d ON d.is_teaching_day = true
WHERE p.role = 'INSTRUCTOR'
  AND NOT EXISTS (
    SELECT 1 FROM public.instructor_availability ia 
    WHERE ia.instructor_id = p.id AND ia.day_of_week = d.day_of_week
  );

-- =============================================
-- 12. UPDATE MODULE ENROLLMENTS TO HAVE STUDENTS IN SECTIONS
-- =============================================

UPDATE course_sections cs
SET enrolled_count = (
  SELECT count(*)
  FROM module_enrollments me
  WHERE me.module_id = cs.module_id
    AND me.semester_id = cs.semester_id
    AND me.status = 'REGISTERED'
)
WHERE cs.status = 'PENDING';
