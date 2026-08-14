-- Fix Student Record for Housing Application
-- This script creates a student record that matches the housing application

-- Step 1: Find the user profile by their actual student ID
SELECT 
    id as user_id,
    email,
    first_name,
    last_name,
    student_id
FROM profiles
WHERE student_id = 'SK2114632';

-- Step 2: Get a valid course ID (already done, choose one from above)

-- Step 3: Create the student record with correct data
-- This will allow the housing application to find the student

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
    'e15ef57b-2f95-42a6-b766-aeef883af9d2',  -- Bachelor's in Accounting & Finance (change if needed)
    'ACTIVE',
    'dencia.adeleke@cannogacollege.ca',             -- Institutional email
    'opheliaadeleke@gmail.com',             -- Personal email
    NOW(),
    NOW() + INTERVAL '4 years'
)
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    student_id = EXCLUDED.student_id,
    personal_email = EXCLUDED.personal_email;
