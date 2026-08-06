-- Force Provision IT Access
BEGIN;

-- 1. Ensure Assets Exist
INSERT INTO it_assets (asset_type, name, description, auto_provision, access_url)
VALUES 
    ('LMS', 'Canvas LMS', 'Primary Learning Management System', true, 'https://canvas.penkka.fi'),
    ('EMAIL', 'Student Email', 'Official University Email (Outlook)', true, 'https://outlook.office.com'),
    ('VPN', 'University VPN', 'Secure Access to Campus Network', true, 'https://vpn.penkka.fi')
ON CONFLICT DO NOTHING;

-- 2. Provision for User dea2327d...
DO $$
DECLARE
    target_student_id TEXT;
    target_user_id UUID := 'dea2327d-0dbe-4bc9-b985-394035aaf805';
BEGIN
    -- Find student ID
    SELECT id INTO target_student_id FROM students WHERE user_id = target_user_id;

    IF target_student_id IS NOT NULL THEN
        -- Insert Access if missing
        INSERT INTO student_it_access (student_id, asset_id, status, credentials, activated_at, expires_at)
        SELECT 
            target_student_id, 
            id, 
            'ACTIVE',
            jsonb_build_object('username', 'student_force', 'password', 'pass123'),
            NOW(),
            NOW() + INTERVAL '1 year'
        FROM it_assets 
        WHERE auto_provision = true
        AND id NOT IN (SELECT asset_id FROM student_it_access WHERE student_id = target_student_id);
    END IF;
END $$;

-- 3. Return PROOF
SELECT s.student_id, a.name, sia.status 
FROM student_it_access sia
JOIN students s ON s.id = sia.student_id::text
JOIN it_assets a ON a.id = sia.asset_id
WHERE s.user_id = 'dea2327d-0dbe-4bc9-b985-394035aaf805';

COMMIT;
