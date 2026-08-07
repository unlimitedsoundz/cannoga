const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  console.log('Fetching Certificate and Diploma courses...');
  const { data: courses, error: errCourses } = await supabase
    .from('Course')
    .select('id, title, slug, degreeLevel')
    .in('degreeLevel', ['CERTICACATE', 'DIPLOMA']);

  if (errCourses) {
    console.error('Error fetching courses:', errCourses);
    return;
  }

  console.log(`Processing ${courses.length} courses to update their credits...`);

  for (const course of courses) {
    // Count subjects for this course
    const { count, error: errCount } = await supabase
      .from('Subject')
      .select('*', { count: 'exact', head: true })
      .eq('courseId', course.id);

    if (errCount) {
      console.error(`Error counting subjects for ${course.slug}:`, errCount);
      continue;
    }

    const calculatedCredits = (count || 0) * 3;

    if (calculatedCredits === 0) {
      console.log(`Warning: Course ${course.title} (${course.slug}) has 0 subjects. Skipping credits update.`);
      continue;
    }

    // Update Course table credits column
    const { error: errUpdate } = await supabase
      .from('Course')
      .update({ credits: calculatedCredits })
      .eq('id', course.id);

    if (errUpdate) {
      console.error(`Error updating credits for ${course.slug}:`, errUpdate);
    } else {
      console.log(`Updated ${course.title} (${course.slug}) to ${calculatedCredits} credits (based on ${count} subjects).`);
    }
  }

  console.log('Credits update completed!');
}

run();
