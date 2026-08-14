const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Sanitizing page_content in Supabase for Scratch Card and numbered requirements...');

  const { data: rows, error } = await supabase
    .from('page_content')
    .select('*');

  if (error) {
    console.error('Error fetching page_content:', error);
    return;
  }

  let updatedCount = 0;
  for (const row of rows) {
    if (!row.content) continue;
    let newContent = row.content;

    // 1. Remove Scratch Card references
    if (/Scratch Card/i.test(newContent)) {
      newContent = newContent
        .replace(/<li>\s*Scratch Card must be included\s*<\/li>/gi, '')
        .replace(/Scratch Card must be included\.?/gi, '')
        .replace(/Scratch Card/gi, '');
    }

    // 2. Clean up numbered items like 1. , 2. , 3. inside requirement blocks if present
    if (row.page_slug && row.page_slug.includes('requirement')) {
      newContent = newContent
        .replace(/<li>\s*1\.\s*/gi, '<li>')
        .replace(/<li>\s*2\.\s*/gi, '<li>')
        .replace(/<li>\s*3\.\s*/gi, '<li>');
    }

    if (newContent !== row.content) {
      const { error: updateErr } = await supabase
        .from('page_content')
        .update({ content: newContent, updated_at: new Date().toISOString() })
        .eq('id', row.id);

      if (updateErr) {
        console.error(`Error updating row ${row.id}:`, updateErr);
      } else {
        console.log(`Updated page_content row ${row.page_slug} / ${row.section_key}`);
        updatedCount++;
      }
    }
  }

  console.log(`Finished updating ${updatedCount} rows in page_content table.`);
}

main().catch(console.error);
