const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  
  console.log('--- TABLES ---');
  const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
  console.log(res.rows.map(r => r.table_name));

  console.log('\n--- ENUM DegreeLevel ---');
  const enums = await client.query("SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'DegreeLevel') ORDER BY enumsortorder");
  console.log(enums.rows.map(r => r.enumlabel));

  console.log('\n--- DEGREE LEVEL IN COURSES ---');
  const courses = await client.query('SELECT "degreeLevel", count(*) FROM "Course" GROUP BY "degreeLevel"');
  console.log(courses.rows);

  console.log('\n--- TUITION RATES DEGREE LEVEL ---');
  const tuition = await client.query('SELECT degree_level, count(*) FROM tuition_rates GROUP BY degree_level');
  console.log(tuition.rows);

  await client.end();
}

run().catch(console.error);
