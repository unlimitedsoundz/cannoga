import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
    const tables = [
        'profiles',
        'tuition_payments',
        'modules',
        'applications',
        'application_documents',
        'students',
        'admission_offers',
        'faq',
        'faq_pages',
        'housing_applications',
        'housing_assignments',
        'housing_buildings',
        'housing_deposits',
        'housing_invoice_items',
        'housing_invoices',
        'housing_rooms',
        'housing_payments',
        'it_assets',
        'student_it_access',
        'semesters',
        'module_enrollments',
        'class_sessions',
        'registration_windows',
        'audit_logs',
    ];

    console.log('Checking table existence...\n');
    
    for (const table of tables) {
        try {
            const { count, error } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true });
            
            if (error) {
                console.log(`❌ ${table}: ${error.message}`);
            } else {
                console.log(`✅ ${table}: exists (${count} rows)`);
            }
        } catch (err) {
            console.log(`❌ ${table}: exception - ${err}`);
        }
    }
}

checkTables();