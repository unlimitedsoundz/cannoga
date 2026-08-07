import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data: faculty } = await supabase.from('Faculty').select('name, email').limit(20);
  console.log('Sample faculty emails:');
  faculty?.forEach(f => {
    console.log(`  ${f.name}: ${f.email}`);
  });
}

main();
