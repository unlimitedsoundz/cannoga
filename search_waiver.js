const { Client } = require('pg');

const url1 = "postgresql://postgres.mrqzlmkdhzwvbpljikjz:Guiliababy21%23@aws-1-eu-west-3.pooler.supabase.com:5432/postgres";

const client = new Client({
    connectionString: url1,
});

async function main() {
    try {
        await client.connect();
        const res = await client.query(`
            SELECT id, page_slug, section_key, content 
            FROM public.page_content 
            WHERE content ILIKE '%waiver%' OR content ILIKE '%ebtw%' OR content ILIKE '%early bird%'
        `);
        console.log("Matching rows:");
        for (let row of res.rows) {
            console.log(`- ID: ${row.id}, slug: ${row.page_slug}, key: ${row.section_key}`);
            console.log(row.content);
            console.log("-----------------------------------------");
        }
    } catch (e) {
        console.error(e.message);
    } finally {
        await client.end();
    }
}

main();
