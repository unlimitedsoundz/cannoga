require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateSchoolImages() {
    const updates = [
        { slug: 'business', imageUrl: '/images/school-of-business.jpg' },
        { slug: 'education-social-sciences', imageUrl: '/images/school-of-education-social-sciences.jpg' },
        { slug: 'health-community', imageUrl: '/images/school-of-health.jpg' },
        { slug: 'hospitality-tourism', imageUrl: '/images/school-of-hospitality.jpg' },
        { slug: 'science', imageUrl: '/images/school-of-science.jpg' },
        { slug: 'technology', imageUrl: '/images/school-of-technology.jpg' },
        { slug: 'transportation-aviation', imageUrl: '/images/school-of-transportation.jpg' },
        { slug: 'arts', imageUrl: '/images/school-of-arts.jpg' },
    ];

    for (const item of updates) {
        console.log(`Updating ${item.slug} -> ${item.imageUrl}`);
        const { error } = await supabase
            .from('School')
            .update({ imageUrl: item.imageUrl, updatedAt: new Date().toISOString() })
            .eq('slug', item.slug);

        if (error) {
            console.error(`Failed ${item.slug}:`, error.message);
        } else {
            console.log(`OK ${item.slug}`);
        }
    }
}

updateSchoolImages();
