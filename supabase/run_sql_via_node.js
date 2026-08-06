const fs = require('fs');
const { Client } = require('pg');

(async () => {
  const conn = process.argv[2];
  if (!conn) {
    console.error('Provide a Postgres connection string as the first argument.');
    process.exit(1);
  }
  const sql = fs.readFileSync('d:/cannogauniversity/supabase/migrations/20260426000000_create_system_settings.sql', 'utf8');
  const client = new Client({ connectionString: conn });
  try {
    await client.connect();
    await client.query(sql);
    console.log('Migration applied successfully.');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
