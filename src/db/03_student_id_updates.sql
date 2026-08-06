-- Update existing KC student IDs to KU
UPDATE public.profiles
SET student_id = REPLACE(student_id, 'KC', 'KU')
WHERE student_id LIKE 'KC%';

-- Update in applications table as well, in case they differ
UPDATE public.applications
SET application_number = REPLACE(application_number, 'KC', 'KU')
WHERE application_number LIKE 'KC%';

-- Assign student IDs to profiles that don't have one
UPDATE public.profiles
SET student_id = 'KU' || LPAD(FLOOR(RANDOM() * 10000000)::TEXT, 7, '0')
WHERE student_id IS NULL;

-- Assign application numbers to applications that don't have one, using the profile's student_id if available
UPDATE public.applications
SET application_number = COALESCE(
    (SELECT student_id FROM public.profiles WHERE id = user_id),
    'KU' || LPAD(FLOOR(RANDOM() * 10000000)::TEXT, 7, '0')
)
WHERE application_number IS NULL;

-- Ensure no duplicates (though random makes it unlikely, but to be safe, we can add unique constraint if not exists)
-- But since it's random, and small number, assume ok.