-- Financial tables for Cannoga College SIS
-- Creates invoices and payments tables for student financial management

BEGIN;

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('TUITION', 'LAB_FEE', 'HOUSING', 'OTHER')),
  term TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  paid NUMERIC(10, 2) NOT NULL DEFAULT 0,
  balance NUMERIC(10, 2) NOT NULL DEFAULT 0,
  due_date TIMESTAMP(3),
  status TEXT NOT NULL DEFAULT 'OUTSTANDING' CHECK (status IN ('PAID', 'PARTIAL', 'OUTSTANDING', 'OVERDUE')),
  issued_date TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_invoices_student_id ON invoices(student_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id TEXT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  transaction_reference TEXT NOT NULL UNIQUE,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('CREDIT_CARD', 'BANK_TRANSFER', 'CHECK', 'CASH', 'OTHER')),
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('COMPLETED', 'PENDING', 'FAILED', 'REFUNDED')),
  payment_date TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policies - Students can read their own invoices and payments
CREATE POLICY "Students can read own invoices" ON invoices FOR SELECT USING (
  EXISTS (SELECT 1 FROM students WHERE students.id = invoices.student_id AND students.user_id = auth.uid())
);

CREATE POLICY "Students can read own payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM students WHERE students.id = payments.student_id AND students.user_id = auth.uid())
);

-- Admin and registrar full access
CREATE POLICY "Admin full access to invoices" ON invoices TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'REGISTRAR', 'FINANCE_OFFICER'))
);

CREATE POLICY "Admin full access to payments" ON payments TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'REGISTRAR', 'FINANCE_OFFICER'))
);

COMMIT;