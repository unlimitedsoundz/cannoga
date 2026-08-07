const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDb() {
    console.log('=== Checking Schools ===');
    const { data: schools } = await supabase.from('School').select('id, name, slug');
    console.log(`Total schools: ${schools?.length || 0}`);
    (schools || []).forEach((s: any) => console.log(`  - ${s.slug}: ${s.name}`));

    console.log('\n=== Checking Departments for missing schools ===');
    const missingSlugs = ['health-community', 'hospitality-tourism', 'education-social-sciences', 'transportation-aviation'];
    for (const slug of missingSlugs) {
        const school = (schools || []).find((s: any) => s.slug === slug);
        if (!school) {
            console.log(`School ${slug} NOT FOUND`);
            continue;
        }
        const { data: depts } = await supabase.from('Department').select('id, name, slug').eq('schoolId', school.id);
        console.log(`${slug}: ${depts?.length || 0} departments`);
        (depts || []).forEach((d: any) => console.log(`  - ${d.slug}: ${d.name}`));
    }

    console.log('\n=== Checking Courses for missing schools ===');
    for (const slug of missingSlugs) {
        const school = (schools || []).find((s: any) => s.slug === slug);
        if (!school) continue;
        const { data: courses } = await supabase.from('Course').select('id, title, slug').eq('schoolId', school.id);
        console.log(`${slug}: ${courses?.length || 0} courses`);
    }

    console.log('\n=== Checking Faculty for missing schools ===');
    for (const slug of missingSlugs) {
        const school = (schools || []).find((s: any) => s.slug === slug);
        if (!school) continue;
        const { data: faculty } = await supabase.from('Faculty').select('id, name, role').eq('schoolId', school.id);
        console.log(`${slug}: ${faculty?.length || 0} faculty`);
    }

    console.log('\n=== Checking Subjects count for courses in missing schools ===');
    for (const slug of missingSlugs) {
        const school = (schools || []).find((s: any) => s.slug === slug);
        if (!school) continue;
        const { data: courses } = await supabase.from('Course').select('id, title').eq('schoolId', school.id);
        if (!courses?.length) continue;
        for (const course of courses) {
            const { count } = await supabase.from('Subject').select('*', { count: 'exact', head: true }).eq('courseId', course.id);
            console.log(`  ${course.title}: ${count || 0} subjects`);
        }
    }
}

checkDb().catch(console.error);
