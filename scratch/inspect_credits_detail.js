const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function inspectDetail() {
    const { data: courses } = await supabase.from('Course').select('id, title, slug, degreeLevel, credits, duration');
    console.log('Anomalous or non-standard credit courses:');
    
    for (const c of courses ?? []) {
        const titleLower = c.title.toLowerCase();
        let expected = 180;
        
        if (titleLower.includes('beng') || titleLower.includes('bachelor of engineering')) {
            expected = 240;
        } else if (titleLower.includes('bachelor') || titleLower.includes('bsc') || titleLower.includes('ba') || titleLower.includes('bba')) {
            expected = 180;
        } else if (titleLower.includes('master') || titleLower.includes('msc') || titleLower.includes('ma') || titleLower.includes('meng') || titleLower.includes('mba')) {
            expected = titleLower.includes('mba') ? 90 : 120;
        } else if (c.rawDegreeLevel === 'DIPLOMA' || titleLower.includes('diploma') || c.slug.endsWith('-dip')) {
            expected = 60;
        } else if (c.rawDegreeLevel === 'CERTICACATE' || titleLower.includes('certificate') || c.slug.endsWith('-cert')) {
            expected = 30;
        }

        if (c.credits !== expected) {
            console.log(`[${c.slug}] "${c.title}" | Level: ${c.degreeLevel} | Current: ${c.credits} | Expected ECTS: ${expected}`);
        }
    }
}

inspectDetail();
