
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing environment variables.');
    process.exit(1);
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
    console.log('🔄 Updating course metadata...');

    // 1. Rename Department to 'Business'
    // First distinct search for likely candidates to ensure we capture the right one
    const { data: dept } = await supabase.from('Department').select('id, name').ilike('name', '%Business%').limit(1).single();

    let businessDeptId = dept?.id;

    if (dept) {
        console.log(`Found Department: ${dept.name} (${dept.id}). Renaming to "Business"...`);
        await supabase.from('Department').update({ name: 'Business' }).eq('id', dept.id);
    } else {
        console.log('Creating "Business" department...');
        // Need a school ID first
        const { data: school } = await supabase.from('School').select('id').eq('slug', 'school-of-business').single();
        if (school) {
            const { data: newDept } = await supabase.from('Department').insert({ name: 'Business', slug: 'business', schoolId: school.id }).select().single();
            businessDeptId = newDept.id;
        }
    }

    // 2. Get School of Business ID
    const { data: school } = await supabase.from('School').select('id').eq('slug', 'school-of-business').single();
    const businessSchoolId = school?.id;

    if (!businessSchoolId || !businessDeptId) {
        console.error('❌ Could not resolve School or Department IDs. Aborting.');
        return;
    }

    // 3. Update Bachelor's Metadata
    const bscUpdates = {
        tuitionFee: "For non-Canada citizens, $8000/y (Bachelor's studies)",
        credits: 180, // Standard Bologna 3 years
        schoolId: businessSchoolId,
        departmentId: businessDeptId
    };

    const { error: bscError } = await supabase
        .from('Course')
        .update(bscUpdates)
        .eq('degreeLevel', 'BACHELOR'); // Updates ALL Bachelors. User said "add all the database" implies broad stroke.

    if (bscError) console.error('Error updating BSc:', bscError);
    else console.log('✅ Updated Bachelor courses: Fees, Credits (180), School, Dept.');

    // 4. Update Master's Metadata
    const mscUpdates = {
        tuitionFee: "For non-Canada citizens, $10000/y (Master’s studies)",
        credits: 120,
        schoolId: businessSchoolId,
        departmentId: businessDeptId
    };

    const { error: mscError } = await supabase
        .from('Course')
        .update(mscUpdates)
        .eq('degreeLevel', 'MASTER');

    if (mscError) console.error('Error updating MSc:', mscError);
    else console.log('✅ Updated Master courses: Fees, Credits (120), School, Dept.');
}

main();
