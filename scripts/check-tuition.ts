import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('Fetching current tuition rates...');
    const { data: tuitionRates, error: fetchError } = await supabase.from('tuition_rates').select('*');
    if (fetchError) {
        console.error('Error fetching tuition rates:', fetchError);
        return;
    }
    console.log(`Found ${tuitionRates?.length || 0} tuition rate records`);
    console.log(tuitionRates);

    console.log('\nFetching courses with credits...');
    const { data: courses, error: courseError } = await supabase.from('Course').select('id, title, credits, degreeLevel');
    if (courseError) {
        console.error('Error fetching courses:', courseError);
        return;
    }
    console.log(`Found ${courses?.length || 0} courses`);
    console.log(courses?.slice(0, 5));
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});