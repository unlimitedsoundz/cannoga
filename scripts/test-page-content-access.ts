import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('Testing page_content table access...\n');
    
    // Try to read
    const { data: readData, error: readError } = await supabase
        .from('page_content')
        .select('*')
        .limit(1);
    
    console.log('Read test:', readError ? 'FAILED' : 'OK');
    if (readError) {
        console.log('Read error:', readError);
    } else {
        console.log(`Found ${readData?.length || 0} records`);
    }
    
    // Try to write
    console.log('\nTesting write...');
    const { data: writeData, error: writeError } = await supabase
        .from('page_content')
        .upsert(
            {
                page_slug: 'test-page',
                section_key: 'test-section',
                content: '<p>Test content</p>'
            },
            { onConflict: 'page_slug,section_key' }
        );
    
    console.log('Write test:', writeError ? 'FAILED' : 'OK');
    if (writeError) {
        console.log('Write error:', writeError);
    } else {
        console.log('Write success:', writeData);
    }
}

main();