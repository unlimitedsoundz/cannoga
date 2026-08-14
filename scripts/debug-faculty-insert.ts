
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugFacultyInsert() {
    console.log('Debugging Faculty Insert...');

    // 1. Get a valid School ID
    const { data: schools, error: sErr } = await supabase.from('School').select('id, name, slug').limit(1);
    if (sErr) {
        console.error('Error fetching schools:', sErr);
        return;
    }
    if (!schools || schools.length === 0) {
        console.error('No schools found.');
        return;
    }
    const school = schools[0];
    console.log(`Using School: ${school.name} (${school.id})`);

    // 2. Prepare dummy data
    // Note: Checking keys based on what we used in actions.ts: name, role, bio, email, schoolId, departmentId, imageUrl
    const dummyFaculty = {
        name: 'Debug Test User',
        role: 'Test Role',
        bio: 'This is a test bio.',
        email: `test-${Date.now()}@test.com`,
        schoolId: school.id,
        // departmentId: null, // Leaving null for now
        imageUrl: null
    };

    console.log('Attempting insert with:', dummyFaculty);

    const { data, error } = await supabase.from('Faculty').insert(dummyFaculty).select();

    if (error) {
        console.error('❌ Insert Failed:', error);
        console.error('Error Code:', error.code);
        console.error('Error Details:', error.details);
        console.error('Error Hint:', error.hint);
        console.error('Error Message:', error.message);
    } else {
        console.log('✅ Insert Successful:', data);

        // Clean up
        const { error: delErr } = await supabase.from('Faculty').delete().eq('id', data[0].id);
        if (delErr) console.error('Error cleaning up test user:', delErr);
        else console.log('Cleaned up test user.');
    }
}

debugFacultyInsert();
