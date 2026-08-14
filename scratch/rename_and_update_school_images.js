const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

const MAPPINGS = [
    {
        slug: 'arts',
        src: '🎨🥰😍.jpg',
        dest: 'school-of-arts.jpg'
    },
    {
        slug: 'business',
        src: 'Business degree.jpg',
        dest: 'school-of-business.jpg'
    },
    {
        slug: 'health-community',
        src: 'download (3).jpg',
        dest: 'school-of-health.jpg'
    },
    {
        slug: 'science',
        src: 'download (4).jpg',
        dest: 'school-of-science.jpg'
    },
    {
        slug: 'technology',
        src: 'informática.jpg',
        dest: 'school-of-technology.jpg'
    },
    {
        slug: 'transportation-aviation',
        src: 'Pilot vibe.jpg',
        dest: 'school-of-transportation.jpg'
    },
    {
        slug: 'education-social-sciences',
        src: 'Social sciences, gender studies, American history.jpg',
        dest: 'school-of-education-social-sciences.jpg'
    },
    {
        slug: 'hospitality-tourism',
        src: 'What a great presentation of food on our WASARA plates.jpg',
        dest: 'school-of-hospitality.jpg'
    }
];

async function run() {
    console.log("Renaming files in public/images/...");

    for (const item of MAPPINGS) {
        const srcPath = path.join(IMAGES_DIR, item.src);
        const destPath = path.join(IMAGES_DIR, item.dest);

        if (fs.existsSync(srcPath)) {
            console.log(`Renaming: "${item.src}" -> "${item.dest}"`);
            try {
                fs.renameSync(srcPath, destPath);
            } catch (err) {
                console.error(`Failed to rename file "${item.src}":`, err);
            }
        } else {
            console.log(`Source file does not exist: "${item.src}" (might already be renamed or missing)`);
        }

        // Verify if destination file exists
        if (fs.existsSync(destPath)) {
            const dbPath = `/images/${item.dest}`;
            console.log(`Updating DB for "${item.slug}" -> "${dbPath}"`);
            
            const { error } = await supabase
                .from('School')
                .update({
                    imageUrl: dbPath,
                    updatedAt: new Date().toISOString()
                })
                .eq('slug', item.slug);

            if (error) {
                console.error(`Failed to update DB for school "${item.slug}":`, error);
            } else {
                console.log(`Successfully updated DB for school "${item.slug}".`);
            }
        } else {
            console.error(`Destination file does not exist: "${destPath}". Skipping DB update.`);
        }
    }

    console.log("Done!");
}

run();
