const { Client } = require('pg');

const url = "postgresql://postgres.mrqzlmkdhzwvbpljikjz:Guiliababy21%23@aws-1-eu-west-3.pooler.supabase.com:5432/postgres";

const client = new Client({ connectionString: url });

async function main() {
    await client.connect();

    // Recursive jsonb text replacement
    await client.query(`
        CREATE OR REPLACE FUNCTION jsonb_replace_recursive(j jsonb, pat text, rep text)
        RETURNS jsonb LANGUAGE plpgsql AS $$
        DECLARE
            result jsonb;
            k text;
            v jsonb;
        BEGIN
            IF jsonb_typeof(j) = 'object' THEN
                result := '{}'::jsonb;
                FOR k, v IN SELECT * FROM jsonb_each(j) LOOP
                    result := result || jsonb_build_object(k, jsonb_replace_recursive(v, pat, rep));
                END LOOP;
                RETURN result;
            ELSIF jsonb_typeof(j) = 'array' THEN
                SELECT jsonb_agg(jsonb_replace_recursive(elem, pat, rep)) INTO result FROM jsonb_array_elements(j) AS elem;
                RETURN COALESCE(result, '[]'::jsonb);
            ELSIF jsonb_typeof(j) = 'string' THEN
                RETURN to_jsonb(regexp_replace(j::text, pat, rep, 'gi'));
            ELSE
                RETURN j;
            END IF;
        END;
        $$;
    `);

    const cols = await client.query(`
        SELECT table_name, column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND data_type IN ('text', 'character varying', 'character', 'jsonb', 'json')
        ORDER BY table_name, column_name
    `);

    for (const row of cols.rows) {
        const { table_name, column_name, data_type } = row;
        try {
            let res;
            if (data_type === 'jsonb' || data_type === 'json') {
                res = await client.query(`
                    UPDATE "${table_name}"
                    SET "${column_name}" = jsonb_replace_recursive(
                        jsonb_replace_recursive(
                            jsonb_replace_recursive(
                                jsonb_replace_recursive(
                                    jsonb_replace_recursive("${column_name}", 'Cannoga College', 'Heffring University'),
                                    'cannoga\\\\.fi', 'heffring.online'),
                                'Cannoga', 'Heffring'),
                            'penkka\\\\.fi', 'heffring.online'),
                        'Penkka', 'Heffring')
                    WHERE "${column_name}"::text ~* 'Cannoga College|cannoga\\.fi|Cannoga|penkka\\.fi|Penkka'
                `);
            } else {
                res = await client.query(`
                    UPDATE "${table_name}"
                    SET "${column_name}" = regexp_replace(
                        regexp_replace(
                            regexp_replace(
                                regexp_replace(
                                    regexp_replace("${column_name}", 'Cannoga College', 'Heffring University', 'gi'),
                                    'cannoga\\\\.fi', 'heffring.online', 'gi'),
                                'Cannoga', 'Heffring', 'gi'),
                            'penkka\\\\.fi', 'heffring.online', 'gi'),
                        'Penkka', 'Heffring', 'gi')
                    WHERE "${column_name}" ~* 'Cannoga College|cannoga\\.fi|Cannoga|penkka\\.fi|Penkka'
                `);
            }
            if (res.rowCount > 0) {
                console.log(`UPDATED ${table_name}.${column_name}: ${res.rowCount} rows`);
            }
        } catch (e) {
            console.log(`ERR ${table_name}.${column_name}: ${e.message}`);
        }
    }

    await client.query(`DROP FUNCTION IF EXISTS jsonb_replace_recursive(jsonb, text, text);`);
    await client.end();
}

main().catch(e => { console.error(e); process.exit(1); });
