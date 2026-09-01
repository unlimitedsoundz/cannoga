const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function checkPC() {
  await client.connect();
  const res = await client.query(`
    SELECT id, page_slug, section_key, content 
    FROM page_content 
    WHERE page_slug = 'admissions/master'
    ORDER BY id
  `);
  console.log(`Found ${res.rows.length} rows for admissions/master:`);
  for (const r of res.rows) {
    console.log(`\n=== ID: ${r.id} | Section: ${r.section_key} ===`);
    console.log(r.content);
  }
  await client.end();
}
checkPC().catch(console.error);
