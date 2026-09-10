const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
});

async function test() {
    await client.connect();
    const tables = ['applications', 'students', 'class_schedules', 'class_sessions', 'student_groups'];
    for (const t of tables) {
        const cons = await client.query(`
            SELECT conname, contype, pg_get_constraintdef(oid) 
            FROM pg_constraint 
            WHERE conrelid = '${t}'::regclass
        `);
        console.log(`\nTable ${t}:`);
        cons.rows.forEach(r => console.log(' ', r.conname, r.contype, r.pg_get_constraintdef));
    }
    await client.end();
}

test().catch(e => {
    console.error(e);
    process.exit(1);
});
