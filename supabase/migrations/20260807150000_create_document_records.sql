-- Create document_records table for student document management
-- This table stores references to generated PDFs and official documents

CREATE TABLE IF NOT EXISTS public.document_records (
    id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    title TEXT NOT NULL,
    programme TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'issued', 'archived')),
    storage_path TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    issue_date TIMESTAMP(3),
    is_official BOOLEAN NOT NULL DEFAULT FALSE,
    is_student_visible BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_document_records_student_id ON document_records(student_id);
CREATE INDEX IF NOT EXISTS idx_document_records_type ON document_records(document_type);
CREATE INDEX IF NOT EXISTS idx_document_records_status ON document_records(status);
CREATE INDEX IF NOT EXISTS idx_document_records_issue_date ON document_records(issue_date);

-- Enable RLS
ALTER TABLE public.document_records ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Students can view own documents" ON document_records FOR SELECT USING (
    EXISTS (SELECT 1 FROM students WHERE students.id = document_records.student_id AND students.user_id = auth.uid())
);

CREATE POLICY "Admin full access to document_records" ON document_records TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'REGISTRAR', 'FINANCE_OFFICER', 'ADMISSIONS_OFFICER'))
);
