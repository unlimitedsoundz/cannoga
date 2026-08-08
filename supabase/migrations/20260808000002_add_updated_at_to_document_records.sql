-- Add updated_at column to document_records for tracking updates
ALTER TABLE public.document_records
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- Create a trigger to auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION update_document_records_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_document_records_updated_at ON public.document_records;
CREATE TRIGGER trigger_update_document_records_updated_at
    BEFORE UPDATE ON public.document_records
    FOR EACH ROW EXECUTE FUNCTION update_document_records_updated_at();

-- Backfill updated_at with created_at for existing records
UPDATE public.document_records
SET updated_at = created_at
WHERE updated_at IS NULL;
