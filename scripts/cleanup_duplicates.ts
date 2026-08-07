
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
    console.log('🧹 Cleaning up duplicate courses...');

    // Correct course ID (accounting-and-finance-bsc)
    const correctId = 'e15ef57b-2f95-42a6-b766-aeef883af9d2';
    // Duplicate course ID (accounting-finance slug)
    const duplicateId = '96d7c08a-90ef-4d41-9017-a6315b992369';

    console.log('Migrating applications...');
    const { error: moveError } = await supabase
        .from('applications')
        .update({ course_id: correctId })
        .eq('course_id', duplicateId);

    if (moveError) {
        console.error('Error migrating applications:', moveError);
    } else {
        console.log('✅ Migrated applications to correct course ID');
    }

    console.log('Migrating subjects...');
    const { error: subjectMoveError } = await supabase
        .from('Subject')
        .update({ courseId: correctId })
        .eq('courseId', duplicateId);

    if (subjectMoveError) {
        console.error('Error migrating subjects:', subjectMoveError);
    } else {
        console.log('✅ Migrated subjects to correct course ID');
    }

    // Delete the duplicate 'Accounting & Finance' Bachelor course
    const { error: delError } = await supabase
        .from('Course')
        .delete()
        .eq('id', duplicateId);

    if (delError) {
        console.error('Error deleting duplicate course:', delError);
    } else {
        console.log('✅ Deleted duplicate Bachelor course: accounting-finance');
    }

    // Check for any other obvious duplicates (same title, same degree level)
    const { data: courses, error: fetchError } = await supabase
        .from('Course')
        .select('id, title, slug, degreeLevel');

    if (fetchError) {
        console.error('Error fetching courses for duplicate check:', fetchError);
        return;
    }

    const seen = new Set<string>();
    const toDelete: string[] = [];

    for (const course of courses || []) {
        const key = `${course.title}-${course.degreeLevel}`.toLowerCase();
        if (seen.has(key)) {
            // We've seen this title/level combo. If this is one of the generic slugs, delete it.
            // (Unless it's the one we specifically want to keep, but here we just identify)
            console.log(`Potential duplicate found: ${course.title} (${course.degreeLevel}) - slug: ${course.slug}`);
            // If the slug is very short/generic and we have a better one, mark for deletion
            // For now, I'll just log them and delete specifically if I'm sure.
        } else {
            seen.add(key);
        }
    }
}

main();
