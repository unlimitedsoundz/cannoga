-- =============================================
-- TIMETABLE ENGINE DATABASE SCHEMA
-- Constraint-based university scheduling system
-- =============================================

-- =============================================
-- 1. ROOMS
-- =============================================

CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    building TEXT NOT NULL,
    floor TEXT,
    room_number TEXT NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    room_type TEXT NOT NULL DEFAULT 'LECTURE_ROOM' CHECK (room_type IN (
        'LECTURE_ROOM', 'LAB', 'COMPUTER_LAB', 'SCIENCE_LAB',
        'SEMINAR_ROOM', 'AUDITORIUM', 'CLINICAL_LAB', 'SPECIALIZED_ROOM', 'ONLINE'
    )),
    campus TEXT NOT NULL DEFAULT 'MAIN',
    accessibility BOOLEAN NOT NULL DEFAULT false,
    equipment JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'MAINTENANCE', 'RETIRED')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rooms_building ON public.rooms(building);
CREATE INDEX IF NOT EXISTS idx_rooms_type ON public.rooms(room_type);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON public.rooms(status);

-- =============================================
-- 2. ROOM FEATURES (Lookup)
-- =============================================

CREATE TABLE IF NOT EXISTS public.room_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'GENERAL' CHECK (category IN (
        'GENERAL', 'AV', 'COMPUTING', 'SCIENCE', 'MEDICAL', 'ACCESSIBILITY'
    )),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. ROOM FEATURE ASSIGNMENTS
-- =============================================

CREATE TABLE IF NOT EXISTS public.room_feature_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    feature_id UUID NOT NULL REFERENCES public.room_features(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(room_id, feature_id)
);

CREATE INDEX IF NOT EXISTS idx_room_feature_assignments_room ON public.room_feature_assignments(room_id);
CREATE INDEX IF NOT EXISTS idx_room_feature_assignments_feature ON public.room_feature_assignments(feature_id);

-- =============================================
-- 4. ROOM AVAILABILITY (Blocked periods)
-- =============================================

CREATE TABLE IF NOT EXISTS public.room_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    block_type TEXT NOT NULL DEFAULT 'MAINTENANCE' CHECK (block_type IN (
        'MAINTENANCE', 'BLOCKED', 'EVENT', 'RESERVATION'
    )),
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    reason TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (end_datetime > start_datetime)
);

CREATE INDEX IF NOT EXISTS idx_room_availability_room ON public.room_availability(room_id);
CREATE INDEX IF NOT EXISTS idx_room_availability_dates ON public.room_availability(start_datetime, end_datetime);

-- =============================================
-- 5. INSTRUCTOR AVAILABILITY
-- =============================================

CREATE TABLE IF NOT EXISTS public.instructor_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instructor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    availability_type TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (availability_type IN (
        'AVAILABLE', 'UNAVAILABLE', 'PREFERRED'
    )),
    effective_date DATE NOT NULL,
    expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (end_time > start_time)
);

CREATE INDEX IF NOT EXISTS idx_instructor_availability_instructor ON public.instructor_availability(instructor_id);
CREATE INDEX IF NOT EXISTS idx_instructor_availability_day ON public.instructor_availability(day_of_week);

-- =============================================
-- 6. STUDENT GROUPS
-- =============================================

CREATE TABLE IF NOT EXISTS public.student_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    program_id TEXT REFERENCES public."Course"(id) ON DELETE SET NULL,
    department_id TEXT REFERENCES public."Department"(id) ON DELETE SET NULL,
    cohort_year INTEGER,
    semester INTEGER,
    total_students INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_groups_program ON public.student_groups(program_id);
CREATE INDEX IF NOT EXISTS idx_student_groups_department ON public.student_groups(department_id);

-- =============================================
-- 7. COHORT MEMBERS
-- =============================================

