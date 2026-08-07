-- Allow admins to view all application documents

DROP POLICY IF EXISTS "Admin full access to application_documents" ON public.application_documents;
CREATE POLICY "Admin full access to application_documents" ON public.application_documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'REGISTRAR', 'STUDENT_SERVICES'))
);
