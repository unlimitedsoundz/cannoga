require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateFacultyEmails() {
    const { data: facultyList, error } = await supabase
        .from('Faculty')
        .select('id, email');

    if (error) {
        console.error('Error fetching faculty:', error);
        return;
    }

    console.log(`Found ${facultyList.length} faculty members.`);

    let updated = 0;
    for (const faculty of facultyList) {
        if (faculty.email && faculty.email.includes('@cannogacollege.ca')) {
            const newEmail = faculty.email.replace('@cannogacollege.ca', '@cannogacollege.ca');
            const { error: updateError } = await supabase
                .from('Faculty')
                .update({ email: newEmail })
                .eq('id', faculty.id);

            if (updateError) {
                console.error(`Failed to update ${faculty.id}:`, updateError);
            } else {
                updated++;
            }
        }
    }

    console.log(`Updated ${updated} faculty emails to @cannogacollege.ca`);
}

updateFacultyEmails();
