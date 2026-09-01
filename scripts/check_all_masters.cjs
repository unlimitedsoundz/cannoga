const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  const tables = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `);
  console.log('Tables:', tables.rows.map(r => r.table_name));

  for (const t of tables.rows) {
    try {
      const cols = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = '${t.table_name}' AND data_type IN ('text', 'character varying', 'json', 'jsonb')
      `);
      for (const col of cols.rows) {
        try {
          const res = await client.query(`
            SELECT count(*) FROM "${t.table_name}" WHERE CAST("${col.column_name}" AS TEXT) ILIKE '%master%'
          `);
          if (parseInt(res.rows[0].count) > 0) {
            console.log(`Match in table '${t.table_name}', col '${col.column_name}': ${res.rows[0].count} rows`);
            const sample = await client.query(`
              SELECT id, "${col.column_name}" FROM "${t.table_name}" WHERE CAST("${col.column_name}" AS TEXT) ILIKE '%master%' LIMIT 5
            `);
            console.log('Sample IDs:', sample.rows.map(r => ({ id: r.id, val: String(r[col.column_name]).slice(0, 100) })));
          }
        } catch(e){}
      }
    } catch(e){}
  }
  await client.end();
}
run().catch(console.error);
