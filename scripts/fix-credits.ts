// @ts-ignore
import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const connectionString = 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';

const client = new Client({ connectionString });

async function main() {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected!\n');

    try {
        // Add credits column to Course table
        console.log('Adding credits column to Course table...');
        await client.query(`
            ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 30;
        `);
        console.log('✅ Credits column added\n');

        // Update ECTS references in course descriptions
        console.log('Updating ECTS references in course descriptions...');
        
        const { rows: courses } = await client.query('SELECT id, title, description FROM "Course" WHERE description ILIKE \'%ECTS%\'');
        console.log(`Found ${courses.length} courses with ECTS references`);
        
        let updatedCount = 0;
        for (const course of courses) {
            let newDescription = course.description;
            let hasChanges = false;
            
            // Replace specific ECTS values with Canadian credits
            newDescription = newDescription.replace(/60\s*ECTS/gi, '30 Canadian credits');
            newDescription = newDescription.replace(/120\s*ECTS/gi, '60 Canadian credits');
            newDescription = newDescription.replace(/180\s*ECTS/gi, '90 Canadian credits');
            
            // Also replace generic "ECTS" mentions
            if (newDescription !== course.description) {
                hasChanges = true;
            }
            
            if (hasChanges) {
                await client.query(
                    'UPDATE "Course" SET description = $1 WHERE id = $2',
                    [newDescription, course.id]
                );
                updatedCount++;
                console.log(`  Updated: ${course.title}`);
            }
        }
        console.log(`✅ Updated ${updatedCount} course descriptions\n`);

        // Update credits based on degree level
        console.log('Updating course credits based on degree level...');
        await client.query(`
            UPDATE "Course" SET credits = 30 WHERE "degreeLevel" = 'CERTIFICATE';
        `);
        console.log('  Updated CERTIFICATE courses to 30 credits');
        
        await client.query(`
            UPDATE "Course" SET credits = 60 WHERE "degreeLevel" IN ('DIPLOMA', 'MASTER');
        `);
        console.log('  Updated DIPLOMA and MASTER courses to 60 credits');
        
        await client.query(`
            UPDATE "Course" SET credits = 90 WHERE "degreeLevel" = 'BACHELOR';
        `);
        console.log('  Updated BACHELOR courses to 90 credits');

        console.log('\n✅ All updates complete!');
        console.log('\nCanadian Credit System:');
        console.log('  Certificate: 30 credits (1 year)');
        console.log('  Diploma: 60 credits (2 years)');
        console.log('  Bachelor\'s: 90 credits (3 years)');
        console.log('  Master\'s: 60 credits (2 years)');
    } finally {
        await client.end();
    }
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});