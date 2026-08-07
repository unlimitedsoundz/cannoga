-- Script to set up admin user for unlymitedsoundz@mail.com
-- Run this in Supabase SQL Editor

-- First, check if user exists in auth.users (you'll need to get the UUID)
-- You can find the user ID in Supabase Auth dashboard

-- Replace 'USER_UUID_HERE' with the actual UUID from auth.users table
-- You can get this by running: SELECT id, email FROM auth.users WHERE email = 'unlymitedsoundz@mail.com';

-- Insert or update the profile with ADMIN role
INSERT INTO public.profiles (id, email, first_name, role)
VALUES (
    'USER_UUID_HERE', -- Replace with actual UUID
    'unlymitedsoundz@mail.com',
    'Admin',
    'ADMIN'
)
ON CONFLICT (id) DO UPDATE SET
    role = 'ADMIN',
    first_name = COALESCE(profiles.first_name, 'Admin');

-- If you don't know the UUID, you can create the profile and it will be linked when the user signs up
-- But for immediate access, you need the UUID from auth.users