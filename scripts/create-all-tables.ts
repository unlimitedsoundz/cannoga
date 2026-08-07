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
        // Create profiles table
        console.log('Creating profiles table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS public.profiles (
                id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                first_name TEXT,
                last_name TEXT,
                role TEXT DEFAULT 'APPLICANT',
                country_of_residence TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);
        console.log('✅ profiles table created\n');

        // Create applications table
        console.log('Creating applications table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS public.applications (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
                course_id TEXT REFERENCES public."Course"(id) ON DELETE SET NULL,
                status TEXT DEFAULT 'DRAFT',
                personal_info JSONB,
                contact_details JSONB,
                education_history JSONB,
                motivation JSONB,
                language_proficiency JSONB,
                submitted_at TIMESTAMPTZ,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);
        console.log('✅ applications table created\n');

        // Create application_documents table
        console.log('Creating application_documents table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS public.application_documents (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
                type TEXT NOT NULL,
                url TEXT NOT NULL,
                name TEXT NOT NULL,
                uploaded_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);
        console.log('✅ application_documents table created\n');

        // Create admission_offers table
        console.log('Creating admission_offers table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS public.admission_offers (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
                tuition_fee DECIMAL(10, 2) NOT NULL,
                currency TEXT DEFAULT 'CAD',
                payment_deadline DATE,
                document_url TEXT,
                status TEXT DEFAULT 'PENDING',
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);
        console.log('✅ admission_offers table created\n');

        // Create tuition_payments table
        console.log('Creating tuition_payments table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS public.tuition_payments (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                offer_id UUID REFERENCES public.admission_offers(id) ON DELETE CASCADE NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                status TEXT DEFAULT 'INITIATED',
                transaction_reference TEXT,
                payment_method TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);
        console.log('✅ tuition_payments table created\n');

        // Create students table
        console.log('Creating students table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS "students" (
                "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
                "user_id" UUID NOT NULL,
                "student_id" TEXT NOT NULL UNIQUE,
                "application_id" UUID NOT NULL UNIQUE,
                "program_id" TEXT NOT NULL,
                "enrollment_status" TEXT NOT NULL DEFAULT 'ACTIVE',
                "institutional_email" TEXT NOT NULL UNIQUE,
                "personal_email" TEXT,
                "start_date" TIMESTAMP(3) NOT NULL,
                "expected_graduation_date" TIMESTAMP(3) NOT NULL,
                "lms_access_data" JSONB DEFAULT '{}',
                "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "students_pkey" PRIMARY KEY ("id")
            );
        `);
        console.log('✅ students table created\n');

        // Enable RLS on profiles
        console.log('Setting up RLS for profiles...');
        await client.query(`ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;`);
        await client.query(`CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);`);
        await client.query(`DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;`);
        await client.query(`CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);`);
        await client.query(`DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;`);
        await client.query(`CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);`);
        console.log('✅ profiles RLS done\n');

        // Enable RLS on applications
        console.log('Setting up RLS for applications...');
        await client.query(`ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "Applicants can view own applications" ON public.applications;`);
        await client.query(`CREATE POLICY "Applicants can view own applications" ON public.applications FOR SELECT USING (auth.uid() = user_id);`);
        await client.query(`DROP POLICY IF EXISTS "Applicants can insert own applications" ON public.applications;`);
        await client.query(`CREATE POLICY "Applicants can insert own applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = user_id);`);
        await client.query(`DROP POLICY IF EXISTS "Applicants can update own DRAFT applications" ON public.applications;`);
        await client.query(`CREATE POLICY "Applicants can update own DRAFT applications" ON public.applications FOR UPDATE USING (auth.uid() = user_id AND status = 'DRAFT') WITH CHECK (auth.uid() = user_id AND (status = 'DRAFT' OR status = 'SUBMITTED'));`);
        console.log('✅ applications RLS done\n');

        // Enable RLS on application_documents
        console.log('Setting up RLS for application_documents...');
        await client.query(`ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "Applicants can view own docs" ON public.application_documents;`);
        await client.query(`CREATE POLICY "Applicants can view own docs" ON public.application_documents FOR SELECT USING (EXISTS (SELECT 1 FROM public.applications WHERE id = application_documents.application_id AND user_id = auth.uid()));`);
        await client.query(`DROP POLICY IF EXISTS "Applicants can upload docs to own application" ON public.application_documents;`);
        await client.query(`CREATE POLICY "Applicants can upload docs to own application" ON public.application_documents FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.applications WHERE id = application_documents.application_id AND user_id = auth.uid()));`);
        console.log('✅ application_documents RLS done\n');

        // Enable RLS on admission_offers
        console.log('Setting up RLS for admission_offers...');
        await client.query(`ALTER TABLE public.admission_offers ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "Applicants can view own offers" ON public.admission_offers;`);
        await client.query(`CREATE POLICY "Applicants can view own offers" ON public.admission_offers FOR SELECT USING (EXISTS (SELECT 1 FROM public.applications WHERE id = admission_offers.application_id AND user_id = auth.uid()));`);
        console.log('✅ admission_offers RLS done\n');

        // Enable RLS on tuition_payments
        console.log('Setting up RLS for tuition_payments...');
        await client.query(`ALTER TABLE public.tuition_payments ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "Applicants can view own payments" ON public.tuition_payments;`);
        await client.query(`CREATE POLICY "Applicants can view own payments" ON public.tuition_payments FOR SELECT USING (EXISTS (SELECT 1 FROM public.admission_offers ao JOIN public.applications app ON ao.application_id = app.id WHERE ao.id = tuition_payments.offer_id AND app.user_id = auth.uid()));`);
        console.log('✅ tuition_payments RLS done\n');

        // Enable RLS on students
        console.log('Setting up RLS for students...');
        await client.query(`ALTER TABLE "students" ENABLE ROW LEVEL SECURITY;`);
        await client.query(`DROP POLICY IF EXISTS "Users can read own student record" ON "students";`);
        await client.query(`CREATE POLICY "Users can read own student record" ON "students" FOR SELECT USING (auth.uid() = user_id);`);
        console.log('✅ students RLS done\n');

        console.log('✅ All tables and RLS policies created successfully!');
    } finally {
        await client.end();
    }
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});