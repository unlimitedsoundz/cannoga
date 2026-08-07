import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    // Check Course table columns
    console.log('Checking Course table structure...');
    const { data: courseSample, error: courseError } = await supabase.from('Course').select('*').limit(1);
    if (courseError) {
        console.error('Error:', courseError);
    } else if (courseSample && courseSample.length > 0) {
        console.log('Course columns:', Object.keys(courseSample[0]));
    }

    // Search for ECTS references in courses
    console.log('\nSearching for ECTS in course descriptions...');
    const { data: allCourses } = await supabase.from('Course').select('id, title, description');
    const ectsMatches = (allCourses || []).filter(c => 
        c.description && c.description.toLowerCase().includes('ects')
    );
    console.log(`Found ${ectsMatches.length} courses with ECTS in description`);
    ectsMatches.slice(0, 5).forEach(c => {
        console.log(`  - ${c.title}: ${c.description?.slice(0, 100)}...`);
    });

    // Check if credits column exists in course
    const courseWithCredits = (allCourses || []).filter(c => 'credits' in c);
    console.log(`\nCourses with credits property: ${courseWithCredits.length}`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});