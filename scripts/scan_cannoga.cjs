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
    for (const row of cols.rows) {
        const { table_name, column_name, data_type } = row;
        const cond = (data_type === 'jsonb' || data_type === 'json')
            ? `("${column_name}"::text ~* 'Cannoga|Penkka')`
            : `("${column_name}" ~* 'Cannoga|Penkka')`;
        try {
            const r = await client.query(`SELECT count(*)::int AS cnt FROM "${table_name}" WHERE ${cond}`);
            if (r.rows[0].cnt > 0) {
                const s = await client.query(`SELECT "${column_name}" FROM "${table_name}" WHERE ${cond} LIMIT 3`);
                console.log(`\nTABLE ${table_name}.${column_name}: ${r.rows[0].cnt} rows`);
                s.rows.forEach(x => console.log('  >', JSON.stringify(x[column_name]).slice(0, 300)));
            }
        } catch (e) { console.log(`ERR ${table_name}.${column_name}: ${e.message}`); }
    }
    await client.end();
}
main().catch(e => { console.error(e); process.exit(1); });
