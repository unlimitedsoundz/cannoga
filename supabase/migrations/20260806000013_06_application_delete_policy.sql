-- Enable deletion for applicants (own applications only, excluding Enrolled if needed, but RLS usually just checks ownership. Application logic checks status)
-- We'll allow deleting any application owned by user for flexibility, or filter by status.
-- Let's mirror the checks: owner can delete.

DROP POLICY IF EXISTS "Applicants can delete own applications" ON public.applications;
CREATE POLICY "Applicants can delete own applications" ON public.applications 
FOR DELETE 
USING (auth.uid() = user_id);
