require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDept() {
    const { data: faculty } = await supabase
        .from('Faculty')
        .select('id, name')
        .ilike('name', '%Emily Campbell%');

    if (!faculty?.length) {
        console.log('Faculty not found');
        return;
    }

    const facultyId = faculty[0].id;

    const { data: depts } = await supabase
        .from('Department')
        .select('id, name, slug, schoolId')
        .eq('headOfDepartmentId', facultyId);

    console.log(`Dr. Emily Campbell is head of department for ${depts?.length || 0} department(s):`);
    (depts || []).forEach((d) => {
        console.log(`  - ${d.name} (${d.slug})`);
    });
}

checkDept();
