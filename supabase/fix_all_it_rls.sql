-- Fix RLS Policies for IT Access
BEGIN;

-- 1. Re-enable RLS tables
ALTER TABLE student_it_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE it_assets ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to start fresh (avoid conflicts)
DROP POLICY IF EXISTS "Users view IT assets" ON it_assets;
DROP POLICY IF EXISTS "Admins manage IT assets" ON it_assets;
DROP POLICY IF EXISTS "Students view own IT access" ON student_it_access;
DROP POLICY IF EXISTS "Admins manage IT access" ON student_it_access;

-- 3. Policy: Everyone can view IT Assets (Catalog)
CREATE POLICY "Users view IT assets" ON it_assets
FOR SELECT
TO authenticated
USING (true);

-- 4. Policy: Admins can manage IT Assets
CREATE POLICY "Admins manage IT assets" ON it_assets
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'
    )
);

-- 5. Policy: Students can view their OWN access records
CREATE POLICY "Students view own IT access" ON student_it_access
FOR SELECT
TO authenticated
USING (
    student_id IN (
        SELECT id FROM students WHERE user_id = auth.uid()
    )
);

-- 6. Policy: Admins can manage ALL access records
CREATE POLICY "Admins manage IT access" ON student_it_access
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'
    )
);

COMMIT;
