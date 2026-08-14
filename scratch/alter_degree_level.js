const { Client } = require('pg');

const connectionString = "postgresql://postgres.mrqzlmkdhzwvbpljikjz:Guiliababy21%23@aws-1-eu-west-3.pooler.supabase.com:5432/postgres";

const client = new Client({
  connectionString
});

async function main() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database.');
    
    // We run it inside try/catch blocks for each value to handle if they already exist
    try {
      await client.query(`ALTER TYPE "DegreeLevel" ADD VALUE 'CERTICACATE'`);
      console.log('Added CERTICACATE to DegreeLevel enum.');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('CERTICACATE already exists in DegreeLevel enum.');
      } else {
        throw err;
      }
    }

    try {
      await client.query(`ALTER TYPE "DegreeLevel" ADD VALUE 'DIPLOMA'`);
      console.log('Added DIPLOMA to DegreeLevel enum.');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('DIPLOMA already exists in DegreeLevel enum.');
      } else {
        throw err;
      }
    }

    console.log('✅ Enum update completed successfully.');
  } catch (err) {
    console.error('❌ Error updating enum:', err.message);
  } finally {
    await client.end();
  }
}

main();
