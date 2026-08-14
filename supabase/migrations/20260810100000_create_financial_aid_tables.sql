CREATE TABLE IF NOT EXISTS public.financial_aid (
    id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    aid_type TEXT NOT NULL CHECK (aid_type IN ('OSAP', 'FEDERAL_LOAN', 'PROVINCIAL_LOAN', 'BURSARY', 'SCHOLARSHIP', 'EMERGENCY_FUND', 'OTHER')),
    provider TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'CAD',
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'DISBURSED', 'PARTIAL', 'REJECTED', 'CANCELLED')),
    disbursement_date TIMESTAMP(3),
    expected_date TIMESTAMP(3),
    term TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.scholarships (
    id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'CAD',
    provider TEXT,
    eligibility_criteria TEXT,
    application_deadline TIMESTAMP(3),
    term TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CLOSED', 'ARCHIVED')),
    is_emergency BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.scholarship_applications (
    id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
    scholarship_id TEXT NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWED', 'APPROVED', 'REJECTED', 'AWARDED')),
    submitted_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP(3),
    reviewer_notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_financial_aid_student_id ON public.financial_aid(student_id);
CREATE INDEX IF NOT EXISTS idx_financial_aid_status ON public.financial_aid(status);
CREATE INDEX IF NOT EXISTS idx_scholarship_applications_student_id ON public.scholarship_applications(student_id);
CREATE INDEX IF NOT EXISTS idx_scholarship_applications_scholarship_id ON public.scholarship_applications(scholarship_id);
