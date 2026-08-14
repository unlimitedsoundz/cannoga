
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncSubjectsToModules() {
    console.log('🚀 Syncing Subject data to modules table...');

    // 1. Fetch all subjects with their course details (to get department)
    const { data: subjects, error: sError } = await supabase
        .from('Subject')
        .select(`
            id,
            code,
            name,
            creditUnits,
            course:Course (
                id,
                departmentId
            )
        `);

    if (sError) {
        console.error('Error fetching subjects:', sError);
        return;
    }

    console.log(`🔍 Found ${subjects.length} subjects to potential sync.`);

    let syncedCount = 0;
    let errorCount = 0;

    // Reset log file
    fs.writeFileSync('sync_error.log', 'Sync Errors Log:\n');

    for (const subject of subjects) {
        // Handle course relation which might be single object or array depending on client config
        // Use type assertion or checking to be safe
        let deptId = null;
        if (subject.course) {
            if (Array.isArray(subject.course)) {
                deptId = subject.course[0]?.departmentId;
            } else {
                deptId = (subject.course as any).departmentId;
            }
        }

        // Map Subject to module payload
        const payload = {
            code: subject.code,
            title: subject.name,
            credits: subject.creditUnits,
            // department_id: deptId || null, // ERROR: Column missing in DB schema cache
            capacity: 30, // Default capacity
            description: `Imported from Subject: ${subject.name}`,
        };

        // Upsert based on code (assuming code is unique in modules)
        const { error } = await supabase
            .from('modules')
            .upsert(payload, { onConflict: 'code' });

        if (error) {
            const errorMsg = `❌ Error syncing ${subject.code}: ${JSON.stringify(error)}\n`;
            // console.error(errorMsg.trim()); // Reduce noise in console
            fs.appendFileSync('sync_error.log', errorMsg);
            errorCount++;
        } else {
            // console.log(`✅ Synced ${subject.code}`); // Reduce noise
            syncedCount++;
        }
    }

    console.log(`\n🎉 Sync complete!`);
    console.log(`✅ Synced/Updated: ${syncedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`Make sure to check sync_error.log if there are errors.`);
}

syncSubjectsToModules();
