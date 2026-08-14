const { Client } = require('pg');

const connectionString = 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';
const client = new Client({ connectionString });

const settings = [
  { key: 'institution_name', value: 'Cannoga College', description: 'Official institution display name' },
  { key: 'institution_type', value: 'College', description: 'Type of institution' },
  { key: 'street', value: '81 Montreal Rd', description: 'Street address' },
  { key: 'city', value: 'Ottawa', description: 'City' },
  { key: 'province', value: 'Ontario', description: 'Province/State' },
  { key: 'postal_code', value: 'K1L 6E8', description: 'Postal / ZIP code' },
  { key: 'country', value: 'Canada', description: 'Country' },
  { key: 'country_code', value: 'CA', description: 'ISO country code' },
  { key: 'currency', value: 'CAD', description: 'Default transactional currency' },
  { key: 'timezone', value: 'America/Toronto', description: 'Default timezone' },
  { key: 'institution_email_domain', value: '@cannogacollege.ca', description: 'Institutional email domain (configurable)' },
  { key: 'institution_address_full', value: 'Cannoga College\n81 Montreal Rd\nOttawa, Ontario\nK1L 6E8\nCanada', description: 'Full formatted postal address' },
  { key: 'institution_official_location', value: 'Ottawa, Ontario', description: 'Human-readable location' },
  { key: 'seo_default_title', value: 'Cannoga College — Ottawa, Ontario', description: 'Default SEO title' },
  { key: 'seo_default_description', value: 'Cannoga College is a career-focused college located in Ottawa, Ontario, Canada. Explore our programs, admissions, and support for international students.', description: 'Default SEO description' }
];

async function main() {
  try {
    await client.connect();
    await client.query(`CREATE TABLE IF NOT EXISTS "system_settings" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "key" TEXT UNIQUE NOT NULL,
      "value" TEXT NOT NULL,
      "description" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`);
    const values = settings.map((s, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`).join(', ');
    const query = `INSERT INTO "system_settings" ("key", "value", "description") VALUES ${values} ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "description" = EXCLUDED."description", "updatedAt" = CURRENT_TIMESTAMP;`;
    const params = settings.flatMap((s) => [s.key, s.value, s.description]);
    await client.query(query, params);
    console.log('✅ system_settings created and seeded successfully');
  } catch (error) {
    console.error('Error creating/seeding system_settings:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
