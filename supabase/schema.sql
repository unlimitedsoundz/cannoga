-- Reset (Optional: Use with caution in production)
-- DROP TYPE IF EXISTS "DegreeLevel" CASCADE;
-- DROP TYPE IF EXISTS "AdminRole" CASCADE;
-- DROP TABLE IF EXISTS "School" CASCADE;
-- DROP TABLE IF EXISTS "Department" CASCADE;
-- DROP TABLE IF EXISTS "Course" CASCADE;
-- DROP TABLE IF EXISTS "Subject" CASCADE;
-- DROP TABLE IF EXISTS "Faculty" CASCADE;
-- DROP TABLE IF EXISTS "Student" CASCADE;
-- DROP TABLE IF EXISTS "News" CASCADE;
-- DROP TABLE IF EXISTS "Event" CASCADE;
-- DROP TABLE IF EXISTS "AdminUser" CASCADE;

-- Create Enums (Idempotent approach)
DO $$ BEGIN
    CREATE TYPE "DegreeLevel" AS ENUM ('BACHELOR', 'MASTER', 'DIPLOMA', 'CERTIFICATE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'EDITOR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Tables

CREATE TABLE IF NOT EXISTS "School" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "imageUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "School_slug_key" ON "School"("slug");

CREATE TABLE IF NOT EXISTS "Department" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "schoolId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Department_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Department_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Department_slug_key" ON "Department"("slug");

CREATE TABLE IF NOT EXISTS "Course" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "degreeLevel" "DegreeLevel" NOT NULL,
  "duration" TEXT NOT NULL,
  "description" TEXT,
  "language" TEXT NOT NULL DEFAULT 'English',
  "entryRequirements" TEXT,
  "minimumGrade" TEXT,
  "careerPaths" TEXT,
  "imageUrl" TEXT,
  "schoolId" TEXT NOT NULL,
  "departmentId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Course_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Course_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Course_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Course_slug_key" ON "Course"("slug");

CREATE TABLE IF NOT EXISTS "Subject" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "creditUnits" INTEGER NOT NULL,
  "semester" INTEGER NOT NULL,
  "courseId" TEXT NOT NULL,

  CONSTRAINT "Subject_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Subject_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Faculty" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "bio" TEXT,
  "imageUrl" TEXT,
  "email" TEXT,
  "schoolId" TEXT NOT NULL,
  "departmentId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Faculty_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Faculty_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Student" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "nationality" TEXT,
  "appliedCourse" TEXT,
  "status" TEXT NOT NULL DEFAULT 'applied',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Student_email_key" ON "Student"("email");

CREATE TABLE IF NOT EXISTS "News" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "excerpt" TEXT,
  "imageUrl" TEXT,
  "publishDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "News_slug_key" ON "News"("slug");

CREATE TABLE IF NOT EXISTS "Event" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3),
  "location" TEXT,
  "category" TEXT,
  "content" TEXT,
  "imageUrl" TEXT,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Event_slug_key" ON "Event"("slug");

CREATE TABLE IF NOT EXISTS "AdminUser" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "role" "AdminRole" NOT NULL DEFAULT 'EDITOR',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "AdminUser_email_key" ON "AdminUser"("email");

-- Enable Row Level Security (RLS)
ALTER TABLE "School" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Department" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Course" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subject" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Faculty" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Student" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "News" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Event" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AdminUser" ENABLE ROW LEVEL SECURITY;

-- Create basic policies (Public Read, Admin Write)
-- Drop before creating to avoid "policy already exists" errors
DROP POLICY IF EXISTS "Public read access for School" ON "School";
CREATE POLICY "Public read access for School" ON "School" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for Department" ON "Department";
CREATE POLICY "Public read access for Department" ON "Department" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for Course" ON "Course";
CREATE POLICY "Public read access for Course" ON "Course" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for Subject" ON "Subject";
CREATE POLICY "Public read access for Subject" ON "Subject" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for Faculty" ON "Faculty";
CREATE POLICY "Public read access for Faculty" ON "Faculty" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for News" ON "News";
CREATE POLICY "Public read access for News" ON "News" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for Event" ON "Event";
CREATE POLICY "Public read access for Event" ON "Event" FOR SELECT USING (true);

