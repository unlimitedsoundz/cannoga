const { Client } = require('pg');

const url = "postgresql://postgres.mrqzlmkdhzwvbpljikjz:Guiliababy21%23@aws-1-eu-west-3.pooler.supabase.com:5432/postgres";

const client = new Client({ connectionString: url });

async function main() {
    await client.connect();

    const cols = await client.query(`
        SELECT table_name, column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND data_type IN ('text', 'character varying', 'character', 'jsonb', 'json')
        ORDER BY table_name, column_name
    `);

    const needles = ['Cannoga College', 'cannoga college', 'Penkka', 'penkka', 'Ottawa', 'ottawa'];
    for (const row of cols.rows) {
        const { table_name, column_name, data_type } = row;
        let cond;
        if (data_type === 'jsonb' || data_type === 'json') {
            cond = `("${column_name}"::text ILIKE '%Cannoga%' OR "${column_name}"::text ILIKE '%Penkka%' OR "${column_name}"::text ILIKE '%Ottawa%')`;
        } else {
            cond = `("${column_name}" ILIKE '%Cannoga%' OR "${column_name}" ILIKE '%Penkka%' OR "${column_name}" ILIKE '%Ottawa%')`;
        }
        try {
            const r = await client.query(`SELECT count(*)::int AS cnt FROM "${table_name}" WHERE ${cond}`);
            if (r.rows[0].cnt > 0) {
                console.log(`TABLE ${table_name}.${column_name} (${data_type}): ${r.rows[0].cnt} rows`);
            }
        } catch (e) {
            console.log(`ERR ${table_name}.${column_name}: ${e.message}`);
        }
    }

    await client.end();
}

main().catch(e => { console.error(e); process.exit(1); });
