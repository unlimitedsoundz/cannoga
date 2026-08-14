const { PrismaClient } = require('@prisma/client');

// Attempt 1: Encoded
const url1 = "postgresql://postgres.mrqzlmkdhzwvbpljikjz:Guiliababy21%23@aws-1-eu-west-3.pooler.supabase.com:5432/postgres";

console.log("Testing URL:", url1);

const prisma = new PrismaClient({
    datasourceUrl: url1
});

async function main() {
    try {
        await prisma.$connect();
        console.log("✅ Connected successfully!");
    } catch (e) {
        console.error("❌ Connection failed:");
        console.error(e.message);
        console.error(JSON.stringify(e, null, 2));
    } finally {
        await prisma.$disconnect();
    }
}

main();
