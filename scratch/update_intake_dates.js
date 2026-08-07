const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const replacements = [
    [/Application period: 1 Dec 2025[^<]*/g, 'September intake: apply October\u2013February (best: Oct\u2013Dec). January intake: apply June\u2013September (best: Jun\u2013Aug).'],
    [/Admission period: 1 Dec 2025[^<'"]*/g, 'Two intakes: September (apply Oct\u2013Feb, best Oct\u2013Dec) and January (apply Jun\u2013Sep, best Jun\u2013Aug).'],
    [/1 Dec 2025\b/g, 'October (Sept intake) / June (Jan intake)'],
    [/23 April 2026\b/g, 'February (Sept intake) / September (Jan intake)'],
    [/16th of April 2026/g, 'rolling deadlines (see below)'],
    [/Fill the Application Form Deadline: [^<]*/g, 'Submit documents with your application. Late documents may delay your decision. '],
    [/by 13 May or 14 August 2026/g, 'within 14 days of your admission decision'],
    [/by 14 August 2026/g, 'before your intake start date'],
    [/by 21 August 2026/g, 'within 14 days of admission decision'],
    [/19 June \/ 21 Aug[^<]*/g, 'Within 14 days of admission decision'],
    [/Recommended deadline: 23 April 2026[^<]*/g, 'September intake: apply Oct\u2013Feb. January intake: apply Jun\u2013Sep.'],
    [/deadline.*?14 August 2026[^<]*/gi, 'deadline: within 14 days of admission decision'],
];

async function run() {
    const { data: rows, error } = await supabase.from('page_content').select('id, page_slug, section_key, content');
    if (error) { console.error('Fetch error:', error); process.exit(1); }
    let updated = 0, skipped = 0;
    for (const row of rows) {
        if (!row.content) { skipped++; continue; }
        let c = row.content;
        for (const [p, r] of replacements) c = c.replace(p, r);
        if (c === row.content) { skipped++; continue; }
        const { error: e } = await supabase.from('page_content').update({ content: c, updated_at: new Date().toISOString() }).eq('id', row.id);
        if (e) console.error('  \u274c', row.page_slug, '/', row.section_key, e.message);
        else { console.log('  \u2705', row.page_slug, '/', row.section_key); updated++; }
    }
    console.log('\nDone:', updated, 'updated,', skipped, 'unchanged.');
}
run().catch(console.error);
