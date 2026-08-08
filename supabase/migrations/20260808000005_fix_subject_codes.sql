-- Fix subject codes - extract only the code prefix and number from names
UPDATE public."Subject"
SET code = TRIM(REGEXP_REPLACE(name, '^([A-Z]{2,4})\s*(\d{3,4}).*$', '\1 \2'))
WHERE code IS NOT NULL 
  AND LENGTH(code) > 10
  AND code = name;

-- For subjects with proper code patterns, ensure clean format
UPDATE public."Subject"
SET code = TRIM(REGEXP_REPLACE(code, '^([A-Z]{2,4})\s*(\d{3,4}).*$', '\1 \2'))
WHERE code IS NOT NULL 
  AND code ~ '^[A-Z]{2,4}\s*\d{3,4}';
