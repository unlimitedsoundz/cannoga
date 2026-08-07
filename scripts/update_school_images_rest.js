const https = require('https');

const supabaseUrl = 'https://mrqzlmkdhzwvbpljikjz.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycXpsbWtkaHp3dmJwbGppa2p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTUxMjk4MywiZXhwIjoyMDg1MDg4OTgzfQ.u-SmDdYVmyHtwHBca95oJT6MHnZtzn8sWRDh5JJ1ibA';

const updates = [
    { slug: 'arts', imageUrl: '/images/school-arts.png' },
    { slug: 'business', imageUrl: '/images/school-business.png' },
    { slug: 'technology', imageUrl: '/images/school-technology.png' },
    { slug: 'science', imageUrl: '/images/school-science.png' },
    { slug: 'school-of-science', imageUrl: '/images/school-science.png' },
    { slug: 'school-of-technology', imageUrl: '/images/school-technology.png' }
];

async function updateSchool(slug, imageUrl) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ 'imageUrl': imageUrl });

        const options = {
            hostname: 'mrqzlmkdhzwvbpljikjz.supabase.co',
            port: 443,
            path: '/rest/v1/School?slug=eq.' + slug,
            method: 'PATCH',
            headers: {
                'apikey': serviceKey,
                'Authorization': 'Bearer ' + serviceKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            }
        };

        const req = https.request(options, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => {
                responseBody += chunk;
            });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log(`Updated ${slug} successfully.`);
                    resolve();
                } else {
                    console.error(`Failed to update ${slug}: ${res.statusCode} ${responseBody}`);
                    reject(new Error(`Failed to update ${slug}`));
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Problem with request for ${slug}: ${e.message}`);
            reject(e);
        });

        req.write(data);
        req.end();
    });
}

async function main() {
    for (const update of updates) {
        try {
            await updateSchool(update.slug, update.imageUrl);
        } catch (e) {
            console.error(e);
        }
    }
}

main();
