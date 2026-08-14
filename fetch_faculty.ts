
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Try loading envs
dotenv.config({ path: '.env.local' });
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    dotenv.config({ path: '.env' });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. URL:', supabaseUrl, 'Key present:', !!supabaseKey);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    // Get all departments and their heads
    const { data: departments, error: deptError } = await supabase
        .from('Department')
        .select(`
            id,
            name,
            headOfDepartmentId,
            head:Faculty!headOfDepartmentId(id, name, role, imageUrl)
        `);

    if (deptError) {
        console.error('Error fetching departments:', deptError);
        return;
    }

    // Also get deans/other faculty just in case
    const { data: faculty, error: facError } = await supabase
        .from('Faculty')
        .select('id, name, role, schoolId, imageUrl');

    if (facError) {
        console.error('Error fetching faculty:', facError);
        return;
    }

    const output = {
        departments,
        faculty
    };

    fs.writeFileSync('faculty_data.json', JSON.stringify(output, null, 2));
    console.log('Faculty data saved to faculty_data.json');
}

run();
