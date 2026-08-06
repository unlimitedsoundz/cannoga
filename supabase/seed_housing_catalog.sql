ALTER TABLE housing_buildings ADD COLUMN IF NOT EXISTS condition TEXT;
ALTER TABLE housing_buildings ADD COLUMN IF NOT EXISTS main_images TEXT[] DEFAULT '{}';
ALTER TABLE housing_buildings ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE housing_buildings ADD COLUMN IF NOT EXISTS services TEXT[] DEFAULT '{}';

ALTER TABLE housing_rooms ADD COLUMN IF NOT EXISTS room_type TEXT;
ALTER TABLE housing_rooms ADD COLUMN IF NOT EXISTS size TEXT;
ALTER TABLE housing_rooms ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

ALTER TABLE housing_applications ADD COLUMN IF NOT EXISTS lease_duration INTEGER DEFAULT 1;
ALTER TABLE housing_applications ADD COLUMN IF NOT EXISTS total_contract_value NUMERIC(10, 2);
ALTER TABLE housing_applications ADD COLUMN IF NOT EXISTS room_type TEXT;

-- Fix foreign key constraints for cascading deletions
ALTER TABLE housing_applications 
DROP CONSTRAINT IF EXISTS housing_applications_preferred_building_id_fkey,
ADD CONSTRAINT housing_applications_preferred_building_id_fkey 
FOREIGN KEY (preferred_building_id) 
REFERENCES housing_buildings(id) 
ON DELETE SET NULL;

ALTER TABLE housing_assignments
DROP CONSTRAINT IF EXISTS housing_assignments_application_id_fkey,
ADD CONSTRAINT housing_assignments_application_id_fkey
FOREIGN KEY (application_id)
REFERENCES housing_applications(id)
ON DELETE CASCADE;

ALTER TABLE housing_deposits
DROP CONSTRAINT IF EXISTS housing_deposits_application_id_fkey,
ADD CONSTRAINT housing_deposits_application_id_fkey
FOREIGN KEY (application_id)
REFERENCES housing_applications(id)
ON DELETE CASCADE;

ALTER TABLE housing_invoices
DROP CONSTRAINT IF EXISTS housing_invoices_application_id_fkey,
ADD CONSTRAINT housing_invoices_application_id_fkey
FOREIGN KEY (application_id)
REFERENCES housing_applications(id)
ON DELETE CASCADE;

-- Seed Data from BUILDINGS_CATALOG

-- 1. Domus Academica
INSERT INTO housing_buildings (id, name, campus_location, condition, services, main_images)
VALUES (
    'd0000000-0000-0000-0000-000000000001', 
    'Domus Academica', 
    'Ottawa', 
    'Excellent',
    ARRAY['Elevator', 'Internet: DNA', 'Laundry', 'Sauna', 'Clubroom'],
    ARRAY['/images/housing/domus_exterior.jpg', '/images/housing/dji-0020.jpg', '/images/housing/haukilahdenkuja15-julkisivukuva.jpg', '/images/housing/dsc4428.jpg']
) ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    campus_location = EXCLUDED.campus_location, 
    condition = EXCLUDED.condition, 
    services = EXCLUDED.services,
    main_images = EXCLUDED.main_images;

-- 2. Kuura Kampus
INSERT INTO housing_buildings (id, name, campus_location, condition, services, main_images)
VALUES (
    'd0000000-0000-0000-0000-000000000002', 
    'Kuura Kampus', 
    'Ottawa', 
    'Excellent',
    ARRAY['Elevator', 'Internet: DNA', 'Laundry', 'Sauna', 'Clubroom'],
    ARRAY['/images/housing/Kura/14-atlantinkatu5-julkisivukuva.jpg', '/images/housing/Kura/15-atlantinkatu5.jpg', '/images/housing/Kura/4-atlantinkatu5.jpg', '/images/housing/Kura/haukilahdenkuja-15-kaksio-kylpyhuone-1.jpg']
) ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    campus_location = EXCLUDED.campus_location, 
    condition = EXCLUDED.condition, 
    services = EXCLUDED.services,
    main_images = EXCLUDED.main_images;

-- 3. Vanamo
INSERT INTO housing_buildings (id, name, campus_location, services, main_images)
VALUES (
    'd0000000-0000-0000-0000-000000000003', 
    'Vanamo', 
    'Vanamo Campus, Ottawa', 
    ARRAY['Elevator', 'Internet: DNA', 'Laundry', 'Sauna', 'Clubroom'],
    ARRAY['/images/housing/Vanamo/retkeilijankatu11-julkisivukuva.jpg', '/images/housing/Vanamo/dsc4574-hdr.jpg', '/images/housing/Vanamo/retkeilijankatu-11-yhteistila.jpg']
) ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    campus_location = EXCLUDED.campus_location, 
    services = EXCLUDED.services,
    main_images = EXCLUDED.main_images;

