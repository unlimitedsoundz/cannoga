-- 1. Fix Schema Mismatch (student_id should be TEXT to match students table)
DO $$ BEGIN
    -- Check if student_id is not text type (e.g., uuid) and alter it
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

-- 2. Seed IT Assets
INSERT INTO it_assets (asset_type, name, description, auto_provision, access_url)
VALUES 
    ('LMS', 'Canvas LMS', 'Primary Learning Management System', true, 'https://canvas.penkka.fi'),
    ('EMAIL', 'Student Email', 'Official University Email (Outlook)', true, 'https://outlook.office.com'),
    ('VPN', 'University VPN', 'Secure Access to Campus Network', true, 'https://vpn.penkka.fi'),
    ('LIBRARY', 'Digital Library', 'Access to JSTOR, EBSCO, and Research DBs', true, 'https://library.penkka.fi'),
    ('VIRTUAL_LAB', 'Cloud Computer Lab', 'Virtual Desktop Infrastructure (VDI)', false, 'https://vdi.penkka.fi')
ON CONFLICT DO NOTHING;

-- 3. Provision Access for YOUR Specific User
DO $$
DECLARE
    v_student_id TEXT;
    v_user_id UUID := 'dea2327d-0dbe-4bc9-b985-394035aaf805'; -- Your User ID from logs
    v_asset_id UUID;
    v_asset_type TEXT;
    v_name TEXT;
BEGIN
    -- Get the student ID for this user
    SELECT id INTO v_student_id FROM students WHERE user_id = v_user_id LIMIT 1;
    
    -- Fallback: If not found by user_id, try the known student UUID directly
    IF v_student_id IS NULL THEN
         v_student_id := 'e9da991c-7ae0-4f20-9b33-f4164c29136f';
    END IF;

    IF v_student_id IS NOT NULL THEN
        RAISE NOTICE 'Found Student ID: %', v_student_id;
        
        -- Loop through auto-provisioned assets and grant access
        FOR v_asset_id, v_asset_type, v_name IN 
            SELECT id, asset_type, name FROM it_assets WHERE auto_provision = true
        LOOP
            -- Check if access already exists
            IF NOT EXISTS (SELECT 1 FROM student_it_access WHERE student_id = v_student_id AND asset_id = v_asset_id) THEN
                
                -- Create credentials
                INSERT INTO student_it_access (student_id, asset_id, status, credentials, activated_at, expires_at)
                VALUES (
                    v_student_id, 
                    v_asset_id, 
                    'ACTIVE',
                    jsonb_build_object(
                        'username', 'student_' || substr(v_student_id, 1, 6),
                        'password', 'Welcome2026!',
                        'email', 'student@cannogacollege.ca'
                    ),
                    NOW(),
                    NOW() + INTERVAL '1 year'
                );
                
                RAISE NOTICE 'Provisioned %', v_name;
            ELSE
                 RAISE NOTICE 'Access already exists for %', v_name;
            END IF;
        END LOOP;
        
    ELSE
        RAISE NOTICE 'Could not find student record for this user.';
    END IF;
END $$;
