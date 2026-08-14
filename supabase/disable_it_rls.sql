-- Debug: Disable RLS to confirm visibility issue
ALTER TABLE student_it_access DISABLE ROW LEVEL SECURITY;

-- Also verify if multiple students exist for this user
DO $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT count(*) INTO v_count FROM students WHERE user_id = 'dea2327d-0dbe-4bc9-b985-394035aaf805';
    RAISE NOTICE 'Student records for this user: %', v_count;
END $$;
