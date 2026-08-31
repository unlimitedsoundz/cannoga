const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

function transformTitle(title) {
  let t = title;
  t = t.replace(/^Master of Engineering in /i, 'Advanced Diploma in ');
  t = t.replace(/^Master of Science in /i, 'Advanced Diploma in ');
  t = t.replace(/^Master of Arts in /i, 'Advanced Diploma in ');
  t = t.replace(/^Master of Art and Media \(MA\)/i, 'Advanced Diploma in Art and Media');
  t = t.replace(/^Master of Architecture \(M\.Arch\)/i, 'Advanced Diploma in Architectural Technology & Design');
  t = t.replace(/^Master of Social Work \(MSW\)/i, 'Advanced Diploma in Social Work');
  t = t.replace(/^Master of Public Health \(MPH\)/i, 'Advanced Diploma in Public Health');
  t = t.replace(/^Master of Business Administration \(MBA\)/i, 'Advanced Diploma in Business Administration');
  t = t.replace(/^MSc in /i, 'Advanced Diploma in ');
  t = t.replace(/^MA in /i, 'Advanced Diploma in ');
  t = t.replace(/^Master's in /i, 'Advanced Diploma in ');
  t = t.replace(/^Masters in /i, 'Advanced Diploma in ');
  t = t.replace(/Interdisciplinary \/ Joint/i, 'Interdisciplinary Studies');
  return t;
}

function cleanText(text) {
  if (!text) return text;
  return text
    .replace(/Master's degree/gi, "Advanced Diploma")
    .replace(/Master’s degree/gi, "Advanced Diploma")
    .replace(/Master's Degree/gi, "Advanced Diploma")
    .replace(/Master’s Degree/gi, "Advanced Diploma")
    .replace(/Master's programme/gi, "Advanced Diploma programme")
    .replace(/Master’s programme/gi, "Advanced Diploma programme")
    .replace(/Master's program/gi, "Advanced Diploma program")
    .replace(/Master’s program/gi, "Advanced Diploma program")
    .replace(/Master's/gi, "Advanced Diploma")
    .replace(/Master’s/gi, "Advanced Diploma")
    .replace(/Masters/gi, "Advanced Diploma")
    .replace(/two-year Master’s/gi, "three-year Advanced Diploma")
    .replace(/two-year Master's/gi, "three-year Advanced Diploma")
    .replace(/2-year Master’s/gi, "3-year Advanced Diploma")
    .replace(/2-year Master's/gi, "3-year Advanced Diploma")
    .replace(/2-year programs/gi, "3-year programs")
    .replace(/2-year/gi, "3-year")
    .replace(/2 years/gi, "3 years")
    .replace(/2 Years/gi, "3 Years");
}

async function run() {
  await client.connect();
  console.log('Connected to Postgres.');

  // 1. Update Course records
  const coursesRes = await client.query('SELECT id, title, "degreeLevel", duration, description, "entryRequirements" FROM "Course" WHERE "degreeLevel" = $1', ['MASTER']);
  console.log(`Found ${coursesRes.rows.length} courses with degreeLevel = MASTER.`);

  for (const row of coursesRes.rows) {
    const newTitle = transformTitle(row.title);
    const newDesc = cleanText(row.description);
    const newReqs = cleanText(row.entryRequirements);
    
    await client.query(
      'UPDATE "Course" SET title = $1, duration = $2, credits = $3, description = $4, "entryRequirements" = $5 WHERE id = $6',
      [newTitle, '3 Years', 90, newDesc, newReqs, row.id]
    );
    console.log(`Updated course ${row.id}: "${row.title}" -> "${newTitle}" (3 Years, 90 credits)`);
  }

  // 2. Update page_content records
  const pcRes = await client.query("SELECT id, page_slug, section_key, content FROM page_content WHERE page_slug ILIKE '%master%' OR content ILIKE '%master%'");
  console.log(`\nFound ${pcRes.rows.length} page_content entries matching master.`);

  for (const row of pcRes.rows) {
    const newContent = cleanText(row.content);
    await client.query('UPDATE page_content SET content = $1 WHERE id = $2', [newContent, row.id]);
    console.log(`Updated page_content: ${row.page_slug} / ${row.section_key}`);
  }

  console.log('\nDatabase update completed successfully!');
  await client.end();
}

run().catch(err => {
  console.error('Error running script:', err);
  process.exit(1);
});
