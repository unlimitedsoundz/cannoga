-- Migration: Add extra applicant registration fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS local_address text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS local_city text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS local_country text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS local_state_province text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS local_zipcode text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_19_or_older text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_siblings_at_college text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS completing_form_person text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS housing_required text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS how_did_you_hear text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS questions_comments text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS contact_first_name text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS contact_last_name text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS contact_phone text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS contact_email text;

