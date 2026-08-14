-- Update blog/news content from Cannoga to Cannoga
UPDATE "blogs"
SET 
  content = regexp_replace(content, 'Cannoga', 'Cannoga', 'g'),
  title = regexp_replace(title, 'Cannoga', 'Cannoga', 'g'),
  excerpt = regexp_replace(excerpt, 'Cannoga', 'Cannoga', 'g')
WHERE 
  content ILIKE '%Cannoga%' 
  OR title ILIKE '%Cannoga%' 
  OR excerpt ILIKE '%Cannoga%';

-- Update FAQ content from Cannoga to Cannoga
UPDATE "faqs"
SET 
  question = regexp_replace(question, 'Cannoga', 'Cannoga', 'g'),
  answer = regexp_replace(answer, 'Cannoga', 'Cannoga', 'g')
WHERE 
  question ILIKE '%Cannoga%' 
  OR answer ILIKE '%Cannoga%';
