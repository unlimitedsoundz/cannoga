// @ts-ignore
import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const connectionString = 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';

const client = new Client({ connectionString });

async function fixSchema() {
    console.log('Connecting to database via pooler...');
    await client.connect();
    console.log('Connected!\n');
    
    try {
        console.log('Fixing DegreeLevel enum...');
        await client.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_enum 
                    WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'DegreeLevel')
                    AND enumlabel = 'DIPLOMA'
                ) THEN
                    ALTER TYPE "DegreeLevel" ADD VALUE 'DIPLOMA';
                    RAISE NOTICE 'Added DIPLOMA to DegreeLevel enum';
                END IF;
                
                IF NOT EXISTS (
                    SELECT 1 FROM pg_enum 
                    WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'DegreeLevel')
                    AND enumlabel = 'CERTIFICATE'
                ) THEN
                    ALTER TYPE "DegreeLevel" ADD VALUE 'CERTIFICATE';
                    RAISE NOTICE 'Added CERTIFICATE to DegreeLevel enum';
                END IF;
            END $$;
        `);
        console.log('✅ DegreeLevel enum fixed\n');
        
        console.log('Creating tuition_rates table...');
        await client.query(`
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
        `);
        console.log('✅ tuition_rates table created\n');
        
        console.log('Setting up RLS policies...');
        await client.query(`
            ALTER TABLE public.tuition_rates ENABLE ROW LEVEL SECURITY;
            DROP POLICY IF EXISTS "Tuition rates are viewable by everyone" ON public.tuition_rates;
            CREATE POLICY "Tuition rates are viewable by everyone" ON public.tuition_rates FOR SELECT USING (true);
        `);
        console.log('✅ RLS policies set up\n');
        
        console.log('Verifying DegreeLevel enum values...');
        const result = await client.query(`
            SELECT enumlabel 
            FROM pg_enum 
            WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'DegreeLevel')
            ORDER BY enumsortorder;
        `);
        console.log('Current enum values:', result.rows.map((r: any) => r.enumlabel).join(', '));
        
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

fixSchema();