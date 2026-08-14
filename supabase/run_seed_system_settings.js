const fs = require('fs');
const path = require('path');

function readEnv(envPath) {
  const txt = fs.readFileSync(envPath, 'utf8');
  const lines = txt.split(/\r?\n/);
  const out = {};
  for (const l of lines) {
    const m = l.match(/^\s*([^#=]+)=(.*)$/);
    if (m) out[m[1].trim()] = m[2].trim();
  }
  return out;
}

async function main() {
  const envPath = path.resolve(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('No .env.local found at', envPath);
    process.exit(1);
  }
  const env = readEnv(envPath);
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error('Missing SUPABASE URL or SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }

  const rows = [
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
    { key: 'institution_address_full', value: 'Cannoga College\\n81 Montreal Rd\\nOttawa, Ontario\\nK1L 6E8\\nCanada', description: 'Full formatted postal address' },
    { key: 'institution_official_location', value: 'Ottawa, Ontario', description: 'Human-readable location' },
    { key: 'seo_default_title', value: 'Cannoga College — Ottawa, Ontario', description: 'Default SEO title' },
    { key: 'seo_default_description', value: 'Cannoga College is a career-focused college located in Ottawa, Ontario, Canada. Explore our programs, admissions, and support for international students.', description: 'Default SEO description' }
  ];

  const url = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/system_settings?on_conflict=key`;

  const headers = {
    'Content-Type': 'application/json',
    'apikey': serviceKey,
    'Authorization': `Bearer ${serviceKey}`,
    // Prefer resolution=merge-duplicates for upsert and return representation
    'Prefer': 'resolution=merge-duplicates, return=representation'
  };

  let fetchFn = global.fetch;
  if (!fetchFn) {
    try {
      fetchFn = require('node-fetch');
    } catch (e) {
      console.error('Fetch is not available. Please run on Node 18+ or install node-fetch.');
      process.exit(1);
    }
  }

  try {
    const res = await fetchFn(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(rows)
    });
    if (!res.ok) {
      const txt = await res.text();
      console.error('Failed to upsert system_settings:', res.status, txt);
      process.exit(1);
    }
    const data = await res.json();
    console.log('Upserted system_settings rows:', data.length);
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error performing request:', e.message || e);
    process.exit(1);
  }
}

main();
