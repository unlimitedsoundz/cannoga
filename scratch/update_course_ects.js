const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

function getCanadianEcts(course) {
    const titleLower = course.title.toLowerCase();
    const slug = (course.slug || '').toLowerCase();
    const level = (course.degreeLevel || '').toUpperCase();

    // 1. Certificates
    if (level === 'CERTICACATE' || slug.endsWith('-cert') || titleLower.includes('certificate')) {
        return 30;
    }

    // 2. Diplomas
    if (level === 'DIPLOMA' || slug.endsWith('-dip') || titleLower.includes('diploma')) {
        return 60;
    }

    // 3. Bachelors
    if (level === 'BACHELOR' || titleLower.includes('bachelor') || titleLower.includes('bsc') || titleLower.includes('ba') || titleLower.includes('bba') || titleLower.includes('beng')) {
        if (titleLower.includes('beng') || (titleLower.includes('bachelor of engineering') && !titleLower.includes('master'))) {
            return 240;
        }
        return 180;
    }

    // 4. Masters
    if (level === 'MASTER' || titleLower.includes('master') || titleLower.includes('msc') || titleLower.includes('ma') || titleLower.includes('meng') || titleLower.includes('mba')) {
        if (titleLower.includes('mba')) {
            return 90;
        }
        return 120;
    }

    // Default fallback
    return course.credits || 180;
}

async function updateEcts() {
    const { data: courses, error } = await supabase.from('Course').select('*');
    if (error) {
        console.error('Fetch error:', error);
        return;
    }

    console.log(`Fetched ${courses.length} courses. Updating ECTS credits to Canadian standards...`);
    let updatedCount = 0;

    for (const c of courses) {
        const ects = getCanadianEcts(c);
        if (c.credits !== ects) {
            console.log(`Updating [${c.slug}] "${c.title}": ${c.credits} -> ${ects} ECTS`);
            const { error: updateErr } = await supabase
                .from('Course')
                .update({ credits: ects })
                .eq('id', c.id);

            if (updateErr) {
                console.error(`Failed to update ${c.slug}:`, updateErr);
            } else {
                updatedCount++;
            }
        }
    }

    console.log(`\nSuccessfully updated ${updatedCount} courses with Canadian ECTS credits.`);
}

updateEcts();
