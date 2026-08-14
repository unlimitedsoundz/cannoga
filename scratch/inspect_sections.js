const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(url, key);

async function inspect() {
    const { data: courses, error } = await supabase.from('Course').select('id, title, slug, sections');
    if (error) {
        console.error('Error fetching courses:', error);
        return;
    }

    console.log(`Total courses fetched: ${courses.length}`);
    let problemCount = 0;
    for (const c of courses) {
        if (!c.sections) continue;
        let jsonStr = typeof c.sections === 'string' ? c.sections : JSON.stringify(c.sections);
        if (jsonStr.includes('\\') || jsonStr.includes('\"\\\"')) {
            problemCount++;
            console.log(`\n--- Course [${c.slug}]: ${c.title} ---`);
            console.log('Raw sections type:', typeof c.sections);
            console.log('Raw sections sample:', jsonStr.substring(0, 300));
        }
    }
    console.log(`Total courses with slashes/escaping issues: ${problemCount}`);
}

inspect();
