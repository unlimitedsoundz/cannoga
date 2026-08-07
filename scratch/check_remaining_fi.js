require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkResiduals() {
    console.log("Checking tables for legacy '.fi' emails...");

    // 1. Check Faculty
    const { data: faculty } = await supabase.from('Faculty').select('id, name, email');
    const fiFaculty = faculty?.filter(f => f.email?.toLowerCase().includes('.fi')) || [];
    console.log(`Faculty with '.fi': ${fiFaculty.length}`);
    fiFaculty.forEach(f => console.log(` - Faculty: ${f.name} | ${f.email}`));

    // 2. Check students
    const { data: students } = await supabase.from('students').select('id, student_id, institutional_email, personal_email');
    const fiInstStudents = students?.filter(s => s.institutional_email?.toLowerCase().includes('.fi')) || [];
    const fiPersStudents = students?.filter(s => s.personal_email?.toLowerCase().includes('.fi')) || [];
    console.log(`Students with '.fi' in institutional_email: ${fiInstStudents.length}`);
    fiInstStudents.forEach(s => console.log(` - Student: ${s.student_id} | Inst: ${s.institutional_email}`));
    console.log(`Students with '.fi' in personal_email: ${fiPersStudents.length}`);
    fiPersStudents.forEach(s => console.log(` - Student: ${s.student_id} | Pers: ${s.personal_email}`));

    // 3. Check profiles
    const { data: profiles } = await supabase.from('profiles').select('id, email, student_id');
    const fiProfiles = profiles?.filter(p => p.email?.toLowerCase().includes('.fi')) || [];
    console.log(`Profiles with '.fi': ${fiProfiles.length}`);
    fiProfiles.forEach(p => console.log(` - Profile: ${p.student_id} | ${p.email}`));
}

checkResiduals();
