-- =============================================
-- FIX STUDENT SCHEMA
-- Adds application delete policy if it doesn't exist.
-- =============================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'applications' AND policyname = 'Applicants can delete own applications') THEN
        CREATE POLICY "Applicants can delete own applications" ON public.applications 
        FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;
END $$;
