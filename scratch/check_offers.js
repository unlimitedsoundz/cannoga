const { Client } = require('pg');

const connectionString = "postgresql://postgres.mrqzlmkdhzwvbpljikjz:Guiliababy21%23@aws-1-eu-west-3.pooler.supabase.com:5432/postgres";

async function main() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        const res = await client.query(`
            SELECT ao.id, ao.application_id, ao.tuition_fee, ao.discount_amount, ao.status, 
                   a.personal_info, c.title, c.duration, c."degreeLevel"
            FROM public.admission_offers ao
            JOIN public.applications a ON ao.application_id = a.id
            JOIN public."Course" c ON a.course_id = c.id
        `);
        console.log("Admission Offers:");
        for (let row of res.rows) {
            console.log({
                id: row.id,
                application_id: row.application_id,
                tuition_fee: row.tuition_fee,
                discount_amount: row.discount_amount,
                status: row.status,
                course: row.title,
                duration: row.duration,
                degree_level: row.degreeLevel,
                personal_info: row.personal_info
            });
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

main();
