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
    console.log('Loading current course IDs from database...');
    const { data: courses } = await supabase.from('Course').select('id, slug');
    const currentCourseIds = new Set((courses || []).map(c => c.id));
    console.log(`Found ${currentCourseIds.size} courses in database`);

    const csvPath = path.resolve('D:/Downloads/Subject_rows.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const records: any[] = csv.parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true,
    });

    console.log(`Parsed ${records.length} rows from Subject CSV`);

    const oldToNewCourseId: Record<string, string> = {
        '49b84c9a-009f-4840-a61c-27abaf03fc07': '5d6f1264-41a2-40a5-abaa-99b714eed341',
        '6a24f1f1-e11a-4454-afe0-b1406ac1929e': '162707d8-b8c9-4064-aba0-0abf83afb717',
        'f006c2a0-53fa-4f01-9f5f-58a3244d7544': 'f2c5cdd7-ab2b-48d0-a1a5-17b9721c31e0',
    };

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const row of records) {
        const oldCourseId = row.courseId;
        const newCourseId = oldToNewCourseId[oldCourseId] || oldCourseId;

        if (!currentCourseIds.has(newCourseId)) {
            console.log(`Skipping ${row.name}: course ${newCourseId} not found`);
            skipped++;
            continue;
        }

        const { error } = await supabase.from('Subject').upsert({
            id: row.id,
            name: row.name,
            creditUnits: parseInt(row.creditUnits) || 3,
            semester: parseInt(row.semester) || 1,
            courseId: newCourseId,
        }, { onConflict: 'id' });

        if (error) {
            console.error(`Failed to import ${row.name}:`, error.message);
            errors++;
        } else {
            imported++;
        }
    }

    console.log(`\n✅ Subject import complete:`);
    console.log(`  Imported/updated: ${imported}`);
    console.log(`  Skipped: ${skipped}`);
    console.log(`  Errors: ${errors}`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});