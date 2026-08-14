-- Add date_of_birth to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Update handle_new_user trigger with fully qualified names and strict search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, country_of_residence, role, date_of_birth)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'country_of_residence',
    COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'APPLICANT'::public.user_role),
    CASE 
      WHEN (new.raw_user_meta_data->>'date_of_birth') IS NOT NULL AND (new.raw_user_meta_data->>'date_of_birth') <> '' 
      THEN (new.raw_user_meta_data->>'date_of_birth')::DATE 
      ELSE NULL 
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

