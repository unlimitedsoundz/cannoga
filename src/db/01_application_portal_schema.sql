-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROCALES & ROLES
CREATE TYPE user_role AS ENUM ('APPLICANT', 'ADMISSIONS', 'ADMIN');

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role user_role DEFAULT 'APPLICANT',
    country_of_residence TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, country_of_residence, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'country_of_residence',
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'APPLICANT')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DECANER;

-- Trigger to call the function
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. APPLICATIONS
CREATE TYPE application_status AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'DOCS_REQUIRED', 'ADMITTED', 'REJECTED', 'OFFER_ACCEPTED', 'OFFER_DECLINED', 'ENROLLED');

CREATE TABLE IF NOT EXISTS public.applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    course_id TEXT REFERENCES public."Course"(id) ON DELETE SET NULL, -- Changed to TEXT to match Course.id type
    status application_status DEFAULT 'DRAFT',
    
    -- JSONB columns for flexible form data
    personal_info JSONB,
    contact_details JSONB,
    education_history JSONB,
    motivation JSONB,
    language_proficiency JSONB,
    
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Application Policies
CREATE POLICY "Applicants can view own applications" ON public.applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Applicants can insert own applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Applicants can update own DRAFT applications" ON public.applications FOR UPDATE 
USING (auth.uid() = user_id AND status = 'DRAFT')
WITH CHECK (auth.uid() = user_id AND (status = 'DRAFT' OR status = 'SUBMITTED'));
-- Admissions/Admin need policies too (handled via service role or specific policies later)


-- 3. DOCUMENTS
CREATE TYPE document_type AS ENUM ('PASSPORT', 'TRANSCRIPT', 'CERTIFICATE', 'CV', 'MOTIVATION_LETTER', 'LANGUAGE_CERT');

CREATE TABLE IF NOT EXISTS public.application_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
    type document_type NOT NULL,
    url TEXT NOT NULL,
    name TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Applicants can view own docs" ON public.application_documents FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.applications WHERE id = application_documents.application_id AND user_id = auth.uid())
);
CREATE POLICY "Applicants can upload docs to own application" ON public.application_documents FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.applications WHERE id = application_documents.application_id AND user_id = auth.uid())
);


-- 4. ADMISSION OFFERS
CREATE TYPE offer_status AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

CREATE TABLE IF NOT EXISTS public.admission_offers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
    tuition_fee DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'CAD',
    payment_deadline DATE,
    document_url TEXT, -- Path to offer letter PDF
    status offer_status DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admission_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Applicants can view own offers" ON public.admission_offers FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.applications WHERE id = admission_offers.application_id AND user_id = auth.uid())
);


-- 5. TUITION PAYMENTS
CREATE TYPE payment_status AS ENUM ('INITIATED', 'PROCESSING', 'COMPLETED', 'FAILED');

CREATE TABLE IF NOT EXISTS public.tuition_payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    offer_id UUID REFERENCES public.admission_offers(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status payment_status DEFAULT 'INITIATED',
    transaction_reference TEXT,
    payment_method TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tuition_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Applicants can view own payments" ON public.tuition_payments FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.admission_offers ao
        JOIN public.applications app ON ao.application_id = app.id
        WHERE ao.id = tuition_payments.offer_id AND app.user_id = auth.uid()
    )
);

-- Functions to handle triggers if needed (e.g. updated_at)
