const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mrqzlmkdhzwvbpljikjz.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycXpsbWtkaHp3dmJwbGppa2p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTUxMjk4MywiZXhwIjoyMDg1MDg4OTgzfQ.u-SmDdYVmyHtwHBca95oJT6MHnZtzn8sWRDh5JJ1ibA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const TUITION_RECORDS = [
  {
    credential_type: 'CERTIFICATE_DIPLOMA',
    status: 'active',
    domestic_tuition: { annualTuition: 4800, deposit: 2000 },
    international_tuition: { annualTuition: 8000, deposit: 2000 }
  },
  {
    credential_type: 'BACHELOR',
    status: 'active',
    domestic_tuition: { annualTuition: 8000, deposit: 2000 },
    international_tuition: { annualTuition: 12800, deposit: 2000 }
  },
  {
    credential_type: 'MASTER',
    status: 'active',
    domestic_tuition: { annualTuition: 11200, deposit: 2000 },
    international_tuition: { annualTuition: 19200, deposit: 2000 }
  }
];

async function seedTuition() {
  console.log('Seeding tuition_info table...');
  for (const t of TUITION_RECORDS) {
    const { error } = await supabase.from('tuition_info').upsert(t, { onConflict: 'credential_type' });
    if (error) {
      console.error(`Error seeding ${t.credential_type}:`, error.message);
    } else {
      console.log(`Seeded tuition record for ${t.credential_type}`);
    }
  }
}

seedTuition().catch(console.error);