CREATE TABLE IF NOT EXISTS public.cohort_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.student_groups(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(group_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_cohort_members_group ON public.cohort_members(group_id);
CREATE INDEX IF NOT EXISTS idx_cohort_members_student ON public.cohort_members(student_id);

-- =============================================
-- 8. COURSE SECTIONS
-- =============================================

CREATE TABLE IF NOT EXISTS public.course_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL,
    module_id TEXT NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    semester_id TEXT NOT NULL REFERENCES public.semesters(id) ON DELETE CASCADE,
    instructor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    capacity INTEGER NOT NULL DEFAULT 30 CHECK (capacity > 0),
    enrolled_count INTEGER NOT NULL DEFAULT 0,
    session_type TEXT NOT NULL DEFAULT 'LECTURE' CHECK (session_type IN (
        'LECTURE', 'LAB', 'SEMINAR', 'TUTORIAL', 'PRACTICAL', 'CLINICAL', 'ONLINE', 'HYBRID'
    )),
    delivery_mode TEXT NOT NULL DEFAULT 'IN_PERSON' CHECK (delivery_mode IN (
        'IN_PERSON', 'ONLINE', 'HYBRID', 'SYNC_ONLINE'
    )),
    required_room_type TEXT CHECK (required_room_type IN (
        'LECTURE_ROOM', 'LAB', 'COMPUTER_LAB', 'SCIENCE_LAB',
        'SEMINAR_ROOM', 'AUDITORIUM', 'CLINICAL_LAB', 'SPECIALIZED_ROOM', 'ONLINE'
    )),
    required_features JSONB DEFAULT '[]'::jsonb,
    duration_minutes INTEGER NOT NULL DEFAULT 60 CHECK (duration_minutes > 0),
    meetings_per_week INTEGER NOT NULL DEFAULT 1 CHECK (meetings_per_week > 0),
    consecutive_sessions BOOLEAN NOT NULL DEFAULT false,
    max_daily_sessions INTEGER,
    preferred_days INTEGER[] DEFAULT '{}',
    blocked_days INTEGER[] DEFAULT '{}',
    preferred_times TEXT[] DEFAULT '{}',
    blocked_times TEXT[] DEFAULT '{}',
    student_group_id UUID REFERENCES public.student_groups(id) ON DELETE SET NULL,
    department_id TEXT REFERENCES public."Department"(id) ON DELETE SET NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN (
        'DRAFT', 'PENDING', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED', 'CANCELLED'
    )),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(module_id, semester_id, code)
);

CREATE INDEX IF NOT EXISTS idx_course_sections_module ON public.course_sections(module_id);
CREATE INDEX IF NOT EXISTS idx_course_sections_semester ON public.course_sections(semester_id);
CREATE INDEX IF NOT EXISTS idx_course_sections_instructor ON public.course_sections(instructor_id);
CREATE INDEX IF NOT EXISTS idx_course_sections_status ON public.course_sections(status);

-- =============================================
-- 7. COURSE SECTION MEETINGS (Meeting requirements)
-- =============================================

CREATE TABLE IF NOT EXISTS public.course_section_meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES public.course_sections(id) ON DELETE CASCADE,
    meeting_index INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
    instructor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_fixed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(section_id, meeting_index)
);

CREATE INDEX IF NOT EXISTS idx_course_section_meetings_section ON public.course_section_meetings(section_id);
CREATE INDEX IF NOT EXISTS idx_course_section_meetings_room ON public.course_section_meetings(room_id);
CREATE INDEX IF NOT EXISTS idx_course_section_meetings_instructor ON public.course_section_meetings(instructor_id);

-- =============================================
-- 10. ACADEMIC DAYS (Configurable)
-- =============================================

CREATE TABLE IF NOT EXISTS public.academic_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week INTEGER NOT NULL UNIQUE CHECK (day_of_week >= 0 AND day_of_week <= 6),
    name TEXT NOT NULL,
    abbreviation TEXT NOT NULL,
    is_teaching_day BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 11. TIME SLOTS (Configurable)
