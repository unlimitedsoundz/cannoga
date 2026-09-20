-- ==============================================================================
-- MIGRATION: Microsoft 365 Education Sync Infrastructure
-- Description: Non-destructive additions to support full Microsoft Education
--              class provisioning, enrollment sync, classwork, and assignments.
-- Cannoga SIS remains the authoritative source of truth.
-- ==============================================================================

-- ==============================================================================
-- 1. Extend course_sections with missing Microsoft mapping fields
-- (microsoft_class_id, microsoft_team_id, microsoft_group_id already added in
--  20260918_microsoft_education_mappings.sql — add the remaining fields)
-- ==============================================================================
ALTER TABLE public.course_sections
    ADD COLUMN IF NOT EXISTS microsoft_site_id       TEXT,
    ADD COLUMN IF NOT EXISTS microsoft_sync_status   TEXT NOT NULL DEFAULT 'UNSYNCED'
        CHECK (microsoft_sync_status IN ('UNSYNCED', 'PENDING', 'SYNCED', 'ERROR', 'ARCHIVED')),
    ADD COLUMN IF NOT EXISTS microsoft_last_synced_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS microsoft_sync_error    TEXT;

CREATE INDEX IF NOT EXISTS idx_course_sections_microsoft_sync_status
    ON public.course_sections(microsoft_sync_status);

-- ==============================================================================
-- 2. Durable Microsoft Sync Queue
-- Decouples Cannoga SIS transactions from Microsoft Graph calls.
-- All Microsoft provisioning/roster changes flow through this queue.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.microsoft_sync_queue (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type     TEXT NOT NULL CHECK (entity_type IN (
                        'student', 'faculty', 'course_section',
                        'enrollment', 'classwork_unit', 'assignment'
                    )),
    entity_id       TEXT NOT NULL,               -- Cannoga SIS entity ID
    action          TEXT NOT NULL CHECK (action IN (
                        'create', 'update', 'archive',
                        'add_student', 'remove_student',
                        'add_teacher', 'remove_teacher',
                        'publish', 'sync_classwork', 'sync_assignment'
                    )),
    payload         JSONB DEFAULT '{}'::jsonb,   -- Non-sensitive context data
    status          TEXT NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'SKIPPED')),
    attempts        INTEGER NOT NULL DEFAULT 0,
    max_attempts    INTEGER NOT NULL DEFAULT 5,
    last_error      TEXT,
    scheduled_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at      TIMESTAMPTZ,
    processed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_ms_sync_queue_status
    ON public.microsoft_sync_queue(status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_ms_sync_queue_entity
    ON public.microsoft_sync_queue(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_ms_sync_queue_action
    ON public.microsoft_sync_queue(action);

-- RLS: Only admins and service role can access the queue
ALTER TABLE public.microsoft_sync_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins view sync queue" ON public.microsoft_sync_queue;
CREATE POLICY "Admins view sync queue" ON public.microsoft_sync_queue
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR')
        )
    );

DROP POLICY IF EXISTS "Admins manage sync queue" ON public.microsoft_sync_queue;
CREATE POLICY "Admins manage sync queue" ON public.microsoft_sync_queue
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

-- ==============================================================================
-- 3. Module Classwork Units
-- Maps Cannoga course content (weekly topics / module units) to Microsoft
-- Education Classwork modules. Cannoga content is authoritative.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.module_classwork_units (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_section_id       UUID NOT NULL REFERENCES public.course_sections(id) ON DELETE CASCADE,
    title                   TEXT NOT NULL,
    description             TEXT,
    display_order           INTEGER NOT NULL DEFAULT 0,
    week_number             INTEGER,                     -- Optional week reference
    status                  TEXT NOT NULL DEFAULT 'DRAFT'
        CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    -- Microsoft Classwork mapping
    microsoft_module_id     TEXT,
    microsoft_sync_status   TEXT NOT NULL DEFAULT 'UNSYNCED'
        CHECK (microsoft_sync_status IN ('UNSYNCED', 'PENDING', 'SYNCED', 'ERROR')),
    microsoft_last_synced_at TIMESTAMPTZ,
    microsoft_sync_error    TEXT,
    -- Metadata
    created_by              UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_classwork_units_section
    ON public.module_classwork_units(course_section_id);
CREATE INDEX IF NOT EXISTS idx_classwork_units_ms_module
    ON public.module_classwork_units(microsoft_module_id);
CREATE INDEX IF NOT EXISTS idx_classwork_units_sync_status
    ON public.module_classwork_units(microsoft_sync_status);

ALTER TABLE public.module_classwork_units ENABLE ROW LEVEL SECURITY;

-- Faculty can view classwork for their sections
DROP POLICY IF EXISTS "Faculty view classwork units" ON public.module_classwork_units;
CREATE POLICY "Faculty view classwork units" ON public.module_classwork_units
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.course_sections cs
            WHERE cs.id = module_classwork_units.course_section_id
              AND cs.instructor_id = auth.uid()::text
        )
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR')
        )
    );

