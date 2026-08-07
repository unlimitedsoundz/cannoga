import { Client } from 'pg';

const connectionString = 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';
const client = new Client({ connectionString });

async function main() {
    try {
        await client.connect();
        
        // Check Course table id type
        const courseIdType = await client.query(`
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'Course' AND column_name = 'id'
        `);
        console.log('Course.id type:', courseIdType.rows[0]);
        
        // Check students.program_id type
        const progType = await client.query(`
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'students' AND column_name = 'program_id'
        `);
        console.log('students.program_id type:', progType.rows[0]);
        
        // Verify the FK constraint
        const fk = await client.query(`
            SELECT conname, pg_get_constraintdef(oid) as def
            FROM pg_constraint
            WHERE conrelid = 'students'::regclass
            AND contype = 'f'
            AND pg_get_constraintdef(oid) LIKE '%program_id%'
        `);
        console.log('FK constraint:', fk.rows[0]);
        
    } catch (error: any) {
        console.error('Error:', error.message);
    } finally {
        await client.end();
    }
}

main();