-- =============================================

CREATE TABLE IF NOT EXISTS public.time_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_index INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration INTEGER NOT NULL,
    is_break BOOLEAN NOT NULL DEFAULT false,
    break_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(day_of_week, slot_index)
);

CREATE INDEX IF NOT EXISTS idx_time_slots_day ON public.time_slots(day_of_week);

-- =============================================
-- 12. HOLIDAYS / BLOCKED PERIODS
-- =============================================

CREATE TABLE IF NOT EXISTS public.holidays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    block_type TEXT NOT NULL DEFAULT 'INSTITUTION' CHECK (block_type IN (
        'INSTITUTION', 'SEMESTER_BREAK', 'HOLIDAY', 'EXAM_PERIOD'
    )),
    affects_scheduling BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_holidays_dates ON public.holidays(start_date, end_date);

-- =============================================
-- 13. TIMETABLE RUNS (Generation jobs)
-- =============================================

CREATE TABLE IF NOT EXISTS public.timetable_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    semester_id TEXT NOT NULL REFERENCES public.semesters(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN (
        'PENDING', 'RUNNING', 'COMPLETED', 'PARTIAL', 'FAILED', 'CANCELLED'
    )),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    courses_count INTEGER DEFAULT 0,
    sections_count INTEGER DEFAULT 0,
    assignments_count INTEGER DEFAULT 0,
    hard_violations INTEGER DEFAULT 0,
    soft_score NUMERIC(5,2),
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_timetable_runs_semester ON public.timetable_runs(semester_id);
CREATE INDEX IF NOT EXISTS idx_timetable_runs_status ON public.timetable_runs(status);

-- =============================================
-- 14. TIMETABLE VERSIONS
-- =============================================