-- 4. Myrsky Kampus
INSERT INTO housing_buildings (id, name, campus_location, services, main_images)
VALUES (
    'd0000000-0000-0000-0000-000000000004', 
    'Myrsky Kampus', 
    'Penkka University, Ottawa', 
    ARRAY['Internet: DNA', 'Laundry', 'Sauna', 'Clubroom'],
    ARRAY['/images/housing/Myskry/2-santakuja3.jpg', '/images/housing/Myskry/1-santakuja3.jpg']
) ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    campus_location = EXCLUDED.campus_location, 
    services = EXCLUDED.services,
    main_images = EXCLUDED.main_images;


-- Seed Rooms (using representative room numbers)

-- Domus Rooms
INSERT INTO housing_rooms (building_id, room_number, room_type, size, monthly_rate, status, images)
VALUES 
('d0000000-0000-0000-0000-000000000001', 'DA-R101', 'Room', '15.1 m²', 490, 'AVAILABLE', ARRAY['/images/housing/haukilahdenkuja-15-kaksio-keittotila-1.jpg']),
('d0000000-0000-0000-0000-000000000001', 'DA-S201', 'Studio', '27.5 - 28 m²', 617, 'AVAILABLE', ARRAY['/images/housing/haukilahdenkuja-15-kaksio-keittotila-3.jpg']),
('d0000000-0000-0000-0000-000000000001', 'DA-T301', 'Two-room apartment', '42 - 56.5 m²', 818, 'AVAILABLE', ARRAY['/images/housing/dsc4401-hdr.jpg'])
ON CONFLICT (building_id, room_number) DO UPDATE SET 
    monthly_rate = EXCLUDED.monthly_rate,
    room_type = EXCLUDED.room_type,
    size = EXCLUDED.size;

-- Kuura Rooms
INSERT INTO housing_rooms (building_id, room_number, room_type, size, monthly_rate, status, images)
VALUES 
('d0000000-0000-0000-0000-000000000002', 'KU-R101', 'Room', '11.5 - 16.5 m²', 408, 'AVAILABLE', ARRAY['/images/housing/Kura/6-atlantinkatu5.jpg']),
('d0000000-0000-0000-0000-000000000002', 'KU-S201', 'Studio', '29.5 - 36.5 m²', 707, 'AVAILABLE', ARRAY['/images/housing/Kura/10-atlantinkatu5.jpg']),
('d0000000-0000-0000-0000-000000000002', 'KU-T301', 'Two-room apartment', '39.5 - 55 m²', 860, 'AVAILABLE', ARRAY['/images/housing/Kura/4-atlantinkatu5.jpg']),
('d0000000-0000-0000-0000-000000000002', 'KU-X401', 'Three-room apartment', '72.5 m²', 1226, 'AVAILABLE', ARRAY['/images/housing/Kura/15-atlantinkatu5.jpg'])
ON CONFLICT (building_id, room_number) DO UPDATE SET 
    monthly_rate = EXCLUDED.monthly_rate,
    room_type = EXCLUDED.room_type,
    size = EXCLUDED.size;

-- Vanamo Rooms
INSERT INTO housing_rooms (building_id, room_number, room_type, size, monthly_rate, status, images)
VALUES 
('d0000000-0000-0000-0000-000000000003', 'VA-S101', 'Studio', '16.5 - 47 m²', 534, 'AVAILABLE', ARRAY['/images/housing/Vanamo/dsc4556-hdr.jpg'])
ON CONFLICT (building_id, room_number) DO UPDATE SET 
    monthly_rate = EXCLUDED.monthly_rate,
    room_type = EXCLUDED.room_type,
    size = EXCLUDED.size;

-- Myrsky Rooms
INSERT INTO housing_rooms (building_id, room_number, room_type, size, monthly_rate, status, images)
VALUES 
('d0000000-0000-0000-0000-000000000004', 'MY-R101', 'Room', '12.7 - 13.5 m²', 442, 'AVAILABLE', ARRAY['/images/housing/Myskry/selkamerenkatu-6-santakuja-3-kolmio-asuinhuone-1.jpg']),
('d0000000-0000-0000-0000-000000000004', 'MY-T201', 'Two-room apartment', '60.5 m²', 1011, 'AVAILABLE', ARRAY['/images/housing/Myskry/selkamerenkatu-6-santakuja-3-kolmio-keittio-4.jpg'])
ON CONFLICT (building_id, room_number) DO UPDATE SET 
    monthly_rate = EXCLUDED.monthly_rate,
    room_type = EXCLUDED.room_type,
    size = EXCLUDED.size;
