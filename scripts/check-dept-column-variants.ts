import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
    // Try to see what columns actually exist by attempting to select common variations
    const columnVariations = [
        'headOfDepartmentId',
        'headofdepartmentid',
        'HEADOFDEPARTMENTID',
        'HeadOfDepartmentId'
    ];
    
    for (const columnName of columnVariations) {
        try {
            const { data, error } = await supabase
                .from('Department')
                .select(`${columnName}`)
                .limit(1);
            
            if (!error && data !== null) {
                console.log(`SUCCESS: Column '${columnName}' exists and is accessible`);
                console.log(`Sample value: ${data?.[0]?.[columnName] || 'null'}`);
                return;
            }
        } catch (err) {
            // Continue to next variation
        }
    }
    
    console.log('None of the common column name variations worked');
    
    // Let's check the table structure another way
    try {
        // Try inserting a null value to see if the column exists
        // We'll do this in a transaction that we roll back, but since we can't do transactions easily,
        // let's just check if we can at least SELECT the column in a different way
        
        // Actually, let me just describe the table by trying to insert and seeing what fails
        console.log('\nTrying to determine actual column name...');
        
    } catch (err) {
        console.error('Error in column detection:', err.message);
    }
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});