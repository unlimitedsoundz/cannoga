BEGIN;

-- ============================================================
-- 1. DYNAMIC PAYMENT PURPOSES (Admin Managed)
-- ============================================================
CREATE TABLE IF NOT EXISTS payment_purposes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(64)  NOT NULL UNIQUE,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    default_amount_cad NUMERIC(10,2),
    allow_partial_payments BOOLEAN NOT NULL DEFAULT false,
    is_active   BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

INSERT INTO payment_purposes (code, title, description, default_amount_cad, display_order)
VALUES
    ('tuition_deposit',        'Tuition Deposit',             'Initial deposit required upon accepting your offer.',              2000.00, 1),
    ('fall_semester_tuition',  'Fall Semester Tuition',       'Full tuition payment for the Fall semester.',                     NULL,    2),
    ('winter_semester_tuition','Winter Semester Tuition',     'Full tuition payment for the Winter semester.',                   NULL,    3),
    ('housing_deposit',        'Housing Deposit',             'Refundable security deposit for on-campus residence.',            500.00,  4),
    ('residence_rent',         'Residence Rent',              'Monthly residence rent payment.',                                 NULL,    5),
    ('graduation_fee',         'Graduation Fee',              'Convocation ceremony, diploma, and academic regalia fee.',        350.00,  6),
    ('transcript_request',     'Official Transcript Request', 'Fee for issuing official sealed transcripts.',                    25.00,   7),
    ('application_fee',        'Application Fee',             'Non-refundable application processing fee.',                      150.00,  8)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- 2. INSTITUTIONAL BANK ACCOUNTS (Admin Managed, Per Country)
-- ============================================================
CREATE TABLE IF NOT EXISTS institutional_bank_accounts (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_code         VARCHAR(2)   NOT NULL,
    country_name         VARCHAR(100) NOT NULL,
    country_flag         VARCHAR(10),
    currency             VARCHAR(3)   NOT NULL,
    currency_symbol      VARCHAR(10)  NOT NULL,
    bank_name            VARCHAR(255) NOT NULL,
    account_name         VARCHAR(255) NOT NULL,
    account_number       VARCHAR(100) NOT NULL,
    account_type         VARCHAR(100) NOT NULL,
    routing_or_sort_code VARCHAR(100),
    swift_bic            VARCHAR(20),
    iban                 VARCHAR(50),
    branch_address       TEXT,
    transfer_instructions TEXT,
    processing_time      VARCHAR(100) DEFAULT '2-5 business days',
    is_active            BOOLEAN NOT NULL DEFAULT true,
    display_order        INT NOT NULL DEFAULT 0,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_bank_account_country_currency UNIQUE (country_code, currency)
);

INSERT INTO institutional_bank_accounts (
    country_code, country_name, country_flag, currency, currency_symbol,
    bank_name, account_name, account_number, account_type,
    routing_or_sort_code, swift_bic, iban,
    transfer_instructions, processing_time, display_order
) VALUES
('NG','Nigeria','🇳🇬','NGN','₦',
 'Zenith Bank PLC','CANNOGA COLLEGE EDUCATIONAL SERVICES','1013456789','Corporate NUBAN',
 NULL,NULL,NULL,
 'Use NIBSS Instant Payment (NIP) for fastest settlement. Transfer the exact Naira amount and include your tracking reference (CC-NG-XXXX-XXXXXX) in the narration field.',
 '1-2 hours', 1),
('CA','Canada','🇨🇦','CAD','$',
 'Royal Bank of Canada (RBC)','CANNOGA COLLEGE EDUCATIONAL SERVICES','1234567','Commercial Chequing',
 '003-00100','ROYCCAT2','CA71 0300 0100 0000 1234 567',
 'Initiate a CAD wire or Interac e-Transfer. A $25.00 CAD processing fee is included. Include your tracking reference as the payment reference.',
 '7-14 business days', 2),
('US','United States','🇺🇸','USD','$',
 'JP Morgan Chase Bank, N.A.','CANNOGA COLLEGE EDUCATIONAL SERVICES','30000001050066','Commercial Checking',
 '028000024','CHASUS33',NULL,
 'Initiate a USD wire using ACH Routing 028000024 and Wire Routing 021000021. Include your tracking reference in the payment reference field.',
 '10-15 business days', 3),
('GB','United Kingdom','🇬🇧','GBP','£',
 'Barclays Bank PLC','CANNOGA COLLEGE EDUCATIONAL SERVICES','30103996','Business Account',
 '20-32-18','BARCGB22','GB81BARC20321830103996',
 'Transfer in GBP using Sort Code and Account Number. Include your tracking reference in the payment reference field.',
 '10-15 business days', 4),
('GH','Ghana','🇬🇭','GHS','GH₵',
 'GCB Bank Limited','CANNOGA COLLEGE EDUCATIONAL SERVICES','1331000000001','Corporate Account',
 NULL,NULL,NULL,
 'Transfer via GCB Bank. Include your tracking reference in the narration field.',
 '1-3 business days', 5),
('IN','India','🇮🇳','INR','₹',
 'HDFC Bank Limited','CANNOGA COLLEGE EDUCATIONAL SERVICES','50100123456789','Current Account',
 'HDFC0001234','HDFCINBB',NULL,
 'Transfer via NEFT, RTGS, or IMPS. Include your tracking reference in the remarks field.',
 '1-2 business days', 6),
('AE','United Arab Emirates','🇦🇪','AED','AED',
 'Emirates NBD','CANNOGA COLLEGE EDUCATIONAL SERVICES','1011234567891','Corporate Account',
 NULL,'EBILAEAD','AE070260001011234567891',
 'Transfer via UAE bank wire. Include your tracking reference in the notes field.',
 '2-3 business days', 7)
