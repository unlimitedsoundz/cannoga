CREATE TABLE IF NOT EXISTS public.installment_plans (
    id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    invoice_id TEXT REFERENCES invoices(id) ON DELETE SET NULL,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    number_of_installments INTEGER NOT NULL DEFAULT 4,
    installment_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    start_date TIMESTAMP(3) NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'DEFAULTED', 'CANCELLED')),
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.installment_payments (
    id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
    installment_plan_id TEXT NOT NULL REFERENCES installment_plans(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    due_date TIMESTAMP(3) NOT NULL,
    paid_date TIMESTAMP(3),
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'OVERDUE', 'WAIVED')),
    payment_method TEXT CHECK (payment_method IN ('CREDIT_CARD', 'BANK_TRANSFER', 'CHECK', 'CASH', 'OTHER')),
    transaction_reference TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.bank_accounts (
    id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    bank_name TEXT NOT NULL,
    branch_number TEXT,
    institution_number TEXT,
    account_number TEXT NOT NULL,
    account_holder_name TEXT NOT NULL,
    account_type TEXT CHECK (account_type IN ('CHECKING', 'SAVINGS')),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_installment_plans_student_id ON public.installment_plans(student_id);
CREATE INDEX IF NOT EXISTS idx_installment_payments_plan_id ON public.installment_payments(installment_plan_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_student_id ON public.bank_accounts(student_id);
