import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backupDir = path.join(path.resolve(__dirname, '..'), 'unused_images_backup');
const publicImagesDir = path.join(path.resolve(__dirname, '..'), 'public', 'images');

if (!fs.existsSync(backupDir)) {
    console.log('No backups found.');
    process.exit(0);
}

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });
    return arrayOfFiles;
}

const backedUpImages = getAllFiles(backupDir);
console.log(`Checking ${backedUpImages.length} images against database...`);

async function checkDatabase() {
    // Check common tables for image references (Case sensitive in Supabase sometimes)
    const tables = ['page_content', 'News', 'Event', 'blogs', 'school_departments', 'courses', 'programs', 'faculty'];
    
    for (const imagePath of backedUpImages) {
        const fileName = path.basename(imagePath);
        let found = false;

        for (const table of tables) {
            try {
                // Try searching in content, image_url, image fields depending on the table
                const { data, error } = await supabase
                    .from(table)
                    .select('*')
                    .limit(1);
                
                if (error) continue;
                
                const columns = data.length > 0 ? Object.keys(data[0]) : [];
                const searchColumns = columns.filter(col => ['content', 'image_url', 'image', 'imageUrl', 'thumbnail'].includes(col));
                
                if (searchColumns.length === 0) continue;

                const orQuery = searchColumns.map(col => `${col}.ilike.%${fileName}%`).join(',');
                
                const { data: searchResults } = await supabase
                    .from(table)
                    .select('*')
                    .or(orQuery);
                
                if (searchResults && searchResults.length > 0) {
                    console.log(`RESTORE: ${fileName} found in table ${table}`);
                    found = true;
                    break;
                }
            } catch (e) {
                // Ignore errors
            }
        }

        if (found) {
            const relPath = path.relative(backupDir, imagePath);
            const destPath = path.join(publicImagesDir, relPath);
            const destDir = path.dirname(destPath);
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }
            fs.renameSync(imagePath, destPath);
        }
    }
    console.log('Database check complete.');
}

checkDatabase();
