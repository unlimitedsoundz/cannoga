import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
    // Check how many departments now have heads assigned
    const { count: deptCount, error: deptError } = await supabase
        .from('Department')
        .select('*', { count: 'exact', head: true });
    
    if (deptError) throw deptError;
    
    const { data: deptsWithHead, error: headError } = await supabase
        .from('Department')
        .select('id, name, headofdepartmentid, Faculty(name)')
        .not('headofdepartmentid', 'is', null);
    
    if (headError) throw headError;
    
    console.log(`Total departments: ${deptCount}`);
    console.log(`Departments with head assigned: ${deptsWithHead?.length || 0}`);
    console.log(`Departments without head: ${deptCount - (deptsWithHead?.length || 0)}\n`);
    
    if (deptsWithHead && deptsWithHead.length > 0) {
        console.log('First 10 department heads:');
        deptsWithHead.slice(0, 10).forEach((dept, index) => {
            console.log(`${index + 1}. ${dept.name}`);
            console.log(`   Head: ${dept.Faculty?.name || 'None'}`);
            console.log('');
        });
    }
    
    // Also test the exact query from the departments page
    const { data: pageData, error: pageError } = await supabase
        .from('Department')
        .select(`
            *,
            school:School(name),
            headOfDepartment:Faculty!headofdepartmentid(name)
        `)
        .order('name', { ascending: true });
    
    if (pageError) throw pageError;
    
    console.log(`Departments page query returned: ${pageData?.length || 0} rows`);
    if (pageData && pageData.length > 0) {
        console.log('\nFirst 5 departments from page query:');
        pageData.slice(0, 5).forEach((dept, index) => {
            console.log(`${index + 1}. ${dept.name}`);
            console.log(`   School: ${dept.school?.name || 'None'}`);
            console.log(`   Head of Department: ${dept.headOfDepartment?.name || 'None (vacant)'}`);
            console.log('');
        });
    }
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});