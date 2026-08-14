import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    // Get one profile to see actual columns
    const { data } = await supabase.from('profiles').select('*').limit(1);
    if (data && data.length > 0) {
        console.log('Profile columns:', Object.keys(data[0]));
    } else {
        console.log('No profiles found, checking system_settings...');
        const { data: settings } = await supabase.from('system_settings').select('*').limit(1);
        if (settings && settings.length > 0) {
            console.log('System settings columns:', Object.keys(settings[0]));
        }
    }
}

main();