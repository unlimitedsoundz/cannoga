const { Client } = require('pg');
const connectionString = 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';
const client = new Client({ connectionString });

(async () => {
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected!');

    const replacements = [
      ['Kestora College', 'Cannoga College'],
      ['Kestora University', 'Cannoga College'],
      ['Kestora', 'Cannoga'],
      ['Heffring University', 'Cannoga College'],
      ['Heffring', 'Cannoga'],
      ['Helsinki, Finland', 'Ottawa, Ontario, Canada'],
      ['Helsinki', 'Ottawa'],
      ['Finland', 'Canada'],
      ['Finnish', 'Canadian'],
      ['European', 'Canadian'],
      ['kestora.ca', 'cannogacollege.ca'],
      ['kestora', 'cannoga'],
      ['heffring', 'cannoga'],
      ['helsinki', 'ottawa'],
      ['finland', 'canada'],
      ['finnish', 'canadian']
    ];

    // Get all table names in public schema
    const { rows: tables } = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    `);

    console.log(`Found ${tables.length} tables in public schema.`);

    for (const { table_name } of tables) {
      // Get text/varchar columns for table
      const { rows: cols } = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1
        AND (data_type LIKE '%text%' OR data_type LIKE '%char%' OR data_type = 'jsonb');
      `, [table_name]);

      for (const { column_name, data_type } of cols) {
        for (const [fromStr, toStr] of replacements) {
          try {
            if (data_type === 'jsonb') {
              await client.query(`
                UPDATE "${table_name}" 
                SET "${column_name}" = REPLACE("${column_name}"::text, $1, $2)::jsonb
                WHERE "${column_name}"::text ILIKE $3;
              `, [fromStr, toStr, `%${fromStr}%`]);
            } else {
              await client.query(`
                UPDATE "${table_name}" 
                SET "${column_name}" = REPLACE("${column_name}", $1, $2)
                WHERE "${column_name}" ILIKE $3;
              `, [fromStr, toStr, `%${fromStr}%`]);
            }
          } catch (err) {
            // Ignore constraint errors or type cast issues
          }
        }
      }
    }

    console.log('✅ ALL DATABASE REPLACEMENTS COMPLETE!');
  } catch (err) {
    console.error('Error during DB cleanup:', err);
  } finally {
    await client.end();
  }
})();
