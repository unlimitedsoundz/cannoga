require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkStudents() {
  try {
    const { data: students, error } = await supabase
      .from('students')
      .select('id, student_id, institutional_email, personal_email');
      
    if (error) throw error;
    
    let cncCount = 0;
    let emailLegacyCount = 0;
    let kuCount = 0;

    students.forEach(s => {
      if (s.student_id && s.student_id.startsWith('CNC')) {
        cncCount++;
      }
      if (s.student_id && s.student_id.startsWith('KU')) {
        kuCount++;
      }
      if (s.institutional_email && s.institutional_email.includes('cannogacollege.ca')) {
        emailLegacyCount++;
      }
    });

    console.log('=== STUDENT ID VERICACATION ===');
    console.log(`Total students: ${students.length}`);
    console.log(`Students with CNC prefix: ${cncCount}`);
    console.log(`Students with KU prefix: ${kuCount}`);
    console.log(`Students with legacy @cannogacollege.ca email: ${emailLegacyCount}`);

    if (cncCount === 0 && emailLegacyCount === 0 && kuCount > 0) {
      console.log('Success! All student IDs successfully updated to KU prefix and institutional emails updated.');
    } else {
      console.log('Warning: Rebrand verification failed. Review counts above.');
    }

    // Print a few examples
    console.log('\nExamples:');
    students.slice(0, 5).forEach(s => {
      console.log(`Student ID: ${s.student_id} | Institutional Email: ${s.institutional_email}`);
    });
  } catch (err) {
    console.error('Error fetching students:', err);
  }
}

checkStudents();