-- Students can view published classwork for their enrolled sections
DROP POLICY IF EXISTS "Students view published classwork" ON public.module_classwork_units;
CREATE POLICY "Students view published classwork" ON public.module_classwork_units
    FOR SELECT TO authenticated
    USING (
        status = 'PUBLISHED'
        AND EXISTS (
            SELECT 1 FROM public.module_enrollments me
            JOIN public.students s ON s.id = me.student_id
            JOIN public.course_sections cs ON cs.id = module_classwork_units.course_section_id
            WHERE s.user_id = auth.uid()
              AND me.module_id = cs.module_id
              AND me.semester_id = cs.semester_id
              AND me.status = 'REGISTERED'
        )
    );

DROP POLICY IF EXISTS "Admins manage classwork units" ON public.module_classwork_units;
CREATE POLICY "Admins manage classwork units" ON public.module_classwork_units
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

-- ==============================================================================
-- 4. Cannoga Assignments
-- Native Cannoga assignments that can optionally sync to Microsoft Education.
-- Registrar/official grades are always in module_enrollments, never here.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.cannoga_assignments (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_section_id       UUID NOT NULL REFERENCES public.course_sections(id) ON DELETE CASCADE,
    classwork_unit_id       UUID REFERENCES public.module_classwork_units(id) ON DELETE SET NULL,
    title                   TEXT NOT NULL,
    instructions            TEXT,
    due_date                TIMESTAMPTZ,
    points_possible         NUMERIC(6,2),
    status                  TEXT NOT NULL DEFAULT 'DRAFT'
        CHECK (status IN ('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED')),
    -- Microsoft Education assignment mapping
    microsoft_assignment_id TEXT,
    microsoft_sync_status   TEXT NOT NULL DEFAULT 'UNSYNCED'
        CHECK (microsoft_sync_status IN ('UNSYNCED', 'PENDING', 'SYNCED', 'ERROR')),
    microsoft_last_synced_at TIMESTAMPTZ,
    microsoft_sync_error    TEXT,
    -- Metadata
    created_by              UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cannoga_assignments_section
    ON public.cannoga_assignments(course_section_id);
CREATE INDEX IF NOT EXISTS idx_cannoga_assignments_ms_id
    ON public.cannoga_assignments(microsoft_assignment_id);
CREATE INDEX IF NOT EXISTS idx_cannoga_assignments_status
    ON public.cannoga_assignments(status);

ALTER TABLE public.cannoga_assignments ENABLE ROW LEVEL SECURITY;

-- Faculty can view/manage assignments for their sections
DROP POLICY IF EXISTS "Faculty manage own section assignments" ON public.cannoga_assignments;
CREATE POLICY "Faculty manage own section assignments" ON public.cannoga_assignments
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.course_sections cs
            WHERE cs.id = cannoga_assignments.course_section_id
              AND cs.instructor_id = auth.uid()::text
        )
    );

-- Students can view published assignments for enrolled sections
DROP POLICY IF EXISTS "Students view published assignments" ON public.cannoga_assignments;
CREATE POLICY "Students view published assignments" ON public.cannoga_assignments
    FOR SELECT TO authenticated
    USING (
        status = 'PUBLISHED'
        AND EXISTS (
            SELECT 1 FROM public.module_enrollments me
            JOIN public.students s ON s.id = me.student_id
            JOIN public.course_sections cs ON cs.id = cannoga_assignments.course_section_id
            WHERE s.user_id = auth.uid()
              AND me.module_id = cs.module_id
              AND me.semester_id = cs.semester_id
              AND me.status = 'REGISTERED'
        )
    );

DROP POLICY IF EXISTS "Admins manage all assignments" ON public.cannoga_assignments;
CREATE POLICY "Admins manage all assignments" ON public.cannoga_assignments
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

-- ==============================================================================
-- 5. Microsoft Sync Settings
-- Stored as key-value pairs in system_settings (reusing existing table).
-- ==============================================================================
INSERT INTO public.system_settings (key, value, description) VALUES
    ('ms_auto_class_creation',    'false', 'Automatically provision Microsoft Education Class when a course section is created'),
    ('ms_auto_enrollment_sync',   'false', 'Automatically queue enrollment sync when a student is enrolled or dropped'),
    ('ms_auto_faculty_sync',      'false', 'Automatically sync faculty/instructor to Microsoft class as teacher'),
    ('ms_auto_classwork_sync',    'false', 'Automatically sync Cannoga classwork units to Microsoft Classwork'),
    ('ms_auto_assignment_sync',   'false', 'Automatically sync Cannoga assignments to Microsoft Education'),
    ('ms_auto_publish_classwork', 'false', 'Automatically publish classwork modules in Microsoft (OFF = keep as draft)'),
    ('ms_auto_publish_assignments','false', 'Automatically publish assignments in Microsoft (OFF = keep as draft)')
ON CONFLICT (key) DO NOTHING;

-- ==============================================================================
-- 6. Extend module_enrollments with Microsoft sync tracking
-- ==============================================================================
ALTER TABLE public.module_enrollments
    ADD COLUMN IF NOT EXISTS microsoft_sync_status   TEXT NOT NULL DEFAULT 'UNSYNCED'
        CHECK (microsoft_sync_status IN ('UNSYNCED', 'PENDING', 'SYNCED', 'ERROR', 'REMOVED')),
    ADD COLUMN IF NOT EXISTS microsoft_last_synced_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_module_enrollments_ms_sync
    ON public.module_enrollments(microsoft_sync_status);
