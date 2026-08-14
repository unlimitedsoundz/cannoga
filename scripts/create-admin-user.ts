import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
    const email = 'unlymitedsoundz@gmail.com';
    const password = 'Chichichi21#';
    
    console.log('Creating admin user...');
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
            first_name: 'Admin',
            last_name: 'User'
        }
    } as any);
    
    if (authError) {
        console.error('Error creating auth user:', authError);
        return;
    }
    
    console.log('✅ Auth user created:', authData.user.id);
    
    // Create profile
    const { error: profileError } = await supabase.from('profiles').upsert({
        id: authData.user.id,
        email: email,
        first_name: 'Admin',
        last_name: 'User',
        role: 'ADMIN',
        country_of_residence: 'Canada'
    }, { onConflict: 'id' });
    
    if (profileError) {
        console.error('Error creating profile:', profileError);
    } else {
        console.log('✅ Admin profile created');
    }
    
    console.log('\n=== ADMIN USER CREATED ===');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role: ADMIN');
    console.log('User ID:', authData.user.id);
    console.log('\nYou can now log in at /portal/account/admin-login');
}

createAdminUser().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});