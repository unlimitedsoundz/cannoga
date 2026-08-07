const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function checkEmptyParams() {
    const { data: depts } = await supabase.from('Department').select('id, name, slug, schoolId');
    const { data: schools } = await supabase.from('School').select('id, slug');

    console.log(`Total departments: ${depts?.length}`);
    console.log(`Total schools: ${schools?.length}`);

    const schoolMap = new Map((schools ?? []).map(s => [s.id, s.slug]));

    const missing = [];
    const valid = [];

    for (const d of depts ?? []) {
        const schoolSlug = schoolMap.get(d.schoolId);
        if (!schoolSlug || !d.slug) {
            missing.push({ deptId: d.id, name: d.name, deptSlug: d.slug, schoolId: d.schoolId, schoolSlug });
        } else {
            valid.push({ slug: schoolSlug, dept_slug: d.slug });
        }
    }

    console.log('Missing/invalid department params:', missing);
    console.log('Valid params count:', valid.length);
}

checkEmptyParams();
