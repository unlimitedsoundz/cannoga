import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDbState() {
    console.log('Checking DegreeLevel enum values...\n');
    
    // Try to query the enum values using a raw query approach
    // We'll try inserting with each possible value
    const testValues = ['BACHELOR', 'MASTER', 'DIPLOMA', 'CERTIFICATE'];
    
    for (const val of testValues) {
        try {
            const { error } = await supabase.from('Course').insert({
                title: `TEST-${val}`,
                slug: `test-${val.toLowerCase()}`,
                degreeLevel: val as any,
                duration: '1 Year',
                schoolId: 'test',
                departmentId: 'test',
                description: 'test',
                entryRequirements: 'test',
                careerPaths: 'test',
            });
            
            if (error) {
                console.log(`❌ ${val}: ${error.message}`);
                // Clean up if it was created
                await supabase.from('Course').delete().eq('slug', `test-${val.toLowerCase()}`);
            } else {
                console.log(`✅ ${val}: accepted`);
                // Clean up
                await supabase.from('Course').delete().eq('slug', `test-${val.toLowerCase()}`);
            }
        } catch (err) {
            console.log(`❌ ${val}: exception - ${err}`);
        }
    }
    
    console.log('\nChecking tuition_rates table...');
    try {
        const { data, error } = await supabase.from('tuition_rates').select('*').limit(1);
        if (error) {
            console.log(`❌ tuition_rates: ${error.message}`);
        } else {
            console.log(`✅ tuition_rates: accessible, ${data.length} rows`);
        }
    } catch (err) {
        console.log(`❌ tuition_rates: exception - ${err}`);
    }
}

checkDbState();