-- Cleanup Duplicates and Add Constraints

BEGIN;

-- 1. Identify and Keep only the latest asset for each (type, name) pair
--    (Using a temporary table or CTE to simplify logic is safest)

CREATE TEMP TABLE distinct_assets AS
SELECT DISTINCT ON (asset_type, name) id, asset_type, name
FROM it_assets
ORDER BY asset_type, name, created_at DESC;

-- 2. Consolidate Student Access Records
--    Instead of just updating, we need to:
--    a. Identify access records pointing to "duplicate" assets
--    b. Delete them if an access record for the "kept" asset already exists
--    c. Update them if no access record for the "kept" asset exists

DO $$
DECLARE
    r RECORD;
BEGIN
    -- Iterate through duplicates
    FOR r IN 
        SELECT 
            da.id AS kept_asset_id,
            current_asset.id AS duplicate_asset_id
        FROM it_assets current_asset
        JOIN distinct_assets da ON da.asset_type = current_asset.asset_type AND da.name = current_asset.name
        WHERE current_asset.id != da.id
    LOOP
        -- Delete collision (Student has access to BOTH kept and duplicate -> Delete duplicate access)
        DELETE FROM student_it_access
        WHERE asset_id = r.duplicate_asset_id
        AND student_id IN (
            SELECT student_id FROM student_it_access WHERE asset_id = r.kept_asset_id
        );

        -- Update remaining (Student ONLY has access to duplicate -> Move to kept)
        UPDATE student_it_access
        SET asset_id = r.kept_asset_id
        WHERE asset_id = r.duplicate_asset_id;
    END LOOP;
END $$;


-- 4. Delete the "extra" assets
DELETE FROM it_assets
WHERE id NOT IN (SELECT id FROM distinct_assets);

-- 5. Add Unique Constraint to prevent this in future
ALTER TABLE it_assets 
ADD CONSTRAINT it_assets_name_type_key UNIQUE (name, asset_type);

COMMIT;
