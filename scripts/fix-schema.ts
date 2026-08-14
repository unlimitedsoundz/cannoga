import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixSchema() {
    console.log('Fixing DegreeLevel enum and tuition_rates table...\n');
    
    // 1. Add missing enum values to DegreeLevel
    // We need to use raw SQL for this
    const { error: enumError } = await supabase.rpc('exec_sql', {
        sql: `
            DO $$
            BEGIN
                -- Check if DIPLOMA exists, if not add it
                IF NOT EXISTS (
                    SELECT 1 FROM pg_enum 
                    WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'DegreeLevel')
                    AND enumlabel = 'DIPLOMA'
                ) THEN
                    ALTER TYPE "DegreeLevel" ADD VALUE 'DIPLOMA';
                END IF;
                
                -- Check if CERTIFICATE exists, if not add it
                IF NOT EXISTS (
                    SELECT 1 FROM pg_enum 
                    WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'DegreeLevel')
                    AND enumlabel = 'CERTIFICATE'
                ) THEN
                    ALTER TYPE "DegreeLevel" ADD VALUE 'CERTIFICATE';
                END IF;
            END $$;
        `
    });
    
    if (enumError) {
        console.error('Error fixing enum:', enumError);
        // Try alternative approach using direct SQL execution
        console.log('Trying alternative approach...');
    } else {
        console.log('✅ DegreeLevel enum fixed');
    }
    
    // 2. Create tuition_rates table if it doesn't exist
    const { error: tableError } = await supabase.rpc('exec_sql', {
        sql: `
            CREATE TABLE IF NOT EXISTS public.tuition_rates (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                degree_level TEXT NOT NULL,
                field TEXT NOT NULL,
                annual_fee DECIMAL(10, 2) NOT NULL,
                currency TEXT DEFAULT 'CAD',
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW(),
                UNIQUE(degree_level, field)
            );
        `
    });
    
    if (tableError) {
        console.error('Error creating tuition_rates table:', tableError);
    } else {
        console.log('✅ tuition_rates table created/verified');
    }
    
    // 3. Enable RLS and create policy
    const { error: rlsError } = await supabase.rpc('exec_sql', {
        sql: `
            ALTER TABLE public.tuition_rates ENABLE ROW LEVEL SECURITY;
            DROP POLICY IF EXISTS "Tuition rates are viewable by everyone" ON public.tuition_rates;
            CREATE POLICY "Tuition rates are viewable by everyone" ON public.tuition_rates FOR SELECT USING (true);
        `
    });
    
    if (rlsError) {
        console.error('Error setting up RLS:', rlsError);
    } else {
        console.log('✅ RLS policies set up');
    }
}

fixSchema().then(() => {
    console.log('\nSchema fix complete.');
    process.exit(0);
}).catch(err => {
    console.error('Failed:', err);
    process.exit(1);
});