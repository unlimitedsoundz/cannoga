import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SCHOOLS = {
  ARTS: '0b41ebd2-d034-4578-be50-e495e134d400',
  BUSINESS: '86303fdf-096f-4f4f-b3fc-b70e3ada4b5a',
  TECHNOLOGY: '9001c5a7-5eeb-4523-857a-21a3b4fbedd8',
  SCIENCE: 'a4201f51-c6d7-475e-a80a-d4a332a89f57'
};

const firstNames = [
  'James', 'Emma', 'Michael', 'Sarah', 'David', 'Jennifer', 'Robert', 'Lisa', 'John', 'Maria',
  'William', 'Patricia', 'Christopher', 'Elizabeth', 'Daniel', 'Susan', 'Matthew', 'Nancy', 'Anthony', 'Karen',
  'Mark', 'Betty', 'Steven', 'Margaret', 'Andrew', 'Kimberly', 'Joshua', 'Emily', 'Ryan', 'Michelle',
  'Brian', 'Laura', 'Kevin', 'Linda', 'Jason', 'Dorothy', 'Justin', 'Ashley', 'Amanda', 'Brandon',
  'Rachel', 'Nathan', 'Megan', 'Tyler', 'Olivia', 'Ethan', 'Isabella', 'Logan', 'Ava', 'Mason'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
];

async function main() {
  const schools = [
    { id: SCHOOLS.ARTS, name: 'Arts, Design and Architecture' },
    { id: SCHOOLS.BUSINESS, name: 'Business' },
    { id: SCHOOLS.TECHNOLOGY, name: 'Technology' },
    { id: SCHOOLS.SCIENCE, name: 'Science' }
  ];

  for (const school of schools) {
    const { data: faculty } = await supabase
      .from('Faculty')
      .select('id, name, email')
      .eq('schoolId', school.id)
      .order('createdAt', { ascending: true });

    // Check for duplicates
    const nameCounts: Record<string, { count: number; ids: string[] }> = {};
    for (const f of faculty || []) {
      if (!nameCounts[f.name]) nameCounts[f.name] = { count: 0, ids: [] };
      nameCounts[f.name].count++;
      nameCounts[f.name].ids.push(f.id);
    }

    let renamed = 0;
    for (const [name, info] of Object.entries(nameCounts)) {
      if (info.count > 1) {
        console.log(`\n${school.name} - Duplicate: ${name} (${info.count})`);
        
        // Keep first occurrence, rename others
        for (let i = 1; i < info.ids.length; i++) {
          const id = info.ids[i];
          const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
          const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
          const newName = `${firstName} ${lastName}`;
          const newEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@cannogacollege.ca`;
          
          // Check if new name already exists in this school
          const { data: existing } = await supabase.from('Faculty').select('id').eq('schoolId', school.id).eq('name', newName).single();
          if (existing) continue;
          
          const { error } = await supabase.from('Faculty').update({ 
            name: newName, 
            email: newEmail 
          }).eq('id', id);
          
          if (!error) {
            console.log(`  Renamed: ${name} → ${newName}`);
            renamed++;
          }
        }
      }
    }
    
    if (renamed > 0) {
      console.log(`  Total renamed: ${renamed}`);
    } else {
      console.log(`  No duplicates found`);
    }
  }
}

main().catch(console.error);
