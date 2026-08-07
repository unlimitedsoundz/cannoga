import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import * as fs from 'fs';
import * as csv from 'csv-parse/sync';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getMappings() {
    const schools: Record<string, string> = {};
    const { data: schoolData } = await supabase.from('School').select('id, slug');
    if (schoolData) {
        for (const s of schoolData) {
            schools[s.slug] = s.id;
        }
    }
    console.log('Current schools:', schools);
    return { schools };
}

async function main() {
    const { schools } = await getMappings();

    const csvPath = path.resolve('D:/Downloads/Department_rows.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const records: any[] = csv.parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true,
    });

    console.log(`Parsed ${records.length} departments from CSV\n`);

    const oldToNewSchool: Record<string, string> = {
        'a54123ea-caae-40ec-b3b0-d2c1d91528ca': schools['business'],
        '75aa8b88-a35d-4e3e-8447-7b4df3031baf': schools['arts'],
        'c710bc8b-2fae-43ce-bd5f-9cc289190754': schools['technology'],
        '3592d39b-e747-44c4-ab63-2fa22a1cc49a': schools['science'],
        '6fd8dfc3-0cf3-4720-89f9-cca5551510c5': schools['health-community'],
        '1a4d6c71-bccf-4795-ace9-342ca6ead676': schools['hospitality-tourism'],
        '9b73e243-69c4-4950-9e75-47c5db8260d4': schools['education-social-sciences'],
        '5a0c3177-72da-470f-866c-e43cd74aa86e': schools['transportation-aviation'],
    };

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const row of records) {
        const newSchoolId = oldToNewSchool[row.schoolId];
        if (!newSchoolId) {
            console.log(`Skipping ${row.name}: unknown old school ${row.schoolId}`);
            skipped++;
            continue;
        }

        let description = (row.description || '').replace(/Heffring University/g, 'Cannoga College');
        description = description.replace(/SYKLI College/g, 'Cannoga College');

        const { error } = await supabase.from('Department').upsert({
            id: row.id,
            name: row.name,
            slug: row.slug,
            description: description,
            schoolId: newSchoolId,
            createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : new Date().toISOString(),
        }, { onConflict: 'id' });

        if (error) {
            console.error(`Failed to import ${row.name}:`, error.message);
            errors++;
        } else {
            created++;
            console.log(`Imported: ${row.name}`);
        }
    }

    console.log(`\n✅ Department import complete:`);
    console.log(`  Imported/updated: ${created}`);
    console.log(`  Skipped: ${skipped}`);
    console.log(`  Errors: ${errors}`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});