-- Remove duplicate FAQ entries, keeping only the first occurrence of each question per page
DELETE FROM faq
WHERE id NOT IN (
    SELECT DISTINCT ON (page_id, question) id
    FROM faq
    ORDER BY page_id, question, created_at
);