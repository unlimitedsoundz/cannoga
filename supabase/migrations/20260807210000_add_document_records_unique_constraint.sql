-- Add unique constraint to document_records for upsert operations

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'document_records'::regclass
        AND conname = 'document_records_student_id_document_type_key'
    ) THEN
        ALTER TABLE public.document_records
        ADD CONSTRAINT document_records_student_id_document_type_key UNIQUE (student_id, document_type);
    END IF;
END;
$$;
