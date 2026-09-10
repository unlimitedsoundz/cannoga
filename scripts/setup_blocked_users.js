const { Client } = require('pg');

const connectionString = 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';
const client = new Client({ connectionString });

async function main() {
  try {
    await client.connect();
    console.log("Connected to Postgres successfully.");

    await client.query(`
      CREATE TABLE IF NOT EXISTS public.blocked_users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT UNIQUE,
          first_name TEXT,
          last_name TEXT,
          passport_number TEXT,
          phone_number TEXT,
          contact_email TEXT,
          reason TEXT NOT NULL DEFAULT 'Permanent access restriction from cannogacollege.ca',
          blocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log("✅ Created public.blocked_users table");

    await client.query(`
      INSERT INTO public.blocked_users (email, first_name, last_name, passport_number, phone_number, contact_email, reason)
      VALUES
        ('quin6460@gmail.com', 'Lesiah', 'Quinlet', 'AA683276', '+237674384327', 'Gana@123gmail.com', 'Permanent access restriction'),
        ('goodychukwunonso@gmail.com', 'Goodness', 'Nwobodo', 'B03582897', '08031613747', 'nkemdilimlovina@gmail.com', 'Permanent access restriction'),
        ('empresschukwusimdi@gmail.com', 'Favour', 'Nwobodo', 'B03595146', '9168235852', 'Empresschukwusimdi@gmail.com', 'Permanent access restriction')
      ON CONFLICT (email) DO UPDATE SET
        passport_number = EXCLUDED.passport_number,
        phone_number = EXCLUDED.phone_number,
        contact_email = EXCLUDED.contact_email;
    `);
    console.log("✅ Seeded blocked_users records");

    // Also insert additional contact emails into blocked_users if any
    await client.query(`
      INSERT INTO public.blocked_users (email, reason)
      VALUES 
        ('nkemdilimlovina@gmail.com', 'Associated contact of restricted applicant'),
        ('gana@123gmail.com', 'Associated contact of restricted applicant')
      ON CONFLICT (email) DO NOTHING;
    `);
    console.log("✅ Seeded associated emails");

    // Function to prevent blocked users from being inserted into profiles
    await client.query(`
      CREATE OR REPLACE FUNCTION check_blocked_user_profile()
      RETURNS TRIGGER AS $$
      BEGIN
          IF EXISTS (
              SELECT 1 FROM public.blocked_users b
              WHERE (b.email IS NOT NULL AND LOWER(b.email) = LOWER(NEW.email))
                 OR (b.passport_number IS NOT NULL AND NEW.passport_number IS NOT NULL AND LOWER(b.passport_number) = LOWER(NEW.passport_number))
                 OR (b.contact_email IS NOT NULL AND NEW.contact_email IS NOT NULL AND LOWER(b.contact_email) = LOWER(NEW.contact_email))
          ) THEN
              RAISE EXCEPTION 'Access to cannogacollege.ca is permanently restricted for this user.';
          END IF;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS trg_check_blocked_user_profile ON public.profiles;
      CREATE TRIGGER trg_check_blocked_user_profile
      BEFORE INSERT OR UPDATE ON public.profiles
      FOR EACH ROW EXECUTE FUNCTION check_blocked_user_profile();
    `);
    console.log("✅ Created PostgreSQL trigger on profiles table");

    const rows = await client.query('SELECT * FROM public.blocked_users');
    console.log("Blocked users in database:", rows.rows);

  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await client.end();
  }
}

main();
