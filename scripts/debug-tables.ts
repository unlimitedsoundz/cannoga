import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const tables = ['faq_pages', 'faq', 'housing_buildings', 'housing_rooms', 'it_assets'];
    
    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*');
        console.log(`\n${table}:`);
        if (error) {
            console.log(`  Error: ${error.message}`);
        } else {
            console.log(`  Count: ${data?.length || 0}`);
            if (data && data.length > 0) {
                console.log(`  First row:`, JSON.stringify(data[0], null, 2));
            }
        }
    }
}

main();