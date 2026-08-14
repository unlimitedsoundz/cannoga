-- Add missing columns to applications table for document request workflow

ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS requested_documents JSONB,
ADD COLUMN IF NOT EXISTS document_request_note TEXT;
