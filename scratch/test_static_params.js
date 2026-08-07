const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function testStaticParams() {
    const { data: depts, error } = await supabase
        .from('Department')
        .select('slug, schoolId, school:School(slug)');

    console.log('Error if any:', error);
    console.log('Raw depts count:', depts?.length);
    console.log('Sample raw dept:', JSON.stringify(depts?.slice(0, 3), null, 2));

    const { data: schools } = await supabase.from('School').select('id, slug');
    const schoolMap = new Map(schools?.map(s => [s.id, s.slug]));

    const params = [];
    for (const d of depts ?? []) {
        let schoolSlug = Array.isArray(d.school) ? d.school[0]?.slug : d.school?.slug;
        if (!schoolSlug && d.schoolId) {
            schoolSlug = schoolMap.get(d.schoolId);
        }
        if (schoolSlug && d.slug) {
            params.push({ slug: schoolSlug, dept_slug: d.slug });
        }
    }

    console.log('Generated params count:', params.length);
    console.log('Sample generated params:', params.slice(0, 5));
}

testStaticParams();
