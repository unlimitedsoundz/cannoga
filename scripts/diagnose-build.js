require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function diagnose() {
    // 1. Check school image
    const { data: school } = await supabase.from('School').select('slug, imageUrl').eq('slug', 'health-community').single();
    console.log('School imageUrl:', school?.imageUrl);

    // 2. Check faculty for health-community-dept
    const { data: dept } = await supabase.from('Department').select('id, slug').eq('slug', 'health-community-dept').single();
    console.log('Department ID:', dept?.id);

    if (dept) {
        const { data: faculty } = await supabase.from('Faculty').select('id, name, role, departmentId, schoolId').eq('departmentId', dept.id);
        console.log('Faculty count:', faculty?.length || 0);
        (faculty || []).forEach(f => {
            console.log(`  - ${f.name} (${f.role}) dept=${f.departmentId} school=${f.schoolId}`);
        });
    }

    // 3. Check generated HTML
    const html = fs.readFileSync('E:/heffringuniversity/out/schools/health-community/health-community-dept/index.html', 'utf8');
    const hasFacultySection = html.includes('Faculty');
    const hasStudyPrograms = html.includes('Study Programs');
    const hasEmptyFaculty = html.includes('No faculty listings available');
    const hasEmily = html.includes('Dr. Emily Campbell');
    const hasSchoolImage = html.includes('school-of-health');

    console.log('\nGenerated HTML checks:');
    console.log('  Has "Faculty" section:', hasFacultySection);
    console.log('  Has "Study Programs":', hasStudyPrograms);
    console.log('  Shows "No faculty listings available":', hasEmptyFaculty);
    console.log('  Has "Dr. Emily Campbell":', hasEmily);
    console.log('  Has school image "school-of-health":', hasSchoolImage);

    // 4. Check actual faculty query used by page
    if (dept) {
        const { count } = await supabase.from('Faculty').select('*', { count: 'exact', head: true }).eq('departmentId', dept.id);
        console.log('\nFaculty count via count query:', count);
    }
}

diagnose().catch(console.error);
