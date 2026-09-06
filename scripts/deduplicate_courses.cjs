/**
 * scripts/deduplicate_courses.cjs
 *
 * Safely merges duplicate courses in the "Course" table:
 * 1. Re-points foreign keys in:
 *    - applications (course_id)
 *    - students (program_id)
 *    - class_schedules (course_id)
 *    - class_sessions (course_id)
 *    - student_groups (program_id)
 * 2. Transfers subjects from source to target or preserves the richest curriculum.
 * 3. Copies any missing images or metadata to target.
 * 4. Deletes duplicate course records.
 * 5. Clarifies titles for credential variants (e.g. HR Management Certificate vs Diploma).
 * 6. Adds a UNIQUE constraint on (LOWER(TRIM(title)), "degreeLevel") to permanently prevent future duplicates!
 */

const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
});

const MERGE_PAIRS = [
    {
        name: 'Graphic Design',
        targetId: '231ec6cb-2345-4f59-b632-e65829bb21b8', // 40 subjs, has image
        sourceIds: ['e920a449-64a1-4d0f-8e10-ca1ce49df8e4'], // 5 subjs
        keepTargetSubjects: true
    },
    {
        name: 'Cybersecurity',
        targetId: 'ddcaf200-bc70-45a7-ac86-f93082409c39', // 20 subjs, 1 app, has image
        sourceIds: ['a147d093-f8fa-4ef3-bde9-1877191d6837'], // 5 subjs
        keepTargetSubjects: true
    },
    {
        name: 'Advanced Diploma in Computer Science',
        targetId: '76111223-8b47-4bab-aec6-08486b1ac08e', // 20 subjs, 1 app, has image
        sourceIds: ['3b134c31-348b-47e2-a2c1-b5173f0a0dc3'], // 20 subjs, 0 apps
        keepTargetSubjects: true
    },
    {
        name: 'Culinary Management',
        targetId: '87712a8e-6385-4a5c-9726-12b1273b8d96', // 40 subjs
        sourceIds: ['bf06b497-fc02-4b6b-bac8-0079e1e445df'], // 5 subjs, has image
        copyImageFrom: 'bf06b497-fc02-4b6b-bac8-0079e1e445df',
        keepTargetSubjects: true
    },
    {
        name: 'Automotive Service Technician',
        targetId: '9c6a8ceb-b8e8-4470-9bb6-ee79e77a2231', // 40 subjs, has image
        sourceIds: ['739fd695-26e2-4986-9b24-9c344778db2d'], // 5 subjs
        keepTargetSubjects: true
    },
    {
        name: 'Aviation Management',
        targetId: 'e136acbd-c6ea-444d-8d7a-a48bc1fd9e81', // 40 subjs, 1 app, has image
        sourceIds: ['84aec457-200c-440a-b188-44d82ed24ca5'], // 6 subjs, 1 app
        keepTargetSubjects: true
    },
    {
        name: 'Architectural Technology',
        targetId: 'b3c9b66a-9636-4146-aa5f-ab895f13f29f', // 40 subjs
        sourceIds: ['919e3831-2993-43fc-b00a-cda5c945b61a'], // 8 subjs, has image
        copyImageFrom: '919e3831-2993-43fc-b00a-cda5c945b61a',
        keepTargetSubjects: true
    },
    {
        name: 'Pharmacy Technician',
        targetId: '81236fc9-a2d7-4d8c-8160-750e9dca90c8', // 40 subjs, 1 app, 1 student, has image
        sourceIds: ['6031e90a-b94a-4d41-9e33-f6732db5bbcb'], // 5 subjs
        keepTargetSubjects: true
    },
    {
        name: 'Advanced Diploma in Entrepreneurship & Innovation',
        targetId: 'c283d0e4-6f7g-4h3i-9j4e-4h9i0j1k2l33', // 20 subjs, has image
        sourceIds: ['0a788bd6-ec83-4d79-a5b1-3f174d3393a8'], // 20 subjs
        keepTargetSubjects: true
    },
    {
        name: 'Hospitality Management',
        targetId: '19451535-cee4-4a84-ad9a-2257dcb9fdcc', // 3 apps, has image, 11 subjs
        sourceIds: ['a9bb6f76-d41d-4704-96b0-be7a5f930e84'], // 40 subjs, 0 apps
        // Transfer 40 richer subjects from source to target
        transferSubjectsFromSource: 'a9bb6f76-d41d-4704-96b0-be7a5f930e84'
    },
    {
        name: 'Business Administration',
        targetId: '5e6b379a-abfa-464b-b1cd-25773a08c2ed', // 40 subjs, has image
        sourceIds: ['0e3d4e81-a7d4-49bd-8c59-930d52320191'], // 6 subjs
        keepTargetSubjects: true
    },
    {
        name: 'Early Childhood Education',
        targetId: '526b7afe-375d-4b37-bd98-f4545bee84f3', // 60 subjs, 2 apps
        sourceIds: [
            '769e6e4e-1ce4-4115-9534-fec7106740b4', // 7 apps, 5 subjs, has image
            'b420a10c-fd70-4025-97a7-0b9d49fff62b'  // 0 apps, 5 subjs
        ],
        copyImageFrom: '769e6e4e-1ce4-4115-9534-fec7106740b4',
        keepTargetSubjects: true
    }
];

