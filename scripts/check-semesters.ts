import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const { data: semesters } = await supabase.from('semesters').select('*');
    console.log('Semesters:', semesters || 'none');

    const { data: subjects } = await supabase.from('Subject').select('count');
    console.log('Subject count:', subjects);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});