-- Update trigger functions to be more robust and handle updates if student_id is null
CREATE OR REPLACE FUNCTION public.set_profile_student_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.student_id IS NULL OR NEW.student_id = '' THEN
        NEW.student_id := public.generate_sk_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Ensure trigger runs on INSERT OR UPDATE
DROP TRIGGER IF EXISTS trigger_set_profile_student_id ON public.profiles;
CREATE TRIGGER trigger_set_profile_student_id
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION set_profile_student_id();


-- Update application trigger to also run on update if needed (though usually insert is enough)
CREATE OR REPLACE FUNCTION public.set_application_number() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.application_number IS NULL OR NEW.application_number = '' THEN
        -- Try to get student_id from profile first
        SELECT student_id INTO NEW.application_number FROM public.profiles WHERE id = NEW.user_id;
        
        -- If profile doesn't have one, generate new and sync it back to profile
        IF NEW.application_number IS NULL OR NEW.application_number = '' THEN
            NEW.application_number := public.generate_sk_id();
            UPDATE public.profiles SET student_id = NEW.application_number WHERE id = NEW.user_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS trigger_set_application_number ON public.applications;
CREATE TRIGGER trigger_set_application_number
BEFORE INSERT OR UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION set_application_number();

-- Backfill any remaining nulls just in case
UPDATE public.profiles
SET student_id = public.generate_sk_id()
WHERE student_id IS NULL OR student_id = '';

UPDATE public.applications
SET application_number = COALESCE(
    (SELECT student_id FROM public.profiles WHERE id = user_id),
    public.generate_sk_id()
)
WHERE application_number IS NULL OR application_number = '';
