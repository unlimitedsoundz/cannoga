import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCounts() {
    const tables = [
        'faq_pages',
        'faq',
        'semesters',
        'modules',
        'housing_buildings',
        'housing_rooms',
        'it_assets',
        'profiles',
        'applications',
        'application_documents',
        'students',
        'admission_offers',
        'tuition_payments',
        'housing_applications',
        'housing_assignments',
        'housing_deposits',
        'housing_invoices',
        'housing_invoice_items',
        'housing_payments',
        'student_it_access',
    ];

    console.log('Table row counts:\n');
    
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
            console.log(`❌ ${table}: exception - ${err}`);
        }
    }
}

checkCounts();