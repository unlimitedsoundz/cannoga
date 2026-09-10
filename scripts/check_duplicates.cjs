const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
});

async function check() {
    await client.connect();

    const dupTitlesRes = await client.query(`
        SELECT LOWER(TRIM(title)) as norm_title, COUNT(*) as count
        FROM "Course" 
        GROUP BY LOWER(TRIM(title)) 
        HAVING COUNT(*) > 1
        ORDER BY count DESC
    `);

    console.log(`Found ${dupTitlesRes.rows.length} duplicate title groups.\n`);

    for (const group of dupTitlesRes.rows) {
        console.log(`========================================================================`);
        console.log(`TITLE: "${group.norm_title}" (Count: ${group.count})`);
        console.log(`========================================================================`);

        const courses = await client.query(`
            SELECT id, title, slug, "degreeLevel", duration, credits, "schoolId", "departmentId", cip_code, code
            FROM "Course"
            WHERE LOWER(TRIM(title)) = $1
            ORDER BY id
        `, [group.norm_title]);

        for (const c of courses.rows) {
            // Count references
            const appRes = await client.query('SELECT COUNT(*) FROM applications WHERE course_id = $1', [c.id]);
            const subjRes = await client.query('SELECT COUNT(*) FROM "Subject" WHERE "courseId" = $1', [c.id]);
            const stuRes = await client.query('SELECT COUNT(*) FROM students WHERE program_id = $1', [c.id]);
            const csRes = await client.query('SELECT COUNT(*) FROM class_schedules WHERE course_id = $1', [c.id]);
            const sessRes = await client.query('SELECT COUNT(*) FROM class_sessions WHERE course_id = $1', [c.id]);
            const sgRes = await client.query('SELECT COUNT(*) FROM student_groups WHERE program_id = $1', [c.id]);

            const appCount = parseInt(appRes.rows[0].count);
            const subjCount = parseInt(subjRes.rows[0].count);
            const stuCount = parseInt(stuRes.rows[0].count);
            const csCount = parseInt(csRes.rows[0].count);
            const sessCount = parseInt(sessRes.rows[0].count);
            const sgCount = parseInt(sgRes.rows[0].count);
            const totalRefs = appCount + subjCount + stuCount + csCount + sessCount + sgCount;

            console.log(`  ID: ${c.id}`);
            console.log(`    Slug: ${c.slug}`);
            console.log(`    Title: ${c.title}`);
            console.log(`    DegreeLevel: ${c.degreeLevel}`);
            console.log(`    Duration: ${c.duration} | Credits: ${c.credits} | Code: ${c.code} | CIP: ${c.cip_code}`);
            console.log(`    School: ${c.schoolId} | Dept: ${c.departmentId}`);
            console.log(`    References: ${totalRefs} (Apps: ${appCount}, Subj: ${subjCount}, Students: ${stuCount}, Schedules: ${csCount}, Sessions: ${sessCount}, Groups: ${sgCount})`);
            console.log(`------------------------------------------------------------------------`);
        }
    }

    await client.end();
}

check().catch(e => {
    console.error(e);
    process.exit(1);
});
