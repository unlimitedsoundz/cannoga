import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
    // Check if we can select the column using the exact case from the database
    try {
        const { data, error } = await supabase
            .from('Department')
            .select('headofdepartmentid')
            .limit(1);
        
        if (!error) {
            console.log('✅ Can select headofdepartmentid (lowercase)');
            console.log(`   Sample value: ${data?.[0]?.headofdepartmentid || 'null'}`);
        } else {
            console.log('❌ Cannot select headofdepartmentid:', error.message);
        }
    } catch (err) {
        console.log('Error testing headofdepartmentid:', err.message);
    }
    
    // Try the camelCase version
    try {
        const { data, error } = await supabase
            .from('Department')
            .select('headOfDepartmentId')
            .limit(1);
        
        if (!error) {
            console.log('✅ Can select headOfDepartmentId (camelCase)');
            console.log(`   Sample value: ${data?.[0]?.headOfDepartmentId || 'null'}`);
        } else {
            console.log('❌ Cannot select headOfDepartmentId:', error.message);
        }
    } catch (err) {
        console.log('Error testing headOfDepartmentId:', err.message);
    }
    
    // Let's also check what the actual column name is in the information schema
    // We'll do this by trying to insert a value and see what happens
    // Actually, let's just query the information schema directly
    
    try {
        const { data: columns } = await supabase
            .from('information_schema.columns')
            .select('column_name')
            .eq('table_name', 'Department')
            .eq('table_schema', 'public')
            .eq('column_name', 'headofdepartmentid');
        
        if (columns?.length > 0) {
            console.log('✅ headofdepartmentid found in information_schema.columns');
        } else {
            console.log('❌ headofdepartmentid NOT found in information_schema.columns');
        }
        
        const { data: columns2 } = await supabase
            .from('information_schema.columns')
            .select('column_name')
            .eq('table_name', 'Department')
            .eq('table_schema', 'public')
            .eq('column_name', 'headOfDepartmentId');
        
        if (columns2?.length > 0) {
            console.log('✅ headOfDepartmentId found in information_schema.columns');
        } else {
            console.log('❌ headOfDepartmentId NOT found in information_schema.columns');
        }
    } catch (err) {
        console.log('Error checking information_schema:', err.message);
    }
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});