
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateLeo() {
    console.log('Updating Leo Mäkelä...');

    const imageUrl = '/images/faculty/leo-makela.jpg';
    const targetName = 'Leo Mäkelä';

    // First find the faculty member to confirm ID
    const { data: faculty, error: findError } = await supabase
        .from('Faculty')
        .select('*')
        .ilike('name', `%${targetName}%`);

    if (findError) {
        console.error('Error finding faculty:', findError);
        return;
    }

    if (!faculty || faculty.length === 0) {
        console.error(`No faculty found matching "${targetName}"`);
        return;
    }

    console.log(`Found ${faculty.length} matches. Updating:`, faculty.map(f => f.name).join(', '));

    for (const member of faculty) {
        const { error: updateError } = await supabase
            .from('Faculty')
            .update({ imageUrl: imageUrl })
            .eq('id', member.id);

        if (updateError) {
            console.error(`Error updating ${member.name}:`, updateError);
        } else {
            console.log(`✅ Successfully updated image for ${member.name}`);
        }
    }
}

updateLeo();
