import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('Checking faq_pages table...\n');
    
    const { data, error } = await supabase.from('faq_pages').select('*').order('name');
    
    if (error) {
        console.error('Error:', error);
        return;
    }
    
    console.log(`Total FAQ pages: ${data?.length || 0}\n`);
    
    if (data && data.length > 0) {
        console.log('FAQ Pages:');
        data.forEach((page, index) => {
            console.log(`\n${index + 1}. ${page.name}`);
            console.log(`   ID: ${page.id}`);
            console.log(`   Slug: ${page.slug}`);
            console.log(`   Created: ${page.created_at}`);
        });
    } else {
        console.log('No FAQ pages found in database.');
    }
}

main();