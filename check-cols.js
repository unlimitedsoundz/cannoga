const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://lbkrzyqpdqgtqbodkcyi.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxia3J6eXFwZHFndHFib2RrY3lpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTU1NzE1MywiZXhwIjoyMTAxMTMzMTUzfQ.SNWg51lFpJ3Rdcm4L0w-PvunpD_wHFG7aqB2zJtMVhY');

async function check() {
  const { data: csCols } = await supabase.rpc('exec_sql', { 
    sql: "SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'class_sessions' ORDER BY ordinal_position" 
  });
  console.log('class_sessions columns:', csCols);
  
  const { data: scheduleCols } = await supabase.rpc('exec_sql', { 
    sql: "SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'class_schedules' ORDER BY ordinal_position" 
  });
  console.log('class_schedules columns:', scheduleCols);
}

check().catch(console.error);
