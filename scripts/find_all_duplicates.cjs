const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
});

async function run() {
    await client.connect();
    const res = await client.query('SELECT id, title, slug, "degreeLevel", cip_code, code, duration, credits FROM "Course" ORDER BY title');
    console.log('Total courses:', res.rows.length);

    // Normalize: remove credential prefixes and non-alphanumerics
    const clean = s => s.toLowerCase()
        .replace(/^(advanced diploma in|diploma in|certificate in|bachelor of applied|bachelor of|bsc|bba|msc|adv dip in)\s+/i, '')
        .replace(/[^a-z0-9]/g, '');

    const map = new Map();
    for (const c of res.rows) {
        const k = clean(c.title);
        if (!map.has(k)) map.set(k, []);
        map.get(k).push(c);
    }

    console.log('\n=============================================================');
    console.log('--- Similar Core Titles (Potential Duplicates or Variants) ---');
    console.log('=============================================================');
    for (const [k, list] of map.entries()) {
        if (list.length > 1) {
            console.log(`\nCore: "${k}" (Count: ${list.length})`);
            list.forEach(c => console.log(`  [${c.degreeLevel}] ${c.title} (${c.duration}, ${c.credits}cr) -> slug: ${c.slug} | code: ${c.code} | id: ${c.id}`));
        }
    }

    await client.end();
}

run().catch(e => {
    console.error(e);
    process.exit(1);
});
