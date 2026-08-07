const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findContent() {
    const { data: rows, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_slug', 'admissions/master')
        .eq('section_key', 'hero_subtitle');

    if (error) {
        console.error('Error:', error);
        process.exit(1);
    }

    console.log(`Found ${rows.length} rows`);
    if (rows.length > 0) {
        console.log(rows[0]);
    }
}

findContent().catch(console.error);
