-- Push notifications sent by admin to students
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  recipient_type TEXT NOT NULL DEFAULT 'all' CHECK (recipient_type IN ('all', 'program', 'individual')),
  recipient_ids JSONB DEFAULT '[]'::jsonb,
  related_id TEXT,
  related_type TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP(3),
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students read own notifications" ON notifications;
CREATE POLICY "Students read own notifications" ON notifications FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM students WHERE students.id = notifications.recipient_ids::text[])
);

DROP POLICY IF EXISTS "Admin full access notifications" ON notifications;
CREATE POLICY "Admin full access notifications" ON notifications TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'REGISTRAR', 'STUDENT_SERVICES'))
);

DROP POLICY IF EXISTS "Students update own notifications" ON notifications;
CREATE POLICY "Students update own notifications" ON notifications FOR UPDATE USING (
  auth.uid() IN (SELECT user_id FROM students WHERE students.id = notifications.recipient_ids::text[])
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_ids ON notifications USING gin (recipient_ids);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications (created_at DESC);
