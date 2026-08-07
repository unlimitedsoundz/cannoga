import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import * as fs from 'fs';
import * as csv from 'csv-parse/sync';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function cleanFaqContent(content: string): string {
    if (!content) return content;
    
    return content
        .replace(/Heffring University/gi, 'Cannoga College')
        .replace(/Heffring/gi, 'Cannoga')
        .replace(/Helsinki, Finland/gi, 'Ottawa, Ontario')
        .replace(/Helsinki/gi, 'Ottawa')
        .replace(/Finland/gi, 'Canada')
        .replace(/Finnish/gi, 'Canadian')
        .replace(/admissions@Heffring\.fi/gi, 'admissions@cannogacollege.ca')
        .replace(/admissions@heffring\.online/gi, 'admissions@cannogacollege.ca')
        .replace(/heffring\.online/gi, 'cannogacollege.ca')
        .replace(/heffring\.fi/gi, 'cannogacollege.ca')
        .replace(/Migri/gi, 'IRCC')
        .replace(/Finnish Immigration Service/gi, 'Immigration, Refugees and Citizenship Canada')
        .replace(/residence permit/gi, 'study permit')
        .replace(/student residence permit/gi, 'Canadian study permit')
        .replace(/Finnish Student Health Service \(FSHS\)/gi, 'Canadian student health services')
        .replace(/healthcare fee for students in higher education/gi, 'student health coverage')
        .replace(/Kela/gi, 'ServiceOntario')
        .replace(/Social Insurance Institution/gi, 'provincial health coverage')
        .replace(/FSHS/gi, 'student health services')
        .replace(/European Health Insurance Card \(EHIC\)/gi, 'provincial health insurance')
        .replace(/€/gi, 'CAD $')
        .replace(/36 euros/gi, 'CAD $54')
        .replace(/universities act/gi, 'College and Universities Act')
        .replace(/University/gi, 'College')
        .replace(/universities/gi, 'colleges')
        .replace(/university/gi, 'college')
        .replace(/degree programme/gi, 'program')
        .replace(/degree programs/gi, 'programs')
        .replace(/study option/gi, 'program')
        .replace(/study options/gi, 'programs')
        .replace(/ECTS/gi, 'Canadian credits')
        .replace(/180 ECTS/gi, '90 Canadian credits')
        .replace(/120 ECTS/gi, '60 Canadian credits')
        .replace(/60 ECTS/gi, '30 Canadian credits')
        .replace(/Finnish legislation/gi, 'Canadian regulations')
        .replace(/Finnish Immigration/gi, 'Canadian Immigration')
        .replace(/EU\/EEA/gi, 'Domestic')
        .replace(/non-EU/gi, 'international')
        .replace(/residence permit in Helsinki, Finland/gi, 'study permit for Canada')
        .replace(/permit card in Helsinki, Finland/gi, 'study permit document')
        .replace(/1 August/gi, 'August 1')
        .replace(/23 April 2026/gi, 'April 23, 2026')
        .replace(/31 July 2026/gi, 'July 31, 2026')
        .replace(/14 August 2026/gi, 'August 14, 2026')
        .replace(/9 January 2026/gi, 'January 9, 2026')
        .replace(/1 December 2025/gi, 'December 1, 2025')
        .replace(/23 April 2026/gi, 'April 23, 2026')
        .replace(/Autumn semester/gi, 'Fall semester')
        .replace(/spring/gi, 'winter')
        .replace(/Autumn/gi, 'Fall')
        .replace(/Finnish higher education/gi, 'Canadian higher education')
        .replace(/Finnish college/gi, 'Canadian college')
        .replace(/Finnish admissions/gi, 'Canadian admissions')
        .replace(/Finnish Ministry/gi, 'Ontario Ministry')
        .replace(/Finnish Immigration/gi, 'Canadian Immigration')
        .replace(/Finnish study permit/gi, 'Canadian study permit')
        .replace(/Finnish residence permit/gi, 'Canadian study permit')
        .replace(/non-Finnish/gi, 'non-Canadian')
        .replace(/Finnish\/PR/gi, 'Canadian citizen/permanent resident');
}

async function main() {
    console.log('Reading faq_rows.csv...\n');
    
    const csvPath = path.resolve('D:/Downloads/faq_rows.csv');
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
            const cleanedQuestion = cleanFaqContent(row.question);
            const cleanedAnswer = cleanFaqContent(row.answer);

            const { error } = await supabase
                .from('faq')
                .upsert({
                    id: row.id,
                    question: cleanedQuestion,
                    answer: cleanedAnswer,
                    page_id: row.page_id,
                    order_index: parseInt(row.order_index) || 0,
                    is_published: row.is_published === 'true',
                    created_at: row.created_at || new Date().toISOString()
                }, { onConflict: 'id' });

            if (error) {
                console.error(`Failed to import FAQ ${row.id}:`, error.message);
                skipped++;
            } else {
                console.log(`✅ Imported: ${cleanedQuestion.substring(0, 60)}...`);
                inserted++;
            }
        } catch (err) {
            console.error(`Error importing FAQ ${row.id}:`, err);
            skipped++;
        }
    }

    console.log(`\n✅ FAQ import complete:`);
    console.log(`  Processed: ${records.length}`);
    console.log(`  Success: ${inserted}`);
    console.log(`  Skipped/Errors: ${skipped}`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});