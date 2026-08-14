const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const connectionString = 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';
const schemaPath = path.join(__dirname, 'schema.sql');

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('Applying schema.sql...');
    await client.query(schemaSql);
    console.log('schema.sql applied.');
    const systemSettingsSql = `
      CREATE TABLE IF NOT EXISTS "system_settings" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "key" TEXT UNIQUE NOT NULL,
        "value" TEXT NOT NULL,
        "description" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Creating system_settings table...');
    await client.query(systemSettingsSql);
    console.log('system_settings created successfully.');
  } catch (error) {
    console.error('Error applying schema:', error.message || error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
