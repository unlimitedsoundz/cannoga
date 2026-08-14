import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Use anon key like the frontend does
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const email = 'unlymitedsoundz@gmail.com';
    const password = 'Chichichi21#';
    
    console.log('Simulating admin login...\n');
    
    // Step 1: Sign in
    console.log('1. Attempting sign in...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password
    });
    
    if (authError) {
        console.error('Auth error:', authError);
        return;
    }
    
    console.log('✅ Auth success:', authData.user.id);
    
    // Step 2: Query profile (like admin login page does)
    console.log('\n2. Querying profile...');
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email, role, first_name, avatar_url')
        .eq('id', authData.user.id)
        .single();
    
    console.log('Profile query result:', { profile, profileError });
    
    if (profileError || profile?.role !== 'ADMIN') {
        console.log('\n❌ Access denied - profile role:', profile?.role);
    } else {
        console.log('\n✅ Admin access granted');
    }
    
    // Step 3: Sign out
    await supabase.auth.signOut();
}

main();