const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  const res = await client.query("SELECT page_slug, section_key, content FROM page_content WHERE page_slug ILIKE '%master%' OR content ILIKE '%master%'");
  for (const row of res.rows) {
    console.log('=== ' + row.page_slug + ' / ' + row.section_key + ' ===');
    console.log(row.content);
    console.log('\n');
  }
  await client.end();
}

run().catch(console.error);
