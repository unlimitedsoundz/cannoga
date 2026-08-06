-- Add RLS policies for students table to allow admin access

-- Enable RLS on students table
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Students can view their own record" ON students;
DROP POLICY IF EXISTS "Admins can view all students" ON students;
DROP POLICY IF EXISTS "Admins can update students" ON students;
DROP POLICY IF EXISTS "Admins can insert students" ON students;

-- Allow students to view their own record
CREATE POLICY "Students can view their own record" ON students
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Allow admins to view all students
CREATE POLICY "Admins can view all students" ON students
FOR SELECT TO authenticated
USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'ADMIN'
));

-- Allow admins to update students
CREATE POLICY "Admins can update students" ON students
FOR UPDATE TO authenticated
USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'ADMIN'
));

-- Allow admins to insert students
CREATE POLICY "Admins can insert students" ON students
FOR INSERT TO authenticated
WITH CHECK (EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'ADMIN'
));
