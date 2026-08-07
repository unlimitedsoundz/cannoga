import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    // Check if faq_pages exists
    const { error: faqPagesError } = await supabase.from('faq_pages').select('*', { head: true, count: 'exact' });
    console.log('faq_pages check:', faqPagesError ? 'MISSING' : 'EXISTS');

    // Check if faq exists
    const { error: faqError } = await supabase.from('faq').select('*', { head: true, count: 'exact' });
    console.log('faq check:', faqError ? 'MISSING' : 'EXISTS');

    // Check if it_assets exists
    const { error: itAssetsError } = await supabase.from('it_assets').select('*', { head: true, count: 'exact' });
    console.log('it_assets check:', itAssetsError ? `MISSING: ${itAssetsError.message}` : 'EXISTS');

    // Check if student_it_access exists
    const { error: itAccessError } = await supabase.from('student_it_access').select('*', { head: true, count: 'exact' });
    console.log('student_it_access check:', itAccessError ? `MISSING: ${itAccessError.message}` : 'EXISTS');
}

main();