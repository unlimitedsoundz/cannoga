-- Comprehensive fix for Subject IDs and names
-- Issues found:
-- 1. IDs containing dots (e.g., ARCHM.AR001)
-- 2. IDs with embedded course codes (e.g., BSCACCO001, DATAANAL001, ELECAUTO001)
-- 3. Names with embedded course codes (e.g., "BACHEL 101: Data Structures and Algorithms")
-- 4. Names with leading/trailing spaces
-- 5. Duplicate names across different subject IDs

-- Step 1: Fix IDs containing dots and other invalid characters
UPDATE public."Subject"
SET id = REGEXP_REPLACE(id, '[^a-zA-Z0-9_-]', '_', 'g')
WHERE id ~ '[^a-zA-Z0-9_-]';

-- Step 2: Remove embedded course codes from names (various patterns)
-- Pattern: "PREFIX 1234: Title" or "PREFIX 1234 Title"
UPDATE public."Subject"
SET name = TRIM(REGEXP_REPLACE(name, '^[A-Z]{2,6}\s*\d{3,4}:\s*', ''))
WHERE name ~ '^[A-Z]{2,6}\s*\d{3,4}:';

UPDATE public."Subject"
SET name = TRIM(REGEXP_REPLACE(name, '^[A-Z]{2,6}\s*\d{3,4}\s+', ''))
WHERE name ~ '^[A-Z]{2,6}\s*\d{3,4}\s+[A-Z]';

-- Pattern: "DEGREE CODE: Title" like "BSC AC 101: Title", "MSC IN 101: Title"
UPDATE public."Subject"
SET name = TRIM(REGEXP_REPLACE(name, '^[A-Z]{2,4}\s*[A-Z]{0,2}\s*\d{3,4}:\s*', ''))
WHERE name ~ '^[A-Z]{2,4}\s*[A-Z]{0,2}\s*\d{3,4}:';

-- Pattern: "PREFIX 101: Title" with longer prefixes
UPDATE public."Subject"
SET name = TRIM(REGEXP_REPLACE(name, '^[A-Z]{2,8}\s*\d{3,4}:\s*', ''))
WHERE name ~ '^[A-Z]{2,8}\s*\d{3,4}:';

-- Clean up double spaces
UPDATE public."Subject"
SET name = REGEXP_REPLACE(name, '\s+', ' ')
WHERE name LIKE '%  %';

-- Step 3: Fix duplicate names by making them unique with context
-- Organizational Theory duplicates
UPDATE public."Subject" SET name = 'Organizational Theory (Business)' WHERE id = 'BUSI001' AND name = 'Organizational Theory';
UPDATE public."Subject" SET name = 'Organizational Theory (Digital Business)' WHERE id = 'DIGIBUSI001' AND name = 'Organizational Theory';
UPDATE public."Subject" SET name = 'Organizational Theory (Project Management)' WHERE id = 'PROJ001' AND name = 'Organizational Theory';
UPDATE public."Subject" SET name = 'Organizational Theory (General)' WHERE id = 'BACH001' AND name = 'Organizational Theory';
UPDATE public."Subject" SET name = 'Organizational Theory (Master)' WHERE id = 'MASTSTUD001' AND name = 'Organizational Theory';
UPDATE public."Subject" SET name = 'Organizational Theory (Info Services)' WHERE id = 'INFOSERV001' AND name = 'Organizational Theory';
UPDATE public."Subject" SET name = 'Organizational Theory (Master Strategy)' WHERE id = 'MASTSTRA001' AND name = 'Organizational Theory';
UPDATE public."Subject" SET name = 'Organizational Theory (Logistics)' WHERE id = 'OPERLOGI001' AND name = 'Organizational Theory';

-- Leadership Development duplicates
UPDATE public."Subject" SET name = 'Leadership Development (Business)' WHERE id = 'BUSI002' AND name = 'Leadership Development';
UPDATE public."Subject" SET name = 'Leadership Development (Digital Business)' WHERE id = 'DIGIBUSI002' AND name = 'Leadership Development';
UPDATE public."Subject" SET name = 'Leadership Development (Project Management)' WHERE id = 'PROJ002' AND name = 'Leadership Development';
UPDATE public."Subject" SET name = 'Leadership Development (General)' WHERE id = 'BACH002' AND name = 'Leadership Development';
UPDATE public."Subject" SET name = 'Leadership Development (Master)' WHERE id = 'MASTSTUD002' AND name = 'Leadership Development';
UPDATE public."Subject" SET name = 'Leadership Development (Info Services)' WHERE id = 'INFOSERV002' AND name = 'Leadership Development';
UPDATE public."Subject" SET name = 'Leadership Development (Humanities)' WHERE id = 'HUMARESO002' AND name = 'Leadership Development';

