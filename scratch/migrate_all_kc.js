const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function generateCncId(createdAt) {
    const year = new Date(createdAt || Date.now()).getFullYear();
    const uniqueNum = String(Math.floor(10000 + Math.random() * 90000));
    return `CNC${year}${uniqueNum}`;
}

(async () => {
    // Fetch all profiles with legacy-format students
    const { data: profiles, error } = await s
        .from('profiles')
        .select('id, student_id, created_at')
        .like('student_id', 'KC%');

    if (error) { console.error('Fetch error:', error); process.exit(1); }
    console.log(`Found ${profiles.length} profiles with KC legacy IDs.\n`);

    const usedIds = new Set();
    let updated = 0, failed = 0;

    for (const profile of profiles) {
        let newId;
        do {
            newId = generateCncId(profile.created_at);
        } while (usedIds.has(newId));
        usedIds.add(newId);

        console.log(`  Profile ${profile.id}: ${profile.student_id} → ${newId}`);

        // We bypass trigger by calling a raw SQL via RPC if we had it.
        // Let's try to update using standard REST. If trigger overwrites it, we'll see KC again.
        const { data: result, error: pErr } = await s
            .from('profiles')
            .update({ student_id: newId, updated_at: new Date().toISOString() })
            .eq('id', profile.id)
            .select('student_id')
            .single();

        if (pErr) {
            console.error(`  ⚠️  profiles update failed for ${profile.id}: ${pErr.message}`);
            failed++;
        } else {
            console.log(`    Saved as: ${result.student_id}`);
            if (result.student_id === newId) {
                updated++;
            } else {
                console.log(`    ❌ Trigger overwrote it back to ${result.student_id}`);
                failed++;
            }
        }
        
        // Also update students table if exists
        await s.from('students').update({ student_id: newId }).eq('user_id', profile.id);
    }

    console.log(`\n✅ Done: ${updated} updated, ${failed} failed.`);
})().catch(console.error);
