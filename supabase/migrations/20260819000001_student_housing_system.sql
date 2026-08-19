BEGIN;

-- =============================================
-- ENUMS (safe idempotent)
-- =============================================
DO $$ BEGIN
    CREATE TYPE residence_style_enum AS ENUM ('traditional_dorm', 'suite_style', 'townhouse', 'deluxe_studio', 'homestay');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE work_order_urgency_enum AS ENUM ('low', 'standard', 'urgent', 'emergency');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE work_order_status_enum AS ENUM ('open', 'assigned', 'in_progress', 'resolved', 'closed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- =============================================
-- EXTEND housing_buildings (additive only)
-- =============================================
ALTER TABLE housing_buildings
    ADD COLUMN IF NOT EXISTS code            VARCHAR(32),
    ADD COLUMN IF NOT EXISTS style           residence_style_enum,
    ADD COLUMN IF NOT EXISTS total_floors    INT NOT NULL DEFAULT 4,
    ADD COLUMN IF NOT EXISTS total_beds      INT NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS amenities       JSONB NOT NULL DEFAULT '["High-Speed Wi-Fi","Hydro Included","Heating","24/7 Keycard Access","Laundry","Study Lounge"]'::jsonb,
    ADD COLUMN IF NOT EXISTS image_url       TEXT,
    ADD COLUMN IF NOT EXISTS is_active       BOOLEAN NOT NULL DEFAULT true;

-- =============================================
-- EXTEND housing_rooms (additive only)
-- =============================================
ALTER TABLE housing_rooms
    ADD COLUMN IF NOT EXISTS floor_number       INT NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS suite_number       VARCHAR(32),
    ADD COLUMN IF NOT EXISTS bed_identifier     VARCHAR(16),
    ADD COLUMN IF NOT EXISTS full_room_code     VARCHAR(64),
    ADD COLUMN IF NOT EXISTS room_type_label    VARCHAR(128),
    ADD COLUMN IF NOT EXISTS price_per_term_minor BIGINT,
    ADD COLUMN IF NOT EXISTS window_orientation VARCHAR(64) DEFAULT 'Courtyard View',
    ADD COLUMN IF NOT EXISTS is_accessible      BOOLEAN NOT NULL DEFAULT false;

-- =============================================
-- EXTEND housing_applications (additive only)
-- =============================================
ALTER TABLE housing_applications
    ADD COLUMN IF NOT EXISTS academic_year         VARCHAR(32)  NOT NULL DEFAULT '2026/2027',
    ADD COLUMN IF NOT EXISTS term                  VARCHAR(32),
    ADD COLUMN IF NOT EXISTS building_id           UUID REFERENCES housing_buildings(id),
    ADD COLUMN IF NOT EXISTS assigned_room_id      UUID REFERENCES housing_rooms(id),
    ADD COLUMN IF NOT EXISTS signature_name        VARCHAR(255),
    ADD COLUMN IF NOT EXISTS signed_at             TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS special_accommodations TEXT,
    ADD COLUMN IF NOT EXISTS housing_type          VARCHAR(32) NOT NULL DEFAULT 'on_campus',
    ADD COLUMN IF NOT EXISTS homestay_host_id      UUID,
    ADD COLUMN IF NOT EXISTS selected_meal_plan_id UUID,
    ADD COLUMN IF NOT EXISTS deposit_invoice_id    UUID,
    ADD COLUMN IF NOT EXISTS rent_invoice_id       UUID;

-- =============================================
-- HOMESTAY HOSTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS homestay_hosts (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_name               VARCHAR(255) NOT NULL,
    host_family_description TEXT,
    address_city            VARCHAR(128) NOT NULL DEFAULT 'Ottawa',
    distance_to_campus_km   NUMERIC(5,1) NOT NULL DEFAULT 5.0,
    languages_spoken        TEXT[]       NOT NULL DEFAULT '{"English"}',
    dietary_accommodations  TEXT[]       NOT NULL DEFAULT '{}',
    max_students            INT          NOT NULL DEFAULT 2,
    current_students        INT          NOT NULL DEFAULT 0,
    price_per_week_minor    BIGINT       NOT NULL DEFAULT 35000, -- $350 CAD /week in cents
    gender_policy           VARCHAR(32)  NOT NULL DEFAULT 'any', -- 'any' | 'male_only' | 'female_only'
    has_quiet_study_room    BOOLEAN      NOT NULL DEFAULT false,
    is_active               BOOLEAN      NOT NULL DEFAULT true,
    photo_url               TEXT,
    host_photo_url          TEXT,
    created_at              TIMESTAMPTZ  NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Add FK now that table exists
ALTER TABLE housing_applications
    DROP CONSTRAINT IF EXISTS housing_applications_homestay_host_id_fkey;
ALTER TABLE housing_applications
    ADD CONSTRAINT housing_applications_homestay_host_id_fkey
    FOREIGN KEY (homestay_host_id) REFERENCES homestay_hosts(id) ON DELETE SET NULL;

-- =============================================
-- MEAL PLANS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS residence_meal_plans (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code                VARCHAR(64)  NOT NULL UNIQUE,
    title               VARCHAR(255) NOT NULL,
    description         TEXT,
    price_per_term_minor BIGINT      NOT NULL CHECK (price_per_term_minor >= 0),
    flex_dollars_minor  BIGINT       NOT NULL DEFAULT 0,
    meals_per_week      INT,
    is_active           BOOLEAN      NOT NULL DEFAULT true,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT timezone('utc'::text, now())
);

-- =============================================
-- ROOMMATE PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS housing_roommate_profiles (
    student_id                  UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    sleep_schedule              VARCHAR(32) NOT NULL DEFAULT 'moderate',
    study_habits                VARCHAR(32) NOT NULL DEFAULT 'silent',
    cleanliness_rating          INT         NOT NULL DEFAULT 3 CHECK (cleanliness_rating BETWEEN 1 AND 5),
    guest_preference            VARCHAR(32) NOT NULL DEFAULT 'rarely',
    gender_preference           VARCHAR(32) NOT NULL DEFAULT 'any',
    floor_type_preference       VARCHAR(32) NOT NULL DEFAULT 'any',
    dietary_needs               TEXT[]      NOT NULL DEFAULT '{}',
    requested_friend_student_ids TEXT[]     NOT NULL DEFAULT '{}',
    hobbies                     TEXT,
    bio                         TEXT,
    requested_roommate_student_id UUID      REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- =============================================
-- WORK ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS housing_work_orders (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number       VARCHAR(64) NOT NULL UNIQUE,
    student_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    room_id             UUID        REFERENCES housing_rooms(id) ON DELETE RESTRICT,
    category            VARCHAR(64) NOT NULL DEFAULT 'other',
    urgency             work_order_urgency_enum NOT NULL DEFAULT 'standard',
    description         TEXT        NOT NULL,
    photo_urls          JSONB       NOT NULL DEFAULT '[]'::jsonb,
    status              work_order_status_enum NOT NULL DEFAULT 'open',
    assigned_technician VARCHAR(255),
    resolution_notes    TEXT,
    resolved_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- =============================================
-- MOVE-IN INSPECTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS housing_move_in_inspections (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id      UUID        NOT NULL REFERENCES housing_applications(id) ON DELETE CASCADE,
    student_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    room_id             UUID        REFERENCES housing_rooms(id),
    checklist_items     JSONB       NOT NULL DEFAULT '{"desk":"good","mattress":"good","closet":"good","window":"good","smoke_detector":"good","heating":"good"}'::jsonb,
    student_comments    TEXT,
    student_signed_at   TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    don_verified_at     TIMESTAMPTZ,
    don_staff_id        UUID        REFERENCES auth.users(id)
);

-- =============================================
-- GUEST PASSES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS housing_guest_passes (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    application_id   UUID        NOT NULL REFERENCES housing_applications(id) ON DELETE CASCADE,
    guest_full_name  VARCHAR(255) NOT NULL,
    arrival_date     DATE        NOT NULL,
    departure_date   DATE        NOT NULL,
    status           VARCHAR(32) NOT NULL DEFAULT 'registered',
    created_at       TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_rooms_building_floor  ON housing_rooms(building_id, floor_number);
CREATE INDEX IF NOT EXISTS idx_housing_app_student   ON housing_applications(student_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_student   ON housing_work_orders(student_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_status    ON housing_work_orders(status);
CREATE INDEX IF NOT EXISTS idx_homestay_active       ON homestay_hosts(is_active);

-- =============================================
-- RLS
-- =============================================
ALTER TABLE homestay_hosts               ENABLE ROW LEVEL SECURITY;
ALTER TABLE residence_meal_plans         ENABLE ROW LEVEL SECURITY;
ALTER TABLE housing_roommate_profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE housing_work_orders          ENABLE ROW LEVEL SECURITY;
ALTER TABLE housing_move_in_inspections  ENABLE ROW LEVEL SECURITY;
ALTER TABLE housing_guest_passes         ENABLE ROW LEVEL SECURITY;

-- Homestay hosts: public read for active
CREATE POLICY "Public read active homestay hosts" ON homestay_hosts
    FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Admin manage homestay hosts" ON homestay_hosts
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN','REGISTRAR','FINANCE_OFFICER')))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN','REGISTRAR','FINANCE_OFFICER')));

-- Meal plans: public read for active
CREATE POLICY "Public read active meal plans" ON residence_meal_plans
    FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Admin manage meal plans" ON residence_meal_plans
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN','REGISTRAR','FINANCE_OFFICER')))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN','REGISTRAR','FINANCE_OFFICER')));

-- Roommate profiles: own only
CREATE POLICY "Students manage own roommate profile" ON housing_roommate_profiles
    FOR ALL TO authenticated
    USING (auth.uid() = student_id OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN','REGISTRAR')))
    WITH CHECK (auth.uid() = student_id);

-- Read other profiles for matching
CREATE POLICY "Students read profiles for matching" ON housing_roommate_profiles
    FOR SELECT TO authenticated USING (true);

-- Work orders
CREATE POLICY "Students manage own work orders" ON housing_work_orders
    FOR ALL TO authenticated
    USING (auth.uid() = student_id OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN','REGISTRAR','FINANCE_OFFICER')))
    WITH CHECK (auth.uid() = student_id);

-- Move-in inspections
CREATE POLICY "Students manage own inspections" ON housing_move_in_inspections
    FOR ALL TO authenticated
    USING (auth.uid() = student_id OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN','REGISTRAR','FINANCE_OFFICER')))
    WITH CHECK (auth.uid() = student_id);

-- Guest passes
CREATE POLICY "Students manage own guest passes" ON housing_guest_passes
    FOR ALL TO authenticated
    USING (auth.uid() = student_id OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN','REGISTRAR','FINANCE_OFFICER')))
    WITH CHECK (auth.uid() = student_id);

-- =============================================
-- SEED: RESIDENCE BUILDINGS
-- =============================================
INSERT INTO housing_buildings (id, name, code, campus_location, style, total_floors, total_beds, amenities, description, services, is_active)
VALUES
    ('b0000000-0000-0000-0000-000000000011',
     'Maple Residence Hall', 'MAPLE', 'Ontario Main Campus',
     'traditional_dorm', 5, 120,
     '["High-Speed Wi-Fi","Hydro & Heat Included","24/7 Keycard Access","Shared Laundry","Communal Kitchen","Study Lounge","Fitness Room"]'::jsonb,
     'Classic residence hall with single and double rooms across 5 floors. Great for first-year students.',
     ARRAY['Elevator','Internet','Laundry','Study Lounge'],
     true),
    ('b0000000-0000-0000-0000-000000000012',
     'Laurentian Suites', 'LAURENTIAN', 'Ontario Main Campus',
     'suite_style', 6, 96,
     '["High-Speed Wi-Fi","Hydro & Heat Included","In-Suite Kitchen","Private Bathroom (per suite)","24/7 Keycard Access","Shared Laundry","Rooftop Study Terrace"]'::jsonb,
     'Modern suite-style living with 4-bed shared suites, in-suite kitchen, and private bathrooms. Ideal for upper-year students.',
     ARRAY['Elevator','Internet','Laundry','Rooftop Terrace','Kitchen'],
     true),
    ('b0000000-0000-0000-0000-000000000013',
     'Pacific Townhouses', 'PACIFIC', 'North Campus',
     'townhouse', 3, 60,
     '["High-Speed Wi-Fi","Hydro & Heat Included","Full Kitchen","Private Entrance","Backyard Patio","Parking Available","Laundry In-Unit"]'::jsonb,
     'Two-storey townhouse units housing 5 students each. Full kitchen, private entrance, in-unit laundry — the closest thing to off-campus living.',
     ARRAY['Internet','Laundry','Kitchen','Parking','Patio'],
     true)
ON CONFLICT (id) DO UPDATE SET
    code            = EXCLUDED.code,
    style           = EXCLUDED.style,
    total_floors    = EXCLUDED.total_floors,
    total_beds      = EXCLUDED.total_beds,
    amenities       = EXCLUDED.amenities,
    description     = EXCLUDED.description,
    is_active       = EXCLUDED.is_active;

-- =============================================
-- SEED: ROOMS & BEDS — Maple Hall (Floor 3, suites 301-305)
-- =============================================
INSERT INTO housing_rooms (building_id, room_number, floor_number, suite_number, bed_identifier, full_room_code, room_type_label, room_type, price_per_term_minor, monthly_rate, status, window_orientation, capacity)
VALUES
    ('b0000000-0000-0000-0000-000000000011', '301A', 3, '301', 'A', 'MAPLE-301-A', 'Standard Single Room', 'Room', 460000, 460, 'AVAILABLE', 'Street View', 1),
    ('b0000000-0000-0000-0000-000000000011', '301B', 3, '301', 'B', 'MAPLE-301-B', 'Standard Single Room', 'Room', 460000, 460, 'AVAILABLE', 'Courtyard View', 1),
    ('b0000000-0000-0000-0000-000000000011', '302A', 3, '302', 'A', 'MAPLE-302-A', 'Standard Single Room', 'Room', 460000, 460, 'OCCUPIED', 'Courtyard View', 1),
    ('b0000000-0000-0000-0000-000000000011', '302B', 3, '302', 'B', 'MAPLE-302-B', 'Standard Single Room', 'Room', 460000, 460, 'AVAILABLE', 'Park View', 1),
    ('b0000000-0000-0000-0000-000000000011', '303A', 3, '303', 'A', 'MAPLE-303-A', 'Double Room (Shared)', 'Room', 380000, 380, 'AVAILABLE', 'Courtyard View', 2),
    ('b0000000-0000-0000-0000-000000000011', '303B', 3, '303', 'B', 'MAPLE-303-B', 'Double Room (Shared)', 'Room', 380000, 380, 'OCCUPIED', 'Courtyard View', 2),
    ('b0000000-0000-0000-0000-000000000011', '304A', 3, '304', 'A', 'MAPLE-304-A', 'Corner Room (Premium)', 'Room', 510000, 510, 'AVAILABLE', 'Corner Window', 1),
    ('b0000000-0000-0000-0000-000000000011', '304B', 3, '304', 'B', 'MAPLE-304-B', 'Standard Single Room', 'Room', 460000, 460, 'MAINTENANCE', 'Street View', 1),
    ('b0000000-0000-0000-0000-000000000011', '305A', 3, '305', 'A', 'MAPLE-305-A', 'Accessible Room', 'Room', 460000, 460, 'AVAILABLE', 'Garden View', 1),
    ('b0000000-0000-0000-0000-000000000011', '305B', 3, '305', 'B', 'MAPLE-305-B', 'Standard Single Room', 'Room', 460000, 460, 'AVAILABLE', 'Garden View', 1)
ON CONFLICT (building_id, room_number) DO UPDATE SET
    floor_number       = EXCLUDED.floor_number,
    suite_number       = EXCLUDED.suite_number,
    bed_identifier     = EXCLUDED.bed_identifier,
    full_room_code     = EXCLUDED.full_room_code,
    room_type_label    = EXCLUDED.room_type_label,
    price_per_term_minor = EXCLUDED.price_per_term_minor;

-- SEED: ROOMS & BEDS — Laurentian Suites
INSERT INTO housing_rooms (building_id, room_number, floor_number, suite_number, bed_identifier, full_room_code, room_type_label, room_type, price_per_term_minor, monthly_rate, status, window_orientation, capacity)
VALUES
    ('b0000000-0000-0000-0000-000000000012', '401A', 4, '401', 'A', 'LAUR-401-A', 'Private Bedroom in 4-Bed Suite', 'Studio', 595000, 595, 'AVAILABLE', 'Campus View', 1),
    ('b0000000-0000-0000-0000-000000000012', '401B', 4, '401', 'B', 'LAUR-401-B', 'Private Bedroom in 4-Bed Suite', 'Studio', 595000, 595, 'OCCUPIED', 'Campus View', 1),
    ('b0000000-0000-0000-0000-000000000012', '401C', 4, '401', 'C', 'LAUR-401-C', 'Private Bedroom in 4-Bed Suite', 'Studio', 595000, 595, 'AVAILABLE', 'Courtyard View', 1),
    ('b0000000-0000-0000-0000-000000000012', '401D', 4, '401', 'D', 'LAUR-401-D', 'Private Bedroom in 4-Bed Suite', 'Studio', 595000, 595, 'AVAILABLE', 'Park View', 1),
    ('b0000000-0000-0000-0000-000000000012', '402A', 4, '402', 'A', 'LAUR-402-A', 'Private Bedroom in 4-Bed Suite', 'Studio', 595000, 595, 'OCCUPIED', 'Campus View', 1),
    ('b0000000-0000-0000-0000-000000000012', '402B', 4, '402', 'B', 'LAUR-402-B', 'Private Bedroom in 4-Bed Suite', 'Studio', 595000, 595, 'OCCUPIED', 'Campus View', 1),
    ('b0000000-0000-0000-0000-000000000012', '402C', 4, '402', 'C', 'LAUR-402-C', 'Private Bedroom in 4-Bed Suite', 'Studio', 595000, 595, 'AVAILABLE', 'Courtyard View', 1),
    ('b0000000-0000-0000-0000-000000000012', '402D', 4, '402', 'D', 'LAUR-402-D', 'Private Bedroom in 4-Bed Suite', 'Studio', 595000, 595, 'AVAILABLE', 'Park View', 1),
    ('b0000000-0000-0000-0000-000000000012', '501A', 5, '501', 'A', 'LAUR-501-A', 'Private Bedroom in 4-Bed Suite (Upper)', 'Studio', 625000, 625, 'AVAILABLE', 'Skyline View', 1),
    ('b0000000-0000-0000-0000-000000000012', '501B', 5, '501', 'B', 'LAUR-501-B', 'Private Bedroom in 4-Bed Suite (Upper)', 'Studio', 625000, 625, 'AVAILABLE', 'Skyline View', 1)
ON CONFLICT (building_id, room_number) DO UPDATE SET
    floor_number       = EXCLUDED.floor_number,
    suite_number       = EXCLUDED.suite_number,
    bed_identifier     = EXCLUDED.bed_identifier,
    full_room_code     = EXCLUDED.full_room_code,
    room_type_label    = EXCLUDED.room_type_label,
    price_per_term_minor = EXCLUDED.price_per_term_minor;

-- SEED: ROOMS & BEDS — Pacific Townhouses
INSERT INTO housing_rooms (building_id, room_number, floor_number, suite_number, bed_identifier, full_room_code, room_type_label, room_type, price_per_term_minor, monthly_rate, status, window_orientation, capacity)
VALUES
    ('b0000000-0000-0000-0000-000000000013', 'TH1-BR1', 1, 'TH1', 'Bed 1', 'PACIFIC-TH1-1', 'Bedroom in 5-Bed Townhouse', 'Room', 540000, 540, 'AVAILABLE', 'Garden View', 1),
    ('b0000000-0000-0000-0000-000000000013', 'TH1-BR2', 1, 'TH1', 'Bed 2', 'PACIFIC-TH1-2', 'Bedroom in 5-Bed Townhouse', 'Room', 540000, 540, 'OCCUPIED', 'Garden View', 1),
    ('b0000000-0000-0000-0000-000000000013', 'TH1-BR3', 2, 'TH1', 'Bed 3', 'PACIFIC-TH1-3', 'Bedroom in 5-Bed Townhouse (Upper)', 'Room', 540000, 540, 'AVAILABLE', 'Street View', 1),
    ('b0000000-0000-0000-0000-000000000013', 'TH1-BR4', 2, 'TH1', 'Bed 4', 'PACIFIC-TH1-4', 'Bedroom in 5-Bed Townhouse (Upper)', 'Room', 540000, 540, 'AVAILABLE', 'Garden View', 1),
    ('b0000000-0000-0000-0000-000000000013', 'TH1-BR5', 2, 'TH1', 'Bed 5', 'PACIFIC-TH1-5', 'Bedroom in 5-Bed Townhouse (Upper)', 'Room', 540000, 540, 'AVAILABLE', 'Garden View', 1),
    ('b0000000-0000-0000-0000-000000000013', 'TH2-BR1', 1, 'TH2', 'Bed 1', 'PACIFIC-TH2-1', 'Bedroom in 5-Bed Townhouse', 'Room', 540000, 540, 'OCCUPIED', 'Patio View', 1),
    ('b0000000-0000-0000-0000-000000000013', 'TH2-BR2', 1, 'TH2', 'Bed 2', 'PACIFIC-TH2-2', 'Bedroom in 5-Bed Townhouse', 'Room', 540000, 540, 'AVAILABLE', 'Patio View', 1),
    ('b0000000-0000-0000-0000-000000000013', 'TH2-BR3', 2, 'TH2', 'Bed 3', 'PACIFIC-TH2-3', 'Bedroom in 5-Bed Townhouse (Upper)', 'Room', 540000, 540, 'AVAILABLE', 'Garden View', 1),
    ('b0000000-0000-0000-0000-000000000013', 'TH2-BR4', 2, 'TH2', 'Bed 4', 'PACIFIC-TH2-4', 'Bedroom in 5-Bed Townhouse (Upper)', 'Room', 540000, 540, 'AVAILABLE', 'Garden View', 1),
    ('b0000000-0000-0000-0000-000000000013', 'TH2-BR5', 2, 'TH2', 'Bed 5', 'PACIFIC-TH2-5', 'Bedroom in 5-Bed Townhouse (Upper)', 'Room', 540000, 540, 'AVAILABLE', 'Garden View', 1)
ON CONFLICT (building_id, room_number) DO UPDATE SET
    floor_number       = EXCLUDED.floor_number,
    suite_number       = EXCLUDED.suite_number,
    bed_identifier     = EXCLUDED.bed_identifier,
    full_room_code     = EXCLUDED.full_room_code,
    room_type_label    = EXCLUDED.room_type_label,
    price_per_term_minor = EXCLUDED.price_per_term_minor;

-- =============================================
-- SEED: MEAL PLANS
-- =============================================
INSERT INTO residence_meal_plans (code, title, description, price_per_term_minor, flex_dollars_minor, meals_per_week, is_active)
VALUES
    ('unlimited_7day',   'Unlimited 7-Day All-Access',       'Unlimited access to all dining halls 7 days a week. Best value for on-campus residents.',                          295000, 0,      NULL, true),
    ('plan_14_flex',     '14 Meals/Week + $200 Flex Dollars', '14 swipes per week with $200 Flex Dollars redeemable at campus cafés and convenience stores.',                    245000, 20000,  14,   true),
    ('declining_balance','Declining Balance Plan',            'Load your card with $1,200 and use it at any campus dining location. Ideal for suite/townhouse residents.',        120000, 120000, NULL, true)
ON CONFLICT (code) DO UPDATE SET
    title               = EXCLUDED.title,
    description         = EXCLUDED.description,
    price_per_term_minor = EXCLUDED.price_per_term_minor,
    flex_dollars_minor  = EXCLUDED.flex_dollars_minor,
    meals_per_week      = EXCLUDED.meals_per_week;

-- =============================================
-- SEED: HOMESTAY HOSTS
-- =============================================
INSERT INTO homestay_hosts (id, host_name, host_family_description, address_city, distance_to_campus_km, languages_spoken, dietary_accommodations, max_students, price_per_week_minor, gender_policy, has_quiet_study_room, is_active)
VALUES
    ('h0000000-0000-0000-0000-000000000001',
     'The Morrison Family',
     'Warm and welcoming family of four. We love hosting international students and share home-cooked meals on weekday evenings. Our home has a quiet study room and fast Wi-Fi.',
     'Ottawa', 3.2,
     ARRAY['English','French'],
     ARRAY['vegetarian','halal'],
     2, 34500, 'any', true, true),
    ('h0000000-0000-0000-0000-000000000002',
     'The Nguyen Family',
     'Professional couple, no children. Clean and quiet environment. Students have a private entrance, ensuite bathroom, and access to a spacious shared kitchen.',
     'Ottawa', 5.8,
     ARRAY['English','Vietnamese'],
     ARRAY['vegan','gluten_free'],
     1, 38000, 'female_only', true, true),
    ('h0000000-0000-0000-0000-000000000003',
     'Dr. & Mrs. Obi',
     'Retired educators with a love for culture and cooking. We host up to 3 students, share communal meals and weekend outings. Afrobeats always welcome!',
     'Ottawa', 7.1,
     ARRAY['English','Igbo'],
     ARRAY['halal','kosher'],
     3, 32000, 'any', false, true),
    ('h0000000-0000-0000-0000-000000000004',
     'The Kowalski Family',
     'Active family with two teenagers. We treat our students like family members. Dog-friendly home with a backyard. Great transit links to campus.',
     'Kanata', 12.5,
     ARRAY['English','Polish'],
     ARRAY[]::text[],
     2, 29500, 'male_only', false, true)
ON CONFLICT (id) DO UPDATE SET
    host_name               = EXCLUDED.host_name,
    host_family_description = EXCLUDED.host_family_description,
    dietary_accommodations  = EXCLUDED.dietary_accommodations,
    gender_policy           = EXCLUDED.gender_policy,
    price_per_week_minor    = EXCLUDED.price_per_week_minor,
    is_active               = EXCLUDED.is_active;

COMMIT;
