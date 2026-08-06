-- Migration: Standardize Student IDs to 'HU' prefix
-- This migration handles the transition from legacy 'SK', 'KC', and 'KU' prefixes to 'HU' prefix.
-- It applies to profiles, applications, admissions, and students tables.

-- 1. Update the helper function to use the new prefix
CREATE OR REPLACE FUNCTION generate_student_id() RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    id_exists BOOLEAN;
BEGIN
    LOOP
        new_id := 'HU' || LPAD(floor(random() * 10000000)::text, 7, '0');

        -- Check all unique constraints across ALL tables
        SELECT EXISTS (
            SELECT 1 FROM public.profiles WHERE student_id = new_id
            UNION ALL
            SELECT 1 FROM public.applications WHERE application_number = new_id
            UNION ALL
            SELECT 1 FROM public.students WHERE student_id = new_id
            UNION ALL
            SELECT 1 FROM public.admissions WHERE student_id = new_id
        ) INTO id_exists;

        EXIT WHEN NOT id_exists;
    END LOOP;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- 2. Update trigger functions for future records
CREATE OR REPLACE FUNCTION set_profile_student_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.student_id IS NULL OR NEW.student_id NOT LIKE 'HU%' OR LENGTH(NEW.student_id) != 9 THEN
        NEW.student_id := generate_student_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_application_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.application_number IS NULL OR NEW.application_number NOT LIKE 'HU%' OR LENGTH(NEW.application_number) != 8 THEN
        NEW.application_number := generate_student_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Robust Backfill Logic
DO $$ 
DECLARE
    mapping_record RECORD;
    row_record RECORD;
    new_val TEXT;
    collision BOOL;
BEGIN
    -- Create a temporary mapping table to ensure global consistency
    CREATE TEMP TABLE id_map (
        user_id UUID PRIMARY KEY,
        old_id TEXT,
        new_id TEXT UNIQUE
    ) ON COMMIT DROP;

    -- a. Build mapping from profiles (primary source of truth)
    FOR row_record IN
        SELECT id, student_id FROM public.profiles
        WHERE student_id IS NULL
            OR student_id LIKE 'SK%'
            OR student_id LIKE 'KC%'
            OR student_id LIKE 'KU%'
            OR student_id NOT LIKE 'HU%'
            OR LENGTH(student_id) != 9
    LOOP
        -- Determine new ID
        IF row_record.student_id LIKE 'SK%' OR row_record.student_id LIKE 'KC%' OR row_record.student_id LIKE 'KU%' OR LENGTH(row_record.student_id) != 9 OR row_record.student_id NOT LIKE 'HU%' THEN
            new_val := generate_student_id();
        ELSE
            new_val := row_record.student_id; -- Keep if already correct
        END IF;

        INSERT INTO id_map (user_id, old_id, new_id)
        VALUES (row_record.id, row_record.student_id, new_val)
        ON CONFLICT (user_id) DO UPDATE SET new_id = EXCLUDED.new_id;
    END LOOP;

    -- b. Apply mapping to profiles
    UPDATE public.profiles p
    SET student_id = m.new_id
    FROM id_map m
    WHERE p.id = m.user_id;

    -- c. Apply mapping to applications
    UPDATE public.applications a
    SET application_number = m.new_id
    FROM id_map m
    WHERE a.user_id = m.user_id;

    -- d. Apply mapping to admissions
    UPDATE public.admissions ad
    SET student_id = m.new_id
    FROM id_map m
    WHERE ad.user_id = m.user_id;

    -- e. Apply mapping to students (lowercase SIS table)
    -- We update individually to handle cases where a user might have multiple records
    FOR row_record IN
        SELECT id, user_id, student_id FROM public.students
    LOOP
        -- If this record needs updating
        IF row_record.student_id NOT LIKE 'HU%' OR LENGTH(row_record.student_id) != 9 THEN
            -- Check if we have a map for this user
            SELECT new_id INTO new_val FROM id_map WHERE user_id = row_record.user_id;
            
            -- If no map (orphan), generate one
            IF new_val IS NULL THEN
                new_val := generate_student_id();
            END IF;

            -- Safety check: is this ID already used by ANOTHER record in this table?
            -- (Necessary if a user has multiple records in students)
            LOOP
                SELECT EXISTS (SELECT 1 FROM public.students WHERE student_id = new_val AND id != row_record.id) INTO collision;
                EXIT WHEN NOT collision;
                new_val := generate_student_id();
            END LOOP;
            
            UPDATE public.students SET student_id = new_val WHERE id = row_record.id;
        END IF;
    END LOOP;

    -- f. Final sync for any remaining inconsistencies
    -- Ensure all tables match the profile if possible
    UPDATE public.applications a
    SET application_number = p.student_id
    FROM public.profiles p
    WHERE a.user_id = p.id AND a.application_number != p.student_id;

    UPDATE public.admissions ad
    SET student_id = p.student_id
    FROM public.profiles p
    WHERE ad.user_id = p.id AND ad.student_id != p.student_id;

END $$;
