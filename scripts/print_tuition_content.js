const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_slug', 'admissions/tuition');

    if (error) {
        console.error(error);
        return;
    }

    console.log('--- ALL SECTIONS FOR admissions/tuition ---');
    data.forEach(row => {
        console.log(`\nKEY: ${row.section_key}`);
        console.log(`CONTENT:\n${row.content}`);
    });
}

run();
