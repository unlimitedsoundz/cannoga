const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function dump() {
  await client.connect();
  
  console.log('=== FAQ PAGES ===');
  const fp = await client.query('SELECT * FROM faq_pages');
  console.log(JSON.stringify(fp.rows, null, 2));

  console.log('=== FAQ TABLE ===');
  const f = await client.query(`
    SELECT f.id, f.page_id, fp.name as page_name, fp.slug as page_slug, f.question, f.answer 
    FROM faq f 
    LEFT JOIN faq_pages fp ON f.page_id = fp.id
    WHERE f.question ILIKE '%master%' OR f.answer ILIKE '%master%' OR fp.slug ILIKE '%master%' OR fp.name ILIKE '%master%'
  `);
  console.log(JSON.stringify(f.rows, null, 2));

  console.log('=== FAQS TABLE ===');
  const faqs = await client.query(`
    SELECT id, question, answer, category FROM faqs WHERE question ILIKE '%master%' OR answer ILIKE '%master%'
  `);
  console.log(JSON.stringify(faqs.rows, null, 2));

  console.log('=== VOICE_AGENT_FAQS TABLE ===');
  const vfaqs = await client.query(`
    SELECT id, question, answer, category FROM voice_agent_faqs WHERE question ILIKE '%master%' OR answer ILIKE '%master%'
  `);
  console.log(JSON.stringify(vfaqs.rows, null, 2));

  console.log('=== ADMISSIONS/MASTER FAQs ===');
  const masterFaqs = await client.query(`
    SELECT f.id, f.question, f.answer 
    FROM faq f 
    JOIN faq_pages fp ON f.page_id = fp.id 
    WHERE fp.slug = 'admissions/master'
  `);
  for (const r of masterFaqs.rows) {
    console.log(`\nFAQ ID: ${r.id}`);
    console.log(`Q: ${r.question}`);
    console.log(`A: ${r.answer}`);
  }

  await client.end();
}
dump().catch(console.error);


