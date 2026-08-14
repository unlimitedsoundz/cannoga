const fs = require('fs');
const { Client } = require('pg');

const url1 = "postgresql://postgres.mrqzlmkdhzwvbpljikjz:Guiliababy21%23@aws-1-eu-west-3.pooler.supabase.com:5432/postgres";

const client = new Client({
    connectionString: url1,
});

async function main() {
    try {
        await client.connect();
        const sql = fs.readFileSync('./create_page_contents_table.sql', 'utf8');
        await client.query(sql);
        console.log("✅ Migration applied successfully!");
    } catch (e) {
        console.error("❌ Migration failed:");
        console.error(e.message);
    } finally {
        await client.end();
    }
}

main();
