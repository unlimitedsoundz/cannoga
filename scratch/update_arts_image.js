require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateArtsImage() {
    console.log('Updating School of Arts image to /images/🎨🥰😍.jpg...');
    const { error } = await supabase
        .from('School')
        .update({
            imageUrl: '/images/🎨🥰😍.jpg',
            updatedAt: new Date().toISOString()
        })
        .eq('slug', 'arts');

    if (error) {
        console.error('Error updating School of Arts:', error);
    } else {
        console.log('Successfully updated School of Arts.');
    }
}

updateArtsImage();
