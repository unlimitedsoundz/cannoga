
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
    console.log('Listing all courses with "Physics" in title...');
    const { data: courses, error } = await supabase
        .from('Course')
        .select('id, title, slug')
        .ilike('title', '%Physics%');

    if (error) {
        console.error(error);
        return;
    }

    courses?.forEach(c => {
        console.log(`Title: ${c.title} | Slug: ${c.slug} | ID: ${c.id}`);
    });
}

run();
