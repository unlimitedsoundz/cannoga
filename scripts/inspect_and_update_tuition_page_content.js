const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('Fetching page_content records for admissions/tuition...');
    const { data: records, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_slug', 'admissions/tuition');

    if (error) {
        console.error('Error fetching page_content:', error);
        process.exit(1);
    }

    console.log(`Found ${records ? records.length : 0} section(s) in page_content for admissions/tuition:`);

    let updatedCount = 0;

    for (const rec of (records || [])) {
        console.log(`- Section Key: "${rec.section_key}"`);
        let content = rec.content || '';

        // Check if content contains <table>
        if (content.includes('<table')) {
            console.log(`  Found table in section "${rec.section_key}". Updating layout & line breaks...`);

            // Apply responsive table-fixed and word break rules to HTML tables
            let updatedContent = content
                .replace(/min-w-\[\d+px\]/g, '')
                .replace(/whitespace-nowrap/g, 'whitespace-normal break-words')
                .replace(/<table([^>]*)class="([^"]*)"/g, (match, p1, p2) => {
                    let newClass = p2;
                    if (!newClass.includes('table-fixed')) newClass += ' table-fixed';
                    if (!newClass.includes('w-full')) newClass += ' w-full';
                    return `<table${p1}class="${newClass.trim()}"`;
                })
                .replace(/<table(?!([^>]*class=))/g, '<table class="w-full table-fixed border-collapse" ')
                .replace(/<th([^>]*)>/g, (match, p1) => {
                    if (p1.includes('class="')) {
                        return match.replace(/class="([^"]*)"/, 'class="$1 whitespace-normal break-words"');
                    }
                    return `<th${p1} class="whitespace-normal break-words">`;
                })
                .replace(/<td([^>]*)>/g, (match, p1) => {
                    if (p1.includes('class="')) {
                        return match.replace(/class="([^"]*)"/, 'class="$1 whitespace-normal break-words"');
                    }
                    return `<td${p1} class="whitespace-normal break-words">`;
                });

            if (updatedContent !== content) {
                const { error: updateErr } = await supabase
                    .from('page_content')
                    .update({ content: updatedContent })
                    .eq('page_slug', 'admissions/tuition')
                    .eq('section_key', rec.section_key);

                if (updateErr) {
                    console.error(`  ❌ Error updating section "${rec.section_key}":`, updateErr);
                } else {
                    console.log(`  ✅ Section "${rec.section_key}" table content updated in DB!`);
                    updatedCount++;
                }
            } else {
                console.log(`  (No changes needed for section "${rec.section_key}")`);
            }
        }
    }

    console.log(`\nFinished updating DB. Total updated sections: ${updatedCount}`);
    process.exit(0);
}

run().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