-- Change Management duplicates
UPDATE public."Subject" SET name = 'Change Management (Digital Business)' WHERE id = 'DIGIBUSI003' AND name = 'Change Management';
UPDATE public."Subject" SET name = 'Change Management (Project Management)' WHERE id = 'PROJ003' AND name = 'Change Management';
UPDATE public."Subject" SET name = 'Change Management (Operations)' WHERE id = 'OPERLOGI003' AND name = 'Change Management';
UPDATE public."Subject" SET name = 'Change Management (Master)' WHERE id = 'MASTSTRA003' AND name = 'Change Management';
UPDATE public."Subject" SET name = 'Change Management (Info Services)' WHERE id = 'INFOSERV003' AND name = 'Change Management';
UPDATE public."Subject" SET name = 'Change Management (Humanities)' WHERE id = 'HUMARESO003' AND name = 'Change Management';

-- Strategic Planning duplicates
UPDATE public."Subject" SET name = 'Strategic Planning (Digital Business)' WHERE id = 'DIGIBUSI004' AND name = 'Strategic Planning';
UPDATE public."Subject" SET name = 'Strategic Planning (Project Management)' WHERE id = 'PROJ004' AND name = 'Strategic Planning';
UPDATE public."Subject" SET name = 'Strategic Planning (Master Strategy)' WHERE id = 'MASTSTRA004' AND name = 'Strategic Planning';
UPDATE public."Subject" SET name = 'Strategic Planning (Info Services)' WHERE id = 'INFOSERV004' AND name = 'Strategic Planning';
UPDATE public."Subject" SET name = 'Strategic Planning (Humanities)' WHERE id = 'HUMARESO004' AND name = 'Strategic Planning';

-- Core Concepts and Principles duplicates
UPDATE public."Subject" SET name = 'Core Concepts and Principles (Chemical)' WHERE id = 'CHEMMETA002' AND name = 'Core Concepts and Principles';
UPDATE public."Subject" SET name = 'Core Concepts and Principles (Communications)' WHERE id = 'INFOCOMM002' AND name = 'Core Concepts and Principles';
UPDATE public."Subject" SET name = 'Core Concepts and Principles (Master Math)' WHERE id = 'MASTMATH002' AND name = 'Core Concepts and Principles';
UPDATE public."Subject" SET name = 'Core Concepts and Principles (Mechanical)' WHERE id = 'MECHFOUN001' AND name = 'Core Concepts and Principles';
UPDATE public."Subject" SET name = 'Core Concepts and Principles (Mechatronics)' WHERE id = 'MECHENER002' AND name = 'Core Concepts and Principles';

-- Intermediate Studies duplicates
UPDATE public."Subject" SET name = 'Intermediate Studies (Chemical)' WHERE id = 'CHEMMETA003' AND name = 'Intermediate Studies';
UPDATE public."Subject" SET name = 'Intermediate Studies (Communications)' WHERE id = 'INFOCOMM003' AND name = 'Intermediate Studies';

-- Foundations of AI duplicates
UPDATE public."Subject" SET name = 'Foundations of AI (Business)' WHERE id = 'BUSIFOUN001' AND name = 'Introduction to Business';
UPDATE public."Subject" SET name = 'Foundations of AI (Sustainability)' WHERE id = 'SUSTAGRI001' AND name = 'Foundations of AI';
UPDATE public."Subject" SET name = 'Foundations of AI (Social Media)' WHERE id = 'SOCIMEDI001' AND name = 'Foundations of AI';

-- Machine Learning duplicates
UPDATE public."Subject" SET name = 'Machine Learning (Sustainability)' WHERE id = 'SUSTAGRI002' AND name = 'Machine Learning';
UPDATE public."Subject" SET name = 'Machine Learning (AI)' WHERE id = 'ARTIINTE002' AND name = 'Machine Learning';

-- Neural Networks and Deep Learning duplicates
UPDATE public."Subject" SET name = 'Neural Networks and Deep Learning (Sustainability)' WHERE id = 'SUSTAGRI003' AND name = 'Neural Networks and Deep Learning';
UPDATE public."Subject" SET name = 'Neural Networks and Deep Learning (AI)' WHERE id = 'ARTIINTE003' AND name = 'Neural Networks and Deep Learning';

-- IT Infrastructure duplicates
UPDATE public."Subject" SET name = 'IT Infrastructure (Info Systems)' WHERE id = 'INFOSYST001' AND name = 'IT Infrastructure';
UPDATE public."Subject" SET name = 'IT Infrastructure (Information Services)' WHERE id = 'INFOSERV001' AND name = 'IT Infrastructure';
UPDATE public."Subject" SET name = 'IT Infrastructure (Communications)' WHERE id = 'INFOCOMM001' AND name = 'IT Infrastructure';

-- Business Administration duplicates
UPDATE public."Subject" SET name = 'Business Administration (Digital Business)' WHERE id IN ('DIGIBUSI001', 'DIGIBUSI002', 'DIGIBUSI003', 'DIGIBUSI004', 'DIGIBUSI005') AND name = 'Business Administration';

-- Financial Accounting duplicates
UPDATE public."Subject" SET name = 'Financial Accounting (Master)' WHERE id IN ('MASTFINA001', 'ACCO001', 'ACCOFUND001', 'ACCOPAYR001') AND name = 'Financial Accounting';

