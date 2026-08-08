-- Final fix: ensure all subjects have proper Canadian course codes
-- Fix records that have invalid codes (too short, or equal to name without code pattern)

UPDATE public."Subject"
SET code = TRIM(REGEXP_REPLACE(name, '^([A-Z]{2,6})\s*(\d{3,4}).*$', '\1 \2'))
WHERE (code IS NULL OR code = '' OR LENGTH(code) < 5 OR code = name OR NOT (code ~ '^[A-Z]{2,6}\s*\d{3,4}'))
  AND name ~ '^[A-Z]{2,6}\s*\d{3,4}';

-- For remaining subjects without proper codes, generate sequential codes
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY name) as rn
  FROM public."Subject"
  WHERE (code IS NULL OR code = '' OR LENGTH(code) < 5 OR code = name OR NOT (code ~ '^[A-Z]{2,6}\s*\d{3,4}'))
    AND NOT (name ~ '^[A-Z]{2,6}\s*\d{3,4}')
)
UPDATE public."Subject" s
SET code = 'SUBJ ' || LPAD(n.rn::text, 3, '0')
FROM numbered n
WHERE s.id = n.id;