ON CONFLICT (country_code, currency) DO NOTHING;

-- ============================================================
-- 3. INSTITUTIONAL EXCHANGE RATES (Admin Managed)
-- ============================================================
CREATE TABLE IF NOT EXISTS institutional_exchange_rates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_currency   VARCHAR(3) NOT NULL DEFAULT 'CAD',
    to_currency     VARCHAR(3) NOT NULL,
    rate_multiplier NUMERIC(14,6) NOT NULL,
    lock_duration_hours INT NOT NULL DEFAULT 48,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    notes           TEXT,
    last_updated_by UUID REFERENCES auth.users(id),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_exchange_rate UNIQUE (from_currency, to_currency)
);

INSERT INTO institutional_exchange_rates (from_currency, to_currency, rate_multiplier, lock_duration_hours, notes)
VALUES
    ('CAD','NGN',1120.000000, 48,'Institutional locked rate. CBN reference rate with margin.'),
    ('CAD','USD',0.730000,    48,'Bank of Canada mid-market rate with margin.'),
    ('CAD','GBP',0.580000,    48,'Bank of Canada mid-market rate with margin.'),
    ('CAD','GHS',11.200000,   48,'Bank of Canada mid-market rate with margin.'),
    ('CAD','INR',61.420000,   48,'Bank of Canada mid-market rate with margin.'),
    ('CAD','AED',2.690000,    48,'Bank of Canada mid-market rate with margin.'),
    ('CAD','CAD',1.000000,    48,'Same-currency CAD (no conversion needed).')
ON CONFLICT (from_currency, to_currency) DO NOTHING;

-- ============================================================
-- 4. EXTEND tuition_payments FOR WIRE VERIFICATION WORKFLOW
-- ============================================================
ALTER TABLE tuition_payments
    ADD COLUMN IF NOT EXISTS wire_tracking_ref     VARCHAR(32),
    ADD COLUMN IF NOT EXISTS country_code          VARCHAR(2),
    ADD COLUMN IF NOT EXISTS local_currency        VARCHAR(3),
    ADD COLUMN IF NOT EXISTS local_amount          NUMERIC(14,2),
    ADD COLUMN IF NOT EXISTS exchange_rate_applied NUMERIC(14,6),
    ADD COLUMN IF NOT EXISTS student_proof_ref     VARCHAR(255),
    ADD COLUMN IF NOT EXISTS student_proof_url     TEXT,
    ADD COLUMN IF NOT EXISTS proof_submitted_at    TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS admin_verified_by     UUID REFERENCES auth.users(id),
    ADD COLUMN IF NOT EXISTS admin_verified_at     TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS admin_notes           TEXT;

-- Expand status CHECK to include wire workflow statuses and legacy statuses
ALTER TABLE tuition_payments DROP CONSTRAINT IF EXISTS tuition_payments_status_check;
ALTER TABLE tuition_payments ADD CONSTRAINT tuition_payments_status_check
    CHECK (status IN (
        'COMPLETED',
        'PENDING',
        'FAILED',
        'REFUNDED',
        'verified',
        'completed',
        'pending',
        'failed',
        'pending_proof',
        'pending_admin_verification'
    ));

-- Indexes for queue and reference lookups
CREATE INDEX IF NOT EXISTS idx_tuition_payments_pending_verification
    ON tuition_payments(status)
    WHERE status = 'pending_admin_verification';

CREATE INDEX IF NOT EXISTS idx_tuition_payments_wire_ref
    ON tuition_payments(wire_tracking_ref)
    WHERE wire_tracking_ref IS NOT NULL;

-- ============================================================
-- 5. ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE payment_purposes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutional_bank_accounts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutional_exchange_rates ENABLE ROW LEVEL SECURITY;

-- Students and staff can read active records
CREATE POLICY "Read active payment purposes"
    ON payment_purposes FOR SELECT TO authenticated
    USING (is_active = true);

CREATE POLICY "Read active bank accounts"
    ON institutional_bank_accounts FOR SELECT TO authenticated
    USING (is_active = true);

CREATE POLICY "Read active exchange rates"
    ON institutional_exchange_rates FOR SELECT TO authenticated
    USING (is_active = true);

-- Finance/Admin: read ALL records (including inactive)
CREATE POLICY "Admin read all payment purposes"
    ON payment_purposes FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
          AND profiles.role IN ('ADMIN','REGISTRAR','FINANCE_OFFICER')
    ));

CREATE POLICY "Admin read all bank accounts"
    ON institutional_bank_accounts FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
          AND profiles.role IN ('ADMIN','REGISTRAR','FINANCE_OFFICER')
    ));

CREATE POLICY "Admin read all exchange rates"
    ON institutional_exchange_rates FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
          AND profiles.role IN ('ADMIN','REGISTRAR','FINANCE_OFFICER')
    ));

-- Finance/Admin: full write access
CREATE POLICY "Admin manage payment purposes"
    ON payment_purposes FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
          AND profiles.role IN ('ADMIN','REGISTRAR','FINANCE_OFFICER')
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
          AND profiles.role IN ('ADMIN','REGISTRAR','FINANCE_OFFICER')
    ));

CREATE POLICY "Admin manage bank accounts"
    ON institutional_bank_accounts FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
          AND profiles.role IN ('ADMIN','REGISTRAR','FINANCE_OFFICER')
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
          AND profiles.role IN ('ADMIN','REGISTRAR','FINANCE_OFFICER')
    ));

CREATE POLICY "Admin manage exchange rates"
    ON institutional_exchange_rates FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
          AND profiles.role IN ('ADMIN','REGISTRAR','FINANCE_OFFICER')
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
          AND profiles.role IN ('ADMIN','REGISTRAR','FINANCE_OFFICER')
    ));

COMMIT;
