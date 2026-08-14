const { Client } = require('pg');

const url = "postgresql://postgres.mrqzlmkdhzwvbpljikjz:Guiliababy21%23@aws-1-eu-west-3.pooler.supabase.com:5432/postgres";

const client = new Client({ connectionString: url });

async function main() {
    await client.connect();

    const samples = [
        ['Course', 'sections'],
        ['applications', 'motivation'],
        ['student_it_access', 'credentials'],
    ];
    for (const [t, c] of samples) {
        const r = await client.query(`SELECT "${c}" FROM "${t}" WHERE "${c}"::text ILIKE '%Cannoga%' OR "${c}"::text ILIKE '%Penkka%' LIMIT 2`);
        console.log(`\n=== ${t}.${c} ===`);
        r.rows.forEach(row => console.log(JSON.stringify(row[c]).slice(0, 600)));
    }

    await client.end();
}

main().catch(e => { console.error(e); process.exit(1); });
