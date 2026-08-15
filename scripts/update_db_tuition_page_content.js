const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('Pushing updated tuition page_content to Supabase DB...');
    
    const sections = [
        {
            page_slug: 'admissions/tuition',
            section_key: 'costs_intro_content',
            content: `<p class="text-lg leading-relaxed mb-6">Cannoga College's tuition rates are highly competitive compared to other major colleges across Canada and significantly more affordable than university fees. Postsecondary education in Canada offers excellent value when compared to other English-speaking destinations like the United States or United Kingdom. Your overall expenses will depend on your selected program, housing preferences, and personal lifestyle. All tuition payments include comprehensive health insurance coverage.</p>`
        },
        {
            page_slug: 'admissions/tuition',
            section_key: 'fee_structure_content',
            content: `<p class="text-lg leading-relaxed mb-6">Tuition fees at Cannoga College depend on your degree level, field of study, and start date. The exact amount for your programme is always listed in your personal admission letter.</p>`
        }
    ];

    for (const item of sections) {
        const { error } = await supabase
            .from('page_content')
            .upsert(item, { onConflict: 'page_slug,section_key' });
        
        if (error) {
            console.error(`Error updating ${item.page_slug} / ${item.section_key}:`, error);
        } else {
            console.log(`✅ Successfully updated ${item.page_slug} / ${item.section_key} in DB!`);
        }
    }
    process.exit(0);
}

run().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
