import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    // Check tuition rates
    console.log('Tuition rates:');
    const { data: tuitionRates } = await supabase.from('tuition_rates').select('*').order('degree_level, field');
    console.table(tuitionRates);

    // Check courses with credits
    console.log('\nSample courses with credits:');
    const { data: courses } = await supabase.from('Course').select('id, title, degreeLevel, credits').limit(10);
    console.table(courses);

    // Check for remaining ECTS references
    console.log('\nChecking for remaining ECTS references...');
    const { data: allCourses } = await supabase.from('Course').select('id, title, description');
    const ectsMatches = (allCourses || []).filter(c => 
        c.description && c.description.toLowerCase().includes('ects')
    );
    console.log(`Found ${ectsMatches.length} courses with ECTS references:`);
    ectsMatches.forEach(c => {
        console.log(`\n  ${c.title}:`);
        console.log(`  ${c.description?.slice(0, 200)}...`);
    });
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});