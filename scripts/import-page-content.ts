import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import * as fs from 'fs';
import * as csv from 'csv-parse/sync';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function cleanContent(content: string): string {
    if (!content) return content;
    
    return content
        .replace(/Heffring University/gi, 'Cannoga College')
        .replace(/Heffring/gi, 'Cannoga')
        .replace(/Helsinki/gi, 'Ottawa')
        .replace(/Finland/gi, 'Canada')
        .replace(/Finnish/gi, 'Canadian')
        .replace(/heffring.online/gi, 'cannogacollege.ca')
        .replace(/heffring\.fi/gi, 'cannogacollege.ca')
        .replace(/admissions@heffring\.online/gi, 'admissions@cannogacollege.ca')
        .replace(/admissions@Heffring\.fi/gi, 'admissions@cannogacollege.ca')
        .replace(/\+358[^\d]*\d[^\d]*\d[^\d]*\d[^\d]*\d[^\d]*\d[^\d]*\d[^\d]*\d/gi, '+1 (613) 555-0181')
        .replace(/KELA/gi, 'OHIP')
        .replace(/Kela/gi, 'OHIP')
        .replace(/Finland Immigration Service/gi, 'Immigration, Refugees and Citizenship Canada')
        .replace(/Migri/gi, 'IRCC')
        .replace(/residence permit/gi, 'study permit')
        .replace(/student residence permit/gi, 'Canadian study permit')
        .replace(/Finnish study permit/gi, 'Canadian study permit')
        .replace(/Finnish residence permit/gi, 'Canadian study permit')
        .replace(/EU\/EEA/gi, 'Domestic')
        .replace(/non-EU/gi, 'international')
        .replace(/non-Finnish/gi, 'non-Canadian')
        .replace(/Finnish\/PR/gi, 'Canadian citizen/permanent resident')
        .replace(/€/gi, 'CAD $')
        .replace(/EUR/gi, 'CAD')
        .replace(/€6,200/gi, 'CAD $6,200')
        .replace(/€8,000/gi, 'CAD $8,000')
        .replace(/€2,000/gi, 'CAD $2,000')
        .replace(/€1,250/gi, 'CAD $1,250')
        .replace(/€3,000/gi, 'CAD $3,000')
        .replace(/€750/gi, 'CAD $750')
        .replace(/€3,500/gi, 'CAD $3,500')
        .replace(/€9,500/gi, 'CAD $9,500')
        .replace(/55 credits\/year/gi, '30 credits/year')
        .replace(/180 ECTS/gi, '90 Canadian credits')
        .replace(/120 ECTS/gi, '60 Canadian credits')
        .replace(/60 ECTS/gi, '30 Canadian credits')
        .replace(/ECTS/gi, 'Canadian credits')
        .replace(/Finnish education/gi, 'Canadian education')
        .replace(/Finnish higher education/gi, 'Canadian higher education')
        .replace(/Finnish university/gi, 'Canadian college')
        .replace(/Finnish college/gi, 'Canadian college')
        .replace(/Finnish admissions/gi, 'Canadian admissions')
        .replace(/Finnish Ministry/gi, 'Ontario Ministry')
        .replace(/Finnish Immigration/gi, 'Canadian Immigration')
        .replace(/Helsinki area/gi, 'Ottawa area')
        .replace(/Helsinki, Finland/gi, 'Ottawa, Ontario')
        .replace(/Helsinki, Ontario/gi, 'Ottawa, Ontario')
        .replace(/Ottawa, Ontario, Canada/gi, 'Ottawa, Ontario')
        .replace(/Ottawa, Ontario/gi, 'Ottawa, Ontario')
        .replace(/Ottawa/gi, 'Ottawa')
        .replace(/Ontario, Canada/gi, 'Ontario')
        .replace(/Canada/gi, 'Canada');
}

async function main() {
    console.log('Reading CSV file...');
    const csvPath = path.resolve('D:/Downloads/page_content_rows.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const records: any[] = csv.parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true,
    });

    console.log(`Parsed ${records.length} rows from CSV\n`);

    // Get existing page_content records
    const { data: existingRecords } = await supabase.from('page_content').select('id, page_slug, section_key');
    const existingKeys = new Set((existingRecords || []).map(r => `${r.page_slug}-${r.section_key}`));

    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    for (const row of records) {
        const key = `${row.page_slug}-${row.section_key}`;
        const cleanedContent = cleanContent(row.content);

        if (existingKeys.has(key)) {
            // Update existing
            const { error } = await supabase
                .from('page_content')
                .update({
                    content: cleanedContent,
                    updated_at: new Date().toISOString()
                })
                .eq('page_slug', row.page_slug)
                .eq('section_key', row.section_key);

            if (error) {
                console.error(`Failed to update ${key}:`, error.message);
                skipped++;
            } else {
                updated++;
            }
        } else {
            // Insert new
            const { error } = await supabase
                .from('page_content')
                .insert({
                    page_slug: row.page_slug,
                    section_key: row.section_key,
                    content: cleanedContent,
                    updated_at: new Date().toISOString()
                });

            if (error) {
                console.error(`Failed to insert ${key}:`, error.message);
                skipped++;
            } else {
                inserted++;
            }
        }
    }

    console.log(`\n✅ Page content import complete:`);
    console.log(`  Inserted: ${inserted}`);
    console.log(`  Updated: ${updated}`);
    console.log(`  Skipped/Errors: ${skipped}`);
    console.log(`  Total processed: ${records.length}`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});