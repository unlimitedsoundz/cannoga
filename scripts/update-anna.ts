
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) { process.exit(1); }

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateFaculty() {
    // 1. Get Dept ID
    const { data: dept } = await supabase.from('Department').select('id').eq('slug', 'film-tv').single();
    if (!dept) {
        console.error('Department film-tv not found');
        return;
    }

    // 2. Upsert Anna
    const { data, error } = await supabase.from('Faculty').upsert({
        name: 'Anna Saaristo',
        role: 'Head of Film',
        bio: 'Award-winning director and educator specializing in sustainable production methods.',
        email: 'anna.saaristo@cannogacollege.ca',
        departmentId: dept.id,
    }, { onConflict: 'email' }).select(); // Assuming email might be unique, or we might need to query by name if no unique constraint on email.

    // If email constraint doesn't exist/work, try finding by name and updating
    if (error) {
        console.warn('Upsert by email failed (maybe no unique constraint?), trying update by name...');
        const { data: existing } = await supabase.from('Faculty').select('id').eq('name', 'Anna Saaristo').single();
        if (existing) {
            await supabase.from('Faculty').update({
                imageUrl: '/images/faculty/anna-saaristo.png',
                departmentId: dept.id,
                role: 'Head of Film'
            }).eq('id', existing.id);
            console.log('Updated existing Anna Saaristo');
        } else {
            await supabase.from('Faculty').insert({
                name: 'Anna Saaristo',
                role: 'Head of Film',
                bio: 'Award-winning director and educator specializing in sustainable production methods.',
                email: 'anna.saaristo@penkka.ac.fi',
                departmentId: dept.id,
                imageUrl: '/images/faculty/anna-saaristo.png'
            });
            console.log('Inserted new Anna Saaristo');
        }
    } else {
        console.log('Upsert successful:', data);
    }
}

updateFaculty();
