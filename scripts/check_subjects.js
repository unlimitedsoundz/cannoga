require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

// Use schema: 'public' explicitly to help with schema cache
const c = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    db: { schema: 'public' }
});

(async () => {
    // 1. Get all students
    const { data: students } = await c.from('students').select('id,program_id,user_id');
    console.log('Students: ' + students?.length);

    // 2. Get active registration window
    const { data: regWindow } = await c.from('registration_windows')
        .select('id,semester_id')
        .eq('status', 'OPEN')
        .order('open_at', { ascending: false })
        .limit(1)
        .single();

    if (!regWindow) {
        console.log('No open registration window!');
        return;
    }
    console.log('Semester: ' + regWindow.semester_id);

    let totalEnrolled = 0;

    for (const student of students || []) {
        // 3. Get current enrollments
        const { data: enrollments } = await c.from('module_enrollments')
            .select('subject_id')
            .eq('student_id', student.id)
            .eq('semester_id', regWindow.semester_id)
            .eq('status', 'REGISTERED');

        const enrolledIds = new Set((enrollments || []).map(e => e.subject_id));

        // Get enrolled credits
        let currentECTS = 0;
        if (enrolledIds.size > 0) {
            const { data: enrolledSubs } = await c.from('Subject')
                .select('creditUnits')
                .in('id', Array.from(enrolledIds));
            currentECTS = (enrolledSubs || []).reduce((s, x) => s + (x.creditUnits || 0), 0);
        }

        if (currentECTS >= 35) {
            console.log('OK: ' + student.id.slice(0, 8) + ' = ' + currentECTS + ' ECTS');
            continue;
        }

        // 4. Get available subjects
        const { data: available } = await c.from('Subject')
            .select('id,code,creditUnits')
            .eq('courseId', student.program_id)
            .order('code');

        const unenrolled = (available || []).filter(s => !enrolledIds.has(s.id));

        // 5. Enroll until 35+ ECTS
        let addedECTS = 0;
        let addedCount = 0;

        for (const sub of unenrolled) {
            if (currentECTS + addedECTS >= 35) break;

            const { error } = await c.from('module_enrollments').upsert({
                student_id: student.id,
                subject_id: sub.id,
                semester_id: regWindow.semester_id,
                status: 'REGISTERED',
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'student_id, subject_id, semester_id'
            });

            if (error) {
                console.log('ERR: ' + student.id.slice(0, 8) + ' sub=' + sub.code + ' - ' + error.message);
            } else {
                addedECTS += sub.creditUnits || 0;
                addedCount++;
            }
        }

        if (addedCount > 0) {
            totalEnrolled += addedCount;
            console.log('ENROLLED: ' + student.id.slice(0, 8) + ' +' + addedCount + ' courses (+' + addedECTS + ' ECTS, was ' + currentECTS + ', now ' + (currentECTS + addedECTS) + ')');
        } else {
            console.log('SKIP: ' + student.id.slice(0, 8) + ' no subjects available (' + currentECTS + ' ECTS)');
        }
    }

    console.log('\nDone! Total new enrollments: ' + totalEnrolled);
})();
