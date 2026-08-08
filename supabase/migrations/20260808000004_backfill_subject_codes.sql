-- Backfill code column for existing Subject records
UPDATE public."Subject"
SET code = TRIM(REGEXP_REPLACE(name, '^([A-Z]{2,4})\s*(\d{3,4})[:\s].*$', '\1 \2'))
WHERE code IS NULL OR code = '';
