-- =============================================
-- ENUMS
-- =============================================
DO $$ BEGIN
    CREATE TYPE housing_invoice_status AS ENUM ('PENDING', 'PARTIALLY_PAID', 'PAID', 'CANCELLED', 'OVERDUE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE housing_payment_method AS ENUM ('CREDIT_CARD', 'BANK_TRANSFER', 'MOBILE_MONEY', 'LOCAL_RAILS', 'PAYGOWIRE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE housing_payment_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE housing_invoice_item_type AS ENUM ('HOUSING_DEPOSIT', 'MONTHLY_RENT', 'UTILITIES', 'CLEANING_FEE', 'MEAL_PLAN', 'LATE_FEE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================
-- HOUSING INVOICES
-- =============================================
CREATE TABLE IF NOT EXISTS housing_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_number TEXT UNIQUE NOT NULL, -- Human readable ref e.g., INV-2026-001
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    application_id UUID REFERENCES housing_applications(id), -- Optional, can differ for monthly rent
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    paid_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'CAD',
    status housing_invoice_status NOT NULL DEFAULT 'PENDING',
    due_date DATE NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb, -- Store snapshot of room info etc.
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE housing_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own invoices" ON housing_invoices
    FOR SELECT TO authenticated
    USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view and manage all invoices" ON housing_invoices
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- =============================================
-- HOUSING INVOICE ITEMS
-- =============================================
CREATE TABLE IF NOT EXISTS housing_invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES housing_invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    item_type housing_invoice_item_type NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE housing_invoice_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own invoice items" ON housing_invoice_items
    FOR SELECT TO authenticated
    USING (invoice_id IN (
        SELECT id FROM housing_invoices 
        WHERE student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
    ));

CREATE POLICY "Admins can manage invoice items" ON housing_invoice_items
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- =============================================
-- HOUSING PAYMENTS
-- =============================================
CREATE TABLE IF NOT EXISTS housing_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES housing_invoices(id),
    student_id TEXT NOT NULL REFERENCES students(id),
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'CAD',
    status housing_payment_status NOT NULL DEFAULT 'PENDING',
    payment_method housing_payment_method NOT NULL,
    
    -- PayGoWire Integration Fields
    paygowire_transaction_id TEXT, -- External ID from PayGoWire
    paygowire_payment_url TEXT,
    billing_country TEXT, -- Required for compliance
    
    paid_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE housing_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own payments" ON housing_payments
    FOR SELECT TO authenticated
    USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view and manage payments" ON housing_payments
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- =============================================
-- HOUSING AUDIT LOGS
-- =============================================
CREATE TABLE IF NOT EXISTS housing_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL, -- e.g., 'INVOICE_GENERATED', 'PAYMENT_COMPLETED', 'ROOM_ASSIGNED'
    performed_by UUID REFERENCES profiles(id), -- User who did the action
    target_resource TEXT NOT NULL, -- e.g., 'housing_invoices'
    target_id UUID, -- ID of the resource
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE housing_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs" ON housing_audit_logs
    FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- Function to update invoice status when payment is made
CREATE OR REPLACE FUNCTION update_invoice_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'COMPLETED' AND OLD.status != 'COMPLETED' THEN
        -- Update the paid_amount in invoice
        UPDATE housing_invoices
        SET 
            paid_amount = paid_amount + NEW.amount,
            updated_at = NOW(),
            status = CASE 
                WHEN (paid_amount + NEW.amount) >= total_amount THEN 'PAID'::housing_invoice_status
                ELSE 'PARTIALLY_PAID'::housing_invoice_status
            END
        WHERE id = NEW.invoice_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_payment_complete
AFTER UPDATE ON housing_payments
FOR EACH ROW
EXECUTE FUNCTION update_invoice_status();
