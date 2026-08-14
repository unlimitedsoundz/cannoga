import { Client } from 'pg';

const connectionString = 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';
const client = new Client({ connectionString });

async function main() {
    try {
        await client.connect();
        
        // Check ALL foreign keys in the database
        console.log('=== ALL FOREIGN KEYS ===\n');
        const allFks = await client.query(`
            SELECT 
                conname as constraint_name,
                conrelid::regclass as table_name,
                confrelid::regclass as referenced_table,
                pg_get_constraintdef(oid) as definition
            FROM pg_constraint
            WHERE contype = 'f'
            ORDER BY conrelid::regclass::text, conname
        `);
        
        if (allFks.rows.length === 0) {
            console.log('No foreign keys found in database!');
        } else {
            console.log(`Total foreign keys: ${allFks.rows.length}\n`);
            allFks.rows.forEach(fk => {
                console.log(`  ${fk.table_name} -> ${fk.referenced_table}`);
                console.log(`    ${fk.definition}\n`);
            });
        }
        
        // Specifically check students table relationships
        console.log('=== Students table columns ===');
        const cols = await client.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'students'
            ORDER BY ordinal_position
        `);
        cols.rows.forEach(col => {
            console.log(`  ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
        });
        
        // Check applications table columns
        console.log('\n=== Applications table columns ===');
        const appCols = await client.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'applications'
            ORDER BY ordinal_position
        `);
        appCols.rows.forEach(col => {
            console.log(`  ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
        });
        
    } catch (error: any) {
        console.error('Error:', error.message);
    } finally {
        await client.end();
    }
}

main();
