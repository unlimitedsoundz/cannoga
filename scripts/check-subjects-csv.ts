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

    const csvCourseIds = new Set(records.map(r => r.courseId));
    console.log(`Unique courseIds in CSV: ${csvCourseIds.size}`);

    const missing = [...csvCourseIds].filter(id => !currentCourseIds.has(id));
    console.log(`Missing courseIds in DB: ${missing.length}`);
    if (missing.length > 0) {
        console.log('Missing IDs:', missing.slice(0, 20));
    }

    const existing = [...csvCourseIds].filter(id => currentCourseIds.has(id));
    console.log(`Existing courseIds in DB: ${existing.length}`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});