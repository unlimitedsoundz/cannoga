import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_ANON_KEY!
);

async function main() {
  const { data, error } = await supabase.from('tuition_rates').select('*');
  console.log('Client access:', data?.length || 0, 'rows');
  if (error) console.log('Error:', error.message);
}

main();
