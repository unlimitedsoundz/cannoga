require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDepts() {
    const { data: depts, error: deptsError } = await supabase
        .from('Department')
        .select('id, name, slug, schoolId');
        
    if (deptsError) {
        console.error('Error fetching depts:', deptsError);
        return;
    }

    const { data: faculty, error: facultyError } = await supabase
        .from('Faculty')
        .select('departmentId');

    if (facultyError) {
        console.error('Error fetching faculty:', facultyError);
        return;
    }

    const deptFacultyCounts = {};
    depts.forEach(d => {
        deptFacultyCounts[d.id] = 0;
    });

    faculty.forEach(f => {
        if (f.departmentId && deptFacultyCounts[f.departmentId] !== undefined) {
            deptFacultyCounts[f.departmentId]++;
        }
    });

    console.log("Departments without faculty:");
    depts.forEach(d => {
        if (deptFacultyCounts[d.id] === 0) {
            console.log(`- Dept: ${d.name} (${d.slug}) | School ID: ${d.schoolId} | Dept ID: ${d.id}`);
        }
    });
}

checkDepts();
