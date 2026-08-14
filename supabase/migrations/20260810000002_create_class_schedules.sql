-- =============================================
-- CREATE CLASS SCHEDULES TABLE
-- (class_sessions already exists)
-- =============================================

CREATE TABLE IF NOT EXISTS public.class_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id TEXT NOT NULL REFERENCES public."Subject"(id) ON DELETE CASCADE,
    semester_id TEXT NOT NULL REFERENCES public.semesters(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES public."Course"(id) ON DELETE CASCADE,
    instructor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room TEXT,
    building TEXT,
    session_type TEXT DEFAULT 'Lecture' CHECK (session_type IN ('Lecture', 'Lab', 'Tutorial', 'Seminar', 'Online')),
    recurrence_pattern TEXT DEFAULT 'weekly' CHECK (recurrence_pattern IN ('weekly', 'biweekly', 'once')),
    start_date DATE,
    end_date DATE,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_class_schedules_subject ON public.class_schedules(subject_id);
CREATE INDEX IF NOT EXISTS idx_class_schedules_semester ON public.class_schedules(semester_id);
CREATE INDEX IF NOT EXISTS idx_class_schedules_instructor ON public.class_schedules(instructor_id);
CREATE INDEX IF NOT EXISTS idx_class_schedules_day ON public.class_schedules(day_of_week);

-- RLS
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage class schedules" ON public.class_schedules;
CREATE POLICY "Admins can manage class schedules" ON public.class_schedules
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'ADMISSIONS'))
);

DROP POLICY IF EXISTS "Students can view class schedules" ON public.class_schedules;
CREATE POLICY "Students can view class schedules" ON public.class_schedules
FOR SELECT USING (true);
