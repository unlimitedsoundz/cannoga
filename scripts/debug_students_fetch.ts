import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role to bypass RLS for initial test
);

async function debugStudents() {
    console.log("--- Testing 'students' table fetch ---");
    const { data: students, error: studentError } = await supabase
        .from('students')
        .select(`
        *,
        user: profiles!user_id(first_name, last_name, email),
        program: Course(title)
    `)
        .limit(5);

    if (studentError) {
        console.error("Error with full query:", studentError);

        console.log("\n--- Testing simple 'students' fetch ---");
        const { data: simple, error: simpleError } = await supabase.from('students').select('*').limit(5);
        if (simpleError) console.error("Simple fetch error:", simpleError);
        else console.log("Simple fetch success, count:", simple?.length);
    } else {
        console.log("Full query success, count:", students?.length);
        console.log("First student record:", JSON.stringify(students?.[0], null, 2));
    }
}

debugStudents();
