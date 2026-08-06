-- 1. Add student_id to profiles if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'student_id') THEN
        ALTER TABLE public.profiles ADD COLUMN student_id TEXT UNIQUE;
    END IF;
END $$;

-- 2. Add application_number to applications if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'application_number') THEN
        ALTER TABLE public.applications ADD COLUMN application_number TEXT UNIQUE;
    END IF;
END $$;

-- 3. Function to generate random SK number (SK + 7 digits)
CREATE OR REPLACE FUNCTION public.generate_sk_id() RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    done BOOL := FALSE;
BEGIN
    WHILE NOT done LOOP
        -- KU + 7 random digits
        new_id := 'KU' || LPAD(FLOOR(RANDOM() * 10000000)::TEXT, 7, '0');
        
        -- Check if it exists in either profiles or applications
        IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE student_id = new_id) AND
           NOT EXISTS (SELECT 1 FROM public.applications WHERE application_number = new_id) THEN
            done := TRUE;
        END IF;
    END LOOP;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 4. Trigger Function for profiles
CREATE OR REPLACE FUNCTION public.set_profile_student_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.student_id IS NULL THEN
        NEW.student_id := public.generate_sk_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create/Replace Trigger for profiles
DROP TRIGGER IF EXISTS trigger_set_profile_student_id ON public.profiles;
CREATE TRIGGER trigger_set_profile_student_id
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION set_profile_student_id();

-- 5. Trigger Function for applications
CREATE OR REPLACE FUNCTION public.set_application_number() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.application_number IS NULL THEN
        -- Try to get student_id from profile first
        SELECT student_id INTO NEW.application_number FROM public.profiles WHERE id = NEW.user_id;
        
        -- If profile doesn't have one, generate new and sync it back to profile
        IF NEW.application_number IS NULL THEN
            NEW.application_number := public.generate_sk_id();
            UPDATE public.profiles SET student_id = NEW.application_number WHERE id = NEW.user_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create/Replace Trigger for applications
DROP TRIGGER IF EXISTS trigger_set_application_number ON public.applications;
CREATE TRIGGER trigger_set_application_number
BEFORE INSERT ON public.applications
FOR EACH ROW
EXECUTE FUNCTION set_application_number();

-- 6. Backfill existing records
DO $$
DECLARE
    row_record RECORD;
    temp_id TEXT;
BEGIN
    -- Backfill profiles
    FOR row_record IN SELECT id FROM public.profiles WHERE student_id IS NULL LOOP
        temp_id := generate_sk_id();
        UPDATE public.profiles SET student_id = temp_id WHERE id = row_record.id;
    END LOOP;
    
    -- Backfill applications
    FOR row_record IN SELECT id, user_id FROM public.applications WHERE application_number IS NULL LOOP
        -- Try to get from profile again in case it was just populated
        SELECT student_id INTO temp_id FROM public.profiles WHERE id = row_record.user_id;
        IF temp_id IS NULL THEN
            temp_id := generate_sk_id();
            UPDATE public.profiles SET student_id = temp_id WHERE id = row_record.user_id;
        END IF;
        UPDATE public.applications SET application_number = temp_id WHERE id = row_record.id;
    END LOOP;
END $$;
