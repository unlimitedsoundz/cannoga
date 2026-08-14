const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const connectionString = 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    
    console.log('Disabling RLS for page_content table...\n');
    
    await client.query(`ALTER TABLE public.page_content DISABLE ROW LEVEL SECURITY;`);
    console.log('✅ RLS disabled for page_content');
    
    // Drop the policies since they're not needed
    await client.query(`DROP POLICY IF EXISTS "Page content is viewable by everyone" ON public.page_content;`);
    await client.query(`DROP POLICY IF EXISTS "Admins can manage page content" ON public.page_content;`);
    console.log('✅ Policies dropped');
    
    console.log('\n✅ page_content table is now open for read/write');
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

main();
