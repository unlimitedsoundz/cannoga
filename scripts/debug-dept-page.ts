import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
    // Check department count
    const { count: deptCount, error: deptError } = await supabase
        .from('Department')
        .select('*', { count: 'exact', head: true });
    
    if (deptError) throw deptError;
    
    // Check if headOfDepartmentId column exists and has data
    const { data: deptsWithHead, error: headError } = await supabase
        .from('Department')
        .select('id, name, headOfDepartmentId')
        .not('headOfDepartmentId', 'is', null);
    
    if (headError) throw headError;
    
    // Try the exact query from the departments page
    const { data: pageData, error: pageError } = await supabase
        .from('Department')
        .select(`
            *,
            school:School(name),
            headOfDepartment:Faculty!headOfDepartmentId(name)
        `)
        .order('name', { ascending: true });
    
    if (pageError) throw pageError;
    
    console.log(`Department count: ${deptCount}`);
    console.log(`Departments with headOfDepartmentId set: ${deptsWithHead?.length || 0}`);
    console.log(`Departments page query returned: ${pageData?.length || 0} records`);
    
    if (pageData && pageData.length > 0) {
        console.log('\nFirst few departments from page query:');
        pageData.slice(0, 3).forEach((dept, idx) => {
            console.log(`${idx + 1}. ${dept.name}`);
            console.log(`   School: ${dept.school?.name || 'none'}`);
            console.log(`   Head of Dept: ${dept.headOfDepartment?.name || 'none'}\n`);
        });
    } else {
        console.log('\nPage query returned empty data!');
        
        // Let's try a simpler query to see what's in Department
        const { data: simpleData, error: simpleError } = await supabase
            .from('Department')
            .select('id, name')
            .limit(5);
        
        if (simpleError) throw simpleError;
        
        console.log('Simple Department query (id, name):');
        simpleData?.forEach((dept, idx) => {
            console.log(`${idx + 1}. ${dept.name} (${dept.id})`);
        });
    }
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});