CREATE TABLE IF NOT EXISTS public.timetable_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    semester_id TEXT NOT NULL REFERENCES public.semesters(id) ON DELETE CASCADE,
    run_id UUID REFERENCES public.timetable_runs(id) ON DELETE SET NULL,
    version_number INTEGER NOT NULL,
    label TEXT,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN (
        'DRAFT', 'UNDER_REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED'
    )),
    is_published BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ,
    published_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(semester_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_timetable_versions_semester ON public.timetable_versions(semester_id);
CREATE INDEX IF NOT EXISTS idx_timetable_versions_status ON public.timetable_versions(status);

-- =============================================
-- 15. TIMETABLE ASSIGNMENTS
-- =============================================

CREATE TABLE IF NOT EXISTS public.timetable_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id UUID NOT NULL REFERENCES public.timetable_versions(id) ON DELETE CASCADE,
    run_id UUID REFERENCES public.timetable_runs(id) ON DELETE SET NULL,
    section_id UUID NOT NULL REFERENCES public.course_sections(id) ON DELETE CASCADE,
    meeting_id UUID REFERENCES public.course_section_meetings(id) ON DELETE SET NULL,
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE RESTRICT,
    instructor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_override BOOLEAN NOT NULL DEFAULT false,
    override_reason TEXT,
    override_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    override_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_timetable_assignments_version ON public.timetable_assignments(version_id);
CREATE INDEX IF NOT EXISTS idx_timetable_assignments_section ON public.timetable_assignments(section_id);
CREATE INDEX IF NOT EXISTS idx_timetable_assignments_room ON public.timetable_assignments(room_id);
CREATE INDEX IF NOT EXISTS idx_timetable_assignments_instructor ON public.timetable_assignments(instructor_id);
CREATE INDEX IF NOT EXISTS idx_timetable_assignments_day ON public.timetable_assignments(day_of_week);

-- =============================================
-- 16. TIMETABLE CONFLICTS
-- =============================================

CREATE TABLE IF NOT EXISTS public.timetable_conflicts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id UUID NOT NULL REFERENCES public.timetable_versions(id) ON DELETE CASCADE,
    run_id UUID REFERENCES public.timetable_runs(id) ON DELETE SET NULL,
    conflict_type TEXT NOT NULL CHECK (conflict_type IN (
        'INSTRUCTOR_DOUBLE_BOOKED', 'ROOM_DOUBLE_BOOKED', 'STUDENT_DOUBLE_BOOKED',
        'CAPACITY_EXCEEDED', 'ROOM_TYPE_MISMATCH', 'FEATURE_MISSING',
        'INSTRUCTOR_UNAVAILABLE', 'ROOM_UNAVAILABLE', 'BLOCKED_TIME',
        'PREREQUISITE_SEQUENCE', 'COHORT_OVERLOAD', 'MAX_DAILY_EXCEEDED',
        'CONSECUTIVE_REQUIRED', 'OTHER'
    )),
    severity TEXT NOT NULL DEFAULT 'HARD' CHECK (severity IN ('HARD', 'SOFT')),
    assignment_a_id UUID NOT NULL REFERENCES public.timetable_assignments(id) ON DELETE CASCADE,
    assignment_b_id UUID NOT NULL REFERENCES public.timetable_assignments(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    resolution TEXT,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_timetable_conflicts_version ON public.timetable_conflicts(version_id);
CREATE INDEX IF NOT EXISTS idx_timetable_conflicts_type ON public.timetable_conflicts(conflict_type);
CREATE INDEX IF NOT EXISTS idx_timetable_conflicts_severity ON public.timetable_conflicts(severity);

-- =============================================
-- 17. TIMETABLE SCORES
-- =============================================

CREATE TABLE IF NOT EXISTS public.timetable_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL REFERENCES public.timetable_runs(id) ON DELETE CASCADE,
    version_id UUID REFERENCES public.timetable_versions(id) ON DELETE SET NULL,
    overall_score NUMERIC(5,2) NOT NULL,
    hard_violation_count INTEGER NOT NULL DEFAULT 0,
    soft_violation_count INTEGER NOT NULL DEFAULT 0,
    student_gap_score NUMERIC(5,2) DEFAULT 0,
    instructor_gap_score NUMERIC(5,2) DEFAULT 0,
    room_utilization_score NUMERIC(5,2) DEFAULT 0,
    building_change_score NUMERIC(5,2) DEFAULT 0,
    preference_score NUMERIC(5,2) DEFAULT 0,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_timetable_scores_run ON public.timetable_scores(run_id);
CREATE INDEX IF NOT EXISTS idx_timetable_scores_version ON public.timetable_scores(version_id);

-- =============================================
-- 18. TIMETABLE CONSTRAINTS (Configurable hard constraints)
-- =============================================

CREATE TABLE IF NOT EXISTS public.timetable_constraints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    constraint_type TEXT NOT NULL CHECK (constraint_type IN (
        'HARD', 'SOFT'
    )),
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    weight NUMERIC(5,2) DEFAULT 1.0,
    parameters JSONB DEFAULT '{}'::jsonb,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 19. TIMETABLE PREFERENCES (Soft constraint weights)
-- =============================================

CREATE TABLE IF NOT EXISTS public.timetable_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    weight NUMERIC(5,2) NOT NULL DEFAULT 1.0,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    parameters JSONB DEFAULT '{}'::jsonb,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 20. ENABLE RLS
-- =============================================

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_feature_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_section_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohort_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_constraints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_preferences ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 21. RLS POLICIES
-- =============================================

-- Rooms: public read, admin write
DROP POLICY IF EXISTS "Public read rooms" ON public.rooms;
CREATE POLICY "Public read rooms" ON public.rooms FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage rooms" ON public.rooms;
CREATE POLICY "Admins manage rooms" ON public.rooms FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR'))
);

-- Room features: public read, admin write
DROP POLICY IF EXISTS "Public read room_features" ON public.room_features;
CREATE POLICY "Public read room_features" ON public.room_features FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage room_features" ON public.room_features;
CREATE POLICY "Admins manage room_features" ON public.room_features FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR'))
);

