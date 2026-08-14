const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const connectionString = 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';
const migrationPath = path.join(__dirname, 'migrations', '20260801000000_create_page_content_table.sql');

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const sql = fs.readFileSync(migrationPath, 'utf8');
    console.log('Applying migration:', migrationPath);
    await client.query(sql);
    console.log('✅ Migration applied successfully');
  } catch (err) {
    console.error('❌ Migration failed');
    console.error(err.message || err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
