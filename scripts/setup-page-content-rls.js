const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const connectionString = 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    
    console.log('Setting up RLS for page_content table...\n');
    
    // Enable RLS
    await client.query(`ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;`);
    console.log('✅ RLS enabled');
    
    // Drop existing policies if any
    await client.query(`DROP POLICY IF EXISTS "Page content is viewable by everyone" ON public.page_content;`);
    await client.query(`DROP POLICY IF EXISTS "Admins can manage page content" ON public.page_content;`);
    
    // Create policies
    await client.query(`
      CREATE POLICY "Page content is viewable by everyone" 
      ON public.page_content 
      FOR SELECT 
      USING (true);
    `);
    console.log('✅ Read policy created');
    
    await client.query(`
      CREATE POLICY "Admins can manage page content" 
      ON public.page_content 
      FOR ALL 
      TO authenticated 
      USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'))
      WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'));
    `);
    console.log('✅ Admin write policy created');
    
    console.log('\n✅ RLS policies set up successfully!');
    
    // Test the policy
    console.log('\nTesting write with anon key...');
    const { createClient } = require('@supabase/supabase-js');
    const dotenv = require('dotenv');
    dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    // First check if there's an admin user
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'ADMIN')
      .limit(1);
    
    if (adminProfile && adminProfile.length > 0) {
      console.log('Found admin profile, testing write...');
      const { error } = await supabase
        .from('page_content')
        .upsert({
          page_slug: 'test-page',
          section_key: 'test-section',
          content: '<p>Test content</p>'
        }, { onConflict: 'page_slug,section_key' });
      
      if (error) {
        console.log('Write test failed:', error.message);
      } else {
        console.log('Write test succeeded!');
      }
    } else {
      console.log('No admin profile found. Create an admin user first.');
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

main();
