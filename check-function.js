const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lbkrzyqpdqgtqbodkcyi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxia3J6eXFwZHFndHFib2RrY3lpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTU1NzE1MywiZXhwIjoyMTAxMTMzMTUzfQ.SNWg51lFpJ3Rdcm4L0w-PvunpD_wHFG7aqB2zJtMVhY'
);

async function checkFunctions() {
  const { data } = await supabase.rpc('exec_sql', {
    sql: "SELECT proname FROM pg_proc WHERE proname = 'generate_student_id'"
  });
  console.log('Functions:', data);
}

checkFunctions().catch(console.error);
