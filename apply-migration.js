const { Client } = require('pg');

async function applyMigration() {
  const configs = [
    { connectionString: 'postgresql://postgres:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?options=--project-ref%3Dlbkrzyqpdgqtqbodkcyi' },
    { connectionString: 'postgresql://postgres:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:5432/postgres?options=--project-ref%3Dlbkrzyqpdgqtqbodkcyi' },
    { connectionString: 'postgresql://postgres:Guiliababy21@db.lbkrzyqpdgqtqbodkcyi.supabase.co:5432/postgres?options=--project-ref%3Dlbkrzyqpdgqtqbodkcyi' },
  ];

  for (const config of configs) {
    const client = new Client(config);

    try {
      await client.connect();
      console.log(`Connected!`);

      const fs = require('fs');
      const sql = fs.readFileSync('D:/cannogauniversity/src/db/13_student_payment_status.sql', 'utf8');
      
      await client.query(sql);
      console.log('Migration applied successfully!');
      await client.end();
      return;
    } catch (err) {
      console.log(`Failed: ${err.message}`);
    }
  }

  console.log('All connection attempts failed');
  process.exit(1);
}

applyMigration();
