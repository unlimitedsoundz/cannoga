const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lbkrzyqpdqgtqbodkcyi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxia3J6eXFwZHFndHFib2RrY3lpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTU1NzE1MywiZXhwIjoyMTAxMTMzMTUzfQ.SNWg51lFpJ3Rdcm4L0w-PvunpD_wHFG7aqB2zJtMVhY'
);

async function checkSchema() {
  const { data: tables } = await supabase.rpc('exec_sql', {
    sql: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
  });
  
  console.log('Tables:', tables);

  const { data: columns } = await supabase.rpc('exec_sql', {
    sql: `SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name IN ('Subject', 'Course', 'module_enrollments', 'semesters', 'class_sessions', 'Faculty', 'profiles') ORDER BY table_name, ordinal_position`
  });
  
  console.log('Columns:', JSON.stringify(columns, null, 2));
}

checkSchema().catch(console.error);
