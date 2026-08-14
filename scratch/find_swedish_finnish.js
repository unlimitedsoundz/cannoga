const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findContent() {
    console.log('🔍 Searching page_content table...');
    const { data: rows, error } = await supabase
        .from('page_content')
        .select('id, page_slug, section_key, content');

    if (error) {
        console.error('Fetch error:', error);
        process.exit(1);
    }

    console.log(`Fetched ${rows.length} rows. Searching...`);
    for (const row of rows) {
        if (row.content && (row.content.includes("Canadian- and Swedish-language") || row.content.includes("dedicated page for Canadian") || row.content.includes("Canadian and Swedish"))) {
            console.log(`-----------------------------------------------`);
            console.log(`ID: ${row.id}`);
            console.log(`Slug: ${row.page_slug}`);
            console.log(`Key: ${row.section_key}`);
            console.log(`Content:`);
            console.log(row.content);
            console.log(`-----------------------------------------------`);
        }
    }
}

findContent().catch(console.error);
