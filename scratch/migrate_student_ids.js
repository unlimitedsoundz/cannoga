const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function generateCncId(createdAt) {
    const year = new Date(createdAt).getFullYear();
    const uniqueNum = String(Math.floor(10000 + Math.random() * 90000));
    return `CNC${year}${uniqueNum}`;
}

(async () => {
    // Fetch all legacy-format students
    const { data: students, error } = await s
        .from('students')
        .select('id, student_id, user_id, created_at')
        .or('student_id.like.KC%,student_id.like.KU%,student_id.like.SK%');

    if (error) { console.error('Fetch error:', error); process.exit(1); }
    console.log(`Found ${students.length} students with legacy IDs.\n`);

    // Track used IDs to avoid collisions
    const usedIds = new Set();
    let updated = 0, failed = 0;

    for (const student of students) {
        // Generate unique CNC ID
        let newId;
        do {
            newId = generateCncId(student.created_at);
        } while (usedIds.has(newId));
        usedIds.add(newId);

        console.log(`  ${student.student_id} → ${newId}  (user: ${student.user_id})`);

        // Update students table
        const { error: sErr } = await s
            .from('students')
            .update({ student_id: newId })
            .eq('id', student.id);

        if (sErr) {
            console.error(`  ❌ students update failed: ${sErr.message}`);
            failed++;
            continue;
        }

        // Update profiles table (same user)
        const { error: pErr } = await s
            .from('profiles')
            .update({ student_id: newId, updated_at: new Date().toISOString() })
            .eq('id', student.user_id);

        if (pErr) {
            console.error(`  ⚠️  profiles update failed for ${student.user_id}: ${pErr.message}`);
            // Non-blocking — student record is already updated
        }

        updated++;
    }

    console.log(`\n✅ Done: ${updated} updated, ${failed} failed.`);
})().catch(console.error);