-- SIS Student Table (New)
CREATE TABLE IF NOT EXISTS "students" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL, -- References profiles(id)
  "student_id" TEXT NOT NULL UNIQUE,
  "application_id" UUID NOT NULL UNIQUE, -- References applications(id)
  "program_id" TEXT NOT NULL, -- References Course(id)
  "enrollment_status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "institutional_email" TEXT NOT NULL UNIQUE,
  "personal_email" TEXT NOT NULL,
  "start_date" TIMESTAMP(3) NOT NULL,
  "expected_graduation_date" TIMESTAMP(3) NOT NULL,
  "lms_access_data" JSONB DEFAULT '{}', -- Account info, tokens, sync status
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- Audit Logs (New)
CREATE TABLE IF NOT EXISTS "audit_logs" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "action" TEXT NOT NULL,
  "entity_table" TEXT NOT NULL,
  "entity_id" TEXT NOT NULL,
  "actor_id" UUID, -- Can be null for system actions
  "metadata" JSONB,
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- Audit Trigger Function
CREATE OR REPLACE FUNCTION log_academic_action()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "audit_logs" (action, entity_table, entity_id, actor_id, metadata)
    VALUES (
        TG_OP,
        TG_TABLE_NAME,
        CASE 
            WHEN TG_OP = 'DELETE' THEN OLD.id::text
            ELSE NEW.id::text
        END,
        auth.uid(),
        jsonb_build_object(
            'old', CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE to_jsonb(OLD) END,
            'new', CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END
        )
    );
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DECANER;

-- Apply Triggers
DROP TRIGGER IF EXISTS "audit_students" ON "students";
CREATE TRIGGER "audit_students"
AFTER INSERT OR UPDATE OR DELETE ON "students"
FOR EACH ROW EXECUTE FUNCTION log_academic_action();

DROP TRIGGER IF EXISTS "audit_enrollments" ON "module_enrollments";
CREATE TRIGGER "audit_enrollments"
AFTER INSERT OR UPDATE OR DELETE ON "module_enrollments"
FOR EACH ROW EXECUTE FUNCTION log_academic_action();

-- ACADEMIC INFRASTRUCTURE EXPANSION

-- Semesters
CREATE TABLE IF NOT EXISTS "semesters" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL, -- e.g. "Autumn 2024"
  "start_date" TIMESTAMP(3) NOT NULL,
  "end_date" TIMESTAMP(3) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'UPCOMING', -- UPCOMING, ACTIVE, COMPLETED
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "semesters_pkey" PRIMARY KEY ("id")
);

-- Modules (Detailed Catalog)
CREATE TABLE IF NOT EXISTS "modules" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "code" TEXT NOT NULL UNIQUE, -- e.g. "CS101"
  "title" TEXT NOT NULL,
  "description" TEXT,
  "credits" INTEGER NOT NULL DEFAULT 5,
  "capacity" INTEGER NOT NULL DEFAULT 30,
  "department_id" TEXT REFERENCES "Department"("id"),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- Registration Windows
CREATE TABLE IF NOT EXISTS "registration_windows" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "semester_id" TEXT NOT NULL REFERENCES "semesters"("id"),
  "open_at" TIMESTAMP(3) NOT NULL,
  "close_at" TIMESTAMP(3) NOT NULL,
  "add_drop_deadline" TIMESTAMP(3) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'CLOSED', -- CLOSED, OPEN, ARCHIVED
  
  CONSTRAINT "registration_windows_pkey" PRIMARY KEY ("id")
);

