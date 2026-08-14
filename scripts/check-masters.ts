import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    // Check for MASTER courses
    console.log('Checking for MASTER courses...');
    const { data: masterCourses } = await supabase.from('Course').select('id, title, degreeLevel').eq('degreeLevel', 'MASTER');
    console.log(`Found ${masterCourses?.length || 0} MASTER courses`);
    if (masterCourses && masterCourses.length > 0) {
        console.log('MASTER courses:', masterCourses);
    }

    // Check all degree levels
    console.log('\nAll degree levels in database:');
    const { data: allCourses } = await supabase.from('Course').select('degreeLevel');
    const degreeCounts: Record<string, number> = {};
    for (const c of allCourses || []) {
        degreeCounts[c.degreeLevel] = (degreeCounts[c.degreeLevel] || 0) + 1;
    }
    console.log(degreeCounts);

    // Check existing tuition rate fields
    console.log('\nExisting tuition rate fields:');
    const { data: tuitionRates } = await supabase.from('tuition_rates').select('degree_level, field');
    const fields = new Set((tuitionRates || []).map(t => t.field));
    console.log([...fields].sort());
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});