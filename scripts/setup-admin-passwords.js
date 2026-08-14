const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env file
try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                process.env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
            }
        });
        console.log('Loaded environment from .env');
    } else {
        console.warn('.env file not found, using existing environment variables');
    }
} catch (err) {
    console.error('Error loading .env file:', err.message);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdminPasswords() {
    const adminPassword = 'Chichichi21#';

    console.log('Fetching admin profiles...');
    const { data: profiles, error: fetchError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('role', 'ADMIN');

    if (fetchError) {
        console.error('Error fetching profiles:', fetchError);
        return;
    }

    console.log(`Found ${profiles.length} admin(s). Updating passwords...`);

    for (const profile of profiles) {
        console.log(`Updating password for: ${profile.email} (${profile.id})`);
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            profile.id,
            { password: adminPassword }
        );

        if (updateError) {
            console.error(`Failed to update ${profile.email}:`, updateError.message);
        } else {
            console.log(`Successfully updated ${profile.email}`);
        }
    }

    console.log('Finished updating admin passwords.');
}

setupAdminPasswords();
