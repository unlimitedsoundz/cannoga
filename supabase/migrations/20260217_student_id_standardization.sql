-- 1. Create a more robust student ID generation function
CREATE OR REPLACE FUNCTION public.generate_student_id() RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    done BOOL := FALSE;
BEGIN
    WHILE NOT done LOOP
        -- SK + 7 random digits (Total 9 characters)
        new_id := 'SK' || LPAD(FLOOR(RANDOM() * 10000000)::TEXT, 7, '0');
        
        -- Check for collisions across all ID-holding tables
        IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE student_id = new_id) AND
           NOT EXISTS (SELECT 1 FROM public.applications WHERE application_number = new_id) AND
           NOT EXISTS (SELECT 1 FROM public.students WHERE student_id = new_id) AND
           NOT EXISTS (SELECT 1 FROM public.admissions WHERE student_id = new_id) THEN
            done := TRUE;
        END IF;
    END LOOP;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 2. Update existing generate_sk_id to point to the new generator
CREATE OR REPLACE FUNCTION public.generate_sk_id() RETURNS TEXT AS $$
BEGIN
    RETURN public.generate_student_id();
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 3. Update the trigger functions
CREATE OR REPLACE FUNCTION public.set_profile_student_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.student_id IS NULL OR NEW.student_id = '' OR LENGTH(NEW.student_id) != 9 OR NEW.student_id NOT LIKE 'SK%' THEN
        NEW.student_id := public.generate_student_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.set_application_number() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.application_number IS NULL OR NEW.application_number = '' OR LENGTH(NEW.application_number) != 9 OR NEW.application_number NOT LIKE 'SK%' THEN
        SELECT student_id INTO NEW.application_number FROM public.profiles WHERE id = NEW.user_id;
        
        IF NEW.application_number IS NULL OR NEW.application_number = '' OR LENGTH(NEW.application_number) != 9 OR NEW.application_number NOT LIKE 'SK%' THEN
            NEW.application_number := public.generate_student_id();
            UPDATE public.profiles SET student_id = NEW.application_number WHERE id = NEW.user_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 4. Backfill existing improper IDs to the new 'SKXXXXXXX' format
DO $$
DECLARE
    row_record RECORD;
    new_id TEXT;
BEGIN
    -- Update profiles with non-SK or wrong length IDs
    FOR row_record IN SELECT id FROM public.profiles WHERE student_id IS NULL OR student_id NOT LIKE 'SK%' OR LENGTH(student_id) != 9 LOOP
        new_id := generate_student_id();
        UPDATE public.profiles SET student_id = new_id WHERE id = row_record.id;
        
        -- Sync to other related tables
        UPDATE public.applications SET application_number = new_id WHERE user_id = row_record.id;
        UPDATE public.admissions SET student_id = new_id WHERE user_id = row_record.id;
        UPDATE public.students SET student_id = new_id WHERE user_id = row_record.id;
    END LOOP;
END $$;
