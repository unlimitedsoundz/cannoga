const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fetchId() {
  const { data, error } = await supabase
    .from('tuition_payments')
    .select('*, offer:admission_offers(application_id)')
    .eq('status', 'COMPLETED')
    .limit(1)
    .single();

  if (error) {
    console.error('Error:', error);
    process.exit(1);
  }

  console.log(data.offer.application_id);
}

fetchId();
