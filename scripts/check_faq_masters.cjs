const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function check() {
  await client.connect();
  const res = await client.query(`
    SELECT f.id, fp.slug, f.question, f.answer 
    FROM faq f 
    LEFT JOIN faq_pages fp ON f.page_id = fp.id 
    WHERE f.question ILIKE '%master%' OR f.answer ILIKE '%master%'
  `);
  console.log(`Found ${res.rows.length} FAQ rows with 'master':`);
  for (const r of res.rows) {
    console.log(`\n--- FAQ ID: ${r.id} | Page: ${r.slug} ---`);
    console.log(`Q: ${r.question}`);
    console.log(`A: ${r.answer}`);
  }

  const pages = await client.query(`
    SELECT * FROM faq_pages
  `);
  console.log('\nFAQ pages:', pages.rows);

  await client.end();
}

check().catch(console.error);
