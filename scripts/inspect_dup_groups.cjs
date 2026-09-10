const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
});

async function inspectGroups() {
    await client.connect();

    const dupTitles = [
        'early childhood education',
        'graphic design',
        'cybersecurity',
        'advanced diploma in computer science',
        'culinary management',
        'automotive service technician',
        'aviation management',
        'architectural technology',
        'pharmacy technician',
        'advanced diploma in entrepreneurship & innovation',
        'hospitality management',
        'business administration'
    ];

    for (const title of dupTitles) {
        console.log(`\n=============================================================`);
        console.log(`TITLE: "${title}"`);
        console.log(`=============================================================`);

        const res = await client.query(`
            SELECT id, title, slug, "degreeLevel", duration, credits, "schoolId", "departmentId", cip_code, code,
                   description IS NOT NULL as has_desc,
                   "imageUrl" IS NOT NULL as has_image
            FROM "Course"
            WHERE LOWER(TRIM(title)) = $1
            ORDER BY id
        `, [title]);

        for (const c of res.rows) {
            const apps = (await client.query('SELECT COUNT(*) FROM applications WHERE course_id = $1', [c.id])).rows[0].count;
            const subjs = (await client.query('SELECT COUNT(*) FROM "Subject" WHERE "courseId" = $1', [c.id])).rows[0].count;
            const students = (await client.query('SELECT COUNT(*) FROM students WHERE program_id = $1', [c.id])).rows[0].count;
            const groups = (await client.query('SELECT COUNT(*) FROM student_groups WHERE program_id = $1', [c.id])).rows[0].count;

            console.log(`ID: ${c.id}`);
            console.log(`  Slug: ${c.slug} | Code: ${c.code} | CIP: ${c.cip_code}`);
            console.log(`  Level: ${c.degreeLevel} | Duration: ${c.duration} | Credits: ${c.credits}`);
            console.log(`  HasDesc: ${c.has_desc} | HasImage: ${c.has_image}`);
            console.log(`  School: ${c.schoolId} | Dept: ${c.departmentId}`);
            console.log(`  Counts: apps=${apps}, subjs=${subjs}, students=${students}, groups=${groups}`);
        }
    }

    await client.end();
}

inspectGroups().catch(e => {
    console.error(e);
    process.exit(1);
});
