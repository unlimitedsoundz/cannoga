-- Seed data for Housing & IT Systems

-- 1. Insert Sample Semesters
INSERT INTO "semesters" ("name", "start_date", "end_date") VALUES
('Spring 2026', '2026-01-08', '2026-05-31'),
('Autumn 2026', '2026-09-01', '2026-12-20'),
('Spring 2027', '2027-01-08', '2027-05-31')
ON CONFLICT DO NOTHING;

-- 2. Insert Sample Housing Buildings (Based on HOAS - Ottawa Region Student Housing)
INSERT INTO housing_buildings (name, campus_location, total_rooms) VALUES
('Domus Academica', 'Ottawa City Centre', 120),
('UniHome Otaniemi', 'Otaniemi Campus', 250),
('Student Village Viikki', 'Viikki Campus', 180),
('Kampusranta', 'Kumpula Campus', 150);

-- 3. Insert Sample Rooms (using the building IDs from the buildings we just created)
DO $$
DECLARE
    domus_id UUID;
    unihome_id UUID;
    village_id UUID;
    kampus_id UUID;
BEGIN
    -- Get building IDs
    SELECT id INTO domus_id FROM housing_buildings WHERE name = 'Domus Academica';
    SELECT id INTO unihome_id FROM housing_buildings WHERE name = 'UniHome Otaniemi';
    SELECT id INTO village_id FROM housing_buildings WHERE name = 'Student Village Viikki';
    SELECT id INTO kampus_id FROM housing_buildings WHERE name = 'Kampusranta';
    
    -- Insert rooms for Domus Academica
    INSERT INTO housing_rooms (building_id, room_number, capacity, monthly_rate, amenities, status) VALUES
    (domus_id, 'A101', 1, 450.00, '{"wifi": true, "furniture": true, "shared_kitchen": true, "private_bathroom": false}'::jsonb, 'AVAILABLE'),
    (domus_id, 'A102', 1, 450.00, '{"wifi": true, "furniture": true, "shared_kitchen": true, "private_bathroom": false}'::jsonb, 'AVAILABLE'),
    (domus_id, 'A103', 1, 650.00, '{"wifi": true, "furniture": true, "private_kitchen": true, "private_bathroom": true}'::jsonb, 'AVAILABLE'),
    (domus_id, 'B201', 2, 350.00, '{"wifi": true, "furniture": true, "shared_kitchen": true, "private_bathroom": false}'::jsonb, 'AVAILABLE');
    
    -- Insert rooms for UniHome Otaniemi
    INSERT INTO housing_rooms (building_id, room_number, capacity, monthly_rate, amenities, status) VALUES
    (unihome_id, 'U101', 1, 480.00, '{"wifi": true, "furniture": true, "shared_kitchen": true, "private_bathroom": false}'::jsonb, 'AVAILABLE'),
    (unihome_id, 'U102', 1, 680.00, '{"wifi": true, "furniture": true, "private_kitchen": true, "private_bathroom": true}'::jsonb, 'AVAILABLE'),
    (unihome_id, 'U201', 1, 480.00, '{"wifi": true, "furniture": true, "shared_kitchen": true, "private_bathroom": false}'::jsonb, 'AVAILABLE'),
    (unihome_id, 'U202', 2, 380.00, '{"wifi": true, "furniture": true, "shared_kitchen": true, "private_bathroom": false}'::jsonb, 'AVAILABLE');
    
    -- Insert rooms for Student Village Viikki
    INSERT INTO housing_rooms (building_id, room_number, capacity, monthly_rate, amenities, status) VALUES
    (village_id, 'V101', 1, 420.00, '{"wifi": true, "furniture": true, "shared_kitchen": true, "private_bathroom": false}'::jsonb, 'AVAILABLE'),
    (village_id, 'V102', 1, 620.00, '{"wifi": true, "furniture": true, "private_kitchen": true, "private_bathroom": true}'::jsonb, 'AVAILABLE'),
    (village_id, 'V201', 1, 420.00, '{"wifi": true, "furniture": true, "shared_kitchen": true, "private_bathroom": false}'::jsonb, 'AVAILABLE');
    
    -- Insert rooms for Kampusranta
    INSERT INTO housing_rooms (building_id, room_number, capacity, monthly_rate, amenities, status) VALUES
    (kampus_id, 'K101', 1, 460.00, '{"wifi": true, "furniture": true, "shared_kitchen": true, "private_bathroom": false}'::jsonb, 'AVAILABLE'),
    (kampus_id, 'K102', 1, 660.00, '{"wifi": true, "furniture": true, "private_kitchen": true, "private_bathroom": true}'::jsonb, 'AVAILABLE'),
    (kampus_id, 'K201', 2, 360.00, '{"wifi": true, "furniture": true, "shared_kitchen": true, "private_bathroom": false}'::jsonb, 'AVAILABLE');
END $$;

-- 4. Insert IT Assets (LMS, Email, VPN, Library, Virtual Lab)
INSERT INTO it_assets (asset_type, name, description, access_url, auto_provision, license_limit) VALUES
('LMS', 'Canvas Learning Management System', 'Access course materials, assignments, and grades', 'https://canvas.penkka.fi', true, 10000),
('EMAIL', 'Student Email Account', 'Official institutional email (@cannogacollege.ca)', 'https://mail.penkka.fi', true, 10000),
('VPN', 'Campus VPN Access', 'Secure remote access to campus resources', 'https://vpn.penkka.fi', true, 10000),
('LIBRARY', 'Digital Library Portal', 'Access to academic journals and e-books', 'https://library.penkka.fi', true, 10000),
('VIRTUAL_LAB', 'Virtual Computing Labs', 'Remote access to specialized software', 'https://labs.penkka.fi', true, 5000)
ON CONFLICT DO NOTHING;
