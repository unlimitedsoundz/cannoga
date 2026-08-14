-- Fix Housing Tables Foreign Key Types
-- The housing tables need to match the actual database structure

-- Drop existing housing tables (if they exist) and recreate with correct types
DROP TABLE IF EXISTS housing_deposits CASCADE;
DROP TABLE IF EXISTS housing_assignments CASCADE;
DROP TABLE IF EXISTS housing_applications CASCADE;
DROP TABLE IF EXISTS housing_rooms CASCADE;
DROP TABLE IF EXISTS housing_buildings CASCADE;

-- Recreate with correct foreign key types
-- student_id: TEXT (matches students table)
-- semester_id: UUID (matches semesters table in actual database)
CREATE TABLE housing_buildings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    campus_location TEXT NOT NULL,
    total_rooms INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE housing_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    building_id UUID NOT NULL REFERENCES housing_buildings(id) ON DELETE CASCADE,
    room_number TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 1,
    monthly_rate NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE')),
    amenities JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(building_id, room_number)
);

CREATE TABLE housing_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    semester_id UUID NOT NULL,
    preferred_building_id UUID REFERENCES housing_buildings(id),
    move_in_date DATE NOT NULL,
    move_out_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'WAITLIST')),
    priority_score INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE housing_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES housing_applications(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES housing_rooms(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    checked_in_at TIMESTAMPTZ,
    checked_out_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'ASSIGNED' CHECK (status IN ('ASSIGNED', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE housing_deposits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES housing_applications(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'REFUNDED')),
    payment_method TEXT,
    transaction_id TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE housing_buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE housing_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE housing_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE housing_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE housing_deposits ENABLE ROW LEVEL SECURITY;

-- Add RLS Policies
CREATE POLICY "Students can view housing buildings" ON housing_buildings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Students can view housing rooms" ON housing_rooms FOR SELECT TO authenticated USING (true);

-- Students can view their own applications
CREATE POLICY "Students view own housing applications" ON housing_applications FOR SELECT TO authenticated
USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

-- Students can insert their own applications  
CREATE POLICY "Students insert own housing applications" ON housing_applications FOR INSERT TO authenticated
WITH CHECK (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

-- Students can view their own assignments
CREATE POLICY "Students view own housing assignments" ON housing_assignments FOR SELECT TO authenticated
USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

-- Admins can view all
CREATE POLICY "Admins view all housing applications" ON housing_applications FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

CREATE POLICY "Admins update housing applications" ON housing_applications FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

CREATE POLICY "Admins insert housing assignments" ON housing_assignments FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

CREATE POLICY "Admins view all housing assignments" ON housing_assignments FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

CREATE POLICY "Admins update room status" ON housing_rooms FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));
