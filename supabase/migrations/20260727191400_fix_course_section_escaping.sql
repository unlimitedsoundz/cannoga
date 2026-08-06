-- Fix severely over-escaped JSONB content in Course.sections
-- The data shows 3+ layers of escaping: \"\\\"\\\\\\\" content \\\\\\\"\\\"

CREATE OR REPLACE FUNCTION fix_deep_escaped(input text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    result text := input;
    changed boolean := true;
    iterations int := 0;
BEGIN
    WHILE changed AND iterations < 10 LOOP
        changed := false;
        iterations := iterations + 1;
        
        -- Strip leading escaped quote sequences (\" \\\" \\\\\" etc.)
        WHILE result ~ '^(\\\\)+\\"' LOOP
            result := regexp_replace(result, '^(\\\\)+\\"', '', 'g');
            changed := true;
        END LOOP;
        
        -- Strip trailing escaped quote sequences  
        WHILE result ~ '(\\\\)+\\"$' LOOP
            result := regexp_replace(result, '(\\\\)+\\"$', '', 'g');
            changed := true;
        END LOOP;
        
        -- Unescape HTML attribute quotes: \" → "
        IF result LIKE '%\\\\"%' OR result LIKE '%\\"%' THEN
            result := replace(result, '\\\\"', '"');
            changed := true;
        END IF;
        
        -- Unescape newlines: \\n → newline
        IF result LIKE '%\\\\n%' THEN
            result := replace(result, '\\\\n', E'\n');
            changed := true;
        END IF;
        
        -- Unescape double backslashes: \\ → \
        IF result LIKE '%\\\\\\\\%' OR result LIKE '%\\\\%' THEN
            result := replace(result, '\\\\', '\\');
            changed := true;
        END IF;
    END LOOP;
    
    RETURN result;
END;
$$;

-- Fix content field in sections
UPDATE "Course"
SET "sections" = (
    SELECT jsonb_agg(
        CASE
            WHEN elem ? 'content'
            THEN jsonb_set(elem, '{content}', to_jsonb(fix_deep_escaped(elem->>'content')))
            ELSE elem
        END
    )
    FROM jsonb_array_elements("sections") AS elem
)
WHERE EXISTS (
    SELECT 1 FROM jsonb_array_elements("sections") AS elem
    WHERE elem->>'content' ~ '^(\\\\)+\\"'
);

-- Fix id and title fields
UPDATE "Course"
SET "sections" = (
    SELECT jsonb_agg(
        jsonb_set(
            jsonb_set(elem, '{id}', to_jsonb(fix_deep_escaped(elem->>'id'))),
            '{title}', 
            to_jsonb(fix_deep_escaped(elem->>'title'))
        )
    )
    FROM jsonb_array_elements("sections") AS elem
)
WHERE EXISTS (
    SELECT 1 FROM jsonb_array_elements("sections") AS elem
    WHERE elem->>'id' ~ '^(\\\\)+\\"'
       OR elem->>'title' ~ '^(\\\\)+\\"'
);
