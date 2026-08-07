import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableCounts() {
    console.log('Checking table counts...\n');
    
    const tables = ['School', 'Department', 'Course', 'Subject', 'Faculty'];
    
    for (const table of tables) {
        try {
            const { count, error } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true });
            
            if (error) {
                console.error(`❌ Error checking ${table}:`, error.message);
            } else {
                console.log(`✅ ${table}: ${count} records`);
            }
        } catch (err) {
            console.error(`❌ Exception checking ${table}:`, err);
        }
    }
    
    // Also check for existing Cannoga College settings
    try {
        const { data, error } = await supabase
            .from('system_settings')
            .select('key, value')
            .in('key', ['institution_name', 'institution_type', 'city', 'province', 'country']);
        
        if (error) {
            console.error('❌ Error checking institution settings:', error.message);
        } else {
            console.log('\n🏫 Institution Settings:');
            for (const row of data) {
                console.log(`  ${row.key}: ${row.value}`);
            }
        }
    } catch (err) {
        console.error('❌ Exception checking institution settings:', err);
    }
}

checkTableCounts();