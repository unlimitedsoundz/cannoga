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
    const departments: Record<string, string> = {};
    const deptSlugToId: Record<string, string> = {};

    const { data: schoolData } = await supabase.from('School').select('id, slug');
    if (schoolData) {
        for (const s of schoolData) {
            schools[s.slug] = s.id;
        }
    }

    const { data: deptData } = await supabase.from('Department').select('id, slug, schoolId');
    if (deptData) {
        for (const d of deptData) {
            departments[d.id] = d.id;
            deptSlugToId[d.slug] = d.id;
        }
    }

    console.log('Schools loaded:', Object.keys(schools).length);
    console.log('Departments loaded:', Object.keys(departments).length);
    return { schools, departments, deptSlugToId };
}

async function main() {
    const { schools, departments, deptSlugToId } = await getMappings();

    const csvPath = path.resolve('D:/Downloads/Course_rows (1).csv');
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const records: any[] = csv.parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true,
    });

    console.log(`Parsed ${records.length} rows from CSV`);

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

    const oldDeptIdToCurrent: Record<string, string> = {};
    
    for (const [oldId, currentId] of Object.entries(departments)) {
        oldDeptIdToCurrent[oldId] = currentId;
    }

    // Fix mappings for departments that existed before CSV import
    oldDeptIdToCurrent['1a4d6c71-bccf-4795-ace9-342ca6ead676'] = deptSlugToId['hospitality-tourism-dept'];
    oldDeptIdToCurrent['6fd8dfc3-0cf3-4720-89f9-cca5551510c5'] = deptSlugToId['health-community-dept'];
    oldDeptIdToCurrent['5a0c3177-72da-470f-866c-e43cd74aa86e'] = deptSlugToId['transportation-aviation-dept'];
    oldDeptIdToCurrent['9b73e243-69c4-4950-9e75-47c5db8260d4'] = deptSlugToId['education-social-sciences-dept'];

    // Map old CSV department UUIDs to current department UUIDs
    oldDeptIdToCurrent['68941116-6b94-48ea-a6a7-91f61f8b037f'] = deptSlugToId['hospitality-tourism-dept'];
    oldDeptIdToCurrent['de613d1a-34b0-41c3-8922-d6b3437cc48a'] = deptSlugToId['health-community-dept'];
    oldDeptIdToCurrent['5305dcd3-e0a7-4776-9e3c-452a459485da'] = deptSlugToId['transportation-aviation-dept'];
    oldDeptIdToCurrent['9f22b064-da8e-4ad0-801c-6e849b6d911f'] = deptSlugToId['education-social-sciences-dept'];

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const row of records) {
        const oldSchoolId = row.schoolId;
        const oldDeptId = row.departmentId;

        const newSchoolId = oldToNewSchool[oldSchoolId];
        const newDeptId = oldDeptIdToCurrent[oldDeptId];

        if (!newSchoolId) {
            console.log(`Skipping ${row.title}: missing school mapping for ${oldSchoolId}`);
            skipped++;
            continue;
        }

        if (!newDeptId) {
            console.log(`Skipping ${row.title}: missing dept mapping for ${oldDeptId}`);
            skipped++;
            continue;
        }

        let description = row.description || '';
        description = description.replace(/Heffring University/g, 'Cannoga College');

        let entryRequirements = row.entryRequirements || '';
        entryRequirements = entryRequirements.replace(/Heffring University/g, 'Cannoga College');

        let careerPaths = row.careerPaths || '';
        careerPaths = careerPaths.replace(/Heffring University/g, 'Cannoga College');

        let imageUrl = row.imageUrl || '';
        if (!imageUrl || imageUrl.includes('heffring') || imageUrl.includes('placeholder')) {
            imageUrl = '';
        }

        const { error } = await supabase.from('Course').upsert({
            id: row.id,
            title: row.title,
            slug: row.slug,
            degreeLevel: row.degreeLevel,
            duration: row.duration || '1 Year',
            description: description,
            language: row.language || 'English',
            entryRequirements: entryRequirements,
            minimumGrade: row.minimumGrade || '',
            careerPaths: careerPaths,
            imageUrl: imageUrl,
            schoolId: newSchoolId,
            departmentId: newDeptId,
            createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : new Date().toISOString(),
        }, { onConflict: 'id' });

        if (error) {
            console.error(`Failed to import ${row.title}:`, error.message);
            errors++;
        } else {
            imported++;
        }
    }

    console.log(`\n✅ Import complete:`);
    console.log(`  Imported/updated: ${imported}`);
    console.log(`  Skipped: ${skipped}`);
    console.log(`  Errors: ${errors}`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});