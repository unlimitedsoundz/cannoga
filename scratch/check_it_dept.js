const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function checkItDept() {
    const { data: depts } = await supabase.from('Department').select('id, name, slug, schoolId, school:School(slug, name)');
    
    console.log('Searching for it-dept or technology department:');
    for (const d of depts ?? []) {
        if (d.slug.includes('it') || d.slug.includes('tech') || d.name.toLowerCase().includes('information') || d.name.toLowerCase().includes('tech')) {
            console.log(`[${d.slug}] "${d.name}" -> School: ${d.school?.slug} (${d.school?.name})`);
        }
    }

    console.log('\nAll department slugs:');
    console.log(depts?.map(d => ({ deptSlug: d.slug, schoolSlug: d.school?.slug })));
}

checkItDept();
