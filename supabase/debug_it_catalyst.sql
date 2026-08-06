-- Debug: Disable RLS on it_assets catalog
-- If this fixes "Unknown Asset", then the RLS policy on it_assets was the problem.
ALTER TABLE it_assets DISABLE ROW LEVEL SECURITY;
