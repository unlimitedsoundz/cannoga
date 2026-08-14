
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

async function fixDenciaAde() {
    const userId = '1a716e56-afcd-4673-af0b-1fb27aaa6539';
    const studentId = 'SK7878121';

    console.log(`Fixing data for Dencia Ade (${userId})...`);

    // 1. Fetch application to get info
    const { data: application, error: appError } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'ENROLLED')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (appError || !application) {
        console.error('Error fetching enrolled application:', appError?.message || 'Not found');
        // Let's try without the ENROLLED filter just in case
        console.log('Retrying without ENROLLED filter...');
        const { data: appAny, error: appAnyError } = await supabase
            .from('applications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (appAnyError || !appAny) {
            console.error('Could not find any application for this user.');
            return;
        }
        application = appAny;
    }

    // 2. Update Profile Role
    const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
            role: 'STUDENT',
            student_id: studentId
        })
        .eq('id', userId);

    if (profileUpdateError) {
        console.error('Error updating profile role:', profileUpdateError.message);
    } else {
        console.log('Profile role updated to STUDENT.');
    }

    // 3. Create/Update Student Record
    const institutionalEmail = `${application.personal_info.firstName.toLowerCase()}.${application.personal_info.lastName.toLowerCase()}@cannogacollege.ca`;

    // Check if record exists
    const { data: existingStudent } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

    const studentData = {
        user_id: userId,
        student_id: studentId,
        application_id: application.id,
        program_id: application.course_id,
        institutional_email: institutionalEmail,
        personal_email: application.contact_details.email,
        enrollment_status: 'ACTIVE',
        start_date: new Date().toISOString(),
        expected_graduation_date: new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toISOString(),
        updated_at: new Date().toISOString()
    };

    let error;
    if (existingStudent) {
        console.log('Existing student record found. Updating...');
        const { error: updateError } = await supabase
            .from('students')
            .update(studentData)
            .eq('user_id', userId);
        error = updateError;
    } else {
        console.log('No student record found. Inserting...');
        const { error: insertError } = await supabase
            .from('students')
            .insert({
                ...studentData,
                id: crypto.randomUUID(), // Manual ID generation if needed, but table might have default
                created_at: new Date().toISOString()
            });
        error = insertError;
    }

    if (error) {
        console.error('Error updating/inserting student record:', error.message);
    } else {
        console.log('Student record processed successfully.');
    }
}

fixDenciaAde().catch(console.error);
