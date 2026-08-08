-- =============================================
-- TIMETABLE SYSTEM
-- Drop and recreate class_sessions, create class_schedules
-- =============================================

-- Drop existing class_sessions if it has wrong schema
DROP TABLE IF EXISTS public.class_sessions CASCADE;

-- 1. Class Schedules (recurring patterns per subject/semester)
CREATE TABLE public.class_schedules (
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

-- 2. Class Sessions (individual occurrences)
CREATE TABLE public.class_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID REFERENCES public.class_schedules(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES public."Subject"(id) ON DELETE CASCADE,
    semester_id TEXT NOT NULL REFERENCES public.semesters(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES public."Course"(id) ON DELETE CASCADE,
    instructor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room TEXT,
    building TEXT,
    session_type TEXT DEFAULT 'Lecture' CHECK (session_type IN ('Lecture', 'Lab', 'Tutorial', 'Seminar', 'Online')),
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled', 'completed', 'rescheduled')),
    cancellation_reason TEXT,
    substitute_instructor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_class_schedules_subject ON public.class_schedules(subject_id);
CREATE INDEX idx_class_schedules_semester ON public.class_schedules(semester_id);
CREATE INDEX idx_class_schedules_instructor ON public.class_schedules(instructor_id);
CREATE INDEX idx_class_schedules_day ON public.class_schedules(day_of_week);
CREATE INDEX idx_class_sessions_schedule ON public.class_sessions(schedule_id);
CREATE INDEX idx_class_sessions_date ON public.class_sessions(session_date);
CREATE INDEX idx_class_sessions_instructor ON public.class_sessions(instructor_id);

-- RLS Policies
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;

-- Class schedules: admins and admissions can manage, students can view
DROP POLICY IF EXISTS "Admins can manage class schedules" ON public.class_schedules;
CREATE POLICY "Admins can manage class schedules" ON public.class_schedules
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'ADMISSIONS'))
);

DROP POLICY IF EXISTS "Students can view class schedules" ON public.class_schedules;
CREATE POLICY "Students can view class schedules" ON public.class_schedules
FOR SELECT USING (true);

-- Class sessions: admins and admissions can manage, students can view
DROP POLICY IF EXISTS "Admins can manage class sessions" ON public.class_sessions;
CREATE POLICY "Admins can manage class sessions" ON public.class_sessions
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'ADMISSIONS'))
);

DROP POLICY IF EXISTS "Students can view class sessions" ON public.class_sessions;
CREATE POLICY "Students can view class sessions" ON public.class_sessions
FOR SELECT USING (true);

-- Seed sample data
DO $$
DECLARE
    v_subject_id TEXT;
    v_semester_id TEXT;
    v_course_id TEXT;
    v_instructor_id UUID;
    v_schedule_id UUID;
BEGIN
    SELECT id INTO v_subject_id FROM public."Subject" LIMIT 1;
    SELECT id INTO v_semester_id FROM public.semesters WHERE status = 'ACTIVE' LIMIT 1;
    SELECT id INTO v_course_id FROM public."Course" LIMIT 1;
    SELECT id INTO v_instructor_id FROM public.profiles WHERE role IN ('ADMIN', 'ADMISSIONS') LIMIT 1;

    IF v_subject_id IS NOT NULL AND v_semester_id IS NOT NULL THEN
        INSERT INTO public.class_schedules (
            subject_id, semester_id, course_id, instructor_id,
            day_of_week, start_time, end_time, room, building,
            session_type, recurrence_pattern, start_date, end_date, is_active
        ) VALUES (
            v_subject_id, v_semester_id, v_course_id, v_instructor_id,
            1, '09:00:00', '10:30:00', 'Room 101', 'Main Building',
            'Lecture', 'weekly', 
            (SELECT start_date FROM public.semesters WHERE id = v_semester_id),
            (SELECT end_date FROM public.semesters WHERE id = v_semester_id),
            true
        ) RETURNING id INTO v_schedule_id;

        FOR i IN 0..13 LOOP
            INSERT INTO public.class_sessions (
                schedule_id, subject_id, semester_id, course_id, instructor_id,
                session_date, start_time, end_time, room, building,
                session_type, status
            ) VALUES (
                v_schedule_id, v_subject_id, v_semester_id, v_course_id, v_instructor_id,
                (SELECT start_date FROM public.semesters WHERE id = v_semester_id) + (i * 7 || ' days')::INTERVAL,
                '09:00:00', '10:30:00', 'Room 101', 'Main Building',
                'Lecture', 'scheduled'
            );
        END LOOP;
    END IF;
END $$;
