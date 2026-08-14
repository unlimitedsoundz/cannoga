const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const connectionString = 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    
    // Add avatar_url column to profiles
    console.log('Adding avatar_url column to profiles...');
    await client.query(`
      ALTER TABLE public.profiles 
      ADD COLUMN IF NOT EXISTS avatar_url TEXT;
    `);
    console.log('✅ avatar_url column added\n');
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

main();
