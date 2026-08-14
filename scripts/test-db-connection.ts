import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing database connection...');
    
    // Try to fetch system settings
    const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .limit(5);
    
    if (error) {
        console.error('Database connection failed:', error);
        return false;
    }
    
    console.log('Database connection successful!');
    console.log(`Found ${data.length} system settings`);
    if (data.length > 0) {
        console.log('Sample setting:', data[0]);
    }
    return true;
}

testConnection().then(success => {
    if (!success) process.exit(1);
});