-- =============================================
-- STUDENT TASKS TABLE
-- Automatic and manual tasks for students
-- =============================================

CREATE TABLE IF NOT EXISTS public.student_tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    task_type TEXT NOT NULL DEFAULT 'automatic',
    priority TEXT NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'pending',
    due_date TIMESTAMPTZ,
    action_url TEXT,
    action_label TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.student_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own tasks" ON public.student_tasks
FOR SELECT TO authenticated USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

CREATE POLICY "Students can update own tasks" ON public.student_tasks
FOR UPDATE TO authenticated USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
)
WITH CHECK (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can manage all tasks" ON public.student_tasks
FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'ADMISSIONS'))
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_student_tasks_student_id ON public.student_tasks(student_id);
CREATE INDEX IF NOT EXISTS idx_student_tasks_status ON public.student_tasks(status);
