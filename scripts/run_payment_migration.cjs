const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';

const client = new Client({ connectionString });

async function run() {
    console.log('Connecting to PostgreSQL database...');
    await client.connect();
    console.log('Connected.');
    
    console.log('Reading migration SQL...');
    const sql = fs.readFileSync(path.resolve(__dirname, '../supabase/migrations/20260818000002_dynamic_payments_and_forex.sql'), 'utf8');

    console.log('Executing SQL migration...');
    await client.query(sql);
    console.log('Migration executed.');

    const res = await client.query('SELECT count(*) FROM public.payment_purposes;');
    console.log('payment_purposes rows:', res.rows[0].count);

    const res2 = await client.query('SELECT count(*) FROM public.institutional_bank_accounts;');
    console.log('institutional_bank_accounts rows:', res2.rows[0].count);

    const res3 = await client.query('SELECT count(*) FROM public.institutional_exchange_rates;');
    console.log('institutional_exchange_rates rows:', res3.rows[0].count);

    await client.end();
    console.log('All migrations applied successfully!');
}

run().catch(err => {
    console.error('Error applying migration:', err);
    process.exit(1);
});
