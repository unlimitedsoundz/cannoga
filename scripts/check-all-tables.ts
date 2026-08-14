import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const tables = [
        'profiles',
        'applications',
        'application_documents',
        'admission_offers',
        'tuition_payments',
        'students',
        'semesters',
        'modules',
        'module_enrollments',
        'class_sessions',
        'registration_windows',
        'audit_logs',
        'housing_buildings',
        'housing_rooms',
        'housing_applications',
        'housing_assignments',
        'housing_deposits',
        'housing_invoices',
        'housing_invoice_items',
        'housing_payments',
        'housing_audit_logs',
        'it_assets',
        'student_it_access',
        'faq_pages',
        'faq',
    ];
    
    for (const table of tables) {
        try {
            const { count, error } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true });
            
            if (error) {
                console.log(`❌ ${table}: ${error.message}`);
            } else {
                console.log(`✅ ${table}: ${count} rows`);
            }
        } catch (err) {
            console.log(`❌ ${table}: ${err}`);
        }
    }
}

main();