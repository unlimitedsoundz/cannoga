const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lbkrzyqpdgqtqbodkcyi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxia3J6eXFwZHFndHFib2RrY3lpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTU1NzE1MywiZXhwIjoyMTAxMTMzMTUzfQ.SNWg51lFpJ3Rdcm4L0w-PvunpD_wHFG7aqB2zJtMVhY'
);

async function test() {
  // Try to execute raw SQL via RPC
  const { data, error } = await supabase.rpc('exec_sql', { 
    sql: 'SELECT column_name FROM information_schema.columns WHERE table_name = \'students\' AND column_name LIKE \'tuition_deposit_%\' ORDER BY column_name;' 
  });
  
  if (error) {
    console.log('RPC error:', error.message);
  } else {
    console.log('RPC result:', data);
  }
}

test();
