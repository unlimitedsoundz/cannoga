
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

dotenv.config({ path: envLocalPath });
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    dotenv.config({ path: envPath });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
    const slug = 'bsc-applied-physics-science';
    console.log(`Checking course with slug: ${slug}`);

    const { data: course, error } = await supabase
        .from('Course')
        .select('id, title, subjects:Subject(count)')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching course:', error);
        return;
    }

    console.log(`Course Found: ${course.title} (${course.id})`);
    // @ts-ignore
    console.log(`Subject Count: ${course.subjects?.[0]?.count || 0}`);

    // Also check if there are any subjects for this course (if count returned differently)
    const { count } = await supabase
        .from('Subject')
        .select('*', { count: 'exact', head: true })
        .eq('courseId', course.id);

    console.log(`Direct Subject Count: ${count}`);
}

run();
