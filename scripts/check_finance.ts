
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import * as fs from 'fs';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
    const results: any = {
        logs: []
    };

    const log = (msg: string, obj?: any) => {
        console.log(msg, obj || '');
        results.logs.push(obj ? `${msg} ${JSON.stringify(obj, null, 2)}` : msg);
    };

    log('--- DIAGNOSTIC: CANANCE DEPARTMENT & COURSES ---');

    // 1. Check all departments in Business school
    let schoolId = '';
    const { data: schools } = await supabase.from('School').select('id, name, slug').eq('slug', 'school-of-business').single();
    if (schools) {
        schoolId = schools.id;
        log(`Found School: ${schools.name} ID: ${schoolId}`);
    } else {
        const { data: schoolsAlt } = await supabase.from('School').select('id, name, slug').eq('slug', 'business').single();
        if (schoolsAlt) {
            schoolId = schoolsAlt.id;
            log(`Found School (Alt): ${schoolsAlt.name} ID: ${schoolId}`);
        }
    }

    if (!schoolId) {
        log('❌ School not found');
        fs.writeFileSync('diag_finance.json', JSON.stringify(results, null, 2));
        return;
    }

    const { data: depts } = await supabase
        .from('Department')
        .select('id, name, slug')
        .eq('schoolId', schoolId);

    results.depts = depts;
    log(`Departments in Business school:`, depts?.length);

    // 2. Check for courses linked to depts
    const { data: courses } = await supabase
        .from('Course')
        .select('id, title, slug, departmentId')
        .eq('schoolId', schoolId);

    results.courses = courses;
    log(`All courses in Business School:`, courses?.length);

    // 3. Check for any courses with "finance"
    const { data: anyFinance } = await supabase
        .from('Course')
        .select('id, title, slug, departmentId')
        .or('title.ilike.%finance%,slug.ilike.%finance%');

    results.anyFinance = anyFinance;
    log(`Courses with "finance" in title/slug (globally):`, anyFinance?.length);

    fs.writeFileSync('diag_finance.json', JSON.stringify(results, null, 2));
    log('✅ Diagnostic results saved to diag_finance.json');
}

main();
