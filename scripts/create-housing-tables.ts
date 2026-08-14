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
        // Create housing_invoice_status enum
        console.log('Creating housing_invoice_status enum...');
        await client.query(`
            DO $$ BEGIN
                CREATE TYPE housing_invoice_status AS ENUM ('PENDING', 'PARTIALLY_PAID', 'PAID', 'CANCELLED', 'OVERDUE');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);
        console.log('✅ housing_invoice_status enum created\n');

        // Create housing_payment_method enum
        console.log('Creating housing_payment_method enum...');
        await client.query(`
            DO $$ BEGIN
                CREATE TYPE housing_payment_method AS ENUM ('CREDIT_CARD', 'BANK_TRANSFER', 'MOBILE_MONEY', 'LOCAL_RAILS', 'PAYGOWIRE');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);
        console.log('✅ housing_payment_method enum created\n');

        // Create housing_payment_status enum
        console.log('Creating housing_payment_status enum...');
        await client.query(`
            DO $$ BEGIN
                CREATE TYPE housing_payment_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);
        console.log('✅ housing_payment_status enum created\n');

        // Create housing_invoice_item_type enum
        console.log('Creating housing_invoice_item_type enum...');
        await client.query(`
            DO $$ BEGIN
                CREATE TYPE housing_invoice_item_type AS ENUM ('HOUSING_DEPOSIT', 'MONTHLY_RENT', 'UTILITIES', 'CLEANING_FEE', 'MEAL_PLAN', 'LATE_FEE');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);
        console.log('✅ housing_invoice_item_type enum created\n');

        // Create housing_invoices table
        console.log('Creating housing_invoices table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS housing_invoices (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                reference_number TEXT UNIQUE NOT NULL,
                student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
                application_id UUID REFERENCES housing_applications(id),
                total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
                paid_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
                currency TEXT NOT NULL DEFAULT 'CAD',
                status housing_invoice_status NOT NULL DEFAULT 'PENDING',
                due_date DATE NOT NULL,
                metadata JSONB DEFAULT '{}'::jsonb,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);
        console.log('✅ housing_invoices table created\n');

        // Create housing_invoice_items table
        console.log('Creating housing_invoice_items table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS housing_invoice_items (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                invoice_id UUID NOT NULL REFERENCES housing_invoices(id) ON DELETE CASCADE,
                description TEXT NOT NULL,
                item_type housing_invoice_item_type NOT NULL,
                amount NUMERIC(10, 2) NOT NULL,
                quantity INTEGER DEFAULT 1,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);
        console.log('✅ housing_invoice_items table created\n');

        // Create housing_payments table
        console.log('Creating housing_payments table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS housing_payments (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                invoice_id UUID NOT NULL REFERENCES housing_invoices(id),
                student_id TEXT NOT NULL REFERENCES students(id),
                amount NUMERIC(10, 2) NOT NULL,
                currency TEXT NOT NULL DEFAULT 'CAD',
                status housing_payment_status NOT NULL DEFAULT 'PENDING',
                payment_method housing_payment_method NOT NULL,
                paygowire_transaction_id TEXT,
                paygowire_payment_url TEXT,
                billing_country TEXT,
                paid_at TIMESTAMPTZ,
                metadata JSONB DEFAULT '{}'::jsonb,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);
        console.log('✅ housing_payments table created\n');

        // Create housing_audit_logs table
        console.log('Creating housing_audit_logs table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS housing_audit_logs (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                action TEXT NOT NULL,
                performed_by UUID REFERENCES profiles(id),
                target_resource TEXT NOT NULL,
                target_id UUID,
                details JSONB,
                ip_address TEXT,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);
        console.log('✅ housing_audit_logs table created\n');

        console.log('✅ All missing housing tables created successfully!');
    } finally {
        await client.end();
    }
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});