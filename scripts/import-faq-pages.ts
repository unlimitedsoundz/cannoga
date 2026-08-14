import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import * as fs from 'fs';
import * as csv from 'csv-parse/sync';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('Reading faq_pages_rows.csv...\n');
    
    const csvPath = path.resolve('D:/Downloads/faq_pages_rows.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const records: any[] = csv.parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true,
    });

    console.log(`Parsed ${records.length} rows from CSV\n`);

    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    for (const row of records) {
        try {
            const { error } = await supabase
                .from('faq_pages')
                .upsert({
                    id: row.id,
                    name: row.name,
                    slug: row.slug,
                    created_at: row.created_at || new Date().toISOString()
                }, { onConflict: 'id' });

            if (error) {
                console.error(`Failed to import ${row.name}:`, error.message);
                skipped++;
            } else {
                console.log(`✅ Imported: ${row.name} (${row.slug})`);
                inserted++;
            }
        } catch (err) {
            console.error(`Error importing ${row.name}:`, err);
            skipped++;
        }
    }

    console.log(`\n✅ FAQ pages import complete:`);
    console.log(`  Processed: ${records.length}`);
    console.log(`  Success: ${inserted}`);
    console.log(`  Skipped/Errors: ${skipped}`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});