-- Room feature assignments: public read, admin write
DROP POLICY IF EXISTS "Public read room_feature_assignments" ON public.room_feature_assignments;
CREATE POLICY "Public read room_feature_assignments" ON public.room_feature_assignments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage room_feature_assignments" ON public.room_feature_assignments;
CREATE POLICY "Admins manage room_feature_assignments" ON public.room_feature_assignments FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR'))
);

-- Room availability: public read, admin write
DROP POLICY IF EXISTS "Public read room_availability" ON public.room_availability;
CREATE POLICY "Public read room_availability" ON public.room_availability FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage room_availability" ON public.room_availability;
CREATE POLICY "Admins manage room_availability" ON public.room_availability FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR'))
);

-- Instructor availability: public read, admin/faculty write own
DROP POLICY IF EXISTS "Public read instructor_availability" ON public.instructor_availability;
CREATE POLICY "Public read instructor_availability" ON public.instructor_availability FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage instructor_availability" ON public.instructor_availability;
CREATE POLICY "Admins manage instructor_availability" ON public.instructor_availability FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR'))
);

DROP POLICY IF EXISTS "Instructors manage own availability" ON public.instructor_availability;
CREATE POLICY "Instructors manage own availability" ON public.instructor_availability FOR ALL USING (
    auth.uid() = instructor_id
);

-- Course sections: public read, admin write
DROP POLICY IF EXISTS "Public read course_sections" ON public.course_sections;
CREATE POLICY "Public read course_sections" ON public.course_sections FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage course_sections" ON public.course_sections;
CREATE POLICY "Admins manage course_sections" ON public.course_sections FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR'))
);

-- Course section meetings: public read, admin write
DROP POLICY IF EXISTS "Public read course_section_meetings" ON public.course_section_meetings;
CREATE POLICY "Public read course_section_meetings" ON public.course_section_meetings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage course_section_meetings" ON public.course_section_meetings;
CREATE POLICY "Admins manage course_section_meetings" ON public.course_section_meetings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR'))
);

-- Student groups: public read, admin write
DROP POLICY IF EXISTS "Public read student_groups" ON public.student_groups;
CREATE POLICY "Public read student_groups" ON public.student_groups FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage student_groups" ON public.student_groups;
CREATE POLICY "Admins manage student_groups" ON public.student_groups FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR'))
);

-- Cohort members: public read, admin write
DROP POLICY IF EXISTS "Public read cohort_members" ON public.cohort_members;
CREATE POLICY "Public read cohort_members" ON public.cohort_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage cohort_members" ON public.cohort_members;
CREATE POLICY "Admins manage cohort_members" ON public.cohort_members FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR'))
);

-- Academic days: public read, admin write
DROP POLICY IF EXISTS "Public read academic_days" ON public.academic_days;
CREATE POLICY "Public read academic_days" ON public.academic_days FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage academic_days" ON public.academic_days;
CREATE POLICY "Admins manage academic_days" ON public.academic_days FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Time slots: public read, admin write
DROP POLICY IF EXISTS "Public read time_slots" ON public.time_slots;
CREATE POLICY "Public read time_slots" ON public.time_slots FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage time_slots" ON public.time_slots;
CREATE POLICY "Admins manage time_slots" ON public.time_slots FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Holidays: public read, admin write
DROP POLICY IF EXISTS "Public read holidays" ON public.holidays;
CREATE POLICY "Public read holidays" ON public.holidays FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage holidays" ON public.holidays;
CREATE POLICY "Admins manage holidays" ON public.holidays FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Timetable runs: admin only
DROP POLICY IF EXISTS "Admins manage timetable_runs" ON public.timetable_runs;
CREATE POLICY "Admins manage timetable_runs" ON public.timetable_runs FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR'))
);

