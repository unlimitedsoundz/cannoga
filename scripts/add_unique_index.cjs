const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
});

async function addConstraint() {
    await client.connect();
    await client.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_course_unique_title_level 
        ON "Course" (LOWER(TRIM(title)), "degreeLevel");
    `);
    console.log('✅ Unique index idx_course_unique_title_level created successfully');

    // Also unique index on slug
    await client.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_course_unique_slug 
        ON "Course" (LOWER(TRIM(slug)));
    `);
    console.log('✅ Unique index idx_course_unique_slug created successfully');

    const count = await client.query('SELECT COUNT(*) FROM "Course"');
    console.log(`Total courses currently: ${count.rows[0].count}`);

    await client.end();
}

addConstraint().catch(e => {
    console.error(e);
    process.exit(1);
});
