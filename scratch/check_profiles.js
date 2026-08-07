require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkProfiles() {
  try {
    // Fetch a single record first to inspect columns or query all
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(10);
      
    if (error) throw error;
    
    console.log(`Fetched ${profiles.length} profiles:`);
    profiles.forEach(p => {
      console.log('Profile:', JSON.stringify(p, null, 2));
    });
  } catch (err) {
    console.error('Error fetching profiles:', err);
  }
}

checkProfiles();
