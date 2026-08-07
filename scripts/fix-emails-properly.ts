import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data: faculty } = await supabase.from('Faculty').select('id, name, email');
  
  let fixed = 0;
  for (const f of faculty || []) {
    // Remove prefixes like "Dr.", "Prof.", etc.
    let cleanName = f.name.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s*/i, '');
    
    // Get first and last name
    const parts = cleanName.split(' ');
    const firstName = parts[0] || '';
    const lastName = parts[1] || '';
    
    if (!firstName || !lastName) continue;
    
    // Create clean email: firstname.lastname@cannogacollege.ca
    const cleanEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@cannogacollege.ca`;
    
    if (f.email !== cleanEmail) {
      const { error } = await supabase.from('Faculty').update({ email: cleanEmail }).eq('id', f.id);
      if (!error) {
        console.log(`Fixed: ${f.name} → ${cleanEmail}`);
        fixed++;
      }
    }
  }
  
  console.log(`\nFixed ${fixed} emails.`);
}

main().catch(console.error);
