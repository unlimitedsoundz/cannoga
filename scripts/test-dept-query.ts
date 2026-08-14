import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
    // Test the exact query used in the departments page
    console.log('Testing departments page query...\n');
    
    try {
        const { data, error } = await supabase
            .from('Department')
            .select(`
                *,
                school:School(name),
                headOfDepartment:Faculty!headofdepartmentid(name)
            `)
            .order('name', { ascending: true });
        
        if (error) {
            console.log('❌ Query with headofdepartmentid failed:', error.message);
        } else {
            console.log(`✅ Query with headofdepartmentid succeeded: ${data?.length || 0} rows`);
            if (data && data.length > 0) {
                console.log('First department:', data[0].name);
                console.log('Head of department:', data[0].headOfDepartment?.name || 'None');
            }
        }
    } catch (err) {
        console.log('Error testing headofdepartmentid query:', err.message);
    }
    
    // Also test the camelCase version to confirm it fails
    try {
        const { data, error } = await supabase
            .from('Department')
            .select(`
                *,
                school:School(name),
                headOfDepartment:Faculty!headOfDepartmentId(name)
            `)
            .order('name', { ascending: true });
        
        if (error) {
            console.log('❌ Query with headOfDepartmentId failed:', error.message);
        } else {
            console.log(`✅ Query with headOfDepartmentId succeeded: ${data?.length || 0} rows`);
        }
    } catch (err) {
        console.log('Error testing headOfDepartmentId query:', err.message);
    }
    
    // Let's also check what's actually in the Department table
    try {
        const { data: deptData } = await supabase
            .from('Department')
            .select('id, name, headofdepartmentid')
            .limit(3);
        
        console.log('\nCurrent Department table samples:');
        deptData?.forEach((dept, index) => {
            console.log(`${index + 1}. ${dept.name}`);
            console.log(`   headofdepartmentid: ${dept.headofdepartmentid || 'null'}`);
        });
    } catch (err) {
        console.log('Error fetching department data:', err.message);
    }
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});