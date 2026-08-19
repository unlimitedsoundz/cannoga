const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';

const client = new Client({ connectionString });

async function run() {
    console.log('Connecting to PostgreSQL database...');
    await client.connect();
    console.log('Connected.');
    
    console.log('Reading housing migration SQL...');
    const sql = fs.readFileSync(path.resolve(__dirname, '../supabase/migrations/20260819000001_student_housing_system.sql'), 'utf8');

    console.log('Executing SQL migration...');
    await client.query(sql);
    console.log('Housing migration executed.');

    const res1 = await client.query('SELECT count(*) FROM public.housing_buildings;');
    console.log('housing_buildings count:', res1.rows[0].count);

    const res2 = await client.query('SELECT count(*) FROM public.housing_rooms;');
    console.log('housing_rooms count:', res2.rows[0].count);

    const res3 = await client.query('SELECT count(*) FROM public.homestay_hosts;');
    console.log('homestay_hosts count:', res3.rows[0].count);

    const res4 = await client.query('SELECT count(*) FROM public.residence_meal_plans;');
    console.log('residence_meal_plans count:', res4.rows[0].count);

    await client.end();
    console.log('Housing migration applied successfully to database!');
}

run().catch(err => {
    console.error('Error applying migration:', err);
    process.exit(1);
});