-- Module Enrollments (Linking Students to Courses)
CREATE TABLE IF NOT EXISTS "module_enrollments" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "student_id" TEXT NOT NULL REFERENCES "students"("id"),
  "module_id" TEXT NOT NULL REFERENCES "modules"("id"),
  "semester_id" TEXT NOT NULL REFERENCES "semesters"("id"),
  "status" TEXT NOT NULL DEFAULT 'REGISTERED', -- REGISTERED, DROPPED, COMPLETED, FAILED
  "grade" DECIMAL(3,2), -- 0.00 to 5.00 or similar
  "grade_status" TEXT NOT NULL DEFAULT 'PROVISIONAL', -- PROVISIONAL, CANAL
  "finalized_by" UUID REFERENCES auth.users(id),
  "finalized_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "module_enrollments_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "unique_student_module_semester" UNIQUE ("student_id", "module_id", "semester_id")
);

-- Class Sessions (Timetable Engine)
CREATE TABLE IF NOT EXISTS "class_sessions" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "module_id" TEXT NOT NULL REFERENCES "modules"("id"),
  "semester_id" TEXT NOT NULL REFERENCES "semesters"("id"),
  "day_of_week" INTEGER NOT NULL, -- 0-6 (Sunday-Saturday)
  "start_time" TIME NOT NULL,
  "end_time" TIME NOT NULL,
  "location_type" TEXT NOT NULL DEFAULT 'CAMPUS', -- CAMPUS, ONLINE
  "location_detail" TEXT, -- Room number or Zoom link
  
  CONSTRAINT "class_sessions_pkey" PRIMARY KEY ("id")
);

-- Enable RLS for new tables
ALTER TABLE "students" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;

-- Add policies for students (User can read their own record)
DROP POLICY IF EXISTS "Users can read own student record" ON "students";
CREATE POLICY "Users can read own student record" ON "students" FOR SELECT USING (auth.uid() = user_id);

