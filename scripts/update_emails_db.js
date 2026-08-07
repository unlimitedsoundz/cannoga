const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateEmails() {
    console.log('Fetching students to update emails...');
    const { data: students, error: studentError } = await supabase
        .from('students')
        .select('*');

    if (studentError) {
        console.error('Error fetching students:', studentError);
    } else if (students) {
        let updateCount = 0;
        for (const student of students) {
            if (student.institutional_email && student.institutional_email.includes('@cannogacollege.ca')) {
                const newEmail = student.institutional_email.replace('@cannogacollege.ca', '@cannogacollege.ca');
                await supabase
                    .from('students')
                    .update({ institutional_email: newEmail })
                    .eq('id', student.id);
                updateCount++;
            }
        }
        console.log(`Updated ${updateCount} student emails.`);
    }

    console.log('Fetching Faculty to update emails...');
    const { data: faculty, error: facultyError } = await supabase
        .from('Faculty')
        .select('*');

    if (facultyError) {
        console.error('Error fetching Faculty:', facultyError);
    } else if (faculty) {
        let updateCount = 0;
        for (const member of faculty) {
            if (member.email && member.email.includes('@cannogacollege.ca')) {
                const newEmail = member.email.replace('@cannogacollege.ca', '@cannogacollege.ca');
                await supabase
                    .from('Faculty')
                    .update({ email: newEmail })
                    .eq('id', member.id);
                updateCount++;
            }
        }
        console.log(`Updated ${updateCount} Faculty emails.`);
    }

    console.log('Fetching it_assets...');
    const { data: assets, error: assetError } = await supabase.from('it_assets').select('*');
    if (assets) {
        let assetCount = 0;
        for (const asset of assets) {
            let updated = false;
            let newDesc = asset.description;
            let newUrl = asset.login_url;
            if (newDesc && newDesc.includes('penkka.fi')) { newDesc = newDesc.replace(/penkka\.fi/g, 'penkka.fi'); updated = true; }
            if (newUrl && newUrl.includes('penkka.fi')) { newUrl = newUrl.replace(/penkka\.fi/g, 'penkka.fi'); updated = true; }
            if (updated) {
                await supabase.from('it_assets').update({ description: newDesc, login_url: newUrl }).eq('id', asset.id);
                assetCount++;
            }
        }
        console.log(`Updated ${assetCount} it_assets records.`);
    }

    console.log('Done updating database.');
}

updateEmails();
