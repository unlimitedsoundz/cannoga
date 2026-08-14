import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const email = 'unlymitedsoundz@gmail.com';
    
    console.log('Checking admin user...\n');
    
    // Check profiles table
    const { data: profiles } = await supabase.from('profiles').select('*').eq('email', email);
    console.log('Profiles found:', profiles);
    
    // Check auth users
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
        console.error('Error listing users:', authError);
    } else {
        const user = authData.users.find(u => u.email === email);
        console.log('\nAuth user found:', user ? { id: user.id, email: user.email } : 'Not found');
    }
}

main();