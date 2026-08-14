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
    const { data: courses } = await supabase.from('Course').select('id, title');
    const currentCourses = new Map((courses || []).map(c => [c.id, c.title]));

    const csvPath = path.resolve('D:/Downloads/Course_rows (1).csv');
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const courseRecords: any[] = csv.parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true,
    });

    const missingIds = [
        '49b84c9a-009f-4840-a61c-27abaf03fc07',
        '6a24f1f1-e11a-4454-afe0-b1406ac1929e',
        'f006c2a0-53fa-4f01-9f5f-58a3244d7544'
    ];

    console.log('Missing course details:');
    for (const id of missingIds) {
        const record = courseRecords.find(r => r.id === id);
        if (record) {
            console.log(`\nID: ${id}`);
            console.log(`  Title: ${record.title}`);
            console.log(`  School: ${record.schoolId}`);
            console.log(`  Dept: ${record.departmentId}`);
            console.log(`  Slug: ${record.slug}`);
        } else {
            console.log(`\nID: ${id} - NOT FOUND IN CSV`);
        }
    }

    console.log('\nCurrent courses with similar titles:');
    for (const [id, title] of currentCourses) {
        if (title.includes('Psychology') || title.includes('Culinary') || title.includes('Fire')) {
            console.log(`  ${title}: ${id}`);
        }
    }
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});