const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres'
});

async function main() {
  try {
    await client.connect();
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;");
    console.log('tables:', res.rows.map(r => r.table_name).join(', '));
    const res2 = await client.query("SELECT table_name FROM information_schema.tables WHERE table_name IN ('profiles','system_settings');");
    console.log('profiles/system_settings:', res2.rows.map(r => r.table_name).join(', '));
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
