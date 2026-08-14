
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectStructure() {
    console.log('Fetching Schools...');
    const { data: schools, error: schoolError } = await supabase.from('School').select('id, name, slug');
    if (schoolError) throw schoolError;

    console.log('\n--- SCHOOLS ---');
    schools.forEach(s => console.log(`${s.name} (${s.slug}) - ID: ${s.id}`));

    console.log('\nFetching Departments...');
    const { data: depts, error: deptError } = await supabase.from('Department').select('id, name, slug, schoolId');
    if (deptError) throw deptError;

    console.log('\n--- DEPARTMENTS ---');
    depts.forEach(d => {
        const school = schools.find(s => s.id === d.schoolId);
        console.log(`${d.name} (${d.slug}) [School: ${school?.name || 'Unknown'}] - ID: ${d.id}`);
    });
}

inspectStructure().catch(console.error);
