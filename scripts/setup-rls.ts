// @ts-ignore
import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const connectionString = 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';

const client = new Client({ connectionString });

async function main() {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected!\n');

    try {
        // RLS Policies for faq_pages
        console.log('Setting up RLS for faq_pages...');
        await client.query(`ALTER TABLE faq_pages ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "FAQ pages are viewable by everyone" ON faq_pages;`);
        await client.query(`CREATE POLICY "FAQ pages are viewable by everyone" ON faq_pages FOR SELECT USING (true);`);
        await client.query(`DROP POLICY IF EXISTS "Admins can manage FAQ pages" ON faq_pages;`);
        await client.query(`CREATE POLICY "Admins can manage FAQ pages" ON faq_pages FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));`);
        console.log('✅ faq_pages RLS done\n');

        // RLS Policies for faq
        console.log('Setting up RLS for faq...');
        await client.query(`ALTER TABLE faq ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "FAQ are viewable by everyone" ON faq;`);
        await client.query(`CREATE POLICY "FAQ are viewable by everyone" ON faq FOR SELECT USING (true);`);
        await client.query(`DROP POLICY IF EXISTS "Admins can manage FAQ" ON faq;`);
        await client.query(`CREATE POLICY "Admins can manage FAQ" ON faq FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));`);
        console.log('✅ faq RLS done\n');

        // RLS Policies for semesters
        console.log('Setting up RLS for semesters...');
        await client.query(`ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "Semesters are viewable by everyone" ON semesters;`);
        await client.query(`CREATE POLICY "Semesters are viewable by everyone" ON semesters FOR SELECT USING (true);`);
        await client.query(`DROP POLICY IF EXISTS "Admins can manage semesters" ON semesters;`);
        await client.query(`CREATE POLICY "Admins can manage semesters" ON semesters FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR')));`);
        console.log('✅ semesters RLS done\n');

        // RLS Policies for modules
        console.log('Setting up RLS for modules...');
        await client.query(`ALTER TABLE modules ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "Modules are viewable by everyone" ON modules;`);
        await client.query(`CREATE POLICY "Modules are viewable by everyone" ON modules FOR SELECT USING (true);`);
        await client.query(`DROP POLICY IF EXISTS "Admins can manage modules" ON modules;`);
        await client.query(`CREATE POLICY "Admins can manage modules" ON modules FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR')));`);
        console.log('✅ modules RLS done\n');

        // RLS Policies for module_enrollments
        console.log('Setting up RLS for module_enrollments...');
        await client.query(`ALTER TABLE module_enrollments ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "Students view own enrollments" ON module_enrollments;`);
        await client.query(`CREATE POLICY "Students view own enrollments" ON module_enrollments FOR SELECT USING (EXISTS (SELECT 1 FROM students WHERE students.id = module_enrollments.student_id AND students.user_id = auth.uid()));`);
        await client.query(`DROP POLICY IF EXISTS "Registrars view all enrollments" ON module_enrollments;`);
        await client.query(`CREATE POLICY "Registrars view all enrollments" ON module_enrollments FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR')));`);
        await client.query(`DROP POLICY IF EXISTS "Instructors view enrollments" ON module_enrollments;`);
        await client.query(`CREATE POLICY "Instructors view enrollments" ON module_enrollments FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'INSTRUCTOR'));`);
        console.log('✅ module_enrollments RLS done\n');

        // RLS Policies for class_sessions
        console.log('Setting up RLS for class_sessions...');
        await client.query(`ALTER TABLE class_sessions ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "Class sessions are viewable by everyone" ON class_sessions;`);
        await client.query(`CREATE POLICY "Class sessions are viewable by everyone" ON class_sessions FOR SELECT USING (true);`);
        await client.query(`DROP POLICY IF EXISTS "Admins can manage class sessions" ON class_sessions;`);
        await client.query(`CREATE POLICY "Admins can manage class sessions" ON class_sessions FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR')));`);
        console.log('✅ class_sessions RLS done\n');

        // RLS Policies for registration_windows
        console.log('Setting up RLS for registration_windows...');
        await client.query(`ALTER TABLE registration_windows ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "Registration windows are viewable by everyone" ON registration_windows;`);
        await client.query(`CREATE POLICY "Registration windows are viewable by everyone" ON registration_windows FOR SELECT USING (true);`);
        await client.query(`DROP POLICY IF EXISTS "Admins can manage registration windows" ON registration_windows;`);
        await client.query(`CREATE POLICY "Admins can manage registration windows" ON registration_windows FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR')));`);
        console.log('✅ registration_windows RLS done\n');

        // RLS Policies for audit_logs
        console.log('Setting up RLS for audit_logs...');
        await client.query(`ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;`);
        await client.query(`CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));`);
        console.log('✅ audit_logs RLS done\n');

        // RLS Policies for housing_buildings
        console.log('Setting up RLS for housing_buildings...');
        await client.query(`ALTER TABLE housing_buildings ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "Students can view housing buildings" ON housing_buildings;`);
        await client.query(`CREATE POLICY "Students can view housing buildings" ON housing_buildings FOR SELECT TO authenticated USING (true);`);
        await client.query(`DROP POLICY IF EXISTS "Admins manage housing buildings" ON housing_buildings;`);
        await client.query(`CREATE POLICY "Admins manage housing buildings" ON housing_buildings FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR')));`);
        console.log('✅ housing_buildings RLS done\n');

        // RLS Policies for housing_rooms
        console.log('Setting up RLS for housing_rooms...');
        await client.query(`ALTER TABLE housing_rooms ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "Students can view housing rooms" ON housing_rooms;`);
        await client.query(`CREATE POLICY "Students can view housing rooms" ON housing_rooms FOR SELECT TO authenticated USING (true);`);
        await client.query(`DROP POLICY IF EXISTS "Admins manage rooms" ON housing_rooms;`);
        await client.query(`CREATE POLICY "Admins manage rooms" ON housing_rooms FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR')));`);
        console.log('✅ housing_rooms RLS done\n');

        // RLS Policies for housing_applications
        console.log('Setting up RLS for housing_applications...');
        await client.query(`ALTER TABLE housing_applications ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "Students view own applications" ON housing_applications;`);
        await client.query(`CREATE POLICY "Students view own applications" ON housing_applications FOR SELECT TO authenticated USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));`);
        await client.query(`DROP POLICY IF EXISTS "Students can create applications" ON housing_applications;`);
        await client.query(`CREATE POLICY "Students can create applications" ON housing_applications FOR INSERT TO authenticated WITH CHECK (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));`);
        await client.query(`DROP POLICY IF EXISTS "Admins manage applications" ON housing_applications;`);
        await client.query(`CREATE POLICY "Admins manage applications" ON housing_applications FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR')));`);
        console.log('✅ housing_applications RLS done\n');

        // RLS Policies for housing_assignments
        console.log('Setting up RLS for housing_assignments...');
        await client.query(`ALTER TABLE housing_assignments ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "Students view own assignments" ON housing_assignments;`);
        await client.query(`CREATE POLICY "Students view own assignments" ON housing_assignments FOR SELECT TO authenticated USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));`);
        await client.query(`DROP POLICY IF EXISTS "Admins manage assignments" ON housing_assignments;`);
        await client.query(`CREATE POLICY "Admins manage assignments" ON housing_assignments FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR')));`);
        console.log('✅ housing_assignments RLS done\n');

        // RLS Policies for housing_deposits
        console.log('Setting up RLS for housing_deposits...');
        await client.query(`ALTER TABLE housing_deposits ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "Students view own deposits" ON housing_deposits;`);
        await client.query(`CREATE POLICY "Students view own deposits" ON housing_deposits FOR SELECT TO authenticated USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));`);
        await client.query(`DROP POLICY IF EXISTS "Admins manage deposits" ON housing_deposits;`);
        await client.query(`CREATE POLICY "Admins manage deposits" ON housing_deposits FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR')));`);
        console.log('✅ housing_deposits RLS done\n');

        // RLS Policies for housing_invoices
        console.log('Setting up RLS for housing_invoices...');
        await client.query(`ALTER TABLE housing_invoices ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "Students can view their own invoices" ON housing_invoices;`);
        await client.query(`CREATE POLICY "Students can view their own invoices" ON housing_invoices FOR SELECT TO authenticated USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));`);
        await client.query(`DROP POLICY IF EXISTS "Admins can view and manage all invoices" ON housing_invoices;`);
        await client.query(`CREATE POLICY "Admins can view and manage all invoices" ON housing_invoices FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));`);
        console.log('✅ housing_invoices RLS done\n');

        // RLS Policies for housing_invoice_items
        console.log('Setting up RLS for housing_invoice_items...');
        await client.query(`ALTER TABLE housing_invoice_items ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "Students can view their own invoice items" ON housing_invoice_items;`);
        await client.query(`CREATE POLICY "Students can view their own invoice items" ON housing_invoice_items FOR SELECT TO authenticated USING (invoice_id IN (SELECT id FROM housing_invoices WHERE student_id IN (SELECT id FROM students WHERE user_id = auth.uid())));`);
        await client.query(`DROP POLICY IF EXISTS "Admins can manage invoice items" ON housing_invoice_items;`);
        await client.query(`CREATE POLICY "Admins can manage invoice items" ON housing_invoice_items FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));`);
        console.log('✅ housing_invoice_items RLS done\n');

        // RLS Policies for housing_payments
        console.log('Setting up RLS for housing_payments...');
        await client.query(`ALTER TABLE housing_payments ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "Students can view their own payments" ON housing_payments;`);
        await client.query(`CREATE POLICY "Students can view their own payments" ON housing_payments FOR SELECT TO authenticated USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));`);
        await client.query(`DROP POLICY IF EXISTS "Admins can view and manage payments" ON housing_payments;`);
        await client.query(`CREATE POLICY "Admins can view and manage payments" ON housing_payments FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));`);
        console.log('✅ housing_payments RLS done\n');

        // RLS Policies for housing_audit_logs
        console.log('Setting up RLS for housing_audit_logs...');
        await client.query(`ALTER TABLE housing_audit_logs ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "Admins can view audit logs" ON housing_audit_logs;`);
        await client.query(`CREATE POLICY "Admins can view audit logs" ON housing_audit_logs FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));`);
        console.log('✅ housing_audit_logs RLS done\n');

        // RLS Policies for it_assets
        console.log('Setting up RLS for it_assets...');
        await client.query(`ALTER TABLE it_assets ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "Users view IT assets" ON it_assets;`);
        await client.query(`CREATE POLICY "Users view IT assets" ON it_assets FOR SELECT TO authenticated USING (true);`);
        await client.query(`DROP POLICY IF EXISTS "Admins manage IT assets" ON it_assets;`);
        await client.query(`CREATE POLICY "Admins manage IT assets" ON it_assets FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));`);
        console.log('✅ it_assets RLS done\n');

        // RLS Policies for student_it_access
        console.log('Setting up RLS for student_it_access...');
        await client.query(`ALTER TABLE student_it_access ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "Students view own IT access" ON student_it_access;`);
        await client.query(`CREATE POLICY "Students view own IT access" ON student_it_access FOR SELECT TO authenticated USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));`);
        await client.query(`DROP POLICY IF EXISTS "Admins manage IT access" ON student_it_access;`);
        await client.query(`CREATE POLICY "Admins manage IT access" ON student_it_access FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));`);
        console.log('✅ student_it_access RLS done\n');

        console.log('✅ All RLS policies set up successfully!');
    } finally {
        await client.end();
    }
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});