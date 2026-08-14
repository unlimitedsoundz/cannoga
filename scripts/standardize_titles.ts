
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('🔄 Starting Course Title Standardization...');

    const { data: courses, error } = await supabase.from('Course').select('id, title, degreeLevel');

    if (error || !courses) {
        console.error('❌ Failed to fetch courses:', error);
        return;
    }

    let updatedCount = 0;

    for (const course of courses) {
        let newTitle = course.title;
        let needsUpdate = false;

        if (course.degreeLevel === 'BACHELOR') {
            if (!course.title.toLowerCase().includes('bachelor') && !course.title.includes('BSc') && !course.title.includes('B.Sc')) {
                newTitle = `Bachelor's in ${course.title}`;
                needsUpdate = true;
            }
        } else if (course.degreeLevel === 'MASTER') {
            if (!course.title.toLowerCase().includes('master') && !course.title.includes('MSc') && !course.title.includes('M.Sc') && !course.title.includes('MBA')) {
                newTitle = `Master's in ${course.title}`;
                needsUpdate = true;
            }
        }

        if (needsUpdate) {
            console.log(`✏️ Updating: "${course.title}" -> "${newTitle}"`);
            const { error: updateError } = await supabase
                .from('Course')
                .update({ title: newTitle })
                .eq('id', course.id);

            if (updateError) {
                console.error(`❌ Error updating ${course.title}:`, updateError.message);
            } else {
                updatedCount++;
            }
        } else {
            // console.log(`✅ Skipped: "${course.title}" (Already valid)`);
        }
    }

    console.log(`✅ Standardization Complete. Updated ${updatedCount} courses.`);
}

main();
