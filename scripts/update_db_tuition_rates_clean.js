const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mrqzlmkdhzwvbpljikjz.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycXpsbWtkaHp3dmJwbGppa2p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTUxMjk4MywiZXhwIjoyMDg1MDg4OTgzfQ.u-SmDdYVmyHtwHBca95oJT6MHnZtzn8sWRDh5JJ1ibA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const TUITION_RECORDS = [
  {
    credential_type: 'CERTIFICATE',
    status: 'active',
    domestic_tuition: { annualTuition: 2400, deposit: 2000 },
    international_tuition: { annualTuition: 4000, deposit: 2000 }
  },
  {
    credential_type: 'DIPLOMA',
    status: 'active',
    domestic_tuition: { annualTuition: 2400, deposit: 2000 },
    international_tuition: { annualTuition: 4000, deposit: 2000 }
  },
  {
    credential_type: 'CERTIFICATE_DIPLOMA',
    status: 'active',
    domestic_tuition: { annualTuition: 2400, deposit: 2000 },
    international_tuition: { annualTuition: 4000, deposit: 2000 }
  },
  {
    credential_type: 'BACHELOR',
    status: 'active',
    domestic_tuition: { annualTuition: 4000, deposit: 2000 },
    international_tuition: { annualTuition: 6400, deposit: 2000 }
  },
  {
    credential_type: 'MASTER',
    status: 'active',
    domestic_tuition: { annualTuition: 5600, deposit: 2000 },
    international_tuition: { annualTuition: 9600, deposit: 2000 }
  }
];

async function seedTuition() {
  console.log('Seeding tuition_info table in Supabase DB...');
  for (const t of TUITION_RECORDS) {
    const { error } = await supabase.from('tuition_info').upsert(t, { onConflict: 'credential_type' });
    if (error) {
      console.error(`Error updating ${t.credential_type}:`, error.message);
    } else {
      console.log(`Successfully updated DB tuition_info for ${t.credential_type}`);
    }
  }
}

seedTuition().catch(console.error);
