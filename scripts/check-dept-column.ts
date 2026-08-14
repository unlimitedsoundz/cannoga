import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
    // Check Department table structure
    try {
        // This will fail if we can't even select from the table
        const { data, error } = await supabase
            .from('Department')
            .select('id')
            .limit(1);
        
        if (error) throw error;
        
        // Try to select the headOfDepartmentId column specifically
        const { data: headData, error: headError } = await supabase
            .from('Department')
            .select('headOfDepartmentId')
            .limit(1);
        
        if (headError) {
            console.log('ERROR: headOfDepartmentId column does not exist or is not accessible');
            console.log('Error details:', headError);
        } else {
            console.log('SUCCESS: headOfDepartmentId column exists');
            console.log(`Sample value: ${headData?.[0]?.headOfDepartmentId || 'null'}`);
        }
        
        // Get all column names
        const { data: columns, error: colsError } = await supabase
            .from('Department')
            .select('*')
            .limit(0);
        
        // This approach won't work for getting column names, let me try a different way
        // Let me check the information schema via raw SQL if possible
        
    } catch (err) {
        console.error('Error checking Department table:', err.message);
    }
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});