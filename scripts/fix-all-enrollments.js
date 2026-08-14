
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Basic .env parser
function loadEnv() {
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const [lineContent] = line.split('#'); // Remove comments
            const [key, ...valueParts] = lineContent.split('=');
            if (key && valueParts.length > 0) {
                process.env[key.trim()] = valueParts.join('=').trim().replace(/^"(.*)"$/, '$1');
            }
        });
    }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixHalfEnrolledStudents() {
    console.log('Searching for half-enrolled students...');

    // Find users with ENROLLED status but missing student record or wrong role
    // Excluding admins
    const { data: halfEnrolled, error: queryError } = await supabase.rpc('execute_sql', {
        query: `
            SELECT 
                a.user_id, 
                a.id as application_id,
                a.application_number, 
                p.email, 
                p.role,
                p.first_name,
                p.last_name,
                a.course_id
            FROM 
                applications a
            JOIN 
                profiles p ON a.user_id = p.id
            LEFT JOIN 
                students s ON a.user_id = s.user_id
            WHERE 
                a.status = 'ENROLLED' 
                AND p.role != 'ADMIN'
                AND (s.id IS NULL OR p.role != 'STUDENT');
        `
    });

    // If RPC fails or is not available, we use a slower JS approach
    let studentsToFix = halfEnrolled;
    if (queryError) {
        console.log('RPC failed, using JS fallback search...');
        const { data: apps } = await supabase.from('applications').select('*, profiles(*)').eq('status', 'ENROLLED');
        const { data: students } = await supabase.from('students').select('user_id');
        const studentIds = new Set(students.map(s => s.user_id));

        studentsToFix = apps.filter(a => {
            const profile = a.profiles;
            return profile.role !== 'ADMIN' && (!studentIds.has(a.user_id) || profile.role !== 'STUDENT');
        }).map(a => ({
            user_id: a.user_id,
            application_id: a.id,
            application_number: a.application_number,
            email: a.profiles.email,
            role: a.profiles.role,
            first_name: a.profiles.first_name,
            last_name: a.profiles.last_name,
            course_id: a.course_id
        }));
    }

    if (!studentsToFix || studentsToFix.length === 0) {
        console.log('No half-enrolled students found.');
        return;
    }

    console.log(`Found ${studentsToFix.length} students to fix.`);

    for (const student of studentsToFix) {
        console.log(`Fixing student: ${student.email} (${student.application_number})...`);

        // 1. Update Profile Role
        const { error: profileUpdateError } = await supabase
            .from('profiles')
            .update({
                role: 'STUDENT',
                student_id: student.application_number // Using application number as Student ID if missing
            })
            .eq('id', student.user_id);

        if (profileUpdateError) {
            console.error(`Error updating profile role for ${student.email}:`, profileUpdateError.message);
        } else {
            console.log(`Profile role updated for ${student.email}.`);
        }

        // 2. Create/Update Student Record
        const institutionalEmail = `${student.first_name.toLowerCase()}.${student.last_name.toLowerCase()}@cannogacollege.ca`;

        const studentData = {
            user_id: student.user_id,
            student_id: student.application_number,
            application_id: student.application_id,
            program_id: student.course_id,
            institutional_email: institutionalEmail,
            personal_email: student.email,
            enrollment_status: 'ACTIVE',
            start_date: new Date().toISOString(),
            expected_graduation_date: new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toISOString(),
            updated_at: new Date().toISOString()
        };

        const { error: upsertError } = await supabase
            .from('students')
            .upsert(studentData, { onConflict: 'user_id' });

        if (upsertError) {
            // Fallback to update/insert
            const { data: existing } = await supabase.from('students').select('id').eq('user_id', student.user_id).maybeSingle();
            if (existing) {
                await supabase.from('students').update(studentData).eq('user_id', student.user_id);
            } else {
                await supabase.from('students').insert({ ...studentData, id: crypto.randomUUID(), created_at: new Date().toISOString() });
            }
            console.log(`Student record processed (fallback) for ${student.email}.`);
        } else {
            console.log(`Student record upserted for ${student.email}.`);
        }
    }

    console.log('All half-enrolled students have been processed.');
}

fixHalfEnrolledStudents().catch(console.error);
