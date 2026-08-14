
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing environment variables.');
    process.exit(1);
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
    console.log('🧹 Starting course cleanup...');

    const coursesToDelete = [
        'Bachelor of Eco-Design',
        'Circular Economy Business Models',
        'Solar Energy Systems Engineering',
        'Sustainable Urban Planning'
    ];

    try {
        for (const title of coursesToDelete) {
            console.log(`Searching for: ${title}`);
            const { data: courses, error: fetchError } = await supabase
                .from('Course')
                .select('id, title')
                .eq('title', title);

            if (fetchError) {
                console.error(`Error fetching ${title}:`, fetchError);
                continue;
            }

            if (courses && courses.length > 0) {
                for (const course of courses) {
                    console.log(`Deleting: ${course.title} (${course.id})`);
                    // First delete related subjects
                    const { error: subjectError } = await supabase
                        .from('Subject')
                        .delete()
                        .eq('courseId', course.id);

                    if (subjectError) console.error(`Error deleting subjects for ${course.title}:`, subjectError);

                    // Then delete the course
                    const { error: deleteError } = await supabase
                        .from('Course')
                        .delete()
                        .eq('id', course.id);

                    if (deleteError) {
                        console.error(`Failed to delete ${course.title}:`, deleteError);
                    } else {
                        console.log(`✅ Deleted ${course.title}`);
                    }
                }
            } else {
                console.log(`ℹ️ Course not found: ${title}`);
            }
        }
    } catch (e) {
        console.error('❌ Cleanup failed:', e);
    }
}

main();
