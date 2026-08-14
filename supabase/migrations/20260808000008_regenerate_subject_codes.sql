-- Regenerate all Subject codes using proper Canadian academic format
-- Prefix derived from subject name (alphabetic only), sequential number within each prefix group

-- First, reset all codes to NULL so we can regenerate them properly
UPDATE public."Subject" SET code = NULL;

-- Generate proper codes using a CTE with partitioning by prefix
WITH prefix_groups AS (
  SELECT 
    id,
    name,
    -- Extract prefix from subject name, ensuring it's alphabetic
    CASE
      -- If name starts with "2D" or "3D", use the next word as prefix
      WHEN name ~ '^\s*[23]D\s+' THEN UPPER(LEFT(TRIM(REGEXP_REPLACE(name, '^\s*[23]D\s+([A-Za-z]+).*$', '\1')), 4))
      -- If name starts with letters followed by numbers, extract the letters
      WHEN name ~ '^\s*([A-Z]{2,6})\s*\d' THEN REGEXP_REPLACE(name, '^\s*([A-Z]{2,6})\s*\d.*$', '\1')
      -- If name starts with letters followed by space, extract first 2-4 letters
      WHEN name ~ '^\s*([A-Z]{2,4})\s' THEN REGEXP_REPLACE(name, '^\s*([A-Z]{2,4})\s.*$', '\1')
      -- Fallback: first 3 letters of the name
      ELSE UPPER(LEFT(TRIM(name), 3))
    END as raw_prefix,
    -- Try to extract existing level number from name
    CASE
      WHEN name ~ '^\s*[A-Z]{2,6}\s*(\d)' THEN SUBSTRING(name FROM '^\s*[A-Z]{2,6}\s*(\d)')::int
      ELSE 1
    END as level
  FROM public."Subject"
),
cleaned_prefixes AS (
  SELECT 
    id,
    name,
    -- Ensure prefix is alphabetic only
    CASE
      WHEN raw_prefix ~ '^[A-Z]+$' THEN raw_prefix
      WHEN raw_prefix ~ '^[A-Z]+' THEN SUBSTRING(raw_prefix FROM '^[A-Z]+')
      ELSE UPPER(LEFT(TRIM(name), 3))
    END as prefix,
    level
  FROM prefix_groups
),
numbered AS (
  SELECT 
    id,
    prefix,
    level,
    ROW_NUMBER() OVER (PARTITION BY prefix ORDER BY name) as seq
  FROM cleaned_prefixes
)
UPDATE public."Subject" s
SET code = n.prefix || ' ' || n.level || LPAD(n.seq::text, 3, '0')
FROM numbered n
WHERE s.id = n.id;