-- Add policies for audit_logs (Admins/System only usually, but let's allow read for specific needs if required, otherwise default closed)

-- ACADEMIC INFRASTRUCTURE POLICIES

-- Semesters & Modules (Public Read, Admin Write)
ALTER TABLE "semesters" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "modules" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "registration_windows" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "class_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "module_enrollments" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read semesters" ON "semesters" FOR SELECT USING (true);
CREATE POLICY "Public read modules" ON "modules" FOR SELECT USING (true);
CREATE POLICY "Public read registration windows" ON "registration_windows" FOR SELECT USING (true);
CREATE POLICY "Public read class sessions" ON "class_sessions" FOR SELECT USING (true);

-- Instructor Access (Can view their own module data - assuming a link exists or registrar view for now)
-- Let's define Instructor as a role in profiles

-- Module Enrollments (Student can view own, Registrar view all, Instructor view if teaching)
CREATE POLICY "Students view own enrollments" ON "module_enrollments" FOR SELECT 
USING (EXISTS (SELECT 1 FROM "students" WHERE "students"."id" = "module_enrollments"."student_id" AND "students"."user_id" = auth.uid()));

CREATE POLICY "Registrars view all enrollments" ON "module_enrollments" FOR SELECT
USING (EXISTS (SELECT 1 FROM "profiles" WHERE "profiles"."id" = auth.uid() AND "profiles"."role" IN ('ADMIN', 'REGISTRAR')));

CREATE POLICY "Instructors view enrollments" ON "module_enrollments" FOR SELECT
USING (EXISTS (SELECT 1 FROM "profiles" WHERE "profiles"."id" = auth.uid() AND "profiles"."role" = 'INSTRUCTOR'));

-- Grade Management (Instructors can update provisional grades, Registrars finalize)
CREATE POLICY "Instructors update provisional grades" ON "module_enrollments" FOR UPDATE
USING (EXISTS (SELECT 1 FROM "profiles" WHERE "profiles"."id" = auth.uid() AND "profiles"."role" = 'INSTRUCTOR'))
WITH CHECK ("grade_status" = 'PROVISIONAL');

CREATE POLICY "Registrars finalize grades" ON "module_enrollments" FOR UPDATE
USING (EXISTS (SELECT 1 FROM "profiles" WHERE "profiles"."id" = auth.uid() AND "profiles"."role" IN ('ADMIN', 'REGISTRAR')))
WITH CHECK (true);

-- =============================================
-- HOUSING MODULE
-- =============================================

CREATE TABLE IF NOT EXISTS housing_buildings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    campus_location TEXT NOT NULL,
    total_rooms INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS housing_rooms (
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

CREATE TABLE IF NOT EXISTS housing_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    semester_id UUID NOT NULL REFERENCES semesters(id),
    preferred_building_id UUID REFERENCES housing_buildings(id),
    move_in_date DATE NOT NULL,
    move_out_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'WAITLIST')),
    priority_score INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS housing_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES housing_applications(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES housing_rooms(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    checked_in_at TIMESTAMPTZ,
    checked_out_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'ASSIGNED' CHECK (status IN ('ASSIGNED', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS housing_deposits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES housing_applications(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'REFUNDED')),
    payment_method TEXT,
    transaction_id TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- IT MATERIALS MODULE
-- =============================================

CREATE TABLE IF NOT EXISTS it_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_type TEXT NOT NULL CHECK (asset_type IN ('LMS', 'EMAIL', 'VPN', 'VIRTUAL_LAB', 'LIBRARY', 'SOFTWARE_LICENSE')),
    name TEXT NOT NULL,
    description TEXT,
    access_url TEXT,
    auto_provision BOOLEAN DEFAULT true,
    license_limit INTEGER,
    current_usage INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_it_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES it_assets(id) ON DELETE CASCADE,
    credentials JSONB, -- Encrypted credentials, license keys, etc.
    activated_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    deactivated_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('PENDING', 'ACTIVE', 'EXPIRED', 'DEACTIVATED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(student_id, asset_id)
);

-- =============================================
-- RLS POLICIES: HOUSING
-- =============================================

ALTER TABLE housing_buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE housing_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE housing_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE housing_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE housing_deposits ENABLE ROW LEVEL SECURITY;

-- Students can view buildings and rooms
CREATE POLICY "Students can view housing buildings" ON housing_buildings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Students can view housing rooms" ON housing_rooms FOR SELECT TO authenticated USING (true);

-- Students can view their own applications, assignments, and deposits
CREATE POLICY "Students view own applications" ON housing_applications FOR SELECT TO authenticated
USING (
    student_id IN (
        SELECT id FROM students WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Students view own assignments" ON housing_assignments FOR SELECT TO authenticated
USING (
    student_id IN (
        SELECT id FROM students WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Students view own deposits" ON housing_deposits FOR SELECT TO authenticated
USING (
    student_id IN (
        SELECT id FROM students WHERE user_id = auth.uid()
    )
);

-- Admins/Registrars can view and manage all housing records
CREATE POLICY "Admins manage housing" ON housing_buildings FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR')
    )
);

CREATE POLICY "Admins manage rooms" ON housing_rooms FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR')
    )
);

CREATE POLICY "Admins manage applications" ON housing_applications FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR')
    )
);

CREATE POLICY "Admins manage assignments" ON housing_assignments FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR')
    )
);

-- =============================================
-- RLS POLICIES: IT MATERIALS
-- =============================================

ALTER TABLE it_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_it_access ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view IT assets
CREATE POLICY "Users view IT assets" ON it_assets FOR SELECT TO authenticated USING (true);

-- Admins can manage IT assets
CREATE POLICY "Admins manage IT assets" ON it_assets FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'
    )
);

-- Students can view their own IT access
CREATE POLICY "Students view own IT access" ON student_it_access FOR SELECT TO authenticated
USING (
    student_id IN (
        SELECT id FROM students WHERE user_id = auth.uid()
    )
);

-- Admins can manage all IT access
CREATE POLICY "Admins manage IT access" ON student_it_access FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'
    )
);

-- =============================================
-- AUDIT TRIGGERS
-- =============================================

-- Trigger for housing_assignments
CREATE OR REPLACE TRIGGER audit_housing_assignments
AFTER INSERT OR UPDATE OR DELETE ON housing_assignments
FOR EACH ROW EXECUTE FUNCTION log_academic_action();

-- Trigger for student_it_access
CREATE OR REPLACE TRIGGER audit_student_it_access
AFTER INSERT OR UPDATE OR DELETE ON student_it_access
FOR EACH ROW EXECUTE FUNCTION log_academic_action();
