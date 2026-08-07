// @ts-ignore
import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const connectionString = 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';

const client = new Client({ connectionString });

async function main() {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected!\n');

    try {
        // Create faq_pages table
        console.log('Creating faq_pages table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS faq_pages (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                name TEXT NOT NULL,
                slug TEXT NOT NULL UNIQUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        console.log('✅ faq_pages table created\n');

        // Create faq table
        console.log('Creating faq table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS faq (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                page_id UUID NOT NULL REFERENCES faq_pages(id) ON DELETE CASCADE,
                order_index INTEGER DEFAULT 0,
                is_published BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        console.log('✅ faq table created\n');

        // Create indexes
        console.log('Creating indexes...');
        await client.query(`CREATE INDEX IF NOT EXISTS idx_faq_page_id ON faq(page_id);`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_faq_order_index ON faq(order_index);`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_faq_published ON faq(is_published);`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_faq_pages_slug ON faq_pages(slug);`);
        console.log('✅ Indexes created\n');

        // Create it_assets table
        console.log('Creating it_assets table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS it_assets (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                asset_type TEXT NOT NULL CHECK (asset_type IN ('LMS', 'EMAIL', 'VPN', 'VIRTUAL_LAB', 'LIBRARY', 'SOFTWARE_LICENSE')),
                name TEXT NOT NULL,
                description TEXT,
                access_url TEXT,
                auto_provision BOOLEAN DEFAULT true,
                license_limit INTEGER,
                current_usage INTEGER DEFAULT 0,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);
        console.log('✅ it_assets table created\n');

        // Create student_it_access table
        console.log('Creating student_it_access table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS student_it_access (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
                asset_id UUID NOT NULL REFERENCES it_assets(id) ON DELETE CASCADE,
                credentials JSONB,
                activated_at TIMESTAMPTZ,
                expires_at TIMESTAMPTZ,
                deactivated_at TIMESTAMPTZ,
                status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('PENDING', 'ACTIVE', 'EXPIRED', 'DEACTIVATED')),
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                UNIQUE(student_id, asset_id)
            );
        `);
        console.log('✅ student_it_access table created\n');

        console.log('✅ All missing tables created successfully!');
    } finally {
        await client.end();
    }
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});