
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDB() {
    console.log('Checking Schools...');
    const { data: schools, error: schoolError } = await supabase.from('School').select('id, name, slug');
    if (schoolError) console.error('Error fetching schools:', schoolError);

    console.log('Checking Departments...');
    const { data: depts, error: deptError } = await supabase.from('Department').select('id, name, slug, schoolId');
    if (deptError) console.error('Error fetching departments:', deptError);

    const displayDepts = depts?.map(d => {
        const school = schools?.find(s => s.id === d.schoolId);
        return {
            name: d.name,
            slug: d.slug,
            school: school ? school.slug : 'UNKNOWN_SCHOOL'
        };
    });
    console.log('DEPARTMENTS_JSON_START');
    console.log(JSON.stringify(displayDepts, null, 2));
    console.log('DEPARTMENTS_JSON_END');

    console.log('SCHOOLS_JSON_START');
    console.log(JSON.stringify(schools, null, 2));
    console.log('SCHOOLS_JSON_END');
}

checkDB();
