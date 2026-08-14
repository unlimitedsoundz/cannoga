require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkFaculty() {
    const { data, error } = await supabase
        .from('Faculty')
        .select('id, name, role, email, schoolId, departmentId')
        .or('name.ilike.%Emily Campbell%,email.ilike.%emily.campbell%');

    if (error) {
        console.error('Error:', error.message);
        return;
    }

    console.log(`Found ${data?.length || 0} faculty member(s) matching Emily Campbell:`);
    (data || []).forEach((f) => {
        console.log(`  - ${f.name} (${f.role}) - ${f.email}`);
    });
}

checkFaculty();