-- Timetable versions: public read published, admin write
DROP POLICY IF EXISTS "Public read published timetable_versions" ON public.timetable_versions;
CREATE POLICY "Public read published timetable_versions" ON public.timetable_versions FOR SELECT USING (
    status = 'PUBLISHED' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR'))
);

DROP POLICY IF EXISTS "Admins manage timetable_versions" ON public.timetable_versions;
CREATE POLICY "Admins manage timetable_versions" ON public.timetable_versions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR'))
);

-- Timetable assignments: public read published, admin write
DROP POLICY IF EXISTS "Public read published timetable_assignments" ON public.timetable_assignments;
CREATE POLICY "Public read published timetable_assignments" ON public.timetable_assignments FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.timetable_versions
        WHERE timetable_versions.id = timetable_assignments.version_id
        AND timetable_versions.status = 'PUBLISHED'
    ) OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR'))
);

DROP POLICY IF EXISTS "Admins manage timetable_assignments" ON public.timetable_assignments;
CREATE POLICY "Admins manage timetable_assignments" ON public.timetable_assignments FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR'))
);

-- Timetable conflicts: admin only
DROP POLICY IF EXISTS "Admins manage timetable_conflicts" ON public.timetable_conflicts;
CREATE POLICY "Admins manage timetable_conflicts" ON public.timetable_conflicts FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR'))
);

-- Timetable scores: admin only
DROP POLICY IF EXISTS "Admins manage timetable_scores" ON public.timetable_scores;
CREATE POLICY "Admins manage timetable_scores" ON public.timetable_scores FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR'))
);

-- Timetable constraints: public read, admin write
DROP POLICY IF EXISTS "Public read timetable_constraints" ON public.timetable_constraints;
CREATE POLICY "Public read timetable_constraints" ON public.timetable_constraints FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage timetable_constraints" ON public.timetable_constraints;
CREATE POLICY "Admins manage timetable_constraints" ON public.timetable_constraints FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Timetable preferences: public read, admin write
DROP POLICY IF EXISTS "Public read timetable_preferences" ON public.timetable_preferences;
CREATE POLICY "Public read timetable_preferences" ON public.timetable_preferences FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage timetable_preferences" ON public.timetable_preferences;
CREATE POLICY "Admins manage timetable_preferences" ON public.timetable_preferences FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- =============================================
-- 22. SEED DEFAULT DATA
-- =============================================

-- Seed academic days
INSERT INTO public.academic_days (day_of_week, name, abbreviation, is_teaching_day) VALUES
    (0, 'Sunday', 'Sun', false),
    (1, 'Monday', 'Mon', true),
    (2, 'Tuesday', 'Tue', true),
    (3, 'Wednesday', 'Wed', true),
    (4, 'Thursday', 'Thu', true),
    (5, 'Friday', 'Fri', true),
    (6, 'Saturday', 'Sat', false)
ON CONFLICT (day_of_week) DO NOTHING;

-- Seed default time slots (30-min slots from 08:00 to 17:00)
INSERT INTO public.time_slots (slot_index, day_of_week, start_time, end_time, slot_duration, is_break)
SELECT
    slot_idx,
    day_of_week,
    make_time(8 + (slot_idx / 2), (slot_idx % 2) * 30, 0),
    make_time(8 + ((slot_idx + 1) / 2), ((slot_idx + 1) % 2) * 30, 0),
    30,
    false
FROM generate_series(0, 17) AS slot_idx
CROSS JOIN (SELECT DISTINCT day_of_week FROM public.academic_days WHERE is_teaching_day = true) AS days
ON CONFLICT (day_of_week, slot_index) DO NOTHING;

