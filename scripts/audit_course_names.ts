
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
    const { data: courses } = await supabase.from('Course').select('title, degreeLevel, slug').order('title');
    console.log('--- Course Titles Audit ---');
    courses?.forEach(c => {
        console.log(`[${c.degreeLevel}] ${c.title} (${c.slug})`);
    });
}

main();
