-- Auto-provision IT Tools to All Active Students
BEGIN;

-- 1. Fix Schema Mismatch (student_id should be TEXT to match students table)
DO $$ BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'student_it_access' 
        AND column_name = 'student_id' 
        AND data_type = 'uuid'
    ) THEN
        ALTER TABLE student_it_access ALTER COLUMN student_id TYPE text;
    END IF;
EXCEPTION
    WHEN OTHERS THEN null;
END $$;

-- 2. Ensure Assets Exist
INSERT INTO it_assets (asset_type, name, description, auto_provision, access_url)
VALUES 
    ('LMS', 'Canvas LMS', 'Primary Learning Management System', true, 'https://canvas.penkka.fi'),
    ('EMAIL', 'Student Email', 'Official University Email (Outlook)', true, 'https://outlook.office.com'),
    ('VPN', 'University VPN', 'Secure Access to Campus Network', true, 'https://vpn.penkka.fi'),
    ('LIBRARY', 'Digital Library', 'Access to JSTOR, EBSCO, and Research DBs', true, 'https://library.penkka.fi')
ON CONFLICT DO NOTHING;

-- 3. Provision for All Active Students
DO $$
DECLARE
    v_student record;
    v_asset record;
BEGIN
    FOR v_student IN SELECT id, enrollment_status FROM students WHERE enrollment_status = 'ACTIVE'
    LOOP
        FOR v_asset IN SELECT id, name FROM it_assets WHERE auto_provision = true
        LOOP
            IF NOT EXISTS (SELECT 1 FROM student_it_access WHERE student_id = v_student.id::text AND asset_id = v_asset.id) THEN
                INSERT INTO student_it_access (student_id, asset_id, status, credentials, activated_at, expires_at)
                VALUES (
                    v_student.id::text, 
                    v_asset.id, 
                    'ACTIVE',
                    jsonb_build_object('username', 'student_' || substr(v_student.id::text, 1, 6), 'password', 'Welcome2026!'),
                    NOW(),
                    NOW() + INTERVAL '1 year'
                );
            END IF;
        END LOOP;
    END LOOP;
END $$;

COMMIT;
