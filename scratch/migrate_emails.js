const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
    // 1. Fetch all students with non-cannogacollege.ca institutional emails
    const { data: students, error } = await s
        .from('students')
        .select('id, student_id, user_id, institutional_email')
        .not('institutional_email', 'ilike', '%cannogacollege.ca%');

    if (error) { console.error('Fetch error:', error); process.exit(1); }
    console.log(`Found ${students.length} students with legacy institutional emails.\n`);

    // Track used emails to avoid collisions
    const usedEmails = new Set();
    let updated = 0, failed = 0;

    for (const st of students) {
        const oldEmail = st.institutional_email || '';
        
        // Extract local part (before @), strip spaces
        const localPart = oldEmail.split('@')[0].replace(/\s+/g, '').toLowerCase();
        
        // Build new email
        let newEmail = `${localPart}@cannogacollege.ca`;
        
        // Handle collisions by appending a counter
        let counter = 1;
        while (usedEmails.has(newEmail)) {
            newEmail = `${localPart}${counter}@cannogacollege.ca`;
            counter++;
        }
        usedEmails.add(newEmail);

        console.log(`  ${st.student_id}: ${oldEmail} → ${newEmail}`);

        // Update students table
        const { error: sErr } = await s
            .from('students')
            .update({ institutional_email: newEmail })
            .eq('id', st.id);

        if (sErr) {
            console.error(`  ❌ students update failed: ${sErr.message}`);
            failed++;
            continue;
        }

        updated++;
    }

    // 2. Fix the remaining SYK-format student ID
    console.log('\n--- Fixing remaining SYK student ID ---');
    const { data: sykStudent } = await s
        .from('students')
        .select('id, student_id, user_id, created_at')
        .like('student_id', 'SYK%')
        .single();

    if (sykStudent) {
        const year = new Date(sykStudent.created_at).getFullYear();
        const uniqueNum = String(Math.floor(10000 + Math.random() * 90000));
        const newId = `CNC${year}${uniqueNum}`;

        const { error: idErr } = await s.from('students').update({ student_id: newId }).eq('id', sykStudent.id);
        const { error: profErr } = await s.from('profiles').update({ student_id: newId, updated_at: new Date().toISOString() }).eq('id', sykStudent.user_id);

        if (!idErr) {
            console.log(`  ${sykStudent.student_id} → ${newId} ${profErr ? '(profile update failed)' : ''}`);
        } else {
            console.error(`  ❌ SYK ID update failed: ${idErr.message}`);
        }
    } else {
        console.log('  No SYK student IDs found.');
    }

    console.log(`\n✅ Done: ${updated} emails updated, ${failed} failed.`);
})().catch(console.error);
