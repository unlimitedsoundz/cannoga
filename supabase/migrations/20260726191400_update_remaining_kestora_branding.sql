-- Update all remaining Cannoga references to Cannoga across all content tables

-- Update page_content table
UPDATE page_content
SET content = REPLACE(content, 'Cannoga College', 'Cannoga College')
WHERE content ILIKE '%Cannoga College%';

UPDATE page_content
SET content = REPLACE(content, 'Cannoga', 'Cannoga')
WHERE content ILIKE '%Cannoga%' AND NOT content ILIKE '%Cannoga%';

-- Update Course table
UPDATE "Course"
SET 
  title = REPLACE(REPLACE(title, 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga'),
  description = REPLACE(REPLACE(description, 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga'),
  "entryRequirements" = REPLACE(REPLACE("entryRequirements", 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga'),
  "careerPaths" = REPLACE(REPLACE("careerPaths", 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga')
WHERE 
  title ILIKE '%Cannoga%'
  OR description ILIKE '%Cannoga%'
  OR "entryRequirements" ILIKE '%Cannoga%'
  OR "careerPaths" ILIKE '%Cannoga%';

-- Update Course sections JSONB content
UPDATE "Course"
SET "sections" = (
    SELECT jsonb_agg(
        CASE
            WHEN elem ? 'content'
            THEN jsonb_set(elem, '{content}', to_jsonb(REPLACE(REPLACE((elem->>'content')::text, 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga')))
            ELSE elem
        END
    )
    FROM jsonb_array_elements("sections") AS elem
)
WHERE EXISTS (
    SELECT 1 FROM jsonb_array_elements("sections") AS elem
    WHERE elem->>'content' ILIKE '%Cannoga%'
);

-- Update News table
UPDATE "News"
SET 
  title = REPLACE(REPLACE(title, 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga'),
  content = REPLACE(REPLACE(content, 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga'),
  excerpt = REPLACE(REPLACE(excerpt, 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga')
WHERE 
  title ILIKE '%Cannoga%'
  OR content ILIKE '%Cannoga%'
  OR excerpt ILIKE '%Cannoga%';

-- Update Event table
UPDATE "Event"
SET 
  title = REPLACE(REPLACE(title, 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga'),
  content = REPLACE(REPLACE(content, 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga'),
  location = REPLACE(REPLACE(location, 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga'),
  category = REPLACE(REPLACE(category, 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga')
WHERE 
  title ILIKE '%Cannoga%'
  OR content ILIKE '%Cannoga%'
  OR location ILIKE '%Cannoga%'
  OR category ILIKE '%Cannoga%';

-- Update School table
UPDATE "School"
SET 
  name = REPLACE(REPLACE(name, 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga'),
  description = REPLACE(REPLACE(description, 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga')
WHERE 
  name ILIKE '%Cannoga%'
  OR description ILIKE '%Cannoga%';

-- Update Department table
UPDATE "Department"
SET 
  name = REPLACE(REPLACE(name, 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga'),
  description = REPLACE(REPLACE(description, 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga')
WHERE 
  name ILIKE '%Cannoga%'
  OR description ILIKE '%Cannoga%';

-- Update Faculty table
UPDATE "Faculty"
SET 
  name = REPLACE(REPLACE(name, 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga'),
  bio = REPLACE(REPLACE(bio, 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga')
WHERE 
  name ILIKE '%Cannoga%'
  OR bio ILIKE '%Cannoga%';

-- Update modules table
UPDATE modules
SET 
  title = REPLACE(REPLACE(title, 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga'),
  description = REPLACE(REPLACE(description, 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga')
WHERE 
  title ILIKE '%Cannoga%'
  OR description ILIKE '%Cannoga%';

-- Update it_assets table
UPDATE it_assets
SET 
  name = REPLACE(REPLACE(name, 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga'),
  description = REPLACE(REPLACE(description, 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga')
WHERE 
  name ILIKE '%Cannoga%'
  OR description ILIKE '%Cannoga%';

-- Update faq_pages table
UPDATE faq_pages
SET name = REPLACE(REPLACE(name, 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga')
WHERE name ILIKE '%Cannoga%';

-- Ensure faq table is also fully updated
UPDATE faq
SET 
  question = REPLACE(REPLACE(question, 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga'),
  answer = REPLACE(REPLACE(answer, 'Cannoga College', 'Cannoga College'), 'Cannoga', 'Cannoga')
WHERE 
  question ILIKE '%Cannoga%'
  OR answer ILIKE '%Cannoga%';
