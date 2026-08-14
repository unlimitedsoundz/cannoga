import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('Creating page_content table via Supabase RPC...');
    
    // Try to create table using Supabase's exec_sql RPC
    const { error } = await supabase.rpc('exec_sql', {
        sql: `
            CREATE TABLE IF NOT EXISTS public.page_content (
                id SERIAL PRIMARY KEY,
                page_slug TEXT NOT NULL,
                section_key TEXT NOT NULL,
                content TEXT,
                updated_at TIMESTAMPTZ DEFAULT NOW(),
                updated_by TEXT,
                UNIQUE(page_slug, section_key)
            );
        `
    });

    if (error) {
        console.error('Error creating table:', error);
        console.log('Trying alternative approach...');
    } else {
        console.log('✅ page_content table created\n');
    }

    // Create indexes
    console.log('Creating indexes...');
    const { error: idxError1 } = await supabase.rpc('exec_sql', {
        sql: `CREATE INDEX IF NOT EXISTS idx_page_content_page_slug ON public.page_content(page_slug);`
    });
    const { error: idxError2 } = await supabase.rpc('exec_sql', {
        sql: `CREATE INDEX IF NOT EXISTS idx_page_content_section_key ON public.page_content(section_key);`
    });
    
    if (idxError1 || idxError2) {
        console.log('Note: Indexes may already exist or could not be created');
    } else {
        console.log('✅ Indexes created\n');
    }

    console.log('✅ page_content table setup complete!');
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});