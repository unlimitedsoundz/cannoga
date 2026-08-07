const { Client } = require('pg');
const url = "postgresql://postgres.mrqzlmkdhzwvbpljikjz:Guiliababy21%23@aws-1-eu-west-3.pooler.supabase.com:5432/postgres";
const client = new Client({ connectionString: url });
async function main() {
    await client.connect();
    const r = await client.query(`SELECT id, name FROM "School" WHERE "name" ~* 'Cannoga|Penkka|Heffring' OR "name" ILIKE '%cannoga%' OR "name" ILIKE '%penkka%'`);
    console.log('Schools matching Cannoga/Penkka/Heffring:');
    r.rows.forEach(x => console.log('  ', x.id, '=>', x.name));
    const c = await client.query(`SELECT count(*)::int cnt, "name" FROM "Course" WHERE "name" ~* 'Cannoga|Penkka' GROUP BY "name" LIMIT 10`);
    console.log('Course names with Cannoga/Penkka:', c.rows);
    await client.end();
}
main().catch(e => { console.error(e); process.exit(1); });
