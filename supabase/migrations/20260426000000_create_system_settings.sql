-- Create system_settings table
CREATE TABLE IF NOT EXISTS "system_settings" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "key" TEXT UNIQUE NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial NGN payment toggle setting
INSERT INTO "system_settings" ("key", "value", "description")
VALUES ('ngn_payment_enabled', 'true', 'Toggle Online Naira (NGN) bank transfer payment method in checkout')
ON CONFLICT ("key") DO NOTHING;

-- Enable RLS
ALTER TABLE "system_settings" ENABLE ROW LEVEL SECURITY;

-- Public read access
DROP POLICY IF EXISTS "Public read access for system_settings" ON "system_settings";
CREATE POLICY "Public read access for system_settings" ON "system_settings" FOR SELECT USING (true);

-- Admin write access
DROP POLICY IF EXISTS "Admin full access for system_settings" ON "system_settings";
CREATE POLICY "Admin full access for system_settings" ON "system_settings" FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));
