require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFaculty() {
    const { data: faculty, error } = await supabase
        .from('Faculty')
        .select('*, school:School(name), department:Department!Faculty_departmentId_fkey(name)');
    
    if (error) {
        console.error('Error fetching faculty:', error);
        return;
    }
    
    console.log(`Total faculty: ${faculty.length}`);
    faculty.forEach(f => {
        console.log(`ID: ${f.id} | Name: ${f.name} | Email: ${f.email} | School: ${f.school?.name} | Dept: ${f.department?.name}`);
    });
}

checkFaculty();
