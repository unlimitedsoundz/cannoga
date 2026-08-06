-- Verify and create student record for Dencia Adeleke
-- Run these queries in order:

-- 1. Check if student record already exists
SELECT * FROM students WHERE id = 'e9da991c-7ae0-4f20-9b33-f4164c29136f';

-- 2. If no rows returned, create the student record
INSERT INTO students (
    id,
    user_id,
    student_id,
    application_id,
    program_id,
    enrollment_status,
    institutional_email,
    personal_email,
    start_date,
    expected_graduation_date
) VALUES (
    'e9da991c-7ae0-4f20-9b33-f4164c29136f',  -- Matches housing application student_id
    'dea2327d-0dbe-4bc9-b985-394035aaf805',  -- Dencia Adeleke's user_id
    'SK2114632',                             -- Real student ID
    gen_random_uuid(),                       -- Generate application ID
    'e15ef57b-2f95-42a6-b766-aeef883af9d2',  -- Bachelor's in Accounting & Finance
    'ACTIVE',
    'dencia.adeleke@cannogacollege.ca',             -- Institutional email
    'opheliaadeleke@gmail.com',             -- Personal email
    NOW(),
    NOW() + INTERVAL '4 years'
);

-- 3. Verify it was created
SELECT * FROM students WHERE student_id = 'SK2114632';
