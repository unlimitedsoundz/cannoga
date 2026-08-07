require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateSchoolImages() {
    const updates = [
        { slug: 'business', imageUrl: '/images/Business degree.jpg' },
        { slug: 'health-community', imageUrl: '/images/download (3).jpg' },
        { slug: 'science', imageUrl: '/images/download (4).jpg' },
        { slug: 'technology', imageUrl: '/images/informática.jpg' },
        { slug: 'transportation-aviation', imageUrl: '/images/Pilot vibe.jpg' },
        { slug: 'education-social-sciences', imageUrl: '/images/Social sciences, gender studies, American history.jpg' },
        { slug: 'hospitality-tourism', imageUrl: '/images/What a great presentation of food on our WASARA plates.jpg' }
    ];

    for (const item of updates) {
        console.log(`Updating School image for "${item.slug}" -> "${item.imageUrl}"`);
        const { error } = await supabase
            .from('School')
            .update({
                imageUrl: item.imageUrl,
                updatedAt: new Date().toISOString()
            })
            .eq('slug', item.slug);

        if (error) {
            console.error(`Error updating school "${item.slug}":`, error);
        } else {
            console.log(`Successfully updated school "${item.slug}".`);
        }
    }
}

updateSchoolImages();