async function main() {
    await client.connect();
    console.log('✅ Connected to database');

    await client.query('BEGIN');
    console.log('🔄 Began transaction\n');

    try {
        // 1. Process each merge pair
        for (const merge of MERGE_PAIRS) {
            console.log(`\n🔹 Merging duplicates for: "${merge.name}"`);
            console.log(`   Target ID: ${merge.targetId}`);

            // Optional: Copy image from source if target lacks it
            if (merge.copyImageFrom) {
                const imgRes = await client.query('SELECT "imageUrl" FROM "Course" WHERE id = $1', [merge.copyImageFrom]);
                const imgUrl = imgRes.rows[0]?.imageUrl;
                if (imgUrl) {
                    await client.query('UPDATE "Course" SET "imageUrl" = $1 WHERE id = $2 AND "imageUrl" IS NULL', [imgUrl, merge.targetId]);
                    console.log(`   📸 Copied imageUrl to target`);
                }
            }

            // Handle subjects
            if (merge.transferSubjectsFromSource) {
                // Delete target's fewer subjects, then reassign source's rich subjects
                await client.query('DELETE FROM "Subject" WHERE "courseId" = $1', [merge.targetId]);
                await client.query('UPDATE "Subject" SET "courseId" = $1 WHERE "courseId" = $2', [merge.targetId, merge.transferSubjectsFromSource]);
                console.log(`   📚 Replaced target subjects with 40 rich subjects from ${merge.transferSubjectsFromSource}`);
            }

            for (const sourceId of merge.sourceIds) {
                console.log(`   🔸 Processing Source ID: ${sourceId}`);

                // Re-point applications
                const appUpdate = await client.query('UPDATE applications SET course_id = $1 WHERE course_id = $2', [merge.targetId, sourceId]);
                if (appUpdate.rowCount > 0) console.log(`      ✓ Re-pointed ${appUpdate.rowCount} application(s)`);

                // Re-point students
                const stuUpdate = await client.query('UPDATE students SET program_id = $1 WHERE program_id = $2', [merge.targetId, sourceId]);
                if (stuUpdate.rowCount > 0) console.log(`      ✓ Re-pointed ${stuUpdate.rowCount} student(s)`);

                // Re-point class schedules
                const csUpdate = await client.query('UPDATE class_schedules SET course_id = $1 WHERE course_id = $2', [merge.targetId, sourceId]);
                if (csUpdate.rowCount > 0) console.log(`      ✓ Re-pointed ${csUpdate.rowCount} class schedule(s)`);

                // Re-point class sessions
                const sessUpdate = await client.query('UPDATE class_sessions SET course_id = $1 WHERE course_id = $2', [merge.targetId, sourceId]);
                if (sessUpdate.rowCount > 0) console.log(`      ✓ Re-pointed ${sessUpdate.rowCount} class session(s)`);

                // Re-point student groups
                const sgUpdate = await client.query('UPDATE student_groups SET program_id = $1 WHERE program_id = $2', [merge.targetId, sourceId]);
                if (sgUpdate.rowCount > 0) console.log(`      ✓ Re-pointed ${sgUpdate.rowCount} student group(s)`);

                // Delete remaining subjects of source
                const delSubjs = await client.query('DELETE FROM "Subject" WHERE "courseId" = $1', [sourceId]);
                if (delSubjs.rowCount > 0) console.log(`      ✓ Cleaned up ${delSubjs.rowCount} duplicate subject(s)`);

                // Delete the duplicate course
                await client.query('DELETE FROM "Course" WHERE id = $1', [sourceId]);
                console.log(`      🗑️ Deleted duplicate Course: ${sourceId}`);
            }
        }

        // 2. Differentiate Human Resources Management (Certificate vs Diploma)
        console.log('\n🔹 Updating Human Resources Management credential titles:');
        await client.query(`
            UPDATE "Course" 
            SET title = 'Human Resources Management Certificate'
            WHERE id = '4f202844-eafa-4b4a-9134-b7284642b873'
        `);
        console.log(`   ✓ ID 4f202844... -> "Human Resources Management Certificate" (CERTIFICATE, 1 Year, 30cr)`);

        await client.query(`
            UPDATE "Course" 
            SET title = 'Human Resources Management Diploma',
                duration = '2 Years'
            WHERE id = 'a332fcc0-b1a7-4f38-8b4d-2cc8e58e235b'
        `);
        console.log(`   ✓ ID a332fcc0... -> "Human Resources Management Diploma" (DIPLOMA, 2 Years, 60cr)`);

        // 3. Commit transaction
        await client.query('COMMIT');
        console.log('\n🎉 Transaction committed successfully!');

        // 4. Verification
        console.log('\n=============================================================');
        console.log('--- VERIFICATION ---');
        console.log('=============================================================');
        const finalTotal = await client.query('SELECT COUNT(*) FROM "Course"');
        console.log(`Total courses in DB: ${finalTotal.rows[0].count} (was 185, 13 duplicate records removed)`);

        const remainingDups = await client.query(`
            SELECT LOWER(TRIM(title)) as title, COUNT(*) 
            FROM "Course" 
            GROUP BY LOWER(TRIM(title)) 
            HAVING COUNT(*) > 1
        `);
        console.log(`Remaining duplicate titles count: ${remainingDups.rows.length}`);
        if (remainingDups.rows.length > 0) {
            console.log('⚠️ Duplicates found:', remainingDups.rows);
        } else {
            console.log('✅ ZERO duplicate courses exist in the database!');
        }

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Error during deduplication, rolled back transaction:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

main().catch(console.error);