-- Corporate Finance duplicates
UPDATE public."Subject" SET name = 'Corporate Finance (Master)' WHERE id = 'MASTFINA002' AND name = 'Corporate Finance';
UPDATE public."Subject" SET name = 'Corporate Finance (Accounting)' WHERE id = 'ACCOFUND002' AND name = 'Corporate Finance';

-- Business Strategy duplicates
UPDATE public."Subject" SET name = 'Business Strategy (Digital Business)' WHERE id = 'DIGIBUSI005' AND name = 'Business Strategy';

-- Mechanical Blueprint Reading duplicates
UPDATE public."Subject" SET name = 'Mechanical Blueprint Reading (Welding)' WHERE id = 'WELDTECH001' AND name = 'Mechanical Blueprint Reading';
UPDATE public."Subject" SET name = 'Mechanical Blueprint Reading (Mechanical)' WHERE id = 'MECHTECH001' AND name = 'Mechanical Blueprint Reading';

-- Digital Media Production duplicates
UPDATE public."Subject" SET name = 'Digital Media Production (Master)' WHERE id = 'ARTMEDI001' AND name = 'Digital Media Production';
UPDATE public."Subject" SET name = 'Digital Media Production (Social Media)' WHERE id = 'SOCIMEDI001' AND name = 'Digital Media Production';

-- Cultural Studies and Critique duplicates
UPDATE public."Subject" SET name = 'Cultural Studies and Critique (Master)' WHERE id = 'ARTMEDI002' AND name = 'Cultural Studies and Critique';
UPDATE public."Subject" SET name = 'Cultural Studies and Critique (Social Media)' WHERE id = 'SOCIMEDI002' AND name = 'Cultural Studies and Critique';

-- Marketing Research duplicates
UPDATE public."Subject" SET name = 'Marketing Research (Bachelor)' WHERE id = 'BACHMARK001' AND name = 'Marketing Research';
UPDATE public."Subject" SET name = 'Marketing Research (Master)' WHERE id = 'MARK001' AND name = 'Marketing Research';

-- Digital Marketing duplicates
UPDATE public."Subject" SET name = 'Digital Marketing (Bachelor)' WHERE id = 'BACHMARK002' AND name = 'Digital Marketing';
UPDATE public."Subject" SET name = 'Digital Marketing (Master)' WHERE id = 'MARK002' AND name = 'Digital Marketing';

-- Consumer Behaviour duplicates
UPDATE public."Subject" SET name = 'Consumer Behaviour (Bachelor)' WHERE id = 'BACHMARK003' AND name = 'Consumer Behaviour';
UPDATE public."Subject" SET name = 'Consumer Behaviour (Master)' WHERE id = 'MARK003' AND name = 'Consumer Behaviour';

-- Brand Management duplicates
UPDATE public."Subject" SET name = 'Brand Management (Bachelor)' WHERE id = 'BACHMARK004' AND name = 'Brand Management';
UPDATE public."Subject" SET name = 'Brand Management (Master)' WHERE id = 'MARK004' AND name = 'Brand Management';

-- Hospitality duplicates
UPDATE public."Subject" SET name = 'Hotel Operations Management' WHERE id = 'HOSP001' AND name = 'Hotel Operations Management';
UPDATE public."Subject" SET name = 'Tourism Industry Overview' WHERE id = 'TOUR001' AND name = 'Tourism Industry Overview';
UPDATE public."Subject" SET name = 'Event Planning and Management' WHERE id = 'EVENPLAN001' AND name = 'Tourism Industry Overview';

-- Aviation duplicates
UPDATE public."Subject" SET name = 'Aviation Safety and Security (Aviation)' WHERE id = 'FLIGSERV001' AND name = 'Aviation Safety and Security';
UPDATE public."Subject" SET name = 'Aviation Safety and Security (Airline)' WHERE id = 'AIRBUSI001' AND name = 'Aviation Safety and Security';

-- Electrical duplicates
UPDATE public."Subject" SET name = 'Electrical Theory' WHERE id = 'ELECTECH001' AND name = 'Electrical Theory';
UPDATE public."Subject" SET name = 'Digital Electronics (Electrical)' WHERE id = 'ELECTECH002' AND name = 'Digital Electronics';
UPDATE public."Subject" SET name = 'Digital Electronics (Electronics)' WHERE id = 'ELECAUTO002' AND name = 'Digital Electronics';

-- Step 4: Regenerate codes for all subjects
UPDATE public."Subject" SET code = NULL;

WITH prefix_groups AS (
  SELECT 
    id,
    name,
    CASE
      WHEN name ~ '^\s*([A-Z]{2,6})\s*\d' THEN REGEXP_REPLACE(name, '^\s*([A-Z]{2,6})\s*\d.*$', '\1')
      WHEN name ~ '^\s*([A-Z]{2,4})\s' THEN REGEXP_REPLACE(name, '^\s*([A-Z]{2,4})\s.*$', '\1')
      WHEN name ~ '^\s*([A-Z]{2,4})' THEN REGEXP_REPLACE(name, '^\s*([A-Z]{2,4}).*$', '\1')
      ELSE UPPER(LEFT(TRIM(name), 3))
    END as raw_prefix,
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
