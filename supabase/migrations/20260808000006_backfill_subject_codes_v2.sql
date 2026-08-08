-- Fix subject codes for all existing records
-- Extract codes from names where they exist

UPDATE public."Subject"
SET code = TRIM(REGEXP_REPLACE(name, '^([A-Z]{2,6})\s*(\d{3,4}).*$', '\1 \2'))
WHERE (code IS NULL OR code = '' OR LENGTH(code) > 10)
  AND name ~ '^[A-Z]{2,6}\s*\d{3,4}';

-- For remaining subjects without codes, generate simple codes
-- Use a subquery to generate sequential numbers
WITH numbered AS (
  SELECT id, name, code, ROW_NUMBER() OVER (ORDER BY name) as rn
  FROM public."Subject"
  WHERE (code IS NULL OR code = '' OR LENGTH(code) > 10)
    AND NOT (name ~ '^[A-Z]{2,6}\s*\d{3,4}')
)
UPDATE public."Subject" s
SET code = 'SUBJ ' || LPAD(n.rn::text, 3, '0')
FROM numbered n
WHERE s.id = n.id;
