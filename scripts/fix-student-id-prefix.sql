CREATE OR REPLACE FUNCTION public.generate_student_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    done BOOL := FALSE;
BEGIN
    WHILE NOT done LOOP
        new_id := 'CC' || LPAD(FLOOR(RANDOM() * 10000000)::TEXT, 7, '0');
        IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE student_id = new_id) AND
           NOT EXISTS (SELECT 1 FROM public.applications WHERE application_number = new_id) AND
           NOT EXISTS (SELECT 1 FROM public.students WHERE student_id = new_id) THEN
            done := TRUE;
        END IF;
    END LOOP;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql SET search_path = public;
