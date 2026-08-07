const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findContent() {
    console.log('🔍 Querying page_content for page_slug = admissions/master ...');
    const { data: rows, error } = await supabase
        .from('page_content')
        .select('*')
        .or('page_slug.eq.admissions/master,page_slug.eq.admissions-master');

    if (error) {
        console.error('Query error:', error);
        process.exit(1);
    }

    console.log(`Found ${rows.length} rows:`);
    rows.forEach(row => {
        console.log(`ID: ${row.id}, Page: ${row.page_slug}, Section: ${row.section_key}`);
        console.log(`Content:\n${row.content}`);
        console.log('--------------------------------------------------');
    });
}

findContent().catch(console.error);
