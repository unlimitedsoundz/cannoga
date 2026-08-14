-- =============================================
-- STUDENT LIFE AND SUPPORT TABLES
-- =============================================

-- 1. Direct messaging between students and staff
CREATE TABLE IF NOT EXISTS public.student_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    category TEXT DEFAULT 'GENERAL',
    priority TEXT DEFAULT 'NORMAL',
    status TEXT DEFAULT 'sent',
    read_at TIMESTAMP(3),
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. International student compliance tracking
CREATE TABLE IF NOT EXISTS public.compliance_trackers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    tracker_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    due_date DATE,
    document_url TEXT,
    notes TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Library book holds and account
CREATE TABLE IF NOT EXISTS public.library_holds (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    book_title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT,
    hold_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Campus health, counseling, and advising bookings
CREATE TABLE IF NOT EXISTS public.health_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    booking_type TEXT NOT NULL,
    provider_name TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    location TEXT,
    status TEXT DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_student_messages_sender ON public.student_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_student_messages_recipient ON public.student_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_student_messages_status ON public.student_messages(status);
CREATE INDEX IF NOT EXISTS idx_compliance_trackers_student ON public.compliance_trackers(student_id);
CREATE INDEX IF NOT EXISTS idx_compliance_trackers_status ON public.compliance_trackers(status);
CREATE INDEX IF NOT EXISTS idx_library_holds_student ON public.library_holds(student_id);
CREATE INDEX IF NOT EXISTS idx_library_holds_status ON public.library_holds(status);
CREATE INDEX IF NOT EXISTS idx_health_bookings_student ON public.health_bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_health_bookings_date ON public.health_bookings(appointment_date);

-- =============================================
-- RLS POLICIES
-- =============================================
ALTER TABLE public.student_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_trackers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_bookings ENABLE ROW LEVEL SECURITY;

-- Student Messages
DROP POLICY IF EXISTS "Students can view own messages" ON public.student_messages;
CREATE POLICY "Students can view own messages" ON public.student_messages
FOR SELECT TO authenticated USING (
    sender_id = auth.uid() OR recipient_id = auth.uid()
);

DROP POLICY IF EXISTS "Students can send messages" ON public.student_messages;
CREATE POLICY "Students can send messages" ON public.student_messages
FOR INSERT TO authenticated WITH CHECK (
    sender_id = auth.uid()
);

DROP POLICY IF EXISTS "Students can update own messages" ON public.student_messages;
CREATE POLICY "Students can update own messages" ON public.student_messages
FOR UPDATE TO authenticated USING (
    sender_id = auth.uid() OR recipient_id = auth.uid()
)
WITH CHECK (
    sender_id = auth.uid() OR recipient_id = auth.uid()
);

DROP POLICY IF EXISTS "Admins can manage all messages" ON public.student_messages;
CREATE POLICY "Admins can manage all messages" ON public.student_messages
FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'STUDENT_SERVICES', 'INTERNATIONAL_OFFICER'))
);

-- Compliance Trackers
DROP POLICY IF EXISTS "Students can view own compliance trackers" ON public.compliance_trackers;
CREATE POLICY "Students can view own compliance trackers" ON public.compliance_trackers
FOR SELECT TO authenticated USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Admins can manage compliance trackers" ON public.compliance_trackers;
CREATE POLICY "Admins can manage compliance trackers" ON public.compliance_trackers
FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'INTERNATIONAL_OFFICER', 'STUDENT_SERVICES'))
);

-- Library Holds
DROP POLICY IF EXISTS "Students can view own library holds" ON public.library_holds;
CREATE POLICY "Students can view own library holds" ON public.library_holds
FOR SELECT TO authenticated USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Students can insert own library holds" ON public.library_holds;
CREATE POLICY "Students can insert own library holds" ON public.library_holds
FOR INSERT TO authenticated WITH CHECK (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Students can update own library holds" ON public.library_holds;
CREATE POLICY "Students can update own library holds" ON public.library_holds
FOR UPDATE TO authenticated USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
)
WITH CHECK (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Admins can manage all library holds" ON public.library_holds;
CREATE POLICY "Admins can manage all library holds" ON public.library_holds
FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'REGISTRAR'))
);

-- Health Bookings
DROP POLICY IF EXISTS "Students can view own health bookings" ON public.health_bookings;
CREATE POLICY "Students can view own health bookings" ON public.health_bookings
FOR SELECT TO authenticated USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Students can insert own health bookings" ON public.health_bookings;
CREATE POLICY "Students can insert own health bookings" ON public.health_bookings
FOR INSERT TO authenticated WITH CHECK (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Students can update own health bookings" ON public.health_bookings;
CREATE POLICY "Students can update own health bookings" ON public.health_bookings
FOR UPDATE TO authenticated USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
)
WITH CHECK (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Admins can manage all health bookings" ON public.health_bookings;
CREATE POLICY "Admins can manage all health bookings" ON public.health_bookings
FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'STUDENT_SERVICES'))
);

-- =============================================
-- UPDATED_AT TRIGGERS
-- =============================================
CREATE OR REPLACE FUNCTION update_student_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_student_messages_updated_at ON public.student_messages;
CREATE TRIGGER trigger_student_messages_updated_at
    BEFORE UPDATE ON public.student_messages
    FOR EACH ROW EXECUTE FUNCTION update_student_messages_updated_at();

CREATE OR REPLACE FUNCTION update_compliance_trackers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_compliance_trackers_updated_at ON public.compliance_trackers;
CREATE TRIGGER trigger_compliance_trackers_updated_at
    BEFORE UPDATE ON public.compliance_trackers
    FOR EACH ROW EXECUTE FUNCTION update_compliance_trackers_updated_at();

CREATE OR REPLACE FUNCTION update_health_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_health_bookings_updated_at ON public.health_bookings;
CREATE TRIGGER trigger_health_bookings_updated_at
    BEFORE UPDATE ON public.health_bookings
    FOR EACH ROW EXECUTE FUNCTION update_health_bookings_updated_at();
