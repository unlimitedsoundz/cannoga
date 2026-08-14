
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing environment variables.');
    process.exit(1);
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
    console.log('🔄 Updating department name...');

    const { data, error } = await supabase
        .from('Department')
        .update({ name: 'Department of Business' })
        .eq('name', 'Department of Sustainable Management')
        .select();

    if (error) {
        console.error('❌ Failed to update department:', error);
    } else if (data && data.length > 0) {
        console.log('✅ Successfully updated department to:', data[0].name);
    } else {
        console.log('ℹ️ No department found with name "Department of Sustainable Management". It might have already been updated.');
        // Fallback: try updating by slug if name match failed (just in case)
        const { data: slugData, error: slugError } = await supabase
            .from('Department')
            .update({ name: 'Department of Business', slug: 'department-of-business' }) // optionally update slug too to be consistent
            .eq('slug', 'sustainable-management')
            .select();

        if (slugData && slugData.length > 0) {
            console.log('✅ Updated by slug fallback:', slugData[0].name);
        }
    }
}

main();
