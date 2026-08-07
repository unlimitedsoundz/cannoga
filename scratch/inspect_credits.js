const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function inspectCredits() {
    const { data: courses, error } = await supabase.from('Course').select('id, title, slug, degreeLevel, credits');
    if (error) {
        console.error('Fetch error:', error);
        return;
    }
    console.log(`Total courses fetched: ${courses?.length}`);
    
    const byDegree = {};
    for (const c of courses ?? []) {
        let level = c.degreeLevel || 'OTHER';
        if (c.title.toLowerCase().includes('bachelor') || c.title.toLowerCase().includes('bsc') || c.title.toLowerCase().includes('ba') || c.title.toLowerCase().includes('beng')) {
            level = 'BACHELOR';
        } else if (c.title.toLowerCase().includes('master') || c.title.toLowerCase().includes('msc') || c.title.toLowerCase().includes('ma') || c.title.toLowerCase().includes('meng') || c.title.toLowerCase().includes('mba')) {
            level = 'MASTER';
        } else if (c.title.toLowerCase().includes('diploma')) {
            level = 'DIPLOMA';
        } else if (c.title.toLowerCase().includes('certificate')) {
            level = 'CERTICACATE';
        }

        if (!byDegree[level]) byDegree[level] = [];
        byDegree[level].push({ slug: c.slug, title: c.title, credits: c.credits, rawDegreeLevel: c.degreeLevel });
    }

    for (const [deg, list] of Object.entries(byDegree)) {
        console.log(`\n=== Degree Level: ${deg} (${list.length} courses) ===`);
        const creditCounts = {};
        for (const item of list) {
            creditCounts[item.credits] = (creditCounts[item.credits] || 0) + 1;
        }
        console.log('Credit distribution:', creditCounts);
        console.log('Sample courses:', list.slice(0, 5));
    }
}

inspectCredits();