-- Seed default room features
INSERT INTO public.room_features (name, description, category) VALUES
    ('projector', 'Video projector', 'AV'),
    ('smart_board', 'Interactive smart board', 'AV'),
    ('computers', 'Desktop computers', 'COMPUTING'),
    ('science_lab', 'Science lab equipment', 'SCIENCE'),
    ('nursing_equipment', 'Nursing clinical equipment', 'MEDICAL'),
    ('audio_visual', 'Audio visual system', 'AV'),
    ('wheelchair_access', 'Wheelchair accessible', 'ACCESSIBILITY'),
    ('specialized_equipment', 'Specialized equipment', 'GENERAL')
ON CONFLICT (name) DO NOTHING;

-- Seed default constraints
INSERT INTO public.timetable_constraints (name, constraint_type, is_enabled, weight, description) VALUES
    ('instructor_no_double_booking', 'HARD', true, 1.0, 'Instructor cannot teach two classes simultaneously'),
    ('room_no_double_booking', 'HARD', true, 1.0, 'Room cannot host two classes simultaneously'),
    ('student_no_double_booking', 'HARD', true, 1.0, 'Student cannot be scheduled into two classes simultaneously'),
    ('capacity_check', 'HARD', true, 1.0, 'Room capacity must be >= expected enrollment'),
    ('room_type_match', 'HARD', true, 1.0, 'Required room type must match the course'),
    ('room_features_match', 'HARD', true, 1.0, 'Required room equipment must exist'),
    ('instructor_availability', 'HARD', true, 1.0, 'Instructor availability must be respected'),
    ('room_availability', 'HARD', true, 1.0, 'Room availability must be respected'),
    ('academic_term_match', 'HARD', true, 1.0, 'Academic term must match'),
    ('holiday_block', 'HARD', true, 1.0, 'Holidays and blocked periods must not be used'),
    ('consecutive_sessions', 'HARD', true, 1.0, 'Courses requiring consecutive blocks must receive consecutive blocks'),
    ('clinical_room_match', 'HARD', true, 1.0, 'Clinical/laboratory courses must receive appropriate rooms'),
    ('prerequisite_sequence', 'SOFT', true, 0.5, 'Prerequisites should not be scheduled in impossible sequences'),
    ('student_gap_minimization', 'SOFT', true, 0.3, 'Minimize student timetable gaps'),
    ('instructor_gap_minimization', 'SOFT', true, 0.3, 'Minimize instructor timetable gaps'),
    ('building_change_minimization', 'SOFT', true, 0.2, 'Minimize unnecessary building changes'),
    ('room_utilization', 'SOFT', true, 0.2, 'Maximize efficient room utilization'),
    ('preferred_times', 'SOFT', true, 0.1, 'Respect preferred times when available')
ON CONFLICT (name) DO NOTHING;

-- Seed default preferences
INSERT INTO public.timetable_preferences (name, weight, is_enabled, description) VALUES
    ('student_gap_weight', 10.0, true, 'Minimize gaps between student classes'),
    ('instructor_preference_weight', 7.0, true, 'Respect instructor preferred times and days'),
    ('room_utilization_weight', 5.0, true, 'Optimize room utilization'),
    ('building_change_weight', 4.0, true, 'Minimize building changes for students'),
    ('avoid_early_classes', 3.0, true, 'Avoid very early morning classes'),
    ('avoid_late_classes', 3.0, true, 'Avoid very late afternoon classes'),
    ('avoid_friday_afternoon', 2.0, true, 'Avoid Friday late-afternoon classes'),
    ('daily_balance', 2.0, true, 'Distribute classes throughout the week'),
    ('instructor_daily_balance', 2.0, true, 'Avoid excessive teaching load on one day'),
    ('cohort_grouping', 1.0, true, 'Keep program cohorts together where practical'),
    ('room_capacity_waste', 1.0, true, 'Minimize room capacity waste'),
    ('preferred_rooms', 1.0, true, 'Prioritize preferred rooms'),
    ('back_to_back', 1.0, true, 'Minimize undesirable back-to-back classes')
ON CONFLICT (name) DO NOTHING;
