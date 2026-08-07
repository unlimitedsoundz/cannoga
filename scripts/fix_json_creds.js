import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('Fetching student_it_access...');

    const { data: accessLogs, error } = await supabase.from('student_it_access').select('*');
    if (error) {
        console.error('Error fetching logs:', error);
        return;
    }

    console.log(`Found ${accessLogs.length} logs. Updating JSON credentials...`);

    let totalUpdates = 0;

    for (const log of accessLogs) {
        if (!log.credentials) continue;

        let changed = false;
        let credsStr = JSON.stringify(log.credentials);

        if (credsStr.includes('penkka')) {
            credsStr = credsStr.replace(/penkka\.edu/gi, 'penkka.fi')
                .replace(/penkka\.fi/gi, 'penkka.fi')
                .replace(/penkka/gi, 'penkka')
                .replace(/penkka\.fi/gi, 'penkka.fi')
                .replace(/penkka\.edu/gi, 'penkka.fi');
            changed = true;
        }

        if (changed) {
            const newCreds = JSON.parse(credsStr);
            console.log(`Updating credentials for student_it_access ID ${log.id}...`);

            const { error: updateError } = await supabase
                .from('student_it_access')
                .update({ credentials: newCreds })
                .eq('id', log.id);

            if (updateError) {
                console.error(`Failed to update ID ${log.id}:`, updateError);
            } else {
                totalUpdates++;
            }
        }
    }

    console.log(`Done. Updated ${totalUpdates} records in student_it_access.`);
}

main();
