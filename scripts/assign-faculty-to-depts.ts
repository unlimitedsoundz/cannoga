import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data: schools } = await supabase.from('School').select('id, name');
  const { data: departments } = await supabase.from('Department').select('id, name, schoolId');
  const { data: faculty } = await supabase.from('Faculty').select('id, name, schoolId, departmentId');

  // Group departments by school
  const deptsBySchool: Record<string, any[]> = {};
  for (const d of departments || []) {
    if (!deptsBySchool[d.schoolId]) deptsBySchool[d.schoolId] = [];
    deptsBySchool[d.schoolId].push(d);
  }

  // Group faculty by school
  const facultyBySchool: Record<string, any[]> = {};
  for (const f of faculty || []) {
    if (!facultyBySchool[f.schoolId]) facultyBySchool[f.schoolId] = [];
    facultyBySchool[f.schoolId].push(f);
  }

  let updated = 0;
  for (const school of schools || []) {
    const depts = deptsBySchool[school.id] || [];
    const facultyList = facultyBySchool[school.id] || [];
    
    if (depts.length === 0 || facultyList.length === 0) continue;

    // Distribute faculty across departments round-robin
    for (let i = 0; i < facultyList.length; i++) {
      const f = facultyList[i];
      if (f.departmentId) continue; // Skip if already assigned
      
      const dept = depts[i % depts.length];
      const { error } = await supabase.from('Faculty').update({ departmentId: dept.id }).eq('id', f.id);
      if (error) {
        console.error(`Error updating ${f.name}:`, error.message);
      } else {
        updated++;
      }
    }
  }

  console.log(`Updated ${updated} faculty members with departments.`);
}

main().catch(console.error);
