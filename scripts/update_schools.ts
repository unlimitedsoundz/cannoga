import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    process.exit(1);
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateSchoolDescriptions() {
    console.log('🔄 Updating school descriptions...');

    try {
        // Update School of Technology
        const { error: techError } = await supabase
            .from('School')
            .update({ description: 'Driving the development of next-generation systems and intelligent computing solutions.' })
            .eq('slug', 'technology');

        if (techError) throw techError;

        // Update School of Business
        const { error: businessError } = await supabase
            .from('School')
            .update({ 
                description: 'Cultivating leaders for market disruption and transformative business strategies.',
                slug: 'business'
            })
            .eq('slug', 'school-of-business');

        if (businessError) throw businessError;

        // Update School of Arts
        const { error: artsError } = await supabase
            .from('School')
            .update({ slug: 'arts' })
            .eq('slug', 'school-of-arts');

        if (artsError) throw artsError;

        console.log('✅ School descriptions and slugs updated successfully!');
    } catch (e) {
        console.error('❌ Update failed:', e);
        process.exit(1);
    }
}

updateSchoolDescriptions();