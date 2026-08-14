
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSubjects() {
    const { data: course, error } = await supabase
        .from('Course')
        .select('id, title, curriculum')
        .ilike('title', '%Applied Physics%')
        .single();

    if (error) {
        console.error('Error fetching course:', error.message);
        return;
    }

    console.log('Course found:', course.title);
    console.log('Curriculum:', JSON.stringify(course.curriculum, null, 2));
}

checkSubjects();
